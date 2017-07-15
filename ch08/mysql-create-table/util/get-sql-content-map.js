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