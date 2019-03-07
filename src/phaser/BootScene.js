
import Phaser from 'phaser';

class BootScene extends Phaser.Scene
{
  constructor()
  {
    super('boot');
  }

  state(state)
  {
    this.game.events.off('state', this.state)
    this.scene.start(state);
  }
  
  init()
  {
    this.game.events.on('state', this.state, this);
  }

  preload()
  {
    this.load.image('logo', './assets/logo.jpg')
  }

  create()
  {
    this.bg = this.add.image(0, 0, 'logo');
    this.bg.setOrigin(0, 0);
    this.bg.setDisplaySize(this.game.config.width, this.game.config.height);
    
    setTimeout(() => { this.scene.start('WorldScene'); }, 3000);
  }
  
  update(time, delta)
  {
  
  }
  
}

export default BootScene;

