/* eslint no-eval: 0 */

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
import Tabs from '@material-ui/core/Tabs';
import Tab from '@material-ui/core/Tab';
import IconButton from '@material-ui/core/IconButton';

import MenuIcon from '@material-ui/icons/Menu';
import BackspaceIcon from '@material-ui/icons/Backspace';
import SaveIcon from '@material-ui/icons/Save';
import BuildIcon from '@material-ui/icons/Build';
import SettingsIcon from '@material-ui/icons/Settings';
import CloudUploadIcon from '@material-ui/icons/CloudUpload';
import KeyboardIcon from '@material-ui/icons/Keyboard';
import WifiIcon from '@material-ui/icons/Wifi';
import ExpandLessIcon from '@material-ui/icons/ExpandLess';
import ChevronLeftIcon from '@material-ui/icons/ChevronLeft';
import ChevronRightIcon from '@material-ui/icons/ChevronRight';
import KeyboardArrowLeftIcon from '@material-ui/icons/KeyboardArrowLeft';
import KeyboardArrowRightIcon from '@material-ui/icons/KeyboardArrowRight';

import Settings from '../Settings';


//////////////////////////////////////////////////////////////////////


const drawerHeight = 240;

const styles = theme => ({
  frame: {
    display: "flex",
    flexFlow: "column nowrap",
  },
  root: {
    width: "100%",
  },
  title: {
    margin: '0 20px',
    flex: 1,
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
    display: "flex",
    "flexFlow": "row nowrap",
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
  sectionDesktop: {
    display: 'none',
    [theme.breakpoints.up('md')]: {
      display: 'flex',
    },
  },
  sectionMobile: {
    display: 'flex',
    [theme.breakpoints.up('md')]: {
      display: 'none',
    },
  },
  mobileButtons: {
    display: "flex",
    flexFlow: "row wrap",
    width: "100%",
  },
  scrollButtons: {
    flex: '0 0 24px',
    padding: 0,
    alignSelf: "center",
  },
  emptyText: {
    textAlign: "center",
  },
});


function BadgeIcon(props) {
  var count = props.count ? props.count : 0;

  if (count && count !== "") {
    return (
      <Badge badgeContent={count} color="error">
        <Icon>{props.children}</Icon>
      </Badge>
    );
  }
  return (<Icon>{props.children}</Icon>);
};


function BadgeWrapper(props) {
  var count = props.count ? props.count() : 0;

  if (count > 0) {
    return (
      <Badge badgeContent={count} color="error">
        {props.children}
      </Badge>
    );
  }
  return props.children;
};


function TabButton(props) {
  if (props.visible) {
    return (
      <IconButton onClick={props.onClick} className={props.className}>
        {props.direction === "left" ? (
          <KeyboardArrowLeftIcon />
        ) : (
          <KeyboardArrowRightIcon />
        )}
      </IconButton>
    );
  } else {
    return (
      <div className={props.className}></div>
    );
  }
};


//////////////////////////////////////////////////////////////////////


class Taskbar extends React.Component {
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
      historyAnchor: null,
    };
    
    this.help = "";
    this.url = "";
    this.file = "";
    this.logname = "";
    this.history = null;
    this.frame = React.createRef();
    
    window.client.react.taskbar = this;
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

  // wrapper that scrolls the output
  scrollIfNeeded() {
    window.client.output.scrollDown();
  }

  pushTask = (task) => {
    const { taskbar } = this.state;
    var scroll = false;
    
    if (taskbar.length < 1) {
      if (window.client.output.nearBottom(window.client.scrollThreshold)) {
        scroll = true;
      }
    }
    
    task.count = 0;
    taskbar.push(task);
    this.setState({ taskbar });
    
    if (scroll) {
      clearTimeout(this.scrollIfNeeded);
      setTimeout(this.scrollIfNeeded, 1000);
    }
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
  
  toggleSidebar = () => {
    const client = window.client;
    
    const toggle = !client.settings.sidebarOpen;
    client.changeSetting('sidebarOpen', toggle);
    this.setState({ sidebarOpen: toggle });
    client.saveSettings();
    client.react.portal.forceUpdate();
  };
  
  showHelp = event => {
    this.help = null;
    this.setState({ helpAnchor: event ? event.currentTarget : null });
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

  openCustomizer = () => {
    window.client.addPanel("Customizer", { icon: 'build' });
  };
  
  previewUpload = () => {
    window.client.addPanel("Upload", { icon: 'cloud_upload' });

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
      window.client.reconnect(true);
    }
  }
  
  pushButton = button => event => {
    if (button && button.text && button.text !== "") {
      if (button.javascript) {
        window.client.execActionScript(button.text, event);
      } else {
        window.client.sendText(button.text);
      }
    }
  }
  
  showCount = button => {
    if (button && button.count && button.count !== "") {
      try {
        var val = eval(button.count);
        if (val) {
          return val;
        }
      } catch (e) {
        window.client.settings.debugActions && console.log("Unable to execute button count expression:", e);
      }
    }
    
    return 0;
  };
  
  componentDidMount() {
  }

  componentWillUnmount() {
    window.client.react.taskbar = null;
  }
  
  render() {
    const input = window.client.input;
    const { classes } = this.props;
    const { title, taskbar, open, historyAnchor,
            menuAnchor, uploadAnchor, helpAnchor, logAnchor } = this.state;
    const { sidebarOpen, sidebarAnchor, mobileHideTaskbar } = window.client.settings;
    
    const buttons = window.client.buttons;

    var rev = input && Boolean(historyAnchor) ? input.history.slice().reverse() : [];
    
    return (
      <div className={classes.frame}>
        <AppBar className={classes.root} position="static" onClick={() => window.client.focus()}>
          <Toolbar disableGutters={!this.state.open}>
            {sidebarAnchor === "left" && (
              <Tooltip title={sidebarOpen ? "Open sidebar." : "Close sidebar."}>
                <Button aria-label="open-left-sidebar" onClick={this.toggleSidebar}>
                  {sidebarOpen ? <ChevronLeftIcon /> : <ChevronRightIcon />}
                </Button>
              </Tooltip>
            )}
            
            <Typography variant="h6" color="inherit" noWrap className={classes.title}>
              {title}
            </Typography>
            
            <div className={classes.sectionDesktop}>
              <div className={classes.flex}></div>
              {taskbar.map((task,i) => (
                <Tooltip key={i} title={task.headertitle.innerText}>
                  <Button key={task.id} classes={{ label: classes.tasklabel }} className={classes.taskbutton} aria-label="open-task" onClick={() => this.popTask(task)}>
                    <BadgeWrapper count={() => task.count}>
                      <Icon className={classes.taskicon}>{task.headerlogo.innerText}</Icon>
                      {!window.client.mobile && task.headertitle.innerText}
                    </BadgeWrapper>
                  </Button>
                </Tooltip>
              ))}
              <div className={classes.tasksep}></div>
              {buttons.map((button,i) => !button.disabled && (
                <Tooltip key={i} title={button.tooltip}>
                  <Button aria-label={button.name} onClick={this.pushButton(button)}>
                    <BadgeIcon count={this.showCount(button)}>
                      {button.icon}
                    </BadgeIcon>
                  </Button>
                </Tooltip>
              ))}
            </div>
            
            <Tooltip title="Client utilities...">
              <Button aria-owns={menuAnchor ? 'taskbar.menu' : null} aria-label="open-menu" aria-haspopup="true" onClick={this.showMenu}>
                <MenuIcon />
              </Button>
            </Tooltip>
            
            {sidebarAnchor === "right" && (
              <Tooltip title={sidebarOpen ? "Open sidebar." : "Close sidebar."}>
                <Button aria-label="open-right-sidebar" onClick={this.toggleSidebar}>
                  {sidebarOpen ? <ChevronRightIcon /> : <ChevronLeftIcon />}
                </Button>
              </Tooltip>
            )}
            
            <SwipeableDrawer
              variant="temporary"
              anchor="left"
              open={open}
              onClose={this.closeDrawer}
              onOpen={this.openDrawer}
              
            >
              <Settings closeDrawer={this.closeDrawer} />
            </SwipeableDrawer>

            <Popover id="taskbar.help" anchorEl={helpAnchor} open={Boolean(helpAnchor)} onClose={this.closeHelp}>
              <form onSubmit={this.searchHelp}>
                <TextField label="Help topic" className={classes.padded} autoComplete="off" autoFocus variant="outlined" onChange={this.typeHelp} />
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
                  <ExpandLessIcon />
                </Tooltip>
              </MenuItem>
              <MenuItem onClick={this.openDrawer}>
                <Tooltip title="Change settings.">
                  <SettingsIcon />
                </Tooltip>
              </MenuItem>
              <MenuItem onClick={this.openCustomizer}>
                <Tooltip title="Client customization.">
                  <BuildIcon />
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
        
        {(!mobileHideTaskbar || buttons.length > 0) && (
          <div className={classes.sectionMobile}>
            <AppBar position="relative">
              <Tabs value={false} indicatorColor="primary" scrollable scrollButtons="on" ScrollButtonComponent={TabButton} classes={{ scrollButtons: classes.scrollButtons }}>
                {buttons.length > 0 && buttons.map((button,i) => !button.disabled && (
                  <Tooltip key={i} title={button.tooltip}>
                    <Tab key={i} classes={{ wrapper: classes.tasklabel }}
                      aria-label={button.name} 
                      icon={(<BadgeIcon count={this.showCount(button)}>{button.icon}</BadgeIcon>)}
                      onClick={this.pushButton(button)}
                    />
                  </Tooltip>
                ))}
              </Tabs>
            </AppBar>
          </div>
        )}
        
        {(!mobileHideTaskbar || taskbar.length > 0) && (
          <div className={classes.sectionMobile}>
            <AppBar position="relative">
              <Tabs value={false} indicatorColor="primary" scrollable scrollButtons="on" ScrollButtonComponent={TabButton} classes={{ scrollButtons: classes.scrollButtons }}>
                {taskbar.length > 0 && taskbar.map((task,i) => (
                  <Tooltip key={i} title={task.headertitle.innerText}>
                    <Tab key={i} classes={{ wrapper: classes.tasklabel }}
                      aria-label="open-task"
                      label={(
                        <span>
                          <BadgeWrapper count={() => task.count}>
                            <Icon className={classes.taskicon}>{task.headerlogo.innerText}</Icon>
                          </BadgeWrapper>
                          {task.headertitle.innerText}
                        </span>
                      )}
                      onClick={() => this.popTask(task)}
                    />
                  </Tooltip>
                ))}
              </Tabs>
            </AppBar>
          </div>
        )}
      </div>
    );
  }
}

Taskbar.propTypes = {
  classes: PropTypes.object.isRequired,
  theme: PropTypes.object.isRequired,
};

export default withStyles(styles, { withTheme: true })(Taskbar);

