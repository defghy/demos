module.exports = async (ctx, next) => {
  const platform = '/kf';
  const plat = global.push.of(platform)

  ctx.body = {
    ret: 1,
    data: {
      connCount: plat.server.engine.clientsCount
    }
  };
  await next();
}
