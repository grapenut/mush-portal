import React from 'react';
import PropTypes from 'prop-types';
import { withStyles } from '@material-ui/core/styles';

import TaskBar from './TaskBar';
import Terminal from './Terminal';
import Input from './Input';
import StatusBar from './StatusBar';
import Login from './Login';

const styles = theme => ({
  frame: {
    width: "100%",
    height: "100%",
    background: "white",
    position: "absolute",
    top: 0,
    left: 0,
    display: "flex",
    "flex-flow": "column nowrap",
  },
  top: {
    top: 0,
    left: 0,
    width: "100%",
  },
  middle: {
    flex: 1,
    left: 0,
    width: "100%",
  },
  bottom: {
    bottom: 0,
    left: 0,
    width: "100%",
  },
});

class Portal extends React.Component {
  constructor(props) {
    super(props);
    this.state = { };
  }
  
  componentDidMount() {
    window.scrollTo(0,1);
  }
  
  render() {
    const { classes } = this.props;
    return (
      <div className={classes.frame}>
        <div className={classes.top}>
          <TaskBar title="MUSH Portal" />
        </div>
        <div className={classes.middle}>
          <Terminal />
        </div>
        <div className={classes.bottom}>
          <Input />
          <StatusBar />
        </div>
        <Login />
      </div>
    );
  }
}

Portal.propTypes = {
  classes: PropTypes.object.isRequired,
  theme: PropTypes.object.isRequired,
};

export default withStyles(styles, { withTheme: true })(Portal);

