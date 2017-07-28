import Request from './../utils/request';
import validator from 'validator';

function validatorSignUp(userInfo) {
  let result = {
    success: false,
    message: '',
  };

  if (/[a-z0-9\_\-]{6,16}/.test(userInfo.userName) === false) {
    result.message = '用戶名格式為6-16位的小寫字母，包括-、_';
    return result;
  }
  if (!validator.isEmail(userInfo.email)) {
    result.message = '請輸入正確的郵箱地址';
    return result;
  }
  if (!/[\w+]{6,16}/.test(userInfo.password)) {
    result.message = '密碼長度應該為6-16';
    return result;
  }
  if (userInfo.password !== userInfo.confirmPassword) {
    result.message = '兩次密碼不一致';
    return result;
  }

  result.success = true;

  return result;
}

const signUpApi = async (userInfo) => {

  let validateResult = validatorSignUp(userInfo);

  if (validateResult.success === false) {
    return validateResult;
  }

  let result = Request.post({
    url: '/api/user/signUp.json',
    data: userInfo
  });

  return result;
};

export {signUpApi};