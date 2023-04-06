Vue.component("nueva-landing-referidos", {
    data: function () {
        return {
            esVisibleInformacionReferente: false,
            esVisiblePestaniaLink: true,
            esVisiblePestaniaMisReferidos: false,
            numeroLineaReferente: ""
        }
    },
    methods: {
        mostrarBotonCopiarLink() {
            this.esVisibleInformacionReferente = true;
        },
        mostrarPestaniaLink(estado) {
            if (!this.esVisiblePestaniaLink) {
                this.cambiarEstado(estado);
            }
        },
        mostrarPestaniaReferidos(estado) {
            if (!this.esVisiblePestaniaMisReferidos) {
                this.cambiarEstado(estado);
            }
        },
        cambiarEstado(estado) {
            this.esVisiblePestaniaLink = estado;
            this.esVisiblePestaniaMisReferidos = !estado;
        },
        pasarNumeroLineaAVerMisReferidos(numeroLineaReferente) {
            this.numeroLineaReferente = numeroLineaReferente;
        }
    },
    template: document.getElementById("pnt-js-contenedor-nueva-landing-referidos").innerHTML
});