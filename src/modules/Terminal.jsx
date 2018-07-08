
import React from 'react';
import PropTypes from 'prop-types';
import classNames from 'classnames';
import { withStyles } from '@material-ui/core/styles';


//////////////////////////////////////////////////////////////////////


const styles = theme => ({
  terminal: {
    flex: 1,
    flexGrow: 1,
    margin: "0.5em",
    padding: 0,
    border: "none",
    background: "black",
    overflow: "hidden",
  },
  output: {
    flex: 1,
    flexGrow: 1,
    "overflow-y": "auto",
    "overflow-x": "hidden",
    "white-space": "pre-wrap",
    "word-wrap": "break-word",
    margin: 0,
    border: 0,
    padding: "0.5em 0.5% 0.5em 0.5%",
    width: "99%",
    position: "absolute",
  },
  links: {
    display: "table-cell",
    overflow: "hidden",
    position: "absolute",
    width: "100%",
    "vertical-align": "middle",
    "text-align": "center",
  },
  prompt: {
    overflow: "hidden",
    "white-space": "pre-wrap",
    "text-align": "left",
    position: "absolute",
    margin: 0,
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
    const { classes, theme } = this.props;
    
    return (
      <div id={this.props.terminal} className={classes.terminal}>
        <div id={this.props.output} className={classNames(classes.output, "ansi-37 ansi-40")}></div>
        <div id={this.props.links} className={classNames(classes.links, "ansi-1-34 ansi-40")}></div>
        <div id={this.props.prompt} className={classNames(classes.prompt, "ansi-37 ansi-40")}></div>
      </div>
    );
  }

}

export default withStyles(styles, { withTheme: true })(Terminal);

