tuenti.service.campanias = (function () {

    let baseUrl = "<CAMPANIAS_BASE_URL>";

    function obtener(url) {
        return axios({
            method: 'GET',
            url: `${baseUrl}/api/campanias?url=${url}`,
        });
    }

    function obtenerPorUrlYOperadora(url, operadora) {
        return axios({
            method: 'GET',
            url: `${baseUrl}/api/campanias/operadora?url=${url}&operadora=${operadora}`,
        });
    }

    return {
        obtener: obtener,
        obtenerPorUrlYOperadora: obtenerPorUrlYOperadora
    };
})();