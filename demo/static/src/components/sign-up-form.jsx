import React from 'react';
import {Form, Input, Tooltip, Icon, Cascader, Select, Row, Col, Checkbox, Button, message} from 'antd';
import {signUpApi} from './../api/sign-up';

const FormItem = Form.Item;
const Option = Select.Option;

const SignUpForm = Form.create()(React.createClass({

  getInitialState() {
    return {
      passwordDirty: false,
    };
  },

  async handleSubmit(e) {
    e.preventDefault();
    let values = await this.getFormValues();

    if (values) {
      let result = await signUpApi(values);
      if (result && result.success === true) {
        message.success('註冊成功');
        window.location.href = '/admin?signUpSuccess=true';
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
      });
    });
  },

  handlePasswordBlur(e) {
    const value = e.target.value;
    this.setState({passwordDirty: this.state.passwordDirty || !!value});
  },

  checkConfirm(rule, value, callback) {
    const form = this.props.form;
    if (value && this.state.passwordDirty) {
      form.validateFields(['confirm', {force: true}]);
    }
    callback();
  },

  checkPassword(rule, value, callback) {
    const form = this.props.form;
    if (value && value !== form.getFieldValue('password')) {
      callback('兩次密碼輸入不一致，請你檢查！');
    } else {
      callback();
    }
  },


  render() {
    const {getFieldDecorator} = this.props.form;
    const formItemLayout = {
      labelCol: {span: 6},
      wrapperCol: {span: 14},
    };
    const tailFormItemLayout = {
      wrapperCol: {
        span: 14,
        offset: 6,
      }
    };

    return (
      <Form onSubmit={this.handleSubmit}>
        <FormItem
          {...formItemLayout}
          label={(
            <span>
              用戶名
              <Tooltip title="必須是小寫6-16位字母，或數字，或下劃線，不能以數字開頭">
                <Icon type="question-circle-o"/>
              </Tooltip>
            </span>
          )}
          hasFeedback
        >
          {getFieldDecorator('userName', {
            rules: [{required: true, message: '請輸入你的用戶名'}],
          })(
            <Input/>
          )}
        </FormItem>
        <FormItem
          {...formItemLayout}
          label="E-mail地址"
          hasFeedback
        >
          {getFieldDecorator('email', {
            rules: [{
              type: 'email', message: '請你輸入正確格式的郵箱地址',
            }, {
              required: true, message: '請您輸入郵箱地址！',
            }],
          })(
            <Input/>
          )}
        </FormItem>
        <FormItem
          {...formItemLayout}
          label="密碼"
          hasFeedback
        >
          {getFieldDecorator('password', {
            rules: [{
              required: true, message: '請您輸入您的帳號密碼！',
            }, {
              validator: this.checkConfirm
            }],
          })(
            <Input type="password" onBlur={this.handlePasswordBlur}/>
          )}
        </FormItem>
        <FormItem
          {...formItemLayout}
          label="確認密碼"
          hasFeedback
        >
          {getFieldDecorator('confirmPassword', {
            rules: [{
              required: true, message: '請您再次輸入帳號密碼進行確認！',
            }, {
              validator: this.checkPassword,
            }],
          })(
            <Input type="password"/>
          )}
        </FormItem>
        <FormItem {...tailFormItemLayout} style={{marginBottom: 8}}>
          {getFieldDecorator('agreement', {
            valuePropName: 'checked',
          })(
            <Checkbox>我已閱讀 <a>《xxxx協議》</a></Checkbox>
          )}
        </FormItem>
        <FormItem {...tailFormItemLayout}>
          <Button type="primary" htmlType="submit" size="large">確定</Button>
        </FormItem>
      </Form>
    );
  }

}));

export default SignUpForm;