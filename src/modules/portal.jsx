import React from 'react';

import Header from './header';
import Menubar from './menubar';
import Terminal from './terminal';
import Feed from './feed';
import Input from './input';
import Footer from './footer';

export default class Portal extends React.Component {
  render() {
    return (
      <div className="client">
        <Header title="MUSH Web Portal" />
        <Menubar />
        <Terminal />
        <Feed />
        <Input name="input1" />
        <Input name="input2" hidden />
        <Footer />
      </div>
    );
  }
}