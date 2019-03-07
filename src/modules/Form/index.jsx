
import React from 'react';
import PropTypes from 'prop-types';
import { withStyles } from '@material-ui/core/styles';

import TextField from '@material-ui/core/TextField';

//////////////////////////////////////////////////////////////////////


const styles = theme => ({
  frame: {
    position: "absolute",
    height: "100%",
    width: "100%",
    display: "flex",
    "flex-flow": "row nowrap",
  },
});


//////////////////////////////////////////////////////////////////////


class Form extends React.Component {
  constructor(props) {
    super(props);
    this.state = {
    };
  }
  
  componentDidMount() {
  }
  
  componentWillUnmount() {
  }
  
  renderText(props) {
    return (
      <TextField {...props} />
    );
  }
  
  renderNumber(props) {
    return (
      <TextField type="number" {...props} />
    );
  }
  
  render() {
    const { classes } = this.props;

    return (
      <div className={classes.frame}>
      </div>
    );
  }
}

Form.propTypes = {
  classes: PropTypes.object.isRequired,
  theme: PropTypes.object.isRequired,
  schema: PropTypes.string.isRequired,
  onSubmit: PropTypes.func.isRequired,
};

export default withStyles(styles, { withTheme: true })(Form);

	