
import Phaser from 'phaser';

class Boot extends Phaser.Scene
{
  constructor(config)
  {
    super(config);
  }

  preload()
  {
    this.load.image('logo', './assets/logo.png')
  }

  create()
  {
    this.events.on('resize', this.resize, this);
    this.bg = this.add.image(0, 0, 'logo');
    this.bg.setOrigin(0, 0);
    this.bg.setDisplaySize(this.game.config.width, this.game.config.height);
  }
  
  update(time, delta)
  {
  
  }
  
  wake()
  {
  
  }
  
  start()
  {
  
  }
  
  resize(width, height)
  {
    this.cameras.resize(width, height);
    this.bg.setDisplaySize(width, height);  
  }
}

export default Boot;

