# 請求資料獲取

## GET請求資料獲取

### 使用方法

在koa中，獲取GET請求資料源頭是koa中request對象中的query方法或querystring方法，query返回是格式化好的參數對象，querystring返回的事請求字符串，由於ctx對request的API有直接引用的方式，所以獲取GET請求資料有兩個途徑：

1. 從上下文中直接獲取

    - 請求對象ctx.query，返回如{a:1, b:2}
    - 請求字符串ctx.querystring，返回如a=1&a=2

2. 從上下文的request對象中獲取

    - 請求對象ctx.requery.query，返回如{a:1, b:2}
    - 請求字符串ctx.request.querystring，返回如a=1&a=2

### 舉個例子

#### 例子代碼

```
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
```

#### 執行程序

```
node get.js
```

用browser訪問[http://localhost:3000/?a=1&b=2](http://localhost:3000/?a=1&b=2)

## POST請求參數獲取

### 原理

對於POST請求的處理，koa2沒有封裝獲取參數的方法，需要透過解析context中的原生node.js請求對象req，將POST表單數據解析成query string(例如：a=1&b=2&c=3)，再將query string解析成JSON格式。

>注意：ctx.requet是context經過封裝的請求對象，ctx.req是context提供的node.js原生HTTP請求對象，同理ctx.response是context經過封裝的響應對象，ctx.res是context提供的node.js原生HTTP響應對象。  
>具體koa API文檔可見：  
>[https://github.com/koajs/koa/blob/master/docs/api/context.md#ctxreq](https://github.com/koajs/koa/blob/master/docs/api/context.md#ctxreq)

### 解析出POST請求上下文中的表單數據

```
const Koa = require('koa');

const app = new Koa();

app.use(async (ctx) => {

    if (ctx.url === '/' && ctx.method === 'GET') {
        // 當GET請求時候返回表單頁面
        let html = `
          <h1>koa2 request post demo</h1>
          <form action="/" method="post">
            <p>userName</p>
            <input type="text" name="userName"><br>
            <p>nickName</p>
            <input type="text" name="nickName"><br>
            <p>email</p>
            <input type="email" name="email"><br>
            <button type="submit">submit</button>
          </form>
        `;
        ctx.body = html;
    } else if (ctx.url === '/' && ctx.method === 'POST') {
        let postData = await parsePostData(ctx);
        ctx.body = postData;
    } else {
        ctx.body = '<h1>404！！！ o(╯□╰)o</h1>';
    }

});

// 解析context裡node原生請求的POST參數
function parsePostData(ctx) {
    return new Promise((resolve, reject) => {
        try {
            let postdata = '';
            ctx.req.addListener('data', (data) => {
                postdata += data;
            });
            ctx.req.addListener('end', () => {
                let parseData = parseQueryStr(postdata);
                resolve(parseData);
            })
        } catch (err) {
            reject(err);
        }
    })
}

// 將POST請求參數字符串解析成JSON
function parseQueryStr(queryStr) {
    let queryData = {};
    let queryStrList = queryStr.split('&');
    console.log(queryStrList);
    for (let [index, queryStr] of queryStrList.entries()) {
        let itemList = queryStr.split('=');
        queryData[itemList[0]] = decodeURIComponent(itemList[1])
    }
    return queryData;
}

app.listen(3000);
console.log('[demo] request post is starting at port 3000');
```

### 啟動例子

```
node post.js
```

### 訪問頁面

[http://localhost:3000/](http://localhost:3000/)

## koa-bodyparser中間件

### 原理

對於POST請求的處理，koa-bodyparser中間件可以把koa2上下文的formData數據解析到ctx.request.body中

### 安裝koa2版本的koa-bodyparser@3中間件

```
npm i --save koa-bodyparser@3
```

### 舉個例子

```
const Koa = require('koa');
const bodyParser = require('koa-bodyparser');

const app = new Koa();

app.use(bodyParser());

app.use(async (ctx) => {

    if (ctx.url === '/' && ctx.method === 'GET') {
        let html = `
          <h1>koa2 request post demo</h1>
          <form method="POST" action="/">
            <p>userName</p>
            <input name="userName" /><br/>
            <p>nickName</p>
            <input name="nickName" /><br/>
            <p>email</p>
            <input name="email" type="email" /><br/>
            <button type="submit">submit</button>
          </form>
        `;
        ctx.body = html
    } else if (ctx.url === '/' && ctx.method === 'POST') {
        let postData = ctx.request.body;
        ctx.body = postData;
    } else {
        ctx.body = '<h1>404！！！ o(╯□╰)o</h1>'
    }

});

app.listen(3000);
console.log('[demo] request post is starting at port 3000');
```

### 啟動例子

```
node post-middleware.js
```

### 訪問頁面

[http://localhost:3000/](http://localhost:3000/)