import { portabilidadGtm } from ".././mixin/portabilidadGtm.js";

Vue.component('portabilidad-typ', {
    data: function () {
        return {
            esVisible: false,
            isSiguienteVisible: false
        };
    },
    mixins: [portabilidadGtm],
    props: {
        tipoDeTyp: {
            type: String
        },
        mensajeError: {
            type: String
        },
        isCreadaConExito: {
            type: Boolean
        },
        portabilidadId: {
            type: Number
        },
        token: {
            type: String
        },
        mail: {
            type: String
        }
    },
    methods: {
        atrasStep: function () {
            this.$root.$emit('resetearRecaptcha');
            this.$parent.atrasStep();
        },
        pushearEventoAnalytics: function() {
            this.dispararTrackEvent("cta typ", "autogestion");
        },
        mostrarPaso: function () {
            this.esVisible = true;
        },
        ocultarPaso: function () {
            this.esVisible = false;
        }
    },
    updated() {
        $(".pnt-button-segui-tu-tramite").attr("href", `<AUTOGESTION_BASE_URL>/?portabilidadToken=${this.token}`);
    },
    template: document.getElementById("pnt-template-portabilidad-typ").innerHTML
});