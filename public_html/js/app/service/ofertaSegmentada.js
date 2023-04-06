tuenti.service.ofertaSegmentada = (function () {

    function buscarVigentes(operadora) {
        return $.ajax({
            url: tuenti.service.utils.url() + "/api/oferta-segmentada/vigentes/" + operadora.toUpperCase(),
            type: 'GET'
        });
    }

    function buscarVigentesParaReferidos() {
        return $.ajax({
            url: tuenti.service.utils.url() + "/api/oferta-segmentada-referidos/vigentes",
            type: 'GET'
        })
    }

    return {
        buscarVigentes: buscarVigentes,
        buscarVigentesParaReferidos: buscarVigentesParaReferidos
    };

})();