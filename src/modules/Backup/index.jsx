
import React from 'react';
import PropTypes from 'prop-types';
import { withStyles } from '@material-ui/core/styles';

import Button from '@material-ui/core/Button';
//import TextField from '@material-ui/core/TextField';
import Tooltip from '@material-ui/core/Tooltip';

import CloudDownloadIcon from '@material-ui/icons/CloudDownload';
import SaveIcon from '@material-ui/icons/Save';
import UndoIcon from '@material-ui/icons/Undo';

import AceEditor from 'react-ace';
import 'brace/mode/json';
import 'brace/theme/tomorrow_night_bright';

//////////////////////////////////////////////////////////////////////


const styles = theme => ({
  frame: {
    position: "absolute",
    display: "flex",
    height: "100%",
    width: "100%",
    "flex-flow": "column nowrap",
  },
  editor: {
    flex: 1,
    [theme.breakpoints.down('sm')]: {
      fontSize: '16pt',
    },
  },
  flex: {
    display: 'flex',
  },
  stretch: {
    flex: 1,
  },
  block: {
    display: "flex",
    "flex-direction": "column",
  },
  stretchflex: {
    display: "flex",
    flex: 1,
  },
  pad: {
    margin: "1em",
  },
  padded: {
    margin: theme.spacing.unit,
  },
});


//////////////////////////////////////////////////////////////////////


class Backup extends React.Component {
  constructor(props) {
    super(props);
    this.state = {
      text: "",
    };
    this.text = "";
    this.editor = React.createRef();
  }
  
  componentDidMount() {
    window.client.react.backup = this;
    
    const { panel } = this.props;
    panel.options.resizeit.resize = this.onResize;
    window.client.panels.resizeit(panel, panel.options.resizeit);
  }
  
  componentWillUnmount() {
    window.client.react.backup = null;
  }
  
  setText(text) {
    this.text = text;
    this.setState({ text });
  }
  
  changeText = (text) => {
    this.setState({ text });
  };
  
  resetText = () => {
    this.setState({ text: this.text });
  };
  
  saveBackup = () => {
    window.client.saveText("localStorage.txt", this.state.text);
    window.client.closePanel("Backup");
  };
  
  saveLocalStorage = () => {
    if (window.client.restoreLocalStorage(this.state.text)) {
      window.client.closePanel("Backup");
    }
  };
  
  onResize = () => {
    this.editor.current.editor.resize();
  };
  
  render() {
    const { classes } = this.props;
    const { text } = this.state;

    return (
      <div className={classes.frame}>
        <AceEditor
          className={classes.editor}
          ref={this.editor}
          mode="mushcode"
          width="100%"
          theme="tomorrow_night_bright"
          value={text}
          onChange={this.changeText}
          wrapEnabled={!window.client.mobile}
          highlightActiveLine={false}
          editorProps={{ $blockScrolling: Infinity }}
        />
        <div className={classes.flex}>
          <div className={classes.stretchflex}>
            <Tooltip title="Save backup to file.">
              <Button className={classes.stretch} classes={{ label: classes.block }} onClick={this.saveBackup}>
                <CloudDownloadIcon />
                Backup{!window.client.mobile && " to File"}
              </Button>
            </Tooltip>
            <Tooltip title="Save local storage.">
              <Button className={classes.stretch} classes={{ label: classes.block }} onClick={this.saveLocalStorage}>
                <SaveIcon />
                Commit{!window.client.mobile && " Changes"}
              </Button>
            </Tooltip>
            <Tooltip title="Restore original text.">
              <Button className={classes.stretch} classes={{ label: classes.block }} onClick={this.resetText}>
                <UndoIcon />
                Undo{!window.client.mobile && " Changes"}
              </Button>
            </Tooltip>
          </div>
        </div>
      </div>
    );
  }
}

Backup.propTypes = {
  classes: PropTypes.object.isRequired,
  theme: PropTypes.object.isRequired,
  panel: PropTypes.object,
};

export default withStyles(styles, { withTheme: true })(Backup);

	