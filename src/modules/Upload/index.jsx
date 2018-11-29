
import React from 'react';
import PropTypes from 'prop-types';
import { withStyles } from '@material-ui/core/styles';

import Button from '@material-ui/core/Button';
import TextField from '@material-ui/core/TextField';
import Tooltip from '@material-ui/core/Tooltip';

import CloudUploadIcon from '@material-ui/icons/CloudUpload';
import PauseIcon from '@material-ui/icons/Pause';
import RedoIcon from '@material-ui/icons/Redo';

import AceEditor from 'react-ace';
import 'brace/mode/mushcode';
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


class Upload extends React.Component {
  constructor(props) {
    super(props);
    this.state = {
      uploading: false,
      text: "",
      delay: 1000,
    };
    this.text = "";
    this.editor = React.createRef();
  }
  
  componentDidMount() {
    window.client.react.upload = this;
    
    const { panel } = this.props;
    panel.options.resizeit.resize = this.onResize;
    window.client.panels.resizeit(panel, panel.options.resizeit);
  }
  
  componentWillUnmount() {
    window.client.react.upload = null;
  }
  
  setText(text) {
    this.text = text;
    this.setState({ text });
  }
  
  uploadLine() {
    const { text } = this.state;
    var { delay } = this.state;
    
    if (delay < 100) {
      delay = 100;
    } else if (delay > 100000) {
      delay = 100000;
    }
    
    setTimeout(() => {
      const { uploading } = this.state;
      if (!uploading) return;
    
      var lines = text.split('\n');
      if (lines.length > 0) {
      
        var line = lines[0];
        if (line.length > 0) {
          window.client.sendCommand(line);
        }
        
        // remove the sent command
        lines.splice(0,1);
        var newtext = lines.join('\n');
        this.setState({ text: newtext });
        
        if (lines.length > 0) {
          // queue the next line
          this.uploadLine();
        } else {
          this.setState({ uploading: false });
          window.client.closePanel("Upload");
        }
      } else {
        // we reached the end of the file, close up
        this.setState({ uploading: false });
        window.client.closePanel("Upload");
      }
      
    }, delay);
  }
  
  startUpload = () => {
    this.setState({ uploading: true });
    this.uploadLine();
  };
  
  pauseUpload = () => {
    this.setState({ uploading: false });
  };

  resetText = () => {
    this.setState({ text: this.text });
  };
  
  changeDelay = event => {
    const { uploading } = this.state;
    if (uploading) return;
    
    var delay = event.target.value;
    this.setState({ delay });
  };
  
  changeText = text => {
    const { uploading } = this.state;
    if (uploading) return;
    
    this.setText(text);
  };
  
  onResize = () => {
    this.editor.current.editor.resize();
  };
  
  render() {
    const { classes } = this.props;
    const { text, uploading, delay } = this.state;

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
          readOnly={uploading}
          wrapEnabled={true}
          highlightActiveLine={false}
          editorProps={{ $blockScrolling: Infinity }}
        />
        <div className={classes.flex}>
          <div className={classes.stretchflex}>
            <div className={classes.pad}></div>
            <TextField className={classes.padded} label="Command delay (in ms)" value={delay} type="number" variant="outlined" onChange={this.changeDelay} fullWidth />
          </div>
          { !uploading ? (
            <div className={classes.stretchflex}>
              <Tooltip title="Start uploading.">
                <Button className={classes.stretch} onClick={this.startUpload}>
                  <CloudUploadIcon />
                </Button>
              </Tooltip>
              <Tooltip title="Reset partially uploaded text.">
                <Button className={classes.stretch} onClick={this.resetText}>
                  <RedoIcon />
                </Button>
              </Tooltip>
            </div>
          ) : (
            <div className={classes.stretchflex}>
              <Tooltip title="Pause uploading.">
                <Button className={classes.stretch} onClick={this.pauseUpload}>
                  <PauseIcon />
                </Button>
              </Tooltip>
            </div>
          )}
        </div>
      </div>
    );
  }
}

Upload.propTypes = {
  classes: PropTypes.object.isRequired,
  theme: PropTypes.object.isRequired,
  panel: PropTypes.object,
};

export default withStyles(styles, { withTheme: true })(Upload);

	