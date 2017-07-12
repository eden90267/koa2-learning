const Koa = require('koa');
const path = require('path');

const content = require('./util/content');
const mimes = require('./util/mimes');

const app = new Koa();

// 靜態資源對於相對入口文件index.js的路徑
const staticPath = './static';

// 解析資源類型
function parseMime(url) {
    let extName = path.extname(url);
    extName = extName ? extName.slice(1) : 'unknow';
    return mimes[extName];
}

app.use(async (ctx) => {

    // 靜態資源目錄在本地的絕對路徑
    let fullStaticPath = path.join(__dirname, staticPath);

    // 獲取靜態資源內容，有可能是文件內容、目錄，或404
    let _content = await content(ctx, fullStaticPath);

    // 解析請求內容的類型
    let _mime = parseMime(ctx.url);

    // 如果有對應的文件類型，就配置上下文的類型
    if (_mime) {
        ctx.type = _mime;
    }

    // 輸出靜態資源內容
    if (_mime && _mime.indexOf('image/') >= 0) {
        // 如果是圖片，則用node原生res，輸出二進制數據
        ctx.res.writeHead(200);
        ctx.res.write(_content, 'binary');
        ctx.res.end();
    } else {
        ctx.body = _content;
    }

});

app.listen(3000);
console.log('[demo] static-server i starting at port 3000');