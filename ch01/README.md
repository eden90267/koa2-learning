# koa2開始

## 快速開始

### 環境準備

- 因node v7.6.0開始完全支持async/await，不需要加flag，所以node/js環境都要7.6.0以上。
- node.js環境 v7.6以上

    - 直接安裝node.js 7.6
    - nvm管理多版本node.js：可以用nvm進行node版本進行管理

- npm 版本3.x以上

### 快速開始

#### 安裝koa2

```
mkdir start-quick & cd start-quick
npm init -y
npm i koa --save
```

#### hello world代碼

```
const Koa = require('koa');
const app = new Koa();

app.use( async (ctx) => ctx.body = 'hello koa2');

app.listen(3000);
console.log('[demo] start-quick is starting at port 3000');
```

#### 啟動demo

由於koa2是基於async/await操作中間件，目前node.js 7.x的harmony模式下才能使用，所以啟動時的腳本如下

```
node index.js
```

## async/await使用

### 快速上手理解

```
function getSyncTime() {
    return new Promise((resolve, reject) => {
        try {
            let startTime = new Date().getTime();
            setTimeout(() => {
                let endTime = new Date().getTime();
                let data = endTime - startTime;
                resolve(data);
            }, 500);
        } catch (err) {
            reject(err);
        }
    })
}

async function getSyncData() {
    let time = await getSyncTime();
    let data = `endTime - startTime = ${time}`;
    return data;
}

async function getData() {
    let data = await getSyncData();
    console.log(data);
}

getData();
```

### 從上述例子可以看出async/await的特點

- 可以讓異步邏輯用同步寫法實現
- 最底層的await返回需要是Promise對象
-可以透過多層async function的同步寫法代替傳統的callback嵌套

## koa2簡析結構

### 源碼文件

```
├── lib
│   ├── application.js
│   ├── context.js
│   ├── request.js
│   └── response.js
└── package.json
```

這個就是GitHub上開源的koa2源碼的源文件結構，核心代碼就是lib目錄下的四個文件

- application.js 整個koa2的入口文件，封裝了context、request、response，以及最核心的中間件處理流程
- context.js 處理應用上下文，裡面直接封裝部分request.js和response.js
- request.js 處理http請求
- response.js 處理http響應

### koa2特性

- 只提供封裝好http上下文、請求、響應，以及基於async/await的中間件容器
- 利用ES7的async/await的來處理傳統回調嵌套問題和代替koa@1 generator，但需要在node.js 7.x的harmony模式下才能支持async/await
- 中間件只支持async/await封裝的，如果要使用koa@1基於generator中間件，需要透過中間件koa-convert封裝一下才能使用

## koa中間件開發和使用

- koa v1和v2中使用到的中間件的開發和使用
- generator 中間件開發在koa v1和v2中使用
- async await 中間件開發和只能在koa v2中使用

### generator 中間件開發

#### generator 中間件開發

>generator中間件返回的應該是function * () 函數

*./middleware/logger-generator.js*：

```
function log(ctx) {
    console.log(ctx.method, ctx.header.host + ctx.url);
}

module.exports = function () {
    return function *(next) {

        // 執行中間件的操作
        log(this);

        if (next) {
            yield next;
        }
    }
};
```

#### generator中間件在koa@1中的使用

>generator中間件在koa v1中可以直接use使用

```
const koa = require('koa');
const loggerGenerator = require('./middleware/logger-generator');
const app = koa();

app.use(loggerGenerator());

app.use(function *() {
    this.body = 'hello world!';
});

app.listen(3000);
console.log('the server is starting at port 3000');
```

#### generator中間件在koa@2中的使用

>generator中間件在koa v2中需要用koa-convert封裝一下才能使用

```
const Koa = require('koa');
const convert = require('koa-convert');
const loggerGenerator = require('./middleware/logger-generator');
const app = new Koa();

app.use(convert(loggerGenerator()));

app.use((ctx) => {
    ctx.body = 'hello world!';
});

app.listen(3000);
console.log('the server is starting at port 3000');
```

### async中間件開發

#### async中間件開發

*./middleware/logger-async.js*：

```
function log(ctx) {
    console.log(ctx.method, ctx.header.host + ctx.url);
}

module.exports = function () {
    return async function (ctx, next) {
        log(ctx);
        await next();
    }
};
```

#### async中間件在koa@2中使用

>async中間件只在koa v2中使用

```
const Koa = require('koa');
const convert = require('koa-convert');
const loggerAsync = require('./middleware/logger-async');
const app = new Koa();

app.use(loggerAsync());

app.use((ctx) => {
    ctx.body = 'hello world!';
});

app.listen(3000);
console.log('the server is starting at port 3000');
```