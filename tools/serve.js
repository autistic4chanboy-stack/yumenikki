/* Petit serveur statique local (aucune dépendance) : node tools/serve.js [port] */
'use strict';
var http = require('http'), fs = require('fs'), path = require('path');
var root = path.resolve(__dirname, '..'), port = +process.argv[2] || 8737;
var TYPES = { '.html': 'text/html; charset=utf-8', '.js': 'text/javascript; charset=utf-8', '.css': 'text/css; charset=utf-8', '.json': 'application/json', '.png': 'image/png', '.ogg': 'audio/ogg', '.wav': 'audio/wav', '.mp3': 'audio/mpeg', '.txt': 'text/plain; charset=utf-8', '.md': 'text/plain; charset=utf-8', '.svg': 'image/svg+xml' };
var SHOTS = process.env.YN_SHOTS || null; // dossier de captures (outil de développement)
http.createServer(function (req, res) {
  if (req.method === 'POST' && req.url.indexOf('/__shot') === 0 && SHOTS) {
    var chunks = [];
    req.on('data', function (c) { chunks.push(c); });
    req.on('end', function () {
      var body = Buffer.concat(chunks).toString(), name = (req.url.split('name=')[1] || 'shot').replace(/[^a-z0-9_-]/gi, '');
      var b64 = body.replace(/^data:image\/png;base64,/, '');
      fs.mkdirSync(SHOTS, { recursive: true });
      fs.writeFileSync(path.join(SHOTS, name + '.png'), Buffer.from(b64, 'base64'));
      res.writeHead(200); res.end('ok');
    });
    return;
  }
  var u = decodeURIComponent(req.url.split('?')[0].split('#')[0]);
  if (u === '/') u = '/index.html';
  var f = path.join(root, path.normalize(u));
  if (f.indexOf(root) !== 0) { res.writeHead(403); return res.end(); }
  fs.readFile(f, function (err, data) {
    if (err) { res.writeHead(404, { 'Content-Type': 'text/plain' }); return res.end('404'); }
    res.writeHead(200, { 'Content-Type': TYPES[path.extname(f).toLowerCase()] || 'application/octet-stream', 'Cache-Control': 'no-store' });
    res.end(data);
  });
}).listen(port, function () { console.log('Yume Nikki — The Dream Archive : http://localhost:' + port + '/'); });
