function log(ctx) {
    console.log(ctx.method, ctx.header.host + ctx.url);
}

module.exports = function () {
    return function *(next) {

        // 執行中間件的操作
        log(this);

        if (next) {
            yield next;
        }
    }
};