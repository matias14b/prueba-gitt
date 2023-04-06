Vue.component('portabilidad-stepper-horizontal', {
    name: 'Stepper',
    props: {
        currentPosition: Number,
        formularioReferidos: Boolean
    },
    data() {
        return {
            transitionType: 'slide',
            options: {
                headers: this.formularioReferidos ? [
                    { title: 'Datos del titular' },
                    { title: 'Datos de la linea a portar' },
                    { title: 'Fotos DNI' },
                    { title: 'Tu firma' },
                    { title: '¡Listo!' }] : [
                    { title: '¿Quién sos?' },
                    { title: 'Tu línea' },
                    { title: 'Fotos DNI' },
                    { title: 'Tu firma' },
                    { title: '¡Listo!' }],
            }
        }
    },
    template: document.getElementById("pnt-template-stepper-horizontal").innerHTML
});