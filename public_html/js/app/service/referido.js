tuenti.service.referido = (function () {

    function esCodigoHabilitado(codigoReferido) {
        return axios({
            method: 'GET',
            url: tuenti.service.utils.url() + '/api/referidos/' + codigoReferido + "/validar",
        });
    }

    function buscarReferidosPorCodigoReferido(codigoReferido) {
        return axios({
            method: 'GET',
            url: `${tuenti.service.utils.url()}/api/referidos/${codigoReferido}`,
        })
    }

    function checkear(numeroLinea, recaptchaResponse) {
        return axios({
            method: 'GET',
            url: `${tuenti.service.utils.url()}/api/anis/${numeroLinea}/${recaptchaResponse}`,
        })
    }

    async function buscarImagen(url) {
        const response = await fetch(url);
        const filesArray = await response.blob();
        return new File([filesArray], "meme.jpg", { type: "image/jpeg"});
    }

    return {
        esCodigoHabilitado: esCodigoHabilitado,
        buscarReferidosPorCodigoReferido: buscarReferidosPorCodigoReferido,
        checkear:checkear,
        buscarImagen: buscarImagen
    };
})();