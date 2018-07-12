
import React from 'react';
import PropTypes from 'prop-types';
import { withStyles } from '@material-ui/core/styles';


//////////////////////////////////////////////////////////////////////


const styles = theme => ({
  frame: {
    width: "100%",
  },
});


//////////////////////////////////////////////////////////////////////


class MenuBar extends React.Component {
  constructor(props) {
    super(props);
    this.state = {
      client: props.client,
    };
  }
  
  componentDidMount() {
    var client = this.state.client;
    client.react.menubar = this;
  }
  
  render() {
    const { classes } = this.props;
    
    return (
      <div className={classes.frame}>
      </div>
    );
  }
}

MenuBar.propTypes = {
  classes: PropTypes.object.isRequired,
  theme: PropTypes.object.isRequired,
  client: PropTypes.object.isRequired,
};

export default withStyles(styles, { withTheme: true })(MenuBar);

