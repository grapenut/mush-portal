
import React from 'react';
import PropTypes from 'prop-types';
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


class Statusbar extends React.Component {
  constructor(props) {
    super(props);
    this.state = {
      status: "",
    };
  }
  
  setStatus(status) {
    this.setState({ status });
  }
  
  componentDidMount() {
    window.client.react.statusbar = this;
  }
  
  componentWillUnmount() {
    window.client.react.statusbar = null;
  }
  
  render() {
    const { classes } = this.props;
    const { status } = this.state;
    const { mobileHideStatusbar } = window.client.settings;
    
    return (
      <div className={classes.frame} onClick={() => window.client.focus()}>
        {!mobileHideStatusbar && (
          <Typography
            align="right"
            color="textPrimary"
            noWrap
          >
            {status}
          </Typography>
        )}
      </div>
    );
  }
}

Statusbar.propTypes = {
  classes: PropTypes.object.isRequired,
  theme: PropTypes.object.isRequired,
};

export default withStyles(styles, { withTheme: true })(Statusbar);

