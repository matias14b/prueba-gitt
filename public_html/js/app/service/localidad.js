tuenti.service.localidad = (function () {

    function buscar(provincia) {
        return axios({
            method: 'GET',
            url: tuenti.service.utils.url() + '/api/localidades/' + provincia
        });
    }

    return{
        buscar: buscar
    };

})();
