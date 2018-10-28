
import React from 'react';
import PropTypes from 'prop-types';
import classNames from 'classnames';
import { withStyles } from '@material-ui/core/styles';
import Typography from '@material-ui/core/Typography';


//////////////////////////////////////////////////////////////////////


const styles = theme => ({
  frame: {
    position: "relative",
    display: "flex",
    "flex-flow": "column nowrap",
    margin: 0,
    padding: 0,
    border: "none",
    "background-color": theme.palette.primary.main,
    flex: 1,
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
    position: "relative",
    overflowY: "scroll",
    overflowX: "hidden",
    padding: "0.25em 0.5em",
  },
  output: {
    "white-space": "pre-wrap",
    "word-wrap": "break-word",
    position: "absolute",
    margin: 0,
    border: 0,
    padding: 0,
  },
  taskbar: {
    padding: "0",
    position: "relative",
    overflow: "hidden",
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
    
    this.terminal = React.createRef();
    this.output = React.createRef();
    this.prompt = React.createRef();
  }
  
  focusInput = () => {
    window.client.focus();
  };

  componentDidMount() {
    document.addEventListener('resize', e => this.onChange() );
    window.client.react.terminal = this;
    window.client.initOutput(this.output.current, this.terminal.current);
    window.client.initPrompt(this.prompt.current);
  }
  
  onChange = () => {
    this.setState({ lines: this.linesOfScroll() });
  };
  
  linesOfScroll() {
    return window.client.output.linesOfScroll();
  }

  render() {
    const { classes, width, ansiFG, ansiBG, containerRef } = this.props;
    const { lines } = this.state;
    
    return (
      <div id="terminal-container" className={classes.frame} onClick={this.focusInput} ref={containerRef}>
        <div ref={this.terminal} className={classNames(classes.terminal, ansiFG, ansiBG)} onScroll={this.onChange}>
          <div ref={this.output} className={classNames(classes.output, ansiFG, ansiBG)} style={{ width: width }}></div>
        </div>
        <div className={classes.taskbar}>
          <div ref={this.prompt} className={classNames(classes.prompt, ansiFG, ansiBG)}></div>
          <div className={classes.scrollcount}>
            <Typography color="error" align="right">
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
  ansiFG: PropTypes.string.isRequired,
  ansiBG: PropTypes.string.isRequired,
  containerRef: PropTypes.object,
};

export default withStyles(styles, { withTheme: true })(Terminal);

