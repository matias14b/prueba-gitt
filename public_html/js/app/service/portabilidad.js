tuenti.service.portabilidad = (function () {

    function guardar(formData) {
        return axios({
            method: 'POST',
            url: tuenti.service.utils.url() + '/api/portabilidades/publico',
            data: formData,
            config: {headers: {'Content-Type': 'multipart/form-data'}}
        });
    }

    function descargar(idPortabilidad) {
        window.location = tuenti.service.utils.url() + "/portabilidades/" + idPortabilidad + "/formulario";
    }

    return {
        guardar: guardar,
        descargar: descargar
    };
})();
