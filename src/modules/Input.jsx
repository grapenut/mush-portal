
import React from 'react';
import PropTypes from 'prop-types';
import classNames from 'classnames';
import { withStyles } from '@material-ui/core/styles';


//////////////////////////////////////////////////////////////////////


const styles = theme => ({
  frame: {
  },
  text: {
    background: "black",
    color: "silver",
    margin: 0,
    border: "none",
    outline: "none",
    "vertical-align": "middle",
    padding: "0.5em 0.5% 0.5em 0.5%",
    resize: "none",
    height: "3em",
    width: "100%",
  },
});


//////////////////////////////////////////////////////////////////////


class Input extends React.Component {
  state = {
  };
  
  render() {
    const { classes, theme, id } = this.props;
    
    return (
      <div className={classes.frame}>
        <textarea id={id} className={classes.text}  autoComplete="off" autoFocus></textarea>
      </div>
    );
  }

}

export default withStyles(styles, { withTheme: true })(Input);

