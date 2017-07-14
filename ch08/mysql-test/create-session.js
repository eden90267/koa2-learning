/**
 * Created by eden_liu on 2017/7/14.
 */
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