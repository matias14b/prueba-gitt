tuenti.ui.views.nuevoChip = (function () {
    var utils = tuenti.ui.views.utils;
    var $spinner = $(".pnt-js-contenedor-spinner");
  
    var listaLocalidades = {};
    var listaPuntosDeRetiro = {};
    var labelPaso2 = "pickup";
    var regexPalabras = new RegExp(
      "\\b((?:put|bolud|forr|chot|garch|trol|pajer|pelotud|conchud|cornud|chamuyer|bolacer|lel)(?:[oa]|it[oa])s*|(?:mierd|pij|tet|cajet)(a|ita)s*|(?:ped|cul)(o|ito)s*|petes*|ortos*|garc[oa]s*|vergas*|cag[ao]s*|cagar|cagaron|cagarl[oa]s*|cagate|cagarte|maricas*|maric[oóÓ]na?(?:es*|as*)?|cog[eéÉ]r(?:te|me|lo[s]*|la[s]*|tel[oa]s*|mel[oa]s*)?|curt(?:[iíÍ]|ir(?:l[oa]s*)?|[iíÍ]rte(?:l[oa]s*)?|[iíÍ]rme(?:l[oa]s*)?)|(?:pete|paje|garch|fif)(?:ar|ar(?:l[oa]s*)?|[aáÁ]rte(?:l[oa]s*)?|[aáÁ]rme(?:l[oa]s*)?))\\b",
      "i"
    );
    var nombreProducto;
    var showBanner;
    var listaLocalidadesDeEnvioChip = [];
  
    function init() {
      inicializarBanner();
      inicializarMaterialize();
      inicializarAnalytics();
      inicializarFormulario();
      inicializarParsleyEnFormTusDatos();
      inicializarCodigoPromocional();
      inicializarStepperRadial();
      ocultarPromoBienvenidaConCodigoPromocionalDia();
      inicializarBarrasDeProgreso();
      inicializarProvincias();
      bindearDropdownLocalidades();
      bindearDropdownProvincias();
      bindearDropdownLocalidadEnvioChip();
      inicializarValidadorPalabrasSucias();
      initPrimerPasoAnalytics();
      bindearModalQueEsTuenti();
      bindearModalCombo();
      bindearModalPreguntas();
      bindearValidacionCampoLocalidadRetiroEnCasoDeVacio();
      bindearValidacionCampoLocalidadDeliveryEnCasoDeVacio();
    }
  
    function inicializarBanner() {
      showBanner = tuenti.ui.views.utils.getParametroUrl("showBanner");
      if (showBanner !== 'false') {
        $(".pnt-js-ocultar-banner").removeClass("hide");
      }
    }
  
    function inicializarCodigoPromocional() {
      showBanner = tuenti.ui.views.utils.getParametroUrl("showBanner");
      if (showBanner === 'false') {
        $(".pnt-js-contenedor-codigo-promocional").removeClass("hide");
        $("#pnt-js-codigo-promocional").addClass("pnt-js-barra-progreso");
        $("#pnt-js-codigo-promocional").prop("required", true);
        let codigoPromocional = tuenti.ui.views.utils.getParametroUrl("codigoPromocional");
        if (codigoPromocional) {
          $("#pnt-js-codigo-promocional").val(codigoPromocional);
          $("#pnt-js-codigo-promocional").focus();
          $("#pnt-js-codigo-promocional").prop('disabled', true);
        }
      }
    }
  
    function inicializarValidadorPalabrasSucias() {
      window.Parsley.addValidator("palabras", {
        requirementType: "regexp",
        validateString: function (value) {
          return !regexPalabras.test(value);
        },
        messages: {
          es: "Esa palabra no est&aacute; permitida."
        }
      });
    }
  
    function inicializarBarrasDeProgreso() {
      completarBarraDeProgreso(
        ".pnt-js-contenedor-tus-datos .pnt-js-barra-progreso"
      );
      completarBarraDeProgreso(
        ".pnt-js-contenedor-formulario-delivery.pnt-js-contenedor-obtener-chip .pnt-js-barra-progreso"
      );
      completarBarraDeProgreso(
        ".pnt-js-contenedor-formulario-retiro.pnt-js-contenedor-obtener-chip .pnt-js-barra-progreso"
      );
      $(".pnt-js-boton-retiro").on("click", function () {
        avanzarBarraDeProgreso(
          ".pnt-js-contenedor-formulario-retiro.pnt-js-contenedor-obtener-chip .pnt-js-barra-progreso"
        );
      });
      $(".pnt-js-boton-delivery").on("click", function () {
        avanzarBarraDeProgreso(
          ".pnt-js-contenedor-formulario-delivery.pnt-js-contenedor-obtener-chip .pnt-js-barra-progreso"
        );
      });
    }
  
    function inicializarMaterialize() {
      $(".collapsible").collapsible();
      $("select").formSelect();
      $(".modal").modal();
    }
  
    function inicializarAnalytics() {
      nombreProducto = tuenti.ui.views.utils.getParametroUrl("producto") || "Alta Chip";
    }
  
    function inicializarFormulario() {
      $(".collapsible.pnt-js-collapsible-tus-datos").collapsible("open");
      adaptarSelectsAMaterializeParaResolucionMobile();
      bindearBuscarLocalidad();
      bindearSiguienteMisDatos();
      bindearMostrarDelivery();
      bindearMostrarRetiro();
      bindearSiguienteObtenerChip();
    }
    
    function inicializarStepperRadial() {
      $("#demo").percircle({
        percent: 50,
        text: "1 de 2",
        progressBarColor: "#FF0066"
      });
    }

    function adaptarSelectsAMaterializeParaResolucionMobile() {
      //Los selects por defecto son nativos para que se adapten a IOS
      var anchoDePantalla = document.body.clientWidth;
      if (anchoDePantalla > 450) {
        $("select").removeClass("browser-default");
        $("select").formSelect();
      } else {
        $(".pnt-js-label-select").hide();
      }
    }
  
    function inicializarProvincias() {
      var listaProvincias = {};
  
      tuenti.service.nuevoChip
        .buscarPuntosDeRetiroHabilitados()
        .done(function (puntosDeRetiro) {
          $.each(puntosDeRetiro, function (index, puntoDeRetiro) {
            listaPuntosDeRetiro[puntoDeRetiro.id] = {
              textoDelSelect: puntoDeRetiro.direccion,
              criterioFiltrado: puntoDeRetiro.localidad.id
            };
            if (!listaLocalidades[puntoDeRetiro.localidad.id]) {
              listaLocalidades[puntoDeRetiro.localidad.id] = {
                textoDelSelect: puntoDeRetiro.localidad.nombre,
                criterioFiltrado: puntoDeRetiro.localidad.provincia.valor
              };
            }
            if (!listaProvincias[puntoDeRetiro.localidad.provincia.valor]) {
              listaProvincias[puntoDeRetiro.localidad.provincia.valor] = {
                textoDelSelect: puntoDeRetiro.localidad.provincia.nombre
              };
            }
          });
          var selectProvinciasPuntosDeRetiro = $(
            ".pnt-js-select-provincia-retiro"
          );
          listaProvincias = convertirAListaOrdenada(listaProvincias);
          listaLocalidades = convertirAListaOrdenada(listaLocalidades);
          listaPuntosDeRetiro = convertirAListaOrdenada(listaPuntosDeRetiro);
          cargarSelect(selectProvinciasPuntosDeRetiro, listaProvincias);
        })
        .fail(procesarRespuestaConError);
    }
  
    function convertirAListaOrdenada(objetoLista) {
      var lista = Object.keys(objetoLista).map(function (valor) {
        return {
          value: valor,
          textoDelSelect: objetoLista[valor].textoDelSelect,
          criterioFiltrado: objetoLista[valor].criterioFiltrado
        };
      });
      lista.sort(function (item1, item2) {
        return item1.textoDelSelect > item2.textoDelSelect
          ? 1
          : item1.textoDelSelect < item2.textoDelSelect
            ? -1
            : 0;
      });
      return lista;
    }
  
    function bindearDropdownProvincias() {
      $(".pnt-js-select-provincia-retiro").on("change", function () {
        $(".pnt-js-formulario-retiro").parsley().validate("provincia-retiro");
        
        //Evento legacy conservado por instrucción de Tuenti
        var provinciaRetiro = $(this).val();
        tuenti.service.analytics.eventoProvincia(provinciaRetiro);
        //Fin evento legacy
        $(".pnt-js-select-localidad-retiro option[value != '']").remove();
        agregarLocalidadesParaPDRSegunProvincia(provinciaRetiro);
      });
    }
  
    function agregarLocalidadesParaPDRSegunProvincia(provincia) {
      listaLocalidadesFiltradaSegunProvincia = listaLocalidades.filter(localidad => localidad.criterioFiltrado === provincia);
      let localidadesUnificadas = listaLocalidadesFiltradaSegunProvincia.map(localidad => {
        let localidadTexto = localidad.textoDelSelect.split(/(?= -).*/);
        return localidadTexto[0];
      });
      let localidadesSinRepetidos = Array.from(new Set(localidadesUnificadas));
      for (var indice = 0; indice < localidadesSinRepetidos.length; indice++) {
        $('#listaLocalidadesPuntoRetiro').append(`<option value='${localidadesSinRepetidos[indice]}'>`);
      }
    }
  
    function bindearDropdownLocalidades() {
      $(".pnt-js-select-localidad-retiro").on("change", function () {
        const provinciaSeleccionada = $(".pnt-js-select-provincia-retiro option:selected").val();
        const listadoLocalidades = Object.values(listaLocalidades);
        const nombreDeLocalidades = listadoLocalidades.map(localidad => localidad.textoDelSelect);
        var selectPuntosDeRetiro = $(".pnt-js-select-punto-retiro");
        if (nombreDeLocalidades.find(localidad => localidad.split(/(?= -).*/)[0] === $(this).val().trim())) {
  
          if (!tieneClase($(".pnt-js-select-localidad-retiro-error"), "hide")) {
            $(".pnt-js-select-localidad-retiro-error").addClass("hide");
          }
  
          $(".pnt-js-select-punto-retiro option[value != '']").remove();
          const localidades = listadoLocalidades.filter(loc => loc.textoDelSelect.includes($(this).val()) && loc.criterioFiltrado == provinciaSeleccionada);
          var listaPuntosDeRetiroFiltrada = completarPuntosDeRetiro(localidades);
  
          cargarSelect(selectPuntosDeRetiro, listaPuntosDeRetiroFiltrada);
          blanquearSelect(selectPuntosDeRetiro);
  
          if (localidades.length != 0) {
            let provinciaElegida = $(".pnt-js-select-provincia-retiro option:selected").text();
            let localidadElegida = $(this).val();
            tuenti.service.analytics.trackEventNuevoChip("Punto de retiro", provinciaElegida, localidadElegida);
          }
        } else {
          agregarMensajeDeErrorEnInputDeLocalidadRetiro();
          limpiarSelectPuntoRetiro();
        }
      });
    }
  
    function agregarMensajeDeErrorEnInputDeLocalidadRetiro() {
      if (!$(".pnt-js-select-provincia-retiro option:selected").val()) {
        $(".pnt-js-select-localidad-retiro-error").text("Debes seleccionar una provincia.");
        $(".pnt-js-select-localidad-retiro-error").removeClass("hide");
      }
      if ($(".pnt-js-select-localidad-retiro").val() !== '' && $(".pnt-js-select-provincia-retiro option:selected").val()) {
        $(".pnt-js-select-localidad-retiro-error").text("La localidad indicada no existe.");
        $(".pnt-js-select-localidad-retiro-error").removeClass("hide");
      }
    }
  
    function bindearValidacionCampoLocalidadRetiroEnCasoDeVacio() {
      $(".pnt-js-select-localidad-retiro").on("keyup", function () {
        if ($(".pnt-js-select-localidad-retiro").val() === '') {
          if (!tieneClase($(".pnt-js-select-localidad-retiro-error"), "hide")) {
            $(".pnt-js-select-localidad-retiro-error").addClass("hide");
          }
        }
      });
    }
  
    function bindearValidacionCampoLocalidadDeliveryEnCasoDeVacio() {
      $(".pnt-js-select-localidad-envio").on("keyup", function () {
        if ($(".pnt-js-select-localidad-envio").val() === '') {
          if (!tieneClase($(".pnt-js-select-localidad-envio-error"), "hide")) {
            $(".pnt-js-select-localidad-envio-error").addClass("hide");
          }
        }
      });
    }
  
    function tieneClase(selector, clase) {
      return selector.hasClass(clase);
    }
  
    function completarPuntosDeRetiro(localidades) {
      let puntosDeRetiro = [];
      localidades.forEach(localidad => {
        let criterioFiltrado = localidad.value;
        puntosDeRetiro = puntosDeRetiro.concat(listaPuntosDeRetiro
          .filter(puntoDeRetiro => puntoDeRetiro.criterioFiltrado == criterioFiltrado));
      })
      return puntosDeRetiro;
    }
  
    function cargarSelect(selector, lista) {
      lista.map(function (item) {
        agregarOpcionASelect(selector, item.value, item.textoDelSelect);
      });
      selector.formSelect();
    }
  
    function blanquearSelect(selector) {
      selector.val("");
      selector.formSelect();
    }
  
    function agregarOpcionASelect(selector, clave, textoDelSelect) {
      var opcion = new Option(textoDelSelect, clave);
      selector.append($(opcion));
      return opcion;
    }
  
    function bindearBuscarLocalidad() {
      $(".pnt-js-label-localidad").on("click", function () {
        $(".pnt-js-label-localidad").addClass("active");
        $(".pnt-js-select-localidad-retiro").focus();
      });
  
      $(".pnt-js-select-provincia-retiro").on("change", function () {
        limpiarSelectLocalidadPuntoRetiro();
        limpiarSelectPuntoRetiro();
        if (!tieneClase($(".pnt-js-select-localidad-retiro-error"), "hide")) {
          $(".pnt-js-select-localidad-retiro-error").addClass("hide");
        }
      });
  
      $(".pnt-js-select-provincia").on("change", function () {
        $(".pnt-js-formulario-delivery").parsley().validate("provincia-delivery");
        
        //Evento legacy conservado por instrucción de Tuenti
        var provincia = $(this).val();
        tuenti.service.analytics.eventoProvincia(provincia);
        //Fin evento legacy
  
        $spinner.removeClass("hide");
        limpiarSelectLocalidadEnvioChip();
        if (!tieneClase($(".pnt-js-select-localidad-envio-error"), "hide")) {
          $(".pnt-js-select-localidad-envio-error").addClass("hide");
        }
        tuenti.service.localidad
          .buscar($(this).val())
          .then(function (respuesta) {
            listaLocalidadesDeEnvioChip = respuesta.data;
            $.each(respuesta.data, function (i, localidad) {
              $("#listaLocalidadesEnvioChip").append(
                "<option value='" +
                localidad.nombre +
                "'></option>"
              );
            });
            $(".pnt-js-contenedor-dropdown-localidad").removeClass("hide");
          })
          .catch(procesarRespuestaConError)
          .then(function () {
            $spinner.addClass("hide");
          });
      });
    }
  
    function limpiarSelectLocalidadPuntoRetiro() {
      $("#listaLocalidadesPuntoRetiro").empty();
      $('.pnt-js-select-localidad-retiro').val('');
      $('.pnt-js-label-localidad').removeClass('active');
    }
  
    function limpiarSelectLocalidadEnvioChip() {
      $("#listaLocalidadesEnvioChip").empty();
      $('.pnt-js-select-localidad-envio').val('');
      $('.pnt-js-label-localidad').removeClass('active');
    }
  
    function limpiarSelectPuntoRetiro() {
      $(".pnt-js-select-punto-retiro").empty().append('<option value="" disabled selected hidden>¿D&oacute;nde quer&eacute;s pasar a buscar tu chip?</option>');
      blanquearSelect($(".pnt-js-select-punto-retiro"));
    }
  
    function bindearDropdownLocalidadEnvioChip() {
      $(".pnt-js-label-localidad").on("click", function () {
        $(".pnt-js-label-localidad").addClass("active");
        $(".pnt-js-select-localidad-envio").focus();
      });
  
      $(".pnt-js-select-localidad-envio").on("change", function () {
        if (listaLocalidadesDeEnvioChip.find(localidad => localidad.nombre === $(this).val())) {
  
          if (!tieneClase($(".pnt-js-select-localidad-envio-error"), "hide")) {
            $(".pnt-js-select-localidad-envio-error").addClass("hide");
          }
  
          let provinciaElegida = $(".pnt-js-select-provincia option:selected").text();
          let localidadElegida = $(this).val();
          tuenti.service.analytics.trackEventNuevoChip("Envio de chip", provinciaElegida, localidadElegida);
        } else {
          agregarMensajeDeErrorEnInputDeLocalidadEnvio();
        }
      });
    }
  
    function agregarMensajeDeErrorEnInputDeLocalidadEnvio() {
      if (!$(".pnt-js-select-provincia option:selected").val()) {
        $(".pnt-js-select-localidad-envio-error").text("Debes seleccionar una provincia.");
        $(".pnt-js-select-localidad-envio-error").removeClass("hide");
      }
      if ($(".pnt-js-select-localidad-envio").val() !== '' && $(".pnt-js-select-provincia option:selected").val()) {
        $(".pnt-js-select-localidad-envio-error").text("La localidad indicada no existe.");
        $(".pnt-js-select-localidad-envio-error").removeClass("hide");
      }
    }
  
    function completarBarraDeProgreso(selectorContenedor) {
      $(selectorContenedor).on("change", function () {
        avanzarBarraDeProgreso(selectorContenedor);
      });
    }
  
    function avanzarBarraDeProgreso(selectorContenedor) {
      var cantidadInputsConTexto = detectarInputsConTexto(selectorContenedor);
      var numeroPorcentaje =
        (cantidadInputsConTexto * 100) / $(selectorContenedor).length;
      var porcentajeProgreso = numeroPorcentaje + "%";
  
      $(selectorContenedor)
        .parents("ul")
        .siblings(".pnt-barra-de-progreso-nueva-linea")
        .children(".pnt-js-relleno-barra")
        .css("width", porcentajeProgreso);
    }
  
    function detectarInputsConTexto(selectorInput) {
      return $(selectorInput).filter(function () {
        return this.value.length > 0;
      }).length;
    }
  
    function inicializarParsleyEnFormTusDatos() {
      $("#pnt-js-tus-datos").parsley();
    }
  
    function bindearSiguienteMisDatos() {
      $(".pnt-js-siguiente-tus-datos").on("click", function (evento) {
        tuenti.service.analytics.trackEventNuevoChip("Formulario | 1", "SIGUIENTE");
        if (
          $("#pnt-js-tus-datos")
            .parsley()
            .validate()
        ) {
          $spinner.removeClass("hide");
  
          var preNuevoChip = {
            nombre: $("input#pnt-js-nombre-nueva-linea").val(),
            apellido: $("input#pnt-js-apellido-nueva-linea").val(),
            email: $("input#pnt-js-email-nueva-linea").val(),
            telefonoAlternativo: $("input#pnt-js-telefono-nueva-linea").val()
          };
  
          preNuevoChip = adecuarTelefonoAlternativo(preNuevoChip);
  
          tuenti.service.preNuevoChip
            .guardar(preNuevoChip)
            .done(function (preNuevoChipGuardado) {
              tuenti.service.analytics.eventoCheckoutViewNuevoChip(2, nombreProducto);
              $(".collapsible.pnt-js-collapsible-tus-datos").collapsible("close");
              $(".collapsible.pnt-js-collapsible-obtener-chip").collapsible(
                "open"
              );
              $(".pnt-js-collapsible-obtener-chip").removeClass(
                "pnt-collapsible-deshabilitar-obtener-chip"
              );
              tuenti.service.analytics.eventoPaginaVirtual("/alta-chip/paso2/datos-entrega");
              actualizarStepperRadial();
            })
            .fail(procesarRespuestaConError)
            .always(function () {
              $spinner.addClass("hide");
  
              //Evento legacy conservado por instrucción de Tuenti
              tuenti.service.analytics.eventoInteractivo(
                "PediTuChip",
                "paso1",
                "click",
                "paso1"
              );
              //Fin evento legacy
            });
        }
      });
    }
  
    function adecuarTelefonoAlternativo(nuevoChip) {
      if (nuevoChip.telefonoAlternativo !== undefined && nuevoChip.telefonoAlternativo !== null) {
        nuevoChip.telefonoAlternativo =
          nuevoChip.telefonoAlternativo.length > 0
            ? nuevoChip.telefonoAlternativo
            : null;
      }
      return nuevoChip;
    }
  
    function bindearMostrarDelivery() {
      $(".pnt-js-boton-delivery").on("click", function () {
        labelPaso2 = "delivery";
        $(".pnt-js-contenedor-formulario-delivery").removeClass("hide");
        $(".pnt-js-contenedor-captcha").removeClass("hide");
        $(".pnt-js-contenedor-formulario-delivery form").addClass(
          "pnt-js-solicitud-activa"
        );
        $(".pnt-js-contenedor-formulario-retiro").addClass("hide");
        $(".pnt-js-contenedor-formulario-retiro form").removeClass(
          "pnt-js-solicitud-activa"
        );
        $(this).removeClass("pnt-button-nueva-linea-con-icono-inactivo");
        $(".pnt-js-boton-retiro").addClass(
          "pnt-button-nueva-linea-con-icono-inactivo"
        );
      });
    }
  
    function bindearMostrarRetiro() {
      $(".pnt-js-boton-retiro").on("click", function () {
        labelPaso2 = "pickup";
        $(".pnt-js-contenedor-formulario-retiro").removeClass("hide");
        $(".pnt-js-contenedor-captcha").removeClass("hide");
        $(".pnt-js-contenedor-formulario-retiro form").addClass(
          "pnt-js-solicitud-activa"
        );
        $(".pnt-js-contenedor-formulario-delivery").addClass("hide");
        $(".pnt-js-contenedor-formulario-delivery form").removeClass(
          "pnt-js-solicitud-activa"
        );
        $(this).removeClass("pnt-button-nueva-linea-con-icono-inactivo");
        $(".pnt-js-boton-delivery").addClass(
          "pnt-button-nueva-linea-con-icono-inactivo"
        );
      });
    }
  
    function bindearSiguienteObtenerChip() {
      $(".pnt-js-siguiente-obtener-chip").on("click", function () {
        tuenti.service.analytics.trackEventNuevoChip("Formulario | 2", "ENVIAR PEDIDO");
        var formularioActivo = $(".pnt-js-solicitud-activa");
  
        if ($(".pnt-js-select-localidad-retiro").val() === '') {
          if (!tieneClase($(".pnt-js-select-localidad-retiro-error"), "hide")) {
            $(".pnt-js-select-localidad-retiro-error").addClass("hide");
          }
        }
  
        if ($(".pnt-js-select-localidad-envio").val() === '') {
          if (!tieneClase($(".pnt-js-select-localidad-envio-error"), "hide")) {
            $(".pnt-js-select-localidad-envio-error").addClass("hide");
          }
        }
  
        if (formularioActivo.parsley().validate() && noExisteErrorEnCampoLocalidad()) {
          $spinner.removeClass("hide");
  
          //Evento legacy conservado por instrucción de Tuenti
          tuenti.service.analytics.eventoInteractivo(
            "PediTuChip",
            "paso2",
            "click",
            labelPaso2
          );
          //Fin evento legacy
  
          var nuevoChip = utils.objectifyForm($("#pnt-js-tus-datos .pnt-js-input-nueva-linea"), showBanner);
          var solicitudChip = utils.objectifyForm(
            $(".pnt-js-solicitud-activa .pnt-js-input-nueva-linea")
          );
          if (formularioActivo.hasClass("pnt-js-formulario-delivery")) {
            const localidadSeleccionada = $(".pnt-js-select-localidad-envio").val();
            if (perteneceLocalidadAListaLocalidades(localidadSeleccionada)) {
              const localidadesFiltradas = listaLocalidadesDeEnvioChip.filter(localidad => localidad.nombre === localidadSeleccionada);
              solicitudChip.envioChip.localidad = {
                id: localidadesFiltradas[0].id
              };
              delete solicitudChip.localidad;
              nuevoChip.solicitudChip = solicitudChip;
            }
  
          } else {
            nuevoChip.solicitudChip = {};
            nuevoChip.solicitudChip.pedidoPuntoRetiroChip = solicitudChip;
          }
          nuevoChip = adecuarTelefonoAlternativo(nuevoChip);
  
          var formData = new FormData();
  
          var responseCaptcha = grecaptcha.getResponse();
          var mensajeErrorCaptcha;
          if (responseCaptcha == "") {
            mensajeErrorCaptcha = "tenés que completar el captcha."
          }
  
          formData.append("gRecaptchaResponse", responseCaptcha);
          formData.append(
            "nuevoChip",
            new Blob([JSON.stringify(nuevoChip)], { type: "application/json" })
          );
  
          tuenti.service.nuevoChip.guardar(formData)
            .done(function (nuevoChipPersistido) {
              $(".pnt-js-thank-you-page").removeClass("hide");
              $(".pnt-js-contenedor-mis-datos").addClass("hide");
              $(".pnt-js-contenedor-obtener-chip").addClass("hide");
  
              //Evento legacy conservado por instrucción de Tuenti
              tuenti.service.analytics.eventoNoInteractivo(
                "PediTuChip",
                "paso3",
                "click",
                "confirmacion",
                nuevoChipPersistido.id
              );
              //Fin evento legacy
  
              mostrarMensajeThankYou(nuevoChipPersistido);
            })
            .fail(function (xhr) {
              procesarRespuestaConError(xhr, mensajeErrorCaptcha);
              grecaptcha.reset();
              $(".tuenti-recaptcha").removeClass("hide");
            })
            .always(function () {
              $spinner.addClass("hide");
            });
        }
      });
    }
  
    function noExisteErrorEnCampoLocalidad() {
      return $(".pnt-js-select-localidad-retiro-error, .pnt-js-select-localidad-envio-error").hasClass('hide');
    }
  
    function perteneceLocalidadAListaLocalidades(nombreLocalidad) {
      return listaLocalidadesDeEnvioChip.some(localidad => localidad.nombre === nombreLocalidad);
    }
  
    function procesarRespuestaConError(xhr, mensajeErrorCaptcha) {
      utils.loguearError(xhr);
      var mensajeToast = "¡Ups! ";
      if (xhr.status === 500 || xhr.status === 0) {
        mensajeToast = mensajeToast.concat(
          "Hay un problema con el sistema. Intentá de nuevo más tarde."
        );
      } else if (mensajeErrorCaptcha) {
        mensajeToast = mensajeToast.concat(
          mensajeErrorCaptcha
        );
      } else {
        mensajeToast = mensajeToast.concat(xhr.responseText);
      }
      utils.mostrarToast(mensajeToast, "pnt-toast-error");
    }
  
    function mostrarMensajeThankYou(nuevoChipPersistido) {
      if (nuevoChipPersistido.solicitudChip.envioChip) {
        $(".pnt-js-titulo-typ").text("¡Estas a un paso de ser TUENTI!");
        $(".pnt-js-subtitulo-typ").html(
          "Ya estamos mandando tus datos al Correo para que te lo manden a:" +
          "<br>" +
          "<strong>" +
          nuevoChipPersistido.solicitudChip.envioChip.calle + " " +
          nuevoChipPersistido.solicitudChip.envioChip.altura +
          "<br>" +
          nuevoChipPersistido.solicitudChip.envioChip.localidad.nombre +
          "</strong>"
        );
        $(".pnt-js-mensaje-typ-info").html(
          "Tu número de pedido es : <strong>" +
          nuevoChipPersistido.id +
          "</strong>" +
          "<br>" +
          "Tranqui, no hace falta que lo anotes porque en unos minutos te mandamos un mail a <strong>" +
          nuevoChipPersistido.email +
          "</strong>" +
          "<br>" +
          "No te olvides de revisar la bandeja de spam."
        );
        $(".pnt-js-mensaje-typ-adicional").html(
          "Si tenes dudas siempre nos encontras en nuestras redes sociales."
        );
      } else {
        $(".pnt-js-titulo-typ").text("¡TU CHIP TUENTI TE ESTÁ ESPERANDO!");
        $(".pnt-js-subtitulo-typ").html("Ya podes ir a buscarlo a:");
        $(".pnt-js-mensaje-typ-info").html(
          "<strong>"
            .concat(
              nuevoChipPersistido.solicitudChip.pedidoPuntoRetiroChip
                .puntoRetiroChip.nombre
            )
            .concat("<br>")
            .concat(
              nuevoChipPersistido.solicitudChip.pedidoPuntoRetiroChip
                .puntoRetiroChip.direccion
            )
            .concat("<br>")
            .concat(
              nuevoChipPersistido.solicitudChip.pedidoPuntoRetiroChip
                .puntoRetiroChip.localidad.nombre
            )
            .concat(", ")
            .concat(
              nuevoChipPersistido.solicitudChip.pedidoPuntoRetiroChip
                .puntoRetiroChip.localidad.provincia.nombre
            )
            .concat(
              nuevoChipPersistido.solicitudChip.pedidoPuntoRetiroChip
                .puntoRetiroChip.horario
                ? "<br>".concat(
                  nuevoChipPersistido.solicitudChip.pedidoPuntoRetiroChip
                    .puntoRetiroChip.horario
                )
                : ""
            )
            .concat("</strong>")
        );
        $(".pnt-js-mensaje-mail").html(
          "Tu número de pedido es : <strong>" +
          nuevoChipPersistido.id +
          "</strong>" +
          "<br>" +
          "Tranqui, no hace falta que lo anotes porque en unos minutos te mandamos toda la info por mail a <strong> " +
          nuevoChipPersistido.email +
          "</strong>" +
          "<br>" +
          "No te olvides de revisar la bandeja de spam."
        );
        $(".pnt-js-mensaje-typ-adicional").html("Si tenes dudas, estamos en nuestras redes sociales para ayudarte.")
      }
      tuenti.service.analytics.eventoPaginaVirtual("/alta-chip/paso3/thank-you-page");
    }
  
    function bindearModalQueEsTuenti() {
      $('.pnt-button-js-que-es-tuenti').on('click', function () {
        $('#modal-que-es-tuenti').modal('open');
      });
  
      $('.pnt-button-cerrar-modal').on('click', function () {
        $('#modal-que-es-tuenti').modal('close');
      });
    }
  
    function bindearModalCombo() {
      $('.pnt-button-js-combo').on('click', function () {
        $('#modal-combo').modal('open');
      });
  
      $('.pnt-button-cerrar-modal').on('click', function () {
        $('#modal-combo').modal('close');
      });
    }
  
    function bindearModalPreguntas() {
      $('.pnt-button-js-preguntas').on('click', function () {
        $('#modal-preguntas').modal('open');
      });
  
      $('.pnt-button-cerrar-modal').on('click', function () {
        $('#modal-preguntas').modal('close');
      });
    }
  
    function initPrimerPasoAnalytics() {
      tuenti.service.analytics.eventoPaginaVirtual("/alta-chip/paso1/datos-personales");
      tuenti.service.analytics.eventoCheckoutViewNuevoChip(1, nombreProducto);
    }

    function ocultarPromoBienvenidaConCodigoPromocionalDia() {
      let codigoPromocional = tuenti.ui.views.utils.getParametroUrl("codigoPromocional");
      if(codigoPromocional === 'DIA') {
        $(".pnt-js-promo-bienvenida").hide();
      }
    }
  
    function actualizarStepperRadial() {
      $("#demo").percircle({text: '2 de 2', percent: 100.0, progressBarColor: '#FF0066'});
      $(".pnt-encabezado").text("Conseguí tu chip GRATIS");
    }

    return {
      init: init
    };
  })();
  
  $(document).ready(function () {
    tuenti.ui.views.nuevoChip.init();
  });