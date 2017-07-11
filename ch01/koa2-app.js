const Koa = require('koa');
const convert = require('koa-convert');
const loggerGenerator = require('./middleware/logger-generator');
const loggerAsync = require('./middleware/logger-async');
const app = new Koa();

app.use(convert(loggerGenerator()));

app.use(loggerAsync());

app.use((ctx) => {
    ctx.body = 'hello world!';
});

app.listen(3000);
console.log('the server is starting at port 3000');