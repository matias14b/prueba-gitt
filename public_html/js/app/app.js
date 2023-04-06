var tuenti = tuenti || {};
var tuenti = tuenti || {};
tuenti.ui = tuenti.ui || {};
tuenti.ui.views = tuenti.ui.views || {};
tuenti.service = tuenti.service || {};
tuenti.service.utils = tuenti.service.utils || {};

document.addEventListener('DOMContentLoaded', function () {
    inicializarVue();
    inicializarServiceWorkerAutogestion();

    function inicializarVue() {
        if (esSitioConVue()) {
            app = new Vue({
                el: '#pnt-app'
            });
        }
    }

    function esSitioConVue() {
        return typeof Vue !== 'undefined';
    }

    function inicializarServiceWorkerAutogestion() {
        if (esPaginaAutogestion() && estaServiceWorkerSoportado()) {
            navigator.serviceWorker
                .register("../../serviceWorkerAutogestion.js", {
                    updateViaCache: "none"
                })
                .then(swReg => {
                    tuenti.service.serviceWorker = swReg;
                    self.dispatchEvent(new Event('serviceWorkerCargado'));
                })
                .catch(err => {
                    console.log("Error al registrar el service worker.", err);
                    self.dispatchEvent(new Event('serviceWorkerNoCargado'));
                });
        } else {
            self.dispatchEvent(new Event('serviceWorkerNoCargado'));
        }
    }

    function esPaginaAutogestion() {
        return window.location.href.startsWith("<AUTOGESTION_BASE_URL>");
    }

    function estaServiceWorkerSoportado() {
        return "serviceWorker" in navigator;
    }

});
