const httpProxy = require('http-proxy');

// let TARGET = 'https://api-develop.prtsr.io';
let TARGET = 'http://api.local.prtsr.local';
const proxy = httpProxy
  .createProxyServer({
    secure: false,
    followRedirects: true,
    autoRewrite: true,
    changeOrigin: true,
    target: TARGET,
  })
  .listen(10000);


proxy.on('proxyRes', function (proxyRes, req, res) {
  proxyRes.headers['Access-Control-Allow-Methods'] = 'OPTIONS, GET, HEAD, POST, PATCH'
  proxyRes.headers['Access-Control-Allow-Origin'] = req.headers.origin
  proxyRes.headers['Access-Control-Allow-Credentials'] = true
  proxyRes.headers['Access-Control-Allow-Headers'] = 'Content-Type'
  delete proxyRes.headers['connection']
  delete proxyRes.headers['content-type']
});

