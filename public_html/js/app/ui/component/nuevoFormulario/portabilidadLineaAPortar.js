import { portabilidadGtm } from ".././mixin/portabilidadGtm.js";

Vue.component("portabilidad-linea-a-portar", {
  updated: function () {
    var anchoDePantalla = document.body.clientWidth;
    var selects = document.querySelectorAll("select");
    if (anchoDePantalla <= 450) {
      for (var select of selects) {
        if (select.selectedIndex === -1) {
          select.selectedIndex = 0;
        }
        if (select.nextElementSibling) {
          select.nextElementSibling.style.display = "none";
        }
      }
    } else {
      for (var select of selects) {
        select.classList.remove("browser-default");
        M.FormSelect.init(select, null);
      }
    }
  },
  mixins: [portabilidadGtm],
  data: function () {
    return {
      esVisible: false,
      isAtrasHabilitado: true,
      isActivoBotonTengoChip: false,
      isActivoBotonDelivery: false,
      isActivoBotonRetiro: false,
      isLineaValida: false,
      isSolicitudChipValida: false,
      isPuntoRetiroValido: false,
      recaptchaResponse: null,
      ocultarBotonesEnvioChip: false,
      ocultarOpcionChip: true,
      botonDeshabilitado: false,
      linea: {
        numeroChip: null,
        solicitudChip: null,
        numeroLinea: null,
        operadora: null,
        plan: null,
      },
      // ofertas: null,
      codigoPromocional: null,
    };
  },
  props: {
    correspondePin: {
      type: Boolean,
      default: false,
    },
    esTesting: {
      type: Boolean,
      default: false,
    },
    esFormularioReferido: {
      type: Boolean,
      default: false,
    },
  },
  computed: {
    isSeleccionadaOpcionChip: function () {
      return this.isActivoBotonTengoChip || this.isActivoBotonDelivery || this.isActivoBotonRetiro;
    },
    isDatosLineaCompletos: function () {
      return this.linea.numeroLinea != null && this.linea.operadora != null && this.linea.plan != null;
    },
    isNumeroChipCompleto: function () {
      return this.linea.numeroChip !== null;
    },
    isDatosChipCompletos: function () {
      return this.isNumeroChipCompleto || this.linea.solicitudChip !== null;
    },
    isPasoValido: function () {
      return this.isLineaValida && this.isDatosChipCompletos;
    },
    isSiguienteHabilitado: function () {
      // if (
      //   this.isLineaValida &&
      //   this.isDatosChipCompletos &&
      //   this.isCaptchaCompleto
      // ) {
      //   this.mostrarOfertas();
      // }
      return (
        this.isLineaValida &&
        this.isDatosChipCompletos &&
        this.isCaptchaCompleto
      );
    },
    isCaptchaCompleto: function () {
      return this.esTesting || (this.recaptchaResponse !== null && this.recaptchaResponse !== "");
    },
    datosDelPaso: function () {
      return {
        linea: this.linea,
        recaptchaResponse: this.esTesting
          ? "captchaPasoTuLinea"
          : this.recaptchaResponse,
      };
    },
  },
  watch: {
    linea: {
      handler: function () {
        var self = this;
        if (this.isDatosLineaCompletos) {
          this.$validator.validate().then(function (valid) {
            if (valid) {
              self.isLineaValida = true;
            } else {
              self.isLineaValida = false;
            }
          });
        }
      },
      deep: true,
    },
    isPasoValido: {
      handler: function (val) {
        if (val) {
          this.activarRecaptchaInvisible();
        }
      },
    },
    "linea.operadora": {
      handler: function (val) {
        if (val !== "") {
          //Evento legacy conservado por instrucción de Tuenti
          tuenti.service.analytics.eventoOperadora(val);
          //Fin evento legacy

          // let codigoPromocional = tuenti.ui.views.utils.getParametroUrl("codigoPromocional");
          this.cambioOperadora(val);
          // if (!codigoPromocional && !this.esFormularioReferido) {
          //   this.ofertas = null;
          //   tuenti.service.ofertaSegmentada
          //     .buscarVigentes(val)
          //     .then((response) => {
          //       this.agregarOfertaSegmentada(response);
          //     })
          //     .catch((error) => console.log(error));
          // } else if (!codigoPromocional && this.esFormularioReferido) {
          //   tuenti.service.ofertaSegmentada
          //     .buscarVigentesParaReferidos()
          //     .then((response) => {
          //       this.$parent.actualizarCodigoPromocional(response.codigoPromocional);
          //     })
          //     .catch((error) => console.log(error));
          // }

          this.$emit("cambiar-operadora", val);
          if (this.linea.plan && this.linea.plan !== "") {
            this.dispararTrackEvent(this.linea.operadora, this.linea.plan);
          }
        }
      },
    },
    "linea.plan": {
      handler: function (val) {
        if (val !== "" && this.linea.operadora && this.linea.operadora !== "") {
          this.dispararTrackEvent(this.linea.operadora, this.linea.plan);
        }
      },
    },
    "linea.numeroChip": {
      handler: function (val) {
        if (!val || this.esNumeroChipValido(val)) {
          this.$emit("cambiar-numero-chip", val ? val : null);
        }
      },
    },
    isActivoBotonRetiro: {
      handler: function (estaActivo) {
        if (estaActivo) {
          this.dispararTrackEvent("seleccion chip", "RETIRA TU CHIP GRATIS");
        }
      },
    },
    isActivoBotonDelivery: {
      handler: function (estaActivo) {
        if (estaActivo) {
          this.dispararTrackEvent("seleccion chip", "TE LO MANDAMOS GRATIS");
        }
      },
    },
    isActivoBotonTengoChip: {
      handler: function (estaActivo) {
        if (estaActivo) {
          this.dispararTrackEvent("seleccion chip", "YA TENGO MI CHIP TUENTI");
        }
      },
    },
  },
  methods: {
    setEnvioChip: function (solicitud) {
      this.linea.solicitudChip = solicitud;
    },
    setPuntoRetiro: function (solicitud) {
      this.linea.solicitudChip = solicitud;
    },
    setNumeroChip: function (numeroChip) {
      this.linea.numeroChip = numeroChip;
    },
    restaurarCamposOpcionales: function () {
      this.ocultarOpcionChip = true;
      this.botonDeshabilitado = false;
      this.restaurarCamposOpcionalesParaAnimacion();
    },
    toggleSpinner: function () {
      this.$emit("toggle-spinner");
    },
    onCaptchaVerificado: function (recaptchaResponse) {
      this.recaptchaResponse = recaptchaResponse;
    },
    activarRecaptchaInvisible() {
      this.$refs.invisibleRecaptcha.execute();
    },
    resetRecaptchaInvisible() {
      this.$refs.invisibleRecaptcha.reset();
    },
    esNumeroChipValido(numeroChip) {
      return numeroChip.length === 19 && /^\d+$/.test(numeroChip) && numeroChip.startsWith("8954");
    },
    mostrarPaso: function () {
      this.esVisible = true;
    },
    ocultarPaso: function () {
      this.esVisible = false;
    },
    // mostrarOfertas() {
    //   if (this.ofertas && this.ofertas.length) {
    //     $("#modal-oferta").modal({
    //       dismissible: false,
    //     });
    //     $("#modal-oferta").modal("open");
    //   }
    // },
    // agregarOfertaSegmentada(response) {
    //   if(response.ofertas.length > 0) {
    //     this.ofertas = response.ofertas;
    //     this.$parent.actualizarCodigoPromocional(response.codigoPromocional);
    //   } else {
    //     this.$parent.actualizarCodigoPromocional(response.codigoPromocional);
    //   }
    // },
    seleccionarTengoChip() {
      this.botonDeshabilitado = true;
      this.ocultarOpcionChip = false;
      this.ocultarBotonesEnvioChip = true;
      setTimeout(() => this.isActivoBotonTengoChip = true, 1000);
    },
    seleccionarDelivery() {
      this.botonDeshabilitado = true;
      this.ocultarOpcionChip = false;
      this.ocultarBotonesEnvioChip = true;
      setTimeout(() => this.isActivoBotonDelivery = true, 1000);
    },
    seleccionarRetiro() {
      this.botonDeshabilitado = true;
      this.ocultarOpcionChip = false;
      this.ocultarBotonesEnvioChip = true;
      setTimeout(() => this.isActivoBotonRetiro = true, 1000);
    },
    datosDelPasoCompletosYValidos() {
      return this.isLineaValida && this.isDatosChipCompletos && this.isCaptchaCompleto;
    },
    restaurarCamposOpcionalesParaAnimacion() {
      setTimeout(() => {
        this.isActivoBotonTengoChip = false;
        this.isActivoBotonDelivery = false;
        this.isActivoBotonRetiro = false;
        this.linea.numeroChip = null;
        this.linea.solicitudChip = null;
        this.ocultarBotonesEnvioChip = false;
      }, 1000);
    },
    cambioOperadora(operadora) {
      this.$emit('cambiooperadora', operadora);
    }
  },
  components: {
    "vue-recaptcha": VueRecaptcha,
  },
  template: document.getElementById("pnt-template-portabilidad-linea-a-portar")
    .innerHTML,
});
