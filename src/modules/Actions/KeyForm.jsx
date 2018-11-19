
import React from 'react';
import PropTypes from 'prop-types';
import { withStyles } from '@material-ui/core/styles';


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
    const { classes, item, refs, handleChange, handleSwitch } = this.props;
    
    return (
      <div className={classes.frame}>
        <span className={classes.flex}>
          <TextField ref={refs.keycode} label="Key code" value={item.keycode ? item.keycode : ""} onChange={handleChange('keycode')} />
        </span>
        <span>
          <ListItem dense>
            <ListItemText primary="Ctrl" />
            <Checkbox ref={refs.ctrl} checked={item.ctrl} onChange={handleSwitch('ctrl')} />
          </ListItem>
        </span>
        <span>
          <ListItem dense>
            <ListItemText primary="Alt" />
            <Checkbox ref={refs.alt} checked={item.alt} onChange={handleSwitch('alt')} />
          </ListItem>
        </span>
        <span>
          <ListItem dense>
            <ListItemText primary="Shift" />
            <Checkbox ref={refs.Shift} checked={item.Shift} onChange={handleSwitch('Shift')} />
          </ListItem>
        </span>
      </div>
    );
  }
}

KeyForm.propTypes = {
  classes: PropTypes.object.isRequired,
  theme: PropTypes.object.isRequired,
  item: PropTypes.object.isRequired,
  refs: PropTypes.object.isRequired,
  handleChange: PropTypes.func.isRequired,
  handleNumber: PropTypes.func.isRequired,
  handleSwitch: PropTypes.func.isRequired,
};

export default withStyles(styles, { withTheme: true })(KeyForm);

