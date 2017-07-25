/**
 * 管理員用戶子路由
 */

const router = require('koa-router')();
const admin = require('../controllers/admin');

module.exports = router.get('/', admin.indexPage);