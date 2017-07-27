import React from 'react';
import {Layout, Menu, Icon} from 'antd';

const {Header, Sider, Content} = Layout;

class Work extends React.Component {

  state = {
    collapsed: false,
  };

  toggle = () => {
    this.setState({
      collapsed: !this.state.collapsed
    });
  };

  render() {

  }

}

export default Work;