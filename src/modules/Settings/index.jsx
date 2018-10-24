
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
  
  componentDidMount() {
  }
  
  componentWillUnmount() {
    window.client.saveSettings();
  }

  render() {
    const { classes, closeDrawer } = this.props;
    const { debugEvents } = this.state;
    
    return (
      <div className={classes.frame}>
        <div className={classes.content} tabIndex={0} role="button">
          <FormControl component="fieldset">
            <FormLabel component="legend">Debugging</FormLabel>
            <FormGroup>
              <FormControlLabel
                control={
                  <Switch
                    checked={debugEvents}
                    onChange={this.handleSwitch('debugEvents')}
                    value="debugEvents"
                  />
                }
                label="Debug Events"
              />
            </FormGroup>
            <FormHelperText>See the developer console for more.</FormHelperText>
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

