# 模板引擎

## koa2加載模板引擎

### 快速開始

#### 安裝模組

```
npm i koa-views ejs --save
```

#### 使用模板引擎

**文件目錄**：

```
├── package.json
├── index.js
└── view
    └── index.ejs
```

*index.js*：

```
const Koa = require('koa');
const views = require('koa-views');
const path = require('path');

const app = new Koa();

// 加載模板引擎
app.use(views(path.join(__dirname, './view'), {
    extension: 'ejs'
}));

app.use(async (ctx) => {
    let title = 'hello koa2';
    await ctx.render('index', {
        title,
    });
});

app.listen(3000);
```

`view/index.ejs`模板：

```
<!DOCTYPE html>
<html>
<head>
    <title><%= title %></title>
</head>
<body>
<h1><%= title %></h1>
<p>EJS Welcome to <%= title %></p>
</body>
</html>
```

## ejs模板引擎

具體查看ejs官方文檔