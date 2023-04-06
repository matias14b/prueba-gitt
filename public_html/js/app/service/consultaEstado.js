tuenti.service.consultaEstado = (function () {

    function buscar(numeroLinea) {
        return $.ajax({
            url: tuenti.service.utils.url() + "/api/portabilidades/estadoTramite?numeroLinea=" + numeroLinea,
            method: "GET"
        });
    }

    return{
        buscar: buscar
    };

})();
