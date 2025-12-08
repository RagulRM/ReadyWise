import Phaser from 'phaser';

export default class EarthquakeScene extends Phaser.Scene {
  constructor() {
    super({ key: 'EarthquakeScene' });
    this.lives = 3;
    this.gameOver = false;
  }

  preload() {
    // Create simple graphics for now (can be replaced with actual sprites later)
    this.createGraphics();
  }

  createGraphics() {
    // Player sprite
    const playerGraphics = this.make.graphics({ x: 0, y: 0, add: false });
    playerGraphics.fillStyle(0x4CAF50);
    playerGraphics.fillCircle(16, 16, 16);
    playerGraphics.fillStyle(0xFFFFFF);
    playerGraphics.fillCircle(12, 12, 4);
    playerGraphics.fillCircle(20, 12, 4);
    playerGraphics.generateTexture('player', 32, 32);
    playerGraphics.destroy();

    // Debris sprite
    const debrisGraphics = this.make.graphics({ x: 0, y: 0, add: false });
    debrisGraphics.fillStyle(0x8B4513);
    debrisGraphics.fillRect(0, 0, 30, 30);
    debrisGraphics.fillStyle(0x654321);
    debrisGraphics.fillRect(5, 5, 8, 8);
    debrisGraphics.fillRect(17, 5, 8, 8);
    debrisGraphics.fillRect(5, 17, 8, 8);
    debrisGraphics.generateTexture('debris', 30, 30);
    debrisGraphics.destroy();

    // Safe zone
    const safeZoneGraphics = this.make.graphics({ x: 0, y: 0, add: false });
    safeZoneGraphics.fillStyle(0x4CAF50, 0.3);
    safeZoneGraphics.fillRect(0, 0, 100, 100);
    safeZoneGraphics.lineStyle(4, 0x4CAF50);
    safeZoneGraphics.strokeRect(0, 0, 100, 100);
    safeZoneGraphics.generateTexture('safezone', 100, 100);
    safeZoneGraphics.destroy();

    // First aid kit
    const aidKitGraphics = this.make.graphics({ x: 0, y: 0, add: false });
    aidKitGraphics.fillStyle(0xFF0000);
    aidKitGraphics.fillRect(0, 0, 20, 20);
    aidKitGraphics.fillStyle(0xFFFFFF);
    aidKitGraphics.fillRect(8, 4, 4, 12);
    aidKitGraphics.fillRect(4, 8, 12, 4);
    aidKitGraphics.generateTexture('aidkit', 20, 20);
    aidKitGraphics.destroy();
  }

  create() {
    this.gameOver = false;
    this.lives = 3;

    // Background
    this.cameras.main.setBackgroundColor('#87CEEB');

    // Add ground
    const ground = this.add.rectangle(400, 580, 800, 40, 0x654321);
    this.physics.add.existing(ground, true);

    // Instructions
    this.add.text(400, 30, '🏫 EARTHQUAKE! Get to the safe zone!', {
      fontSize: '24px',
      fontFamily: 'Arial',
      color: '#fff',
      backgroundColor: '#000',
      padding: { x: 10, y: 5 }
    }).setOrigin(0.5);

    this.add.text(400, 60, 'Arrow Keys / WASD to Move | Avoid Debris!', {
      fontSize: '16px',
      fontFamily: 'Arial',
      color: '#fff',
      backgroundColor: '#000',
      padding: { x: 10, y: 5 }
    }).setOrigin(0.5);

    // Create player
    this.player = this.physics.add.sprite(100, 500, 'player');
    this.player.setCollideWorldBounds(true);
    this.player.setBounce(0.2);

    // Create safe zone at the end
    this.safeZone = this.physics.add.sprite(700, 450, 'safezone');
    this.safeZone.setImmovable(true);

    // Debris group (falling objects)
    this.debris = this.physics.add.group();

    // First aid kits (collectibles)
    this.aidKits = this.physics.add.group();
    this.spawnAidKit();

    // Set up collisions
    this.physics.add.overlap(this.player, this.safeZone, this.reachSafeZone, null, this);
    this.physics.add.overlap(this.player, this.debris, this.hitDebris, null, this);
    this.physics.add.overlap(this.player, this.aidKits, this.collectAidKit, null, this);

    // Lives text
    this.livesText = this.add.text(16, 90, 'Lives: ❤️❤️❤️', {
      fontSize: '20px',
      fontFamily: 'Arial',
      color: '#fff',
      backgroundColor: '#000',
      padding: { x: 10, y: 5 }
    });

    // Timer
    this.timeLeft = 60;
    this.timerText = this.add.text(700, 90, `Time: ${this.timeLeft}s`, {
      fontSize: '20px',
      fontFamily: 'Arial',
      color: '#fff',
      backgroundColor: '#000',
      padding: { x: 10, y: 5 }
    });

    this.time.addEvent({
      delay: 1000,
      callback: this.updateTimer,
      callbackScope: this,
      loop: true
    });

    // Spawn debris periodically
    this.time.addEvent({
      delay: 1500,
      callback: this.spawnDebris,
      callbackScope: this,
      loop: true
    });

    // Earthquake shake effect
    this.time.addEvent({
      delay: 2000,
      callback: () => {
        if (!this.gameOver) {
          this.cameras.main.shake(300, 0.01);
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
  }

  update() {
    if (this.gameOver) return;

    // Player movement
    const speed = 200;
    
    if (this.cursors.left.isDown || this.wasd.left.isDown) {
      this.player.setVelocityX(-speed);
    } else if (this.cursors.right.isDown || this.wasd.right.isDown) {
      this.player.setVelocityX(speed);
    } else {
      this.player.setVelocityX(0);
    }

    if (this.cursors.up.isDown || this.wasd.up.isDown) {
      this.player.setVelocityY(-speed);
    } else if (this.cursors.down.isDown || this.wasd.down.isDown) {
      this.player.setVelocityY(speed);
    } else {
      this.player.setVelocityY(0);
    }

    // Remove debris that went off screen
    this.debris.children.entries.forEach(debris => {
      if (debris.y > 600) {
        debris.destroy();
      }
    });
  }

  spawnDebris() {
    if (this.gameOver) return;

    const x = Phaser.Math.Between(50, 750);
    const debris = this.debris.create(x, 0, 'debris');
    debris.setVelocityY(Phaser.Math.Between(150, 300));
    debris.setAngularVelocity(Phaser.Math.Between(-200, 200));
  }

  spawnAidKit() {
    if (this.gameOver) return;

    const x = Phaser.Math.Between(150, 650);
    const y = Phaser.Math.Between(200, 500);
    const aidKit = this.aidKits.create(x, y, 'aidkit');
    aidKit.setImmovable(true);

    // Spawn another after some time
    this.time.delayedCall(5000, this.spawnAidKit, [], this);
  }

  collectAidKit(player, aidKit) {
    aidKit.destroy();
    
    // Play collection sound effect (visual feedback)
    const flash = this.add.circle(player.x, player.y, 30, 0x4CAF50, 0.5);
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

    // Update lives display
    const hearts = '❤️'.repeat(this.lives);
    this.livesText.setText('Lives: ' + hearts);

    // Flash player
    this.cameras.main.flash(200, 255, 0, 0);

    if (this.lives <= 0) {
      this.endGame(false);
    }
  }

  reachSafeZone() {
    if (!this.gameOver) {
      this.endGame(true);
    }
  }

  updateTimer() {
    if (this.gameOver) return;

    this.timeLeft--;
    this.timerText.setText(`Time: ${this.timeLeft}s`);

    if (this.timeLeft <= 0) {
      this.endGame(false);
    }
  }

  endGame(success) {
    this.gameOver = true;
    this.physics.pause();

    const message = success 
      ? `🎉 SUCCESS!\n\nYou reached safety!\n\nYou learned:\n✓ Move to safe zones during earthquakes\n✓ Avoid falling debris\n✓ Help others (first aid kits)`
      : `⚠️ GAME OVER\n\nRemember:\n• Stay calm during earthquakes\n• Drop, Cover, Hold On\n• Move to open safe areas\n\nTry Again!`;

    const bg = this.add.rectangle(400, 300, 600, 400, 0x000000, 0.9);
    const text = this.add.text(400, 250, message, {
      fontSize: '20px',
      fontFamily: 'Arial',
      color: '#fff',
      align: 'center',
      lineSpacing: 10
    }).setOrigin(0.5);

    const restartBtn = this.add.text(400, 450, '🔄 Play Again', {
      fontSize: '24px',
      fontFamily: 'Arial',
      color: '#fff',
      backgroundColor: '#4CAF50',
      padding: { x: 20, y: 10 }
    }).setOrigin(0.5).setInteractive();

    restartBtn.on('pointerdown', () => {
      this.scene.restart();
    });

    const exitBtn = this.add.text(400, 500, '🏠 Back to Menu', {
      fontSize: '24px',
      fontFamily: 'Arial',
      color: '#fff',
      backgroundColor: '#f44336',
      padding: { x: 20, y: 10 }
    }).setOrigin(0.5).setInteractive();

    exitBtn.on('pointerdown', () => {
      this.scene.stop();
      this.registry.destroy();
      this.events.off();
      if (window.phaserGameCallback) {
        window.phaserGameCallback({ success });
      }
    });
  }
}
