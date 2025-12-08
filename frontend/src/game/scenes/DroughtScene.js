import Phaser from 'phaser';
import VirtualJoystickPlugin from 'phaser3-rex-plugins/plugins/virtualjoystick-plugin.js';

export default class DroughtScene extends Phaser.Scene {
  constructor() {
    super({ key: 'DroughtScene' });
    this.waterLevel = 100;
    this.gameOver = false;
  }

  preload() {
    this.load.plugin('rexvirtualjoystickplugin', VirtualJoystickPlugin, true);
    this.createGraphics();
  }

  createGraphics() {
    // Player (carrying water pot)
    const playerGraphics = this.make.graphics({ x: 0, y: 0, add: false });
    playerGraphics.fillStyle(0xFF9800);
    playerGraphics.fillCircle(16, 12, 12);
    playerGraphics.fillStyle(0x2196F3);
    playerGraphics.fillEllipse(16, 5, 10, 8);
    playerGraphics.fillStyle(0x8D6E63);
    playerGraphics.fillRect(12, 14, 8, 12);
    playerGraphics.generateTexture('player', 32, 32);
    playerGraphics.destroy();

    // Water drop
    const waterGraphics = this.make.graphics({ x: 0, y: 0, add: false });
    waterGraphics.fillStyle(0x2196F3);
    waterGraphics.fillCircle(12, 12, 10);
    waterGraphics.generateTexture('water', 24, 24);
    waterGraphics.destroy();

    // Well
    const wellGraphics = this.make.graphics({ x: 0, y: 0, add: false });
    wellGraphics.fillStyle(0x8D6E63);
    wellGraphics.fillCircle(40, 40, 35);
    wellGraphics.fillStyle(0x2196F3);
    wellGraphics.fillCircle(40, 40, 25);
    wellGraphics.generateTexture('well', 80, 80);
    wellGraphics.destroy();

    // Dried crop
    const cropGraphics = this.make.graphics({ x: 0, y: 0, add: false });
    cropGraphics.fillStyle(0xD7CCC8);
    cropGraphics.fillRect(0, 10, 20, 15);
    cropGraphics.fillStyle(0xBCAAA4);
    cropGraphics.fillRect(8, 0, 4, 25);
    cropGraphics.generateTexture('crop', 20, 25);
    cropGraphics.destroy();

    // Community tank
    const tankGraphics = this.make.graphics({ x: 0, y: 0, add: false });
    tankGraphics.fillStyle(0x607D8B);
    tankGraphics.fillRect(0, 20, 100, 60);
    tankGraphics.fillStyle(0x2196F3, 0.5);
    tankGraphics.fillRect(5, 50, 90, 25);
    tankGraphics.generateTexture('tank', 100, 80);
    tankGraphics.destroy();
  }

  create() {
    this.gameOver = false;
    this.waterLevel = 100;
    this.waterCollected = 0;

    this.cameras.main.setBackgroundColor('#FFF59D');

    // Instructions
    this.add.text(400, 30, '☀️ DROUGHT! Collect water for community!', {
      fontSize: '24px',
      fontFamily: 'Arial',
      color: '#000',
      backgroundColor: '#FFF',
      padding: { x: 10, y: 5 }
    }).setOrigin(0.5).setScrollFactor(0);

    this.add.text(400, 60, 'Gather water drops! Fill community tank!', {
      fontSize: '16px',
      fontFamily: 'Arial',
      color: '#000',
      backgroundColor: '#FFF',
      padding: { x: 10, y: 5 }
    }).setOrigin(0.5).setScrollFactor(0);

    // Player
    this.player = this.physics.add.sprite(400, 500, 'player');
    this.player.setCollideWorldBounds(true);

    // Community tank (goal)
    this.tank = this.physics.add.sprite(700, 470, 'tank');
    this.tank.setImmovable(true);

    // Water drops and crops
    this.waterDrops = this.physics.add.group();
    this.driedCrops = this.physics.add.group();

    // Spawn initial dried crops
    for (let i = 0; i < 8; i++) {
      const x = Phaser.Math.Between(100, 700);
      const y = Phaser.Math.Between(150, 450);
      this.driedCrops.create(x, y, 'crop').setImmovable(true);
    }

    // Collisions
    this.physics.add.overlap(this.player, this.tank, this.reachTank, null, this);
    this.physics.add.overlap(this.player, this.waterDrops, this.collectWater, null, this);
    this.physics.add.overlap(this.player, this.driedCrops, this.touchCrop, null, this);

    // UI
    this.waterText = this.add.text(16, 90, '💧 Water: 0/5', {
      fontSize: '20px',
      fontFamily: 'Arial',
      color: '#000',
      backgroundColor: '#2196F3',
      padding: { x: 10, y: 5 }
    }).setScrollFactor(0);

    this.levelText = this.add.text(600, 90, '🌡️ Heat: Extreme', {
      fontSize: '20px',
      fontFamily: 'Arial',
      color: '#000',
      backgroundColor: '#FF5722',
      padding: { x: 10, y: 5 }
    }).setScrollFactor(0);

    // Spawn water drops periodically
    this.time.addEvent({
      delay: 3000,
      callback: this.spawnWaterDrop,
      callbackScope: this,
      loop: true
    });

    // Water evaporation
    this.time.addEvent({
      delay: 5000,
      callback: () => {
        if (!this.gameOver && this.waterLevel > 0) {
          this.waterLevel -= 5;
          this.cameras.main.flash(100, 255, 235, 59, true);
        }
      },
      callbackScope: this,
      loop: true
    });

    // Controls
    this.cursors = this.input.keyboard.createCursorKeys();
    this.wasd = this.input.keyboard.addKeys({
      up: Phaser.Input.Keyboard.KeyCodes.W,
      down: Phaser.Input.Keyboard.KeyCodes.S,
      left: Phaser.Input.Keyboard.KeyCodes.A,
      right: Phaser.Input.Keyboard.KeyCodes.D
    });

    // Virtual Joystick
    this.joyStick = this.plugins.get('rexvirtualjoystickplugin').add(this, {
      x: 100,
      y: 500,
      radius: 50,
      base: this.add.circle(0, 0, 50, 0x888888, 0.5),
      thumb: this.add.circle(0, 0, 25, 0xcccccc, 0.8),
    });
    
    this.joyStick.base.setScrollFactor(0);
    this.joyStick.thumb.setScrollFactor(0);
  }

  update() {
    if (this.gameOver) return;

    const speed = 170;
    let velocityX = 0;
    let velocityY = 0;

    if (this.cursors.left.isDown || this.wasd.left.isDown) {
      velocityX = -speed;
    } else if (this.cursors.right.isDown || this.wasd.right.isDown) {
      velocityX = speed;
    }

    if (this.cursors.up.isDown || this.wasd.up.isDown) {
      velocityY = -speed;
    } else if (this.cursors.down.isDown || this.wasd.down.isDown) {
      velocityY = speed;
    }

    if (this.joyStick.force > 0) {
      const angle = this.joyStick.angle;
      velocityX = Math.cos(angle) * speed * this.joyStick.force;
      velocityY = Math.sin(angle) * speed * this.joyStick.force;
    }

    this.player.setVelocity(velocityX, velocityY);
  }

  spawnWaterDrop() {
    if (this.gameOver || this.waterDrops.countActive(true) > 4) return;

    const x = Phaser.Math.Between(100, 700);
    const y = Phaser.Math.Between(150, 450);
    const drop = this.waterDrops.create(x, y, 'water');
    drop.setImmovable(true);

    // Make it sparkle
    this.tweens.add({
      targets: drop,
      scale: { from: 0.8, to: 1.2 },
      duration: 1000,
      yoyo: true,
      repeat: -1
    });
  }

  collectWater(player, water) {
    water.destroy();
    this.waterCollected++;
    this.waterLevel = Math.min(100, this.waterLevel + 10);

    this.waterText.setText(`💧 Water: ${this.waterCollected}/5`);

    const splash = this.add.circle(player.x, player.y, 20, 0x2196F3, 0.7);
    this.tweens.add({
      targets: splash,
      alpha: 0,
      scale: 2,
      duration: 400,
      onComplete: () => splash.destroy()
    });
  }

  touchCrop(player, crop) {
    // Just visual feedback - crops need water
    crop.setTint(0xFFEB3B);
    this.time.delayedCall(500, () => {
      if (crop && crop.active) {
        crop.clearTint();
      }
    });
  }

  reachTank() {
    if (!this.gameOver && this.waterCollected >= 5) {
      this.endGame(true);
    } else if (this.waterCollected < 5) {
      // Show message to collect more water
      this.cameras.main.shake(100, 0.005);
    }
  }

  endGame(success) {
    this.gameOver = true;
    this.physics.pause();

    const message = success 
      ? `🎉 SUCCESS!\n\nYou saved the community!\n\nYou learned:\n✓ Water conservation is critical\n✓ Community cooperation helps\n✓ Drought-resistant crops matter`
      : `⚠️ GAME OVER\n\nRemember:\n• Conserve every drop of water\n• Use water harvesting methods\n• Plant drought-resistant crops\n\nTry Again!`;

    this.showGameOverScreen(success, message);
  }

  showGameOverScreen(success, message) {
    const bg = this.add.rectangle(400, 300, 600, 400, 0x000000, 0.9).setScrollFactor(0);
    const text = this.add.text(400, 250, message, {
      fontSize: '20px',
      fontFamily: 'Arial',
      color: '#fff',
      align: 'center',
      lineSpacing: 10
    }).setOrigin(0.5).setScrollFactor(0);

    const restartBtn = this.add.text(400, 450, '🔄 Play Again', {
      fontSize: '24px',
      fontFamily: 'Arial',
      color: '#fff',
      backgroundColor: '#4CAF50',
      padding: { x: 20, y: 10 }
    }).setOrigin(0.5).setInteractive().setScrollFactor(0);

    restartBtn.on('pointerdown', () => this.scene.restart());

    const exitBtn = this.add.text(400, 500, '🏠 Back to Menu', {
      fontSize: '24px',
      fontFamily: 'Arial',
      color: '#fff',
      backgroundColor: '#f44336',
      padding: { x: 20, y: 10 }
    }).setOrigin(0.5).setInteractive().setScrollFactor(0);

    exitBtn.on('pointerdown', () => {
      this.scene.stop();
      if (window.phaserGameCallback) {
        window.phaserGameCallback({ success });
      }
    });
  }
}
