
import React from 'react';
import PropTypes from 'prop-types';
import { withStyles } from '@material-ui/core/styles';

import MailList from './MailList';
import MailItem from './MailItem';

//////////////////////////////////////////////////////////////////////


const styles = theme => ({
  frame: {
    position: "absolute",
    height: "100%",
    width: "100%",
    display: "flex",
    "flex-flow": "row nowrap",
  },
});


//////////////////////////////////////////////////////////////////////


class Chat extends React.Component {
  constructor(props) {
    super(props);
    this.state = {
    };
  }
  
  componentDidMount() {
    window.client.react.chat = this;
  }
  
  componentWillUnmount() {
    window.client.react.chat = null;
  }
  
  render() {
    const { classes } = this.props;

    return (
      <div className={classes.frame}>
      </div>
    );
  }
}

Chat.propTypes = {
  classes: PropTypes.object.isRequired,
  theme: PropTypes.object.isRequired,
};

export default withStyles(styles, { withTheme: true })(Chat);

	