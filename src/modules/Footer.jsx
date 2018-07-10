
import React from 'react';
import PropTypes from 'prop-types';
import classNames from 'classnames';
import Typography from '@material-ui/core/Typography';
import { withStyles } from '@material-ui/core/styles';


//////////////////////////////////////////////////////////////////////


const styles = theme => ({
  frame: {
    background: theme.palette.primary.main,
    margin: 0,
    border: "none",
    outline: "none",
    "text-align": "right",
    "vertical-align": "middle",
    padding: "0.25em",
  },
});


//////////////////////////////////////////////////////////////////////


class Footer extends React.Component {
  state = {
  };
  
  render() {
    const { classes, theme } = this.props;
    
    return (
      <div className={classes.frame}>
        <Typography align="right" variant="button" color="" noWrap>
          Status bar
        </Typography>
      </div>
    );
  }

}

export default withStyles(styles, { withTheme: true })(Footer);

