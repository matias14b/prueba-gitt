import { prevenirCambioFoco } from "./mixin/prevenirCambioFocoConTab.js";
import { portabilidadGtm } from "./mixin/portabilidadGtm.js";

const VALOR_CONTADOR_PIN = 30;
const PASO_INICIAL_FORMULARIO = 1;

Vue.component("portabilidad", {
  data: function () {
    return {
      nombreProducto: "Alta Portabilidad",
      step: PASO_INICIAL_FORMULARIO - 1,
      contadorPin: VALOR_CONTADOR_PIN,
      interval: null,
      stepper: null,
      stepperInstance: null,
      spinnerVisible: false,
      isCreadaConExito: false,
      showBanner: true,
      mensajeError:
        "Parece que hay un problema con el sistema. Volvé a intentarlo más tarde.",
      gaPasoTusDatos: true,
      gaPasoTuLinea: true,
      gaPasoTusFotos: true,
      gaPasoTuFirma: true,
      gaPasoBienvenido: true,
      esFormularioReferido: false,
      esTesting: false,
      tipoDeTyp: "tieneChip",
      state: {
        portabilidad: {
          cliente: {},
          operadora: null,
          numeroChip: null,
          solicitudChip: null
        },
        dniFrente: {},
        dniDorso: {},
        gRecaptchaResponse: "",
        firmaDigital: "",
        portabilidadId: null,
        token: "",
        prePortabilidadToken: null
      }
    };
  },
  mixins: [prevenirCambioFoco, portabilidadGtm],
  computed: {
    correspondePin: function () {
      return (
        this.state.portabilidad.operadora !== null &&
        this.state.portabilidad.operadora.toUpperCase() !== "MOVISTAR" &&
        this.state.portabilidad.numeroChip !== null
      );
    }
  },
  methods: {
    siguienteStep: function (datosDelPaso) {
      switch (this.step) {
        case 0:
          this.confirmarPasoTusDatos(datosDelPaso);
          break;
        case 1:
          this.confirmarPasoTuLinea(datosDelPaso);
          break;
        case 2:
          this.confirmarPasoDni(datosDelPaso);
          if (this.correspondePin) {
            this.interval =
              this.interval || setInterval(this.decrementarContador, 1000);
          }
          break;
        case 3:
          this.confirmarPasoFirma(datosDelPaso);
          break;
      }
      if (this.step !== 3) {
        this.avanzarStep();
      }
    },
    atrasStep: function () {
      this.step = this.step - 1;
    },
    parsearFecha: function (fecha) {
      return fecha
        .split("/")
        .reverse()
        .join("-");
    },
    enviarPortabilidad: function () {
      var self = this;
      var state = this.state;

      self.toggleSpinner();

      var formData = new FormData();
      var porta = self.adecuarObjetoParaPost(state.portabilidad);
      var nombreArchivoDniFrente = "dniFrente.png";
      var nombreArchivoDniDorso = "dniDorso.png";

      Promise.all([
        tuenti.ui.views.utils.comprimirImagen(
          state.dniFrente,
          nombreArchivoDniFrente
        ),
        tuenti.ui.views.utils.comprimirImagen(
          state.dniDorso,
          nombreArchivoDniDorso
        )
      ]).then(response => {
        response.forEach(function (file) {
          if (file.name === nombreArchivoDniFrente) {
            formData.append("dniFrente", file);
          }

          if (file.name === nombreArchivoDniDorso) {
            formData.append("dniDorso", file);
          }
        });

        formData.append("gRecaptchaResponse", state.gRecaptchaResponse);
        formData.append(
          "portabilidad",
          new Blob([JSON.stringify(porta)], { type: "application/json" })
        );
        formData.append("firmaDigital", state.firmaDigital);

        tuenti.service.portabilidad
          .guardar(formData)
          .then(function (respuesta) {
            $(".pnt-stepper-porta").addClass("pnt-card-typ");
            self.isCreadaConExito = true;
            state.portabilidad.id = respuesta.data.id;
            state.token = respuesta.data.token;
            self.dispararEventoPaginaVirtual("/portabilidad/paso5/gracias");
            self.dispararEventoTrackTransaction(
              self.nombreProducto,
              state.portabilidad
            );
          })
          .catch(function (respuesta) {
            self.isCreadaConExito = false;
            self.mensajeError = respuesta.response.data
              ? respuesta.response.data
              : self.mensajeError;
            self.dispararEventoPaginaVirtual("/portabilidad/paso5/error");
            self.dispararTrackEvent(
              "error",
              self.mensajeError
            );
          })
          .then(function () {
            self.toggleSpinner();
            self.avanzarStep();
          });
      });
    },
    adecuarObjetoParaPost(objeto) {
      var objetoAdecuado = {};
      for (var [clave, valor] of Object.entries(objeto)) {
        var valorAdecuado = {};
        //Ponemos como null strings vacíos, undefined y nulos
        if (!valor || valor.toString().length === 0) {
          valorAdecuado = null;
          //Dar formato a fechas perdiendo su reactividad
        } else if (clave.startsWith("fecha")) {
          valorAdecuado = JSON.parse(JSON.stringify(valor))
            .split("/")
            .reverse()
            .join("-");
          //Si son objetos, llamar recursivamente a esta función
        } else if (typeof valor === "object") {
          valorAdecuado = this.adecuarObjetoParaPost(valor);
          //Si no es ninguno de los anteriores, dejar el valor tal cual viene
        } else {
          valorAdecuado = valor;
        }
        objetoAdecuado[clave] = valorAdecuado;
      }
      return objetoAdecuado;
    },
    avanzarStep: function () {
      this.step = this.step + 1;
      this.stepperInstance.openStep(this.step, this.stepper);

      //Evento legacy conservado por instrucción de Tuenti
      if (this.step === 4) {
        tuenti.service.analytics.eventoNoInteractivo(
          "TUENTI_portabilidad",
          "Portabilidad",
          "click",
          "bienvenido-a-tuenti",
          this.state.portabilidad.id
        );
      }
      //Fin evento legacy
    },
    toggleSpinner: function () {
      this.spinnerVisible = !this.spinnerVisible;
    },
    guardarPrePortabilidad: function () {
      var state = this.state;

      var prePortabilidad = this.adecuarObjetoParaPost(state.portabilidad);

      tuenti.service.prePortabilidad
        .guardar(prePortabilidad)
        .then(function (respuesta) {
          state.prePortabilidadToken = respuesta.data.token;
        })
        .catch(function (respuesta) {
          console.log("Error al guardar preportabilidad");
        });
    },
    modificarPrePortabilidad: function () {
      var state = this.state;

      var prePortabilidadToken = state.prePortabilidadToken;

      var prePortabilidad = this.adecuarObjetoParaPost(state.portabilidad);

      prePortabilidad.token = prePortabilidadToken;
      prePortabilidad.usuarioCreacion = {id: 1};

      tuenti.service.prePortabilidad
        .modificar(prePortabilidad)
        .catch(function () {
          console.log("Error al actualizar preportabilidad");
        });
    },
    confirmarPasoTusDatos: function (portabilidad) {
      this.dispararTrackEvent("Formulario | 1", "Siguiente");

      var state = this.state;

      state.portabilidad.cliente = portabilidad.cliente;
      state.portabilidad.codigoPromocional = portabilidad.codigoPromocional;
      state.portabilidad.tienePromocion = portabilidad.tienePromocion;
      state.portabilidad.codigoReferido = portabilidad.codigoReferido;
      state.portabilidad.codigoReferidoHabilitado =
        portabilidad.codigoReferidoHabilitado;

      var prePortabilidadToken = state.prePortabilidadToken;

      if (prePortabilidadToken) {
        this.modificarPrePortabilidad();
      } else {
        this.guardarPrePortabilidad();
      }

      //Evento legacy conservado por instrucción de Tuenti
      tuenti.service.analytics.eventoNoInteractivo(
        "TUENTI_portabilidad",
        "Portabilidad",
        "click",
        "tus-datos"
      );
      //Fin evento legacy

      this.dispararEventoPaginaVirtual("/portabilidad/paso2/linea-actual");
      this.dispararEventoCheckoutView(
        2,
        this.nombreProducto
      );

    },
    confirmarPasoTuLinea: function (datosDelPaso) {
      this.dispararTrackEvent("Formulario | 2", "Siguiente");

      var state = this.state;

      if(!state.portabilidad.codigoPromocional) {
        state.portabilidad.codigoPromocional = datosDelPaso.codigoPromocional;
      }

      if (
        this.correspondePin &&
        (state.portabilidad.numeroLinea == null ||
          datosDelPaso.linea.numeroLinea != state.portabilidad.numeroLinea)
      ) {
        clearInterval(this.interval);
        this.interval = null;
        this.contadorPin = VALOR_CONTADOR_PIN;
        tuenti.service.pin.enviar(
          datosDelPaso.linea.numeroLinea,
          datosDelPaso.recaptchaResponse
        )
          .then(function () {
            let fechaActual = new Date();
            let dd = String(fechaActual.getDate()).padStart(2, '0');
            let mm = String(fechaActual.getMonth() + 1).padStart(2, '0');
            let yyyy = fechaActual.getFullYear();
            state.portabilidad.fechaCreacionPin = yyyy + '-' + mm + "-" + dd;
          })
          .catch(function (error) {
            console.log(error)
          });
      }

      for (let key in datosDelPaso.linea) {
        state.portabilidad[key] = datosDelPaso.linea[key];
      }

      if (state.portabilidad.solicitudChip && state.portabilidad.solicitudChip.envioChip && state.portabilidad.solicitudChip.envioChip.localidad.nombre) {
        delete state.portabilidad.solicitudChip.envioChip.localidad.nombre;
      }

      state.gRecaptchaResponse = datosDelPaso.recaptchaResponse;

      this.modificarPrePortabilidad();

      //Eventos legacy conservados por instrucción de Tuenti
      tuenti.service.analytics.eventoNoInteractivo(
        "TUENTI_portabilidad",
        "Portabilidad",
        "click",
        "tu-linea"
      );
      if (datosDelPaso.linea.numeroChip) {
        tuenti.service.analytics.eventoNoInteractivo(
          "tarjetaSIM",
          "boton-sim",
          "click",
          "pin"
        );
      } else if (datosDelPaso.linea.solicitudChip && datosDelPaso.linea.solicitudChip.pedidoPuntoRetiroChip) {
        this.tipoDeTyp = "retiro";
        tuenti.service.analytics.eventoNoInteractivo(
          "retiro",
          "boton-retiro",
          "click",
          "retiro"
        );
      } else if (datosDelPaso.linea.solicitudChip && datosDelPaso.linea.solicitudChip.envioChip) {
        this.tipoDeTyp = "delivery";
        tuenti.service.analytics.eventoNoInteractivo(
          "delivery",
          "boton-delivery",
          "click",
          "delivery"
        );
      }
      //Fin eventos legacy

      this.dispararEventoPaginaVirtual("/portabilidad/paso3/foto-documento");
      this.dispararEventoCheckoutView(
        3,
        this.nombreProducto,
        state.portabilidad
      );
    },
    confirmarPasoDni: function (datosDni) {
      this.dispararTrackEvent("Formulario | 3", "Siguiente");

      var state = this.state;

      state.dniFrente = datosDni.frente;
      state.dniDorso = datosDni.dorso;

      //Evento legacy conservado por instrucción de Tuenti
      tuenti.service.analytics.eventoNoInteractivo(
        "TUENTI_portabilidad",
        "Portabilidad",
        "click",
        "tus-fotos"
      );
      //Fin evento legacy

      this.dispararEventoPaginaVirtual("/portabilidad/paso4/firma-digital");
      this.dispararEventoCheckoutView(
        4,
        this.nombreProducto,
        state.portabilidad
      );
    },
    confirmarPasoFirma: function (datosDelPaso) {
      this.dispararTrackEvent("Formulario | 4", "¡Listo!");

      var state = this.state;

      state.firmaDigital = datosDelPaso.firma;
      state.portabilidad.numeroPin = datosDelPaso.portabilidad.numeroPin;
      state.portabilidad.fechaVencimientoPin =
        datosDelPaso.portabilidad.fechaVencimientoPin;
      state.gRecaptchaResponse = datosDelPaso.recaptchaResponse;

      this.enviarPortabilidad();

      //Evento legacy conservado por instrucción de Tuenti
      tuenti.service.analytics.eventoNoInteractivo(
        "TUENTI_portabilidad",
        "Portabilidad",
        "click",
        "solo-nos-falta-tu-firma"
      );
      //Fin evento legacy

    },
    guardarRecaptchaResponse: function (tokenRecaptcha) {
      var state = this.state;

      state.gRecaptchaResponse = tokenRecaptcha;
    },
    decrementarContador: function () {
      if (this.contadorPin > 0) {
        this.contadorPin--;
      } else {
        clearInterval(this.interval);
        this.interval = null;
      }
    },
    cambiarOperadora: function (operadora) {
      this.state.portabilidad.operadora = operadora;
    },
    cambiarNumeroChip: function (numeroChip) {
      this.state.portabilidad.numeroChip = numeroChip;
    },
    actualizarCodigoPromocional: function (nuevoCodigoPromocional) {
      if (!this.state.portabilidad.codigoPromocional) {
        this.state.portabilidad.codigoPromocional = nuevoCodigoPromocional;
      }
    }
  },
  mounted: function () {
    var dataComponente = this;
    dataComponente.stepper = document.querySelector(".stepper");
    dataComponente.stepperInstance = new MStepper(dataComponente.stepper, {
      firstActive: this.step,
      stepTitleNavigation: false
    });

    var selects = document.querySelectorAll("select");

    var anchoDePantalla = document.body.clientWidth;
    if (anchoDePantalla > 450) {
      for (var select of selects) {
        select.classList.remove("browser-default");
        M.FormSelect.init(select, null);
      }
    }
    this.dispararEventoPaginaVirtual("/portabilidad/paso1/datos-titular");
    this.dispararEventoCheckoutView(1, this.nombreProducto);
  },
  created: function () {
    this.showBanner = !tuenti.ui.views.utils.getParametroUrl("showBanner");
    this.esTesting = tuenti.ui.views.utils.getParametroUrl("testing") === 'true' && !window.location.href.includes(".tuenti.com.ar");
    this.nombreProducto = tuenti.ui.views.utils.getParametroUrl("producto") || "Alta Portabilidad";
    this.esFormularioReferido = window.location.href.includes("invita");
  },
  template: document.getElementById("pnt-template-portabilidad").innerHTML
});
