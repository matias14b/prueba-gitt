import { validarPaso } from './mixin/portabilidadPasosUtils.js';
import { prevenirCambioFoco } from './mixin/prevenirCambioFocoConTab.js';
import { tipoMensajeInput } from '../enum/mensajesInput.js';


Vue.component('portabilidad-datos-personales', {
    data: function () {
        return {
            isSiguienteHabilitado: false,
            isAtrasHabilitado: false,
            isAtrasVisible: false,
            esFormatoValidoCodigoReferido: false,
            codigoReferidoAuxiliar: null,
            mensajeInputReferido: null,
            portabilidad: {
                cliente: {
                    nombre: null,
                    apellido: null,
                    fechaNacimiento: null,
                    dniTitular: null,
                    email: null,
                    telefonoAlternativo: null
                },
                codigoPromocional: null,
                codigoReferido: null,
                codigoReferidoHabilitado: false
            },
            dia: null,
            mes: null,
            anio: null,
            fechaNacimientoAValidar: null,
        };
    },
    props: {
        showBanner: Boolean,
        esFormularioReferido: Boolean
    },
    mixins: [validarPaso, prevenirCambioFoco],
    watch: {
        'esFormatoValidoCodigoReferido': {
            handler: function (newVal, oldVal) {
                this.habilitarBotonSiguienteSiCorresponde();
            }
        },
        'portabilidad': {
            handler: function (newVal, oldVal) {
                var self = this;
                if (newVal.codigoReferido !== self.codigoReferidoAuxiliar) {
                    self.codigoReferidoAuxiliar = newVal.codigoReferido;
                    self.mensajeInputReferido = null;
                    self.$validator.validate('codigo-referido')
                            .then(function (esCampoReferidoValido) {
                                if (esCampoReferidoValido) {
                                    self.verificarCodigoRetiroHabilitado();
                                } else {
                                    self.portabilidad.codigoReferidoHabilitado = false;
                                    self.esFormatoValidoCodigoReferido = false;
                                    self.habilitarBotonSiguienteSiCorresponde();
                                }
                            });
                } else {
                    self.habilitarBotonSiguienteSiCorresponde();
                }
            },
            deep: true
        }
    },
    computed: {
        esMailUltimoCampo: function () {
            return (!this.esFormularioReferido && !this.esFormularioCodigoPromocional)
                    || (this.esFormularioCodigoPromocional && this.codigoPromocionalEnParametro);
        },
        esFormularioCodigoPromocional: function () {
            return !this.esFormularioReferido && !this.showBanner;
        },
        existeCodigoReferido: function () {
            return !(this.portabilidad.codigoReferido === null || this.portabilidad.codigoReferido === "");
        },
        esValidoCodigoPromocional: function () {
            if (this.showBanner) {
                return true;
            } else {
                if (this.portabilidad.codigoPromocional && this.portabilidad.codigoPromocional !== '') {
                    this.portabilidad.tienePromocion = !this.showBanner;
                    return true;
                }
            }
            return false;
        },
        esClienteCompleto: function () {
            var clienteCompleto = true;
            for (var atributo in this.portabilidad.cliente) {
                clienteCompleto = ((this.portabilidad.cliente[atributo] !== null && this.portabilidad.cliente[atributo] !== "") || atributo === 'telefonoAlternativo') && clienteCompleto === true ? true : false;
            }
            return clienteCompleto;
        },
        codigoPromocionalEnParametro: function () {
            return tuenti.ui.views.utils.getParametroUrl("codigoPromocional");
        },
        codigoReferidoEnParametro: function () {
            return tuenti.ui.views.utils.getParametroUrl("referente");
        },
        esFechaNacimientoValida: function () {
            return moment(this.fechaNacimientoAValidar, "DD/MM/YYYY").isValid();
        }      
    },
    methods: {
        verificarCodigoRetiroHabilitado() {
            var self = this;
            self.mensajeInputReferido = tipoMensajeInput.INFO_SPINNER;
            tuenti.service.referido.esCodigoHabilitado(self.portabilidad.codigoReferido)
                    .then(function (respuesta) {
                        self.esFormatoValidoCodigoReferido = true;
                        self.portabilidad.codigoReferidoHabilitado = respuesta.data;
                        self.mensajeInputReferido = tipoMensajeInput.INFO;
                    })
                    .catch(function (respuesta) {
                        self.portabilidad.codigoReferidoHabilitado = false;
                        if (respuesta.response && respuesta.response.status && respuesta.response.status === 400) {
                            self.mensajeInputReferido = tipoMensajeInput.ERROR_VALIDACION;
                            self.esFormatoValidoCodigoReferido = false;
                        } else {
                            self.esFormatoValidoCodigoReferido = true;
                            self.mensajeInputReferido = tipoMensajeInput.ERROR_CONEXION;
                        }
                    });
        },
        
        habilitarBotonSiguienteSiCorresponde() {
            if (this.esClienteCompleto && this.esFechaNacimientoValida && this.esValidoCodigoPromocional && (this.esFormatoValidoCodigoReferido || !this.esFormularioReferido)) {
                this.validar();
            } else {
                this.isSiguienteHabilitado = false;
            }
        },
        validarYAsignarFechaNacimiento() {
            if(this.dia && this.mes && this.anio) {
                const fechaNacimiento = this.dia.concat('/', this.mes).concat('/', this.anio);
                this.fechaNacimientoAValidar = fechaNacimiento;
                if(moment(fechaNacimiento, "DD/MM/YYYY").isValid()) {
                    const fechaNacimientoValida = moment(fechaNacimiento, "DD/MM/YYYY").format("DD/MM/YYYY"); 
                    this.portabilidad.cliente.fechaNacimiento = fechaNacimientoValida; 
                } else {
                    this.portabilidad.cliente.fechaNacimiento = null;
                }
                
            } else {
                const fechaNacimiento = this.dia.concat('/', this.mes).concat('/', this.anio);
                this.fechaNacimientoAValidar = fechaNacimiento;
                this.portabilidad.cliente.fechaNacimiento = null; 
            }
            
        },
        diaNacimientoCompleto: function () {
            if (this.dia && this.dia.length === 2) {
                this.$refs.mes.focus();
            }
        },
        mesNacimientoCompleto: function () {
            if (this.mes && this.mes.length === 2) {
                this.$refs.anio.focus();
            }
        },
        anioNacimientoCompleto: function () {
            if (this.anio && this.anio.length === 4) {
                this.$refs.anio.blur();
            }
        } 
    },
    mounted: function () {
        this.portabilidad.codigoPromocional = this.codigoPromocionalEnParametro;
        if (this.codigoReferidoEnParametro) {
            this.portabilidad.codigoReferido = this.codigoReferidoEnParametro;
        }
    },
    template: document.getElementById("pnt-template-portabilidad-datos-personales").innerHTML
});
