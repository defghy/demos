// curl -k https://localhost:8000/
const https = require('https');
const fs = require('fs');
const path = require('path');

const options = {
  key: fs.readFileSync(path.resolve("../assets/server.key"), "utf8"),
  cert: fs.readFileSync(path.resolve("../assets/server.cert"), "utf8")
};

https.createServer(options, (req, res) => {
  res.writeHead(200, {
    'X-Frame-Options': 'DENY'
  });
  res.end('hello world\n');
}).listen(8000);
console.log(`https://localhost:8000`);

global.testHttps = function() {
  https.get('https://local.yunshanmeicai.com:8000/', (res) => {
    console.log('statusCode:', res.statusCode);
    console.log('headers:', res.headers);

    res.on('data', (d) => {
      process.stdout.write(d);
    });

  }).on('error', (e) => {
    console.error(e);
  });
};
