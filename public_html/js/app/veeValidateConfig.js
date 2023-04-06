Vue.use(VeeValidate, {
    locale: 'es',
    useConstraintAttrs: false,
    dictionary: {
        es: {
            messages: {
                email: function () {
                    return 'Dejanos un mail correcto, ahí te vamos a avisar cómo seguir.'
                },
            },
            custom: {
                dni: {
                    numeric: 'Escribí tu DNI sin puntos. Solo el número.',
                    min: 'Escribí un DNI correcto.',
                    max: 'Escribí un DNI correcto.'
                },
                'telefono-alternativo': {
                    numeric: 'Poné el número con código de área, sin 0 y sin 15.',
                    length: 'Poné el número con código de área, sin 0 y sin 15.'
                },
                numeroLinea: {
                    numeric: 'Poné el número con código de área, sin 0 y sin 15.',
                    length: 'Poné el número con código de área, sin 0 y sin 15.'
                },
                numeroChip: {
                    numeric: 'Poné el número que empieza con 8954 y tiene 19 dígitos, impreso en el dorso de tu chip.',
                    length: 'Poné el número que empieza con 8954 y tiene 19 dígitos, impreso en el dorso de tu chip.'
                },
                puntoDeRetiro: {
                    required: 'Elegí dónde querés retirar tu chip.'
                },
                dniFrente: {
                    required: 'Subí una foto del frente de tu DNI',
                    image: 'El archivo debe ser una imagen',
                    size: 'El peso máximo de la foto es de 5 MB'
                },
                dniDorso: {
                    required: 'Subí una foto del frente de tu DNI',
                    image: 'El archivo debe ser una imagen',
                    size: 'El peso máximo de la foto es de 5 MB'
                },
                'codigo-referido': {
                    numeric: 'Poné el número con código de área, sin 0 y sin 15.',
                    length: 'Poné el número con código de área, sin 0 y sin 15.'
                }
            }
        }
    }
});

VeeValidate.Validator.extend('sin_insultos', {
    getMessage(field, val) {
        return 'Esa palabra no está permitida.'
    },
    validate(value, args) {
        let regex = new RegExp("\\b((?:put|bolud|forr|chot|garch|trol|pajer|pelotud|conchud|cornud|chamuyer|bolacer|lel)(?:[oa]|it[oa])s*|(?:mierd|pij|tet|cajet)(a|ita)s*|(?:ped|cul)(o|ito)s*|petes*|ortos*|garc[oa]s*|vergas*|cag[ao]s*|cagar|cagaron|cagarl[oa]s*|cagate|cagarte|maricas*|maric[oóÓ]na?(?:es*|as*)?|cog[eéÉ]r(?:te|me|lo[s]*|la[s]*|tel[oa]s*|mel[oa]s*)?|curt(?:[iíÍ]|ir(?:l[oa]s*)?|[iíÍ]rte(?:l[oa]s*)?|[iíÍ]rme(?:l[oa]s*)?)|(?:pete|paje|garch|fif)(?:ar|ar(?:l[oa]s*)?|[aáÁ]rte(?:l[oa]s*)?|[aáÁ]rme(?:l[oa]s*)?))\\b", "i");
        return value && !regex.test(value);
    }
});

VeeValidate.Validator.extend('linea_valida', {
    getMessage(field, val) {
        return 'Poné el número con código de área, sin 0 y sin 15.'
    },
    validate(value, args) {
        let regex = new RegExp("^((?!15)(?!0)[0-9]{10})");
        return value && regex.test(value);
    }
});

VeeValidate.Validator.extend('chip_valido', {
    getMessage(field, val) {
        return 'Poné el número que empieza con 8954 y tiene 19 dígitos, impreso en el dorso de tu chip.'
    },
    validate(value, args) {
        let regex = new RegExp("^((8954)[0-9]{15})");
        return value && regex.test(value);
    }
});

VeeValidate.Validator.extend('solo_simbolos_espanol', {
    getMessage(field, val) {
        return 'Este campo solo puede contener letras, números y espacios.'
    },
    validate(value, args) {
        let regex = new RegExp("^[a-zA-Z0-9ñÑáÁéÉíÍóÓúÚäÄëËïÏöÖüÜ ]*$");
        return value && regex.test(value);
    }
});

VeeValidate.Validator.extend('validacion_localidad', {
    getMessage(field, val) {
        return 'La localidad ingresada no es válida.'
    },
    validate(value, args) {
        if(args[0].envioChip.localidad.nombreLocalidadSeleccionada){
            return args[0].envioChip.localidad.nombreLocalidadSeleccionada[0] === value;        
        }
    }
});

VeeValidate.Validator.extend('validacion_localidad_punto_retiro', {
    getMessage(field, val) {
        return 'La localidad ingresada no es válida.'
    },
    validate(value, args) {
        const nombreLocalidades = args[0].map(obj => obj.nombre);
        if(nombreLocalidades){
            return nombreLocalidades.includes(value);
        }  
    }
});

VeeValidate.Validator.extend('fecha_valida', {
    getMessage(field, val) {
        return 'La fecha de nacimiento no es valida.'
    },
    validate(value, args) {
        return moment(value, "DD/MM/YYYY").isValid();         
    }
});

