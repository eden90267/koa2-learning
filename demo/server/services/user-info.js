/**
 * 用戶業務操作
 */

const validator = require('validator');
const userModel = require('./../models/user-info');
const userCode = require('./../codes/user');

const user = {

  /**
   * 創建用戶
   * @param {object} user 用戶信息
   * @return {object}        創建結果
   */
  async create(user) {
    let result = await userModel.create(user);
    return result;
  },


  /**
   * 查找存在用戶信息
   * @param {object} formData 查找的表單資料
   * @return {object|null}          查找結果
   */
  async getExistOne(formData) {
    let resultData = await userModel.getExistOne({
      'email': formData.email,
      'name': formData.userName
    });
    return resultData;
  },

  /**
   * 登陸業務操作
   * @param {object} formData 登陸表單信息
   * @return {object|null}          登陸業務操作結果
   */
  async signIn(formData) {
    let resultData = await userModel.getOneByUserNameAndPassword({
      'password': formData.password,
      'name': formData.userName
    });
    return resultData;
  },

  /**
   * 根據用戶名查找用戶業務操作
   * @param {string} userName 用戶名
   * @return {object|null}          查找結果
   */
  async getUserInfoByUserName(userName) {
    let resultData = await userModel.getUserInfoByUserName(userName) || {};
    let userInfo = {
      // id: resultData.id,
      email: resultData.email,
      userName: resultData.name,
      detailInfo: resultData.detail_info,
      createTime: resultData.create_time
    };
    return userInfo;
  },

  /**
   * 檢驗用戶註冊資料
   * @param {object} userInfo 用戶註冊
   * @result {object}                校驗結果
   */
  validatorSignUp(userInfo) {
    let result = {
      success: false,
      message: '',
    };

    if (/[a-z0-9\_\-]{6,16}/.test(userInfo.userName) === false) {
      result.message = userCode.ERROR_USER_NAME;
      return result;
    }
    if (!validator.isEmail(userInfo.email)) {
      result.message = userCode.ERROR_EMAIL;
      return result;
    }
    if (/[\w+]{6,16}/.test(userInfo.password) === false) {
      result.message = userCode.ERROR_PASSWORD;
      return result;
    }
    if ( userInfo.password !== userInfo.confirmPassword) {
      result.message = userCode.ERROR_PASSWORD_CONFORM;
      return result;
    }

    result.success = true;

    return result;
  }

};

module.exports = user;