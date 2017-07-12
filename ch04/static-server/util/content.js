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

}