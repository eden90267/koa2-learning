/**
 * Created by eden_liu on 2017/7/12.
 */
const Koa = require('koa');

const app = new Koa();

app.use(async (ctx) => {

    if (ctx.url === '/index') {
        ctx.cookies.set(
            'cid',
            'hello world',
            {
                domain: 'localhost', // 寫cookie所在的域名
                path: '/index', // 寫cookie所在的路徑
                maxAge: 10 * 60 * 1000, // cookie有效時長
                expires: new Date('2017-08-01'), // cookie失效時間
                httpOnly: false, // 是否只用於http請求中獲取
                overwrite: false, // 是否允許重寫
            }
        );
        ctx.body = 'cookie is ok';
    } else {
        ctx.body = 'hello world';
    }

});

app.listen(3000);
console.log('[demo] cookie is starting at port 3000.');