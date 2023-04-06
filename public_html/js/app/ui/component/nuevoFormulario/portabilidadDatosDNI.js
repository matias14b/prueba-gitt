Vue.component('portabilidad-datos-dni', {
    data: function () {
        return {
            esVisible: false,
            isAtrasHabilitado: true,
            datosDni: {
                frente: null,
                dorso: null
            },
            tamanioMaximo: 5 * 1024 * 1024,
            extensionesValidas: ['jpeg', 'jpg', 'png'],
            path: {
                frente: '',
                dorso: ''
            }
        };
    },
    computed: {
        frenteValido: function () {
            return this.esArchivoValido(this.datosDni.frente, this.path.frente);
        },
        dorsoValido: function () {
            return this.esArchivoValido(this.datosDni.dorso, this.path.dorso);
        },
        isSiguienteHabilitado: function () {
            return this.frenteValido && this.dorsoValido;
        }
    },
    methods: {
        buscarFotoFrente: function () {
            this.$el.querySelector('.pnt-js-frente').click();
        },
        buscarFotoDorso: function () {
            this.$el.querySelector('.pnt-js-dorso').click();
        },
        obtenerFotoFrente: function (event) {
            this.datosDni.frente = event.target.files[0];
            this.path.frente = document.getElementById("dniFotoFrente").value.split('.').pop().toLowerCase();
        },
        obtenerFotoDorso: function (event) {
            this.datosDni.dorso = event.target.files[0];
            this.path.dorso = document.getElementById("dniFotoDorso").value.split('.').pop().toLowerCase();
        },
        esArchivoValido: function (archivo, extension) {
            return archivo != null
                    && archivo.size <= this.tamanioMaximo
                    && this.extensionesValidas.includes(extension);
        },
        mostrarPaso: function () {
            this.esVisible = true;
        },
        ocultarPaso: function () {
            this.esVisible = false;
        }
    },
    template: document.getElementById("pnt-template-portabilidad-datos-dni").innerHTML
});