Vue.component('portabilidad-datos-numero-chip', {
    data: function () {
        return {
            numeroChip: '8954'
        };
    },
    watch: {
        'numeroChip': {
            handler: function (val, oldVal) {
                var self = this;
                if (self.isNumeroChipCompleto) {
                    self.$validator.validate().then(function (valid) {
                        if (valid) {
                            self.$emit("set-numero-chip", self.numeroChip);
                        } else {
                            self.$emit("set-numero-chip", null);
                        }
                    });
                } else {
                    self.$emit("set-numero-chip", null);
                }
            }
        }
    },
    computed: {
        isNumeroChipCompleto: function () {
            return this.numeroChip.length > 0;
        }
    },
    updated: function () {
        this.$nextTick(function () {
            $('select').formSelect();
        });
    },
    mounted: function () {
        var elems = document.querySelectorAll('.pnt-modal-numero-chip');
        var instances = M.Modal.init(elems);
    },
    beforeCreate: function () {
        this.$nextTick().then(() => this.$refs.labelNumeroChip.classList.add('active'));
    },
    template: document.getElementById("pnt-template-portabilidad-datos-numero-chip").innerHTML
});
