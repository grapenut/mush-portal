
import React from 'react';
import PropTypes from 'prop-types';
import { withStyles } from '@material-ui/core/styles';

import AppBar from '@material-ui/core/AppBar';
import Tabs from '@material-ui/core/Tabs';
import Tab from '@material-ui/core/Tab';
import Icon from '@material-ui/core/Icon';
import List from '@material-ui/core/List';
import ListItem from '@material-ui/core/ListItem';
import ListItemText from '@material-ui/core/ListItemText';
import ListItemIcon from '@material-ui/core/ListItemIcon';
import ListItemSecondaryAction from '@material-ui/core/ListItemSecondaryAction';
import ListSubheader from '@material-ui/core/ListSubheader';
import Typography from '@material-ui/core/Typography';


//////////////////////////////////////////////////////////////////////


function TabContainer(props) {
  return (
    <Typography className={props.className} component="div" style={{ padding: 8 * 3 }}>
      {props.children}
    </Typography>
  );
}

TabContainer.propTypes = {
  className: PropTypes.string,
  children: PropTypes.node.isRequired,
};


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
    flex: 1,
    display: "flex",
    "flex-flow": "row nowrap",
  },
  left: {
  },
  right: {
    flex: 1,
  },
  listText: {
    paddingLeft: 0,
    marginRight: 2*theme.spacing.unit,
  },
});


//////////////////////////////////////////////////////////////////////


class Triggers extends React.Component {
  constructor(props) {
    super(props);
    this.state = {
      tab: 0,
      triggers: window.client.triggers.slice(),
      timers: window.client.timers.slice(),
      macros: window.client.macros.slice(),
      keys: window.client.keys.slice(),
    };
    
    
  }
  
  changeTab = (event, tab) => {
    this.setState({ tab });
  };
  
  componentDidMount() {
    window.client.react.triggers = this;
  }
  
  componentWillUnmount() {
    window.client.react.triggers = null;
  }
  
  render() {
    const { classes } = this.props;
    const { tab, triggers, timers, macros, keys } = this.state;

    return (
      <div className={classes.frame}>
        <AppBar position="static">
          <Tabs value={tab} onChange={this.changeTab}>
            <Tab label="Triggers" />
            <Tab label="Timers" />
            <Tab label="Macros" />
            <Tab label="Keys" />
          </Tabs>
        </AppBar>
        {tab === 0 && <TabContainer className={classes.container}>
          <div className={classes.left}>
            <List disablePadding dense subheader={<ListSubheader>Triggers</ListSubheader>}>
              {triggers.map((trigger, i) => (
                <ListItem key={i} dense>
                  <ListItemIcon>
                    <Icon>{trigger.icon || "mdi-regex"}</Icon>
                  </ListItemIcon>
                  <ListItemText className={classes.listText} primary={trigger.name} />
                  <ListItemSecondaryAction>
                    
                  </ListItemSecondaryAction>
                </ListItem>
              ))}
            </List>
          </div>
          <div className={classes.right}>
            Right
          </div>
        </TabContainer>}
        {tab === 1 && <TabContainer className={classes.container}>
          <div className={classes.left}>
            <List disablePadding dense subheader={<ListSubheader>Timers</ListSubheader>}>
              {timers.map((timer, i) => (
                <ListItem key={i} dense>
                  <ListItemIcon>
                    <Icon>{timer.icon || "mdi-regex"}</Icon>
                  </ListItemIcon>
                  <ListItemText className={classes.listText} primary={timer.name} />
                  <ListItemSecondaryAction>
                    
                  </ListItemSecondaryAction>
                </ListItem>
              ))}
            </List>
          </div>
          <div className={classes.right}>
            Right
          </div>
        </TabContainer>}
        {tab === 2 && <TabContainer className={classes.container}>
          <div className={classes.left}>
            <List disablePadding dense subheader={<ListSubheader>Macros</ListSubheader>}>
              {macros.map((macro, i) => (
                <ListItem key={i} dense>
                  <ListItemIcon>
                    <Icon>{macro.icon || "mdi-regex"}</Icon>
                  </ListItemIcon>
                  <ListItemText className={classes.listText} primary={macro.name} />
                  <ListItemSecondaryAction>
                    
                  </ListItemSecondaryAction>
                </ListItem>
              ))}
            </List>
          </div>
          <div className={classes.right}>
            Right
          </div>
        </TabContainer>}
        {tab === 3 && <TabContainer className={classes.container}>
          <div className={classes.left}>
            <List disablePadding dense subheader={<ListSubheader>Keys</ListSubheader>}>
              {keys.map((key, i) => (
                <ListItem key={i} dense>
                  <ListItemIcon>
                    <Icon>{key.icon || "mdi-regex"}</Icon>
                  </ListItemIcon>
                  <ListItemText className={classes.listText} primary={key.name} />
                  <ListItemSecondaryAction>
                    
                  </ListItemSecondaryAction>
                </ListItem>
              ))}
            </List>
          </div>
          <div className={classes.right}>
            Right
          </div>
        </TabContainer>}
      </div>
    );
  }
}

Triggers.propTypes = {
  classes: PropTypes.object.isRequired,
  theme: PropTypes.object.isRequired,
};

export default withStyles(styles, { withTheme: true })(Triggers);

