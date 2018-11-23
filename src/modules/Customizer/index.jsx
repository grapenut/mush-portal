
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
import ListSubheader from '@material-ui/core/ListSubheader';
import Typography from '@material-ui/core/Typography';
import Button from '@material-ui/core/Button';

import AddCircleIcon from '@material-ui/icons/AddCircle';

import FormEditor from './FormEditor';
import TriggerForm from './TriggerForm';
import TimerForm from './TimerForm';
import MacroForm from './MacroForm';
import KeyForm from './KeyForm';


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
    padding: 3*theme.spacing.unit,
    flex: 1,
    display: "flex",
    "flex-flow": "row nowrap",
  },
  left: {
    marginRight: 3*theme.spacing.unit,
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
});


//////////////////////////////////////////////////////////////////////


class Customizer extends React.Component {
  constructor(props) {
    super(props);
    
    const client = window.client;
    
    this.tabs = [
      {
        list: client.triggers,
        listName: "Triggers",
        Form: TriggerForm,
        immutable: false,
      },
      {
        list: client.macros,
        listName: "Macros",
        Form: MacroForm,
        immutable: false,
      },
      {
        list: client.css,
        listName: "CSS",
        Form: null,
        immutable: true,
      },
      {
        list: client.scripts,
        listName: "Scripts",
        Form: null,
        immutable: true,
      },
      {
        list: client.timers,
        listName: "Timers",
        Form: TimerForm,
        immutable: false,
      },
      {
        list: client.keys,
        listName: "Keys",
        Form: KeyForm,
        immutable: false,
      },
    ];
    
    this.state = {
      tab: 0,
      edit: false,
      selected: -1,
    };
  }

  changeTab = (event, tab) => {
    this.setState({ tab, selected: -1, edit: false });
  };
  
  onSelect = (key) => (event) => {
    this.setState({ selected: key });
  }; 
  
  componentDidMount() {
    window.client.react.customizer = this;
  }
  
  componentWillUnmount() {
    window.client.react.customizer = null;
  }
  
  render() {
    const { classes, panel } = this.props;
    const { selected, edit } = this.state;
    const tab = this.tabs[this.state.tab];
    
    return (
      <div className={classes.frame}>
        <AppBar position="static">
          <Tabs value={this.state.tab} scrollable scrollButtons="on" onChange={this.changeTab}>
            {this.tabs.map((t,i) => (<Tab key={i} label={t.listName} />))}
          </Tabs>
        </AppBar>
        <Typography className={classes.container} component="div">
          <div className={classes.left}>
            <span className={edit || selected > -1 ? classes.mobileClose : classes.mobileOpen}>
              <div className={classes.overflow}>
                <List disablePadding dense subheader={<ListSubheader>{tab.listName}</ListSubheader>}>
                  {tab.list.map((item, i) => (
                    <ListItem key={i} dense button divider selected={selected === i} onClick={this.onSelect(i)} className={i % 2 === 0 ? classes.even : classes.odd}>
                      <ListItemIcon className={classes.listNum}><span>{i+1}</span></ListItemIcon>
                      <ListItemText className={classes.listText} primary={item.name} />
                    </ListItem>
                  ))}
                  {tab.list.length < 1 && (
                    <ListItem key={-1} dense className={classes.even}>
                      <ListItemText className={classes.listText} secondary={"No "+tab.listName.toLowerCase()} />
                    </ListItem>
                  )}
                </List>
              </div>
              {!tab.immutable && (
                <Button classes={{ label: classes.block }} onClick={() => this.setState({ edit: true, selected: -1 })}>
                  <AddCircleIcon />
                  New {tab.listName.slice(0,-1)}
                </Button>
              )}
            </span>
          </div>
          <div className={classes.right}>
            <span className={edit || selected > -1 ? classes.mobileOpen : classes.mobileClose}>
              <FormEditor list={tab.list} listName={tab.listName.toLowerCase()} selected={selected} panel={panel} Form={tab.Form} immutable={tab.immutable} />
            </span>
          </div>
        </Typography>
      </div>
    );
  }
}

Customizer.propTypes = {
  classes: PropTypes.object.isRequired,
  theme: PropTypes.object.isRequired,
  panel: PropTypes.object.isRequired,
};

export default withStyles(styles, { withTheme: true })(Customizer);

