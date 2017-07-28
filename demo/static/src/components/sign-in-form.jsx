import React from 'react';
import {Form, Icon, Input, Button, Checkbox, message} from 'antd';
import Request from './../utils/request';
import {signInApi, signInForm} from "../api/sign-in";

const FormItem = Form.Item;

const SignInForm = Form.create()(React.createClass({

  async handleSubmit(e) {
    e.preventDefault();

    let values = await this.getFormValues();
    if (values) {
      let result = await signInApi(values);
      if (result && result.success === true) {
        message.success('登陸成功');
        console.log(values);
        console.log(result);
        signInForm(values);
      } else if (result && result.message) {
        message.error(result.message);
      }
    } else {
      message.error('系統繁忙，稍後再試！');
    }
  },

  getFormValues() {
    let that = this;
    return new Promise((resolve, reject) => {
      that.props.form.validateFields((err, values) => {
        if (!err) {
          resolve(values);
        } else {
          reject(false);
        }
      })
    })
  },

  render() {
    const {getFieldDecorator} = this.props.form;
    return (
      <div style={{width: "280px", margin: "0 auto"}}>
        <Form onSubmit={this.handleSubmit} className="login-form">
          <FormItem>
            {getFieldDecorator('userName', {
              rules: [{required: true, message: '請你輸入帳號名稱！'}],
            })(
              <Input addonBefore={<Icon type="user"/>} placeholder="請您輸入用戶名稱！"/>
            )}
          </FormItem>
          <FormItem>
            {getFieldDecorator('password', {
              rules: [{required: true, message: '請您輸入帳號密碼！'}],
            })(
              <Input addonBefore={<Icon type="lock"/>} type="password" placeholder="請您輸入帳號密碼"/>
            )}
          </FormItem>
          <FormItem>
            {getFieldDecorator('remember', {
              valuePropName: 'checked',
              initialValue: true,
            })(
              <Checkbox>記住登陸</Checkbox>
            )}
            <a className="login-form-forgot">忘記密碼</a>
            <Button type="primary" htmlType="submit" className="login-form-button">
              確定
            </Button>
          </FormItem>
        </Form>
      </div>
    );
  },


}));
export default SignInForm;