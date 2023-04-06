tuenti.service.nuevoChip = (function () {

    function guardar(formData) {
        return $.ajax({
            contentType: false,
            processData: false,
            cache: false,
            url: tuenti.service.utils.url() + "/api/nuevos-chips/publico",
            type: 'POST',
            data: formData
        });
    }
    
    function buscarPuntosDeRetiroHabilitados() {
        return $.ajax({
            url: tuenti.service.utils.url() + "/api/punto-retiro-chip",
            type: 'GET'
        });
    }

    return {
        guardar: guardar,
        buscarPuntosDeRetiroHabilitados: buscarPuntosDeRetiroHabilitados
    };

})();