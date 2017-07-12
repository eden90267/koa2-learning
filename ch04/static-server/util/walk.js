/**
 * Created by eden90267 on 2017/7/12.
 */
const fs = require('fs');
const mimes = require('./mimes');

/**
 * 遍歷讀取目錄內容
 * @param {string} reqPath 請求資源的絕對路徑
 * @return {Array.<*>} 目錄內容列表
 */
function walk(reqPath) {

    let files = fs.readdirSync(reqPath);

    let dirList = [], fileList = [];
    for (let i = 0, len = files.length; i < len; i++) {
        let item = files[i];
        let itemArr = item.split('\.');
        let itemMime = itemArr.length > 1 ? itemArr[itemArr.length - 1] : 'undefined';

        if (typeof mimes[itemMime] === 'undefined') {
            dirList.push(files[i]);
        } else {
            fileList.push(files[i]);
        }
    }

    let result = dirList.concat(fileList);

    return result;
}

module.exports = walk;