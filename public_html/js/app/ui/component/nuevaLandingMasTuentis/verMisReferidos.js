Vue.component("ver-mis-referidos", {
  data: function () {
    return {
      estadosMensaje: [
        { estado: "ABIERTA", mensaje: "Todavía no es Tuenti" },
        { estado: "CANCELADA", mensaje: "Portabilidad Cancelada" },
        { estado: "ERROR", mensaje: "Portabilidad en Error" },
        { estado: "CERRADA", mensaje: "Ganaste 5GB" },
      ],
      estadoSeleccionado: "",
      referidos: [],
    };
  },
  props: {
    numeroLinea: String,
  },
  watch: {
    numeroLinea: function (nuevoNumeroLinea) {
      if (nuevoNumeroLinea) {
        this.buscarReferidosPorCodigoReferido(nuevoNumeroLinea);
      }
    },
  },
  computed: {
    referidosFiltrados: function () {
      return this.referidos.filter((referido) =>
        referido.estado.includes(this.estadoSeleccionado)
      );
    },
  },
  methods: {
    buscarReferidosPorCodigoReferido(codigoReferido) {
      tuenti.service.referido
        .buscarReferidosPorCodigoReferido(codigoReferido)
        .then((respuesta) => {
          this.referidos = respuesta.data;
        });
    },
  },
  template: document.getElementById("pnt-js-ver-mis-referidos").innerHTML,
});

