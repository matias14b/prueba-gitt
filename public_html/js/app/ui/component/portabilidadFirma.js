import { prevenirCambioFoco } from "./mixin/prevenirCambioFocoConTab.js";

Vue.component("portabilidad-firma", {
  mixins: [prevenirCambioFoco],
  data: function () {
    return {
      isAtrasHabilitado: true,
      isFirmaHecha: false,
      isInfoPinValida: true,
      pad: null,
      firma: null,
      recaptchaResponse: null,
      portabilidad: {
        numeroPin: null,
        fechaVencimientoPin: null
      },
      interval: null,
      terminosYCondicionesAceptados: false,
      esResolucionDesktop: window.innerWidth >= 600
    };
  },
  props: {
    contadorPin: {
      type: Number,
      default: 30
    },
    correspondePin: {
      type: Boolean,
      default: false
    },
    esTesting: {
      type: Boolean,
      default: false
    }
  },
  watch: {
    portabilidad: {
      handler: function () {
        var self = this;
        var numeroPin = self.portabilidad.numeroPin;
        var fechaVencimientoPin = self.portabilidad.fechaVencimientoPin;
        if (self.ambosVacios(numeroPin, fechaVencimientoPin)) {
          self.isInfoPinValida = true;
        } else if (self.soloUnoCompleto(numeroPin, fechaVencimientoPin)) {
          self.isInfoPinValida = false;
        } else {
          self.$validator.validate().then(function (valid) {
            if (valid) {
              self.isInfoPinValida = true;
            } else {
              self.isInfoPinValida = false;
            }
          });
        }
      },
      deep: true
    }
  },
  mounted: function () {
    this.inicializarPadFirma();
    this.inicializarDatePicker();
    this.$root.$on('resetearRecaptcha', () => this.$refs.recaptcha.reset());
  },
  methods: {
    soloUnoCompleto: function (valorUno, valorDos) {
      return (
        (valorUno !== null &&
          valorUno !== "" &&
          (valorDos === null || valorDos === "")) ||
        (valorDos !== null &&
          valorDos !== "" &&
          (valorUno === null || valorUno === ""))
      );
    },
    ambosVacios: function (valorUno, valorDos) {
      return (
        (valorUno === null || valorUno === "") &&
        (valorDos === null || valorDos === "")
      );
    },
    inicializarPadFirma: function () {
      var ratio = Math.max(window.devicePixelRatio || 1, 1);
      var canvas = document.querySelector("canvas");
      canvas.getContext("2d").scale(ratio, ratio);
      canvas.height = 185;

      if ($(window).width() <= 420) {
        canvas.width = 165;
      } else {
        canvas.width = 300;
      }

      this.pad = new SignaturePad(canvas, {
        throttle: 0,
        minWidth: 0.7,
        maxWidth: 0.9,
        velocityFilterWeight: 0.1,
        onEnd: () => {
          this.firma = this.pad.toDataURL();
          this.isFirmaHecha = true;
        }
      });
    },
    inicializarDatePicker: function () {
      var fechaNacimientoMin = new Date();
      var self = this;
      var options = {
        minDate: fechaNacimientoMin,
        defaultDate: fechaNacimientoMin,
        firstDay: true,
        format: "dd/mm/yyyy",
        i18n: {
          months: [
            "Enero",
            "Febrero",
            "Marzo",
            "Abril",
            "Mayo",
            "Junio",
            "Julio",
            "Agosto",
            "Septiembre",
            "Octubre",
            "Noviembre",
            "Diciembre"
          ],
          monthsShort: [
            "Ene",
            "Feb",
            "Mar",
            "Abr",
            "May",
            "Jun",
            "Jul",
            "Ago",
            "Set",
            "Oct",
            "Nov",
            "Dic"
          ],
          weekdays: [
            "Domingo",
            "Lunes",
            "Martes",
            "Miércoles",
            "Jueves",
            "Viernes",
            "Sábado"
          ],
          weekdaysShort: ["Dom", "Lun", "Mar", "Mie", "Jue", "Vie", "Sab"],
          weekdaysAbbrev: ["D", "L", "M", "M", "J", "V", "S"]
        },
        onSelect: function (valor) {
          var fechaNormalizada = JSON.stringify(valor)
            .split('"')[1]
            .split("T")[0]
            .split("-")
            .reverse()
            .join("/");
          self.$data.portabilidad.fechaVencimientoPin = fechaNormalizada;
        }
      };
      var elems = document.querySelectorAll(
        ".pnt-js-datepicker-fecha-vencimiento-pin"
      );
      var instances = M.Datepicker.init(elems, options);
    },
    limpiarFirma: function () {
      this.pad.clear();
      this.isFirmaHecha = false;
    },
    onCaptchaVerificado: function (recaptchaResponse) {
      this.recaptchaResponse = recaptchaResponse;
    },
    onCatpchaExpirado: function () {
      this.recaptchaResponse = null;
    },
    borrarCampoFechaVencimientoPin: function () {
      this.portabilidad.fechaVencimientoPin = null;
      var label = document.getElementById("pnt-js-label-fecha-vencimiento-pin");
      label.classList.remove("active");
    }
  },
  computed: {
    isSiguienteHabilitado: function () {
      return (
        this.isFirmaHecha &&
        this.isCaptchaCompleto &&
        !this.isContadorVisible &&
        this.isInfoPinValida &&
        this.terminosYCondicionesAceptados
      );
    },
    tamanioCaptcha: function () {
      var anchoDePantalla = document.body.clientWidth;
      if (anchoDePantalla > 450) {
        return "normal";
      } else {
        return "compact";
      }
    },
    datosDelPaso: function () {
      return {
        firma: this.firma,
        portabilidad: this.portabilidad,
        recaptchaResponse: this.esTesting ? 'captchaPasoFirma' : this.recaptchaResponse
      };
    },
    isConteoPinEnCurso: function () {
      return this.contadorPin > 0;
    },
    isCaptchaCompleto: function () {
      return this.esTesting || this.recaptchaResponse != null;
    },
    isCamposPinVacios: function () {
      return this.ambosVacios(
        this.portabilidad.numeroPin,
        this.portabilidad.fechaVencimientoPin
      );
    },
    isContadorVisible: function () {
      return (
        this.correspondePin &&
        this.isConteoPinEnCurso &&
        (this.isCamposPinVacios || !this.isInfoPinValida)
      );
    },
    isMensajePinNoLlegoVisible: function () {
      return (
        this.correspondePin &&
        !this.isConteoPinEnCurso &&
        (this.isCamposPinVacios || !this.isInfoPinValida)
      );
    },
    isCaptchaVisible: function () {
      return (!this.correspondePin && this.recaptchaResponse === null) || (!this.isContadorVisible && this.recaptchaResponse === null);
    }
  },
  components: {
    "vue-recaptcha": VueRecaptcha
  },
  template: document.getElementById("pnt-template-portabilidad-firma").innerHTML
});
