const koa = require('koa');
const loggerGenerator = require('./middleware/logger-generator');
const app = koa();

app.use(loggerGenerator());

app.use(function *() {
    this.body = 'hello world!';
});

app.listen(3000);
console.log('the server is starting at port 3000');