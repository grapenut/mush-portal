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

const styles = theme => ({
  frame: {
  },
});

class Login extends React.Component {
  constructor(props) {
    super(props);
    this.state = {
      open: false,
      msg: null,
      client: props.client,
    };
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
    
    var client = this.state.client;
    client.focus();
  };
  
  submitLogin = () => {
    var client = this.state.client;
    var username = document.getElementById('username').value;
    var password = document.getElementById('password').value;
    document.getElementById('password').value = '';
    
    var str = 'connect "' + username + '" ' + password
    client.sendText(str);
    
    this.closeLogin();
  };
  
  submitCreate = () => {
    var client = this.state.client;
    var username = document.getElementById('username').value;
    var password = document.getElementById('password').value;
    document.getElementById('password').value = '';
    
    var str = 'create "' + username + '" ' + password
    client.sendText(str);
    
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
    var client = this.state.client;
    client.react.login = this;
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
          <DialogTitle id="responsive-dialog-title">Connect</DialogTitle>
          <DialogContent>
            <DialogContentText>
              {msg}
              Connect to an existing character,
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
            <DialogContentText>
              or create a new character.
            </DialogContentText>
          </DialogContent>
          <DialogActions>
            <Button onClick={this.submitCreate} color="primary">
              Create
            </Button>
            <Button onClick={this.submitLogin} color="primary">
              Connect
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


