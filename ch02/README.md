# 路由

## koa2 原生路由實現

### 簡單例子

```
const Koa = require('koa');
const app = new Koa();

app.use(async (ctx) => {
    let url = ctx.request.url;
    ctx.body = url;
});
app.listen(3000);
```

訪問[http://localhost:3000/hello/world](http://localhost:3000/hello/world)頁面輸出/hello/world，也就是說context的請求request對象中url之就是當前訪問的路徑名稱，可以根據ctx.request.url透過一定的判斷或正則匹配就可以訂製出所需要的路由。

### 訂製化的路由

#### 源碼文件目錄

```
.
├── upload.js
├── package.json
└── view
    ├── 404.html
    ├── index.html
    └── todo.html
```

### demo源碼

```
const Koa = require('koa');
const fs = require('fs');

const app = new Koa();

/**
 * 用Promise封裝異步讀取文件方法
 * @param {string} page html文件名稱
 * @return {Promise}
 */
function render(page) {
    return new Promise((resolve, reject) => {
        let viewUrl = `./view/${page}`;
        fs.readFile(viewUrl, "binary", (err, data) => {
            if (err) {
                reject(err);
            } else {
                resolve(data);
            }
        });
    });
}

/**
 * 根據URL獲取HTML內容
 * @param {string} url koa2 context的url，ctx.url
 * @return {string} 獲取HTML文件內容
 */
async function route(url) {
    let view = '404.html';
    switch (url) {
        case '/':
            view = 'index.html';
            break;
        case '/index':
            view = 'index.html';
            break;
        case '/todo':
            view = 'todo.html';
            break;
        case '/404':
            view = '404.html';
            break;
        default:
            break;
    }
    let html = await render(view);
    return html;
}

app.use(async (ctx) => {
    let url = ctx.request.url;
    let html = await route(url);
    ctx.body = html;
});

app.listen(3000);
console.log('[demo] route-simple is starting at port 3000');
```

執行運行腳本：

```
node upload.js
```

## koa-router中間件

如果依靠`ctx.request.url`去手動處理路由，將會寫很多處理代碼，這時候就需要對應的路由的中間件進行控制，這裡介紹一個比較好用的路由中間件**koa-router**

### 安裝koa-router中間件

```
npm i koa-router --save
```

### 快速使用koa-router

```

```