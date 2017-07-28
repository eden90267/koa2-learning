const path = require('path');
const Koa = require('koa');
const views = require('koa-views');
const koaStatic = require('koa-static');
const bodyParser = require('koa-bodyparser');
const koaLogger = require('koa-logger');
const session = require('koa-session-minimal');
const MysqlStore = require('koa-mysql-session');

const config = require('./../config');
const routers = require('./routers/index');

const app = new Koa();

// session存儲配置
const sessionMysqlConfig = {
  user: config.database.USERNAME,
  password: config.database.PASSWORD,
  database: config.database.DATABASE,
  host: config.database.HOST,
};

// 配置session中間件
app.use(session({
  key: 'USER_SID',
  store: new MysqlStore(sessionMysqlConfig)
}));

// 配置控制台日誌中間件
app.use(koaLogger());

// 配置ctx.body解析中間件
app.use(bodyParser());

// 配置靜態資源加載中間件
app.use(koaStatic(path.join(__dirname, './../static')));

// 配置服務端模板渲染引擎中間件
app.use(views(path.join(__dirname, './views'), {
  extension: 'ejs'
}));

// 初始化路由中間件
app.use(routers.routes()).use(routers.allowedMethods());

// 監聽啟動端口
app.listen(config.port);
console.log(`the server is start at port ${config.port}`);