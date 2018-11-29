import React from 'react';
import classNames from 'classnames';
import PropTypes from 'prop-types';
import { withStyles } from '@material-ui/core/styles';

import List from '@material-ui/core/List';
import ListItem from '@material-ui/core/ListItem';
//import ListItemAvatar from '@material-ui/core/ListItemAvatar';
import ListItemText from '@material-ui/core/ListItemText';
import ListSubheader from '@material-ui/core/ListSubheader';
//import Avatar from '@material-ui/core/Avatar';
import IconButton from '@material-ui/core/IconButton';
import SvgIcon from '@material-ui/core/SvgIcon';
import Typography from '@material-ui/core/Typography';
import Tooltip from '@material-ui/core/Tooltip';

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

const EXTRA = {
  NORTH: false,
  SOUTH: false,
  WEST: false,
  EAST: false,
  SOUTHEAST: false,
  SOUTHWEST: false,
  NORTHEAST: false,
  NORTHWEST: false,
  UP: true,
  DOWN: true,
  IN: true,
  OUT: true,
};


const styles = theme => ({
  frame: {
    position: "relative",
    height: "100%",
    maxWidth: "192px",
    backgroundColor: theme.palette.background.paper,
    display: "flex",
    "flex-flow": "column nowrap",
    textAlign: "center",
    justifyContent: 'flex-end',
  },
  contents: {
    flex: 1,
    width: "100%",
    alignSelf: 'flex-start',
    overflowX: 'hidden',
    overflowY: 'auto',
  },
  overflow: {
  },
  list: {
    width: "100%",
  },
  listHeader: {
    lineHeight: 1.5,
  },
  playerItem: {
    padding: "2px " + theme.spacing.unit + "px",
  },
  thingItem: {
    padding: "2px " + theme.spacing.unit + "px",
  },
  exitItem: {
    padding: "2px " + theme.spacing.unit + "px",
  },
  customExits: {
    flex: 1,
    width: "100%",
    display: "flex",
    flexFlow: "column nowrap",
    justifyContent: "flex-end",
    alignContent: "flex-end",
    alignItems: "flex-end",
  },
  middle: {
    width: "100%",
    overflowY: "auto",
    overflowX: "hidden",
  },
  bottom: {
    width: "100%",
  },
  navWidget: {
  },
  smallIcons: {
    padding: 0.5*theme.spacing.unit,
  },
  odd: {
    backgroundColor: 'rgba(0, 0, 0, 0.2)',
  },
  even: {
    backgroundColor: 'rgba(0, 0, 0, 0.05)',
  },
});

class Sidebar extends React.Component {
  constructor(props) {
    super(props);
    this.state = {
      exits: [],
      things: [],
      players: [],
      friends: [],
    };
    
    this.ucExits = [];
    this.customExits = [];
    this.useCompass = false;
  }
  
  parseExits(exits) {
    const { sidebarShowCompass, sidebarLargeCompass } = this.props;
    
    this.ucExits = [];
    this.customExits = [];
    this.useCompass = false;
    
    exits.forEach((exit, i) => {
      this.ucExits.push(exit.toUpperCase());
    });
    
    if (!sidebarShowCompass) {
      this.customExits = exits.slice(0);
      return;
    }
    
    var keys = Object.keys(COMPASS);
    for (let i = 0; i < exits.length; i++) {
      let fullexit = this.ucExits[i];
      let match = -1;
      let skip = false;

      fullexit.split(";").forEach((exit, n) => {
        if (!skip && match === -1) {
          match = keys.indexOf(exit);
          if (!sidebarLargeCompass && match !== -1 && EXTRA[exit]) {
            skip = true;
          }
        }
      });

      if (skip || match === -1) {
        this.customExits.push(exits[i]);
      } else {
        this.useCompass = true;
      }
    }
    
  }
  
  getContents() {
    window.client.sendAPI("listcontents");
  }

  go = exit => event => {
    const { jsonapi, delayContents } = window.client;
    
    if (exit && exit.length > 0) {
      this.sendCommand("go "+exit);
      if (!jsonapi) {
        // if we dont have movement events, do our own on a timer
        clearTimeout(this.getContents);
        setTimeout(this.getContents, delayContents);
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
    const { classes } = this.props;
    const { sidebarDense } = window.client.settings;
    var uc = exit.toUpperCase();
    var disabled = this.matchExit(uc) === -1;
    return (
      <Tooltip disabled={disabled} title={exit}>
        <span>
          <IconButton classes={sidebarDense ? { root: classes.smallIcons } : null} onClick={this.go(exit)} disabled={disabled}>
            {COMPASS[uc]}
          </IconButton>
        </span>
      </Tooltip>
    );    
  };

  buildLook = () => {
    const { classes, sidebarDense } = this.props;
    
    return (
      <Tooltip title="Update contents.">
        <span>
          <IconButton classes={sidebarDense ? { root: classes.smallIcons } : null} onClick={this.action}>
            <RemoveRedEyeIcon />
          </IconButton>
        </span>
      </Tooltip>
    );    
  };
  
  updateExits(exits) {
    this.setState({ exits });
  }
  
  updateThings(things) {
    this.setState({ things });
  }
  
  updatePlayers(players) {
    this.setState({ players });
  }
  
  addObject(obj) {
    const { players, things } = this.state;
    if (obj.player) {
      players.push(obj.name);
      this.setState({ players });
    } else {
      things.push(obj.name);
      this.setState({ things });
    }
  }
  
  delObject(obj) {
    const { players, things } = this.state;
    var i;
    
    if (obj.player) {
      i = players.indexOf(obj.name);
      if (i !== -1) {
        players.splice(i, 1);
        this.setState({ players });
      }
    } else {
      i = things.indexOf(obj.name);
      if (i !== -1) {
        things.splice(i, 1);
        this.setState({ things });
      }
    }
  }

  sendCommand = cmd => {
    window.client.sendCommand(cmd);
  };
  
  componentDidMount() {
    window.client.react.sidebar = this;
    window.client.sendAPI("listcontents");
  }
  
  componentWillUnMount() {
    window.client.react.sidebar = null;
  }
  
  render() {
    const { classes, sidebarDense, sidebarShowPlayers, sidebarLargeCompass,
      sidebarShowThings, sidebarShowExits, sidebarShowCompass } = this.props;
    const { exits, things, players } = this.state;
    const customExits = this.customExits;

    var width;
    var numicons = sidebarShowCompass ? (sidebarLargeCompass ? 4 : 3) : 0;
    if (sidebarDense) {
      width = (24 + this.props.theme.spacing.unit) * numicons;
    } else {
      width = 48 * numicons;
    }
    width = Math.min(192, Math.max(96, width)) + "px";
    
    var exitWidget;
    
    if (sidebarShowExits) {
      this.parseExits(exits);
      
      if (customExits.length > 0) {
        exitWidget = (
          <div className={classes.customExits}>
            <div className={classes.middle}>
              <div className={classes.bottom}>
                <List className={classes.list} dense disablePadding subheader={<ListSubheader className={classes.listHeader} component="div">Exits</ListSubheader>}>
                  {customExits.map((exit, i) => (
                    <ListItem className={classNames(classes.exitItem, i%2 ? classes.odd : classes.even)} key={i} button onClick={this.go(exit.split(";")[0])}>
                      <ListItemText primary={exit.split(";")[0]} />
                    </ListItem>
                  ))}
                </List>
              </div>
            </div>
          </div>
        );
      }
      
      var navWidget = (
          <div className={classes.navWidget}>
            <Typography variant="subtitle2" color="textSecondary">Navigation</Typography>
            {this.buildExit("Northwest")}
            {this.buildExit("North")}
            {this.buildExit("Northeast")}
            {sidebarLargeCompass && this.buildExit("Up")}
            <br />
            {this.buildExit("West")}
            {sidebarLargeCompass ? this.buildExit("In") : this.buildLook()}
            {this.buildExit("East")}
            {sidebarLargeCompass && this.buildExit("Out")}
            <br />
            {this.buildExit("Southwest")}
            {this.buildExit("South")}
            {this.buildExit("Southeast")}
            {sidebarLargeCompass && this.buildExit("Down")}
          </div>
        );
      }

    return (
      <div className={classes.frame} style={{ width: width }} onClick={() => window.client.focus()}>
        {((sidebarShowPlayers && players.length > 0) || (sidebarShowThings && things.length > 0)) && (
          <div className={classes.contents}>
            <span className={classes.overflow}>
              {sidebarShowPlayers && players.length > 0 && (
                <List className={classes.list} dense disablePadding subheader={<ListSubheader className={classes.listHeader} component="div">Players</ListSubheader>}>
                  {players.map((player, i) => (
                    <ListItem className={classNames(classes.playerItem, i%2 ? classes.odd : classes.even)} key={i}
                      button onClick={() => this.sendCommand("look "+player)}
                    >
{/*
                      {!sidebarDense && (
                        <ListItemAvatar>
                          <Avatar>{player.split(" ").map(p => p[0]).join("")}</Avatar>
                        </ListItemAvatar>
                      )}
*/}
                      <ListItemText primary={player} />
                    </ListItem>
                  ))}
                </List>
              )}
              {sidebarShowThings && things.length > 0 && (
                <List className={classes.list} dense disablePadding subheader={<ListSubheader className={classes.listHeader} component="div">Contents</ListSubheader>}>
                  {things.map((thing, i) => (
                    <ListItem className={classNames(classes.thingItem, i%2 ? classes.odd : classes.even)} key={i} button onClick={() => this.sendCommand("look "+thing)}>
                      <ListItemText primary={thing} />
                    </ListItem>
                  ))}
                </List>
              )}
            </span>
          </div>
        )}
        {sidebarShowExits && exitWidget}
        {sidebarShowExits && sidebarShowCompass && navWidget}
      </div>
    );
  }
}

Sidebar.propTypes = {
  classes: PropTypes.object.isRequired,
  theme: PropTypes.object.isRequired,
  sidebarShowPlayers: PropTypes.bool.isRequired,
  sidebarShowThings: PropTypes.bool.isRequired,
  sidebarShowExits: PropTypes.bool.isRequired,
  sidebarShowCompass: PropTypes.bool.isRequired,
  sidebarDense: PropTypes.bool.isRequired,
  sidebarLargeCompass: PropTypes.bool.isRequired,
};

export default withStyles(styles, { withTheme: true })(Sidebar);

