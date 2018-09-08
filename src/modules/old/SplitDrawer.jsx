import React from 'react';
import PropTypes from 'prop-types';
import { withStyles } from '@material-ui/core/styles';
//import Hidden from '@material-ui/core/Hidden';
//import Drawer from '@material-ui/core/Drawer';
import SwipeableDrawer from '@material-ui/core/SwipeableDrawer';
import Feed from './Feed';
import Typography from '@material-ui/core/Typography';
import Terminal from './Terminal';

const defaultDrawerWidth = 600;
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
    cursor: "col-resize",
  },
  draghint: {
    flex: 1,
    float: "left",
    "writing-mode": "vertical-rl",
    transform: "rotate(-180deg)",
  },
  drawerPaper: {
    position: 'relative',
    height: "100%",
    border: 0,
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
  expand: {
    height: "100%",
  },
});

class SplitDrawer extends React.Component {

  constructor(props) {
    super(props);
    this.state = {
      open: false,
      dragging: false,
      lastX: 0,
      width: { width: 0 },
      lastWidth: { width: defaultDrawerWidth },
    };
    this.client = props.client;
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
    if (!this.state.dragging) {
      return;
    }
  
    this.clearSelection();

    this.setState({ dragging: false });

    let offsetRight = document.body.offsetWidth - (e.clientX - document.body.offsetLeft);
    if (e.clientX === this.state.lastX) {
      this.toggleDrawer();
    } else if (offsetRight < minDrawerWidth) {
      let initialRight = document.body.offsetWidth - (this.state.lastX - document.body.offsetLeft)
      this.setState({ width: { width: initialRight } });
      this.closeDrawer();
    }
  };
  
  mouseMove = (e) => {
    // we don't want to do anything if we aren't resizing.
    if (!this.state.dragging) {
      return;
    }
    
    this.clearSelection();

    let offsetRight = document.body.offsetWidth - (e.clientX - document.body.offsetLeft);
    if (offsetRight < minDrawerWidth) {
      let initialRight = document.body.offsetWidth - (this.state.lastX - document.body.offsetLeft)
      this.setState({ width: { width: initialRight } });
      this.closeDrawer();
    } else if (offsetRight > minDrawerWidth) {
      this.setState({ width: { width: offsetRight } });
      if (!this.state.open) {
        this.openDrawer();
        return;
      }

    }
  };

  componentDidMount() {
    document.addEventListener('mousemove', e => this.mouseMove(e));
    document.addEventListener('mouseup', e => this.mouseUp(e));
    
    this.client.react.drawer = this;
  }

  clearSelection() {
    var sel;
    if ( (sel = document.selection) && sel.empty ) {
          sel.empty();
    } else {
      if (window.getSelection) {
          window.getSelection().removeAllRanges();
      }
      var activeEl = document.activeElement;
      if (activeEl) {
        var tagName = activeEl.nodeName.toLowerCase();
        if ( tagName === "textarea" ||
            (tagName === "input" && activeEl.type === "text") ) {
          // Collapse the selection to the end
          activeEl.selectionStart = activeEl.selectionEnd;
        }
      }
    }
  }

  render() {
    const { classes, terminal_ids, feed_ids, client } = this.props;
    const { open, width } = this.state;
    
    const iOS = process.browser && /iPad|iPhone|iPod/.test(navigator.userAgent);

    return (
      <div className={classes.frame}>
        <div className={classes.main}>
          <Terminal ids={terminal_ids} client={client} />
        </div>
        <div className={classes.dragbar} onMouseDown={this.mouseDown}>
          <Typography variant="button" color="inherit" noWrap className={classes.draghint}>
            {open ? "Drag to resize" : "Click to open feed"}
          </Typography>
        </div>
        <div className={classes.drawer} style={width}>
          <SwipeableDrawer
            variant="persistent"
            anchor="right"
            open={open}
            onClose={this.closeDrawer}
            onOpen={this.openDrawer}
            classes={{ paper: classes.drawerPaper, docked: classes.expand }}
            PaperProps={{ style: width }}
            disableBackdropTransition={!iOS}
            disableDiscovery={iOS}
            disableSwipeToOpen={false}
          >
            <Feed ids={feed_ids} client={client} />
          </SwipeableDrawer>
        </div>
      </div>
    );
  }
}

SplitDrawer.propTypes = {
  classes: PropTypes.object.isRequired,
  theme: PropTypes.object.isRequired,
  terminal_ids: PropTypes.object.isRequired,
  feed_ids: PropTypes.object.isRequired,
  client: PropTypes.object.isRequired,
};

export default withStyles(styles, { withTheme: true })(SplitDrawer);


