
import React from 'react';
import PropTypes from 'prop-types';
import { withStyles } from '@material-ui/core/styles';

import Typography from '@material-ui/core/Typography';
import TextField from '@material-ui/core/TextField';
import Checkbox from '@material-ui/core/Checkbox';
import ListItem from '@material-ui/core/ListItem';
import ListItemText from '@material-ui/core/ListItemText';


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
});


//////////////////////////////////////////////////////////////////////


class KeyForm extends React.Component {
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
        <span className={classes.flex}>
          <TextField label="Key code" value={item.keycode ? item.keycode : ""} onChange={handleChange('keycode')} />
        </span>
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

