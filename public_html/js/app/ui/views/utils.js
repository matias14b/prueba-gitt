tuenti.ui.views.utils = (function () {

    var duracionToast = 8000;
    /**
     * Recibe una fecha en formato dd/mm/yyyy y la devuelve como "YYYY-MM-DD".
     * @argument {string} dateAsString la fecha en formato dd/mm/yyyy
     */
    function textToIsoDateString(dateAsString) {
        var date = dateAsString.split("/");
        if (date.length !== 3) {
            return undefined;
        }
        return date[2] + "-" + date[1] + "-" + date[0];
    }

    /**
     * Convierte un formulario en un objeto. Cada elemento del formulario que
     * tenga un "name" seteado (y en el caso de los checkbox que esté activado)
     * se convierte en un atributo del objeto resultado.
     *
     * @param {HTMLFormElement[]} formArray el formulario como array de HTMLFormElement
     * @returns {object} un objeto con los elementos del formuluario
     */
    function objectifyForm(formArray, showBanner) {//serialize data function
        var returnArray = {};
        var nombre;
        for (var i = 0; i < formArray.length; i++) {
            nombre = formArray[i]['name'];
            var campos = nombre.split('.');
            if (campos.length > 1) {
                if (tieneValorParaEnviar(formArray[i])) {
                    returnArray[campos[0]] = returnArray[campos[0]] || {};
                    returnArray[campos[0]][campos[1]] = formArray[i]['value'];
                }
            } else if (tieneValorParaEnviar(formArray[i])) {
                returnArray[nombre] = formArray[i]['value'];
            }
        }
        if (showBanner === 'false') {
            returnArray['tienePromocion'] = true;
        }
        return returnArray;
    }

    /**
     * Indica si el elemento de un formulario tiene un valor activo. Se considera
     * "activo" si el elemento tiene el atributo nombre seteado, y en el caso
     * de los checkboxes si además está chequeado.
     *
     * @param {HTMLFormElement} element un elemento del formulario
     * @returns {boolean} true si hay un valor para enviar, false en caso contrario
     */
    function tieneValorParaEnviar(element) {
        if (element['type'] === "checkbox" && !element.checked) {
            return false;
        }
        if (element['name'] && element['value'] !== "") {
            return true;
        }
        return false;
    }

    /**
     * Indica si un codigo de caracteres es algunos de los especiales para firefox
     *
     * @param {int} codigoCaracter keyCode resultante de la carga del input
     * @returns {boolean} true si el codigo pertenece a caracteres especiales, false en caso contrario
     */
    function esCaracterEspecialEnFirefox(codigoCaracter) {
        var codigosCaracteresEspeciales = [8, 9, 16, 17, 20, 35, 36, 37, 39, 46];
        return codigosCaracteresEspeciales.indexOf(codigoCaracter) !== -1;
    }

    /**
     * Obtener el valor de un parametros de la URL
     *
     * @param {string} nombreParametro
     * @returns {object} valor del parametro
     */
    function getParametroUrl(nombreParametro) {
        var urlPagina = window.location.search.substring(1);
        var variablesUrl = urlPagina.split('&');
        for (var i = 0; i < variablesUrl.length; i++)
        {
            var parametros = variablesUrl[i].split('=');
            if (parametros[0] === nombreParametro)
            {
                return parametros[1];
            }
        }
    }

    function mostrarFadeIn(componente) {
        componente.removeClass("fadeOutDown");
        componente.addClass("fadeInUp");
        componente.removeClass("hide");
    }

    function ocultarFadeOut(componente) {
        componente.removeClass("fadeInUp");
        componente.addClass("fadeOutDown");
        setTimeout(function () {
            componente.addClass("hide");
        }, 400);
    }

    function inicializarDatePicker(componente, fechaMinima) {
        componente.datepicker({
            format: 'dd/mm/yyyy',
            minDate: fechaMinima ? fechaMinima : undefined,
            container: document.getElementsByClassName("pnt-js-container-pagina"),
            i18n: {
                cancel: 'Cancelar',
                clear: 'Restablecer',
                done: 'Aceptar',
                months: [
                    'Enero',
                    'Febrero',
                    'Marzo',
                    'Abril',
                    'Mayo',
                    'Junio',
                    'Julio',
                    'Agosto',
                    'Septiembre',
                    'Octubre',
                    'Noviembre',
                    'Diciembre'
                ],
                monthsShort: [
                    'ene',
                    'feb',
                    'mar',
                    'abr',
                    'may',
                    'jun',
                    'jul',
                    'ago',
                    'sep',
                    'oct',
                    'nov',
                    'dic'
                ],
                weekdays: [
                    'Domingo',
                    'Lunes',
                    'Martes',
                    'Miércoles',
                    'Jueves',
                    'Viernes',
                    'Sábado'
                ],
                weekdaysShort: [
                    'dom',
                    'lun',
                    'mar',
                    'mié',
                    'jue',
                    'vie',
                    'sáb'
                ],
                weekdaysAbbrev: [
                    'D',
                    'L',
                    'M',
                    'M',
                    'J',
                    'V',
                    'S'
                ]
            }
        });
    }

    function convertirAFechaArgentina(fecha) {
        return fecha.split("-").reverse().join("/");
    }

    function formatearNumeroTelefonico(numero) {
        var stringNumero = numero.toString();
        var cerosPorAgregar = 12 - stringNumero.length;
        for (var i = 0; i < cerosPorAgregar; i++) {
            stringNumero = "0".concat(stringNumero);
        }
        var regEx = new RegExp('.{1,' + 4 + '}', 'g');
        var numeroParseado = stringNumero.match(regEx);
        if (cerosPorAgregar > 0 && cerosPorAgregar < 4) {
            numeroParseado[0] = numeroParseado[0].substr(cerosPorAgregar);
        } else if (cerosPorAgregar >= 4) {
            numeroParseado = numeroParseado.splice(0, 1);
        }

        return numeroParseado.join("-");
    }

    function loguearError(xhr) {
        if (xhr && xhr.status !== 500) {
            var error = "Error\n"
                    + "-Status: " + (xhr.status ? xhr.status : "undefined") + "\n"
                    + "-Mensaje de error: " + (xhr.responseText ? xhr.responseText : "undefined");
            console.log(error);
        } else {
            console.log("No se recibió respuesta del servicio. ¿Está caído?");
        }
    }

    function mostrarToast(mensaje, clasesCss) {
        M.toast({
            html: mensaje,
            displayLength: duracionToast,
            classes: clasesCss
        });
    }

    function comprimirImagen(imagen, nombreDeArchivo) {
        return new Promise(function (resolve, reject) {
            var canvasImagenSinResize = document.createElement('canvas');
            var ctx = canvasImagenSinResize.getContext('2d');

            var reader = new FileReader();
            reader.onload = function (event) {
                var img = new Image();
                img.onload = function () {
                    canvasImagenSinResize.width = 800;
                    canvasImagenSinResize.height = (canvasImagenSinResize.width / img.width) * img.height;
                    ctx.drawImage(img, 0, 0, canvasImagenSinResize.width, canvasImagenSinResize.height);
                    var pica = window.pica({features: ['js']});
                    pica.toBlob(canvasImagenSinResize, 'image/jpeg', 0.70)
                            .then(blob => {
                                var imagenResize = blob.slice(0, blob.size, 'image/png');
                                var file = new File([imagenResize], nombreDeArchivo, {type: 'image/png'});
                                resolve(file);
                            });
                };
                img.src = event.target.result;
            };
            reader.readAsDataURL(imagen);
        });
    }

    function activarForzadoOrientacionPantallaVertical() {
        window.addEventListener("orientationchange", forzarOrientacionDePantallaVertical);
    }

    function desactivarForzadoOrientacionPantallaVertical() {
        window.removeEventListener("orientationchange", forzarOrientacionDePantallaVertical);
    }

    function forzarOrientacionDePantallaVertical(event) {
        let orientacionActual;
        if (window.orientation) {
            orientacionActual = window.orientation;
        }
        var orientacion = screen.msOrientation || screen.mozOrientation || (screen.orientation || {}).type;
        if (orientacion === "landscape-primary") {
            orientacionActual = -90;
        } else if (orientacion === "landscape-secondary") {
            orientacionActual = 90;
        } else if (orientacion === "portrait-primary") {
            orientacionActual = 0;
        } else {
            orientacionActual = 180;
        }
        
        switch (orientacionActual) {
            case 90:
                $('body').addClass('pnt-body-forzar-portrait-desde-landscape-lado-der')
                        .removeClass('pnt-body-forzar-portrait-desde-landscape-lado-izq')
                        .removeClass('pnt-body-forzar-portrait-desde-portrait-secondary');
                break;
            case - 90:
                $('body').addClass('pnt-body-forzar-portrait-desde-landscape-lado-izq')
                        .removeClass('pnt-body-forzar-portrait-desde-landscape-lado-der')
                        .removeClass('pnt-body-forzar-portrait-desde-portrait-secondary');
                break;
            case 180:
                $('body').addClass('pnt-body-forzar-portrait-desde-portrait-secondary')
                        .removeClass('pnt-body-forzar-portrait-desde-landscape-lado-der')
                        .removeClass('pnt-body-forzar-portrait-desde-landscape-lado-izq');
                break;
            default:
                $('body').removeClass('pnt-body-forzar-portrait-desde-portrait-secondary')
                        .removeClass('pnt-body-forzar-portrait-desde-landscape-lado-izq')
                        .removeClass('pnt-body-forzar-portrait-desde-landscape-lado-der');
        }
    }

    return {
        objectifyForm: objectifyForm,
        textToIsoDateString: textToIsoDateString,
        esCaracterEspecialEnFirefox: esCaracterEspecialEnFirefox,
        getParametroUrl: getParametroUrl,
        inicializarDatePicker: inicializarDatePicker,
        mostrarFadeIn: mostrarFadeIn,
        ocultarFadeOut: ocultarFadeOut,
        convertirAFechaArgentina: convertirAFechaArgentina,
        formatearNumeroTelefonico: formatearNumeroTelefonico,
        loguearError: loguearError,
        comprimirImagen: comprimirImagen,
        mostrarToast: mostrarToast,
        activarForzadoOrientacionPantallaVertical: activarForzadoOrientacionPantallaVertical,
        desactivarForzadoOrientacionPantallaVertical: desactivarForzadoOrientacionPantallaVertical
    };

})();

