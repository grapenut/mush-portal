
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
    display: "flex",
    flexFlow: "row nowrap",
  },
  flex: {
    flex: 1,
  },
});


//////////////////////////////////////////////////////////////////////


class MacroForm extends React.Component {
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
        <TextField label="Matching pattern" className={classes.flex} value={item.pattern} onChange={handleChange('pattern')} />
        <span>
          <ListItem dense>
            <ListItemText primary="Wildcard" />
            <Switch color="default" checked={item.regex} onChange={handleSwitch('regex')} />
            <ListItemText primary="RegExp" />
          </ListItem>
        </span>
      </div>
    );
  }
}

MacroForm.propTypes = {
  classes: PropTypes.object.isRequired,
  theme: PropTypes.object.isRequired,
  item: PropTypes.object.isRequired,
  handleChange: PropTypes.func.isRequired,
  handleNumber: PropTypes.func.isRequired,
  handleSwitch: PropTypes.func.isRequired,
};

export default withStyles(styles, { withTheme: true })(MacroForm);

