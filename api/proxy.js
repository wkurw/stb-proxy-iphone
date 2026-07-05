const request = require('request');

module.exports = async (req, res) => {
    // Odblokowanie CORS
    res.setHeader('Access-Control-Allow-Origin', '*');
    res.setHeader('Access-Control-Allow-Methods', 'GET, POST, OPTIONS');
    res.setHeader('Access-Control-Allow-Headers', 'Content-Type, Authorization, User-Agent');

    if (req.method === 'OPTIONS') {
        return res.status(200).end();
    }

    // Pobranie docelowego URL serwera IPTV (wszystko po ukośniku w adresie proxy)
    const targetUrl = req.url.substring(1);
    if (!targetUrl) {
        return res.status(400).send('Brak adresu URL portalu docelowego.');
    }

    const headers = { ...req.headers };
    delete headers.host;

    // Przekazanie żądania do serwera IPTV
    request({
        url: targetUrl,
        method: req.method,
        headers: headers,
        rejectUnauthorized: false
    }).pipe(res);
};
