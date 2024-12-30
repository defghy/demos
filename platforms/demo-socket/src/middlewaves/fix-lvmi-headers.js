export default async (ctx, next) => {
  if (ctx.headers['content-encoding'] === 'UTF-8') {
    ctx.headers['content-encoding'] = 'identity';
  }
  await next();
};
