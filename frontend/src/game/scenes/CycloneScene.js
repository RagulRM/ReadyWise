import Phaser from 'phaser';
import VirtualJoystickPlugin from 'phaser3-rex-plugins/plugins/virtualjoystick-plugin.js';

export default class CycloneScene extends Phaser.Scene {
  constructor() {
    super({ key: 'CycloneScene' });
    this.lives = 3;
    this.gameOver = false;
  }

  preload() {
    this.load.plugin('rexvirtualjoystickplugin', VirtualJoystickPlugin, true);
    this.createGraphics();
  }

  createGraphics() {
    // Player
    const playerGraphics = this.make.graphics({ x: 0, y: 0, add: false });
    playerGraphics.fillStyle(0x4CAF50);
    playerGraphics.fillCircle(16, 16, 16);
    playerGraphics.fillStyle(0xFFFFFF);
    playerGraphics.fillCircle(12, 12, 4);
    playerGraphics.fillCircle(20, 12, 4);
    playerGraphics.generateTexture('player', 32, 32);
    playerGraphics.destroy();

    // Flying debris (roof tiles, branches)
    const debrisGraphics = this.make.graphics({ x: 0, y: 0, add: false });
    debrisGraphics.fillStyle(0xCD853F);
    debrisGraphics.fillRect(0, 0, 40, 15);
    debrisGraphics.fillStyle(0x8B4513);
    debrisGraphics.fillRect(5, 3, 8, 9);
    debrisGraphics.generateTexture('debris', 40, 15);
    debrisGraphics.destroy();

    // Shelter
    const shelterGraphics = this.make.graphics({ x: 0, y: 0, add: false });
    shelterGraphics.fillStyle(0x808080);
    shelterGraphics.fillRect(0, 0, 100, 100);
    shelterGraphics.fillStyle(0x4CAF50);
    shelterGraphics.fillCircle(50, 50, 30);
    shelterGraphics.fillStyle(0xFFFFFF);
    shelterGraphics.fillRect(45, 30, 10, 40);
    shelterGraphics.fillRect(30, 45, 40, 10);
    shelterGraphics.generateTexture('shelter', 100, 100);
    shelterGraphics.destroy();

    // Emergency supplies
    const supplyGraphics = this.make.graphics({ x: 0, y: 0, add: false });
    supplyGraphics.fillStyle(0xFF5722);
    supplyGraphics.fillRect(0, 0, 25, 25);
    supplyGraphics.fillStyle(0xFFFFFF);
    supplyGraphics.fillCircle(12, 12, 8);
    supplyGraphics.generateTexture('supply', 25, 25);
    supplyGraphics.destroy();
  }

  create() {
    this.gameOver = false;
    this.lives = 3;
    this.windSpeed = 100;

    this.cameras.main.setBackgroundColor('#5D4E37');

    // Instructions
    this.add.text(400, 30, '🌪️ CYCLONE! Reach the evacuation shelter!', {
      fontSize: '24px',
      fontFamily: 'Arial',
      color: '#fff',
      backgroundColor: '#000',
      padding: { x: 10, y: 5 }
    }).setOrigin(0.5).setScrollFactor(0);

    this.add.text(400, 60, 'Fight Against Wind! Collect Supplies!', {
      fontSize: '16px',
      fontFamily: 'Arial',
      color: '#fff',
      backgroundColor: '#000',
      padding: { x: 10, y: 5 }
    }).setOrigin(0.5).setScrollFactor(0);

    // Player
    this.player = this.physics.add.sprite(100, 300, 'player');
    this.player.setCollideWorldBounds(true);

    // Shelter
    this.shelter = this.physics.add.sprite(700, 300, 'shelter');
    this.shelter.setImmovable(true);

    // Debris and supplies
    this.debris = this.physics.add.group();
    this.supplies = this.physics.add.group();

    // Collisions
    this.physics.add.overlap(this.player, this.shelter, this.reachShelter, null, this);
    this.physics.add.overlap(this.player, this.debris, this.hitDebris, null, this);
    this.physics.add.overlap(this.player, this.supplies, this.collectSupply, null, this);

    // UI
    this.livesText = this.add.text(16, 90, 'Lives: ❤️❤️❤️', {
      fontSize: '20px',
      fontFamily: 'Arial',
      color: '#fff',
      backgroundColor: '#000',
      padding: { x: 10, y: 5 }
    }).setScrollFactor(0);

    this.windText = this.add.text(650, 90, '💨 Wind: Strong', {
      fontSize: '20px',
      fontFamily: 'Arial',
      color: '#fff',
      backgroundColor: '#F57C00',
      padding: { x: 10, y: 5 }
    }).setScrollFactor(0);

    // Spawn objects
    this.time.addEvent({
      delay: 1000,
      callback: this.spawnDebris,
      callbackScope: this,
      loop: true
    });

    this.time.addEvent({
      delay: 4000,
      callback: this.spawnSupply,
      callbackScope: this,
      loop: true
    });

    // Wind gust effect
    this.time.addEvent({
      delay: 3000,
      callback: () => {
        if (!this.gameOver) {
          this.windSpeed = Phaser.Math.Between(80, 150);
          this.cameras.main.shake(200, 0.005);
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

    // Virtual Joystick for mobile
    this.joyStick = this.plugins.get('rexvirtualjoystickplugin').add(this, {
      x: 100,
      y: 500,
      radius: 50,
      base: this.add.circle(0, 0, 50, 0x888888, 0.5),
      thumb: this.add.circle(0, 0, 25, 0xcccccc, 0.8),
    }).on('update', this.updateJoystick, this);
    
    this.joyStick.base.setScrollFactor(0);
    this.joyStick.thumb.setScrollFactor(0);
  }

  updateJoystick() {
    // Will be used in update loop
  }

  update() {
    if (this.gameOver) return;

    const speed = 160;
    let velocityX = 0;
    let velocityY = 0;

    // Keyboard controls
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

    // Joystick controls (override keyboard if active)
    if (this.joyStick.force > 0) {
      const angle = this.joyStick.angle;
      velocityX = Math.cos(angle) * speed * this.joyStick.force;
      velocityY = Math.sin(angle) * speed * this.joyStick.force;
    }

    // Apply wind resistance (pushes player left)
    velocityX -= this.windSpeed / 10;

    this.player.setVelocity(velocityX, velocityY);

    // Cleanup
    this.debris.children.entries.forEach(d => {
      if (d.x < -100) d.destroy();
    });
  }

  spawnDebris() {
    if (this.gameOver) return;

    const y = Phaser.Math.Between(100, 500);
    const debris = this.debris.create(850, y, 'debris');
    debris.setVelocityX(-this.windSpeed - Phaser.Math.Between(50, 150));
    debris.setAngularVelocity(Phaser.Math.Between(-300, 300));
  }

  spawnSupply() {
    if (this.gameOver) return;

    const x = Phaser.Math.Between(200, 600);
    const y = Phaser.Math.Between(150, 450);
    this.supplies.create(x, y, 'supply').setImmovable(true);
  }

  collectSupply(player, supply) {
    supply.destroy();
    
    const flash = this.add.circle(player.x, player.y, 25, 0xFF5722, 0.7);
    this.tweens.add({
      targets: flash,
      alpha: 0,
      scale: 2,
      duration: 300,
      onComplete: () => flash.destroy()
    });
  }

  hitDebris(player, debris) {
    debris.destroy();
    this.lives--;

    const hearts = '❤️'.repeat(this.lives);
    this.livesText.setText('Lives: ' + hearts);
    this.cameras.main.flash(200, 255, 100, 0);

    if (this.lives <= 0) {
      this.endGame(false);
    }
  }

  reachShelter() {
    if (!this.gameOver) {
      this.endGame(true);
    }
  }

  endGame(success) {
    this.gameOver = true;
    this.physics.pause();

    const message = success 
      ? `🎉 SUCCESS!\n\nYou reached the shelter!\n\nYou learned:\n✓ Move to designated shelters\n✓ Protect yourself from flying debris\n✓ Gather emergency supplies`
      : `⚠️ GAME OVER\n\nRemember:\n• Evacuate when warnings issued\n• Stay away from windows\n• Find sturdy shelter\n\nTry Again!`;

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
