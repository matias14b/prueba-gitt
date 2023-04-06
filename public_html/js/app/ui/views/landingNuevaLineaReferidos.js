tuenti.ui.views.landingNuevaLineaReferidos = (function () {

    let parametroReferente = 'referente';
    let urlFormuReferidosConParametro = "https://referidos.tuenti.com.ar/formulario?referente=";
    let $inputUrlFormularioReferidos = $("#urlFormularioReferidos");
    let $botonInvitaAhora = $(".pnt-contenedor-boton-referidos-LN button");
    let $linkCompartir = $(".pnt-contenedor-boton-referidos-LN span a");
    let mensajeInvita = "¡Te elegí para que tengas BANDA de GIGAS!  En Tuenti VOS decidís lo que gastás por mes. ¡Y si pedís un número nuevo con este link, ganamos saldo los dos! Entrá acá: https://bit.ly/3x14M5d #MasTuentis";
    let mostrarToast = tuenti.ui.views.utils.mostrarToast;
    let apiWhatsApp = "https://api.whatsapp.com/send?text=";
    let urlMeme = '<REFERIDOS_BASE_URL>/img/memes/meme-referidos.png';
    let mensajeMeme = '¡Date cuenta! En Tuenti VOS decidís lo que gastás por mes. ¡Y si pedís un número nuevo con este link, ganamos saldo los dos! Entrá acá: https://bit.ly/3x14M5d #MasTuentis'
  
    function init() {
      $(".pnt-js-contenedor-botones-redes").hide();
      crearLinkParaReferido();
      bindearBotonInvitaAhora();
      bindearLinkCompartir();
    }
  
    function crearLinkParaReferido() {
      let parametros = new URLSearchParams(window.location.search);
      if (parametros.has(parametroReferente)) {
        let referente = parametros.get(parametroReferente);
        $inputUrlFormularioReferidos.val(urlFormuReferidosConParametro + referente);
      }
    }
  
    function bindearBotonInvitaAhora() {
      $botonInvitaAhora.on("click", function (evento) {
        enviarEventoGtmCta("INVITA AHORA LN");
        if (navigator.share) {
          compartirImagenSiEsAndroid()
        } else {
          abrirWhatsApp();
        }
      });
    }
  
    function esAndroid() {
      var userAgent = navigator.userAgent.toLowerCase();
      return userAgent.indexOf("android") > -1;
    }
  
    async function compartirMensajeEImagenPorShareApi() {
      fetch(urlMeme)
        .then(res => res.blob())
        .then(blob => {
          let file = new File([blob], urlMeme, { type: "image/jpeg" })
          let filesArray = [file]
          return filesArray;
        })
        .then(files => {
          navigator.share({
            title: 'Traé a tus amigos a Tuenti',
            text: mensajeMeme,
            files: files
          });
        })
    }
  
    function compartirPorShareApi() {
      navigator.share({
        title: 'Traé a tus amigos a Tuenti',
        text: mensajeInvita
      });
    }
  
    function compartirImagenSiEsAndroid() {
      if(esAndroid()) {
        compartirMensajeEImagenPorShareApi(); 
       } else {
         compartirPorShareApi();
       }
    }
  
    function abrirWhatsApp() {
      window.open(`${apiWhatsApp}${encodeURIComponent(crearMensaje())}`, '_blank');
    }
  
    function crearMensaje() {
      return mensajeInvita.replace("ENLACEFORMULARIO", $inputUrlFormularioReferidos.val());
    }
  
    function bindearLinkCompartir() {
      $($linkCompartir).on("click", function (evento) {
        enviarEventoGtmCta("aca");
        evento.preventDefault();
        $inputUrlFormularioReferidos.attr("type", "text");
        $inputUrlFormularioReferidos.select();
        document.execCommand("copy");
        $inputUrlFormularioReferidos.attr("type", "hidden");
        mostrarToast("Link copiado al portapapeles, ¡compartilo con tus amigos!", "pnt-toast-success");
      });
    }
  
    function enviarEventoGtmCta(textoAccion) {
      dataLayer.push({
        event: "trackEvent",
        eventCategory: "modulo de referidos LN",
        eventAction: "CTA",
        eventLabel: textoAccion
      });
  
    }
  
    return {
      init: init
    };
  
  })();
  
  $(document).ready(function () {
    tuenti.ui.views.landingNuevaLineaReferidos.init();
  });