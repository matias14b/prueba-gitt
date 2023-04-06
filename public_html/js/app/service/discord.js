tuenti.service.discord = (function () {

    function mandarMensaje(mensaje) {
        return axios({
            method: 'POST',
            url: 'https://discordapp.com/api/webhooks/626435462772424790/TvKZyYWDETokTu88vEaUpEQ5bGguteqPfpjaVZhVrd44NEgHQoMhX4kJd56OF1NTzZ3N',
            data: JSON.stringify({ content: mensaje }),
            config: {headers: {'Content-Type': 'application/x-www-form-urlencoded'}}
        });
    }

    return {
        mandarMensaje: mandarMensaje,
    };
})();
