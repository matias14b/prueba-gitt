tuenti.service.pin = (function () {

    function enviar(numeroLinea, gRecaptchaResponse) {
        return axios({
            method: 'POST',
            url: tuenti.service.utils.url() + '/api/pin?numeroLinea=' + numeroLinea + '&gRecaptchaResponse=' + gRecaptchaResponse
        });
    }

    return{
        enviar: enviar
    };

})();
