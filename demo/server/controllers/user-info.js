const userInfoService = require('./../services/user-info');
const userCode = require('./../codes/user');

module.exports = {

  /**
   * 登陸操作
   * @param {object} ctx 上下文對象
   */
  async signIn(ctx) {
    let formData = ctx.request.body;
    let result = {
      success: false,
      message: '',
      data: null,
      code: ''
    };

    let userResult = await userInfoService.signIn(formData);

    if (userResult) {
      if (formData.userName === userResult.name) {
        result.success = true;
      } else {
        result.message = userCode.FAIL_USER_NAME_OR_PASSWORD_ERROR;
        result.code = 'FAIL_USER_NAME_OR_PASSWORD_ERROR';
      }
    } else {
      result.message = userCode.FAIL_USER_NO_EXIST;
      result.code = 'FAIL_USER_NO_EXIST';
    }

    if (formData.source === 'form' && result.success === true) {
      let session = ctx.session;
      session.isLogin = true;
      session.userName = userResult.name;
      session.userId = userResult.id;

      ctx.redirect('/work');
    } else {
      ctx.body = result;
    }

  },


  async signUp(ctx) {
    let formData = ctx.request.body;
    let result = {
      success: false,
      message: '',
      data: null
    };

    let validateResult = userInfoService.validatorSignUp(formData);

    if (validateResult.success === false) {
      result = validateResult;
      ctx.body = result;
      return;
    }

    let existOne = await userInfoService.getExistOne(formData);
    console.log(existOne);

    if (existOne) {
      if (existOne.name === formData.userName) {
        result.message = userCode.FAIL_USER_NAME_IS_EXIST;
        ctx.body = result;
        return;
      }
      if (existOne.email === formData.email) {
        result.message = userCode.FAIL_EMAIL_IS_EXIST
        ctx.body = result;
        return
      }
    }

    let userResult = await userInfoService.create({
      email: formData.email,
      password: formData.password,
      name: formData.userName,
      create_time: new Date().getTime(),
      level: 1,
    });

    console.log(userResult);

    // todo ...

  }

};