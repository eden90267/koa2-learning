const Koa = require('koa');
const path = require('path');

const content = require('./util/content');
const mimes = require('./util/mimes');

const app = new Koa();

// 靜態資源對於相對入口文件index.js的路徑
const staticPath = './static';

// 解析資源類型
function parseMime(url) {
    let extName = path.extname(url);
    extName = extName ? extName.slice(1) : 'unknow';
    return mimes[extName];
}