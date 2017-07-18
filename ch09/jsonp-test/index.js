const Koa = require('koa');
const app = new Koa();

app.use(async (ctx) => {

    // 如果jsonp的請求為GET
    if (ctx.method === 'GET' && ctx.url.split('?')[0] === '/getData.jsonp') {

        // 獲取jsonp的callback
        let callbackName = ctx.query.callback || 'callback';
        let returnData = {
            success: true,
            data: {
                text: 'this is a jsonp api',
                time: new Date().getTime(),
            }
        };

        // jsonp的script字符串
        let jsonpStr = `;${callbackName}(${JSON.stringify(returnData)})`;

        // 用text/javascript，讓請求支持跨域獲取
        ctx.type = 'text/javascript';

        // 輸出jsonp字符串
        ctx.body = jsonpStr;

    } else {
        ctx.body = 'hello jsonp';
    }


});

app.listen(3000);
console.log('[demo] jsonp is starting at port 3000');