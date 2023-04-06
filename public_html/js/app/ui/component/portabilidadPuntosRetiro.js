import { portabilidadGtm } from "./mixin/portabilidadGtm.js";

Vue.component('portabilidad-puntos-retiro', {
  updated: function () {
    this.$nextTick(function () {
      $('select').formSelect();
    });
  },
  mixins: [portabilidadGtm],
  data: function () {
    return {
      listadoPuntosDeRetiro: [],
      listadoProvincias: [],
      listadoLocalidades: [],
      provinciaElegida: '',
      localidadElegida: '',
      solicitudChip: {
        pedidoPuntoRetiroChip: {
          puntoRetiroChip: {
            id: null
          }
        }
      },
      localidadSeleccionada: {
        id: null,
      }
    };
  },
  props: {
    isActivoBotonRetiro: {
      type: Boolean
    }
  },
  watch: {
    'isActivoBotonRetiro': {
      immediate: true,
      handler: function (val, oldVal) {
        var self = this;
        if (val && !self.hayPuntosDeRetiroCargados) {
          self.$emit("toggle-spinner");
          tuenti.service.nuevoChip.buscarPuntosDeRetiroHabilitados()
            .done(function (respuesta) {
              self.inicializarDatos(respuesta);
            })
            .fail(function (error) {
              console.log(error);
            })
            .always(function () {
              self.$emit("toggle-spinner");
            });
        }
      }
    },
    'provinciaElegida': {
      handler: function (val) {
        if (val !== '') {

          //Evento legacy conservado por instrucción de Tuenti
          tuenti.service.analytics.eventoProvincia(val);
          //Fin evento legacy

          this.cargarListadoLocalidades();
        }
      }
    },
    'localidadElegida': {
      handler: function (localidadNombre) {
        if (localidadNombre !== '') {
          let localidadNombre = this.localidadElegida;
          const localidadEncontrada = this.listadoLocalidades.filter(localidad => localidad.nombre === localidadNombre)
            .map(localidad => localidad.id);
          if (localidadEncontrada.length > 0) {
            this.localidadSeleccionada.id = localidadEncontrada[0];
            this.dispararEventoSeleccionLocalidad(
              "Punto de retiro",
              this.localidadSeleccionada.id,
              this.listadoLocalidades,
              this.provinciaElegida,
              this.listadoProvincias);
          }
        }
      }
    },
    'solicitudChip.pedidoPuntoRetiroChip.puntoRetiroChip': {
      handler: function (val, oldVal) {
        var self = this;
        if (self.isSolicitudChipCompleta) {
          self.$validator.validate().then(function (valid) {
            if (valid) {
              self.$emit("set-punto-retiro", self.solicitudChip);
            } else {
              self.$emit("set-punto-retiro", null);
            }
          });
        } else {
          self.$emit("set-punto-retiro", null);
        }
      },
      deep: true
    }
  },
  computed: {
    dropdownPuntosDeRetiro: function () {
      var puntosDeRetiroParaMostrar = [];
      if (this.hayPuntosDeRetiroCargados && this.localidadElegida) {
        for (var puntoDeRetiro of this.listadoPuntosDeRetiro) {
          if (puntoDeRetiro.localidad.nombre.includes(this.localidadElegida) && puntoDeRetiro.localidad.provincia.valor === this.provinciaElegida) {
            puntosDeRetiroParaMostrar.push(puntoDeRetiro);
          }
        }
      }
      return puntosDeRetiroParaMostrar.sort(this.comparadorPuntosDeRetiro);
    },
    isListadoLocalidadesHabilitado: function () {
      return this.provinciaElegida.length > 0;
    },
    isListadoPuntosHabilitado: function () {
      return this.localidadElegida.length > 0;
    },
    hayPuntosDeRetiroCargados: function () {
      return this.listadoPuntosDeRetiro.length > 0;
    },
    hayProvinciasCargadas: function () {
      return this.listadoProvincias.length > 0;
    },
    hayLocalidadesCargadas: function () {
      return this.listadoLocalidades.length > 0;
    },
    localidadElegidaPerteneceALocalidades() {
      const nombreLocalidades = this.listadoLocalidades.map(localidad => localidad.nombre);
      if (nombreLocalidades.includes(this.localidadElegida)) {
        return true;
      } else {
        this.solicitudChip.pedidoPuntoRetiroChip.puntoRetiroChip.id = null;
        return false;
      }
    },
    isSolicitudChipCompleta: function () {
      return this.solicitudChip.pedidoPuntoRetiroChip.puntoRetiroChip.id !== null;
    },
  },
  methods: {
    inicializarDatos: function (puntosDeRetiro) {
      this.listadoPuntosDeRetiro = puntosDeRetiro;
      this.cargarListadoProvincias();
    },
    comparadorProvinciasYLocalidades: function (a, b) {
      if (a.nombre < b.nombre) {
        return -1;
      }
      if (a.nombre > b.nombre) {
        return 1;
      }
      return 0;
    },
    comparadorPuntosDeRetiro: function (a, b) {
      if (a.direccion < b.direccion) {
        return -1;
      }
      if (a.direccion > b.direccion) {
        return 1;
      }
      return 0;
    },
    cargarListadoProvincias: function () {
      this.listadoProvincias = [];
      var provincia;

      for (var puntoDeRetiro of this.listadoPuntosDeRetiro) {
        provincia = {
          valor: puntoDeRetiro.localidad.provincia.valor,
          nombre: puntoDeRetiro.localidad.provincia.nombre
        };
        if (!this.existeProvincia(provincia)) {
          this.listadoProvincias.push(provincia);
        }
      }
      this.listadoProvincias.sort(this.comparadorProvinciasYLocalidades);
    },
    cargarListadoLocalidades: function () {
      this.listadoLocalidades = [];

      var localidad;
      for (var puntoDeRetiro of this.listadoPuntosDeRetiro) {
        localidad = {
          id: puntoDeRetiro.localidad.id,
          nombre: puntoDeRetiro.localidad.nombre.split(/(?= -).*/)[0],
          provincia: puntoDeRetiro.localidad.provincia.valor
        };
        if (!this.existeLocalidad(localidad) && localidad.provincia === this.provinciaElegida) {
          this.listadoLocalidades.push(localidad);
        }
      }
      this.listadoLocalidades.sort(this.comparadorProvinciasYLocalidades);
    },
    existeLocalidad: function (localidadBuscada) {
      for (var localidad of this.listadoLocalidades) {
        if (localidad.nombre.includes(localidadBuscada.nombre)) {
          return true;
        }
      }
      return false;
    },
    existeProvincia: function (provinciaBuscada) {
      for (var provincia of this.listadoProvincias) {
        if (provincia.valor === provinciaBuscada.valor) {
          return true;
        }
      }
      return false;
    },
    focusEnInput: function () {
      this.$refs.localidad.focus();
    },
    eliminarClaseActiveLabel: function () {
      $('.pnt-js-label-provincia-pdr').removeClass("active");
    }
  },
  template: document.getElementById("pnt-template-portabilidad-puntos-de-retiro").innerHTML
});
