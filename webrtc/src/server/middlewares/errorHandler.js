let stringify = function(data) {
  data = data || '';
  return typeof data === 'object'? JSON.stringify(data): data + '';
};

let errmsgInfo = function(ctx, e) {
  let body = ctx.body || (e && e.response && e.response.body) || '';
  let reqBody = ctx.request.body || {};

  let errInfo = {
    url: ctx.originalUrl,
    status: ctx.status,
    ip: ctx.userIp,
    body: stringify(body).replace(/\n/ig, '').substring(100),
    reqBody: stringify(reqBody)
  };
  return errInfo;
};

// 错误处理
module.exports = async (ctx, next) => {
  try {
    await next()
    if(!ctx.body || ctx.status === 404) {
      ctx.body = { msg: '未找到页面', platform: 'crm', env: process.env.ENV, url: ctx.url, originalUrl: ctx.originalUrl };
      let errInfo = errmsgInfo(ctx);
      console.error(`[NOT_FOUND_ERROR] ${stringify(errInfo)}`);
      ctx.sentry.log('未找到页面', errInfo);
    }
  } catch(e) {
    let errInfo = errmsgInfo(ctx, e);
    console.error(`[CATCH_ERROR] ${stringify(errInfo)}`);
    ctx.sentry.error(e, errInfo);
  }
}
