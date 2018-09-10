import React from 'react';
import PropTypes from 'prop-types';
import { withStyles } from '@material-ui/core/styles';

const styles = theme => ({
  frame: {
  },
});

class Chargen extends React.Component {
  constructor(props) {
    super(props);
    this.state = { };
  }
  
  componentDidMount() {
  }
  
  render() {
    const { classes } = this.props;
    return (
      <div className={classes.frame}>Character Builder?</div>
    );
  }
}

Chargen.propTypes = {
  classes: PropTypes.object.isRequired,
};

export default withStyles(styles, { withTheme: true })(Chargen);

