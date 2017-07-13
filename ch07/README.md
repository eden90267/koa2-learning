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

```

```