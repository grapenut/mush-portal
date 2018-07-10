
import React from 'react';
import PropTypes from 'prop-types';
import classNames from 'classnames';
import { withStyles } from '@material-ui/core/styles';


//////////////////////////////////////////////////////////////////////


const styles = theme => ({
  frame: {
  },
});


//////////////////////////////////////////////////////////////////////

class FeedTab extends React.Component {
  render() {
    const {classes, theme, children } = this.props;
    
    return (
      <div className={classes.frame}>
        {children}
      </div>
    );
  }
}

export default withStyles(styles, { withTheme: true })(FeedTab);

