import React from 'react';
import PropTypes from 'prop-types';
import classNames from 'classnames';
import { withStyles } from '@material-ui/core/styles';

import Header from './Header';
import Menubar from './MenuBar';
import Terminal from './Terminal';
import Feed from './Feed';
import Input from './Input';
import Footer from './Footer';

const styles = theme => ({
  portal: {
    flex: 1,
    flexGrow: 1,
  },
});

class Portal extends React.Component {
  render() {
    const { classes, theme } = this.props;
    return (
      <div className={classes.portal}>
        <Header title="MUSH Portal" />
        <Menubar />
        <Terminal terminal={this.props.terminal} output={this.props.output} links={this.props.links} prompt={this.props.prompt} />
        <Feed />
        <Input input={this.props.input} />
        <Footer />
      </div>
    );
  }
}

export default withStyles(styles, { withTheme: true })(Portal);

