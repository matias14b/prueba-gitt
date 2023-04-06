import { validarPaso } from './mixin/portabilidadPasosUtils.js';
import { portabilidadGtm } from "./mixin/portabilidadGtm.js";

Vue.component('portabilidad-datos-envio-chip', {
  updated: function () {
    this.$nextTick(function () {
      $('select').formSelect();
    });
  },
  data: function () {
    return {
      isLocalidadHabilitado: false,
      localidades: [],
      provincias: [
        { valor: "BUENOS_AIRES", nombre: "Buenos Aires" },
        { valor: "CAPITAL_FEDERAL", nombre: "Capital Federal" },
        { valor: "CATAMARCA", nombre: "Catamarca" },
        { valor: "CHACO", nombre: "Chaco" },
        { valor: "CHUBUT", nombre: "Chubut" },
        { valor: "CORDOBA", nombre: "Córdoba" },
        { valor: "CORRIENTES", nombre: "Corrientes" },
        { valor: "ENTRE_RIOS", nombre: "Entre Ríos" },
        { valor: "FORMOSA", nombre: "Formosa" },
        { valor: "JUJUY", nombre: "Jujuy" },
        { valor: "LA_PAMPA", nombre: "La Pampa" },
        { valor: "LA_RIOJA", nombre: "La Rioja" },
        { valor: "MENDOZA", nombre: "Mendoza" },
        { valor: "MISIONES", nombre: "Misiones" },
        { valor: "NEUQUEN", nombre: "Neuquén" },
        { valor: "RIO_NEGRO", nombre: "Río Negro" },
        { valor: "SALTA", nombre: "Salta" },
        { valor: "SAN_JUAN", nombre: "San Juan" },
        { valor: "SAN_LUIS", nombre: "San Luis" },
        { valor: "SANTA_CRUZ", nombre: "Santa Cruz" },
        { valor: "SANTA_FE", nombre: "Santa Fe" },
        { valor: "SANTIAGO_DEL_ESTERO", nombre: "Santiago del Estero" },
        { valor: "TIERRA_DEL_FUEGO", nombre: "Tierra del Fuego" },
        { valor: "TUCUMAN", nombre: "Tucumán" }
      ],
      solicitudChip: {
        envioChip: {
          calle: null,
          altura: null,
          piso: null,
          departamento: null,
          observaciones: null,
          localidad: {
            id: null,
            nombre: null,
            provincia: null
          }
        }
      }
    };
  },
  mixins: [validarPaso, portabilidadGtm],
  watch: {
    'solicitudChip.envioChip': {
      handler: function (val, oldVal) {
        var self = this;
        if (self.isSolicitudChipCompleta) {
          self.$validator.validate().then(function (valid) {
            if (valid) {
              self.$emit("set-envio", self.solicitudChip);
            } else {
              self.$emit("set-envio", null);
            }
          });
        } else {
          self.$emit("set-envio", null);
        }
      },
      deep: true
    },
    'solicitudChip.envioChip.localidad.provincia': {
      handler: function (val, oldVal) {
        var dataComponente = this;

        //Evento legacy conservado por instrucción de Tuenti
        tuenti.service.analytics.eventoProvincia(val);
        //Fin evento legacy

        tuenti.service.localidad.buscar(val)
          .then(function (respuesta) {
            dataComponente.localidades = respuesta.data;
            dataComponente.isLocalidadHabilitado = true;
          })
          .catch(function (err) {
            console.log(err);
          });
      },
      deep: true
    },
    'solicitudChip.envioChip.localidad.nombre': {
      handler: function (localidadNombre) {
        if (localidadNombre !== '') {
          let localidadNombre = this.solicitudChip.envioChip.localidad.nombre;
          const localidadEncontrada = this.localidades.filter(localidad => localidad.nombre === localidadNombre)
                                                      .map(localidadNombre => localidadNombre.id);
          if(localidadEncontrada.length > 0) {
            this.solicitudChip.envioChip.localidad.id = localidadEncontrada[0];
            this.dispararEventoSeleccionLocalidad(
              "Envio de chip",
              this.solicitudChip.envioChip.localidad.id,
              this.localidades,
              this.solicitudChip.envioChip.localidad.provincia,
              this.provincias);
          }
        }
      }
    }
  },
  computed: {
    isSolicitudChipCompleta: function () {
      var solicitudChipCompleta = true;
      var inputLocalidad = this.solicitudChip.envioChip.localidad.nombre;

      this.solicitudChip.envioChip.localidad.nombreLocalidadSeleccionada = this.localidades.filter(localidad => localidad.nombre === inputLocalidad)
                                                                                           .map(localidad => localidad.nombre);
      for (var atributo in this.solicitudChip.envioChip) {
        solicitudChipCompleta = ((this.solicitudChip.envioChip[atributo] !== null && this.solicitudChip.envioChip[atributo] !== "") || (atributo === "piso" || atributo === "departamento" || atributo === "observaciones")) && solicitudChipCompleta === true ? true : false;
      }
      return solicitudChipCompleta;
    }
  },
  methods: {
    focusEnInput: function() {
      this.$refs.localidad.focus();
    }
  },
  template: document.getElementById("pnt-template-portabilidad-datos-solicitud-chip").innerHTML
});
