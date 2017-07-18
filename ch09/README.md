# JSONP實現

## 原生koa2實現jsonp

### 前言

在項目複雜的業務場景，有時候需要在前端跨域獲取資料，這時候提供資料的服務就需要提供跨域請求的接口，通常是使用JSONP的方式提供跨域接口。

### 實現JSONP

```js
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
```

#### 解析原理

- JSONP跨域輸出的資料是可執行的JavaScript代碼

    - ctx輸出的類型應該是'text/javascript'
    - ctx輸出的內容為可執行的返回資料JavaScript代碼字符串

- 需要有回調函數名callbackName，前端獲取後會透過動態執行JavaScript代碼字符，獲取裡面的資料

## koa-jsonp中間件

官方介紹不少中間件，其中koa-jsonp是支持koa2的，使用方式也非常簡單，koa-jsonp的官方demo也很容易理解。

### 快速使用

#### 安裝

```sh
yarn add koa koa-jsonp
```

#### 簡單例子

```js
const Koa = require('koa');
const jsonp = require('koa-jsonp');

const app = new Koa();

// 使用中間件
app.use(jsonp());

app.use(async (ctx) => {

    let returnData = {
        success: true,
        data: {
            text: 'this is a jsonp api',
            time: new Date().getTime()
        }
    };

    // 直接輸出JSON
    ctx.body = returnData;

});

app.listen(3000);
console.log('[demo] jsonp is starting at port 3000');
```