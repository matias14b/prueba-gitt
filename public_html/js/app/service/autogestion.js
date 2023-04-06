tuenti.service.autogestion = (function () {

    function obtenerDatosPortabilidadPorToken(token) {
        var url = tuenti.service.utils.url() + "/api/autogestion/portabilidades/" + token;
        return $.ajax({
            contentType: false,
            processData: false,
            cache: false,
            url: url,
            type: 'GET'
        });
    }

    function obtenerDatosNuevaLineaPorToken(token) {
        var url = tuenti.service.utils.url() + "/api/autogestion/nuevos-chips/" + token;
        return $.ajax({
            contentType: false,
            processData: false,
            cache: false,
            url: url,
            type: 'GET'
        });
    }

    function obtenerDatosPortabilidadPorNumeroLineaYDni(numeroLinea, dni, captchaResponse) {
        var url = tuenti.service.utils.url() + "/api/autogestion/portabilidades/"
            + "?numeroLinea=" + numeroLinea
            + "&dni=" + dni
            + "&captchaResponse=" + captchaResponse;
        return $.ajax({
            contentType: false,
            processData: false,
            cache: false,
            url: url,
            type: 'GET'
        });
    }

    function obtenerDatosNuevaLineaPorIdYEmail(id, email, captchaResponse) {
        var url = tuenti.service.utils.url() + "/api/autogestion/nuevos-chips"
            + "?id=" + id
            + "&email=" + email
            + "&captchaResponse=" + captchaResponse;
        return $.ajax({
            contentType: false,
            processData: false,
            cache: false,
            url: url,
            type: 'GET'
        });
    }



    return {
        obtenerDatosPortabilidadPorToken: obtenerDatosPortabilidadPorToken,
        obtenerDatosPortabilidadPorNumeroLineaYDni: obtenerDatosPortabilidadPorNumeroLineaYDni,
        obtenerDatosNuevaLineaPorIdYEmail: obtenerDatosNuevaLineaPorIdYEmail,
        obtenerDatosNuevaLineaPorToken: obtenerDatosNuevaLineaPorToken
    };
})();