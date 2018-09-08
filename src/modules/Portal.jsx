import React from 'react';
import PropTypes from 'prop-types';
import { withStyles } from '@material-ui/core/styles';

import Header from './Header';
import Terminal from './Terminal';
import Game from './Game';
import MailBox from './Mail/MailBox';
import CharacterBuilder from './CharacterBuilder';
import Input from './Input';
import StatusBar from './StatusBar';
import Login from './Login';

import 'golden-layout/src/css/goldenlayout-base.css';
import 'golden-layout/src/css/goldenlayout-dark-theme.css';
import GoldenLayout from 'golden-layout';

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
    this.client = props.client;
    this.config = props.config;
    this.setNode = this.setNode.bind(this);
  }
  
  componentDidMount() {
    this.layout = new GoldenLayout(this.config, this.node);
    this.layout.registerComponent('Terminal', Terminal);
    this.layout.registerComponent('Game', Game);
    this.layout.registerComponent('Mailbox', MailBox);
    this.layout.registerComponent('Chargen', CharacterBuilder);
    this.layout.init();
    
    this.client.react.portal = this;
    this.client.layout = this.layout;

    window.scrollTo(0,1);
  }
  
  setNode(node) {
    this.node = node;
  }
  
  render() {
    const { classes,  client, config } = this.props;
    return (
      <div className={classes.frame}>
        <div className={classes.top}>
          <Header title="MUSH Portal" client={client} />
        </div>
        <div className={classes.middle} ref={this.setNode}></div>
        <div className={classes.bottom}>
          <Input id={config.content[0].content[0].props.ids.input} client={client} />
          <StatusBar client={client} />
        </div>
        <Login fullscreen client={client} />
      </div>
    );
  }
}

Portal.propTypes = {
  classes: PropTypes.object.isRequired,
  theme: PropTypes.object.isRequired,
  config: PropTypes.object.isRequired,
  client: PropTypes.object.isRequired,
};

export default withStyles(styles, { withTheme: true })(Portal);

