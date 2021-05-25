module.exports = async (ctx, next) => {
  ctx.body = {
    ret: 0,
    msg: `demo-server: ${process.env.ENV}`,
  }
}
