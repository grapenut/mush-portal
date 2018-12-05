
import React from 'react';
import classNames from 'classnames';
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
import Select from '@material-ui/core/Select';
import MenuItem from '@material-ui/core/MenuItem';

import SendIcon from '@material-ui/icons/Send';
import CancelIcon from '@material-ui/icons/Cancel';

//import AceEditor from 'react-ace';
//import 'brace/mode/mushcode';
//import 'brace/theme/tomorrow_night_bright';


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
    [theme.breakpoints.down('sm')]: {
      fontSize: '16pt',
    },
  },
  actions: {
    "justify-content": "space-evenly",
  },
  button: {
    display: "flex",
    "flex-direction": "column",
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


class BBPost extends React.Component {
  constructor(props) {
    super(props);
    this.state = {
      subject: props.subject ? props.subject : "",
      body: props.body ? props.body : "",
      to: props.to ? props.to : "",
      error: null,
      board: null,
      boardlist: [],
    };
    
    this.editor = React.createRef();
  }

  getBoard(board) {
    const boardlist = this.state.boardlist;
    for (let i=0; i < boardlist.length; i++) {
      if ((boardlist[i].name === board) || (boardlist[i].id === board)) {
        return boardlist[i];
      }
    }

    return null;
  }
  
  setSubject(subject) {
    this.setState({ subject });
  }
  
  setBody(body) {
    this.setState({ body });
  }

  setFields(to, subject, body) {
    this.setState({ to, subject, body });
  }
  
  sendBBPost = () => {
    const { to, board, subject, body } = this.state;
    var realsub = subject;
    
    var bb = board;
    if (!bb) {
      bb = this.getBoard(to);
    }
    
    if (!bb) {
      alert("You must choose a BBoard.");
      return;
    }
    
    if (!body || body === "") {
      alert("Empty message.");
      return;
    }
    
    if (!subject || subject === "") {
      if (body.length > 20) {
        realsub = body.substr(0,20) + "...";
      } else {
        realsub = body;
      }
    }
    
    window.client.sendCommand("+bbpost "+bb.id+"/"+realsub+"="+body.split('\n').join('%r'));
    this.closePanel();
  };
  
  closePanel = () => {
    window.client.closePanel("BBPost");
  };
  
  componentDidMount() {
    window.client.react.bbpost = this;
    
    const { panel } = this.props;
    const { to } = this.state;
    
    panel.options.resizeit.resize = this.onResize;
    window.client.panels.resizeit(panel, panel.options.resizeit);
    window.client.execJSON('jsonapi(boardlist)', (obj) => {
      if (obj.boardlist.length > 0) {
        this.setState({ boardlist: obj.boardlist });
      }

      if (to && to.length > 0) {
        this.setState({ board: this.getBoard(to) });
      }
    });
    
  }
  
  componentWillUnmount() {
    const { panel } = this.props;
    panel.options.resizeit.resize = null;
    window.client.react.bbpost = null;
  }
  
  handleChange = name => event => {
    this.setState({
      [name]: event.target.value,
    });
  };

  changeText = body => {
    this.setState({ body: this.editor.current.value });
  };
  
  onResize = () => {
    //this.editor.current.editor.resize();
  };
  
  setError = error => {
    this.setState({ error });
//    setTimeout(() => { this.setState({ error: null }); }, 1000);
  };
  
  onInput = () => {
    this.setError(null);
  };
  
  render() {
    const { classes } = this.props;
    const { to, board, subject, body } = this.state;
    const { ansiFG, ansiBG, fontFamily, fontSize } = window.client.settings;
    
    const font = {
      fontFamily: "'" + fontFamily + "', monospace",
      fontSize: (window.client.mobile ? 16 : fontSize) + "pt",
    };
    
    var bb = board;
    if (!bb) {
      bb = this.getBoard(to);
    }
    
    return (
      <Card className={classes.card}>
        <CardHeader className={classes.header}
          title={
/*
            <TextField label="Board" fullWidth value={chips} blurBehavior="add" onUpdateInput={this.onInput}
              newChipKeyCodes={[13,32,187]} onBeforeAdd={this.beforeAdd} onAdd={this.addChip} classes={{ input: classes.nameInput }}
              onDelete={this.delChip} helperText={error} FormHelperTextProps={{ error: true, className: classes.helperText }}
            />
*/
            <Select
              displayEmpty
              autoWidth
              value={bb || ""}
              onChange={(e) => this.setState({ board: e.target.value })}
            >
              <MenuItem value="" disabled>Choose a BBoard</MenuItem>
              {this.state.boardlist.map((b,i) => (
                <MenuItem key={i} value={b}>{b.name}</MenuItem>
              ))}
            </Select>
          }
          subheader={(
            <TextField label="Subject" value={subject} onChange={this.handleChange("subject")} className={classes.stretch} />
          )}
        />
        <CardContent className={classes.body}>
          <textarea className={classNames(classes.bodytext, font, ansiFG, ansiBG)}
            ref={this.editor}
            width="100%"
            value={body}
            onChange={this.changeText}
          />
{/*
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
*/}
        </CardContent>
        <CardActions className={classes.actions}>
          <Tooltip title="Send draft.">
            <Button fullWidth classes={{ label: classes.button }} onClick={this.sendBBPost}>
              <Icon>
                <SendIcon />
              </Icon>
              Send
            </Button>
          </Tooltip>
          <Tooltip title="Discard draft.">
            <Button fullWidth classes={{ label: classes.button }} onClick={this.closePanel}>
              <Icon>
                <CancelIcon />
              </Icon>
              Cancel
            </Button>
          </Tooltip>
        </CardActions>
      </Card>
    );
  }
}

BBPost.propTypes = {
  classes: PropTypes.object.isRequired,
  theme: PropTypes.object.isRequired,
  to: PropTypes.string,
  subject: PropTypes.string,
  body: PropTypes.string,
  panel: PropTypes.object,
};

export default withStyles(styles, { withTheme: true })(BBPost);

