const path = require('path');
const fs = require('fs');

// 封裝讀取目錄內容方法
const dir = require('./dir');

// 封裝讀取文件內容方法
const file = require('./file');

/**
 * 獲取靜態資源內容
 * @param {object} ctx koa上下文
 * @param {string} fullStaticPath 靜態資源目錄在本地絕對路徑
 * @return {string} 請求獲取到的本地內容
 */
async function content(ctx, fullStaticPath) {

    // 封裝請求資源的完絕路徑
    let reqPath = path.join(fullStaticPath, ctx.url);

    // 判斷請求路徑是否為存在目錄或者文件
    let exist = fs.existsSync(reqPath);

    // 返回請求內容，default為空
    let content = '';

    if (!exist) {
        // 如果請求路徑不存在，返回404
        content = '404 Not Found！ o(╯□╰)o！';
    } else {
        // 判斷訪問地址是文件夾還是文件
        let stat = fs.statSync(reqPath);

        if (stat.isDirectory()) {
            // 如果為目錄，則渲染讀取目錄內容
            content = dir(ctx.url, reqPath);
        } else {
            // 如果請求為文件，則讀取文件內容
            content = file(reqPath);
        }
    }

    return content;
}

module.exports = content;