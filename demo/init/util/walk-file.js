const fs = require('fs');

/**
 * 遍歷目錄下的文件目錄
 * @param {string} pathResolve 需進行遍歷的目錄路徑
 * @param {string} mime           遍歷文件的後綴名
 * @return {object}                    返回遍歷後的目錄結果
 */
const walkFile = function (pathResolve, mime) {

  let files = fs.readdirSync(pathResolve);

  let fileList = {};

  for (let [i, item] of files.entries()) {
    let itemArr = item.split('\.');

    let itemMime = itemArr.length > 1 ? itemArr[itemArr.length - 1] : 'undefined';
    let keyName = item + '';
    if (mime === itemMime) {
      fileList[item] = pathResolve + item;
    }
  }

  return fileList;
};

module.exports = walkFile;