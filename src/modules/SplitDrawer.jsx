import React from 'react';
import PropTypes from 'prop-types';
import classNames from 'classnames';
import { withStyles } from '@material-ui/core/styles';
import Hidden from '@material-ui/core/Hidden';
import Drawer from '@material-ui/core/Drawer';
import SwipeableDrawer from '@material-ui/core/SwipeableDrawer';
import Typography from '@material-ui/core/Typography';
import Feed from './Feed';
import Terminal from './Terminal';

const defaultDrawerWidth = 240;
const minDrawerWidth = 50;

const styles = theme => ({
  frame: {
    display: "flex",
    "flex-flow": "row nowrap",
    width: "100%",
    height: "100%",
  },
  drawer: {
    height: "100%",
  },
  dragbar: {
    display: "flex",
    height: "100%",
    "background-color": theme.palette.primary.main,
    "vertical-align": "middle",
    "text-align": "center",
  },
  draghint: {
    flex: 1,
    float: "left",
    "writing-mode": "vertical-rl",
    transform: "rotate(-180deg)",
  },
  drawerPaper: {
    position: 'relative',
  },
  main: {
    flex: 1,
    position: 'relative',
    backgroundColor: theme.palette.background.default,
    transition: theme.transitions.create('margin', {
      easing: theme.transitions.easing.sharp,
      duration: theme.transitions.duration.leavingScreen,
    }),
  },
});

class SplitDrawer extends React.Component {

  constructor(props) {
    super(props);
    this.state = {
      open: true,
      dragging: false,
      lastX: 0,
      width: { width: defaultDrawerWidth },
      lastWidth: { width: defaultDrawerWidth },
    };
  }

  openDrawer = () => {
    this.setState({ open: true });
    this.setState({ width: this.state.lastWidth });
  };

  closeDrawer = () => {
    this.setState({ open: false });
    this.setState({ lastWidth: this.state.width });
    this.setState({ width: { width: 0 } });
  };
  
  toggleDrawer = () => {
    if (this.state.open) {
      this.closeDrawer();
    } else {
      this.openDrawer();
    }
  };
  
  mouseDown = (e) => {
    this.setState({ dragging: true, lastX: e.clientX });
  };
  
  mouseUp = (e) => {
    this.setState({ dragging: false });
    if (e.clientX === this.state.lastX) {
      this.toggleDrawer();
    }
  };
  
  mouseMove = (e) => {
    // we don't want to do anything if we aren't resizing.
    if (!this.state.dragging) {
      return;
    }

    let offsetRight = document.body.offsetWidth - (e.clientX - document.body.offsetLeft);
    if (offsetRight < minDrawerWidth) {
      let initialRight = document.body.offsetWidth - (this.state.lastX - document.body.offsetLeft)
      this.setState({ width: { width: initialRight } });
      this.closeDrawer();
    } else if (offsetRight > minDrawerWidth) {
      this.setState({ width: { width: offsetRight } });
    }
  };

  componentDidMount() {
    document.addEventListener('mousemove', e => this.mouseMove(e));
    document.addEventListener('mouseup', e => this.mouseUp(e));
  }

  render() {
    const { classes, theme, terminal_ids, feed_ids } = this.props;
    const { open, width, dragging } = this.state;
    
    return (
      <div className={classes.frame}>
        <div className={classes.main}>
          <Terminal ids={terminal_ids} />
        </div>
        <Hidden smDown implementation="css">
          <div id={feed_ids.dragbar} className={classes.dragbar} onMouseDown={this.mouseDown}>
            <Typography variant="button" color="inherit" noWrap className={classes.draghint}>
              {open ? "Drag to resize" : "Click to open feed"}
            </Typography>
          </div>
        </Hidden>
        <div className={classes.drawer} style={width}>
{/*
          <SwipeableDrawer
            variant="persistent"
            anchor="right"
            open={open}
            onClose={this.closeDrawer}
            onOpen={this.openDrawer}
            classes={{ paper: classes.drawerPaper }}
            PaperProps={{ style: width }}
          >
            <Feed ids={feed_ids} />
          </SwipeableDrawer>
*/}
        </div>
      </div>
    );
  }
}

export default withStyles(styles, { withTheme: true })(SplitDrawer);


