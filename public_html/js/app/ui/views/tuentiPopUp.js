tuenti.ui.views.popUp = (function () {

    let ultimoId = 0;
    let popUps = [];

    function crear(selectorCss, titulo, texto) {
        if (selectorCss && titulo && texto) {
            let id = obtenerIdNuevoPopUp();

            let htmlPopUp = obtenerTemplate()
                .replace("{{ id }}", id)
                .replace("{{ titulo }}", titulo)
                .replace("{{ texto }}", texto);

            $(selectorCss).html(htmlPopUp);

            let selectorPopUp = "#popup-tuenti-".concat(id);
            let objetoPopUp = {
                id: id,
                instanciaJQuery: $(selectorPopUp)
            }

            $(selectorPopUp).find(".pnt-js-boton-cierre-pop-up").on("click", function(){
                ocultar(id);
            });

            popUps[id] = objetoPopUp;

            return id;
        }
        return null;
    }

    function buscar(id) {
        return popUps[id].instanciaJQuery;
    }

    function mostrar(id) {
        popUps[id].instanciaJQuery.removeClass("hide");
    }

    function ocultar(id) {
        popUps[id].instanciaJQuery.addClass("hide");
    }

    function obtenerIdNuevoPopUp() {
        return ultimoId++;
    }

    function obtenerTemplate() {
        return `
        <div id="popup-tuenti-{{ id }}" class="row pnt-js-contenedor-mensaje-pop-up hide">
            <div class="pnt-fondo-pop-up">
                <div class="pnt-mensaje-pop-up">
                    <div class="pnt-boton-cierre-pop-up pnt-js-boton-cierre-pop-up">x</div>
                    <i
                        class="material-icons pnt-flecha-cierre-pop-up-desktop pnt-js-flecha-cierre-pop-up-desktop pnt-animation-bounce-horizontal-izq">keyboard_backspace</i>
                    <i
                        class="material-icons pnt-flecha-cierre-pop-up-mobile pnt-js-flecha-cierre-pop-up-mobile pnt-animation-bounce-vertical-top">arrow_downward</i>
                        <p>{{ texto }}</p>
                        <h3>{{ titulo }}</h3>
                </div>
            </div>
        </div>
        `;
    }

    return {
        crear: crear,
        buscar: buscar,
        mostrar: mostrar
    }

})();

