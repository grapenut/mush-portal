
import React from 'react';
import PropTypes from 'prop-types';
import { withStyles } from '@material-ui/core/styles';


//////////////////////////////////////////////////////////////////////


const styles = theme => ({
  frame: {
  },
});


//////////////////////////////////////////////////////////////////////


class Template extends React.Component {
  constructor(props) {
    super(props);
    this.state = {
    };
    this.client = props.client;
  }
  
  componentDidMount() {
    this.client.react.template = this;
  }

  render() {
    const { classes } = this.props;
    
    return (
      <div className={classes.frame}>
      </div>
    );
  }
}

Template.propTypes = {
  classes: PropTypes.object.isRequired,
  theme: PropTypes.object.isRequired,
  client: PropTypes.object.isRequired,
};

export default withStyles(styles, { withTheme: true })(Template);

