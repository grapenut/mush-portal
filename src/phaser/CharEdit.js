
import Phaser from 'phaser';

class CharEditScene extends Phaser.Scene
{
  constructor()
  {
    super('charedit');
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
    var width = this.cameras.main.width;
    var height = this.cameras.main.height;
    
    var progressBar = this.add.graphics();
    var progressBox = this.add.graphics();
    progressBox.fillStyle(0x222222, 0.8);
    progressBox.fillRect(width/3, height/2 - 25, width/3, 50);

    var loadingText = this.make.text({
        x: width / 2,
        y: height / 2 - 50,
        text: 'Loading...',
        style: {
            font: '20px monospace',
            fill: '#ffffff'
        }
    });
    loadingText.setOrigin(0.5, 0.5);
    
    var percentText = this.make.text({
      x: width / 2,
      y: height / 2 - 5,
      text: '0%',
      style: {
        font: '18px monospace',
        fill: '#ffffff'
      }
    });
    percentText.setOrigin(0.5, 0.5);
    
    var assetText = this.make.text({
      x: width / 2,
      y: height / 2 + 50,
      text: '',
      style: {
        font: '18px monospace',
        fill: '#ffffff'
      }
    });
    assetText.setOrigin(0.5, 0.5);

    this.load.on('progress', function (value) {
      progressBar.clear();
      progressBar.fillStyle(0xffffff, 1);
      progressBar.fillRect(width/3 + 10, height/2 - 15, (width/3 - 20) * value, 30);
      percentText.setText(parseInt(value * 100) + '%');
    });
            
    this.load.on('fileprogress', function (file) {
      assetText.setText('Loading: ' + file.key + '...');
    });
 
    this.load.on('complete', function () {
      progressBar.destroy();
      progressBox.destroy();
      loadingText.destroy();
      percentText.destroy();
      assetText.destroy();
    });
    
    // load scene assets
    this.load.image('logo', 'assets/logo.png');
    for (var i = 0; i < 500; i++) {
                this.load.image('logo'+i, 'assets/logo.png');
    }
  }

  create()
  {
    this.bg = this.add.image(0, 0, 'logo');
    this.bg.setOrigin(0, 0);
    this.bg.setDisplaySize(this.game.config.width, this.game.config.height);
  }
  
  update(time, delta)
  {
  
  }
  
}

export default CharEditScene;

