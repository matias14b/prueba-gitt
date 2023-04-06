tuenti.service.preNuevoChip = (function () {

    function guardar(preNuevoChip) {
        return $.ajax({
            contentType: 'application/json; charset=UTF-8',
            url: tuenti.service.utils.url() + "/api/pre-nuevos-chips/publico",
            type: 'POST',
            data: JSON.stringify(preNuevoChip),
            dataType: 'json'
        });
    }

    return {
        guardar: guardar
    };

})();