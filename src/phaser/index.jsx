import React from 'react';
import PropTypes from 'prop-types';
import { withStyles } from '@material-ui/core/styles';

import Phaser from 'phaser';
//import BootScene from './BootScene';
//import CharEditScene from './CharEditScene';
import RoomScene from './RoomScene';

const styles = theme => ({
  frame: {
    position: 'absolute',
    height: '100%',
    width: '100%',
  },
});

class Game extends React.Component {
  constructor(props) {
    super(props);
    this.state = { };
    this.parent = React.createRef();
    this.config = {
      type: Phaser.AUTO,
      parent: 'phaser-frame',
      width: 640,
      height: 480,
      scene: [ RoomScene ],
      backgroundColor: "#000",
      pixelArt: true,
      keyboard: {
        target: 'phaser-frame',
      },
      physics: {
        default: "arcade",
        arcade: {
          gravity: { y: 0 }
        }
      }
    };
  }
  
  componentDidMount() {
    var parent = this.parent.current;
    this.config.parent = parent;
    
    this.game = new Phaser.Game(this.config);
    window.client.react.phaser = this;
  }
  
  componentWillUnmount() {
    this.game.destroy();
    window.client.react.phaser = null;
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
};

export default withStyles(styles, { withTheme: true })(Game);

