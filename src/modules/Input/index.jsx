
import React from 'react';
import PropTypes from 'prop-types';
import classNames from 'classnames';
import { withStyles } from '@material-ui/core/styles';

import IconButton from '@material-ui/core/IconButton';

import ArrowDropUpIcon from '@material-ui/icons/ArrowDropUp';
import ArrowDropDownIcon from '@material-ui/icons/ArrowDropDown';


//////////////////////////////////////////////////////////////////////


const styles = theme => ({
  frame: {
    "background-color": theme.palette.primary.main,
    display: "flex",
  },
  text: {
    flex: 1,
//    "background-color": "black",
//    color: "silver",
    margin: "1px 0 0 0",
    border: "none",
    outline: "none",
    "vertical-align": "middle",
    padding: "0.25em",
    resize: "none",
    height: "1.5em",
    "font-family": "'Courier New', monospace",
    "font-weight": "normal",
    "font-size": "16pt",
    [theme.breakpoints.up('md')]: {
      height: "3em",
    },
  },
  buttons: {
//    "background-color": theme.palette.primary.main,
    display: "flex",
    flexFlow: "row wrap",
    justifyContent: "center",
    alignContent: "center",
    [theme.breakpoints.up('md')]: {
      flexFlow: "column wrap",
    },
  },
  smallIcons: {
    padding: 0,
  },
});


//////////////////////////////////////////////////////////////////////


class Input extends React.Component {
  constructor(props) {
    super(props);
    this.state = {};
    this.input = React.createRef();
  }
  
  componentDidMount() {
    window.client.react.input = this;
    window.client.initInput(this.input.current);
  }
  
  recallBack = () => {
    window.client.input.cycleBackward();
    window.client.input.focus(true);
  };
  
  recallForward = () => {
    window.client.input.cycleForward();
    window.client.input.focus(true);
  };
  
  render() {
    const { classes, ansiFG, ansiBG } = this.props;
    const { fontFamily, fontSize, recallButtons, recallAnchor } = window.client.settings;
    
    const font = {
      fontFamily: "'" + fontFamily + "', monospace",
      fontSize: (window.client.mobile ? 16 : fontSize) + "pt",
    };
    
    const buttons = (
      <span className={classes.buttons}>
        <IconButton classes={{ root: classes.smallIcons }} onClick={this.recallBack}>
          <ArrowDropUpIcon />
        </IconButton>
        <IconButton classes={{ root: classes.smallIcons }} onClick={this.recallForward}>
          <ArrowDropDownIcon />
        </IconButton>
      </span>
    );
    
    return (
      <div className={classes.frame}>
        {recallButtons && recallAnchor === "left" && buttons}
        <textarea ref={this.input} className={classNames(classes.text, ansiFG, ansiBG)} style={font}  autoComplete="off" autoFocus={!window.client.mobile}></textarea>
        {recallButtons && recallAnchor === "right" && buttons}
      </div>
    );
  }
}

Input.propTypes = {
  classes: PropTypes.object.isRequired,
  theme: PropTypes.object.isRequired,
  ansiFG: PropTypes.string.isRequired,
  ansiBG: PropTypes.string.isRequired,
};

export default withStyles(styles, { withTheme: true })(Input);

