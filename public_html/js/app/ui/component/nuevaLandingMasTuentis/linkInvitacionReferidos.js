Vue.component("link-invitacion-referidos", {
  data: function () {
    return {
      urlReferidos: "<INVITA_BASE_URL>",
      source: "link-mgm",
      campania: "mastuentis",
      apiWhatpsApp: "https://api.whatsapp.com/send?text=",
      mensajeInvitacion:
        "¡No hay excusas! Pasate con tu número a Tuenti que el precio de lo que gastás por mes lo ponés vos. Y si usás este link, tenés los primeros 3 meses con 12GB a $300 + *10GB de regalo* por ser mi referido. Entrá aca https://bit.ly/2EplHrs y ganamos los dos 🎁🎁 #MasTuentis",
      mensajeMeme:
        "¡No hay excusas! Pasate con tu número a Tuenti que el precio de lo que gastás por mes lo ponés vos. Y si usás este link, tenés los primeros 3 meses con 12GB a $300 + *10GB de regalo* por ser mi referido. Entrá aca https://bit.ly/2EplHrs y ganamos los dos 🎁🎁 #MasTuentis",
    };
  },
  computed: {
    urlMeme: function () {
      return `${this.urlReferidos}/img/memes/meme-batman.jpg`;
    },
    urlInvitacion: function () {
      return `${this.urlReferidos}/formulario`;
    },
    linkInvitacion: function () {
      return `${this.urlInvitacion}?utm_source=${this.source}&utm_medium=${this.numeroLinea}&utm_campaign=${this.campania}`;
    },
  },
  props: {
    esVisible: {
      type: Boolean,
      default: true,
    },
    numeroLinea: String,
  },
  methods: {
    async copiarLinkAlPortapapeles() {
      await navigator.clipboard.writeText(this.linkInvitacion);
      this.mostrarToastExitoCopiado();
    },
    compartirPorWhatsApp() {
      if(navigator.share && this.esDistintoAWindowsSistemaDispositivo()) {
        if(this.esAndroid()) {
          this.compartirMensajeConMeme();
        } else {
          this.compartirMensajeShareApi();
        }
      } else {
        this.abrirEnDesktop();
      }
    },
    mostrarToastExitoCopiado() {
      const opciones = {
        animation: true,
        delay: 2000
      }
      const toastHtml = document.getElementById("toastMensajeExito");
      let toast = new bootstrap.Toast(toastHtml, opciones);
      toast.show();
    },
    abrirEnDesktop() {
      window.open(
        `${this.apiWhatpsApp}${encodeURIComponent(this.mensajeInvitacion)}`,
        "_blank"
      );
    },
    esAndroid() {
      return navigator.userAgent.match(/Android/i);
    },
    compartirMensajeShareApi() {
      navigator.share({
        title: "Traé a tus amigos a Tuenti",
        text: this.mensajeInvitacion,
      });
    },
    async compartirMensajeConMeme() {
      let file = await tuenti.service.referido.buscarImagen(this.urlMeme);
      const files = [file];
      const shareData = {
        title: "Traé a tus amigos a Tuenti",
        text: this.mensajeMeme,
        files: files
      };
      navigator.share(shareData);
    },
    esDistintoAWindowsSistemaDispositivo() {
      let platform = navigator?.userAgentData?.platform || navigator?.platform;
      return !platform.includes("Win");
    }
  },
  template: document.getElementById("pnt-js-link-invitacion-referidos")
    .innerHTML,
});
