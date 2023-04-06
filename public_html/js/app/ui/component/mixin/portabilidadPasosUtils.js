export const validarPaso = {
    methods: {
        validar: function () {
            var self = this;
            this.$validator.validate().then(function (valid) {
                if (valid) {
                    self.isSiguienteHabilitado = true;
                } else {
                    self.isSiguienteHabilitado = false;
                }
            });
        }
    }
};