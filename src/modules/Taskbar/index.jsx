
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
import List from '@material-ui/core/List';
import ListItem from '@material-ui/core/ListItem';
import ListItemText from '@material-ui/core/ListItemText';
import Icon from '@material-ui/core/Icon';

import MenuIcon from '@material-ui/icons/Menu';
import TabIcon from '@material-ui/icons/Tab';
import BackspaceIcon from '@material-ui/icons/Backspace';
import SaveIcon from '@material-ui/icons/Save';
import SettingsIcon from '@material-ui/icons/Settings';
import CloudUploadIcon from '@material-ui/icons/CloudUpload';
import KeyboardIcon from '@material-ui/icons/Keyboard';
import WifiIcon from '@material-ui/icons/Wifi';

import Settings from '../Settings';


//////////////////////////////////////////////////////////////////////


const drawerHeight = 240;

const styles = theme => ({
  root: {
    flexGrow: 1,
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
  padded: {
    width: "calc(100%-"+2*theme.spacing.unit+")",
    padding: -theme.spacing.unit,
    margin: theme.spacing.unit,
  },
  historyPopover: {
    maxHeight: "10em",
    overflowY: "auto",
  },
});


function BadgeIcon(props) {
  var count = props.count ? props.count() : 0;

  if (count > 0) {
    return (
      <Badge badgeContent={count} color="error">
        <Icon>{props.children}</Icon>
      </Badge>
    );
  }
  return (<Icon>{props.children}</Icon>);
};


//////////////////////////////////////////////////////////////////////


class Taskbar extends React.Component {
  constructor(props) {
    super(props);
    this.state = {
      open: false,
      title: props.title,
      taskbar: [ ],
      buttons: [ ],
      unreadBB: 0,
      unreadMail: 0,
      menuAnchor: null,
      uploadAnchor: null,
      helpAnchor: null,
      logAnchor: null,
      historyAnchor: null,
    };
    
    this.help = "";
    this.url = "";
    this.file = "";
    this.logname = "";
    this.history = null;
    this.frame = React.createRef();
    
  }

  openDrawer = () => {
    this.closeMenu();
    this.setState({open: true});
  };
  
  closeDrawer = () => {
    this.setState({open: false});
    window.client.react.portal.forceUpdate();
    window.client.focus(true);
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

  sendAPI = (cmd, args) => {
    window.client.sendAPI(cmd, args);
  };

  setUnreadMail = u => {
    this.setState({unreadMail: u});
  };

  setUnreadBB = u => {
    this.setState({unreadBB: u});
  };
  
  addButton = (button) => {
    const { buttons } = this.state;
    buttons.push(button);
    this.setState({ buttons });
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
    window.client.focus(true);
  };
  
  showHelp = event => {
    this.help = null;
    this.setState({ helpAnchor: event.currentTarget });
  };
  
  closeHelp = () => {
    this.setState({ helpAnchor: null });
    window.client.focus(true);
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
    this.closeMenu();
    this.setState({ uploadAnchor: event.currentTarget });
  };
  
  closeUpload = () => {
    this.setState({ uploadAnchor: null });
    window.client.focus(true);
  };
  
  insertCommand = cmd => event => {
    window.client.input.root.value = cmd;
    this.closeHistory();
  };
  
  clearHistory = () => {
    if (window.confirm("Do you want to clear the command history?")) {
      window.client.input.clearHistory();
      this.closeHistory();
    }
  };
  
  showHistory = event => {
    this.closeMenu();
    this.setState({ historyAnchor: event.currentTarget });
  };
  
  closeHistory = () => {
    this.setState({ historyAnchor: null });
    window.client.focus(true);
  };
  
  showLog = event => {
    this.logname = null;
    this.closeMenu();
    this.setState({ logAnchor: event.currentTarget });
  };
  
  closeLog = () => {
    this.setState({ logAnchor: null });
    window.client.focus(true);
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
  
  reconnect() {
    if (window.confirm("Do you want to reconnect?")) {
      window.client.conn.reconnect();
    }
  }
  
  componentDidMount() {
    window.client.react.taskbar = this;
  }

  componentWillUnmount() {
    window.client.react.taskbar = null;
  }
  
  render() {
    const input = window.client.input;
    const { classes } = this.props;
    const { title, taskbar, open, buttons, historyAnchor,
            menuAnchor, uploadAnchor, helpAnchor, logAnchor } = this.state;

    var rev = input ? input.history.slice().reverse() : [];
    
    return (
      <AppBar className={classes.root} position="static" onClick={() => window.client.focus()}>
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
          
          {buttons.map((button,i) => (
            <Tooltip key={i} title={button.title}>
              <Button aria-label={button.ariaLabel} onClick={button.action}>
                <BadgeIcon count={button.count}>
                  {button.icon}
                </BadgeIcon>
              </Button>
            </Tooltip>
          ))}
          
          <Tooltip title="More tasks...">
            <Button aria-owns={menuAnchor ? 'taskbar.menu' : null} aria-label="open-menu" aria-haspopup="true" onClick={this.showMenu}>
              <MenuIcon />
            </Button>
          </Tooltip>
          
          <SwipeableDrawer
            variant="temporary"
            anchor="top"
            open={open}
            onClose={this.closeDrawer}
            onOpen={this.openDrawer}
          >
            <Settings closeDrawer={this.closeDrawer} />
          </SwipeableDrawer>

          <Popover id="taskbar.help" anchorEl={helpAnchor} open={Boolean(helpAnchor)} onClose={this.closeHelp}>
            <form onSubmit={this.searchHelp}>
              <TextField label="Help topic" className={classes.padded} autoComplete="false" autoFocus variant="outlined" onChange={this.typeHelp} />
            </form>
            <Button fullWidth onClick={this.searchHelp}>
              Get Help
            </Button>
          </Popover>
          
          <Popover id="taskbar.log" anchorEl={logAnchor} open={Boolean(logAnchor)} onClose={this.closeLog}>
            <form onSubmit={this.saveLog}>
              <TextField label="File Name" variant="outlined" className={classes.padded}
                onChange={this.typeLog} autoFocus
                InputProps={{ inputProps: { style: { textAlign: 'right' }}, endAdornment: <InputAdornment position="end">.txt</InputAdornment> }}
              />
            </form>
            <Button fullWidth onClick={this.saveLog}>
              Save Log
            </Button>
          </Popover>
          
          <Popover id="taskbar.upload" anchorEl={uploadAnchor} open={Boolean(uploadAnchor)} onClose={this.closeUpload}>
            <form onSubmit={this.handleURL} className={classes.padded}>
              <TextField type="url" fullWidth label="Insert URL" variant="outlined" onChange={this.typeURL} autoFocus />
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
          
          <Popover id="taskbar.history" anchorEl={historyAnchor} open={Boolean(historyAnchor)} onClose={this.closeHistory}>
            <List className={classes.historyPopover}>
              {rev.map((cmd, i) => (
                <ListItem key={i} button dense divider onClick={this.insertCommand(cmd)}>
                  <ListItemText primary={cmd} />
                </ListItem>
              ))}
            </List>
            <Button onClick={this.clearHistory}>
              Clear History
            </Button>
          </Popover>
          
          <Menu disableEnforceFocus id="taskbar.menu" anchorEl={menuAnchor} open={Boolean(menuAnchor)} onClick={this.closeMenu} onClose={this.closeMenu}>
            <MenuItem onClick={this.closeMenu}>
              <Tooltip title="Close menu.">
                <MenuIcon />
              </Tooltip>
            </MenuItem>
            <MenuItem onClick={this.openDrawer}>
              <Tooltip title="Change settings.">
                <SettingsIcon />
              </Tooltip>
            </MenuItem>
            <MenuItem aria-owns={uploadAnchor ? 'taskbar.upload' : null} aria-label="open-upload" aria-haspopup="true" onClick={this.showUpload}>
              <Tooltip title="Upload file/URL.">
                <CloudUploadIcon />
              </Tooltip>
            </MenuItem>
            <MenuItem aria-owns={logAnchor ? 'taskbar.log' : null} aria-label="open-log" aria-haspopup="true" onClick={this.showLog}>
              <Tooltip title="Save display log.">
                <SaveIcon />
              </Tooltip>
            </MenuItem>
            <MenuItem aria-owns={historyAnchor ? 'taskbar.history' : null} aria-label="open-history" aria-haspopup="true" onClick={this.showHistory}>
              <Tooltip title="Show command history.">
                <KeyboardIcon />
              </Tooltip>
            </MenuItem>
            <MenuItem onClick={this.clearScreen}>
              <Tooltip title="Clear screen.">
                <BackspaceIcon />
              </Tooltip>
            </MenuItem>
            <MenuItem onClick={this.reconnect}>
              <Tooltip title="Reconnect.">
                <WifiIcon />
              </Tooltip>
            </MenuItem>            
          </Menu>

          <div className={classes.tasksep}></div>
        </Toolbar>
      </AppBar>
    );
  }
}

Taskbar.propTypes = {
  classes: PropTypes.object.isRequired,
  theme: PropTypes.object.isRequired,
};

export default withStyles(styles, { withTheme: true })(Taskbar);

