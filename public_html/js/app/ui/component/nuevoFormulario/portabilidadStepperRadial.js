Vue.component('portabilidad-stepper-radial', {
    data: function () {
        return {
            esVisible: true,
            totalDePasos: 4,
            color: '#FF0066',
            colorDeFondo: '#DFDFDF',
            diametro: 100
        };
    },
    props: {
        pasosCompletos: Number
    },
    components: {
        "vue-radial-progress": RadialProgressBar
    },
    computed: {
        titulo() {
            switch (this.pasosCompletos) {
                case 0:
                    return "Cargá los datos del titular de la línea a portar";
                case 1:
                    return "Cargá los datos de la línea a portar"
                case 2:
                    return "Cargá las fotos del DNI"
                case 3:
                    return "Dame la firma"
            }
        }
    },
    methods: {
        ocultar() {
            this.esVisible = false;
        },
        mostrar() {
            this.esVisible = true;
        }
    },
    template: document.getElementById("pnt-template-stepper-radial").innerHTML
});