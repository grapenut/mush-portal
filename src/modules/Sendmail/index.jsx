
import React from 'react';
import PropTypes from 'prop-types';
import { withStyles } from '@material-ui/core/styles';

import Card from '@material-ui/core/Card';
import CardHeader from '@material-ui/core/CardHeader';
import CardContent from '@material-ui/core/CardContent';
import CardActions from '@material-ui/core/CardActions';
import Icon from '@material-ui/core/Icon';
import Button from '@material-ui/core/Button';
import Tooltip from '@material-ui/core/Tooltip';
import TextField from '@material-ui/core/TextField';

import SendIcon from '@material-ui/icons/Send';
import CancelIcon from '@material-ui/icons/Cancel';

import ChipInput from 'material-ui-chip-input';

import AceEditor from 'react-ace';
import 'brace/mode/mushcode';
import 'brace/theme/tomorrow_night_bright';


//////////////////////////////////////////////////////////////////////


const styles = theme => ({
  card: {
    position: "absolute",
    width: "100%",
    height: "100%",
    display: "flex",
    "flex-flow": "column nowrap",
  },
  header: {
    display: "flex",
    "flex-flow": "row nowrap",
  },
  sub: {
    display: "flex",
  },
  left: {
    flex: 1,
  },
  right: {
    marginLeft: "3em",
  },
  stretch: {
    width: "100%",
  },
  body: {
    position: "relative",
    flex: 1,
    display: "flex",
    overflow: "hidden",
    "flex-flow": "column nowrap",
  },
  bodytext: {
    flex: 1,
  },
  actions: {
    "justify-content": "space-evenly",
  },
  button: {
    display: "block",
  },
  helperText: {
    textAlign: 'right',
    width: '100%',
  },
  nameInput: {
    minWidth: "10em",
  },
});


//////////////////////////////////////////////////////////////////////


class Sendmail extends React.Component {
  constructor(props) {
    super(props);
    this.state = {
      subject: props.subject ? props.subject : "",
      body: props.body ? props.body : "",
      error: null,
      chips: []
    };
    
    this.editor = React.createRef();
  }

  setTarget(to) {
    this.addChip(to);
  }
  
  setSubject(subject) {
    this.setState({ subject });
  }
  
  setBody(body) {
    this.setState({ body });
  }

  setFields(to, subject, body) {
    to && this.addChip(to);
    this.setState({ subject, body });
  }
  
  sendMail = () => {
    const { chips, subject, body } = this.state;
    var realsub = subject;
    
    if (chips.length < 1) {
      alert("Invalid recipients.");
      return;
    }
    
    if (!body || body === "") {
      alert("Empty message.");
      return;
    }
    
    if (!subject || subject === "") {
      if (body.length > 20) {
        realsub = body.substr(0,20)+"...";
      } else {
        realsub = body;
      }
    }
    
    var to = '"'+chips.join('" "')+'"';
    window.client.sendCommand("@mail "+to+"="+realsub+"/"+body.split('\n').join('%r'));
    this.closePanel();
  };
  
  closePanel = () => {
    window.client.closePanel("Sendmail");
  };
  
  componentDidMount() {
    window.client.react.sendmail = this;
    
    const { panel, to } = this.props;
    panel.options.resizeit.resize = this.onResize;
    window.client.panels.resizeit(panel, panel.options.resizeit);
    
    to && this.addChip(to);
  }
  
  componentWillUnmount() {
    window.client.react.sendmail = null;
  }
  
  handleChange = name => event => {
    this.setState({
      [name]: event.target.value,
    });
  };

  changeText = body => {
    this.setState({ body });
  };
  
  onResize = () => {
    this.editor.current.editor.resize();
  };
  
  setError = error => {
    this.setState({ error });
//    setTimeout(() => { this.setState({ error: null }); }, 1000);
  };
  
  onInput = () => {
    this.setError(null);
  };
  
  addChip = chip => {
    const { chips } = this.state;
    var str = chip.replace(/(?<!\\)\\/g, '').replace(/(?<!\\)"/g, '');
    window.client.execString('if(setr(0,namelist("'+str+'")),name(%q0))', (result) => {
      if (result !== "") {
        if (chips.indexOf(result) === -1) {
          chips.push(result);
          this.setState({ chips });
        }
        this.setError(null);
      } else {
        this.setError("Unknown player.");
      }
    });

  };
  
  delChip = (chip, i) => {
    const { chips } = this.state;
    chips.splice(i, 1);
    this.setState({ chips });
    this.setError(null);
  };
  
  beforeAdd = (chip) => {
    if ((chip.startsWith('"') && !chip.endsWith('"')) || 
        (chip.startsWith("'") && !chip.endsWith("'")) || chip.endsWith('\\')) {
      return false;
    }
    
    
    
    return true;
  };
  
  render() {
    const { classes } = this.props;
    const { chips, subject, body, error } = this.state;
    
    return (
      <Card className={classes.card}>
        <CardHeader className={classes.header}
          title={(
            <ChipInput label="Recipients" fullWidth value={chips} blurBehavior="add" onUpdateInput={this.onInput}
              newChipKeyCodes={[13,32,187]} onBeforeAdd={this.beforeAdd} onAdd={this.addChip} classes={{ input: classes.nameInput }}
              onDelete={this.delChip} helperText={error} FormHelperTextProps={{ error: true, className: classes.helperText }}
            />
          )}
          subheader={(
            <TextField label="Subject" value={subject} onChange={this.handleChange("subject")} className={classes.stretch} />
          )}
        />
        <CardContent className={classes.body}>
          <AceEditor
            className={classes.bodytext}
            ref={this.editor}
            mode="mushcode"
            width="100%"
            theme="tomorrow_night_bright"
            value={body}
            onChange={this.changeText}
            wrapEnabled={true}
            highlightActiveLine={false}
            editorProps={{ $blockScrolling: Infinity }}
          />
        </CardContent>
        <CardActions className={classes.actions}>
          <Tooltip title="Send draft.">
            <Button fullWidth className={classes.button} onClick={this.sendMail}>
              <Icon>
                <SendIcon />
              </Icon>
            </Button>
          </Tooltip>
          <Tooltip title="Discard draft.">
            <Button fullWidth className={classes.button} onClick={this.closePanel}>
              <Icon>
                <CancelIcon />
              </Icon>
            </Button>
          </Tooltip>
        </CardActions>
      </Card>
    );
  }
}

Sendmail.propTypes = {
  classes: PropTypes.object.isRequired,
  theme: PropTypes.object.isRequired,
  to: PropTypes.string,
  subject: PropTypes.string,
  body: PropTypes.string,
  panel: PropTypes.object,
};

export default withStyles(styles, { withTheme: true })(Sendmail);

