
import React from 'react';
import PropTypes from 'prop-types';
import { withStyles } from '@material-ui/core/styles';


//////////////////////////////////////////////////////////////////////


const styles = theme => ({
  frame: {
  },
});


//////////////////////////////////////////////////////////////////////

class FeedTab extends React.Component {
  constructor(props) {
    super(props);
    this.state = {
      client: props.client,
    };
  }
  
  componentDidMount() {
    // add tab to tab list?
  }
  
  render() {
    const {classes, theme, children, client } = this.props;
    
    return (
      <div className={classes.frame}>
        {children}
      </div>
    );
  }
}

FeedTab.propTypes = {
  classes: PropTypes.object.isRequired,
  theme: PropTypes.object.isRequired,
  client: PropTypes.object.isRequired,
};

export default withStyles(styles, { withTheme: true })(FeedTab);

