const fs = require('fs');
const getSqlMap = require('./get-sql-map');

let sqlContentMap = {};

/**
 * 讀取sql文件內容
 * @param {string} fileName
 * @param {string} path
 */
function getSqlContent(fileName, path) {
  let content = fs.readFileSync(path, 'binary');
  sqlContentMap[fileName] = content;
}

function getSqlContentMap() {
  let sqlMap = getSqlMap();
  for (let key in sqlMap) {
    getSqlContent(key, sqlMap[key]);
  }
  return sqlContentMap;
}

module.exports = getSqlContentMap;