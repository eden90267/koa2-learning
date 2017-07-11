const Koa = require('koa');

const app = new Koa();

app.use(async (ctx) => {

    if (ctx.url === '/' && ctx.method === 'GET') {
        // 當GET請求時候返回表單頁面
        let html = `
          <h1>koa2 request post demo</h1>
          <form action="/" method="post">
            <p>userName</p>
            <input type="text" name="userName"><br>
            <p>nickName</p>
            <input type="text" name="nickName"><br>
            <p>email</p>
            <input type="email" name="email"><br>
            <button type="submit">submit</button>
          </form>
        `;
        ctx.body = html;
    } else if (ctx.url === '/' && ctx.method === 'POST') {
        let postData = await parsePostData(ctx);
        ctx.body = postData;
    } else {
        ctx.body = '<h1>404！！！ o(╯□╰)o</h1>';
    }

});

// 解析context裡node原生請求的POST參數
function parsePostData(ctx) {
    return new Promise((resolve, reject) => {
        try {
            let postdata = '';
            ctx.req.addListener('data', (data) => {
                postdata += data;
            });
            ctx.req.addListener('end', () => {
                let parseData = parseQueryStr(postdata);
                resolve(parseData);
            })
        } catch (err) {
            reject(err);
        }
    })
}

// 將POST請求參數字符串解析成JSON
function parseQueryStr(queryStr) {
    let queryData = {};
    let queryStrList = queryStr.split('&');
    console.log(queryStrList);
    for (let [index, queryStr] of queryStrList.entries()) {
        let itemList = queryStr.split('=');
        queryData[itemList[0]] = decodeURIComponent(itemList[1])
    }
    return queryData;
}

app.listen(3000);
console.log('[demo] request post is starting at port 3000');