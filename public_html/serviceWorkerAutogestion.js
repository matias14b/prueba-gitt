const DIR_IMG = "../../../icon/";
const STATIC_CACHE_NAME = "static-cache-autogestion";
const OFFLINE_URL = "autogestion-offline.html";
const ASSETS_OFFLINE = ['autogestion-offline.html', 'fonts/material-icons.woff2', 'fonts/CatamaranRegular.ttf'];
const URL_BASE_AUTOGESTION = "<AUTOGESTION_BASE_URL>"

addEventListener('install', evento => {
  evento.waitUntil(
    caches.open(STATIC_CACHE_NAME)
      .then(cache => {
        cache.addAll(ASSETS_OFFLINE);
      })
  );
});

addEventListener('fetch', evento => {
  const { request } = evento;

  //Cancelo esto si la request es de tipo parcial (con header 'range') ya que Service Worker de momento no lo puede manejar.
  if (request.headers.has('range')) return;

  evento.respondWith(
    fetch(request)
      .catch(error => manejarErrorAlBuscarRecurso(request))
  );
});

function manejarErrorAlBuscarRecurso(request) {
  if (request.mode === 'navigate') {
    return caches.match(OFFLINE_URL);
  } else if (esRequestDeAssetOffline(request)) {
    return caches.match(request.url);
  }
}

function esRequestDeAssetOffline(request) {
  return ASSETS_OFFLINE.some(asset => request.url.includes(asset));
}

self.addEventListener("push", evento => {
  if (Notification && Notification.permission === "granted") {

    const opciones = {
      body: "Entrá a Autogestión para ver las novedades de tu portabilidad.",
      icon: DIR_IMG + "android-chrome-192x192.png",
      badge: DIR_IMG + "android-badge.png"
    };

    evento.waitUntil(
      self.registration.showNotification("¡Tenemos novedades!", opciones)
    );
  }
});

self.addEventListener('notificationclick', evento => {

  const urlBuscada = new URL("/", self.location.origin).href;

  const cadenaDePromesas = clients.matchAll({
    type: 'window',
    includeUncontrolled: true
  }).then((clientes) => {
    let clienteEncontrado = null;

    for (let i = 0; i < clientes.length; i++) {
      const cliente = clientes[i];
      if (cliente.url.startsWith(urlBuscada)) {
        clienteEncontrado = cliente;
        break;
      }
    }

    if (clienteEncontrado) {
      return clienteEncontrado.focus();
    } else {
      return clients.openWindow(urlBuscada);
    }
  });

  evento.notification.close();
  evento.waitUntil(cadenaDePromesas);
});
