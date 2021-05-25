const loginAgain = (ctx) => {
  const method = ctx.method.toUpperCase();
  if (method === 'POST') {
    ctx.body = {
      code: 402
    };
  } else {
    ctx.redirect('/login');
  }
};

export default async (ctx, next) => {
  console.log();
  const auth = ctx.cookies.get('auth');
  if (auth) {
    let user = null;
    try {
      user = JSON.parse(auth);
    } catch (error) {
      console.log('非法的cookie');
      loginAgain(ctx);
      // ctx.redirect('/login');
    }
    console.log('Date.now():', Date.now());
    console.log('user.created_at: %s, user.expires_in: %s', user.created_at, user.expires_in);
    if (Date.now() < user.created_at + (user.expires_in * 1000)) {
      await next();
    } else {
      console.log('cookie已过期');
      loginAgain(ctx);
    }
  } else {
    console.log('Not found cookies.auth, redirect to /login');
    loginAgain(ctx);
  }
};
