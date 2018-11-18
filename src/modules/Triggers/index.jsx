
import React from 'react';
import PropTypes from 'prop-types';
import { withStyles } from '@material-ui/core/styles';

import Icon from '@material-ui/core/Icon';
import List from '@material-ui/core/List';
import ListItem from '@material-ui/core/ListItem';
import ListItemText from '@material-ui/core/ListItemText';
import ListItemIcon from '@material-ui/core/ListItemIcon';
import ListItemSecondaryAction from '@material-ui/core/ListItemSecondaryAction';
import ListSubheader from '@material-ui/core/ListSubheader';


//////////////////////////////////////////////////////////////////////


const styles = theme => ({
  frame: {
    position: "absolute",
    height: "100%",
    width: "100%",
    display: "flex",
    "flex-flow": "row nowrap",
  },
  left: {
    flex: 1,
  },
  right: {
    flex: 1,
  },
  triggerText: {
    paddingLeft: 0,
    marginRight: 2*theme.spacing.unit,
  },
});


//////////////////////////////////////////////////////////////////////


class Triggers extends React.Component {
  constructor(props) {
    super(props);
    this.state = {
      triggers: window.client.triggers.slice(),
    };
    
    
  }
  
  componentDidMount() {
    window.client.react.triggers = this;
  }
  
  componentWillUnmount() {
    window.client.react.triggers = null;
  }
  
  render() {
    const { classes } = this.props;
    const { triggers } = this.state;

    return (
      <div className={classes.frame}>
        <div className={classes.left}>
          <List disablePadding dense subheader={<ListSubheader>Triggers</ListSubheader>}>
            {triggers.map((trigger, i) => (
              <ListItem dense>
                <ListItemIcon>
                  <Icon>{trigger.icon || "mdi-regex"}</Icon>
                </ListItemIcon>
                <ListItemText className={classes.triggerText} primary={trigger.pattern} />
                <ListItemSecondaryAction>
                  
                </ListItemSecondaryAction>
              </ListItem>
            ))}
          </List>
        </div>
        <div className={classes.right}>
          Right
        </div>
      </div>
    );
  }
}

Triggers.propTypes = {
  classes: PropTypes.object.isRequired,
  theme: PropTypes.object.isRequired,
};

export default withStyles(styles, { withTheme: true })(Triggers);

