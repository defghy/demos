const Koa = require('koa');
const path = require('path');
const http = require('http');
const https = require('https');
const fs = require('fs');
const bodyParser = require('koa-bodyparser');
const static = require('koa-static');

const routers = require('./routers.js');

const app = new Koa();
app.on('error', error => {
  console.error(error);
})
process.on('uncaughtException', function(error) {
  console.error(error);
});

// 中间件
app.use(static(path.join(__dirname, '../../static')));
app.use(bodyParser());
app.use(routers.routes()).use(routers.allowedMethods());

// 启动监听
// const server = http.createServer(app.callback());
const server = https.createServer({
  key: fs.readFileSync(path.resolve("../assets/server.key"), "utf8"),
  cert: fs.readFileSync(path.resolve("../assets/server.cert"), "utf8")
}, app.callback());

module.exports = {
  app, server
};
