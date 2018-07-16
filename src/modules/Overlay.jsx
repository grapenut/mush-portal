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
import Typography from '@material-ui/core/Typography';
import withMobileDialog from '@material-ui/core/withMobileDialog';

import PersonIcon from '@material-ui/icons/Person';
import PersonOutlineIcon from '@material-ui/icons/PersonOutline';
import PersonAddIcon from '@material-ui/icons/PersonAdd';

const styles = theme => ({
  frame: {
  },
  left: {
    marginRight: "auto",
  },
});

class Login extends React.Component {
  constructor(props) {
    super(props);
    this.state = {
      open: false,
      msg: null,
    };
    this.client = props.client;
  }

  openLogin = (msg) => {
    this.setState({ open: true });
    
    if (msg) {
      this.setState({ msg: msg });
    } else {
      this.setState({ msg: null });
    }
    
    this.focusInput('username');
  };

  closeLogin = () => {
    this.setState({ open: false });
    this.client.focus();
  };
  
  submitLogin = () => {
    var username = document.getElementById('username').value;
    var password = document.getElementById('password').value;
    document.getElementById('password').value = '';
    
    var str = 'connect "' + username + '" ' + password
    this.client.sendText(str);
    
    this.closeLogin();
  };
  
  submitGuest = () => {
    this.client.sendText('connect guest');
    this.closeLogin();
  };
  
  submitCreate = () => {
    var username = document.getElementById('username').value;
    var password = document.getElementById('password').value;
    document.getElementById('password').value = '';
    
    var str = 'create "' + username + '" ' + password
    this.client.sendText(str);
    
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
    this.client.react.login = this;
  }

  render() {
    const { classes } = this.props;
    const { open, msg } = this.state;
    
    return (
      <div className={classes.frame}>
        <Dialog
          open={open}
          onClose={this.closeLogin}
          aria-labelledby="responsive-dialog-title"
        >
          <DialogTitle id="responsive-dialog-title">Character Login</DialogTitle>
          <DialogContent>
            <DialogContentText>
              <span dangerouslySetInnerHTML={{ __html: msg }} />
            </DialogContentText>
            <TextField
              margin="dense"
              id="username"
              label="Character Name"
              type="string"
              fullWidth
              onKeyPress={this.catchReturn}
            />
            <TextField
              margin="dense"
              id="password"
              label="Password"
              type="password"
              fullWidth
              onKeyPress={this.catchReturn}
            />
          </DialogContent>
          <DialogActions>
            <Button className={classes.left} onClick={this.submitCreate} color="primary" variant="contained">
              <PersonAddIcon />
              Register
            </Button>
            <Typography />
            <Button onClick={this.submitGuest} color="primary" variant="raised">
              <PersonOutlineIcon />
              Guest
            </Button>
            <Button onClick={this.submitLogin} color="primary" variant="extendedFab" aria-label="login">
              <PersonIcon />
              Login
            </Button>
          </DialogActions>
        </Dialog>
      </div>
    );
  }
}

Login.propTypes = {
  classes: PropTypes.object.isRequired,
  theme: PropTypes.object.isRequired,
  client: PropTypes.object.isRequired,
  fullScreen: PropTypes.bool.isRequired,
};

//export default withMobileDialog()(Login);
export default withMobileDialog()(withStyles(styles, { withTheme: true })(Login));


