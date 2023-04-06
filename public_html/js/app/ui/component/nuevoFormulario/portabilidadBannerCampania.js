Vue.component('portabilidad-banner-campania', {
    data: function () {
        return {
            banners: undefined,
            campaniaBackUp: undefined
        }
    },
    props: {
        esFormularioReferido: Boolean
    },
    methods: {
        completarBannerYGuardarPromoSinOperadora(campania) {
            this.completarBanner(campania);
            this.guardarPromoSinOperadora(campania)
        },
        completarBanner(campania) {
            this.banners = campania.banner;

            this.mostrarBanner();
        },
        mostrarBanner() {
            $(".pnt-div-banner-portabilidad").empty();
            let bannerDesktop = this.agregarImgATagHtml(this.crearTagImgHtml(), this.banners.desktop);
            let bannerMobile = this.agregarImgATagHtml(this.crearTagImgHtml(), this.banners.mobile);

            $(bannerDesktop).addClass("pnt-banner-portabilidad-campania");
            $(bannerDesktop).addClass("pnt-banner-portabilidad-desktop");

            $(bannerMobile).addClass("pnt-banner-portabilidad-campania");
            $(bannerMobile).addClass("pnt-banner-portabilidad-mobile");

            $(".pnt-div-banner-portabilidad").append(bannerDesktop);
            $(".pnt-div-banner-portabilidad").append(bannerMobile);
        },
        guardarPromoSinOperadora(promo) {
            this.campaniaBackUp = promo;
        },
        crearTagImgHtml() {
            return new Image();
        },
        agregarImgATagHtml(elementoHtml, contenido) {
            elementoHtml.src = contenido;
            return elementoHtml;
        },
        completarPromoCorrespondiente(bannerOperadora) {
            bannerOperadora ? this.completarBanner(bannerOperadora) : this.completarBannerSinOperadora();
        },
        completarBannerSinOperadora() {
            this.completarBanner(this.campaniaBackUp)
        }
    },
    template: document.getElementById("pnt-template-portabilidad-banner-campania").innerHTML
});