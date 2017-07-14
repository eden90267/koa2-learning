# 靜態資源加載

## 原生koa2實現靜態資源服務器

### 前言

一個http請求訪問web服務靜態資源，一般響應結果有三種狀況

- 訪問文本，例如js、css、png、jpg、gif
- 訪問靜態目錄
- 找不到資源，拋出404錯誤

### 原生koa2靜態資源服務器例子

#### 代碼目錄

```
├── static # 靜態資源目錄
│   ├── css/
│   ├── image/
│   ├── js/
│   └── index.html
├── util # 工具代碼
│   ├── content.js # 讀取請求內容
│   ├── dir.js # 讀取目錄內容
│   ├── file.js # 讀取文件內容
│   ├── mimes.js # 文件類型列表
│   └── walk.js # 遍歷目錄內容
└── upload.js # 啟動入口文件
```

#### 代碼解析

*upload.js*：

```
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
```

*util/content.js*：

```
const path = require('path');
const fs = require('fs');

// 封裝讀取目錄內容方法
const dir = require('./dir');

// 封裝讀取文件內容方法
const file = require('./file');

/**
 * 獲取靜態資源內容
 * @param {object} ctx koa上下文
 * @param {string} fullStaticPath 靜態資源目錄在本地絕對路徑
 * @return {string} 請求獲取到的本地內容
 */
async function content(ctx, fullStaticPath) {

    // 封裝請求資源的完絕路徑
    let reqPath = path.join(fullStaticPath, ctx.url);

    // 判斷請求路徑是否為存在目錄或者文件
    let exist = fs.existsSync(reqPath);

    // 返回請求內容，default為空
    let content = '';

    if (!exist) {
        // 如果請求路徑不存在，返回404
        content = '404 Not Found！ o(╯□╰)o！';
    } else {
        // 判斷訪問地址是文件夾還是文件
        let stat = fs.statSync(reqPath);

        if (stat.isDirectory()) {
            // 如果為目錄，則渲染讀取目錄內容
            content = dir(ctx.url, reqPath);
        } else {
            // 如果請求為文件，則讀取文件內容
            content = file(reqPath);
        }
    }

    return content;
}

module.exports = content;
```

*util/dir.js*：

```
const url = require('url');

// 遍歷讀取目錄內容方法
const walk = require('./walk');

/**
 * 封裝目錄內容
 * @param {string} url 當前請求的上下文中的url，即ctx.url
 * @param {string} reqPath 請求靜態資源的完整本地路徑
 * @return {string} 返回目錄內容，封裝成HTML
 */
function dir(url, reqPath) {

    // 遍歷讀取當前目錄下的文件、子目錄
    let contentList = walk(reqPath);

    let html = `<ul>`;
    for (let [index, item] of contentList.entries()) {
        html = `${html}<li><a href="${url === '/' ? '' : url}/${item}">${item}</a></li>`;
    }
    html = `${html}</ul>`;

    return html;
}

module.exports = dir;
```

*util/file.js*：

```
const fs = require('fs');

/**
 * 讀取文件方法
 * @param {string} filePath 文件本地的絕對路徑
 * @return {string|binary}
 */
function file(filePath) {
    return fs.readFileSync(filePath, 'binary');
}

module.exports = file;
```

*util/walk.js*：

```
const fs = require('fs');
const mimes = require('./mimes');

/**
 * 遍歷讀取目錄內容
 * @param {string} reqPath 請求資源的絕對路徑
 * @return {Array.<*>} 目錄內容列表
 */
function walk(reqPath) {

    let files = fs.readdirSync(reqPath);

    let dirList = [], fileList = [];
    for (let i = 0; i < files.length; i++) {
        let item = files[i];
        let itemArr = item.split('\.');
        let itemMime = itemArr.length > 1 ? itemArr[itemArr.length - 1] : 'undefined';

        if (typeof mimes[itemMime] === 'undefined') {
            dirList.push(files[i]);
        } else {
            fileList.push(files[i]);
        }
    }

    let result = dirList.concat(fileList);

    return result;
}

module.exports = walk;
```

*util/mime.js*：

```
let mimes = {
    'css': 'text/css',
    'less': 'text/css',
    'gif': 'image/gif',
    'html': 'text/html',
    'ico': 'image/x-icon',
    'jpeg': 'image/jpeg',
    'jpg': 'image/jpeg',
    'js': 'text/javascript',
    'json': 'application/json',
    'pdf': 'application/pdf',
    'png': 'image/png',
    'svg': 'image/svg+xml',
    'swf': 'application/x-shockwave-flash',
    'tiff': 'image/tiff',
    'txt': 'text/plain',
    'wav': 'audio/x-wav',
    'wma': 'audio/x-ms-wma',
    'wmv': 'video/x-ms-wmv',
    'xml': 'text/xml'
};

module.exports = mimes;
```

#### 啟動服務

```
node upload.js
```

#### 效果

[http://localhost:3000/](http://localhost:3000/)

## koa-static中間件使用

### 使用例子

```
const Koa = require('koa');
const path = require('path');
const static = require('koa-static');

const app = new Koa();

const staticPath = './static';

app.use(static(path.join(__dirname, staticPath)));

app.use(async (ctx) => {
    ctx.body = 'hello world';
});

app.listen(3000);
console.log('[demo] static-use-middleware is starting at port 3000');
```