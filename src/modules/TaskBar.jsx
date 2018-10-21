
import React from 'react';
import PropTypes from 'prop-types';
import { withStyles } from '@material-ui/core/styles';
import SwipeableDrawer from '@material-ui/core/SwipeableDrawer';
import AppBar from '@material-ui/core/AppBar';
import Toolbar from '@material-ui/core/Toolbar';
import Typography from '@material-ui/core/Typography';
import Button from '@material-ui/core/Button';
import Tooltip from '@material-ui/core/Tooltip';
import Badge from '@material-ui/core/Badge';

import MenuIcon from '@material-ui/icons/Menu';
import MailIcon from '@material-ui/icons/Mail';
import ForumIcon from '@material-ui/icons/Forum';
import TabIcon from '@material-ui/icons/Tab';
import PeopleIcon from '@material-ui/icons/People';
import VideogameAssetIcon from '@material-ui/icons/VideogameAsset';
import LandscapeIcon from '@material-ui/icons/Landscape';
import BusinessCenterIcon from '@material-ui/icons/BusinessCenter';
import BackspaceIcon from '@material-ui/icons/Backspace';

import Settings from './Settings';


//////////////////////////////////////////////////////////////////////


const drawerHeight = 240;

const styles = theme => ({
  root: {
    flexGrow: 1,
  },
  headerFrame: {
  },
  header: {
  },
  title: {
    margin: '0 20px',
  },
  tasksep: {
    marginRight: theme.spacing.unit,
  },
  taskbutton: {
    margin: theme.spacing.unit,
  },
  taskicon: {
    marginRight: theme.spacing.unit,
  },
  tasklabel: {
//    display: "flex",
//    "flex-direction": "column",
  },
  cmdbutton: {
  },
  cmdlabel: {
    display: "flex",
    "flex-direction": "column",
  },
  flex: {
    flex: 1,
  },
  drawerFrame: {
    width: '100%',
  },
  drawerButton: {
    margin: theme.spacing.unit,
  },
  hide: {
    display: 'none',
  },
  drawerPaper: {
    position: 'relative',
    height: drawerHeight,
  },
  mailButton: {
    margin: theme.spacing.unit,
  },
  BBButton: {
    margin: theme.spacing.unit,
  },
});


function BadgeIcon(props) {
  if (props.count > 0) {
    return (
      <Badge badgeContent={props.count} color="error">
        {props.children}
      </Badge>
    );
  }
  return props.children;
};


//////////////////////////////////////////////////////////////////////


class TaskBar extends React.Component {
  constructor(props) {
    super(props);
    this.state = {
      open: false,
      title: props.title,
      taskbar: [ ],
      unreadBB: 0,
      unreadMail: 0,
    };
  }

  
  toggleDrawer = () => {
    if (this.state.open) {
      this.closerDrawer();
    } else {
      this.openDrawer();
    }
  };

  openDrawer = () => {
    this.setState({open: true});
  };
  
  closeDrawer = () => {
    this.setState({open: false});
  };
  
  setTitle = t => {
    this.setState({title: t});
  };

  clearScreen = () => {
    if (window.confirm('Do you want to clear the screen?')) {
      window.client.clear();
    }
  };

  sendCommand = (cmd) => {
    window.client.sendCommand(cmd);
    window.client.focus();
  };

  sendText = (txt) => {
    window.client.sendText(txt);
    window.client.focus();
  };

  setUnreadMail = u => {
    this.setState({unreadMail: u});
  };

  setUnreadBB = u => {
    this.setState({unreadBB: u});
  };
  
  pushTask = (task) => {
    const { taskbar } = this.state;
    taskbar.push(task);
    this.setState({ taskbar });
  };
  
  popTask = (task) => {
    const { taskbar } = this.state;
    const i = taskbar.indexOf(task);
    taskbar.splice(i, 1);
    task.unsmallify();
    task.front();
    //task.reposition();
    this.setState({ taskbar });
    window.client.focus();
  };
  
  componentDidMount() {
    window.client.react.taskbar = this;
  }
  
  render() {
    const { classes } = this.props;
    const { title, taskbar, open, unreadBB, unreadMail } = this.state;
    
    return (
      <div className={classes.root}>
        <div className={classes.headerFrame}>
          <AppBar className={classes.header} position="static">
            <Toolbar disableGutters={!this.state.open}>
              <Typography variant="title" color="inherit" noWrap className={classes.title}>
                {title}
              </Typography>
              <div className={classes.flex}></div>
              {taskbar.map((task,i) => (
                <Tooltip title={task.headertitle.innerText}>
                  <Button key={task.id} classes={{ label: classes.tasklabel }} className={classes.taskbutton} aria-label="open-task" onClick={() => this.popTask(task)}>
                    <TabIcon className={classes.taskicon} />
                    {task.headertitle.innerText}
                  </Button>
                </Tooltip>
              ))}
              <div className={classes.tasksep}></div>
              <Tooltip title="Look around.">
                <Button aria-label="send-look" onClick={() => this.sendCommand("look")}>
                  <LandscapeIcon />
                </Button>
              </Tooltip>
              <Tooltip title="Who's online?">
                <Button aria-label="send-who" onClick={() => this.sendCommand("who")}>
                  <PeopleIcon />
                </Button>
              </Tooltip>
              <Tooltip title="What am I carrying?">
                <Button aria-label="send-inventory" onClick={() => this.sendCommand("inventory")}>
                  <BusinessCenterIcon />
                </Button>
              </Tooltip>
              <Tooltip title="2D Graphical UI">
                <Button aria-label="open-phaser" onClick={() => this.sendText("jsonapi/phaser")}>
                  <VideogameAssetIcon />
                </Button>
              </Tooltip>
              <Tooltip title="Bulletin Boards">
                <Button aria-label="open-bbs" onClick={() => this.sendText("jsonapi/bblist")}>
                  <BadgeIcon count={unreadBB}>
                    <ForumIcon />
                  </BadgeIcon>
                </Button>
              </Tooltip>
              <Tooltip title="@mail Inbox">
                <Button aria-label="open-mail" onClick={() => this.sendText("jsonapi/maillist")}>
                  <BadgeIcon count={unreadMail}>
                    <MailIcon />
                  </BadgeIcon>
                </Button>
              </Tooltip>
              <Tooltip title="Clear screen.">
                <Button aria-label="clear-screen" onClick={() => this.clearScreen()}>
                  <BackspaceIcon />
                </Button>
              </Tooltip>
              <Tooltip title="Settings">
                <Button aria-label="open-drawer" onClick={this.toggleDrawer}>
                  <MenuIcon />
                </Button>
              </Tooltip>
              <div className={classes.tasksep}></div>
            </Toolbar>
          </AppBar>
        </div>
        <div className={classes.drawerFrame}>
          <SwipeableDrawer
            variant="temporary"
            anchor="top"
            open={open}
            classes={{paper: classes.drawerPaper}}
            onClose={this.closeDrawer}
            onOpen={this.openDrawer}
          >
            <Settings closeDrawer={this.closeDrawer} />
          </SwipeableDrawer>
        </div>
      </div>
    );
  }
}

TaskBar.propTypes = {
  classes: PropTypes.object.isRequired,
  theme: PropTypes.object.isRequired,
};

export default withStyles(styles, { withTheme: true })(TaskBar);

