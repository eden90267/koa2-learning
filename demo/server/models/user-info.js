const dbUtils = require('./../utils/db-util');

const user = {

  /**
   * 資料庫創建用戶
   * @param {object} model 用戶資料模型
   * @return {object}            mysql執行結果
   */
  async create(model) {
    let result = await dbUtils.insertData('user_info', model);
    return result;
  },

  /**
   * 查找一個存在用戶的資料
   *
   * @param {object} options 查找條件參數
   * @return {object|null}       查找結果
   */
  async getExistOne(options) {
    let _sql = `
    SELECT * FROM user_info
      WHERE email="${options.email}" or name="${options.name}"
      LIMIT 1
    `;
    let result = await dbUtils.query(_sql);
    if (Array.isArray(result) && result.length > 0) {
      result = result[0];
    } else {
      result = null;
    }
    return result;
  },

  /**
   * 根據用戶名稱和密碼查找用戶
   * @param {object} options 用戶名稱密碼對象
   * @return {object|null}       查找結果
   */
  async getOneByUserNameAndPassword(options) {
    let _sql = `
    SELECT * FROM user_info
      WHERE password="${options.password}" and name="${options.name}"
      LIMIT 1
    `;
    let result = await dbUtils.query(_sql);
    if (Array.isArray(result) && result.length > 0) {
      result = result[0];
    } else {
      result = null;
    }
    return result;
  },

  /**
   * 根據用戶名稱查找用戶信息
   * @param {string} userName 用戶帳號名稱
   * @return {object|null}          查找結果
   */
  async getUserInfoByUserName(userName) {

    let result = await dbUtils.select('user_info', ['id', 'email', 'name', 'detail_info', 'create_time', 'modified_time', 'modified_time']);
    if (Array.isArray(result) && result.length > 0) {
      result = result[0];
    } else {
      result = null;
    }
    return result;
  }

};

module.exports = user;