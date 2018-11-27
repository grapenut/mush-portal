
import React from 'react';
import PropTypes from 'prop-types';
import { withStyles } from '@material-ui/core/styles';

import Typography from '@material-ui/core/Typography';
import TextField from '@material-ui/core/TextField';
import Switch from '@material-ui/core/Switch';


//////////////////////////////////////////////////////////////////////


const styles = theme => ({
  frame: {
    display: "flex",
    flexFlow: "row nowrap",
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
});


//////////////////////////////////////////////////////////////////////


class TimerForm extends React.Component {
  constructor(props) {
    super(props);
    
    this.state = {
    };
  }
  
  componentDidMount() {
  }
  
  componentWillUnmount() {
  }

  render() {
    const { classes, item, handleNumber, handleSwitch } = this.props;
    
    return (
      <div className={classes.frame}>
        <TextField type="number" label="Delay seconds" className={classes.flex} value={String(item.delay)} onChange={handleNumber('delay')} inputProps={{ classes: { input: classes.inputBase } }} />
        <span className={classes.switchText}>
          <Typography>Repeat this timer?</Typography>
          <Switch checked={item.repeat} onChange={handleSwitch('repeat')} classes={{ switchBase: classes.switchBase }} />
        </span>
        <TextField type="number" disabled={!item.repeat} label="Number of times" className={classes.flex} value={String(item.times)} onChange={handleNumber('times')} inputProps={{ classes: { input: classes.inputBase } }} />
      </div>
    );
  }
}

TimerForm.propTypes = {
  classes: PropTypes.object.isRequired,
  theme: PropTypes.object.isRequired,
  item: PropTypes.object.isRequired,
  handleChange: PropTypes.func.isRequired,
  handleNumber: PropTypes.func.isRequired,
  handleSwitch: PropTypes.func.isRequired,
};

export default withStyles(styles, { withTheme: true })(TimerForm);

