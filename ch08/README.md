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

## async/await封裝使用mysql

### 前言

由於mysql模組的操作都是異步操作，每次操作的結果都是在回調函數中執行，現在有了async/await，就可以用同步的寫法去操作資料庫。

#### Promise封裝mysql模組

**Promise封裝./async-db**

```js
const mysql = require('mysql');
const pool = mysql.createPool({
    host: '127.0.0.1',
    user: 'root',
    password: '1234',
    database: 'my_database',
});

let query = function (sql, values) {
    return new Promise((resolve, reject) => {
        pool.getConnection(function (err, connection) {
            if (err) {
                reject(err);
            } else {
                connection.query(sql, values, (err, rows) => {

                    if (err) {
                        reject(err);
                    } else {
                        resolve(rows);
                    }
                    connection.release();
                });
            }
        });
    });
};

module.exports = {query};
```

async/await使用

```js
const {query} = require('./async-db');

async function selectAllData() {
    let sql = 'SELECT * FROM my_table';
    let dataList = await query(sql);
    return dataList;
}

async function getData() {
    let dataList = await selectAllData();
    console.log(dataList);
}

getData();
```

## 建表初始化

### 前言

通常初始化資料庫要建立很多表，特別在項目開發的時候表的格式可能會有些變動，這時候就需要封裝對資料庫建表初始化的方法，保留項目的sql腳本文件，然後每次需要重新建表，則執行建表初始化程序就行。

### 快速開始

#### 源碼目錄

```sh
├── index.js # 程序入口文件
├── node_modules/
├── package.json
├── sql   # sql腳本文件目錄
│   ├── data.sql
│   └── user.sql
└── util    # 工具代碼
    ├── db.js # 封裝的mysql模組方法
    ├── get-sql-content-map.js # 獲取sql腳本文件内容
    ├── get-sql-map.js # 獲取所有sql腳本文件
    └── walk-file.js # 遍歷sql腳本文件
```

#### 具體流程

```sh
       +---------------------------------------------------+
       |                                                   |
       |   +-----------+   +-----------+   +-----------+   |
       |   |           |   |           |   |           |   |
       |   |           |   |           |   |           |   |
       |   |           |   |           |   |           |   |
       |   |           |   |           |   |           |   |
+----------+  遍历sql  +---+ 解析所有sql +---+  执行sql  +------------>
       |   |  目录下的  |   |  文件脚本  |   |   脚本     |   |
+----------+  sql文件   +---+   内容    +---+           +------------>
       |   |           |   |           |   |           |   |
       |   |           |   |           |   |           |   |
       |   |           |   |           |   |           |   |
       |   |           |   |           |   |           |   |
       |   +-----------+   +-----------+   +-----------+   |
       |                                                   |
       +---------------------------------------------------+
```

### 源碼詳解

資料庫操作文件 *util/db.js*：

```js
const mysql = require('mysql');

const pool = mysql.createPool({
    host: '127.0.0.1',
    user: 'root',
    password: '1234',
    database: 'koa_demo'
});

let query = function (sql, values) {
    return new Promise((resolve, reject) => {
        pool.getConnection(function (err, connection) {
            if (err) {
                reject(err);
            } else {
                connection.query(sql, values, (err, rows) => {
                    if (err) {
                        reject(err);
                    } else {
                        resolve(rows);
                    }
                    connection.release();
                });
            }
        });
    });
};

module.exports = {query};
```

*util/get-sql-content-map.js*：

```js
const fs = require('fs');
const getSqlMap = require('./get-sql-map');

let sqlContentMap = {};

/**
 * 讀取sql文件內容
 * @param {string} fileName  文件名稱
 * @param {string} path      文件所在路徑
 * @return {string}          腳本文件內容
 */
function getSqlContent(fileName, path) {
    let content = fs.readFileSync(path, 'binary');
    sqlContentMap[fileName] = content;
}

function getSqlContentMap() {
    let sqlMap = getSqlMap();
    for (let key of sqlMap) {
        getSqlContent(key, sqlMap[key]);
    }
    return sqlContentMap;
}

module.exports = getSqlContentMap;
```

*util/get-sql-map.js*：

```js
const fs = require('fs');
const walkFile = require('./walk-file');

/**
 * 獲取sql目錄下的文件數據目錄
 * @return {object}
 */
function getSqlMap() {
    let basePath = __dirname;
    basePath = basePath.replace(/\\/g, '\/');

    let pathArr = basePath.split('\/');
    pathArr = pathArr.splice(0, pathArr.length - 1);
    basePath = pathArr.join('/') + '/sql/';

    let fileList = walkFile(basePath, 'sql');
    return fileList;
}

module.exports = getSqlMap;
```

*util/walk-file.js*：

```js
const fs = require('fs');

/**
 * 遍歷目錄下的文件目錄
 * @param {string} pathResolve  需進行遍歷的目錄路徑
 * @param {string} mime         遍歷文件的後綴名
 * @return {object}             返回遍歷後的目錄結果
 */
const walkFile = function (pathResolve, mime) {

    let files = fs.readFileSync(pathResolve);

    let fileList = {};

    for (let [i, item] of files.entries()) {
        let itemArr = item.split('\.');

        let itemMime = (itemArr.length > 1) ? itemArr[itemArr.length - 1] : 'undefined';
        let keyName = item + '';
        if (mime === itemMime) {
            fileList[item] = pathResolve + item;
        }
    }

    return fileList;
};

module.exports = walkFile;
```

*sql/data.sql*：

```sql
CREATE TABLE   IF NOT EXISTS  `data` (
  `id` int(11) NOT NULL AUTO_INCREMENT,
  `data_info` json DEFAULT NULL,
  `create_time` varchar(20) DEFAULT NULL,
  `modified_time` varchar(20) DEFAULT NULL,
  `level` int(11) DEFAULT NULL,
  PRIMARY KEY (`id`)
) ENGINE=InnoDB DEFAULT CHARSET=utf8
```

*sql/user.sql*：

```sql
CREATE TABLE   IF NOT EXISTS  `user` (
  `id` int(11) NOT NULL AUTO_INCREMENT,
  `email` varchar(255) DEFAULT NULL,
  `password` varchar(255) DEFAULT NULL,
  `name` varchar(255) DEFAULT NULL,
  `nick` varchar(255) DEFAULT NULL,
  `detail_info` json DEFAULT NULL,
  `create_time` varchar(20) DEFAULT NULL,
  `modified_time` varchar(20) DEFAULT NULL,
  `level` int(11) DEFAULT NULL,
  PRIMARY KEY (`id`)
) ENGINE=InnoDB DEFAULT CHARSET=utf8;

INSERT INTO `user` set email='1@example.com', password='123456';
INSERT INTO `user` set email='2@example.com', password='123456';
INSERT INTO `user` set email='3@example.com', password='123456';
```

### 效果

```sh
node index.js
```