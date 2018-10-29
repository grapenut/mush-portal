import React from 'react';
import PropTypes from 'prop-types';
import { withStyles } from '@material-ui/core/styles';

import IconButton from '@material-ui/core/IconButton';

import RemoveRedEyeIcon from '@material-ui/icons/RemoveRedEye';
import ArrowForwardIcon from '@material-ui/icons/ArrowForward';
import ArrowBackIcon from '@material-ui/icons/ArrowBack';
import ArrowUpwardIcon from '@material-ui/icons/ArrowUpward';
import ArrowDownwardIcon from '@material-ui/icons/ArrowDownward';


const styles = theme => ({
  frame: {
  },
  north: {
    transformOrigin: '50% 50%',
  },
  south: {
    transformOrigin: '50% 50%',
    transform: 'rotate(180deg)',
  },
  east: {
    transformOrigin: '50% 50%',
    transform: 'rotate(90deg)',
  },
  west: {
    transformOrigin: '50% 50%',
    transform: 'rotate(270deg)',
  },
  northwest: {
    transformOrigin: '50% 50%',
    transform: 'rotate(315deg)',
  },
  southwest: {
    transformOrigin: '50% 50%',
    transform: 'rotate(225deg)',
  },
  northeast: {
    transformOrigin: '50% 50%',
    transform: 'rotate(45deg)',
  },
  southeast: {
    transformOrigin: '50% 50%',
    transform: 'rotate(135deg)',
  },
});

const SVG = {
  NORTH: (<ArrowUpwardIcon />),
  SOUTH: (<ArrowDownwardIcon />),
  WEST: (<ArrowBackIcon />),
  EAST: (<ArrowForwardIcon />),
};

class NavWidget extends React.Component {
  constructor(props) {
    super(props);
    this.state = { };
  }
  
  updateExits(exits) {
    this.setState({ exits });
  }
  
  componentDidMount() {
  }
  
  componentWillUnMount() {
  }

  go = exit => event => {
    if (exit && exit.length > 0) {
      window.client.sendCommand("go "+exit);
    }
  };
  
  action = event => {
    window.client.sendCommand("look");
    window.client.sendAPI("listcontents");
  };
  
  buildExit = exit => {
    const { exits } = this.props;
    var uc = exit.toUpperCase();
    
    return (
      <IconButton onClick={this.go(exit)} disabled={!exits.includes(exit)}>
        {SVG[uc]}
      </IconButton>
    );    
  };
  
  render() {
    const { classes } = this.props;
    
    return (
      <div className={classes.frame}>
        {this.buildExit("Northwest")}
        {this.buildExit("North")}
        {this.buildExit("Northeast")}
        <br />
        {this.buildExit("West")}
        <IconButton onClick={this.action}>
          <RemoveRedEyeIcon />
        </IconButton>
        {this.buildExit("East")}
        <br />
        {this.buildExit("Southeast")}
        {this.buildExit("South")}
        {this.buildExit("Southwest")}
      </div>
    );
  }
}

NavWidget.propTypes = {
  classes: PropTypes.object.isRequired,
  theme: PropTypes.object.isRequired,
  exits: PropTypes.arrayOf(PropTypes.string).isRequired,
};

export default withStyles(styles, { withTheme: true })(NavWidget);

