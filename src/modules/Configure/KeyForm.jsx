
import React from 'react';
import PropTypes from 'prop-types';
import { withStyles } from '@material-ui/core/styles';

import Typography from '@material-ui/core/Typography';
import Checkbox from '@material-ui/core/Checkbox';
import Switch from '@material-ui/core/Switch';
import Dialog from '@material-ui/core/Dialog';
import DialogTitle from '@material-ui/core/DialogTitle';
import Button from '@material-ui/core/Button';

import CloseIcon from '@material-ui/icons/Close';


//////////////////////////////////////////////////////////////////////


const styles = theme => ({
  frame: {
    width: "100%",
    display: "flex",
    flexFlow: "row wrap",
  },
  row: {
    width: "100%",
    display: "flex",
    flexFlow: "row wrap",
    justifyContent: "space-between",
  },
  flex: {
    flex: 1,
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
  keyform: {
    display: "flex",
    flexFlow: "row wrap",
  },
  button: {
    flex: 1,
    display: "flex",
    justifyContent: "center",
    alignItems: "center",
    minWidth: "10em",
    padding: theme.spacing.unit,
  },
});


//////////////////////////////////////////////////////////////////////


class KeyForm extends React.Component {
  constructor(props) {
    super(props);
    
    this.state = {
      capturing: false,
    };
    
    this.keyform = React.createRef();
  }
  
  static save() {
    window.client.saveKeys();
  }
  
  showKeyForm = () => {
    this.setState({ capturing: true });
    document.addEventListener("keyup", this.captureKey, true);
  };
  
  hideKeyForm = () => {
    this.setState({ capturing: false });
    document.removeEventListener("keyup", this.captureKey);
  };
  
  captureKey = (event) => {
    var key = { code: (event.keyCode ? event.keyCode : event.which),
                ctrl: event.ctrlKey,
                shift: event.shiftKey,
                alt: event.altKey };
    
    event.preventDefault();

    if (this.state.capturing) {
      this.props.item.code = key.code;
      this.props.item.ctrl = key.ctrl;
      this.props.item.alt = key.alt;
      this.props.item.shift = key.shift;
    }
    
    this.hideKeyForm();
  };
  
  componentDidMount() {
  }
  
  componentWillUnmount() {
  }
  
  getKeyName = () => {
    const { code } = this.props.item;    

    if (code === 0) {
      return "Capture Key";
    }
    
    var meta = "Meta";
    var platform = window.navigator.platform,
        macosPlatforms = ['Macintosh', 'MacIntel', 'MacPPC', 'Mac68K', 'iPhone', 'iPad', 'iPod'],
        windowsPlatforms = ['Win32', 'Win64', 'Windows', 'WinCE'];

    if (macosPlatforms.indexOf(platform) !== -1) {
      meta = "Command";
    } else if (windowsPlatforms.indexOf(platform) !== -1) {
      meta = 'Windows';
    }

    const keyCodeToChar = {8:"Backspace",9:"Tab",13:"Enter",16:"Shift",17:"Ctrl",18:"Alt",19:"Pause/Break",20:"Caps Lock",27:"Esc",32:"Space",33:"Page Up",34:"Page Down",35:"End",36:"Home",37:"Left",38:"Up",39:"Right",40:"Down",45:"Insert",46:"Delete",48:"0",49:"1",50:"2",51:"3",52:"4",53:"5",54:"6",55:"7",56:"8",57:"9",65:"A",66:"B",67:"C",68:"D",69:"E",70:"F",71:"G",72:"H",73:"I",74:"J",75:"K",76:"L",77:"M",78:"N",79:"O",80:"P",81:"Q",82:"R",83:"S",84:"T",85:"U",86:"V",87:"W",88:"X",89:"Y",90:"Z",91:meta,93:"Right Click",96:"Numpad 0",97:"Numpad 1",98:"Numpad 2",99:"Numpad 3",100:"Numpad 4",101:"Numpad 5",102:"Numpad 6",103:"Numpad 7",104:"Numpad 8",105:"Numpad 9",106:"Numpad *",107:"Numpad +",109:"Numpad -",110:"Numpad .",111:"Numpad /",112:"F1",113:"F2",114:"F3",115:"F4",116:"F5",117:"F6",118:"F7",119:"F8",120:"F9",121:"F10",122:"F11",123:"F12",144:"Num Lock",145:"Scroll Lock",182:"My Computer",183:"My Calculator",186:";",187:"=",188:",",189:"-",190:".",191:"/",192:"`",219:"[",220:"\\",221:"]",222:"'"};
    //const keyCharToCode = {"Backspace":8,"Tab":9,"Enter":13,"Shift":16,"Ctrl":17,"Alt":18,"Pause/Break":19,"Caps Lock":20,"Esc":27,"Space":32,"Page Up":33,"Page Down":34,"End":35,"Home":36,"Left":37,"Up":38,"Right":39,"Down":40,"Insert":45,"Delete":46,"0":48,"1":49,"2":50,"3":51,"4":52,"5":53,"6":54,"7":55,"8":56,"9":57,"A":65,"B":66,"C":67,"D":68,"E":69,"F":70,"G":71,"H":72,"I":73,"J":74,"K":75,"L":76,"M":77,"N":78,"O":79,"P":80,"Q":81,"R":82,"S":83,"T":84,"U":85,"V":86,"W":87,"X":88,"Y":89,"Z":90,meta:91,"Right Click":93,"Numpad 0":96,"Numpad 1":97,"Numpad 2":98,"Numpad 3":99,"Numpad 4":100,"Numpad 5":101,"Numpad 6":102,"Numpad 7":103,"Numpad 8":104,"Numpad 9":105,"Numpad *":106,"Numpad +":107,"Numpad -":109,"Numpad .":110,"Numpad /":111,"F1":112,"F2":113,"F3":114,"F4":115,"F5":116,"F6":117,"F7":118,"F8":119,"F9":120,"F10":121,"F11":122,"F12":123,"Num Lock":144,"Scroll Lock":145,"My Computer":182,"My Calculator":183,";":186,"=":187,",":188,"-":189,".":190,"/":191,"`":192,"[":219,"\\":220,"]":221,"'":222};
    
    if (keyCodeToChar.hasOwnProperty(code)) {
      return keyCodeToChar[code] + " (code " + code + ")";
    }
    
    return code;
  };

  render() {
    const { classes, item, handleSwitch } = this.props;
    const { capturing } = this.state;
    
    const keyName = this.getKeyName();

    return (
      <div className={classes.frame}>
        <span className={classes.button}>
          <Button className={classes.flex} variant="contained" onClick={this.showKeyForm} color="primary">
            {keyName}
          </Button>
        </span>
        <div className={classes.row}>
          <span className={classes.switchText}>
            <Typography>Ctrl</Typography>
            <Checkbox checked={item.ctrl} onChange={handleSwitch('ctrl')} />
          </span>
          <span className={classes.switchText}>
            <Typography>Alt</Typography>
            <Checkbox checked={item.alt} onChange={handleSwitch('alt')} />
          </span>
          <span className={classes.switchText}>
            <Typography>Shift</Typography>
            <Checkbox checked={item.shift} onChange={handleSwitch('shift')} />
          </span>
        </div>
        <div className={classes.row}>
          <span className={classes.switchText}>
            <Typography>Press</Typography>
            <Switch checked={item.release} color="default" onChange={handleSwitch('release')} classes={{ switchBase: classes.switchBase }} />
            <Typography>Release</Typography>
          </span>
          <span className={classes.switchText}>
            <Typography>Prevent default event?</Typography>
            <Switch checked={item.prevent} onChange={handleSwitch('prevent')} classes={{ switchBase: classes.switchBase }} />
          </span>
        </div>
        <Dialog ref={this.keyform} open={capturing} className={classes.keyform} disableEscapeKeyDown onClose={this.hideKeyForm} aria-labelledby="keyform.title">
          <DialogTitle id="keyform.title">Press key combination to capture.</DialogTitle>
          <Button className={classes.flex} onClick={this.hideKeyForm}>
            <CloseIcon />
          </Button>
        </Dialog>
      </div>
    );
  }
}

KeyForm.propTypes = {
  classes: PropTypes.object.isRequired,
  theme: PropTypes.object.isRequired,
  item: PropTypes.object.isRequired,
  handleChange: PropTypes.func.isRequired,
  handleNumber: PropTypes.func.isRequired,
  handleSwitch: PropTypes.func.isRequired,
};

export default withStyles(styles, { withTheme: true })(KeyForm);

