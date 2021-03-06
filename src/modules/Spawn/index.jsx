/* eslint no-control-regex: 0 */

import React from 'react';
import classNames from 'classnames';
import PropTypes from 'prop-types';
import { withStyles } from '@material-ui/core/styles';

import TextField from '@material-ui/core/TextField';

import Emulator from '../../client/emulator';
import UserInput from '../../client/userinput';

//////////////////////////////////////////////////////////////////////

const MAX_HISTORY_SIZE = 1000;
const HISTORY_KEY = "output_history_";

const styles = theme => ({
  frame: {
    position: "absolute",
    height: "100%",
    width: "100%",
    display: "flex",
    "flex-flow": "column nowrap",
  },
  top: {
    flex: 1,
    display: "flex",
  },
  output: {
    margin: '0.25em 0.5em',
    "font-family": "'Courier New', monospace",
    "font-weight": "normal",
    "font-size": "10pt",
    width: "100%",
    flex: 1,
    "overflow-y": "auto",
    "overflow-x": "hidden",
    "white-space": "pre-wrap",
    "word-wrap": "break-word",
    padding: "0.25em 0.5em",
  },
  bottom: {
    "background-color": theme.palette.background.paper,
    display: "flex",
  },
  input: {
    flex: 1,
    margin: "1px 0 0 0",
    border: "none",
    outline: "none",
    "vertical-align": "middle",
    padding: "0.25em",
    resize: "none",
    height: "3em",
    "font-family": "'Courier New', monospace",
    "font-weight": "normal",
    "font-size": "16pt",
    [theme.breakpoints.down('sm')]: {
      height: "1.5em",
    },
  },
  prefix: {
    width: "5em",
  },
});


//////////////////////////////////////////////////////////////////////


class Spawn extends React.Component {
  constructor(props) {
    super(props);
    this.state = {
      prefix: props.prefix ? props.prefix : "",
      saveHistory: props.saveHistory ? props.saveHistory : false,
      autoHide: props.autoHide ? props.autoHide : false,
      showActivity: props.showActivity ? props.showActivity : false,
    };

    this.refoutput = React.createRef();
    this.refinput = React.createRef();

    this.output = null;
    this.input = null;
    
    this.hasHidden = false;
  }
  
  componentDidMount() {
    this.output = new Emulator(this.refoutput.current);
    
    this.input = new UserInput(this.refinput.current);
    this.input.onEnter = (cmd) => { this.sendCommand(cmd); };
    this.input.onEscape = () => { this.input.clear(); };
    this.input.onPageUp = () => { this.output.scrollPageUp(); };
    this.input.onPageDown = () => { this.output.scrollPageDown(); };
    
    if (this.state.saveHistory) {
      this.LoadHistory();
      this.output.scrollDown();
    }
    
    if (this.state.autoHide) {
      this.AutoHide();
    }
  }
  
  componentWillUnmount() {
    this.output = null;
    this.input = null;
  }
  
  sendCommand(cmd) {
    const { prefix } = this.state;
    window.client.sendMacro(prefix + cmd);
  }
  
  changePrefix = event => {
    this.Prefix(event.target.value);
  };
  
  Prefix = prefix => {
    if (this.state.prefix !== prefix) {
      this.setState({ prefix });
    }
    
    return this;
  };

  LoadHistory = () => {
    this.output.loadHistory(HISTORY_KEY + this.props.id);
    this.output.scrollDown();
  };
  
  SaveHistory = saveHistory => {
    if (typeof(saveHistory) === "undefined") {
      saveHistory = true;
    }
    
    if (this.state.saveHistory !== saveHistory) {
      if (saveHistory) {
        this.LoadHistory();
        this.output.scrollDown();
      }
    
      this.setState({ saveHistory });
    }
    
    if (this.state.saveHistory) {
      this.output.saveHistory(HISTORY_KEY + this.props.id, Math.min(MAX_HISTORY_SIZE, window.client.settings.historySpawnSize));
    }
    
    return this;
  };
  
  ShowActivity = showActivity => {
    if (typeof(showActivity) === "undefined") {
      showActivity = true;
    }
    
    if (this.state.showActivity !== showActivity) {
      this.setState({ showActivity });
    }
    
    return this;
  }

  AutoHide = autoHide => {
    if (typeof(autoHide) === "undefined") {
      autoHide = true;
    }
    
    if (this.state.autoHide !== autoHide) {
      this.setState({ autoHide });
    }
    
    if (this.state.autoHide && !this.hasHidden) {
      this.props.panel.minimize();
      this.hasHidden = true;
    }
    
    return this;
  };
  
  Focus = () => {
    
    window.client.react.taskbar.popTask(this.props.panel);
    this.props.panel.normalize();
    
    return this;
  };
  
  // wrapper that scrolls the output if needed
  scrollIfNeeded(text) {
    const { panel, id } = this.props;
    const client = window.client;
    var scroll = false;
    
    if (this.output.nearBottom(client.scrollThreshold)) {
      scroll = true;
    }
    
    this.output.appendText(text);
    
    scroll && this.output.scrollDown();
    
    if (panel.status === "minimized") {
      panel.count++;
      client.react.taskbar.forceUpdate();
    }
    
    if (client.settings.activityEnabled && this.state.showActivity) {
      let re = new RegExp('\\u001b\\[[^m]*m','g');
      let newtxt = text.replace(re, '');
      client.react.taskbar.showActivity(id, newtxt);
    }
        
    if (this.state.saveHistory) {
      this.output.saveHistory(HISTORY_KEY + id, Math.min(MAX_HISTORY_SIZE, client.settings.historySpawnSize));
    }
    
    this.setState({ lines: this.output.linesOfScroll() });
  }
  
  Append(text) {
    if (text.endsWith('\n')) {
      this.appendText(text);
    } else {
      this.append(text);
    }
    return this;
  }

  appendText(text) {
    this.scrollIfNeeded(text);
  }
  
  append(text) {
    this.scrollIfNeeded(text+"\n");
  }
  
  render() {
    const { classes } = this.props;
    const { prefix } = this.state;
    const { ansiFG, ansiBG, fontFamily, fontSize } = window.client.settings;

    const font = {
      fontFamily: "'" + fontFamily + "', monospace",
      fontSize: fontSize + "pt",
    };
    
    const inputFont = {
      fontFamily: "'" + fontFamily + "', monospace",
      fontSize: (window.client.mobile ? 16 : fontSize) + "pt",
    };

    return (
      <div className={classes.frame}>
        <div className={classes.top}>
          <div ref={this.refoutput} className={classNames(classes.output, ansiFG, ansiBG)} style={font}></div>
        </div>
        <div className={classes.bottom}>
          <TextField label="Prefix" classes={{ root: classes.prefix }} value={prefix} onChange={this.changePrefix} />
          <textarea ref={this.refinput} className={classNames(classes.input, ansiFG, ansiBG)} style={inputFont}  autoComplete="off"></textarea>
        </div>
      </div>
    );
  }
}

Spawn.propTypes = {
  classes: PropTypes.object.isRequired,
  theme: PropTypes.object.isRequired,
  id: PropTypes.string.isRequired,
  panel: PropTypes.object.isRequired,
  prefix: PropTypes.string,
};

export default withStyles(styles, { withTheme: true })(Spawn);

	