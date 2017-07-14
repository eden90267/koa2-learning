/**
 * Created by eden_liu on 2017/7/14.
 */
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