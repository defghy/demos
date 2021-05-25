module.exports = async (ctx, next) => {
  await ctx.render('pages/crm-manager/layout.hbs', {
    title: 'CRM后台管理系统',
    jsList: [],
    cssList: [],
    globalVariable: [],
    environment: process.env.ENV
  });
}
