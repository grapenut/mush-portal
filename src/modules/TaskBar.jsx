
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
import Menu from '@material-ui/core/Menu';
import MenuItem from '@material-ui/core/MenuItem';
import TextField from '@material-ui/core/TextField';
import Popover from '@material-ui/core/Popover';
import InputAdornment from '@material-ui/core/InputAdornment';

import MenuIcon from '@material-ui/icons/Menu';
import MailIcon from '@material-ui/icons/Mail';
import ForumIcon from '@material-ui/icons/Forum';
import TabIcon from '@material-ui/icons/Tab';
import PeopleIcon from '@material-ui/icons/People';
import VideogameAssetIcon from '@material-ui/icons/VideogameAsset';
import LandscapeIcon from '@material-ui/icons/Landscape';
import BusinessCenterIcon from '@material-ui/icons/BusinessCenter';
import BackspaceIcon from '@material-ui/icons/Backspace';
import SaveIcon from '@material-ui/icons/Save';
import SettingsIcon from '@material-ui/icons/Settings';
import CloudUploadIcon from '@material-ui/icons/CloudUpload';

import SearchIcon from '@material-ui/icons/Search';

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
  fileinput: {
    display: 'none',
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
      menuAnchor: null,
      uploadAnchor: null,
      helpAnchor: null,
      logAnchor: null,
    };
    
    this.help = null;
    this.url = null;
    this.file = null;
    this.logname = null;
    this.frame = React.createRef();
  }

  openDrawer = () => {
    this.closeMenu();
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
  };

  sendText = (txt) => {
    window.client.sendText(txt);
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
    this.setState({ taskbar });
  };
  
  showMenu = event => {
    this.setState({ menuAnchor: event.currentTarget });
  };
  
  closeMenu = () => {
    this.setState({ menuAnchor: null });
  };
  
  showHelp = event => {
    this.help = null;
    this.setState({ helpAnchor: event.currentTarget });
  };
  
  closeHelp = () => {
    this.setState({ helpAnchor: null });
  };
  
  typeHelp = event => {
    this.help = event.target.value;
  };
  
  searchHelp = event => {
    event.preventDefault();
    if (this.help && this.help.length > 0) {
      window.client.sendCommand("help "+this.help);
    } else {
      window.client.sendCommand("help");
    }

    this.closeHelp();
  };
  
  showUpload = event => {
    this.file = null;
    console.log('before close', event.currentTarget);
    this.closeMenu();
    console.log('after close');
    this.setState({ uploadAnchor: event.currentTarget });
    console.log('after anchor');
  };
  
  closeUpload = () => {
    this.setState({ uploadAnchor: null });
  };
  
  showLog = event => {
    this.logname = null;
    this.closeMenu();
    this.setState({ logAnchor: event.currentTarget });
  };
  
  closeLog = () => {
    this.setState({ logAnchor: null });
  };
  
  typeLog = event => {
    this.logname = event.target.value;
  };
  
  saveLog = event => {
    event.preventDefault();
    
    if (!this.logname || !(this.logname.length > 0)) return;
    
    window.client.saveLog(this.logname+".txt");
    
    this.closeLog();
  };
  
  typeURL = event => {
    this.url = event.target.value;
  };
  
  previewUpload = () => {
    window.client.addReactPanel("Upload");

    if (this.file && this.file.length > 0) {
      window.client.react.upload.setText(this.file);
    }
    
    this.closeUpload();
  };
  
  handleFile = event => {
    event.preventDefault();
    const files = event.target.files;
    
    if (files.length > 0) {
      var reader = new FileReader();
      reader.onload = () => {
        this.file = reader.result;
        this.previewUpload();
      };
      reader.readAsText(files[0]);
    }
  };
  
  handleURL = event => {
    event.preventDefault();
    
    if (!this.url || !this.url.startsWith("http")) return;

    var req = new window.XMLHttpRequest();
    req.onreadystatechange = () => {
      if (req.readyState === 4) {
        // The request is done; did it work?
        if (req.status === 200) {
          this.file = req.responseText;
          this.previewUpload();
        } else {
          alert("Unable to download URL! See console for more information.");
        }
      }
    };
    req.open("GET", this.url);
    req.send();
  };
  
  componentDidMount() {
    window.client.react.taskbar = this;
  }

  componentWillUnmount() {
    window.client.react.taskbar = null;
  }
  
  render() {
    const jsonapi = window.client.jsonapi;
    const { classes } = this.props;
    const { title, taskbar, open, unreadBB, unreadMail,
            menuAnchor, uploadAnchor, helpAnchor, logAnchor } = this.state;
    
    return (
      <div className={classes.root}>
        <div className={classes.headerFrame}>
          <AppBar className={classes.header} position="static" onClick={() => window.client.focus()}>
            <Toolbar disableGutters={!this.state.open}>
              <Typography variant="h6" color="inherit" noWrap className={classes.title}>
                {title}
              </Typography>
              <div className={classes.flex}></div>
              {taskbar.map((task,i) => (
                <Tooltip key={i} title={task.headertitle.innerText}>
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
              
              <Tooltip title="Bulletin Boards">
                <Button aria-label="open-bbs" onClick={() => this.sendText(jsonapi ? "jsonapi/bblist" : "+bbscan")}>
                  <BadgeIcon count={unreadBB}>
                    <ForumIcon />
                  </BadgeIcon>
                </Button>
              </Tooltip>
              
              <Tooltip title="@mail Inbox">
                <Button aria-label="open-mail" onClick={() => this.sendText(jsonapi ? "jsonapi/maillist" : "@mail")}>
                  <BadgeIcon count={unreadMail}>
                    <MailIcon />
                  </BadgeIcon>
                </Button>
              </Tooltip>
              
              <Tooltip title="Need help?">
                <Button aria-owns={helpAnchor ? 'taskbar.help' : null} aria-label="help" aria-haspopup="true" onClick={this.showHelp}>
                  <SearchIcon />
                </Button>
              </Tooltip>
              
              <Tooltip title="Change settings.">
                <Button aria-label="open-settings" aria-haspopup="true" onClick={this.openDrawer}>
                  <SettingsIcon />
                </Button>
              </Tooltip>
              
              <Tooltip title="More tasks...">
                <Button aria-owns={menuAnchor ? 'taskbar.menu' : null} aria-label="open-menu" aria-haspopup="true" onClick={this.showMenu}>
                  <MenuIcon />
                </Button>
              </Tooltip>
              
                <Button onClick={this.closeMenu}>
                  <Tooltip title="Close menu.">
                    <MenuIcon />
                  </Tooltip>
                </Button>
                <Button onClick={this.openDrawer}>
                  <Tooltip title="Change settings.">
                    <SettingsIcon />
                  </Tooltip>
                </Button>
                <Button aria-owns={uploadAnchor ? 'taskbar.upload' : null} aria-label="open-upload" aria-haspopup="true" onClick={this.showUpload}>
                  <Tooltip title="Upload file/URL.">
                    <CloudUploadIcon />
                  </Tooltip>
                </Button>
                <Button aria-owns={logAnchor ? 'taskbar.log' : null} aria-label="open-log" aria-haspopup="true" onClick={this.showLog}>
                  <Tooltip title="Save display log.">
                    <SaveIcon />
                  </Tooltip>
                </Button>
                <Button onClick={this.clearScreen}>
                  <Tooltip title="Clear screen.">
                    <BackspaceIcon />
                  </Tooltip>
                </Button>
                {jsonapi && (
                  <Button onClick={() => this.sendText("jsonapi/phaser")}>
                    <Tooltip title="2D Graphical UI">
                      <VideogameAssetIcon />
                    </Tooltip>
                  </Button>
                )}

                <Popover id="taskbar.help" anchorEl={helpAnchor} open={Boolean(helpAnchor)} onClose={this.closeHelp}>
                  <form onSubmit={this.searchHelp}>
                    <TextField label="Search help" autoComplete="false" autoFocus variant="outlined" onChange={this.typeHelp} />
                  </form>
                  <Button fullWidth onClick={this.searchHelp}>
                    Get Help
                  </Button>
                </Popover>
                
                <Popover id="taskbar.log" anchorEl={logAnchor} open={Boolean(logAnchor)} onClose={this.closeLog}>
                  <form onSubmit={this.saveLog}>
                    <TextField label="File name" variant="outlined" onChange={this.typeLog} fullWidth autoFocus 
                      InputProps={{ endAdornment: <InputAdornment position="end">.txt</InputAdornment> }}
                    />
                  </form>
                  <Button fullWidth onClick={this.saveLog}>
                    Save Log
                  </Button>
                </Popover>
                
                <Popover id="taskbar.upload" anchorEl={uploadAnchor} open={Boolean(uploadAnchor)} onClose={this.closeUpload}>
                  <form onSubmit={this.handleURL}>
                    <TextField type="url" label="Paste URL" variant="outlined" onChange={this.typeURL} fullWidth autoFocus />
                  </form>
                  <Button onClick={this.handleURL}>
                    Upload URL
                  </Button>
                  <input
                    accept="text/plain"
                    className={classes.fileinput}
                    id="file.upload"
                    type="file"
                    onChange={this.handleFile}
                  />
                  <label htmlFor="file.upload">
                    <Button component="span">
                      Choose File
                    </Button>
                  </label>
                  <Button onClick={this.previewUpload}>
                    Paste Text
                  </Button>
                </Popover>
                
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

