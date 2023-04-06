Vue.component("generador-link-referidos", {
  data: function () {
    return {
      numeroLinea: "",
      esValido: false,
      noEsTuenti: false,
      recaptchaResponse: null,
      esVisibleSpinner: false,
    };
  },
  methods: {
    async mostrarMensaje() {
      this.esValido = await this.esValidoNumeroLinea();
    },
    async esValidoNumeroLinea() {
      if (this.esFormatoNumeroLineaValido()) {
        this.activarCaptcha();
        return await this.esNumeroTuenti();
        // return true;
      } else {
        return this.noEsFormatoValidoYOcultaValidacionTuenti();
      }
    },
    async esNumeroTuenti() {
      this.inicializarEfectoVisualBusqueda();
      const respuesta = await tuenti.service.referido
        .checkear(this.numeroLinea, this.recaptchaResponse)
        .then((response) => {
          this.noEsTuenti = !response.data;
          return response.data;
        })
        .finally(() => (this.esVisibleSpinner = false));
      return respuesta;
    },
    esFormatoNumeroLineaValido() {
      let regex = new RegExp("^((?!15)(?!0)[0-9]{10})");
      return regex.test(this.numeroLinea);
    },
    noEsFormatoValidoYOcultaValidacionTuenti() {
      this.noEsTuenti = false;
      return false;
    },
    generarLink() {
      this.mostrarBotonCopiarLink();
      this.pasarNumeroLinea();
    },
    mostrarBotonCopiarLink() {
      this.$emit("mostrar-boton-copiar-link", true);
    },
    pasarNumeroLinea() {
      this.$emit("pasar-numero-linea", this.numeroLinea);
    },
    onCaptchaVerificado: function (recaptchaResponse) {
      this.recaptchaResponse = recaptchaResponse;
    },
    onCatpchaExpirado: function () {
      this.recaptchaResponse = null;
    },
    activarCaptcha() {
      this.$refs.invisibleRecaptcha.execute();
    },
    inicializarEfectoVisualBusqueda() {
      this.esVisibleSpinner = true;
      this.noEsTuenti = false;
      this.esValido = false;
    }
  },
  components: {
    "vue-recaptcha": VueRecaptcha,
  },
  template: document.getElementById("pnt-js-generador-link-referidos")
    .innerHTML,
});
