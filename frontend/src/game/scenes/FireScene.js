import Phaser from 'phaser';
import VirtualJoystickPlugin from 'phaser3-rex-plugins/plugins/virtualjoystick-plugin.js';

export default class FireScene extends Phaser.Scene {
  constructor() {
    super({ key: 'FireScene' });
    this.lives = 3;
    this.gameOver = false;
  }

  preload() {
    this.load.plugin('rexvirtualjoystickplugin', VirtualJoystickPlugin, true);
    this.createGraphics();
  }

  createGraphics() {
    // Player (crawling person)
    const playerGraphics = this.make.graphics({ x: 0, y: 0, add: false });
    playerGraphics.fillStyle(0x2196F3);
    playerGraphics.fillEllipse(20, 15, 35, 20);
    playerGraphics.fillStyle(0xFFE0BD);
    playerGraphics.fillCircle(10, 10, 10);
    playerGraphics.generateTexture('player', 40, 30);
    playerGraphics.destroy();

    // Fire
    const fireGraphics = this.make.graphics({ x: 0, y: 0, add: false });
    fireGraphics.fillStyle(0xFF5722);
    fireGraphics.fillRect(0, 10, 30, 20);
    fireGraphics.fillStyle(0xFF9800);
    fireGraphics.fillTriangle(5, 10, 15, 0, 25, 10);
    fireGraphics.fillStyle(0xFFC107);
    fireGraphics.fillTriangle(10, 10, 15, 3, 20, 10);
    fireGraphics.generateTexture('fire', 30, 30);
    fireGraphics.destroy();

    // Exit door
    const exitGraphics = this.make.graphics({ x: 0, y: 0, add: false });
    exitGraphics.fillStyle(0x4CAF50);
    exitGraphics.fillRect(0, 0, 60, 90);
    exitGraphics.fillStyle(0xFFFFFF);
    exitGraphics.fillRect(15, 20, 30, 15);
    exitGraphics.fillRect(15, 45, 30, 30);
    exitGraphics.generateTexture('exit', 60, 90);
    exitGraphics.destroy();

    // Smoke
    const smokeGraphics = this.make.graphics({ x: 0, y: 0, add: false });
    smokeGraphics.fillStyle(0x757575, 0.6);
    smokeGraphics.fillCircle(15, 15, 15);
    smokeGraphics.generateTexture('smoke', 30, 30);
    smokeGraphics.destroy();

    // Fire extinguisher
    const extinguisherGraphics = this.make.graphics({ x: 0, y: 0, add: false });
    extinguisherGraphics.fillStyle(0xFF0000);
    extinguisherGraphics.fillRect(5, 0, 15, 30);
    extinguisherGraphics.fillStyle(0x000000);
    extinguisherGraphics.fillCircle(12, 8, 3);
    extinguisherGraphics.generateTexture('extinguisher', 25, 30);
    extinguisherGraphics.destroy();
  }

  create() {
    this.gameOver = false;
    this.lives = 3;
    this.oxygenLevel = 100;

    this.cameras.main.setBackgroundColor('#424242');

    // Smoke overlay
    this.smokeOverlay = this.add.rectangle(400, 300, 800, 600, 0x000000, 0);

    // Instructions
    this.add.text(400, 30, '🔥 FIRE! Stay low and find the exit!', {
      fontSize: '24px',
      fontFamily: 'Arial',
      color: '#fff',
      backgroundColor: '#000',
      padding: { x: 10, y: 5 }
    }).setOrigin(0.5).setScrollFactor(0);

    this.add.text(400, 60, 'Stay LOW to avoid smoke! Find EXIT!', {
      fontSize: '16px',
      fontFamily: 'Arial',
      color: '#fff',
      backgroundColor: '#000',
      padding: { x: 10, y: 5 }
    }).setOrigin(0.5).setScrollFactor(0);

    // Player
    this.player = this.physics.add.sprite(100, 500, 'player');
    this.player.setCollideWorldBounds(true);

    // Exit door
    this.exit = this.physics.add.sprite(700, 480, 'exit');
    this.exit.setImmovable(true);

    // Hazards
    this.fires = this.physics.add.group();
    this.smokeClouds = this.physics.add.group();
    this.extinguishers = this.physics.add.group();

    // Collisions
    this.physics.add.overlap(this.player, this.exit, this.reachExit, null, this);
    this.physics.add.overlap(this.player, this.fires, this.hitFire, null, this);
    this.physics.add.overlap(this.player, this.smokeClouds, this.hitSmoke, null, this);
    this.physics.add.overlap(this.player, this.extinguishers, this.collectExtinguisher, null, this);

    // UI
    this.livesText = this.add.text(16, 90, 'Lives: ❤️❤️❤️', {
      fontSize: '20px',
      fontFamily: 'Arial',
      color: '#fff',
      backgroundColor: '#000',
      padding: { x: 10, y: 5 }
    }).setScrollFactor(0);

    this.oxygenText = this.add.text(650, 90, '💨 O2: 100%', {
      fontSize: '20px',
      fontFamily: 'Arial',
      color: '#fff',
      backgroundColor: '#2196F3',
      padding: { x: 10, y: 5 }
    }).setScrollFactor(0);

    // Spawn hazards
    this.spawnInitialHazards();

    this.time.addEvent({
      delay: 2000,
      callback: this.spawnFire,
      callbackScope: this,
      loop: true
    });

    this.time.addEvent({
      delay: 1500,
      callback: this.spawnSmoke,
      callbackScope: this,
      loop: true
    });

    // Oxygen depletion when in smoke
    this.time.addEvent({
      delay: 100,
      callback: this.updateOxygen,
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

  spawnInitialHazards() {
    // Spawn some fires
    for (let i = 0; i < 4; i++) {
      const x = Phaser.Math.Between(200, 650);
      const y = Phaser.Math.Between(150, 550);
      this.fires.create(x, y, 'fire').setImmovable(true);
    }

    // Spawn extinguisher
    const ex = Phaser.Math.Between(300, 500);
    const ey = Phaser.Math.Between(200, 400);
    this.extinguishers.create(ex, ey, 'extinguisher').setImmovable(true);
  }

  update() {
    if (this.gameOver) return;

    const speed = 180;
    let velocityX = 0;
    let velocityY = 0;

    // Keyboard
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

    // Joystick
    if (this.joyStick.force > 0) {
      const angle = this.joyStick.angle;
      velocityX = Math.cos(angle) * speed * this.joyStick.force;
      velocityY = Math.sin(angle) * speed * this.joyStick.force;
    }

    this.player.setVelocity(velocityX, velocityY);

    // Smoke opacity increases when player is high
    const smokeIntensity = Math.max(0, (300 - this.player.y) / 300) * 0.5;
    this.smokeOverlay.setAlpha(smokeIntensity);
  }

  updateOxygen() {
    if (this.gameOver) return;

    // Lose oxygen when in smoke (upper half of screen)
    if (this.player.y < 300) {
      this.oxygenLevel -= 0.5;
    } else {
      // Recover oxygen when low
      this.oxygenLevel = Math.min(100, this.oxygenLevel + 0.3);
    }

    this.oxygenText.setText(`💨 O2: ${Math.floor(this.oxygenLevel)}%`);

    if (this.oxygenLevel <= 0) {
      this.endGame(false);
    }
  }

  spawnFire() {
    if (this.gameOver || this.fires.countActive(true) > 6) return;

    const x = Phaser.Math.Between(150, 650);
    const y = Phaser.Math.Between(150, 550);
    this.fires.create(x, y, 'fire').setImmovable(true);
  }

  spawnSmoke() {
    if (this.gameOver) return;

    const x = Phaser.Math.Between(100, 700);
    const smoke = this.smokeClouds.create(x, 50, 'smoke');
    smoke.setVelocityY(30);
  }

  collectExtinguisher(player, ext) {
    ext.destroy();
    this.oxygenLevel = Math.min(100, this.oxygenLevel + 20);

    const flash = this.add.circle(player.x, player.y, 30, 0xFF0000, 0.7);
    this.tweens.add({
      targets: flash,
      alpha: 0,
      scale: 2,
      duration: 300,
      onComplete: () => flash.destroy()
    });
  }

  hitFire(player, fire) {
    fire.destroy();
    this.lives--;

    const hearts = '❤️'.repeat(this.lives);
    this.livesText.setText('Lives: ' + hearts);
    this.cameras.main.flash(200, 255, 87, 34);

    if (this.lives <= 0) {
      this.endGame(false);
    }
  }

  hitSmoke(player, smoke) {
    smoke.destroy();
    this.oxygenLevel -= 5;
  }

  reachExit() {
    if (!this.gameOver) {
      this.endGame(true);
    }
  }

  endGame(success) {
    this.gameOver = true;
    this.physics.pause();

    const message = success 
      ? `🎉 SUCCESS!\n\nYou escaped safely!\n\nYou learned:\n✓ Stay low to avoid smoke\n✓ Find nearest exit\n✓ Use fire extinguishers wisely`
      : `⚠️ GAME OVER\n\nRemember:\n• Get Out, Stay Out, Call for Help\n• Crawl low under smoke\n• Feel doors before opening\n\nTry Again!`;

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
