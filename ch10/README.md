# 單元測試

## 前言

測試是一個項目週期裡必不可少的環節，開發者在開發過程中也是無時無刻進行"人工測試"，如果每次修改一點代碼，都要牽一髮動全身都要手動測試關聯接口，這樣子是禁錮了生產力。為了解放大部分測試生產力，相關的測試框架應運而生，比較出名的有mocha、karma、jasmine。雖然框架繁多，但是使用起來都是大同小異。

## 準備工作

### 安裝測試相關框架

```sh
yarn add -D mocha chai supertest
```

- mocha模組是測試框架
- chai模組是用來運行測試結果斷言庫，比如一個判斷1 + 1是否等於2
- supertest模組是http請求測試庫，用來請求API接口

## 測試例子

### 例子目錄

```sh
.
├── index.js # api文件
├── package.json
└── test # 測試目錄
    └── index.test.js # 測試用例
```

### 所需測試demo

```js
const Koa = require('koa');

const app = new Koa();

const server = async (ctx, next) => {

    let result = {
        success: true,
        data: null,
    };

    if (ctx.method === 'GET') {
        if (ctx.url === '/getString.json') {
            result.data = 'this is string data';
        } else if (ctx.url === '/getNumber.json') {
            result.data = 123456;
        } else {
            result.success = false;
        }
        ctx.body = result;
        next && next();
    } else if (ctx.method === 'POST') {
        if (ctx.url === '/postData.json') {
            result.data = 'ok';
        } else {
            result.success = false;
        }
        ctx.body = result;
        next & next();
    } else {
        ctx.body = 'hello world';
        next && next();
    }

};

app.use(server);

module.exports = app;

app.listen(3000);
console.log('[demo] test-unit is starting at port 3000');
```

### 開始寫測試用例

_test/index.test.js_：

```js
const supertest = require('supertest');
const chai = require('chai');

const app = require('../index');

const expect = chai.expect;
const request = supertest(app.listen());

// 測試套件/組
describe('開始測試demo的GET請求', () => {

    // 測試用例
    it('測試/getString.json請求', (done) => {
        request
            .get('/getString.json')
            .expect(200)
            .end((err, res) => {
                // 斷言判斷結果是否為object類型
                expect(res.body).to.be.an('object');
                expect(res.body.success).to.be.an('boolean');
                expect(res.body.data).to.be.an('string');
                done();
            });
    });

    it('測試/getNumber.json請求', (done) => {
        request
            .get('/getNumber.json')
            .expect(200)
            .end((err, res) => {
                expect(res.body).to.be.an('object');
                expect(res.body.success).to.be.an('boolean');
                expect(res.body.data).to.be.an('number');
                done();
            });
    });

});

describe('開始測試demo的POST請求', () => {
    it('測試/postData.json請求', (done) => {
        request
            .post('/postData.json')
            .expect(200)
            .end((err, res) => {
                expect(res.body).to.be.an('object');
                expect(res.body.success).to.be.an('boolean');
                expect(res.body.data).to.be.an('string');
                done();
            });
    });
});
```

### 執行測試用例

```sh
$ ./node_modules/.bin/mocha 
[demo] test-unit is starting at port 3000


  開始測試demo的GET請求
    ✓ 測試/getString.json請求
    ✓ 測試/getNumber.json請求

  開始測試demo的POST請求
    ✓ 測試/postData.json請求


  3 passing (53ms)


```

如果node是<=7.5.x：

```sh
$ ./node_modules/.bin/mocha --harmony
```

>注意：
>
>1. 如果是全局安裝mocha，可直接在當前項目目錄下執行`mocha --harmony`命令
>2. 如果當前node是7.5.x以下還不支持async/await就需加上--harmony


會自動讀取執行命令*./test*目錄下的測用例文件index.test.js，並執行。

### 用例詳解

#### 服務入口加載

如果要對一個服務的API接口，進行單元測試，要用supertest加載服務的入口文件

```js
const supertest = require('supertest');
const request = supertest(app.listen());
```

#### 測試套件、用例

- describe()描述的是一個測試套件
- 嵌套在describe()的it()是對接口進行自動化測試的測試用例
- 一個describe()可以包含多個it()

    ```js
    describe('開始測試demo的GET請求', () => {
        it('測試/getString.json請求', () => {
            // TODO ...
        });
    });
    ````

- supertest封裝服務request，是用來請求接口
- chai.expect使用來判斷測試結果是否與預期一樣

  - chai斷言有很多種方法，這裡只是用了資料類型斷言
