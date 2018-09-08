
import React from 'react';
import PropTypes from 'prop-types';
import { withStyles } from '@material-ui/core/styles';


//////////////////////////////////////////////////////////////////////


const styles = theme => ({
  frame: {
    flex: 1,
  },
});


//////////////////////////////////////////////////////////////////////

class FeedContent extends React.Component {
  constructor(props) {
    super(props);

    this.state = {
      content: null,
    };

    this.client = props.client;
  }
  
  render() {
    const { classes, children } = this.props;
    
    return (
      <div className={classes.frame}>
        {children}
      </div>
    );
  }
}

FeedContent.propTypes = {
  classes: PropTypes.object.isRequired,
  theme: PropTypes.object.isRequired,
  client: PropTypes.object.isRequired,
};

export default withStyles(styles, { withTheme: true })(FeedContent);

