import React from 'react';
import PropTypes from 'prop-types';
import { withStyles } from '@material-ui/core/styles';

const styles = theme => ({
  frame: {
  },
});

class CharGen extends React.Component {
  constructor(props) {
    super(props);
    this.state = { };
    this.client = props.client;
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

CharGen.propTypes = {
  classes: PropTypes.object.isRequired,
  client: PropTypes.object.isRequired,
};

export default withStyles(styles, { withTheme: true })(CharGen);

