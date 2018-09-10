
import React from 'react';
import PropTypes from 'prop-types';
import classNames from 'classnames';
import { withStyles } from '@material-ui/core/styles';
import Typography from '@material-ui/core/Typography';


//////////////////////////////////////////////////////////////////////


const styles = theme => ({
  frame: {
    display: "flex",
    "flex-flow": "column nowrap",
    margin: 0,
    padding: 0,
    border: "none",
    "background-color": theme.palette.primary.main,
    width: "100%",
    height: "100%",
    "font-family": "'Courier New', monospace",
    "font-weight": "normal",
    "font-size": "10pt",
    [theme.breakpoints.down('sm')]: {
      "font-size": "5pt",
    },
  },
  terminal: {
    flex: 1,
    margin: 0,
    padding: "0.25em",
    position: "relative",
    overflow: "hidden",
  },
  output: {
    "overflow-y": "scroll",
    "overflow-x": "hidden",
    "white-space": "pre-wrap",
    "word-wrap": "break-word",
    position: "absolute",
    margin: 0,
    border: 0,
    padding: 0,
    top: "0.25em",
    left: "0.25em",
    bottom: "0.25em",
    right: "0.25em",
  },
  taskbar: {
    padding: "0",
    position: "relative",
    overflow: "hidden",
  },
  links: {
    "overflow-y": "hidden",
    "overflow-x": "auto",
    "vertical-align": "middle",
    "text-align": "center",
    height: "1em",
    padding: "0.25em",
  },
  prompt: {
    overflow: "hidden",
    "white-space": "pre-wrap",
    "text-align": "left",
    "vertical-align": "middle",
    height: "1em",
    padding: "0.25em",
  },
  scrollcount: {
    position: "absolute",
    right: 0,
    bottom: 0,
  },
});


//////////////////////////////////////////////////////////////////////


class Terminal extends React.Component {
  constructor(props) {
    super(props);
    this.state = {
      lines: 0,
    };
    this.output = React.createRef();
    this.quicklinks = React.createRef();
    this.prompt = React.createRef();
  }
  
  focusInput = () => {
    window.client.focus();
  };

  componentDidMount() {
    document.addEventListener('resize', e => this.onChange() );
    window.client.react.terminal = this;
    window.client.initOutput(this.output.current);
    window.client.initQuicklinks(this.quicklinks.current);
    window.client.initPrompt(this.prompt.current);
  }
  
  onChange = () => {
    this.setState({ lines: this.linesOfScroll() });
  };
  
  linesOfScroll() {
    return window.client.output.linesOfScroll();
  }

  render() {
    const { classes } = this.props;
    const { lines } = this.state;
    
    return (
      <div className={classes.frame} onClick={this.focusInput}>
        <div className={classNames(classes.terminal, "ansi-37 ansi-40")}>
          <div ref={this.output} className={classNames(classes.output, "ansi-37 ansi-40")} onScroll={this.onChange}></div>
        </div>
        <div className={classes.taskbar}>
          <div ref={this.quicklinks} className={classNames(classes.links, "ansi-1-34 ansi-40")}></div>
          <div ref={this.prompt} className={classNames(classes.prompt, "ansi-37 ansi-40")}></div>
          <div className={classes.scrollcount}>
            <Typography variant="button" color="error" align="right">
              {lines > 0 && "...and "+lines+" more lines..."}
            </Typography>
          </div>
        </div>
      </div>
    );
  }
}

Terminal.propTypes = {
  classes: PropTypes.object.isRequired,
  theme: PropTypes.object.isRequired,
};

export default withStyles(styles, { withTheme: true })(Terminal);

