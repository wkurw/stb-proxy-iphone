const express = require('express');
const request = require('request');
const app = express();
const PORT = process.env.PORT || 3000;

// Odblokowanie CORS dla Twojej aplikacji na Netlify
app.use((req, res, next) => {
    res.header('Access-Control-Allow-Origin', '*');
    res.header('Access-Control-Allow-Methods', 'GET, POST, OPTIONS');
    res.header('Access-Control-Allow-Headers', 'Content-Type, Authorization, User-Agent');
    if (req.method === 'OPTIONS') {
        return res.sendStatus(200);
    }
    next();
});

// Przekazywanie żądań do serwera IPTV
app.use('/', (req, res) => {
    const targetUrl = req.url.substring(1); // pobiera adres serwera docelowego z adresu URL
    if (!targetUrl) {
        return res.status(400).send('Wpisz poprawny adres URL portalu po ukośniku.');
    }

    // Kopiujemy nagłówki (szczególnie User-Agent i Autoryzację ze skryptu STB)
    const headers = { ...req.headers };
    delete headers.host;

    req.pipe(request({
        url: targetUrl,
        method: req.method,
        headers: headers,
        rejectUnauthorized: false // ignoruje błędy certyfikatów SSL na starych serwerach IPTV
    })).pipe(res);
});

app.listen(PORT, () => console.log(`Proxy działa na porcie ${PORT}`));
