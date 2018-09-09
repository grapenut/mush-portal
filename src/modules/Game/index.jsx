import React from 'react';
import PropTypes from 'prop-types';
import { withStyles } from '@material-ui/core/styles';

import Phaser from 'phaser';
import BootScene from './BootScene';
import CharEditScene from './CharEditScene';

const styles = theme => ({
  frame: {
  },
});

class Game extends React.Component {
  constructor(props) {
    super(props);
    this.state = { };
    this.client = props.client;
    this.parent = React.createRef();
    this.config = {
      type: Phaser.AUTO,
      parent: 'phaser-frame',
      width: 640,
      height: 480,
      scene: [ BootScene, CharEditScene ]
    };
  }
  
  componentDidMount() {
    var parent = this.parent.current;
    this.config.parent = parent;
    
    var game = new Phaser.Game(this.config);
    var client = this.client;
    client.phaser = game;
    
    //this.props.glContainer.setSize(this.config.width, this.config.height);
    
    this.props.glContainer.on('destroy', function() {
      game.destroy();
      client.phaser = null;
    });
  }
  
  render() {
    const { classes } = this.props;
    return (
      <div className={classes.frame} id={this.config.parent} ref={this.parent}></div>
    );
  }
}

Game.propTypes = {
  classes: PropTypes.object.isRequired,
  client: PropTypes.object.isRequired,
};

export default withStyles(styles, { withTheme: true })(Game);

