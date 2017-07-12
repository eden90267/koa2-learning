const fs = require('fs');

/**
 * 讀取文件方法
 * @param {string} 文件本地的絕對路徑
 * @return {string|binary}
 */
function file(filePath) {
    let content = fs.readFileSync(filePath, 'binary');
    return content;
}

module.exports = file;