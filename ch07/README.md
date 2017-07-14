# 文件上傳

## busboy模組

### 快速開始

#### 安裝

```sh
npm i busboy --save
```

#### 模組簡介

busboy模組是用來解析POST請求，node原生req中的文件流。

#### 開始使用

```js
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

```js
const Koa = require('koa');
const views = require('koa-views');
const path = require('path');
const static = require('koa-static');
const {uploadFile} = require('./util/upload');

const app = new Koa();

/**
 * 使用第三方中間件 start
 */

app.use(views(path.join(__dirname, './view'), {
    extension: 'ejs'
}));

const staticPath = './static';
app.use(static(path.join(__dirname, staticPath)));

/**
 * 使用第三方中間件 end
 */

app.use(async (ctx) => {

    if (ctx.method === 'GET') {
        let title = 'upload pic async';
        await ctx.render('index', {
            title,
        });
    } else if (ctx.url === '/api/picture/upload.json' && ctx.method === 'POST') {
        // 上傳文件請求處理
        let serverFilePath = path.join(__dirname, 'static/image');

        // 上傳文件事件
        let result = await uploadFile(ctx, {
            fileType: 'album',
            path: serverFilePath
        });
        ctx.body = result;
    } else {
        ctx.body = '<h1>404！！！ o(╯□╰)o</h1>'
    }

});

app.listen(3000);
console.log('[demo] upload-pic-async is starting at port 3000');
```

*util/upload.js*：

```js
const fs = require('fs');
const path = require('path');

const Busboy = require('busboy');

/**
 * 同步創建文件目錄
 * @param {string} dirname 目錄絕對地址
 * @return {boolean}           創建目錄結果
 */
function mkdirSync(dirname) {
    if (fs.existsSync(dirname)) {
        return true;
    } else {
        if (mkdirSync(path.dirname(dirname))) {
            fs.mkdirSync(dirname);
            return true;
        }
    }
}

/**
 * 獲取上傳文件的後綴名
 * @param {string} fileName
 * @return {string}                 文件後綴名
 */
function getSuffixName(fileName) {
    let nameList = fileName.split('.');
    return nameList[nameList.length - 1];
}

/**
 * 上傳文件
 * @param {object} ctx   koa context
 * @param {object} options 文件上傳參數 fileType文件類型 path文件存放路徑
 * @return {Promise}
 */
function uploadFile(ctx, options) {
    let req = ctx.req;
    let res = ctx.res;
    let busboy = new Busboy({headers: req.headers});

    let fileType = options.fileType || 'common';
    let filePath = path.join(options.path, fileType);
    let mkdirResult = mkdirSync(filePath);

    return new Promise((resolve, reject) => {
        console.log('文件上傳中...');
        let result = {
            success: false,
            message: '',
            data: null
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
                result.data = {
                    pictureUrl: `//${ctx.host}/image/${fileType}/${fileName}`
                };
                console.log('文件上傳成功！');
                resolve(result);
            });
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

#### 前端代碼

*view/index.ejs*：

```html
<!DOCTYPE html>
<html>
<head>
    <title><%= title %></title>
    <style type="text/css">
        .btn {
            width: 100px;
            height: 40px;
        }
        .preview-picture {
            width: 300px; min-height: 300px; border: 1px #f0f0f0 solid
        }
    </style>
</head>
<body>

<button class="btn" id="J_UploadPictureBtn">上傳圖片</button>
<hr>
<p>上傳進度<span id="J_UploadProgress">0</span>%</p>
<p>上傳結果圖片</p>
<div id="J_PicturePreview" class="preview-picture">
</div>

<script src="/js/index.js"></script>
</body>
</html>
```

上傳的操作代碼*index.js*：

```js
(function () {

    let btn = document.querySelector('#J_UploadPictureBtn');
    let progressElem = document.querySelector('#J_UploadProgress');
    let previewElem = document.querySelector('#J_PicturePreview');

    btn.addEventListener('click', function () {
        uploadAction({
            success: function (result) {
                console.log(result);
                if (result && result.success && result.data && result.data.pictureUrl) {
                    previewElem.innerHTML = '<img src="' + result.data.pictureUrl + '" style="max-width: 100%">';
                }
            },
            progress: function (data) {
                if (data && data * 1 > 0) {
                    progressElem.innerHTML = data;
                }
            }
        })
    });

    /**
     * 類型判斷
     * @type {{isPrototype: isPrototype, isJSON: isJSON, isFunction: isFunction}}
     */
    let UtilType = {
        isPrototype: function (data) {
            return Object.prototype.toString.call(data).toLowerCase();
        },

        isJSON: function (data) {
            return this.isPrototype(data) === '[object object]';
        },

        isFunction: function (data) {
            return this.isPrototype(data) === '[object function]';
        },
    };


    /**
     * form表單上傳請求事件
     * @param {object} options 請求參數
     */
    function requestEvent(options) {
        try {
            let formData = options.formData;
            let xhr = new XMLHttpRequest();
            xhr.onreadystatechange = function () {
                if (xhr.readyState === 4 && xhr.status === 200) {
                    options.success(JSON.parse(xhr.responseText));
                }
            };
            xhr.upload.onprogress = function (evt) {
                let loaded = evt.loaded;
                let tot = evt.total;
                let per = Math.floor(100 * loaded / tot);
                options.progress(per);
            };
            xhr.open('post', '/api/picture/upload.json');
            xhr.send(formData);
        } catch (err) {
            options.fail(err);
        }
    }

    /**
     * 上傳事件
     * @param {object} options 上傳參數
     */
    function uploadEvent(options) {
        let file;
        let formData = new FormData();
        let input = document.createElement('input');
        input.setAttribute('type', 'file');
        input.setAttribute('name', 'files');

        input.click();
        input.onchange = function () {
            file = input.files[0];
            formData.append('files', file);

            requestEvent({
                formData,
                success: options.success,
                fail: options.fail,
                progress: options.progress
            });
        }
    }

    /**
     * 上傳操作
     * @param {object} options 上傳參數
     */
    function uploadAction(options) {
        if (!UtilType.isJSON(options)) {
            return console.log('upload options is null');
        }
        let _options = {};
        _options.success = UtilType.isFunction(options.success) ? options.success : function () {
        };
        _options.fail = UtilType.isFunction(options.fail) ? options.fail : function () {
        };
        _options.progress = UtilType.isFunction(options.progress) ? options.progress : function () {
        };

        uploadEvent(_options);
    }


})();
```

#### 運行

```sh
node index.js
```