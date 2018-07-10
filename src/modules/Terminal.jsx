
import React from 'react';
import PropTypes from 'prop-types';
import classNames from 'classnames';
import { withStyles } from '@material-ui/core/styles';


//////////////////////////////////////////////////////////////////////


const styles = theme => ({
  frame: {
    display: "flex",
    "flex-flow": "column nowrap",
    margin: 0,
    padding: 0,
    border: "none",
    background: "black",
    width: "100%",
    height: "100%",
  },
  terminal: {
    flex: 1,
    padding: "0.25em",
    position: "relative",
    overflow: "auto",
  },
  output: {
    "overflow-y": "auto",
    "overflow-x": "hidden",
    "white-space": "pre-wrap",
    "word-wrap": "break-word",
    position: "absolute",
    margin: 0,
    border: 0,
    padding: 0,
    width: "calc(100% - 0.5em)",
    height: "calc(100% - 0.5em)",
  },
  taskbar: {
    padding: "0.25em",
    position: "relative",
    overflow: "hidden",
  },
  links: {
    overflow: "hidden",
    width: "100%",
    "vertical-align": "middle",
    "text-align": "center",
    height: "1em",
  },
  seperator: {
    height: "0.5em",
  },
  prompt: {
    overflow: "hidden",
    "white-space": "pre-wrap",
    "text-align": "left",
    "vertical-align": "middle",
    width: "100%",
    height: "1em",
  },
});


//////////////////////////////////////////////////////////////////////


class Terminal extends React.Component {
  constructor(props) {
    super(props);
    this.state = { };
  }
  
  render() {
    const { classes, theme, ids} = this.props;
    
    return (
      <div id={ids.terminal} className={classes.frame}>
        <div className={classes.terminal}>
          <div id={ids.output} className={classNames(classes.output, "ansi-37 ansi-40")}></div>
        </div>
{/*        <div className={classes.taskbar}>
          <div id={ids.links} className={classNames(classes.links, "ansi-1-34 ansi-40")}></div>
          <div className={classes.seperator} />
          <div id={ids.prompt} className={classNames(classes.prompt, "ansi-37 ansi-40")}></div>
        </div>
*/}      </div>
    );
  }

}

export default withStyles(styles, { withTheme: true })(Terminal);

