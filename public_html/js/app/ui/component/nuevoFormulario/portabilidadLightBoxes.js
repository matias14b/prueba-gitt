Vue.component('portabilidad-light-boxes', {
    data: function () {
        return {
            mensajeInicio: undefined,
            promoHtml: undefined,
            mensajeFin: undefined,
            preguntasHtml: undefined,
            promoBienvenidaOriginal: undefined,
            preguntasFrecuentesOriginal: undefined,
            codigoPromocionalOriginal: undefined,
            promoOperadora: ''
        }
    },
    mounted: function () {
        $(".modal").modal();
    },
    props: {
        esFormularioReferido: Boolean
    },

    methods: {
        abrirModal: function (evento) {
            let idModal = evento.target.getAttribute('data-target');
            $('#' + idModal).modal('open');
        },
        cerrarModal: function (evento) {
            let idModal = evento.target.getAttribute('data-cerrar-modal');
            $('#' + idModal).modal('close');
        },
        completarPromoBienvenida(promoBienvenida) {
            this.mensajeInicio = promoBienvenida.mensajeInicio;
            this.promoHtml = promoBienvenida.promoHtml;
            this.mensajeFin = promoBienvenida.mensajeFin;
        },
        completarPreguntasFrecuentes(preguntasFrecuentes) {
            this.preguntasHtml = preguntasFrecuentes.preguntasHtml;
        },
        guardarComoPromoOriginal(promocion) {
            this.promoBienvenidaOriginal = promocion.promoBienvenida;
            this.preguntasFrecuentesOriginal = promocion.preguntasFrecuentes;
            this.codigoPromocionalOriginal = promocion.beneficio.codigoPromocional;
        },
        completarLightboxesYGuardarPromoSinOperadora(promocionOperadora) {
            this.completarPromoCorrespondiente(promocionOperadora);
            this.guardarComoPromoOriginal(promocionOperadora);
        },
        completarPromoCorrespondiente(promocionOperadora) {
            promocionOperadora ? this.completarInformacionLightboxes(promocionOperadora) : this.completarPromoOriginal();
        },
        completarInformacionLightboxes(campania) {
            this.limpiarPromo();
            this.completarPromoBienvenida(campania.promoBienvenida);
            this.completarPreguntasFrecuentes(campania.preguntasFrecuentes);
            this.$parent.actualizarCodigoPromocional(campania.beneficio.codigoPromocional);
            this.cambiarPromoOperadora(campania);

        },
        completarPromoOriginal() {
            this.completarPromoBienvenida(this.promoBienvenidaOriginal);
            this.completarPreguntasFrecuentes(this.preguntasFrecuentesOriginal);
            this.$parent.actualizarCodigoPromocional(this.codigoPromocionalOriginal);
            this.limpiarPromo();
        },
        limpiarPromo() {
            this.promoOperadora = '';
        },
        cambiarPromoOperadora(promo) {
            this.abrirModalPromoBienvenida(promo);
            switch (promo.operadora) {
                case "CLARO":
                    this.promoOperadora = 'pnt-promocion-operadora-claro';
                    break;
                case "PERSONAL":
                    this.promoOperadora = 'pnt-promocion-operadora-personal';
                    break;
                case "MOVISTAR":
                    this.promoOperadora = 'pnt-promocion-operadora-movistar';
                    break;
            }
        },
        abrirModalPromoBienvenida(promo) {
            if (!this.esFormularioReferido && promo.operadora) {
                $('#modal-combo').modal('open');
            }
        }
    },
    computed: {
        hayPromocion: function () {
            return this.promoHtml != undefined;
        },
        hayPreguntas: function () {
            return this.preguntasHtml != undefined;
        }
    },
    template: document.getElementById("pnt-template-light-boxes").innerHTML
});