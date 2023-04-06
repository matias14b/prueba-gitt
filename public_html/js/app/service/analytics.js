tuenti.service.analytics = (function () {

  function eventoPaginaVirtual(pathPaginaVirtual) {
    dataLayer.push(
      {
        event: "trackPageview",
        pageName: pathPaginaVirtual
      }
    );
  }

  function trackEventNuevoChip(accion, etiqueta, valorPersonalizado) {
    trackEvent("Alta de chip", accion, etiqueta, valorPersonalizado);
  }

  function trackEventReemplazoChip(accion, etiqueta, valorPersonalizado) {
    trackEvent("Reemplazo de chip", accion, etiqueta, valorPersonalizado);
  }

  function trackEventNuevoChipReferido(accion, etiqueta, valorPersonalizado) {
    trackEvent("Alta de chip Referido", accion, etiqueta, valorPersonalizado);
  }

  function trackEventPortabilidad(accion, etiqueta, valorPersonalizado) {
    trackEvent("Portabilidad", accion, etiqueta, valorPersonalizado);
  }

  function trackEvent(categoria, accion, etiqueta, valorPersonalizado) {
    dataLayer.push(
      {
        event: "trackEvent",
        eventCategory: categoria,
        eventAction: accion,
        eventLabel: etiqueta,
        custom1: valorPersonalizado ? valorPersonalizado : undefined
      }
    );
  }

  function eventoCheckoutViewNuevoChip(paso, nombreProducto) {
    eventoCheckoutView("Chip", paso, nombreProducto);
  }

  function eventoCheckoutViewPortabilidad(paso, nombreProducto, portabilidad, modalidadEntregaChip) {
    eventoCheckoutView("Portabilidad", paso, nombreProducto, portabilidad, modalidadEntregaChip);
  }

  function eventoCheckoutView(categoria, paso, nombreProducto, portabilidad, modalidadEntregaChip) {
    dataLayer.push(
      {
        event: "checkoutView",
        step: paso,
        operadora: portabilidad ? portabilidad.operadora : undefined,
        tipoPlan: portabilidad ? portabilidad.plan : undefined,
        entregaChip: portabilidad && modalidadEntregaChip ? modalidadEntregaChip : undefined,
        productos: [{
          name: nombreProducto,
          category: categoria,
          quantity: 1
        }]
      }
    );
  }

  function eventoTrackTransactionNuevoChip(nuevoChipId, nombreProducto) {
    dataLayer.push(
      {
        event: "trackTransaction",
        compra: {
          id: nuevoChipId
        },
        productos: [{
          name: nombreProducto,
          category: "Chip",
          quantity: 1
        }]
      });
  }

  function eventoTrackTransactionPortabilidad(nombreProducto, portabilidad, modalidadEntregaChip) {
    dataLayer.push(
      {
        event: "trackTransaction",
        operadora: portabilidad.operadora,
        tipoPlan: portabilidad.plan,
        entregaChip: modalidadEntregaChip,
        compra: {
          id: portabilidad.id
        },
        productos: [{
          name: nombreProducto,
          category: "Portabilidad",
          quantity: 1
        }]
      }
    );
  }

  //Eventos legacy conservados por instrucción de Tuenti
  function eventoInteractivo(evento, categoria, accion, etiqueta) {
    dataLayer.push(
      {
        event: evento,
        eventCategory: categoria,
        eventAction: accion,
        eventLabel: etiqueta,
        eventValue: 1,
        eventNonInteraction: false
      }
    );
  }

  function eventoNoInteractivo(evento, categoria, accion, etiqueta, valor) {
    dataLayer.push(
      {
        event: evento,
        eventCategory: categoria,
        eventAction: accion,
        eventLabel: etiqueta,
        eventValue: 1,
        pedidoId: valor,
        eventNonInteraction: true
      }
    );
  }

  function eventoProvincia(provincia) {
    dataLayer.push(
      {
        event: 'trackEvent',
        provincia: provincia.toUpperCase()
      }
    );
  }

  function eventoOperadora(operadora) {
    dataLayer.push(
      {
        event: 'trackEvent',
        operadora: operadora.toUpperCase()
      }
    );
  }

  function autogestionDatosLogin() {
    eventoAutogestion('Datos', '{{Portabilidad/LineaNueva}}');
  }

  function autogestionPortabilidadBuscar() {
    eventoAutogestion('Numero Chip', 'Portabilidad');
  }

  function autogestionLineaNuevaBuscar() {
    eventoAutogestion('Confirmacion Datos', 'LineaNueva');
  }

  function autogestionPortabilidadEnviarChip() {
    eventoAutogestion('Confirmacion Chip', 'Portabilidad');
  }

  function eventoAutogestion(accion, etiqueta) {
    dataLayer.push({
      'event': 'Autogestion',
      'eventCategory': 'Autogestion',
      'eventAction': accion,
      'eventLabel': etiqueta
    })
  }

  //Fin eventos legacy

  return {
    eventoPaginaVirtual: eventoPaginaVirtual,
    trackEventNuevoChip: trackEventNuevoChip,
    trackEventNuevoChipReferido: trackEventNuevoChipReferido,
    trackEventPortabilidad: trackEventPortabilidad,
    eventoCheckoutViewNuevoChip: eventoCheckoutViewNuevoChip,
    eventoCheckoutViewPortabilidad: eventoCheckoutViewPortabilidad,
    eventoTrackTransactionNuevoChip: eventoTrackTransactionNuevoChip,
    eventoTrackTransactionPortabilidad: eventoTrackTransactionPortabilidad,
    eventoInteractivo: eventoInteractivo,
    eventoNoInteractivo: eventoNoInteractivo,
    eventoProvincia: eventoProvincia,
    eventoOperadora: eventoOperadora,
    trackEventReemplazoChip: trackEventReemplazoChip,
    autogestionDatosLogin: autogestionDatosLogin,
    autogestionPortabilidadBuscar: autogestionPortabilidadBuscar,
    autogestionLineaNuevaBuscar: autogestionLineaNuevaBuscar,
    autogestionPortabilidadEnviarChip: autogestionPortabilidadEnviarChip
  };

})();
