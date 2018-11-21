import React from 'react';
import PropTypes from 'prop-types';
import { withStyles } from '@material-ui/core/styles';

import Button from '@material-ui/core/Button';
import TextField from '@material-ui/core/TextField';
import Dialog from '@material-ui/core/Dialog';
import DialogActions from '@material-ui/core/DialogActions';
import DialogContent from '@material-ui/core/DialogContent';
import DialogContentText from '@material-ui/core/DialogContentText';
import DialogTitle from '@material-ui/core/DialogTitle';
import withMobileDialog from '@material-ui/core/withMobileDialog';
import IconButton from '@material-ui/core/IconButton';

import PersonIcon from '@material-ui/icons/Person';
import PersonOutlineIcon from '@material-ui/icons/PersonOutline';
import PersonAddIcon from '@material-ui/icons/PersonAdd';
import SettingsIcon from '@material-ui/icons/Settings';

const styles = theme => ({
  frame: {
    position: "absolute",
    top: 0,
    bottom: 0,
    right: 0,
    left: 0,
  },
  right: {
    position: "absolute",
    right: 0,
  },
  left: {
    marginRight: "auto",
  },
  text: {
    "font-size": "16pt",
  },
  title: {
  },
  block: {
    display: "flex",
    "flex-direction": "column",
  },
});

class Login extends React.Component {
  constructor(props) {
    super(props);
    this.state = {
      open: false,
      msg: null,
    };
  }

  openLogin = (msg) => {
    this.setState({ open: true });
    this.setState({ msg: msg });
    this.focusInput('username');
  };

  closeLogin = () => {
    this.setState({ open: false });
    window.client.focus();
  };
  
  submitLogin = () => {
    var username = document.getElementById('username').value;
    var password = document.getElementById('password').value;
    document.getElementById('password').value = '';
    
    var str = 'connect "' + username + '" ' + password
    window.client.sendText(str);
    
    this.closeLogin();
  };
  
  submitGuest = () => {
    window.client.sendText('connect guest');
    this.closeLogin();
  };
  
  submitCreate = () => {
    var username = document.getElementById('username').value;
    var password = document.getElementById('password').value;
    document.getElementById('password').value = '';
    
    var str = 'create "' + username + '" ' + password
    window.client.sendText(str);
    
    this.closeLogin();
  };
  
  catchReturn = (e) => {
    if (e.key === 'Enter') {
      // Do code here
      this.submitLogin();
      e.preventDefault();
    }
  };
  
  focusInput(id) {
    var input = document.getElementById(id);
    input && input.focus();
  }

  componentDidMount() {
    window.client.react.login = this;
  }
  
  render() {
    const { classes, fullScreen } = this.props;
    const { open, msg } = this.state;
    
    return (
      <Dialog
        className={classes.frame}
        open={open}
        fullScreen={fullScreen}
        onEscapeKeyDown={() => window.client.react.taskbar.openDrawer()}
        onClose={this.closeLogin}
        aria-labelledby="responsive-dialog-title"
        disableBackdropClick
        disableEscapeKeyDown
      >
        <DialogTitle className={classes.title} id="responsive-dialog-title">
          Character Login
          <IconButton className={classes.right} onClick={() => window.client.react.taskbar.openDrawer()}>
            <SettingsIcon />
          </IconButton>
        </DialogTitle>
        <DialogContent>
          <DialogContentText>
            <span dangerouslySetInnerHTML={{ __html: msg }} />
          </DialogContentText>
          <TextField
            className={classes.text}
            margin="dense"
            id="username"
            label="Character Name"
            type="string"
            fullWidth
            onKeyPress={this.catchReturn}
          />
          <TextField
            className={classes.text}
            margin="dense"
            id="password"
            label="Password"
            type="password"
            fullWidth
            onKeyPress={this.catchReturn}
          />
        </DialogContent>
        <DialogActions>
          <Button className={classes.left} classes={{ label: classes.block }} onClick={this.submitCreate} color="primary" variant="extendedFab">
            <PersonAddIcon />
            Register
          </Button>
          <Button classes={{ label: classes.block }} onClick={this.submitGuest} color="primary" variant="extendedFab">
            <PersonOutlineIcon />
            Guest
          </Button>
          <Button classes={{ label: classes.block }} onClick={this.submitLogin} color="primary" variant="extendedFab" aria-label="login">
            <PersonIcon />
            Login
          </Button>
        </DialogActions>
      </Dialog>
    );
  }
}

Login.propTypes = {
  classes: PropTypes.object.isRequired,
  theme: PropTypes.object.isRequired,
  fullScreen: PropTypes.bool.isRequired,
};

export default withMobileDialog()(withStyles(styles, { withTheme: true })(Login));


