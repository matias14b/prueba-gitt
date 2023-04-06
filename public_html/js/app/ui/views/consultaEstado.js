tuenti.ui.views.consultaEstado = (function () {

    function init() {
        inicializarFormulario();
        bindearSubmit();
    }

    function inicializarFormulario() {
        $("#envio-info-cliente").show();
    }
    function bindearSubmit() {
        $("#pnt-boton-submit").on("click", function (event) {
            event.preventDefault();
            $('.pnt-contenedor-botones-acciones-formulario .submit').hide();
            $(".spinner").removeClass("pnt-hide");
            if ($("#envio-info-cliente").parsley().validate()) {
                var numeroLinea = $(".pnt-js-numero-linea").val();
                tuenti.service.consultaEstado.buscar(numeroLinea)
                    .done(function (estado) {
                        $(".spinner").addClass("pnt-hide");
                        mostrarPantallaPortabilidadExito(estado);
                    });
            } else {
                $(".spinner").addClass("pnt-hide");
                $('.pnt-contenedor-botones-acciones-formulario .submit').show();
            }
        });
    }

    function mostrarPantallaPortabilidadExito(estado) {
        $(".pnt-contenedor-botones-acciones-formulario").addClass("pnt-hide");
        $(".form-section.current").removeClass("current");
        $(".pnt-seccion-formulario-exito").addClass("current");
        $(".pnt-js-estado-tramite").html(estado);
    }

    return {
        init: init
    };
})();

$(document).ready(function () {
    tuenti.ui.views.consultaEstado.init();
});
