
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
      feedlist: [],
    };
    this.client = props.client;
  }
  
  componentDidMount() {
    this.client.react.feedtab = this;
  }
  
  render() {
    const { classes } = this.props;
    
    return (
      <div className={classes.frame}>
        This is the main feed tab. It is a grid of FeedContent components. Those components can be pinned, tabbed, zoomed, or deleted.
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

