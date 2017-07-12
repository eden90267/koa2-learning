const url = require('url');

// 遍歷讀取目錄內容方法
const walk = require('./walk');

/**
 * 封裝目錄內容
 * @param {string} url 當前請求的上下文中的url，即ctx.url
 * @param {string} reqPath 請求靜態資源的完整本地路徑
 * @return {string} 返回目錄內容，封裝成HTML
 */
function dir(url, reqPath) {

    // 遍歷讀取當前目錄下的文件、子目錄
    let contentList = walk(reqPath);

    let html = `<ul>`;
    for (let [index, item] of contentList.entries()) {
        html = `${html}<li><a href="${url === '/' ? '' : url}/${item}">${item}</a></li>`;
    }
    html = `${html}</ul>`;

    return html;
}

module.exports = dir;