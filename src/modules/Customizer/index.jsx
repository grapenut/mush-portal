
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
    display: "flex",
    flexFlow: "column nowrap",
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
      selected: -1,
    };
  }

  changeTab = (event, tab) => {
    this.setState({ tab });
    this.setState({ selected: -1 });
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
    const { selected } = this.state;
    const tab = this.tabs[this.state.tab];
    
    return (
      <div className={classes.frame}>
        <AppBar position="static">
          <Tabs value={this.state.tab} scrollable scrollButtons="auto" onChange={this.changeTab}>
            {this.tabs.map((t,i) => (<Tab key={i} label={t.listName} />))}
          </Tabs>
        </AppBar>
        <Typography className={classes.container} component="div" >
          <div className={classes.left}>
            <div className={classes.overflow}>
              <List disablePadding dense subheader={<ListSubheader>{tab.listName}</ListSubheader>}>
                {tab.list.map((item, i) => (
                  <ListItem key={i} dense button divider selected={selected === i} onClick={this.onSelect(i)} className={i % 2 === 0 ? classes.even : classes.odd} >
                    <ListItemIcon className={classes.listNum}><span>{i+1}</span></ListItemIcon>
                    <ListItemText className={classes.listText} primary={item.name} />
                  </ListItem>
                ))}
              </List>
            </div>
            <Button classes={{ label: classes.block }} onClick={() => this.setState({ selected: -1 })}>
              <AddCircleIcon />
              New {tab.listName.slice(0,-1)}
            </Button>
          </div>
          <div className={classes.right}>
            <FormEditor list={tab.list} listName={tab.listName.toLowerCase()} selected={selected} panel={panel} Form={tab.Form} immutable={tab.immutable} />
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

