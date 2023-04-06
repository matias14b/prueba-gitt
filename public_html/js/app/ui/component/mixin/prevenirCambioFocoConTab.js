export const prevenirCambioFoco = {
    methods: {
        prevenirCambioFoco: function (direccion, event) {
            if (event.shiftKey && direccion === "atras" || !event.shiftKey && direccion === "adelante") {
                event.preventDefault();
            }
        }
    }
};