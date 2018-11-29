import React from 'react';
import PropTypes from 'prop-types';
import { withStyles, MuiThemeProvider } from '@material-ui/core/styles';

import Taskbar from '../Taskbar';
import Terminal from '../Terminal';
import Input from '../Input';
import Statusbar from '../Statusbar';
import Login from '../Login';
import Sidebar from '../Sidebar';

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
    position: "relative",
    display: "flex",
    "flex-flow": "row nowrap",
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
  dock: {
    position: "relative",
    height: "100%",
    backgroundColor: theme.palette.background.paper,
  },
});

class Portal extends React.Component {
  constructor(props) {
    super(props);
    this.state = {
      theme: props.theme,
    };
    
    this.middle = React.createRef();
    this.terminal = React.createRef();
    this.dock = React.createRef();
  }
  
  componentDidMount() {
    const { sidebarAlwaysShow } = window.client.settings;
    
    window.client.react.portal = this;
    window.scrollTo(0,1);
    window.client.container = this.middle.current;

    if (sidebarAlwaysShow) {
      window.client.container = this.terminal.current;
    } else {
      window.client.container = this.middle.current;
    }
  }

  componentWillUnmount() {
    window.client.react.portal = null;
  }
  
  updateTheme(theme) {
    this.setState({ theme });
  }
  
  render() {
    const { classes } = this.props;
    const { theme } = this.state;
    const { sidebarOpen, sidebarAnchor, ansiFG, ansiBG, wrapWidth,
      sidebarAlwaysShow, sidebarShowExits, sidebarShowPlayers,
      sidebarShowThings, sidebarShowCompass, sidebarDense } = window.client.settings;
      
    var left = sidebarOpen && sidebarAnchor === "left";
    var right = sidebarOpen && sidebarAnchor === "right";
    
    if (sidebarAlwaysShow) {
      window.client.container = this.terminal.current;
    } else {
      window.client.container = this.middle.current;
    }
    
    var sidebar = (<Sidebar sidebarShowCompass={sidebarShowCompass} sidebarDense={sidebarDense} sidebarShowExits={sidebarShowExits} sidebarShowPlayers={sidebarShowPlayers} sidebarShowThings={sidebarShowThings} />);

    return (
      <MuiThemeProvider theme={theme}>
        <div className={classes.frame}>
          <div className={classes.top}>
            <Taskbar title="MUSH Portal" />
          </div>
          <div className={classes.middle} ref={this.middle}>
            {left && sidebar}
            <Terminal width={wrapWidth} ansiFG={ansiFG} ansiBG={ansiBG} containerRef={this.terminal} />
            {right && sidebar}
          </div>
          <div className={classes.bottom}>
            <Input ansiFG={ansiFG} ansiBG={ansiBG} />
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

