import React from 'react';
import PropTypes from 'prop-types';
import { withStyles } from '@material-ui/core/styles';

//import Paper from '@material-ui/core/Paper';


const styles = theme => ({
  frame: {
    display: "flex",
    height: "100%",
    backgroundColor: theme.palette.background.paper,
    "flex-flow": "column nowrap",
  },
  paper: {
    flex: 1,
  },
});

class Sidebar extends React.Component {
  constructor(props) {
    super(props);
    this.state = { };
  }
  
  componentDidMount() {
    window.client.react.sidebar = this;
  }
  
  componentWillUnMount() {
    window.client.react.sidebar = null;
  }
  
  render() {
    const { classes } = this.props;

    return (
      <div className={classes.frame}>
        Some sidebar content.
      </div>
    );
  }
}

Sidebar.propTypes = {
  classes: PropTypes.object.isRequired,
  theme: PropTypes.object.isRequired,
};

export default withStyles(styles, { withTheme: true })(Sidebar);

