# 文件上傳

## busboy模組

### 快速開始

#### 安裝

```
npm i busboy --save
```

#### 模組簡介

busboy模組是用來解析POST請求，node原生req中的文件流。

#### 開始使用

```
const inspect = require('util').inspect;
const path = require('path');
const fs = require('fs');
const Busboy = require('busboy');

// req為node原生請求
const busboy = new Busboy({
    headers: req.headers
});

// ...

// 監聽文件解析事件
busboy.on('file', function (fieldname, file, filename, encoding, mimetype) {
    console.log(`File [${fieldname}]: filename: ${filename}`);

    // 文件保存到特定路徑
    file.pipe(fs.createWriteStream('./upload'));

    // 開始解析文件流
    file.on('data', function (data) {
        console.log(`File [${fieldname}] got ${data.length} bytes`);
    });

    // 解析文件結束
    file.on('end', function () {
        console.log(`File [${fieldname}] Finished`);
    });
});

// 監聽請求中的字段
busboy.on('field', function (fieldname, val, fieldnameTruncated, valTruncated) {
    console.log(`Field [${fieldname}]: value: ${inspect(val)}`);
});

// 監聽結束事件
busboy.on('finish', function () {
    console.log(`Done parsing form!`);
    res.writeHead(303, {Connection: 'close', Location: '/'});
    res.end();
});
req.pipe(busboy);
```

### 更多模組信息

[https://www.npmjs.com/package/busboy](https://www.npmjs.com/package/busboy)

## 上傳文件簡單實現

### 依賴模組

#### 安裝依賴

```sh
npm i busboy --save
```

- busboy是用來解析出請求中文件流

### 例子源碼

#### 封裝上傳文件到寫入服務的方法

*util/upload.js*：

```js
const inspect = require('util').inspect;
const path = require('path');
const os = require('os');
const fs = require('fs');
const Busboy = require('busboy');

/**
 * 同步創建文件目錄
 * @param {string} dirname 目錄絕對地址
 * @return {boolean}       創建目錄結果
 */
function mkdirSync(dirname) {
    if (fs.existsSync(dirname)) return true;
    if (mkdirSync(path.dirname(dirname))) {
        fs.mkdirSync(dirname);
        return true;
    }
}

/**
 * 獲取上傳文件的後綴名
 * @param {string} fileName 獲取上傳文件的後綴名
 * @return {string}         文件後綴名
 */
function getSuffixName(fileName) {
    let nameList = fileName.split('.');
    return nameList[nameList.length - 1];
}

function uploadFile(ctx, options) {
    let req = ctx.req;
    let res = ctx.res;
    let busboy = new Busboy({headers: req.headers});

    // 獲取類型
    let fileType = options.fileType || 'common';
    let filePath = path.join(options.path, fileType);
    let mkdirResult = mkdirSync(filePath);

    return new Promise((resolve, reject) => {
        console.log('文件上傳中...');
        let result = {
            success: false,
            formData: {},
        };

        // 解析請求文件事件
        busboy.on('file', function (fieldname, file, filename, encoding, mimetype) {
            let fileName = Math.random().toString(16).substr(2) + '.' + getSuffixName(filename);
            let _uploadFilePath = path.join(filePath, fileName);
            let saveTo = path.join(_uploadFilePath);

            // 文件保存到制定路徑
            file.pipe(fs.createWriteStream(saveTo));

            // 文件寫入事件結束
            file.on('end', function () {
                result.success = true;
                result.message = '文件上傳成功';

                console.log('文件上傳成功');
                resolve(result);
            });
        });

        // 解析表單中其他字段訊息
        busboy.on('field', function (fieldname, val, fieldnameTruncated, valTruncated, encoding, mimetype) {
            console.log(`表單字串數據 [${fieldname}]: value: ${inspect(val)}`);
            result.formData[fieldname] = inspect(val);
        });

        // 解析結束事件
        busboy.on('finish', function () {
            console.log('文件上傳結束');
            resolve(result);
        });

        // 解析錯誤事件
        busboy.on('error', function (err) {
            console.log('文件上傳出錯');
            reject(result);
        });

        req.pipe(busboy);
    });
}

module.exports = {
    uploadFile
};
```

#### 入口文件

```js
const Koa = require('koa');
// const bodyParser = require('koa-bodyparser');
const path = require('path');

const app = new Koa();

const {uploadFile} = require('./util/upload');

// app.use(bodyParser());

app.use(async (ctx) => {

    if (ctx.url === '/' && ctx.method === 'GET') {
        // 當GET請求時候返回表單頁面
        let html = `
          <h1>koa2 upload demo</h1>
          <form action="/upload.json" method="post" enctype="multipart/form-data">
            <p>file upload</p>
            <span>picName:</span><input type="text" name="picName"><br>
            <input type="file" name="file"><br><br>
            <button type="submit">submit</button>
          </form>
        `;
        ctx.body = html;
    } else if (ctx.url === '/upload.json' && ctx.method === 'POST') {
        // 上傳文件請求處理
        let result = {success: false};
        let serverFilePath = path.join(__dirname, 'upload-files');

        // 上傳文件事件
        result = await uploadFile(ctx, {
            fileType: 'album', // common or album
            path: serverFilePath,
        });

        ctx.body = result;
    } else {
        ctx.body = '<h1>404！！！ o(╯□╰)o</h1>';
    }

});

app.listen(3000);
console.log('[demo] upload-simple is starting at port 3000');
```

#### 運行

```sh
node index.js
```

## 異步上傳圖片實現

### 源碼理解

#### demo源碼目錄

```sh
.
├── index.js # 後端啟動文件
├── node_modules
├── package.json
├── static # 靜態資源目錄
│   ├── image # 異步上傳圖片存儲目錄
│   └── js
│       └── index.js # 上傳圖片前端js操作
├── util
│   └── upload.js # 後端處理圖片流操作
└── view
    └── index.ejs # ejs後端渲染模板
```

#### 後端代碼

*index.js*：

```

```