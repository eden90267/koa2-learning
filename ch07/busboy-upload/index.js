const Koa = require('koa');
// const bodyParser = require('koa-bodyparser');
const path = require('path');

const app = new Koa();

const {uploadFile} = require('./util/upload');

// app.use(bodyParser());

app.use(async (ctx) => {

    if (ctx.url === '/' && ctx.method === 'GET') {
        // 當GET請求時候返回表單頁面
        let html = `
          <h1>koa2 upload demo</h1>
          <form action="/upload.json" method="post" enctype="multipart/form-data">
            <p>file upload</p>
            <span>picName:</span><input type="text" name="picName"><br>
            <input type="file" name="file"><br><br>
            <button type="submit">submit</button>
          </form>
        `;
        ctx.body = html;
    } else if (ctx.url === '/upload.json' && ctx.method === 'POST') {
        // 上傳文件請求處理
        let result = {success: false};
        let serverFilePath = path.join(__dirname, 'upload-files');

        // 上傳文件事件
        result = await uploadFile(ctx, {
            fileType: 'album', // common or album
            path: serverFilePath,
        });

        ctx.body = result;
    } else {
        ctx.body = '<h1>404！！！ o(╯□╰)o</h1>';
    }

});

app.listen(3000);
console.log('[demo] upload-simple is starting at port 3000');