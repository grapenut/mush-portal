import React from 'react';
import PropTypes from 'prop-types';
import { withStyles } from '@material-ui/core/styles';

import Drawer from '@material-ui/core/Drawer';

const styles = theme => ({
  frame: {
    display: "flex",
    "flex-flow": "column nowrap",
  },
  drawer: {
  },
});

class Sidebar extends React.Component {
  constructor(props) {
    super(props);
    this.state = { };
  }
  
  componentDidMount() {
  }
  
  render() {
    const { classes } = this.props;
    const { sidebarOpen, sidebarAnchor } = window.client.settings;
    return (
      <div className={classes.frame}>
        <Drawer variant="persistent" anchor={sidebarAnchor} open={sidebarOpen} className={classes.drawer}>
          Some sidebar content.
        </Drawer>
      </div>
    );
  }
}

Sidebar.propTypes = {
  classes: PropTypes.object.isRequired,
  theme: PropTypes.object.isRequired,
};

export default withStyles(styles, { withTheme: true })(Sidebar);

