tuenti.service.prePortabilidad = (function () {

    function guardar(prePortaPrimerPaso) {
        return axios({
            method: 'POST',
            url: tuenti.service.utils.url() + '/api/preportabilidades',
            data: prePortaPrimerPaso,
            config: {headers: {'Content-Type': 'application/json'}}
        });
    }

    function modificar(prePortabilidad) {
        return axios({
            method: 'PUT',
            url: tuenti.service.utils.url() + "/api/preportabilidades/" + prePortabilidad.token,
            data: prePortabilidad,
            config: {headers: {'Content-Type': 'application/json'}}
        });
    }

    return {
        guardar: guardar,
        modificar: modificar
    };
})();
