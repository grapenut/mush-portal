
import React from 'react';
import PropTypes from 'prop-types';
import classNames from 'classnames';
import { withStyles } from '@material-ui/core/styles';

import Typography from '@material-ui/core/Typography';
import Tooltip from '@material-ui/core/Tooltip';


//////////////////////////////////////////////////////////////////////

const MAX_HISTORY_SIZE = 10000;
const HISTORY_KEY = "output_history";

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
    height: "100%",
    bottom: 0,
    right: 0,
  },
  lineheight: {
    lineHeight: 1,
  },
  noPadding: {
    padding: 0,
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

    this.init = false;
  }
  
  focusInput = () => {
    window.client.focus();
  };

  componentDidMount() {
    document.body.onresize = this.onResize;
    window.client.react.terminal = this;
    window.client.initOutput(this.output.current, this.terminal.current);
    window.client.initPrompt(this.prompt.current);
    this.init = true;
    
    if (window.client.settings.historySize > 0) {
      window.client.output.loadHistory(HISTORY_KEY);
    }
    
    this.onResize();
  }
  
  onResize = event => {
    clearTimeout(this.doResize);
    setTimeout(this.doResize, 1000);
  };
  
  doResize = () => {
    const client = window.client;
    client.output.calcDimensions();
    client.sendText("SCREENWIDTH " + Math.min(client.settings.terminalWidth, Math.floor(window.client.output.root.parentNode.clientWidth / window.client.output.dims.width)));
    client.sendText("SCREENHEIGHT " + Math.floor(client.output.root.parentNode.clientHeight / client.output.dims.height));
    client.output.scrollDown();
    
    client.mobile = !window.matchMedia(this.props.theme.breakpoints.up('md').substring(7)).matches;
    
    this.onChange();
  };

  onChange = () => {
    if (window.client.settings.historySize > 0) {
      window.client.output.saveHistory(HISTORY_KEY, Math.min(MAX_HISTORY_SIZE, window.client.settings.historySize));
    }
    
    this.setState({ lines: this.linesOfScroll() });
  };
  
  linesOfScroll() {
    return window.client.output.linesOfScroll();
  }
  
  scrollDown() {
    window.client.output.scrollDown();
  }

  render() {
    const { classes, width, ansiFG, ansiBG, containerRef } = this.props;
    const { lines } = this.state;
    const { fontFamily, fontSize, mobileFontSize } = window.client.settings;
    
    const font = {
      fontFamily: "'" + fontFamily + "', monospace",
      fontSize: (window.client.mobile ? mobileFontSize : fontSize) + "pt",
    };
    
    var dim;
    if (this.init) {
      dim = width * window.client.output.dims.width + "px";
    } else {
      dim = "100%";
    }
    
    return (
      <div id="terminal-container" className={classNames(classes.frame)} style={font} onClick={this.focusInput} ref={containerRef}>
        <div ref={this.terminal} className={classNames(classes.terminal, ansiFG, ansiBG)} onScroll={this.onChange}>
          <div ref={this.output} className={classNames(classes.output, ansiFG, ansiBG)} style={{ maxWidth: dim }}></div>
        </div>
        <div className={classes.taskbar}>
          <div ref={this.prompt} className={classNames(classes.prompt, ansiFG, ansiBG)}></div>
          <div className={classes.scrollcount}>
            <Tooltip title="Click to scroll down.">
              <Typography color="error" align="right" variant="caption" className={classes.lineheight} onClick={this.scrollDown}>
                {lines > 0 && "...and "+lines+" more lines..."}
              </Typography>
            </Tooltip>
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

