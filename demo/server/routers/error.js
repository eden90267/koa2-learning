/**
 * 錯誤頁面子路由
 * @type {Router}
 */

const router = require('koa-router')();

module.exports = router.get('*', async (ctx) => {
  const title = 'error';
  await ctx.render('error', {
    title
  });
});