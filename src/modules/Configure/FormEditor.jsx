
import React from 'react';
import PropTypes from 'prop-types';
import { withStyles } from '@material-ui/core/styles';


import TextField from '@material-ui/core/TextField';
import Switch from '@material-ui/core/Switch';
import Button from '@material-ui/core/Button';
import Typography from '@material-ui/core/Typography';

import SaveIcon from '@material-ui/icons/Save';
import UndoIcon from '@material-ui/icons/Undo';
import DeleteIcon from '@material-ui/icons/Delete';
import CloseIcon from '@material-ui/icons/Close';
import CloudDownloadIcon from '@material-ui/icons/CloudDownload';

import AceEditor from 'react-ace';
import 'brace/mode/mushcode';
import 'brace/mode/javascript';
import 'brace/mode/css';
import 'brace/theme/tomorrow_night_bright';


//////////////////////////////////////////////////////////////////////


const styles = theme => ({
  frame: {
    position: "absolute",
    height: "100%",
    width: "100%",
    overflow: "hidden",
  },
  form: {
    position: "absolute",
    display: "flex",
    height: "100%",
    width: "100%",
    flexFlow: "column nowrap", 
  },
  container: {
    flex: 1,
    display: "flex",
    flexFlow: "column nowrap",
  },
  name: {
    width: "100%",
    display: "flex",
    flexFlow: "row wrap",
  },
  flow: {
    overflowX: "hidden",
    overflowY: "auto",
  },
  top: {
    display: "flex",
    flexFlow: "row wrap",
    width: "100%",
    overflowX: "hidden",
    overflowY: "auto",
    [theme.breakpoints.down('sm')]: {
      flex: 1,
    },
  },
  editor: {
    flex: 1,
    margin: theme.spacing.unit+"px 0",
    [theme.breakpoints.down('sm')]: {
      margin: 0,
      fontSize: "16pt",
    },
  },
  bottom: {
    display: "flex",
    flexFlow: "row nowrap",
    width: "100%",
  },
  middle: {
    display: "flex",
    flexFlow: "row nowrap",
    flex: 1,
    alignItems: "center",
  },
  align: {
    width: "100%",
    textAlign: "center",
    verticalAlign: "middle",
  },
  flex: {
    flex: 1,
    minWidth: "10em",
  },
  block: {
    display: "flex",
    "flex-direction": "column",
  },
  mobileOnly: {
    display: 'flex',
    [theme.breakpoints.up('md')]: {
      display: 'none',
    },
  },
  desktopOnly: {
    display: 'none',
    [theme.breakpoints.up('md')]: {
      display: 'flex',
    },
  },
  switchText: {
    display: "flex",
    justifyContent: "space-between",
    alignItems: "center",
  },
  switchBase: {
    [theme.breakpoints.down('sm')]: {
      height: "24px",
    },
  },
  inputBase: {
    padding: 0.25*theme.spacing.unit,
    [theme.breakpoints.up('md')]: {
      padding: theme.spacing.unit,
    },
  },
});


//////////////////////////////////////////////////////////////////////


class FormEditor extends React.Component {
  constructor(props) {
    super(props);
    
    const { list, listName, selected, template } = props;

    const empty = window.client.templates.empty[listName];
    
    this.state = {
      list: list,
      item: Object.assign({}, list && selected > -1 ? list[selected] : (template || empty)),
      selected: selected,
      status: "",
      error: false,
      javascript: true,
      needsToResize: false,
    };
    
    this.editor = React.createRef();
  }
  
  componentDidMount() {
    const { panel } = this.props;
    panel.options.resizeit.resize = this.onResize;
    window.client.panels.resizeit(panel, panel.options.resizeit);
  }
  
  componentWillUnmount() {
    this.props.panel.options.resizeit.resize = null;
    clearTimeout(this.clearStatus);
  }

  static getDerivedStateFromProps(props, state) {
    const { list, listName, selected, template } = props;
    
    const empty = window.client.templates.empty[listName];
    
    var newState = {};
    
    if (list !== state.list) {
      newState.list = list;
      newState.selected = selected;
      newState.item = Object.assign({}, list && selected > -1 ? list[selected] : (template || empty));
      newState.needsToResize = true;
      return newState;
    }
    
    if (selected !== state.selected) {
      newState.selected = selected;
      newState.item = Object.assign({}, list && selected > -1 ? list[selected] : (template || empty));
      newState.needsToResize = true;
      return newState;
    }
    
    if (template !== state.template) {
      newState.template = template;
      newState.item = Object.assign({}, list && selected > -1 ? list[selected] : (template || empty));
      newState.needsToResize = true;
      return newState;
    }
    
    return null;
  }
  
  defaultText() {
    const { list, listName, selected, immutable } = this.props;
    const { item } = this.state;
    const name = item.name;
    
    if (!immutable) return "";
    
    if (list && selected > -1 && list[selected].text !== "") {
      return list[selected].text.slice();
    }
    
    var req = new window.XMLHttpRequest();
    req.onreadystatechange = () => {
      if (req.readyState === 4) {
        // The request is done; did it work?
        if (req.status === 200) {
          item.name = name;
          item.text = req.responseText;
          this.setState({ item, list, selected });
        } else {
          alert("Unable to download file! See console for more information.");
        }
      }
    };
    req.open("GET", "./" + name);
    req.send();
    
    return window.client.templates.empty[listName].text.slice();
  }

  setStatus = (error, status) => {
    this.setState({ error, status });
    clearTimeout(this.clearStatus);
    setTimeout(this.clearStatus, 3000);
  };

  clearStatus = () => {
    this.setState({ error: false, status: "" });
    this.onResize();
  };
  
  handleChange = (key) => (e) => {
    const { item } = this.state;
    item[key] = e.target.value;
    this.setState({ item });
  };
  
  handleNumber = (key) => (e) => {
    const { item } = this.state;
    item[key] = parseInt(e.target.value);
    this.setState({ item });
  };
  
  handleSwitch = (key) => (e) => {
    const { item } = this.state;
    if (item.hasOwnProperty(key)) {
      item[key] = e.target.checked;
      this.setState({ item });
    } else {
      this.setState({ [key]: e.target.checked });
    }
  };
  
  changeText = (text) => {
    const { item } = this.state;
    item.text = text;
    this.setState({ item });
  };

  save = () => {
    const { list, listName, Form } = this.props;
    const css = listName === "CSS";
  
    if (Form && Form.save) {
      Form.save();
    } else if (css) {
      window.client.saveCSS();
    } else {
      window.client.saveLocalStorage(list, listName);
    }
  };

  onResize = () => {
    this.setState({ needsToResize: false });
    this.editor.current.editor.resize();
  };
  
  onSubmit = (e) => {
    const { list, selected, immutable } = this.props;
    const { item } = this.state;
    const client = window.client;

    e.preventDefault();
    
    if (item.name === "") {
      this.setStatus(true, "Name must not be blank." );
      return;
    }
    
    // filter unicode punctuation
    item.name = client.filterUnicode(item.name);
    item.text = client.filterUnicode(item.text);
    
    if (item.pattern) {
      item.pattern = client.filterUnicode(item.pattern);
    }
    
    if (item.tooltip) {
      item.tooltip = client.filterUnicode(item.tooltip);
    }
    
    if (item.icon) {
      item.icon = client.filterUnicode(item.icon);
    }
    
    if (item.count) {
      item.count = client.filterUnicode(item.count);
    }

    var match = list.map((item) => item.name).indexOf(item.name);
    if (match > -1 && match !== selected) {
      this.setStatus(true, "Name already saved, choose another.");
      return;
    }
    
    if (immutable && selected === -1) {
      this.setStatus(true, "You may only edit existing items.");
      return;
    }
    
    this.setStatus(false, "Saved." );
    
    if (selected > -1) {
      list[selected] = Object.assign({}, item);
      client.react.configure.setState({ selected: selected });
    } else {
      list.push(item);
      client.react.configure.setState({ selected: list.length-1 });
    }
    
    this.save();
    
  };
  
  onDelete = () => {
    const { list, listName, selected, immutable } = this.props;
    const client = window.client;
    
    if (window.confirm("Do you really want to delete that?") && list && selected > -1) {
      if (immutable) {
        let name = list[selected].name;
        list[selected] = Object.assign({}, client.templates.empty[listName]);
        list[selected].name = name;
        this.setState({ item: Object.assign({}, list[selected]) });
      } else {
        list.splice(selected, 1);
        client.react.configure.setState({ selected: -1 });
      }
      
      this.setStatus(false, "Deleted." );
      
      this.save();
    }
  };
  
  onReset = () => {
    const { list, listName, selected, immutable, template } = this.props;
    const { item } = this.state;
    var empty = Object.assign({}, window.client.templates.empty[listName]);
    
    if (list && selected > -1) {
      if (immutable) {
        empty.name = list[selected].name;
        if (item.text === "") {
          empty.text = this.defaultText();
        } else {
          empty.text = list[selected].text;
        }
      } else {
        empty = list[selected];
      }
    }
    
    this.setState({
      item: Object.assign({}, template || empty),
    });
    
    this.setStatus(false, "Reset.");
  };
  
  componentDidUpdate() {
    if (this.state.needsToResize) {
      this.onResize();
    }
  }
  
  render() {
    const { classes, selected, Form, immutable } = this.props;
    const { item } = this.state;
    
    var ltype = "MushCode";
    var rtype = "JavaScript";
    if (!Form) {
      ltype = "Text";
      if (item.name.endsWith('.css')) {
        rtype = "CSS";
      }
    }
    
    var mode = this.state.javascript;
    if (item.hasOwnProperty('javascript')) {
      mode = item.javascript;
    }
    
    return (
      <div className={classes.frame}>
        <form onSubmit={this.onSubmit} className={classes.form}>
          <div className={classes.container}>
            <div className={classes.top}>
              <div className={classes.name}>
                <TextField label="Name" className={classes.flex} value={item.name} onChange={this.handleChange('name')} disabled={immutable} InputProps={{ classes: { input: classes.inputBase }, }} />
                <span className={classes.switchText}>
                  <Typography>{ltype}</Typography>
                  <Switch checked={mode}
                    classes={{ switchBase: classes.switchBase }}
                    color="default"
                    onChange={this.handleSwitch('javascript')}
                  />
                  <Typography>{rtype}</Typography>
                </span>
              </div>
              {Form && (<Form item={item} handleNumber={this.handleNumber} handleChange={this.handleChange} handleSwitch={this.handleSwitch} />)}
            </div>
            
            <div className={classes.editor}>
              <AceEditor
                width="100%"
                height="100%"
                minHeight="4em"
                minWidth="10em"
                className={classes.editor}
                ref={this.editor}
                mode={mode ? rtype.toLowerCase() : ltype.toLowerCase()}
                theme="tomorrow_night_bright"
                value={item.text}
                onChange={this.changeText}
                wrapEnabled={!window.client.mobile}
                highlightActiveLine={false}
                editorProps={{ $blockScrolling: Infinity }}
              />
            </div>
          </div>
          
          <div className={classes.bottom}>
            <Button className={classes.mobileOnly} classes={{ label: classes.block }} onClick={() => window.client.react.configure.setState({ edit: false, selected: -1 })}>
              <CloseIcon />Close
            </Button>
            <Button onClick={this.onDelete} classes={{ label: classes.block }} disabled={selected === -1}>
              <DeleteIcon />Delete
            </Button>
            <span className={classes.middle}>
{/*
              <Typography className={classes.align} color={error ? "error" : "default"}>
                {status !== "" ? status : (selected ? "Save." : "Create.")}
              </Typography>
*/}
            </span>
            <Button onClick={this.onSubmit} classes={{ label: classes.block }} disabled={immutable && selected === -1}>
              <SaveIcon />Save
            </Button>
            <Button onClick={this.onReset} classes={{ label: classes.block }} disabled={immutable && selected === -1}>
              {immutable && item.text === "" ? (<CloudDownloadIcon />) : (<UndoIcon />)}
              {immutable && item.text === "" ? "Source" : "Undo"}
            </Button>
          </div>
          
        </form>
      </div>
    );
  }
}

FormEditor.propTypes = {
  classes: PropTypes.object.isRequired,
  theme: PropTypes.object.isRequired,
  panel: PropTypes.object.isRequired,
  list: PropTypes.array.isRequired,
  listName: PropTypes.string.isRequired,
  selected: PropTypes.number.isRequired,
  Form: PropTypes.func,
  immutable: PropTypes.bool,
  template: PropTypes.object,
};

export default withStyles(styles, { withTheme: true })(FormEditor);

