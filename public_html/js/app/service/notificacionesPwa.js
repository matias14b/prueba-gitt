tuenti.service.notificacionesPwa = (function () {

  const CLAVE_PUBLICA_PUSH = urlBase64ToUint8Array(
    "<WEBPUSH_PUBLIC_KEY>"
  );
  let pushManager;
  let portabilidadToken;

  function init(portaToken) {
    if ("Notification" in window) {
      portabilidadToken = portaToken;
      solicitarPermisoSuscripcionNotificaciones();
    } else {
      mostrarMensajeError("¡Ups! Tu dispositivo no admite el envío de notificaciones. No vamos a poder informarte novedades por este medio.");
    }
  }

  function solicitarPermisoSuscripcionNotificaciones() {
    Notification.requestPermission()
      .then(procesarPermisoDeUsuario)
      .catch(mostrarMensajeErrorHabilitandoNotificaciones);
  }

  async function procesarPermisoDeUsuario(permiso) {
    if (permiso === "granted") {
      pushManager = tuenti.service.serviceWorker.pushManager;
      suscripcionExistente = await buscarSuscripcionExistente();
      if (suscripcionExistente === null) {
        suscribirUsuario();
      }
    } else {
      mostrarMensajeInfo("¡Hola! Te recomendamos habilitar las notificaciones para enterarte de las novedades de tu trámite.");
    }
  }

  function mostrarMensajeErrorHabilitandoNotificaciones(error) {
    mostrarMensajeError(
      "¡Ups! Hubo un problema habilitando las notificaciones"
      + error.response.data ? ": " + error.response.data : "."
    );
  }

  function buscarSuscripcionExistente() {
    return pushManager.getSubscription()
      .then(suscripcion => {
        return suscripcion;
      })
      .catch(mostrarMensajeErrorHabilitandoNotificaciones);
  }

  function suscribirUsuario() {
    pushManager.subscribe({
      userVisibleOnly: true,
      applicationServerKey: CLAVE_PUBLICA_PUSH
    })
      .then(actualizarSuscripcionEnServidor)
      .catch(mostrarMensajeErrorHabilitandoNotificaciones);
  }

  function actualizarSuscripcionEnServidor(suscripcion) {
    return $.ajax({
      cache: false,
      url: tuenti.service.utils.url() + "/api/notificaciones",
      type: "POST",
      contentType: "application/json",
      data: JSON.stringify({
        url: suscripcion.endpoint,
        token: portabilidadToken,
        p256dh: suscripcion.getKey('p256dh'),
        auth: suscripcion.getKey('auth')
      })
    })
      .fail(mostrarMensajeErrorHabilitandoNotificaciones);
  }

  function buscarManifest() {
    return $.ajax({
      cache: false,
      url: tuenti.service.utils.url() + "/api/notificaciones/manifest",
      type: "GET"
    });
  }

  function urlBase64ToUint8Array(base64String) {
    var padding = "=".repeat((4 - (base64String.length % 4)) % 4);
    var base64 = (base64String + padding)
      .replace(/\-/g, "+")
      .replace(/_/g, "/");

    var rawData = window.atob(base64);
    var outputArray = new Uint8Array(rawData.length);

    for (var i = 0; i < rawData.length; ++i) {
      outputArray[i] = rawData.charCodeAt(i);
    }
    return outputArray;
  }

  function mostrarMensajeError(mensaje) {
    tuenti.ui.views.utils.mostrarToast(mensaje, "pnt-toast-error")
  }

  function mostrarMensajeInfo(mensaje) {
    tuenti.ui.views.utils.mostrarToast(mensaje, "pnt-toast-success")
  }

  return {
    init: init,
    buscarManifest: buscarManifest
  };
})();
