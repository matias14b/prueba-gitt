Vue.component('portabilidad-acciones', {
  props: {
    isPrimerPaso: {
      type: Boolean,
      default: false
    },
    isSiguienteHabilitado: {
      type: Boolean,
      default: false
    },
    isSiguienteVisible: {
      type: Boolean,
      default: true
    },
    isAtrasHabilitado: {
      type: Boolean,
      default: true
    },
    isAtrasVisible: {
      type: Boolean,
      default: true
    },
    datosDelPaso: {},
    textoBotonSiguiente: {
      type: String,
      default: 'Siguiente'
    }
  },
  methods: {
    siguiente: function () {
      this.$emit('siguiente-step', this.datosDelPaso);
    },
    atras: function () {
      this.$emit('atras-step');
    }
  },
  template: document.getElementById("pnt-template-portabilidad-acciones").innerHTML
});