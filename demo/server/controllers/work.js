module.exports = {

  async indexPage(ctx) {
    // 判斷是否有session
    if (ctx.session && ctx.session.isLogin && ctx.session.userName) {
      const title = 'work頁面';
      await ctx.render('work', {
        title,
      })
    } else {
      // 沒有登錄態則跳轉到錯誤頁面
      ctx.redirect('/error');
    }
  }

};