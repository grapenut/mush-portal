
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
});


//////////////////////////////////////////////////////////////////////


class TriggerForm extends React.Component {
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
    const { classes, item, handleChange, handleSwitch } = this.props;
    
    return (
      <div className={classes.frame}>
        <TextField label="Matching pattern" fullWidth value={item.pattern} onChange={handleChange('pattern')} />
        <div className={classes.row}>
          <span className={classes.switchText}>
            <Typography>Wildcard</Typography>
            <Switch checked={item.regex} color="default" onChange={handleSwitch('regex')} />
            <Typography>RegExp</Typography>
          </span>
          <span className={classes.switchText}>
            <Typography>Suppress terminal output?</Typography>
            <Switch checked={item.suppress} onChange={handleSwitch('suppress')} />
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

