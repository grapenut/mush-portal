
import React from 'react';
import PropTypes from 'prop-types';
import { withStyles } from '@material-ui/core/styles';

import Typography from '@material-ui/core/Typography';
import TextField from '@material-ui/core/TextField';
import Switch from '@material-ui/core/Switch';


//////////////////////////////////////////////////////////////////////


const styles = theme => ({
  frame: {
    position: "relative",
    width: "100%",
  },
  row: {
    width: "100%",
    display: "flex",
    flexFlow: "row wrap",
    justifyContent: "space-between",
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


class TriggerForm extends React.Component {
  constructor(props) {
    super(props);
    
    this.state = {
    };
  }
  
  static save() {
    window.client.saveTriggers();
  }
  
  componentDidMount() {
  }
  
  componentWillUnmount() {
  }

  render() {
    const { classes, item, handleChange, handleSwitch } = this.props;
    
    return (
      <div className={classes.frame}>
        <TextField label="Matching pattern" fullWidth value={item.pattern} onChange={handleChange('pattern')} inputProps={{ classes: { input: classes.inputBase } }} />
        <div className={classes.row}>
          <span className={classes.switchText}>
            <Typography>Wildcard</Typography>
            <Switch checked={item.regex} color="default" onChange={handleSwitch('regex')} classes={{ switchBase: classes.switchBase }} />
            <Typography>RegExp</Typography>
          </span>
          <span className={classes.switchText}>
            <Typography>Suppress terminal output?</Typography>
            <Switch checked={item.suppress} onChange={handleSwitch('suppress')} classes={{ switchBase: classes.switchBase }} />
          </span>
        </div>
      </div>
    );
  }
}

TriggerForm.propTypes = {
  classes: PropTypes.object.isRequired,
  theme: PropTypes.object.isRequired,
  item: PropTypes.object.isRequired,
  handleChange: PropTypes.func.isRequired,
  handleNumber: PropTypes.func.isRequired,
  handleSwitch: PropTypes.func.isRequired,
};

export default withStyles(styles, { withTheme: true })(TriggerForm);

