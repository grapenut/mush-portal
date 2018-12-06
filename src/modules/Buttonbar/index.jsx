/* eslint no-eval: 0 */

import React from 'react';
import PropTypes from 'prop-types';
import { withStyles } from '@material-ui/core/styles';

import AppBar from '@material-ui/core/AppBar';
import Tabs from '@material-ui/core/Tabs';
import Tab from '@material-ui/core/Tab';
import Badge from '@material-ui/core/Badge';
import Icon from '@material-ui/core/Icon';
import IconButton from '@material-ui/core/IconButton';
import Tooltip from '@material-ui/core/Tooltip';

import KeyboardArrowLeftIcon from '@material-ui/icons/KeyboardArrowLeft';
import KeyboardArrowRightIcon from '@material-ui/icons/KeyboardArrowRight';


const styles = theme => ({
  frame: {
    width: "100%",
    height: "100%",
    display: "flex",
  },
  scrollButtons: {
    flex: '0 0 24px',
    padding: 0,
    alignSelf: "center",
  },
  buttonBar: {
    justifyContent: "space-evenly",
  },
  tasklabel: {
    display: "flex",
    "flexFlow": "row nowrap",
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

function BadgeIcon(props) {
  var count = props.count ? props.count : 0;
  
  if (count && count !== "") {
    return (
      <Badge badgeContent={count} color="error">
        <Icon className={props.children}>{props.children}</Icon>
      </Badge>
    );
  }
  return (<Icon className={props.children}>{props.children}</Icon>);
};


class Buttonbar extends React.Component {
  constructor(props) {
    super(props);
    this.state = { };
  }
  
  componentDidMount() {
  }

  componentWillUnmount() {
    window.client.unwatchState(this);
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
  
  pushButton = button => event => {
    if (button && button.text && button.text !== "") {
      if (button.javascript) {
        window.client.execActionScript(button.text, event);
      } else {
        window.client.sendText(button.text);
      }
    }
  };
  
  render() {
    const { classes } = this.props;
    const { mobileHideTaskbar } = window.client.settings;
    const buttons = window.client.buttons;
    
    return (
      <div className={classes.frame}>
        {(!mobileHideTaskbar || buttons.length > 0) && (
          <AppBar position="relative">
            <Tabs value={false} indicatorColor="primary" scrollable scrollButtons="on" ScrollButtonComponent={TabButton} classes={{ scrollButtons: classes.scrollButtons, flexContainer: classes.buttonBar }}>
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
        )}
      </div>
    );
  }
}

Buttonbar.propTypes = {
  classes: PropTypes.object.isRequired,
  theme: PropTypes.object.isRequired,
};

export default withStyles(styles, { withTheme: true })(Buttonbar);

