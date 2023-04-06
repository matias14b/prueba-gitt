Vue.component('pasate-a-tuenti', {
    data: function () {
        return {
            // esVisible: true
        };
    },
    props: {
        esVisible: Boolean,
        default: true
    },
    template: document.getElementById("pnt-js-pasate-a-tuenti").innerHTML
});