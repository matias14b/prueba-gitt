tuenti.service.envioInfoCliente = (function () {

    function enviarFirma(token, firmaDigital) {
        var informacion = {};
        informacion.firmaDigitalBase64 = firmaDigital;

        var formData = new FormData();
        formData.append('informacion', new Blob([JSON.stringify(informacion)], {type: "application/json"}));

        return enviarInformacion(token, formData);
    }

    function enviarPin(token, pin, fechaVencimiento) {
        var informacion = {};
        informacion.numeroPin = pin;
        informacion.fechaVencimientoPin = fechaVencimiento;

        var formData = new FormData();
        formData.append('informacion', new Blob([JSON.stringify(informacion)], {type: "application/json"}));

        return enviarInformacion(token, formData);
    }

    function enviarChip(token, chip) {
        var informacion = {};
        informacion.numeroChip = chip;

        var formData = new FormData();
        formData.append('informacion', new Blob([JSON.stringify(informacion)], {type: "application/json"}));

        return enviarInformacion(token, formData);
    }

    function enviarFirmaYAdjuntos(token, firmaDigital, dniFrente, dniDorso) {
        var formData = new FormData();
        var informacion = {};

        informacion.firmaDigitalBase64 = firmaDigital;
        formData.append('informacion', new Blob([JSON.stringify(informacion)], {type: "application/json"}));
        if (dniFrente !== undefined) {
            formData.append("dniFrente", dniFrente);
        }
        if (dniDorso !== undefined) {
            formData.append("dniDorso", dniDorso);
        }

        return enviarInformacion(token, formData);
    }

    function enviarInformacion(token, formData) {
        var url = tuenti.service.utils.url() + "/api/portabilidades/info-cliente?token=" + token;
        return $.ajax({
            contentType: false,
            processData: false,
            cache: false,
            url: url,
            type: 'PUT',
            data: formData
        });
    }

    return {
        enviarFirma: enviarFirma,
        enviarPin: enviarPin,
        enviarChip: enviarChip,
        enviarFirmaYAdjuntos: enviarFirmaYAdjuntos
    };

})();
