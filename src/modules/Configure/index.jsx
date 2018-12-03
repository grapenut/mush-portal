
import React from 'react';
import PropTypes from 'prop-types';
import { withStyles } from '@material-ui/core/styles';

import AppBar from '@material-ui/core/AppBar';
import Tabs from '@material-ui/core/Tabs';
import Tab from '@material-ui/core/Tab';
import List from '@material-ui/core/List';
import ListItem from '@material-ui/core/ListItem';
import ListItemText from '@material-ui/core/ListItemText';
import ListItemIcon from '@material-ui/core/ListItemIcon';
import ListItemSecondaryAction from '@material-ui/core/ListItemSecondaryAction';
import ListSubheader from '@material-ui/core/ListSubheader';
import Typography from '@material-ui/core/Typography';
import Button from '@material-ui/core/Button';
import Popover from '@material-ui/core/Popover';
import IconButton from '@material-ui/core/IconButton';
import Menu from '@material-ui/core/Menu';
import MenuItem from '@material-ui/core/MenuItem';
import Switch from '@material-ui/core/Switch';
import Tooltip from '@material-ui/core/Tooltip';

import FileCopyIcon from '@material-ui/icons/FileCopy';
import AddCircleIcon from '@material-ui/icons/AddCircle';
import KeyboardArrowLeftIcon from '@material-ui/icons/KeyboardArrowLeft';
import KeyboardArrowRightIcon from '@material-ui/icons/KeyboardArrowRight';
//import KeyboardArrowUpIcon from '@material-ui/icons/KeyboardArrowUp';
import KeyboardArrowDownIcon from '@material-ui/icons/KeyboardArrowDown';
import ExpandMoreIcon from '@material-ui/icons/ExpandMore';
import ExpandLessIcon from '@material-ui/icons/ExpandLess';

import FormEditor from './FormEditor';
import TriggerForm from './TriggerForm';
import TimerForm from './TimerForm';
import MacroForm from './MacroForm';
import KeyForm from './KeyForm';
import ButtonForm from './ButtonForm';


//////////////////////////////////////////////////////////////////////


const styles = theme => ({
  frame: {
    position: "absolute",
    height: "100%",
    width: "100%",
    display: "flex",
    "flex-flow": "column nowrap",
  },
  container: {
    padding: theme.spacing.unit,
    flex: 1,
    display: "flex",
    "flex-flow": "row wrap",
    [theme.breakpoints.up('md')]: {
      padding: 3*theme.spacing.unit,
    },
  },
  left: {
    marginRight: 0,
    [theme.breakpoints.up('md')]: {
      marginRight: 3*theme.spacing.unit,
    }
  },
  right: {
    position: "relative",
    flex: 1,
    height: "100%",
    overflow: "hidden",
  },
  listText: {
    paddingLeft: 0,
    marginRight: 2*theme.spacing.unit,
  },
  odd: {
    backgroundColor: 'rgba(0, 0, 0, 0.2)',
  },
  even: {
    backgroundColor: 'rgba(0, 0, 0, 0.05)',
  },
  flex: {
    flex: 1,
  },
  block: {
    display: "flex",
    "flex-direction": "column",
  },
  overflow: {
    flex: 1,
    overflowX: "hidden",
    overflowY: "auto",
  },
  mobileClose: {
    display: 'none',
    [theme.breakpoints.up('md')]: {
      height: "100%",
      display: 'flex',
      flexFlow: "column nowrap",
      justifyContent: "space-between",
    },
  },
  mobileOpen: {
    height: "100%",
    display: "flex",
    flexFlow: "column nowrap",
    justifyContent: "space-between",
  },
  scrollButtons: {
    [theme.breakpoints.down('sm')]: {
      flex: '0 0 24px',
      padding: 0,
      alignSelf: "center",
    }
  },
  subHeader: {
    width: "100%",
    flex: 1,
    display: "flex",
    justifyContent: "space-between",
  },
  arrowButton: {
    flex: '0 0 24px',
    padding: 0,
    alignSelf: "flex-end",
  },
  switchBase: {
    [theme.breakpoints.down('sm')]: {
      height: "24px",
    },
  },
});

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


class Configure extends React.Component {
  constructor(props) {
    super(props);
    
    const client = window.client;
    
    this.tabs = [
      {
        list: client.buttons,
        listName: "Buttons",
        Form: ButtonForm,
        immutable: false,
        sortable: true,
      },
      {
        list: client.triggers,
        listName: "Triggers",
        Form: TriggerForm,
        immutable: false,
        sortable: true,
      },
      {
        list: client.macros,
        listName: "Macros",
        Form: MacroForm,
        immutable: false,
        sortable: true,
      },
      {
        list: client.keys,
        listName: "Keys",
        Form: KeyForm,
        immutable: false,
        sortable: true,
      },
      {
        list: client.timers,
        listName: "Timers",
        Form: TimerForm,
        immutable: false,
        sortable: true,
      },
      {
        list: client.css,
        listName: "CSS",
        Form: null,
        immutable: true,
        sortable: false,
      },
      {
        list: client.scripts,
        listName: "Scripts",
        Form: null,
        immutable: true,
        sortable: false,
      },
    ];
    
    this.state = {
      tab: 0,
      edit: false,
      selected: -1,
      menuAnchor: null,
      template: null,
      helpText: null,
      sortList: false,
    };
  }


  ///////////////////////////////////////////////////////////////////


  changeTab = (event, tab) => {
    this.setState({ tab, selected: -1, edit: false, template: null });
  };
  
  onSelect = (key) => (event) => {
    this.setState({ selected: key, template: null });
  };
  
  showTemplates = event => {
    this.setState({ menuAnchor: event.currentTarget });
  };
  
  hideTemplates = () => {
    this.setState({ menuAnchor: null });
  };
  
  chooseTemplate = template => () => {
    this.setState({ template, edit: true, selected: -1 });
  };
  
  handleSwitch = (item) => (e) => {
    item.disabled = !e.target.checked;
    this.saveList();
  };
  
  saveList = () => {
    const tab = this.tabs[this.state.tab];
    const css = tab.listName === "CSS";
    
    if (tab.Form && tab.Form.save) {
      tab.Form.save();
    } else if (css) {
      window.client.saveCSS();
    } else {
      window.client.saveLocalStorage(tab.list, tab.listName);
    }
    
    this.forceUpdate();
  };
  
  toggleSort = (e) => {
    this.setState({ sortList: !this.state.sortList });
  };
  
  moveItemUp = (list, i) => {
    if (i === 0) return;
    
    var tmp = list[i-1];
    list[i-1] = list[i];
    list[i] = tmp;
    
    if (i === this.state.selected) {
      this.setState({ selected: i-1 });
    }

    this.saveList();
  };
  
  moveItemDown = (list, i) => {
    if (i === list.length-1) return;
    
    var tmp = list[i+1];
    list[i+1] = list[i];
    list[i] = tmp;
    
    if (i === this.state.selected) {
      this.setState({ selected: i+1 });
    } else if (i+1 === this.state.selected) {
      this.setState({ selected: i });
    }

    this.saveList();
  };
  
  componentDidMount() {
    window.client.react.configure = this;
  }
  
  componentWillUnmount() {
    window.client.react.configure = null;
  }
  
  helpText(anchor) {
    this.setState({ helpText: anchor });
  }
  
  render() {
    const { classes, panel } = this.props;
    const { selected, edit, helpText, menuAnchor, template, sortList } = this.state;
    
    const tab = this.tabs[this.state.tab];
    const smallName = tab.listName.toLowerCase();
    const templates = window.client.templates.saved[smallName];
    
    return (
      <div className={classes.frame}>
        <AppBar position="static">
          <Tabs value={this.state.tab} scrollable scrollButtons="on" onChange={this.changeTab} ScrollButtonComponent={TabButton} classes={{ scrollButtons: classes.scrollButtons }}>
            {this.tabs.map((t,i) => (<Tab key={i} label={t.listName} />))}
          </Tabs>
        </AppBar>
        <Typography className={classes.container} component="div">
          <div className={classes.left}>
            <span className={edit || selected > -1 ? classes.mobileClose : classes.mobileOpen}>
              <div className={classes.overflow}>
                <List disablePadding dense subheader={
                  <ListSubheader disableGutters className={classes.subHeader}>
                    {tab.listName}
                    <Tooltip title="Reorder list.">
                      <IconButton disabled={!tab.sortable} onClick={this.toggleSort}>
                        {sortList ? (<ExpandLessIcon />) : (<ExpandMoreIcon />)}
                      </IconButton>
                    </Tooltip>
                  </ListSubheader>
                }>
                  {tab.list.map((item, i) => (
                    <ListItem key={i} dense button divider selected={selected === i} onClick={this.onSelect(i)} className={i % 2 === 0 ? classes.even : classes.odd}>
                      <ListItemIcon className={classes.listNum}>
                          <span>{i+1}</span>
                      </ListItemIcon>
                      <ListItemText className={classes.listText} primary={item.name} />
                      {!tab.immutable && (
                        <ListItemSecondaryAction>
                          {sortList ? (
                            <IconButton classes={{ root: classes.arrowButton }} disabled={i === tab.list.length-1} onClick={() => this.moveItemDown(tab.list, i)}>
                              <KeyboardArrowDownIcon />
                            </IconButton>
                          ) : (
                            <Switch checked={!item.disabled}
                              classes={{ switchBase: classes.switchBase }}
                              onChange={this.handleSwitch(item)}
                            />
                          )}
                        </ListItemSecondaryAction>
                      )}
                    </ListItem>
                  ))}
                  {tab.list.length < 1 && (
                    <ListItem key={-1} dense className={classes.even}>
                      <ListItemText className={classes.listText} secondary={"No "+smallName} />
                    </ListItem>
                  )}
                </List>
              </div>
              
              {templates && templates.length > 0 && (
                <Button aria-owns={menuAnchor ? 'template.menu' : null} aria-label="open-templates" aria-haspopup="true" classes={{ label: classes.block }} onClick={this.showTemplates}>
                  <FileCopyIcon />
                  Templates
                </Button>
              )}
              
              {!tab.immutable && (
                <Button classes={{ label: classes.block }} onClick={() => this.setState({ edit: true, selected: -1, template: null })}>
                  <AddCircleIcon />
                  New {tab.listName.slice(0,-1)}
                </Button>
              )}
            </span>
          </div>
          <div className={classes.right}>
            <div className={edit || selected > -1 ? classes.mobileOpen : classes.mobileClose}>
              <FormEditor list={tab.list} listName={smallName} template={template} selected={selected} panel={panel} Form={tab.Form} immutable={tab.immutable} />
            </div>
          </div>
        </Typography>
        
        <Menu disableEnforceFocus id="template.menu" anchorEl={menuAnchor} open={Boolean(menuAnchor)} onClick={this.hideTemplates} onClose={this.hideTemplates}>
          {templates && templates.map((tmpl, i) => tmpl.name ? (
            <MenuItem key={i} onClick={this.chooseTemplate(tmpl)}>
              {tmpl.name}
            </MenuItem>
          ) : (
            null
          ))}
        </Menu>
        
        
        <Popover anchorEl={helpText} open={Boolean(helpText)} onClose={() => this.setState({ helpText: null })}>
          <Typography>
            This is where help text goes.
          </Typography>
        </Popover>
      </div>
    );
  }
}

Configure.propTypes = {
  classes: PropTypes.object.isRequired,
  theme: PropTypes.object.isRequired,
  panel: PropTypes.object.isRequired,
};

export default withStyles(styles, { withTheme: true })(Configure);

