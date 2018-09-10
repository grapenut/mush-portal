
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


class StatusBar extends React.Component {
  constructor(props) {
    super(props);
    this.state = {
      time: 0,
      status: null,
    };
    this.timer = null;
    this.startTime = new Date();
  }
  
  setTimer(s) {
    this.startTime = new Date();
    this.setState({ time: 0, status: s });
    this.startTimer();
  }
  
  stopTimer() {
    clearInterval(this.timer);
    this.timer = null;
  }
  
  startTimer() {
    this.timer = setInterval(() => {
      this.setState({ time: new Date() });
    }, 1000);
  }

  timeString(duration) {
    var seconds = Math.round((duration/1000)%60),
        minutes = Math.round((duration/(1000*60))%60),
        hours = Math.round((duration/(1000*60*60))%24),
        days = Math.round((duration/(1000*60*60*24))%365);
    var str = " ";
    
    if (days > 0) {
      str += days + " days ";
    }
    
    if (hours > 0) {
      str += hours + ":";
    }
    
    if (minutes > 0) {
      str += minutes + ":";
    }
    
    str += seconds;

    return str;
  }
  
  setStatus(s) {
    this.setState({ status: s });
  }
  
  componentDidMount() {
    window.client.react.statusbar = this;
  }
  
  componentWillUnmount() {
    this.stopTimer();
  }
  
  render() {
    const { classes } = this.props;
    const { status, time } = this.state;
    
    var str = "";
    
    if (status) {
      str += status;
    }
    
    if (this.timer) {
      str += this.timeString(time - this.startTime);
    }
    
    return (
      <div className={classes.frame}>
        <Typography
          align="right"
          variant="button"
          color="inherit"
          noWrap
          dangerouslySetInnerHTML={{ __html: str }}
        />
      </div>
    );
  }
}

StatusBar.propTypes = {
  classes: PropTypes.object.isRequired,
  theme: PropTypes.object.isRequired,
};

export default withStyles(styles, { withTheme: true })(StatusBar);

