tuenti.ui.views.infoReferidos = (function () {

  let parametroReferente = 'referente';
  let urlFormuReferidosConParametro = "https://invita.tuenti.com.ar/formulario?referente=";
  let $inputUrlFormularioReferidos = $("#urlFormularioReferidos");
  let $botonInvitaAhora = $(".pnt-js-boton-invita-ahora");
  let $botonInvitaAhoraAlternativo = $(".pnt-invita-ahora-alternativo");
  let $linkCompartir = $(".pnt-js-link-invita-ahora");
  let mensajeInvita = "¡Dejá CLARO que querés pasarte a TUENTI! Si usás Claro, venite a Tuenti que ganamos los dos 🙂 El primer mes te regalan 10GB + $800 de saldo para usar cuando quieras por ser mi amigo. Entrá acá 👉🏻 https://bit.ly/3IcWwEA #MasTuentis";
  let apiWhatsApp = "https://api.whatsapp.com/send?text=";
  let urlMeme = '<INVITA_BASE_URL>/img/memes/meme-lionel-hutz.jpg';
  let mensajeMeme = 'Como amigo es mi deber decirte que dejes esa relación tóxica con tu telefonía. Si tenés Claro, pasate a Tuenti que ganamos los dos 🙂 El primer mes te regalan 10GB + $800 de saldo para usar cuando quieras por ser mi amigo. Entrá acá 👉🏻 https://bit.ly/3IcWwEA #MasTuentis'

  function init() {
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
      enviarEventoGtmCta("INVITA AHORA REFECLARO");
      if (navigator.share && !navigator.platform.includes('Win')) {
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
    if (esAndroid()) {
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
      mostrarToast();
    });
  }

  function enviarEventoGtmCta(textoAccion) {
    dataLayer.push({
      event: "trackEvent",
      eventCategory: "modulo de referidos",
      eventAction: "CTA",
      eventLabel: textoAccion
    });
  }

  function mostrarToast() {
    $botonInvitaAhoraAlternativo.on('click', function () {
      let opciones = {
        animation: true,
        delay: 1000
      }
      let elementoToastEnHtml = document.getElementById("toastMensajeExito");
      let toast = new bootstrap.Toast(elementoToastEnHtml, opciones);
      toast.show();
    });
  }

  return {
    init: init
  };
})();

$(document).ready(function () {
  tuenti.ui.views.infoReferidos.init();
});