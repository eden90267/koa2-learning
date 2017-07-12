const fs = require('fs');

/**
 * 讀取文件方法
 * @param {string} filePath 文件本地的絕對路徑
 * @return {string|binary}
 */
function file(filePath) {
    return fs.readFileSync(filePath, 'binary');
}

module.exports = file;