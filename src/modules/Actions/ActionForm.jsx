
import React from 'react';
import PropTypes from 'prop-types';
import { withStyles } from '@material-ui/core/styles';


import TextField from '@material-ui/core/TextField';
import Switch from '@material-ui/core/Switch';
import Button from '@material-ui/core/Button';
import ListItem from '@material-ui/core/ListItem';
import ListItemText from '@material-ui/core/ListItemText';
import Typography from '@material-ui/core/Typography';

import SaveIcon from '@material-ui/icons/Save';
import UndoIcon from '@material-ui/icons/Undo';
import DeleteIcon from '@material-ui/icons/Delete';

import AceEditor from 'react-ace';
import 'brace/mode/mushcode';
import 'brace/mode/javascript';
import 'brace/theme/tomorrow_night_bright';


//////////////////////////////////////////////////////////////////////


const styles = theme => ({
  frame: {
    position: "absolute",
    height: "100%",
    width: "100%",
    overflowX: "hidden",
    overflowY: "auto",
  },
  form: {
    height: "100%",
    width: "100%",
    display: "flex",
    flexFlow: "column nowrap", 
  },
  top: {
    display: "flex",
    flexFlow: "row nowrap",
    width: "100%",
  },
  bottom: {
    position: "relative",
    display: "flex",
    flexFlow: "row nowrap",
    bottom: 0,
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
  },
  block: {
    display: "flex",
    "flex-direction": "column",
  },
});


//////////////////////////////////////////////////////////////////////


class ActionForm extends React.Component {
  constructor(props) {
    super(props);
    
    const { list, listName, selected } = props;

    this.template = window.client.actionTemplates[listName];

    this.state = {
      list: list,
      item: Object.assign({}, list && selected > -1 ? list[selected] : this.template),
      selected: selected,
      status: "",
      error: false,
    };
    
    this.refs = {};
    Object.keys(this.template).forEach((key) => {
      this.refs[key] = React.createRef();
    });
  }
  
  componentDidMount() {
    const { panel } = this.props;
    panel.options.resizeit.resize = this.onResize;
    window.client.panels.resizeit(panel, panel.options.resizeit);
  }
  
  componentWillUnmount() {
    this.props.panel.options.resizeit.resize = null;
  }

  static getDerivedStateFromProps(props, state) {
    const { list, listName, selected } = props;
    
    var newState = {};
    
    if (list !== state.list) {
      newState.list = list;
      newState.selected = selected;
      newState.item = Object.assign({}, list && selected > -1 ? list[selected] : window.client.actionTemplates[listName]);
      return newState;
    }
    
    if (selected !== state.selected) {
      newState.selected = selected;
      newState.item = Object.assign({}, list && selected > -1 ? list[selected] : window.client.actionTemplates[listName]);
      return newState;
    }
    
    return null;
  }
  
  onResize = () => {
    this.refs.action && this.refs.action.current.editor.resize();
  };
  
  setStatus = (error, status) => {
    this.setState({ error: error, status: status });
    clearTimeout(this.clearStatus);
    setTimeout(this.clearStatus, 3000);
  };

  clearStatus = () => {
    this.setState({ error: false, status: "" });
  };
  
  onSubmit = (e) => {
    const { list, listName, selected } = this.props;
    const { item } = this.state;
    
    e.preventDefault();

    if (item.name === "") {
      this.setStatus(true, "Name must not be blank." );
      return;
    }
    
    var match = list.map((item) => item.name).indexOf(item.name);
    if (match > -1 && match !== selected) {
      this.setStatus(true, "Name already saved, choose another." );
      return;
    }
    
    this.setStatus(false, "Saved." );
    
    if (selected > -1) {
      list[selected] = item;
      window.client.react.actions.setState({ selected: selected });
    } else {
      list.push(item);
      window.client.react.actions.setState({ selected: list.length-1 });
    }
    
    window.client.saveLocalStorage(list, listName);
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
    item[key] = e.target.checked;
    this.setState({ item });
  };
  
  changeAction = (action) => {
    const { item } = this.state;
    item.action = action;
    this.setState({ item });
  };

  onDelete = () => {
    const { list, listName, selected } = this.props;
    
    if (window.confirm("Do you really want to delete this action?") && selected > -1) {
      list.splice(selected, 1);
      this.setStatus(false, "Deleted." );
      window.client.react.actions.setState({ selected: -1 });
      window.client.saveLocalStorage(list, listName);
    }
  };
  
  render() {
    const { classes, list, selected, Form } = this.props;
    const { item, error, status } = this.state;
    const refs = this.refs;
    
    return (
      <div className={classes.frame}>
        <form onSubmit={this.onSubmit} className={classes.form}>
        
          <div className={classes.top}>
            <TextField ref={refs.name} label="Name" className={classes.flex} value={item.name} onChange={this.handleChange('name')} />
            <span>
              <ListItem dense>
                <ListItemText primary="MushCode" />
                <Switch ref={refs.javascript} color="default" checked={item.javascript} onChange={this.handleSwitch('javascript')} />
                <ListItemText primary="JavaScript" />
              </ListItem>
            </span>
          </div>
          
          <Form className={classes.top} refs={refs} item={item} handleNumber={this.handleNumber} handleChange={this.handleChange} handleSwitch={this.handleSwitch} />
          
          <AceEditor
            className={classes.flex}
            ref={refs.action}
            mode={item.javascript ? "javascript" : "mushcode"}
            width="100%"
            theme="tomorrow_night_bright"
            value={item.action}
            onChange={this.changeAction}
            wrapEnabled={true}
            highlightActiveLine={false}
            editorProps={{ $blockScrolling: Infinity }}
          />
          
          <div className={classes.bottom}>
            <Button onClick={this.onDelete} classes={{ label: classes.block }} disabled={selected === -1}>
              <DeleteIcon /> Delete
            </Button>
            <span className={classes.middle}>
              <Typography className={classes.align} color={error ? "error" : "default"}>
                {status}
              </Typography>
            </span>
            <Button onClick={this.onSubmit} classes={{ label: classes.block }}>
              <SaveIcon /> Save
            </Button>
            <Button classes={{ label: classes.block }}
              onClick={() => this.setState({
                item: Object.assign({}, list && selected > -1 ? list[selected] : this.template)
              })}
            >
              <UndoIcon /> Reset
            </Button>
          </div>
          
        </form>
      </div>
    );
  }
}

ActionForm.propTypes = {
  classes: PropTypes.object.isRequired,
  theme: PropTypes.object.isRequired,
  panel: PropTypes.object.isRequired,
  list: PropTypes.array.isRequired,
  listName: PropTypes.string.isRequired,
  selected: PropTypes.number.isRequired,
  Form: PropTypes.func.isRequired,
};

export default withStyles(styles, { withTheme: true })(ActionForm);

