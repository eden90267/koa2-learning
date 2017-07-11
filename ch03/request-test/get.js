const Koa = require('koa');
const app = new Koa();

app.use(async (ctx) => {
    let url = ctx.url;

    // 從context的request對象中獲取
    let request = ctx.request;
    let req_query = request.query;
    let req_querystring = request.querystring;

    // 從context直接獲取
    let ctx_query = ctx.query;
    let ctx_querystring = ctx.querystring;

    ctx.body = {
        url,
        req_query,
        req_querystring,
        ctx_query,
        ctx_querystring
    };

});

app.listen(3000);
console.log('[demo] request get is starting at port 3000');