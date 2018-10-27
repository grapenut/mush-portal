
import React from 'react';
import PropTypes from 'prop-types';
import { withStyles } from '@material-ui/core/styles';

import Button from '@material-ui/core/Button';
import FormLabel from '@material-ui/core/FormLabel';
import FormControl from '@material-ui/core/FormControl';
import FormGroup from '@material-ui/core/FormGroup';
import FormControlLabel from '@material-ui/core/FormControlLabel';
import FormHelperText from '@material-ui/core/FormHelperText';
import Switch from '@material-ui/core/Switch';
import TextField from '@material-ui/core/TextField';


//////////////////////////////////////////////////////////////////////


const styles = theme => ({
  frame: {
    display: "flex",
  },
  content: {
    flex: 1,
    display: 'flex',
    alignItems: 'center',
    justifyContent: 'flex-end',
    padding: '0 8px',
    ...theme.mixins.toolbar,
  },
  close: {
  },
  flex: {
    flex: 1,
  },
});


//////////////////////////////////////////////////////////////////////


class Settings extends React.Component {
  constructor(props) {
    super(props);
    this.state = { };
    
    Object.keys(window.client.settings).forEach(key => {
      this.state[key] = window.client.settings[key];
    });
  }
  
  handleSwitch = name => event => {
    window.client.changeSetting(name, event.target.checked);
    this.setState({ [name]: window.client.settings[name] });
    window.client.saveSettings();
  };
  
  handleValue = name => event => {
    window.client.changeSetting(name, event.target.value);
    this.setState({ [name]: window.client.settings[name] });
    window.client.saveSettings();
  };
  
  componentDidMount() {
  }
  
  componentWillUnmount() {
  }

  render() {
    const { classes, closeDrawer } = this.props;
    const { debugEvents, decompileEditor, decompileKey } = this.state;
    
    return (
      <div className={classes.frame}>
        <div className={classes.content} tabIndex={0} role="button">
          <FormControl component="fieldset">
            <FormLabel component="legend">Debugging</FormLabel>
            <FormGroup>
              <FormControlLabel
                control={<Switch checked={debugEvents} value="debugEvents" onChange={this.handleSwitch('debugEvents')} />}
                label="Debug Events"
              />
            </FormGroup>
            <FormHelperText>See the developer console for more.</FormHelperText>
          </FormControl>

          <FormControl component="fieldset">
            <FormLabel component="legend">Command Upload Editor</FormLabel>
            <FormGroup>
              <FormControlLabel
                control={<Switch checked={decompileEditor} value="decompileEditor" onChange={this.handleSwitch('decompileEditor')} />}
                label="Send @dec/tf output to editor."
              />
              <FormControlLabel
                control={<TextField label="TFPREFIX" value={decompileKey} onChange={this.handleValue('decompileKey')} />}
                label="The TFPREFIX used by @dec/tf."
              />
            </FormGroup>
            <FormHelperText>Controls the command upload editor.</FormHelperText>
          </FormControl>

        </div>
        <div className={classes.flex}></div>
        <Button className={classes.close} onClick={closeDrawer}>
          Close
        </Button>
      </div>
    );
  }
}

Settings.propTypes = {
  classes: PropTypes.object.isRequired,
  theme: PropTypes.object.isRequired,
  closeDrawer: PropTypes.func.isRequired,
};

export default withStyles(styles, { withTheme: true })(Settings);

