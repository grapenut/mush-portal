import React from 'react';
import PropTypes from 'prop-types';
import { withStyles } from '@material-ui/core/styles';

import IconButton from '@material-ui/core/IconButton';
import SvgIcon from '@material-ui/core/SvgIcon';
import List from '@material-ui/core/List';
import ListItem from '@material-ui/core/ListItem';
import ListItemText from '@material-ui/core/ListItemText';
import ListSubheader from '@material-ui/core/ListSubheader';

import RemoveRedEyeIcon from '@material-ui/icons/RemoveRedEye';
import ArrowForwardIcon from '@material-ui/icons/ArrowForward';
import ArrowBackIcon from '@material-ui/icons/ArrowBack';
import ArrowUpwardIcon from '@material-ui/icons/ArrowUpward';
import ArrowDownwardIcon from '@material-ui/icons/ArrowDownward';
import CallMadeIcon from '@material-ui/icons/CallMade';
import CallReceivedIcon from '@material-ui/icons/CallReceived';
import ExitToAppIcon from '@material-ui/icons/ExitToApp';
import LaunchIcon from '@material-ui/icons/Launch';

const COMPASS = {
  NORTH: (<ArrowUpwardIcon />),
  SOUTH: (<ArrowDownwardIcon />),
  WEST: (<ArrowBackIcon />),
  EAST: (<ArrowForwardIcon />),
  SOUTHEAST: (<SvgIcon><polygon points="12,12 0,12 12,0"/></SvgIcon>),
  SOUTHWEST: (<SvgIcon><polygon points="12,12 12,0 24,12"/></SvgIcon>),
  NORTHEAST: (<SvgIcon><polygon points="12,12 12,24 0,12"/></SvgIcon>),
  NORTHWEST: (<SvgIcon><polygon points="12,12 12,24 24,12"/></SvgIcon>),
  UP: (<CallMadeIcon />),
  DOWN: (<CallReceivedIcon />),
  IN: (<ExitToAppIcon />),
  OUT: (<LaunchIcon />),
};

const styles = theme => ({
  frame: {
    display: "flex",
    "flex-flow": "column nowrap",
  },
  custom: {
    overflowY: "auto",
    overflowX: "hidden",
  },
  widget: {
    flex: 1,
    position: "relative",
    left: "50%",
    '-webkit-transform': 'translateX(-50%)',
    transform: 'translateX(-50%)',
  },
});

class NavWidget extends React.Component {
  constructor(props) {
    super(props);
    this.state = { };
    this.ucExits = [];
    this.customExits = [];
    this.useCompass = false;
    
    this.loadProps(this.props);
    
  }
  
  loadProps(props) {
    if (props.exits === this.props.exits) return;
    
    this.ucExits = [];
    this.customExits = [];
    this.useCompass = false;
    
    props.exits.forEach((exit, i) => {
      this.ucExits.push(exit.toUpperCase());
    });
    
    var keys = Object.keys(COMPASS);
    for (let i = 0; i < props.exits.length; i++) {
      let fullexit = this.ucExits[i];
      let match = -1;

      fullexit.split(";").forEach((exit, n) => {
        if (match === -1) {
          match = keys.indexOf(exit);
        }
      });

      if (match === -1) {
        this.customExits.push(props.exits[i]);
      } else {
        this.useCompass = true;
      }
    }
    
  }
  
  componentWillReceiveProps(nextProps) {
    this.loadProps(nextProps);
  }
  
  componentDidMount() {
  }
  
  componentWillUnMount() {
  }
  
  getContents() {
    window.client.sendAPI("listcontents");
  }

  go = exit => event => {
    const jsonapi = window.client.jsonapi;
    
    if (exit && exit.length > 0) {
      this.sendCommand("go "+exit);
      if (!jsonapi) {
        // if we dont have movement events, do our own on a timer
        clearTimeout(this.getContents);
        setTimeout(this.getContents, 1000);
      }
    }
  };
  
  action = event => {
    window.client.sendCommand("look");
    window.client.sendAPI("listcontents");
  };
  
  matchExit = exit => {
    for (let i = 0; i < this.ucExits.length; i++) {
      let fullexit = this.ucExits[i];
      if (fullexit.split(";").indexOf(exit) !== -1) {
        return i;
      }
    }
    
    return -1;
  };
  
  buildExit = exit => {
    var uc = exit.toUpperCase();
    return (
      <IconButton onClick={this.go(exit)} disabled={this.matchExit(uc) === -1}>
        {COMPASS[uc]}
      </IconButton>
    );    
  };
  
  sendCommand(cmd) {
    window.client.sendCommand(cmd);
  }

  render() {
    const { classes } = this.props;
    
    return (
      <div className={classes.frame}>
        {this.customExits.length > 0 && (
          <div className={classes.custom}>
            <span>
              <List dense disablePadding subheader={<ListSubheader component="div">Exits</ListSubheader>}>
                {this.customExits.map((exit, i) => (
                  <ListItem className={classes.exitItem} key={i} button onClick={() => this.sendCommand("go "+exit.split(";")[0])}>
                    <ListItemText primary={exit.split(";")[0]} />
                  </ListItem>
                ))}
              </List>
            </span>
          </div>
        )}
        {this.useCompass && (
          <div className={classes.widget}>
            {this.buildExit("Northwest")}
            {this.buildExit("North")}
            {this.buildExit("Northeast")}
            {this.buildExit("Up")}
            <br />
            {this.buildExit("West")}
            {this.buildExit("In")}
            {this.buildExit("East")}
            {this.buildExit("Out")}
            <br />
            {this.buildExit("Southwest")}
            {this.buildExit("South")}
            {this.buildExit("Southeast")}
            {this.buildExit("Down")}
          </div>
        )}
      </div>
    );
  }
}

NavWidget.propTypes = {
  classes: PropTypes.object.isRequired,
  theme: PropTypes.object.isRequired,
  exits: PropTypes.arrayOf(PropTypes.string).isRequired,
};

export default withStyles(styles, { withTheme: true })(NavWidget);

