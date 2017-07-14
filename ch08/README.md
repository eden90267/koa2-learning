# 資料庫mysql

## 快速開始

### 安裝MySQL資料庫

[https://www.mysql.com/downloads/](https://www.mysql.com/downloads/)

### 安裝node.js的mysql模組

```sh
npm i mysql --save
```

### 模組介紹

mysql模組是node操作MySQL的引擎，可以在node.js環境下對MySQL資料庫進行建表，增、刪、改、查等操作。

### 開始使用

#### 創建資料庫會話

```js
const mysql = require('mysql');
const connection = mysql.createConnection({
    host: '127.0.0.1',
    user: 'root',
    password: '1234',
    database: 'my_database'
});

// 執行sql腳本對資料庫進行讀寫
connection.query('SELECT * FROM my_table', (error, results, fields) => {
    if (error) throw error;
    // connected!

    // 結束會話
    connection.release();
});
```

>注意：一個事件就有一個從開始到結束的過程，資料庫會話操作執行完後，就需要關閉掉，以免佔用連接資源

#### 創建資料連接池

一般情況下操作資料庫是很複雜的讀寫過程，不只是一個會話，如果直接用會話操作，就需要每次會話都要配置連接參數。所以這時候就需要連接池管理會話。

```js
const mysql = require('mysql');

// 創建連接池
const pool = mysql.createPool({
    host: '127.0.0.1',
    user: 'root',
    password: '1234',
    database: 'my_database'
});

// 在連接池中進行會話操作
pool.getConnection(function (err, connection) {
    connection.query('SELECT * FROM my_table', (error, results, fields) => {

        // 結束會話
        connection.release();

        // 如果有錯誤就拋出
        if (error) throw error;
    });
});
```

### 更多模組信息

[https://www.npmjs.com/package/mysql](https://www.npmjs.com/package/mysql)