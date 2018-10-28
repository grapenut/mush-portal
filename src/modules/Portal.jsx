import React from 'react';
import PropTypes from 'prop-types';
import { withStyles, MuiThemeProvider } from '@material-ui/core/styles';
import Theme from './Theme';

import TaskBar from './TaskBar';
import Terminal from './Terminal';
import Input from './Input';
import StatusBar from './StatusBar';
import Login from './Login';
import SideBar from './SideBar';

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
    displayer: "flex",
    flex: 1,
    left: 0,
    width: "100%",
  },
  flex: {
    flex: 1,
  },
  bottom: {
    bottom: 0,
    left: 0,
    width: "100%",
  },
});

class Portal extends React.Component {
  constructor(props) {
    super(props);
    this.state = { };
  }
  
  componentDidMount() {
    window.scrollTo(0,1);
  }
  
  render() {
    const { classes } = this.props;
    const { openSidebar } = window.client.settings;
    return (
      <MuiThemeProvider theme={Theme}>
        <div className={classes.frame}>
          <div className={classes.top}>
            <Taskbar title="MUSH Portal" />
          </div>
          <div className={classes.middle}>
            <div className={classes.flex}>
              <Terminal />
            </div>
            <div>
              <Sidebar />
            </div>
          </div>
          <div className={classes.bottom}>
            <Input />
            <Statusbar />
          </div>
          <Login />
        </div>
      </MuiThemeProvider>
    );
  }
}

Portal.propTypes = {
  classes: PropTypes.object.isRequired,
  theme: PropTypes.object.isRequired,
};

export default withStyles(styles, { withTheme: true })(Portal);

