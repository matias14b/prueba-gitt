eventoInstalacion = null;

tuenti.ui.views.autogestion = (function () {
  const tabsAutogestion = {
    TRAMITE: ".pnt-js-navbar-con-iconos li:nth-child(1)",
    MIS_DATOS: ".pnt-js-navbar-con-iconos li:nth-child(2)",
    ENVIO: ".pnt-js-navbar-con-iconos li:nth-child(3)",
    PUNTO_DE_RETIRO: ".pnt-js-navbar-con-iconos li:nth-child(4)",
  };

  var portabilidadToken;
  var pedidoInfoToken;
  var nuevaLineaToken;
  var datosPortabilidad;
  var datosNuevaLinea;
  var signaturePad;
  var escanerCodigoBarras;
  var estaEscaneando = false;
  var estaVideoEncendido = false;
  const $tabsContainer = $(".pnt-js-navbar-con-iconos");
  const $spinner = $(".pnt-js-contenedor-spinner");
  const $cardPedidoNumeroChip = $(".pnt-js-contenedor-card-pedido-numero-chip");
  const $cardPedidoNumeroPin = $(".pnt-js-contenedor-card-pedido-numero-pin");
  const $cardPedidoDniFirma = $(".pnt-js-contenedor-card-pedido-dni-firma");
  const $cardPedidoFirmaDatosSensibles = $(
    ".pnt-js-contenedor-card-pedido-firma"
  );
  const $cardEstadoPorta = $(".pnt-js-card-notificacion-estado-porta");
  const $cardIconosProgreso = $(".pnt-js-card-progressbar-tramite");
  const $cardLoginPortabilidad = $(
    ".pnt-js-contenedor-card-login-portabilidad"
  );
  const $cardLoginNuevaLinea = $(".pnt-js-contenedor-card-login-nuevo-chip");
  const $cardLoginSeleccion = $(".pnt-js-contenedor-card-login-seleccion");
  const $cardTeneEnCuenta = $(".pnt-js-tene-en-cuenta");
  const $cardPreguntasFrecuentes = $(".pnt-js-preguntas-frecuentes");
  const $cardInterlinking = $(".pnt-js-interlinking");
  const enlacesARedesSociales = $(".pnt-js-enlace-redes-sociales");
  const $mensajeEstadoPorta = $(".pnt-js-mensaje-estado-porta");
  const $mensajeInformacionTramite = $(".pnt-js-mensaje-informacion-tramite");
  const $contenedorBotonInstalacion = $(".pnt-js-contenedor-boton-instalacion");
  const $botonInstalacionApp = $(".pnt-js-boton-instalacion-app");
  const $botonVolverArriba = $(".pnt-js-boton-volver-arriba");
  const limiteMostrarBotonVolverArriba = 200;
  const $notificacionInstalacionApp = $(".pnt-js-notificacion-instalacion-app");
  const utils = tuenti.ui.views.utils;
  const DIAS_PREVIOS_ENVIO_PREPARANDO = 2;
  const DIAS_PREVIOS_ENVIO_EN_TRANSITO = 6;

  function init(estaServiceWorkerCargado) {
    inicializarComponentesMaterialize();
    inicializarFormulario();
    inicializarInputNumeroChip();
    crearValidadoresDeParsley();
    inicializarPlegablePreguntasFrecuentes();
    inicializarBotonVolverArriba();
    if (estaServiceWorkerCargado) {
      inicializarPwa();
    } else {
      ocultarBotonInstalacionPwa();
    }
  }

  function inicializarBotonVolverArriba() {
    $botonVolverArriba.click(volverArriba);
    document.addEventListener("scroll", () => {
      if (
        distanciaLimiteSuperiorPaginaHastaLimiteContenidoVisible() >
        limiteMostrarBotonVolverArriba
      ) {
        $botonVolverArriba.removeClass("hide");
      } else {
        $botonVolverArriba.addClass("hide");
      }
    });

    function volverArriba() {
      document.body.scrollIntoView({
        behavior: "smooth",
      });
    }

    function distanciaLimiteSuperiorPaginaHastaLimiteContenidoVisible() {
      return document.documentElement.scrollTop || document.body.scrollTop;
    }
  }

  function inicializarPlegablePreguntasFrecuentes() {
    $(document).ready(function () {
      $(".collapsible").collapsible();
    });
  }

  function inicializarPwa() {
    bindearEventosInstalacion();
    buscarManifest();
  }

  function buscarManifest() {
    if (portabilidadToken) {
      $("<link>", {
        rel: "manifest",
        href:
          tuenti.service.utils.url() +
          "/api/autogestion/portabilidades/" +
          portabilidadToken +
          "/manifest",
      }).appendTo("head");
    }
  }

  function bindearEventosInstalacion() {
    ocultarBotonInstalacionPwa();
    $contenedorBotonInstalacion.removeClass("pnt-jquery-faded-out");

    $botonInstalacionApp.on("click", (evento) => {
      evento.preventDefault();
      $contenedorBotonInstalacion.addClass("pnt-jquery-faded-out");
      eventoInstalacion.prompt();
    });
    $(".pnt-js-boton-cerrar-mensaje-flotante").on("click", (evento) => {
      evento.preventDefault();
      $notificacionInstalacionApp.hide();
      volverBotonSemiTransparente();
    });
  }

  function ocultarBotonInstalacionPwa() {
    $botonInstalacionApp.hide();
    $notificacionInstalacionApp.hide();
  }

  function mostrarBotonInstalacion() {
    if (
      obtenerParametroToken() &&
      esNavegadorChromeOEdge() &&
      !esDisplayStandalone()
    ) {
      const duracionMensaje = 10000;
      setTimeout(() => {
        $botonInstalacionApp.fadeIn(100);
        $notificacionInstalacionApp
          .fadeIn(100)
          .delay(duracionMensaje)
          .fadeOut(600, volverBotonSemiTransparente);
        comenzarContadorCierreMensaje(duracionMensaje);
      }, 1000);
    }
  }

  function esNavegadorChromeOEdge() {
    return navigator.userAgent.search("Chrome") >= 0;
  }

  function esDisplayStandalone() {
    return window.matchMedia("(display-mode: standalone)").matches;
  }

  function volverBotonSemiTransparente() {
    $botonInstalacionApp.addClass("pnt-semi-transparente");
  }

  function comenzarContadorCierreMensaje(duracionTotal) {
    let $barraProgreso = $(".pnt-js-barra-progreso-mensaje-flotante");
    let duracionIntervalo = 100;
    let tiempoIntervaloActivo = 0;
    let porcentajeActual = 0;

    let intervalo = setInterval(() => {
      tiempoIntervaloActivo += duracionIntervalo;
      if (tiempoIntervaloActivo > duracionTotal) {
        clearInterval(intervalo);
        return;
      }
      porcentajeActual = Math.round(
        (tiempoIntervaloActivo * 100) / duracionTotal
      );
      $barraProgreso.width(porcentajeActual.toString().concat("%"));
    }, duracionIntervalo);
  }

  function inicializarEscaneoChip(selectorCard) {
    escanerCodigoBarras = new ZXing.BrowserBarcodeReader();
    var idDispositivoSeleccionado;

    escanerCodigoBarras
      .getVideoInputDevices()
      .then((dispositivosDeVideo) => {
        if (dispositivosDeVideo.length > 0) {
          idDispositivoSeleccionado =
            dispositivosDeVideo.length > 1
              ? dispositivosDeVideo[1].deviceId
              : dispositivosDeVideo[0].deviceId;

          $(selectorCard + " .pnt-js-boton-ingresar-numero-chip-escaneo").on(
            "click",
            function () {
              $spinner.removeClass("hide");
              estaEscaneando = true;
              setTimeout(function () {
                if (!estaVideoEncendido && estaEscaneando) {
                  $spinner.addClass("hide");
                  utils.mostrarToast(
                    "No se pudo acceder a la cámara, probá permitiendo el acceso o ingresalo manualmente",
                    "pnt-toast-error"
                  );
                }
              }, 3000);
              escanerCodigoBarras
                .decodeOnceFromVideoDevice(idDispositivoSeleccionado, "video")
                .then((result) => {
                  var numeroChipEscaneado = result.text;
                  if (
                    numeroChipEscaneado.startsWith("8954") &&
                    numeroChipEscaneado.length === 19
                  ) {
                    cerrarVideo(numeroChipEscaneado);
                  }
                })
                .catch(() => {
                  if (estaEscaneando) {
                    utils.mostrarToast(
                      "Error al escanear, por favor ingresá el chip manualmente",
                      "pnt-toast-error"
                    );
                    $spinner.addClass("hide");
                    cerrarVideo();
                  }
                });
            }
          );
        } else {
          ocultarEscaneoChip();
        }
      })
      .catch(() => {
        ocultarEscaneoChip();
      });
  }

  function cerrarVideo(numeroChipEscaneado) {
    $(".pnt-js-input-numero-chip").removeClass("hide");
    $(".pnt-js-contenedor-enviar-numero-chip").removeClass("hide");
    $(".pnt-js-ingreso-numero-chip-escaneo").addClass("hide");
    estaEscaneando = false;
    estaVideoEncendido = false;
    escanerCodigoBarras.reset();
    if (numeroChipEscaneado) {
      $(".pnt-js-label-input-numero-chip").addClass("active");
      $("#pnt-js-input-numero-chip").val(numeroChipEscaneado);
      $("#pnt-js-input-numero-chip").attr("disabled", true);
      $("#pnt-js-input-numero-chip").addClass("pnt-input-numero-chip-bold");
      utils.mostrarToast("Código escaneado correctamente", "pnt-toast-success");
      location.href = "#imagen-numero-chip";
    }
  }

  function crearValidadoresDeParsley() {
    window.Parsley.addValidator("imgDniMaxSize", {
      validateString: function (_value, maxSize, parsleyInstance) {
        var files = parsleyInstance.$element[0].files;
        return files.length != 1 || files[0].size <= maxSize * 1024 * 1024;
      },
      requirementType: "integer",
      messages: {
        es: "La imagen no puede pesar más de 5 MB.",
      },
    });
    window.Parsley.addValidator("imgDniFileType", {
      validateString: function (pathDeImagen, ext1, ext2, ext3) {
        var extension = pathDeImagen.substring(
          pathDeImagen.lastIndexOf(".") + 1,
          pathDeImagen.length
        );
        if (ext1 === extension || ext2 === extension || ext3 === extension) {
          return true;
        }
        return false;
      },
      requirementType: ["string", "string", "string"],
      messages: {
        es: "El formato de la imagen debe ser PNG, JPG o JPEG.",
      },
    });
  }

  function inicializarPadFirma(selectorCard) {
    deshabilitarBotonVolverAFirmar(selectorCard);
    var ratio = Math.max(window.devicePixelRatio || 1, 1);
    var canvas = document.querySelector(selectorCard + " .pnt-js-pad-firma");
    canvas.getContext("2d").scale(ratio, ratio);
    canvas.height = 185;

    if ($(window).width() <= 420) {
      canvas.width = 165;
    } else {
      canvas.width = 300;
    }

    signaturePad = new SignaturePad(canvas, {
      throttle: 0,
      minWidth: 0.7,
      maxWidth: 0.9,
      velocityFilterWeight: 0.1,
      onEnd: function () {
        habilitarBotonVolverAFirmar(selectorCard);
        $(selectorCard + " .pnt-js-mensaje-error-validacion-firma").addClass(
          "hide"
        );
      },
    });
  }

  function habilitarBotonVolverAFirmar(selectorCard) {
    $(selectorCard + " .pnt-js-volver-a-firmar").attr("disabled", false);
  }

  function deshabilitarBotonVolverAFirmar(selectorCard) {
    $(selectorCard + " .pnt-js-volver-a-firmar").attr("disabled", true);
  }

  function cargarDatosCliente(datosCliente) {
    $("#pnt-tab-datos-content #pnt-js-input-nombre").val(datosCliente.nombre);
    $("#pnt-tab-datos-content #pnt-js-input-apellido").val(
      datosCliente.apellido
    );
    if (datosCliente.dniTitular) {
      $("#pnt-tab-datos-content #pnt-js-input-dni").val(
        datosCliente.dniTitular
      );
      $("#pnt-tab-datos-content #pnt-js-input-nacimiento").val(
        utils.convertirAFechaArgentina(datosCliente.fechaNacimiento)
      );
    } else {
      $("#pnt-tab-datos-content #pnt-js-input-dni").closest(".row").hide();
    }
    $("#pnt-tab-datos-content #pnt-js-input-email").val(datosCliente.email);
    $("#pnt-tab-datos-content label").addClass("active");
    $("#pnt-tab-datos-content").removeClass("hide");
  }

  function inicializarComponentesMaterialize() {
    inicializarTabs();
    $(".tooltipped").tooltip();
    utils.inicializarDatePicker($(".datepicker"), new Date());
  }

  function inicializarTabs() {
    $(".tabs").tabs();
  }

  function inicializarFormulario() {
    portabilidadToken = obtenerParametroToken();
    nuevaLineaToken = tuenti.ui.views.utils.getParametroUrl("nuevaLineaToken");
    if (portabilidadToken) {
      inicializarPaginaConTokenPortabilidad(portabilidadToken);
    } else if (nuevaLineaToken) {
      inicializarPaginaConTokenNuevaLinea(nuevaLineaToken);
    } else {
      inicializarLoginSeleccion();
    }
  }

  function obtenerParametroToken() {
    return tuenti.ui.views.utils.getParametroUrl("portabilidadToken");
  }

  function inicializarPaginaConTokenPortabilidad(token) {
    $spinner.removeClass("hide");
    tuenti.service.autogestion
      .obtenerDatosPortabilidadPorToken(token)
      .done(cargarInformacionPortabilidad)
      .fail(function (xhr) {
        utils.loguearError(xhr);
        if (xhr.status === 500 || xhr.status === 0) {
          mostrarMensajeErrorServidor();
        } else {
          var mensajeToast = "¡Ups! " + xhr.responseText;
          utils.mostrarToast(mensajeToast, "pnt-toast-error");
          inicializarLoginSeleccion();
        }
      })
      .always(function () {
        $spinner.addClass("hide");
        mostrarRecomendacionesSobreProductos();
      });
  }

  function inicializarPaginaConTokenNuevaLinea(token) {
    $spinner.removeClass("hide");
    tuenti.service.autogestion
      .obtenerDatosNuevaLineaPorToken(token)
      .done(cargarInformacionNuevaLinea)
      .fail(function (xhr) {
        utils.loguearError(xhr);
        if (xhr.status === 500 || xhr.status === 0) {
          mostrarMensajeErrorServidor();
        } else {
          var mensajeToast = "¡Ups! " + xhr.responseText;
          utils.mostrarToast(mensajeToast, "pnt-toast-error");
          inicializarLoginSeleccion();
        }
      })
      .always(function () {
        $spinner.addClass("hide");
        mostrarRecomendacionesSobreProductos();
      });
  }

  function mostrarRecomendacionesSobreProductos() {
    utils.ocultarFadeOut($tabsContainer);
    utils.mostrarFadeIn($cardTeneEnCuenta);
    utils.mostrarFadeIn($cardPreguntasFrecuentes);
    utils.mostrarFadeIn($cardInterlinking);
    utils.mostrarFadeIn(enlacesARedesSociales);
  }

  function inicializarPaginaPortabilidad() {
    var nombre = datosPortabilidad.cliente.nombre;
    var linea = datosPortabilidad.numeroLinea;
    var pedidosInfo = datosPortabilidad.pedidos;
    var operadora = datosPortabilidad.operadora.toString().toUpperCase();

    cargarDatosCliente(datosPortabilidad.cliente);
    mostrarTabEnviosSiCorresponde(
      datosPortabilidad.solicitudChip,
      datosPortabilidad.encomienda
    );
    mostrarTabPuntoDeRetiroSiCorresponde(datosPortabilidad.solicitudChip);
    inicializarBarraProgreso();

    utils.mostrarFadeIn($tabsContainer);
    $("#pnt-tab-tramite-content .pnt-tab-container").removeClass(
      "pnt-tab-container-mobile-sin-tabs"
    );
    inicializarTabs();

    switch (datosPortabilidad.estado.toString().toUpperCase()) {
      case "ABIERTA":
      case "REABIERTA":
        $mensajeEstadoPorta.text(
          nombre +
            ", estamos trabajando en la portabilidad de tu línea " +
            utils.formatearNumeroTelefonico(linea)
        );
        if (
          pedidosInfo.length > 0 &&
          (pedidosInfo[0].tipoInformacion !== "DATOS_PIN" ||
            operadora !== "MOVISTAR") &&
          (pedidosInfo[0].tipoInformacion !== "DATOS_CHIP" ||
            datosPortabilidad.numeroChip === null)
        ) {
          utils.mostrarFadeIn($(".pnt-js-estado-tramite-barra-progreso"));
          inicializarPedidosInfo();
        }
        $mensajeInformacionTramite.html(datosPortabilidad.mensajeEstado);
        break;
      case "ERROR":
        $mensajeEstadoPorta.text(
          nombre +
            ", estamos teniendo algunos problemas el cambio de tu operadora actual a Tuenti, por favor esperanos 24 horas."
        );
        $mensajeInformacionTramite.hide();
        break;
      case "CANCELADA":
        if (datosPortabilidad.mensajeEstado.includes("Fraude")) {
          datosPortabilidad.mensajeEstado =
            datosPortabilidad.mensajeEstado.replace(
              "Fraude",
              "Documentación inconsistente"
            );
        }
        $mensajeEstadoPorta.text(nombre + ", tu portabilidad fue cancelada.");
        $mensajeInformacionTramite.text(datosPortabilidad.mensajeEstado);
        break;
      case "CERRADA":
        $mensajeEstadoPorta.text("¡" + nombre + ", ya sos Tuenti!");
        $mensajeInformacionTramite.text(datosPortabilidad.mensajeEstado);
    }

    utils.mostrarFadeIn($cardEstadoPorta);
    utils.mostrarFadeIn($cardIconosProgreso);

    tuenti.service.analytics.autogestionPortabilidadBuscar();
  }

  function inicializarPaginaNuevaLinea() {
    cargarDatosCliente(datosNuevaLinea.cliente);
    mostrarTabEnviosSiCorresponde(
      datosNuevaLinea.solicitudChip,
      datosNuevaLinea.encomienda
    );
    mostrarTabPuntoDeRetiroSiCorresponde(datosNuevaLinea.solicitudChip);
    ocultarTabEstadoTramitePortabilidad();
    if (
      datosNuevaLinea.solicitudChip &&
      datosNuevaLinea.solicitudChip.envioChip
    ) {
      $(tabsAutogestion.ENVIO).children("a").addClass("active");
    } else {
      var mensajeToast = "¡Ups! " + xhr.responseText;
      utils.mostrarToast(mensajeToast, "pnt-toast-error");
      inicializarLoginSeleccion();
    }
  }

  function inicializarLoginSeleccion() {
    utils.mostrarFadeIn($cardLoginSeleccion);
    mostrarRecomendacionesSobreProductos();
    $(".pnt-js-boton-login-seleccion-portabilidad").on(
      "click",
      function (evento) {
        evento.preventDefault();
        inicializarLoginPortabilidad();
        tuenti.service.analytics.autogestionDatosLogin();
      }
    );
    $(".pnt-js-boton-login-seleccion-nuevo-chip").on(
      "click",
      function (evento) {
        evento.preventDefault();
        inicializarLoginNuevaLinea();
        tuenti.service.analytics.autogestionDatosLogin();
      }
    );
  }

  function inicializarLoginNuevaLinea() {
    utils.ocultarFadeOut($cardLoginSeleccion);
    setTimeout(function () {
      utils.mostrarFadeIn($cardLoginNuevaLinea);
    }, 450);
    $(".pnt-js-login-nuevo-chip-submit").on("click", function (evento) {
      evento.preventDefault();
      enviarDatosLoginNuevaLinea();
    });
  }

  function cargarInformacionPortabilidad(respuestaServicio) {
    datosPortabilidad = respuestaServicio;
    bindearSubmit();
    $(".pnt-js-titulo").addClass("hide");
    inicializarPaginaPortabilidad();
    corregirPaddingTabContainer();
    //Inicializar lógica de PWA
    if (portabilidadToken) {
      tuenti.service.notificacionesPwa.init(portabilidadToken);
    }
  }

  function cargarInformacionNuevaLinea(respuestaServicio) {
    datosNuevaLinea = respuestaServicio;
    $(".pnt-js-titulo").addClass("hide");
    inicializarPaginaNuevaLinea();
    corregirPaddingTabContainer();
    tuenti.service.analytics.autogestionLineaNuevaBuscar();
  }

  function corregirPaddingTabContainer() {
    $(".pnt-js-tab-container").removeClass("pnt-tab-container-login");
  }

  function mostrarMensajeErrorServidor() {
    utils.mostrarFadeIn($cardEstadoPorta);
    mostrarMensaje(
      "¡Ups! Parece que hubo un problema",
      "Parece que hay un problema con el sistema. Intentá de nuevo más tarde."
    );
  }

  function inicializarLoginPortabilidad() {
    utils.ocultarFadeOut($cardLoginSeleccion);
    setTimeout(function () {
      utils.mostrarFadeIn($cardLoginPortabilidad);
    }, 450);
    $(".pnt-js-login-portabilidad-submit").on("click", function (evento) {
      evento.preventDefault();
      enviarDatosLoginPortabilidad();
    });
  }

  function enviarDatosLoginPortabilidad() {
    if ($("#pnt-js-login-portabilidad").parsley().validate()) {
      utils.ocultarFadeOut($cardLoginPortabilidad);
      $spinner.removeClass("hide");
      var numeroLinea = $("#pnt-js-input-portabilidad-numero-linea").val();
      var dni = $("#pnt-js-input-portabilidad-dni").val();
      var captchaResponse = grecaptcha.getResponse(0);
      tuenti.service.autogestion
        .obtenerDatosPortabilidadPorNumeroLineaYDni(
          numeroLinea,
          dni,
          captchaResponse
        )
        .done(cargarInformacionPortabilidad)
        .fail(function (xhr) {
          utils.loguearError(xhr);
          if (xhr.status === 500 || xhr.status === 0) {
            mostrarMensajeErrorServidor();
          } else {
            var mensajeToast = "¡Ups! " + xhr.responseText;
            if (xhr.status === 404) {
              mensajeToast =
                'Pssst, ¡todavía no cargaste tus datos! Para hacer tu portabilidad a Tuenti, dejá tus datos&nbsp;<a href="https://portabilidad.tuenti.com.ar" target="_blank">acá</a>.&nbsp;El resto, lo hacemos nosotros.';
            }
            setTimeout(function () {
              utils.mostrarToast(mensajeToast, "pnt-toast-error");
              utils.mostrarFadeIn($cardLoginPortabilidad);
              reiniciarFormularioLogin($cardLoginPortabilidad);
            }, 1000);
          }
        })
        .always(function () {
          $spinner.addClass("hide");
        });
    }
  }

  function enviarDatosLoginNuevaLinea() {
    if ($("#pnt-js-login-nuevo-chip").parsley().validate()) {
      utils.ocultarFadeOut($cardLoginNuevaLinea);
      $spinner.removeClass("hide");
      var id = $("#pnt-js-input-nuevo-chip-id").val();
      var email = $("#pnt-js-input-nuevo-chip-email").val();
      var captchaResponse = grecaptcha.getResponse(1);
      tuenti.service.autogestion
        .obtenerDatosNuevaLineaPorIdYEmail(id, email, captchaResponse)
        .done(cargarInformacionNuevaLinea)
        .fail(function (xhr) {
          utils.loguearError(xhr);
          if (xhr.status === 500 || xhr.status === 0) {
            mostrarMensajeErrorServidor();
          } else {
            var mensajeToast = "¡Ups! " + xhr.responseText;
            if (xhr.status === 404) {
              mensajeToast =
                'Pssst, ¡todavía no pediste tu chip! Si querés que te lo mandemos GRATIS, dejá tus datos&nbsp;<a href="https://pedituchip.tuenti.com.ar" target="_blank">acá</a>';
            }
            setTimeout(function () {
              utils.mostrarToast(mensajeToast, "pnt-toast-error");
              utils.mostrarFadeIn($cardLoginNuevaLinea);
              reiniciarFormularioLogin($cardLoginNuevaLinea);
            }, 1000);
          }
        })
        .always(function () {
          $spinner.addClass("hide");
        });
    }
  }

  function reiniciarFormularioLogin($login) {
    $login.find("input").each(function (index, input) {
      input.value = "";
    });
    $login.parsley().reset();
    grecaptcha.reset(0);
    grecaptcha.reset(1);
  }

  function inicializarPaginaNuevaLinea() {
    cargarDatosCliente(datosNuevaLinea.cliente);
    mostrarTabEnviosSiCorresponde(
      datosNuevaLinea.solicitudChip,
      datosNuevaLinea.encomienda
    );
    mostrarTabPuntoDeRetiroSiCorresponde(datosNuevaLinea.solicitudChip);
    ocultarTabEstadoTramitePortabilidad();
    if (
      datosNuevaLinea.solicitudChip &&
      datosNuevaLinea.solicitudChip.envioChip
    ) {
      $(tabsAutogestion.ENVIO).children("a").addClass("active");
    } else {
      $(tabsAutogestion.PUNTO_DE_RETIRO).children("a").addClass("active");
    }

    utils.mostrarFadeIn($tabsContainer);
    $("#pnt-tab-tramite-content .pnt-tab-container").removeClass(
      "pnt-tab-container-mobile-sin-tabs"
    );
    inicializarTabs();
  }

  function ocultarTabEstadoTramitePortabilidad() {
    $(tabsAutogestion.TRAMITE).addClass("hide");
    $(tabsAutogestion.TRAMITE).children("a").removeClass("active");
  }

  function mostrarTabEnviosSiCorresponde(solicitudChip, encomienda) {
    if (solicitudChip && solicitudChip.envioChip) {
      $(tabsAutogestion.ENVIO).removeClass("hide");
      inicializarTabs();

      $("#pnt-tab-envio-content").removeClass("hide");

      if (encomienda) {
        cargarBarraDeProgresoEnvioConEncomienda(encomienda);
        mostrarInformacionEncomienda(encomienda);
      } else {
        var fechaEnvio = solicitudChip.envioChip.fechaEnvioChip;
        var diasRestantes;
        if (fechaEnvio) {
          diasRestantes = calcularDiasRestantesEnvio(fechaEnvio);
        }

        cargarBarraDeProgresoEnvioYMensajeDeEnvio(fechaEnvio, diasRestantes);
      }
      cargarDatosEnvio(solicitudChip.envioChip);
    }
  }

  function mostrarInformacionEncomienda(encomienda) {
    var mensajeEnvio = encomienda.estado.descripcion;
    var codigoEnvio = encomienda.estado.codigo;
    if (
      codigoEnvio === "ERROR_ENTREGA" ||
      codigoEnvio === "ERROR_DATOS_INVALIDOS" ||
      codigoEnvio === "ESTADO_DESCONOCIDO"
    ) {
      mensajeEnvio = mensajeEnvio
        .toString()
        .concat(
          ' Si querés pedirlo de vuelta, hacelo <a href="https://pedituchip.tuenti.com.ar/?utm_source=web&utm_medium=landingestado&utm_campaign=errorentrega" target="_blank">acá</a>.'
        );
    }
    if (codigoEnvio === "CANCELADA") {
      mensajeEnvio = mensajeEnvio
        .toString()
        .concat(
          ' Si querés pedirlo de vuelta, hacelo <a href="https://pedituchip.tuenti.com.ar/?utm_source=web&utm_medium=landingestado&utm_campaign=cancelado" target="_blank">acá</a>.'
        );
    }
    $(".pnt-js-mensaje-envio-encomienda").html(mensajeEnvio);
  }

  function mostrarTabPuntoDeRetiroSiCorresponde(solicitudChip) {
    if (
      solicitudChip &&
      solicitudChip.pedidoPuntoRetiroChip &&
      solicitudChip.pedidoPuntoRetiroChip.puntoRetiroChip
    ) {
      $(tabsAutogestion.PUNTO_DE_RETIRO).removeClass("hide");
      inicializarTabs();

      $("#pnt-tab-pdr-content").removeClass("hide");

      cargarDatosPuntoDeRetiro(
        solicitudChip.pedidoPuntoRetiroChip.puntoRetiroChip
      );
    }
  }

  function cargarDatosPuntoDeRetiro(puntoRetiroChip) {
    $("#pnt-tab-pdr-content #pnt-js-input-nombre-pdr").val(
      puntoRetiroChip.nombre
    );
    $("#pnt-tab-pdr-content #pnt-js-input-direccion").val(
      puntoRetiroChip.direccion
    );
    $("#pnt-tab-pdr-content #pnt-js-input-email").val(
      puntoRetiroChip.email ? puntoRetiroChip.email : "-"
    );
    $("#pnt-tab-pdr-content #pnt-js-input-horario").val(
      puntoRetiroChip.horario ? puntoRetiroChip.horario : "-"
    );
    $("#pnt-tab-pdr-content #pnt-js-input-localidad").val(
      puntoRetiroChip.localidad.nombre +
        ", " +
        puntoRetiroChip.localidad.provincia.nombre
    );
    $("#pnt-tab-pdr-content #pnt-js-input-telefono").val(
      puntoRetiroChip.telefono ? puntoRetiroChip.telefono : "-"
    );
    $("#pnt-tab-pdr-content label").addClass("active");
  }

  function cargarDatosEnvio(envioChip) {
    $("#pnt-tab-envio-content #pnt-js-input-calle").val(envioChip.calle);
    $("#pnt-tab-envio-content #pnt-js-input-altura").val(envioChip.altura);
    $("#pnt-tab-envio-content #pnt-js-input-localidad").val(
      envioChip.localidad.nombre
    );
    $("#pnt-tab-envio-content #pnt-js-input-codigo-postal").val(
      envioChip.localidad.codigoPostal
    );
    $("#pnt-tab-envio-content #pnt-js-input-provincia").val(
      envioChip.localidad.provincia.nombre
    );
    $("#pnt-tab-envio-content label").addClass("active");

    if (envioChip.departamento) {
      $("#pnt-tab-envio-content #pnt-js-input-departamento").val(
        envioChip.departamento
      );
    }
    if (envioChip.piso) {
      $("#pnt-tab-envio-content #pnt-js-input-piso").val(envioChip.piso);
    }
    if (envioChip.observaciones) {
      $("#pnt-tab-envio-content #pnt-js-input-observaciones").val(
        envioChip.observaciones
      );
      M.textareaAutoResize(
        $("#pnt-tab-envio-content #pnt-js-input-observaciones")
      );
    }
  }

  function calcularDiasRestantesEnvio(fechaEnvio) {
    var fechaHoy = new Date();
    var fechaInicioEnvio = new Date(fechaEnvio);
    var diasRestantes = parseInt(
      (fechaHoy - fechaInicioEnvio) / (1000 * 60 * 60 * 24)
    );
    return diasRestantes;
  }

  function cargarBarraDeProgresoEnvioYMensajeDeEnvio(
    fechaEnvio,
    diasRestantes
  ) {
    if (fechaEnvio) {
      if (diasRestantes < DIAS_PREVIOS_ENVIO_PREPARANDO) {
        $(".pnt-js-pendiente").addClass("active");
        $(".pnt-js-preparando").addClass("actual");
        $(".pnt-js-mensaje-envio-encomienda").text(
          "¡Estamos preparando tu envío!"
        );
      } else if (diasRestantes < DIAS_PREVIOS_ENVIO_EN_TRANSITO) {
        $(".pnt-js-pendiente").addClass("active");
        $(".pnt-js-preparando").addClass("active");
        $(".pnt-js-viajando").addClass("actual");
        $(".pnt-js-mensaje-envio-encomienda").text(
          "¡El chip ya está en camino!"
        );
      } else {
        $(".pnt-js-pendiente").addClass("active");
        $(".pnt-js-preparando").addClass("active");
        $(".pnt-js-viajando").addClass("active");
        $(".pnt-js-entregado").addClass("active");
        $(".pnt-js-mensaje-envio-encomienda").text(
          "¡El chip ya llego a su destino!"
        );
      }
    } else {
      $(".pnt-js-pendiente").addClass("actual");
      $(".pnt-js-mensaje-envio-encomienda").text(
        "¡Estamos procesando tu envío!"
      );
    }
  }

  function cargarBarraDeProgresoEnvioConEncomienda(encomienda) {
    if (encomienda.estado.codigo === "PENDIENTE") {
      $(".pnt-js-pendiente").addClass("actual");
    } else if (encomienda.estado.codigo === "EN_PROCESO") {
      $(".pnt-js-pendiente").addClass("active");
      $(".pnt-js-preparando").addClass("actual");
    } else if (encomienda.estado.codigo === "EN_CAMINO") {
      $(".pnt-js-pendiente").addClass("active");
      $(".pnt-js-preparando").addClass("active");
      $(".pnt-js-viajando").addClass("actual");
    } else if (encomienda.estado.codigo === "ENTREGADA") {
      $(".pnt-js-pendiente").addClass("active");
      $(".pnt-js-preparando").addClass("active");
      $(".pnt-js-viajando").addClass("active");
      $(".pnt-js-entregado").addClass("active");
    } else if (encomienda.estado.codigo === "CANCELADA") {
      $(".pnt-js-pendiente").addClass("active");
      $(".pnt-js-preparando").addClass("actual");
      $(".pnt-js-preparando")
        .removeClass("pnt-icon-preparando")
        .addClass("pnt-icon-cancelado");
      $(".pnt-js-preparando").text("Cancelado");
    } else if (encomienda.estado.codigo === "ERROR_ENTREGA") {
      $(".pnt-js-pendiente").addClass("active");
      $(".pnt-js-preparando").addClass("active");
      $(".pnt-js-viajando").addClass("active");
      $(".pnt-js-entregado").addClass("actual");
      $(".pnt-js-entregado")
        .removeClass("pnt-icon-entregado")
        .addClass("pnt-icon-error");
      $(".pnt-js-entregado").text("Error");
    } else if (encomienda.estado.codigo === "ERROR_DATOS_INVALIDOS") {
      $(".pnt-js-pendiente").addClass("active");
      $(".pnt-js-preparando").addClass("actual");
      $(".pnt-js-preparando")
        .removeClass("pnt-icon-preparando")
        .addClass("pnt-icon-error");
      $(".pnt-js-preparando").text("Error");
    }
  }

  function inicializarPedidosInfo() {
    var pedido = datosPortabilidad.pedidos[0];
    pedidoInfoToken = pedido.token;
    var tipoInformacion = pedido.tipoInformacion;

    switch (tipoInformacion) {
      case "DATOS_FOTOS_ADJUNTOS":
        prepararCardDniFirma();
        utils.mostrarFadeIn($cardPedidoDniFirma);
        $(".pnt-js-estado-tramite-dni")
          .removeClass("active")
          .addClass("actual")
          .addClass("pnt-icon-error")
          .removeClass("pnt-icon-dni");
        break;
      case "DATOS_SENSIBLES":
        $mensajeInformacionTramite.text(
          "Hubo un cambio en tus datos sensibles y necesitamos que los confirmes con tu firma."
        );
        prepararCardFirmaDatosSensibles();
        utils.mostrarFadeIn($cardPedidoFirmaDatosSensibles);
        $(".pnt-js-estado-tramite-dni")
          .removeClass("active")
          .addClass("actual")
          .addClass("pnt-icon-error")
          .removeClass("pnt-icon-dni");
        break;
      case "DATOS_CHIP":
        prepararCardIngresoNumeroChip();
        utils.mostrarFadeIn($cardPedidoNumeroChip);
        $(".pnt-js-estado-tramite-chip")
          .removeClass("active")
          .addClass("actual")
          .addClass("pnt-icon-error")
          .removeClass("pnt-icon-chip");
        break;
      case "DATOS_PIN":
        utils.mostrarFadeIn($cardPedidoNumeroPin);
        $(".pnt-js-estado-tramite-pin")
          .removeClass("active")
          .addClass("actual")
          .addClass("pnt-icon-error")
          .removeClass("pnt-icon-pin");
        break;
    }
  }

  function prepararCardDniFirma() {
    var selectorCard = ".pnt-js-contenedor-card-pedido-dni-firma";
    inicializarPadFirma(selectorCard);
    bindearBotonVolverAFirmar(selectorCard);
    bindearBotonesSubirDni();
    bindearInputsDeDni();
  }

  function prepararCardFirmaDatosSensibles() {
    var selectorCard = ".pnt-js-contenedor-card-pedido-firma";
    inicializarPadFirma(selectorCard);
    bindearBotonVolverAFirmar(selectorCard);
    cargarDatosSensibles();
  }

  function prepararCardIngresoNumeroChip() {
    var selectorCard = ".pnt-js-contenedor-card-pedido-numero-chip";
    if (esDispositivoMovil()) {
      inicializarEscaneoChip(selectorCard);
      bindearEventosIngresoEscaneoChip(selectorCard);
    } else {
      ocultarEscaneoChip();
    }
  }

  function ocultarEscaneoChip() {
    $(".pnt-js-contenedor-boton-ingresar-numero-chip-escaneo").addClass("hide");
    $(".pnt-js-boton-ingresar-numero-chip-manual").addClass("hide");
    $(".pnt-js-contenedor-enviar-numero-chip").removeClass("hide");
    $(".pnt-js-input-numero-chip").removeClass("hide");
  }

  function cargarDatosSensibles() {
    $(
      ".pnt-js-contenedor-card-pedido-firma #pnt-js-input-numero-linea-sensibles"
    ).val(datosPortabilidad.numeroLinea);
    $(
      ".pnt-js-contenedor-card-pedido-firma #pnt-js-input-nombre-sensibles"
    ).val(datosPortabilidad.cliente.nombre);
    $(
      ".pnt-js-contenedor-card-pedido-firma #pnt-js-input-apellido-sensibles"
    ).val(datosPortabilidad.cliente.apellido);
    $(
      ".pnt-js-contenedor-card-pedido-firma #pnt-js-input-nacimiento-sensibles"
    ).val(
      utils.convertirAFechaArgentina(datosPortabilidad.cliente.fechaNacimiento)
    );
    $(".pnt-js-contenedor-card-pedido-firma #pnt-js-input-dni-sensibles").val(
      datosPortabilidad.cliente.dniTitular
    );
    $(".pnt-js-contenedor-card-pedido-firma #pnt-js-input-email-sensibles").val(
      datosPortabilidad.cliente.email
    );
    $(
      ".pnt-js-contenedor-card-pedido-firma #pnt-js-input-proveedor-sensibles"
    ).val(datosPortabilidad.operadora);
    $(".pnt-js-contenedor-card-pedido-firma #pnt-js-input-plan-sensibles").val(
      datosPortabilidad.plan
    );
    $(".pnt-js-contenedor-card-pedido-firma label").addClass("active");
  }

  function bindearBotonesSubirDni() {
    $(".pnt-js-boton-subir-frente-dni").on("click", function () {
      $(".pnt-js-input-frente-dni").click();
    });
    $(".pnt-js-boton-subir-dorso-dni").on("click", function () {
      $(".pnt-js-input-dorso-dni").click();
    });
  }

  function bindearInputsDeDni() {
    $(".pnt-js-input-frente-dni").on("change", function () {
      if (this.files.length === 0) {
        $(".pnt-js-boton-subir-frente-dni")
          .find("i")
          .text("picture_in_picture");
      } else {
        $(".pnt-js-boton-subir-frente-dni").find("i").text("check");
        $("#form-dni-firma").parsley().validate("dniFrente");
      }
    });
    $(".pnt-js-input-dorso-dni").on("change", function () {
      if (this.files.length === 0) {
        $(".pnt-js-boton-subir-dorso-dni")
          .find("i")
          .text("picture_in_picture_alt");
      } else {
        $(".pnt-js-boton-subir-dorso-dni").find("i").text("check");
        $("#form-dni-firma").parsley().validate("dniDorso");
      }
    });
  }

  function inicializarBarraProgreso() {
    if (datosPortabilidad.operadora.toString().toUpperCase() === "MOVISTAR") {
      $(".pnt-js-estado-tramite-pin").hide();
      $(".pnt-progressbar-tramite").addClass(
        "pnt-progressbar-tramite-movistar"
      );
    } else {
      if (datosPortabilidad.numeroPin) {
        $(".pnt-js-estado-tramite-pin").addClass("active");
      }
    }
    if (datosPortabilidad.numeroChip) {
      $(".pnt-js-estado-tramite-chip").addClass("active");
    }
    if (!datosPortabilidad.documentacionIncompleta) {
      $(".pnt-js-estado-tramite-dni").addClass("active");
    }
  }

  function bindearSubmit() {
    $("#pnt-js-envio-info-numero-chip").on("submit", function (evento) {
      evento.preventDefault();
      enviarDatosDeChip();
    });
    $(".pnt-js-autogestion-enviar-numero-chip").on("click", function (evento) {
      evento.preventDefault();
      enviarDatosDeChip();
      tuenti.service.analytics.autogestionPortabilidadEnviarChip();
    });
    $("#pnt-js-envio-info-numero-pin").on("submit", function (evento) {
      evento.preventDefault();
      enviarDatosPin();
    });
    $(".pnt-js-autogestion-enviar-numero-pin").on("click", function (evento) {
      evento.preventDefault();
      enviarDatosPin();
    });
    $(".pnt-js-autogestion-enviar-dni-firma").on("click", function (evento) {
      evento.preventDefault();
      var isDniValido = $("#form-dni-firma").parsley().validate();
      var isFirmaValida = validarFirma(
        ".pnt-js-contenedor-card-pedido-dni-firma"
      );
      if (isFirmaValida && isDniValido) {
        enviarDatosDeDniYFirma();
      }
    });
    $(".pnt-js-autogestion-enviar-firma").on("click", function (evento) {
      evento.preventDefault();
      var isFirmaValida = validarFirma(".pnt-js-contenedor-card-pedido-firma");
      if (isFirmaValida) {
        enviarFirma();
      }
    });
  }

  function validarFirma(selectorCard) {
    if (signaturePad && !signaturePad.isEmpty()) {
      $(selectorCard + " .pnt-js-mensaje-error-validacion-firma").addClass(
        "hide"
      );
      return true;
    }
    $(selectorCard + " .pnt-js-mensaje-error-validacion-firma").removeClass(
      "hide"
    );
    return false;
  }

  function enviarDatosDeChip() {
    if ($("#pnt-js-envio-info-numero-chip").parsley().validate()) {
      $spinner.removeClass("hide");
      var numeroChip = $("#pnt-js-input-numero-chip").val();
      tuenti.service.envioInfoCliente
        .enviarChip(pedidoInfoToken, numeroChip)
        .done(function () {
          utils.ocultarFadeOut($cardPedidoNumeroChip);
          mostrarMensaje(
            "¡Ya falta menos para que seas Tuenti!",
            "¡Gracias! Recibimos tu número de chip correctamente."
          );
          $(".pnt-js-estado-tramite-chip")
            .removeClass("actual")
            .addClass("active");
          pasarASiguientePedidoSiCorresponde();
        })
        .fail(function (xhr) {
          utils.loguearError(xhr);
          mostrarMensaje(
            "¡Ups! Parece que hubo un problema",
            "No pudimos recibir tu número de chip correctamente. Esperá unos minutos e intentá de nuevo."
          );
        })
        .always(function () {
          $spinner.addClass("hide");
        });
    }
  }

  function enviarFirma() {
    $spinner.removeClass("hide");
    var firma = signaturePad.toDataURL();
    tuenti.service.envioInfoCliente
      .enviarFirma(pedidoInfoToken, firma)
      .done(function () {
        utils.ocultarFadeOut($cardPedidoFirmaDatosSensibles);
        mostrarMensaje(
          "¡Ya falta menos para que seas Tuenti!",
          "¡Gracias! Recibimos tu firma correctamente."
        );
        $(".pnt-js-estado-tramite-dni")
          .removeClass("actual")
          .addClass("active");
        pasarASiguientePedidoSiCorresponde();
      })
      .fail(function (xhr) {
        utils.loguearError(xhr);
        mostrarMensaje(
          "¡Ups! Parece que hubo un problema",
          "No pudimos recibir tu firma correctamente. Esperá unos minutos e intentá de nuevo."
        );
      })
      .always(function () {
        $spinner.addClass("hide");
      });
  }

  function enviarDatosDeDniYFirma() {
    $spinner.removeClass("hide");
    var firma = signaturePad.toDataURL();
    var dniFrente = $(".pnt-js-input-frente-dni")[0].files[0];
    var dniDorso = $(".pnt-js-input-dorso-dni")[0].files[0];
    var nombreArchivoDniFrente = "dniFrente.png";
    var nombreArchivoDniDorso = "dniDorso.png";

    Promise.all([
      tuenti.ui.views.utils.comprimirImagen(dniFrente, nombreArchivoDniFrente),
      tuenti.ui.views.utils.comprimirImagen(dniDorso, nombreArchivoDniDorso),
    ])
      .then((response) => {
        response.forEach(function (file) {
          if (file.name === nombreArchivoDniFrente) {
            dniFrente = file;
          }
          if (file.name === nombreArchivoDniDorso) {
            dniDorso = file;
          }
        });

        tuenti.service.envioInfoCliente
          .enviarFirmaYAdjuntos(pedidoInfoToken, firma, dniFrente, dniDorso)
          .done(function () {
            $spinner.addClass("hide");
            utils.ocultarFadeOut($cardPedidoDniFirma);
            mostrarMensaje(
              "¡Ya falta menos para que seas Tuenti!",
              "¡Gracias! Recibimos las fotos de tu DNI y tu firma correctamente."
            );
            $(".pnt-js-estado-tramite-dni")
              .removeClass("actual")
              .addClass("active");
            pasarASiguientePedidoSiCorresponde();
          })
          .fail(function (xhr) {
            $spinner.addClass("hide");
            utils.loguearError(xhr);
            mostrarMensaje(
              "¡Ups! Parece que hubo un problema",
              "No pudimos recibir las fotos de tu DNI y tu firma correctamente. Esperá unos minutos e intentá de nuevo."
            );
            $(window).scrollTop(0);
          });
      })
      .catch(function () {
        $spinner.addClass("hide");
        mostrarMensaje(
          "¡Ups! Parece que hubo un problema",
          "No pudimos recibir las fotos de tu DNI y tu firma correctamente. Esperá unos minutos e intentá de nuevo."
        );
        $(window).scrollTop(0);
      });
  }

  function bindearBotonVolverAFirmar(selectorCard) {
    $(selectorCard + " .pnt-js-volver-a-firmar").off("click");
    $(selectorCard + " .pnt-js-volver-a-firmar").on("click", function () {
      signaturePad.clear();
      deshabilitarBotonVolverAFirmar(selectorCard);
    });
  }

  function bindearEventosIngresoEscaneoChip(selectorCard) {
    $("#video").on("play", function () {
      setTimeout(function () {
        $spinner.addClass("hide");
        $(".pnt-js-ingreso-numero-chip-escaneo").removeClass("hide");
        $(".pnt-js-boton-ingresar-numero-chip-manual").removeClass("hide");
        $(".pnt-js-contenedor-boton-ingresar-numero-chip-escaneo").addClass(
          "hide"
        );
        $(".pnt-js-contenedor-enviar-numero-chip").addClass("hide");
        $(".pnt-js-input-numero-chip").addClass("hide");
        location.href = "#imagen-numero-chip";
        estaVideoEncendido = true;
      }, 300);
    });
    $(selectorCard + " .pnt-js-boton-ingresar-numero-chip-manual").on(
      "click",
      function () {
        $(".pnt-js-contenedor-boton-ingresar-numero-chip-escaneo").removeClass(
          "hide"
        );
        $("#pnt-js-input-numero-chip").attr("disabled", false);
        $("#pnt-js-input-numero-chip").removeClass(
          "pnt-input-numero-chip-bold"
        );
        $(".pnt-js-boton-ingresar-numero-chip-manual").addClass("hide");
        cerrarVideo();
      }
    );
    $(document).on("visibilitychange", function () {
      if (estaEscaneando) {
        $(".pnt-js-contenedor-boton-ingresar-numero-chip-escaneo").removeClass(
          "hide"
        );
        $(".pnt-js-input-numero-chip").addClass("hide");
        $(".pnt-js-ingreso-numero-chip-escaneo").addClass("hide");
        estaEscaneando = false;
        escanerCodigoBarras.reset();
      }
    });
  }

  function esDispositivoMovil() {
    return window.innerWidth <= 768 && window.innerHeight <= 1024;
  }

  function enviarDatosPin() {
    if ($("#pnt-js-envio-info-numero-pin").parsley().validate()) {
      $spinner.removeClass("hide");
      var numeroPin = $("#inputNumPin").val();
      var fechaVencimiento = $("#inputFechaVencPin").val();

      tuenti.service.envioInfoCliente
        .enviarPin(pedidoInfoToken, numeroPin, fechaVencimiento)
        .done(function () {
          utils.ocultarFadeOut($cardPedidoNumeroPin);
          mostrarMensaje(
            "¡Ya falta menos para que seas Tuenti!",
            "¡Gracias! Recibimos tu número de pin correctamente."
          );
          $(".pnt-js-estado-tramite-pin")
            .removeClass("actual")
            .addClass("active");
          pasarASiguientePedidoSiCorresponde();
        })
        .fail(function (xhr) {
          utils.loguearError(xhr);
          mostrarMensaje(
            "¡Ups! Parece que hubo un problema",
            "No pudimos recibir tu número de pin correctamente. Esperá unos minutos e intentá de nuevo."
          );
        })
        .always(function () {
          $spinner.addClass("hide");
        });
    }
  }

  function pasarASiguientePedidoSiCorresponde() {
    if (datosPortabilidad.pedidos.length > 1) {
      datosPortabilidad.pedidos.splice(0, 1);
      inicializarPedidosInfo();
      $(".pnt-js-mensaje-informacion-tramite-adicional").removeClass("hide");
    } else {
      datosPortabilidad.pedidos = null;
      $(".pnt-js-mensaje-informacion-tramite-adicional").addClass("hide");
    }
  }

  function mostrarMensaje(titulo, mensaje) {
    $mensajeInformacionTramite.fadeOut(200);
    $mensajeEstadoPorta.fadeOut(200, function () {
      $mensajeEstadoPorta.text(titulo).fadeIn(200);
      $mensajeInformacionTramite.text(mensaje).fadeIn(200);
    });
  }

  function inicializarInputNumeroChip() {
    $("#pnt-js-input-numero-chip").val("8954");
    $(".pnt-js-label-input-numero-chip").addClass("active");
  }

  return {
    init: init,
    mostrarBotonInstalacion: mostrarBotonInstalacion,
  };
})();

self.addEventListener("serviceWorkerCargado", () => {
  let estaServiceWorkerCargado = true;
  tuenti.ui.views.autogestion.init(estaServiceWorkerCargado);
});

self.addEventListener("serviceWorkerNoCargado", () => {
  let estaServiceWorkerCargado = false;
  tuenti.ui.views.autogestion.init(estaServiceWorkerCargado);
});

window.addEventListener("beforeinstallprompt", (evento) => {
  evento.preventDefault();
  eventoInstalacion = evento;
  tuenti.ui.views.autogestion.mostrarBotonInstalacion();
});
