import React from 'react';
import {Tabs} from 'antd';
import SignInForm from './../components/sign-in-form';
import SignUpForm from './../components/sign-up-form';

const TabPane = Tabs.TabPane;

class FormGroup extends React.Component {
  render() {
    return (
      <div style={{width: "640px", margin: "0 auto"}}>
        <Tabs defaultActiveKey="1" size="small">
          <TabPane tab="登錄" key="1">
            <SignInForm/>
          </TabPane>
          <TabPane tab="註冊" key="2">
            <SignUpForm/>
          </TabPane>
        </Tabs>
      </div>
    )
  }
}

export default FormGroup;