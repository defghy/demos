// curl -k https://localhost:8000/
const http2 = require('http2');
const fs = require('fs');
const path = require('path');

const options = {
  key: fs.readFileSync(path.resolve("../assets/server.key"), "utf8"),
  cert: fs.readFileSync(path.resolve("../assets/server.cert"), "utf8")
};

http2.createSecureServer(options, (req, res) => {
  res.writeHead(200, {
    'X-Frame-Options': 'DENY',
    'content-type': 'text/html; charset=UTF-8'
  });
  res.end('hello world\n');
}).listen(8000);
console.log(`https://localhost:8000`);
