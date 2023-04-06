Vue.component('buscador-puntos-retiro', {
  data: function () {
    return {
      puntosDeRetiroHabilitados: [],
      listadoProvincias: [],
      listadoLocalidades: [],
      provinciaElegida: '',
      localidadElegida: '',
    };
  },
  watch: {
    'provinciaElegida': {
      handler: function () {
        this.cargarLocalidades();
        if (this.localidadElegida !== '') {
            this.resetInputLocalidad();
        }
      }
    }
  },
  computed: {
    localidadElegidaPerteneceALocalidades() {
      const nombreLocalidades = this.listadoLocalidades.map(localidad => localidad.nombre);
      return nombreLocalidades.includes(this.localidadElegida);
    },
    hayLocalidadesCargadas: function () {
      return this.listadoLocalidades.length > 0;
    },
    puntosDeRetiroDeLaLocalidadElegida: function () {
      var puntosDeRetiroParaMostrar = [];
      this.convertirEspaciosEnBlancoANull();
      if (this.hayPuntosDeRetiroCargados && this.localidadElegida) {
        this.puntosDeRetiroHabilitados.forEach(puntoDeRetiro => {
          if (puntoDeRetiro.localidad.nombre.split(/(?= -).*/)[0].includes(this.localidadElegida) && puntoDeRetiro.localidad.provincia.valor === this.provinciaElegida) {
            puntosDeRetiroParaMostrar.push(puntoDeRetiro);
          }
        })
      }
      return puntosDeRetiroParaMostrar.sort(this.comparadorPuntosDeRetiro);
    },
    hayPuntosDeRetiroCargados: function () {
      return this.puntosDeRetiroHabilitados.length > 0;
    },
  },
  methods: {
    resetInputLocalidad: function () {
      this.localidadElegida = '';
    },
    convertirEspaciosEnBlancoANull: function () {
      this.puntosDeRetiroHabilitados.forEach(p => {
        if (/^\s+$/.test(p.horario)) {
          p.horario = null;
        }
      });
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

    crearLocalidad: function (puntoDeRetiro) {
      return {
        id: puntoDeRetiro.localidad.id,
        nombre: puntoDeRetiro.localidad.nombre.split(/(?= -).*/)[0],
        provincia: puntoDeRetiro.localidad.provincia.valor
      };
    },

    agregarLocalidadSiNoSeRepite: function (localidad) {
      if (!this.existeLocalidad(localidad) && localidad.provincia === this.provinciaElegida) {
        this.listadoLocalidades.push(localidad);
      }
    },

    agregarProvinciaSiNoSeRepite: function (provincia) {
      if (!this.existeProvincia(provincia)) {
        this.listadoProvincias.push(provincia);
      }
    },

    crearProvincia: function (puntoDeRetiro) {
      return {
        valor: puntoDeRetiro.localidad.provincia.valor,
        nombre: puntoDeRetiro.localidad.provincia.nombre
      };
    },

    cargarLocalidades: function () {
      this.listadoLocalidades = [];

      this.puntosDeRetiroHabilitados.forEach(puntoDeRetiro => {
        let localidad = this.crearLocalidad(puntoDeRetiro);
        this.agregarLocalidadSiNoSeRepite(localidad);
      });
      this.listadoLocalidades.sort(this.comparadorProvinciasYLocalidades);
    },

    cargarProvincias: function () {
      this.puntosDeRetiroHabilitados.forEach(puntoDeRetiro => {
        let provincia = this.crearProvincia(puntoDeRetiro);
        this.agregarProvinciaSiNoSeRepite(provincia);
      });
      this.listadoProvincias.sort(this.comparadorProvinciasYLocalidades);
    },

    buscarPuntosDeRetiroHabilitados: function () {
      tuenti.service.nuevoChip.buscarPuntosDeRetiroHabilitados()
        .done((respuesta) => {
          this.puntosDeRetiroHabilitados = respuesta;

          this.cargarProvincias();
        }
        )
        .fail(function (error) {
          console.log(error);
        })
    },

    focusEnInput: function () {
      this.$refs.localidad.focus();
    },

  },
  mounted: function () {
    this.buscarPuntosDeRetiroHabilitados();
  },
  template: document.getElementById("pnt-template-buscador-puntos-retiro").innerHTML

});




