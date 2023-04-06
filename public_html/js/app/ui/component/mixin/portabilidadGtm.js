export const portabilidadGtm = {
  methods: {
    dispararEventoPaginaVirtual (pathPaginaVirtual) {
      tuenti.service.analytics.eventoPaginaVirtual(pathPaginaVirtual);
    },
    dispararTrackEvent (accion, etiqueta, valorPersonalizado) {
      tuenti.service.analytics.trackEventPortabilidad(accion, etiqueta, valorPersonalizado);
    },
    dispararEventoCheckoutView (paso, nombreProducto, portabilidad) {
      if (portabilidad) {
        tuenti.service.analytics.eventoCheckoutViewPortabilidad(paso, nombreProducto, portabilidad, this.determinarModalidadEntrega(portabilidad.solicitudChip));
      } else {
        tuenti.service.analytics.eventoCheckoutViewPortabilidad(paso, nombreProducto);
      }
    },
    dispararEventoTrackTransaction (nombreProducto, portabilidad) {
      tuenti.service.analytics.eventoTrackTransactionPortabilidad(nombreProducto, portabilidad, this.determinarModalidadEntrega(portabilidad.solicitudChip));
    },
    dispararEventoSeleccionLocalidad (accion, localidadId, listaLocalidades, valorProvincia, listaProvincias) {
      let nombreLocalidad = listaLocalidades.find(loc => loc.id === localidadId).nombre
      let nombreProvincia = listaProvincias.find(prov => prov.valor === valorProvincia).nombre
      this.dispararTrackEvent(accion, nombreProvincia, nombreLocalidad);
    },
    determinarModalidadEntrega (solicitudChip) {
      if (solicitudChip) {
        if (solicitudChip.pedidoPuntoRetiroChip) {
          return "RETIRA TU CHIP GRATIS";
        } else {
          return "TE LO MANDAMOS GRATIS";
        }
      }
      return "YA TENGO MI CHIP TUENTI";
    }
  }

};