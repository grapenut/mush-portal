import React from 'react';

import Header from './Header';
import Menubar from './MenuBar';
import Terminal from './Terminal';
import Feed from './Feed';
import Input from './Input';
import Footer from './Footer';

export default class Portal extends React.Component {
  render() {
    return (
      <div className="client">
        <Header title="MUSH Web Portal" />
        <Menubar />
        <Terminal terminal={this.props.terminal} output={this.props.output} links={this.props.links} prompt={this.props.prompt} />
        <Feed />
        <Input input={this.props.input} />
        <Footer />
      </div>
    );
  }
}