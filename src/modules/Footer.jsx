
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


class Footer extends React.Component {
  constructor(props) {
    super(props);
    this.state = {
      status: "Status bar",
      client: props.client,
    };
  }
  
  setStatus(s) {
    this.setState({ status: s });
  }
  
  componentDidMount() {
    var client = this.state.client;
    client.react.statusbar = this;
  }
  
  render() {
    const { classes } = this.props;
    const { status } = this.state;
    
    return (
      <div className={classes.frame}>
        <Typography align="right" variant="button" color="inherit" noWrap>
          {status}
        </Typography>
      </div>
    );
  }
}

Footer.propTypes = {
  classes: PropTypes.object.isRequired,
  theme: PropTypes.object.isRequired,
  client: PropTypes.object.isRequired,
};

export default withStyles(styles, { withTheme: true })(Footer);

