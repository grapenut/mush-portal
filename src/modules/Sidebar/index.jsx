import React from 'react';
import PropTypes from 'prop-types';
import { withStyles } from '@material-ui/core/styles';

import List from '@material-ui/core/List';
import ListItem from '@material-ui/core/ListItem';
import ListItemAvatar from '@material-ui/core/ListItemAvatar';
import ListItemText from '@material-ui/core/ListItemText';
import ListSubheader from '@material-ui/core/ListSubheader';
import Avatar from '@material-ui/core/Avatar';

import NavWidget from './NavWidget';

const styles = theme => ({
  frame: {
    display: "flex",
    height: "100%",
    backgroundColor: theme.palette.background.paper,
    "flex-flow": "row nowrap",
  },
  content: {
    position: "relative",
    flex: 1,
    display: "flex",
    "flex-flow": "column nowrap",
    textAlign: "center",
  },
  scroll: {
    flex: 1,
    overflowX: 'hidden',
    overflowY: 'auto',
  },
  item: {
    '&:hover': {
      backgroundColor: 'rgba(255,255,255,0.1)',
      cursor: 'pointer',
    },
  },
  flex: {
    flex: 1,
  },
  bottom: {
    position: "relative",
    left: "50%",
    '-webkit-transform': 'translateX(-50%)',
    transform: 'translateX(-50%)',
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
  }
  
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
    window.client.sendAPI("jsonapi/listcontents");
  }
  
  componentWillUnMount() {
    window.client.react.sidebar = null;
  }
  
  render() {
    const { classes, sidebarWidth, sidebarShowPlayers,
      sidebarShowThings, sidebarShowExits } = this.props;
    const { exits, things, players } = this.state;

    return (
      <div className={classes.frame} style={{ width: sidebarWidth }}>
        <div className={classes.content}>
          <div className={classes.scroll}>
            {sidebarShowPlayers && players.length > 0 && (
              <List dense disablePadding subheader={<ListSubheader component="div">Players</ListSubheader>}>
                {players.map((player, i) => (
                  <ListItem className={classes.item} key={i} dense onClick={() => this.sendCommand("look "+player)}>
                    <ListItemAvatar>
                      <Avatar>{player.split(" ").map(p => p[0]).join("")}</Avatar>
                    </ListItemAvatar>
                    <ListItemText primary={player} />
                  </ListItem>
                ))}
              </List>
            )}
            {sidebarShowThings && things.length > 0 && (
              <List dense disablePadding subheader={<ListSubheader component="div">Contents</ListSubheader>}>
                {things.map((thing, i) => (
                  <ListItem className={classes.item} key={i} dense onClick={() => this.sendCommand("look "+thing)}>
                    <ListItemAvatar>
                      <Avatar>{thing.split(" ").map(t => t[0]).join("")}</Avatar>
                    </ListItemAvatar>
                    <ListItemText primary={thing} />
                  </ListItem>
                ))}
              </List>
            )}
          </div>
          {sidebarShowExits && (
            <div className={classes.bottom}>
              <NavWidget exits={exits} />
            </div>
          )}
        </div>
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
};

export default withStyles(styles, { withTheme: true })(Sidebar);

