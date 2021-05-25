const Router = require('koa-router');

const { apiPathMap, pagePathMap } = require('./controllers/index.js');

const indexController = require('./controllers/pages/home');

const router = new Router();

// API 一般API独立成项目，用不到
Object.keys(apiPathMap).forEach(apiPath => {
  let path = '/api'+ apiPath;
  router.post(path, apiPathMap[apiPath]);
  router.get(path, apiPathMap[apiPath]);
});

// 心跳
router.all('/healthcheck', async (ctx, next) => {
  ctx.body = 'ok';
  await next();
});

// Pages
Object.keys(pagePathMap).forEach(pagePath => {
  router.get(pagePath, pagePathMap[pagePath]);
  router.get(pagePath + '/*', pagePathMap[pagePath]);
});
router.get('', indexController);
router.get('/', indexController); // Default

module.exports = router;
