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
  frame: {
    width: "100%",
    height: "100%",
    background: "white",
    position: "absolute",
    top: 0,
    left: 0,
    display: "flex",
    "flex-flow": "column nowrap",
  },
  top: {
    top: 0,
    left: 0,
    width: "100%",
  },
  middle: {
    flex: 1,
    left: 0,
    width: "100%",
  },
  twopanel: {
    display: "flex",
    "flex-flow": "row nowrap",
    width: "100%",
    height: "100%",
  },
  left: {
    "width": "80em",
  },
  right: {
    flex: 1,
    width: "100%",
  },
  bottom: {
    bottom: 0,
    left: 0,
    width: "100%",
  },
});

class Portal extends React.Component {
  render() {
    const { classes, theme, terminal_ids } = this.props;
    return (
      <div className={classes.frame}>
        <div className={classes.top}>
          <Header title="MUSH Portal" />
          <Menubar />
        </div>
        <div className={classes.middle}>
          <div className={classes.twopanel}>
            <div className={classes.left}>
              <Terminal ids={terminal_ids} />
            </div>
          </div>
        </div>
        <div className={classes.bottom}>
          <Input id={terminal_ids.input} />
          <Footer />
        </div>
      </div>
    );
  }
}
//            <div className={classes.right}>
//              <Feed />
//            </div>

export default withStyles(styles, { withTheme: true })(Portal);

