const fs = require('fs');
const path = require('path');

const Busboy = require('busboy');

/**
 * 同步創建文件目錄
 * @param {string} dirname 目錄絕對地址
 * @return {boolean}           創建目錄結果
 */
function mkdirSync(dirname) {
    if (fs.existsSync(dirname)) {
        return true;
    } else {
        if (mkdirSync(path.dirname(dirname))) {
            fs.mkdirSync(dirname);
            return true;
        }
    }
}

/**
 * 獲取上傳文件的後綴名
 * @param {string} fileName
 * @return {string}                 文件後綴名
 */
function getSuffixName(fileName) {
    let nameList = fileName.split('.');
    return nameList[nameList.length - 1];
}

/**
 * 上傳文件
 * @param {object} ctx   koa context
 * @param {object} options 文件上傳參數 fileType文件類型 path文件存放路徑
 * @return {Promise}
 */
function uploadFile(ctx, options) {
    let req = ctx.req;
    let res = ctx.res;
    let busboy = new Busboy({headers: req.headers});

    let fileType = options.fileType || 'common';
    let filePath = path.join(options.path, fileType);
    let mkdirResult = mkdirSync(filePath);

    return new Promise((resolve, reject) => {
        console.log('文件上傳中...');
        let result = {
            success: false,
            message: '',
            data: null
        };

        // 解析請求文件事件
        busboy.on('file', function (fieldname, file, filename, encoding, mimetype) {
            let fileName = Math.random().toString(16).substr(2) + '.' + getSuffixName(filename);
            let _uploadFilePath = path.join(filePath, fileName);
            let saveTo = path.join(_uploadFilePath);

            // 文件保存到制定路徑
            file.pipe(fs.createWriteStream(saveTo));

            // 文件寫入事件結束
            file.on('end', function () {
                result.success = true;
                result.message = '文件上傳成功';
                result.data = {
                    pictureUrl: `//${ctx.host}/image/${fileType}/${fileName}`
                };
                console.log('文件上傳成功！');
                resolve(result);
            });
        });

        // 解析結束事件
        busboy.on('finish', function () {
            console.log('文件上傳結束');
            resolve(result);
        });

        // 解析錯誤事件
        busboy.on('error', function (err) {
            console.log('文件上傳出錯');
            reject(result);
        });

        req.pipe(busboy);
    });
}

module.exports = {
    uploadFile
};