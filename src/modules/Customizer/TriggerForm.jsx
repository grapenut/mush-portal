
import React from 'react';
import PropTypes from 'prop-types';
import { withStyles } from '@material-ui/core/styles';


import TextField from '@material-ui/core/TextField';
import Switch from '@material-ui/core/Switch';
import ListItem from '@material-ui/core/ListItem';
import ListItemText from '@material-ui/core/ListItemText';


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
          <span>
            <ListItem dense>
              <ListItemText primary="Wildcard" />
              <Switch color="default" checked={item.regex} onChange={handleSwitch('regex')} />
              <ListItemText primary="RegExp" />
            </ListItem>
          </span>
          <span>
            <ListItem dense>
              <ListItemText primary="Suppress terminal output?" />
              <Switch checked={item.suppress} onChange={handleSwitch('suppress')} />
            </ListItem>
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

