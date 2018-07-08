
import React from 'react';
import PropTypes from 'prop-types';
import classNames from 'classnames';
import { withStyles } from '@material-ui/core/styles';


//////////////////////////////////////////////////////////////////////


const styles = theme => ({
  frame: {
    flexGrow: 1,
  },
  hide: {
    display: 'none',
  },
});


//////////////////////////////////////////////////////////////////////


class Input extends React.Component {
  state = {
  };
  
  render() {
    const { classes, theme } = this.props;
    
    return (
      <div className={classes.frame}>
      </div>
    );
  }

}

export default withStyles(styles, { withTheme: true })(Input);

