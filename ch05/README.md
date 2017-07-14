# cookie/session

## koa2使用cookie

### 使用方法

koa提供了從上下文直接讀取、寫入cookie的方法

- `ctx.cookies.get(name, [options])` 讀取上下文請求中的cookie
- `ctx.cookie.set(name, value, [options])` 在上下文寫入cookie

koa2中操作的cookie是使用了npm的cookie模組，源碼在[https://github.com/pillarjs/cookies](https://github.com/pillarjs/cookies)，所以在讀寫cookie的使用參數與該模組的使用一致。

### 例子代碼

```
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
```

### 運行例子

#### 執行腳本

```
node upload.js
```

#### 運行結果

訪問[http://localhost:3000/index](http://localhost:3000/index)

可在browser console使用`document.cookie`可以打印出頁面的所有cookie(需要是httpOnly設置false才能顯示)。

## koa2實現session

### 前言

koa2原生功能只提供了cookie的操作，但是沒有提供session操作。session就用自己實現或者透過第三方中間件實現。在koa2中實現session的方案有以下幾種：

- 如果session資料量很小，可以直接存在記憶體中
- 如果session資料量很大，則需要存儲介質

### 資料庫存儲方案

- 將session存放在MySQL資料庫中
- 需要用到中間件

    - koa-session-minimal 適用於koa2的session中間件，提供存儲介質的讀寫接口
    - koa-mysql-session 為koa-session-minimal中間件提供MySQL資料庫的session資料讀寫操作
    - 將sessionid和對於的資料存到資料庫

- 將資料庫的存儲的sessionid存到頁面的cookie中
- 根據cookie的sessionid去獲取對於的session信息

### 快速使用

#### 例子源碼

```
const Koa = require('koa');
const session = require('koa-session-minimal');
const MysqlSession = require('koa-mysql-session');

const app = new Koa();

// 配置存儲session信息的mysql
let store = new MysqlSession({
    user: 'root',
    password: '1234',
    database: 'koa_demo',
    host: '127.0.0.1'
});

// 存放sessionId的cookie配置
let cookie = {
    maxAge: '', // cookie有效時長
    expires: '', // cookie失效時間
    path: '', // 寫cookie所在的路徑
    domain: '', // 寫cookie所在的域名
    httpOnly: '', // 是否只用於http請求中獲取
    overwrite: '', // 是否允許重寫
    secure: '',
    sameSite: '',
    signed: '',
};

// 使用session中間件
app.use(session({
    key: 'SESSION_ID',
    store: store,
    cookie: cookie
}));

app.use(async (ctx) => {

    // 設置session
    if (ctx.url === '/set') {
        ctx.session = {
            user_id: Math.random().toString(36).substr(2),
            count: 0
        };
        ctx.body = ctx.session;
    } else if (ctx.url === '/') {

        // 讀取session信息
        ctx.session.count = ctx.session.count + 1;
        ctx.body = ctx.session;
    }

});

app.listen(3000);
console.log('[demo] session is starting at port 3000');
```

#### 運行例子

```
node upload.js
```

查看資料庫session是否存儲

```
> use koa_demo;
> show tables;
> select * from _mysql_session_store;
```

查看cookie中是否種下了sessionId