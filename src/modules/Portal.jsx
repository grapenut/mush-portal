import React from 'react';
import PropTypes from 'prop-types';
import { withStyles } from '@material-ui/core/styles';

import Header from './Header';
import MenuBar from './MenuBar';
import SplitDrawer from './SplitDrawer';
import Input from './Input';
import Footer from './Footer';
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
    this.state = {
      client: props.client,
    };  
  }
  
  componentDidMount() {
    var client = this.state.client;
    if (!client) {
      return;
    }
    
    client.react.portal = this;
    client.initTerminal(this.props.terminal_ids);
    client.initFeed(this.props.feed_ids);
  }
  
  render() {
    const { classes, terminal_ids, feed_ids, client } = this.props;
    return (
      <div className={classes.frame}>
        <div className={classes.top}>
          <Header title="MUSH Portal" client={client} />
          <MenuBar client={client} />
        </div>
        <div className={classes.middle}>
          <SplitDrawer terminal_ids={terminal_ids} feed_ids={feed_ids} client={client} />
        </div>
        <div className={classes.bottom}>
          <Input id={terminal_ids.input} client={client} />
          <Footer client={client} />
        </div>
        <Login fullscreen client={client} />
      </div>
    );
  }
}

Portal.propTypes = {
  classes: PropTypes.object.isRequired,
  theme: PropTypes.object.isRequired,
  terminal_ids: PropTypes.object.isRequired,
  feed_ids: PropTypes.object.isRequired,
  client: PropTypes.object.isRequired,
};

export default withStyles(styles, { withTheme: true })(Portal);

