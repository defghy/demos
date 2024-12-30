module.exports = async (ctx, next) => {
  const handler = {
    'GET'() {
      let { userId, platform } = ctx.query || {};
      platform = platform ? '/' + platform : '/kf';
      if (userId) {
        global.push.of(platform).to([userId]).emit('message', `用户${userId}收消息`);
      } else {
        global.push.of(platform).emit('message', {
          data: '全体用户收到消息'
        });
      }

      ctx.body = {
        ret: 1,
        data: `消息发送成功`
      };
    },
    'POST'() {
      let { users = [], platform, message } = ctx.request.body;
      if (!platform) {
        ctx.body = {
          ret: 100,
          msg: 'platform不能为空'
        };
        return;
      }
      if (typeof message === 'object') {
        message = JSON.stringify(message);
      }
      console.log(`SEND_MSG: platform_${platform}; users_${JSON.stringify(users)}; ${message}`);
      platform = '/' + platform;

      if (users.length) {
        global.push.of(platform).to(users).emit('message', message);
      } else {
        global.push.of(platform).emit('message', message);
      }

      ctx.body = {
        ret: 1,
        data: `消息发送成功`
      };
    }
  }[ctx.method.toUpperCase()];
  handler && handler();

  await next();
}
