import Phaser from 'phaser';

export default class FloodScene extends Phaser.Scene {
  constructor() {
    super({ key: 'FloodScene' });
    this.lives = 3;
    this.gameOver = false;
  }

  preload() {
    this.createGraphics();
  }

  createGraphics() {
    // Player (person on raft)
    const playerGraphics = this.make.graphics({ x: 0, y: 0, add: false });
    playerGraphics.fillStyle(0x8B4513);
    playerGraphics.fillRect(0, 20, 40, 8);
    playerGraphics.fillStyle(0x4CAF50);
    playerGraphics.fillCircle(20, 15, 10);
    playerGraphics.generateTexture('player', 40, 32);
    playerGraphics.destroy();

    // Water
    const waterGraphics = this.make.graphics({ x: 0, y: 0, add: false });
    waterGraphics.fillStyle(0x2196F3, 0.7);
    waterGraphics.fillRect(0, 0, 800, 50);
    waterGraphics.generateTexture('water', 800, 50);
    waterGraphics.destroy();

    // Building (safe zone)
    const buildingGraphics = this.make.graphics({ x: 0, y: 0, add: false });
    buildingGraphics.fillStyle(0xE0E0E0);
    buildingGraphics.fillRect(0, 0, 80, 120);
    buildingGraphics.fillStyle(0x2196F3);
    buildingGraphics.fillRect(10, 10, 20, 20);
    buildingGraphics.fillRect(50, 10, 20, 20);
    buildingGraphics.fillRect(10, 40, 20, 20);
    buildingGraphics.fillRect(50, 40, 20, 20);
    buildingGraphics.fillRect(10, 70, 20, 20);
    buildingGraphics.fillRect(50, 70, 20, 20);
    buildingGraphics.generateTexture('building', 80, 120);
    buildingGraphics.destroy();

    // Obstacle (debris/log)
    const obstacleGraphics = this.make.graphics({ x: 0, y: 0, add: false });
    obstacleGraphics.fillStyle(0x8B4513);
    obstacleGraphics.fillRect(0, 0, 60, 20);
    obstacleGraphics.fillStyle(0x654321);
    obstacleGraphics.fillCircle(10, 10, 8);
    obstacleGraphics.fillCircle(50, 10, 8);
    obstacleGraphics.generateTexture('obstacle', 60, 20);
    obstacleGraphics.destroy();

    // Supply box
    const supplyGraphics = this.make.graphics({ x: 0, y: 0, add: false });
    supplyGraphics.fillStyle(0xFFC107);
    supplyGraphics.fillRect(0, 0, 25, 25);
    supplyGraphics.fillStyle(0xFF9800);
    supplyGraphics.fillRect(10, 0, 5, 25);
    supplyGraphics.fillRect(0, 10, 25, 5);
    supplyGraphics.generateTexture('supply', 25, 25);
    supplyGraphics.destroy();
  }

  create() {
    this.gameOver = false;
    this.lives = 3;

    this.cameras.main.setBackgroundColor('#B3E5FC');

    // Instructions
    this.add.text(400, 30, '🌊 FLOOD! Navigate to higher ground!', {
      fontSize: '24px',
      fontFamily: 'Arial',
      color: '#fff',
      backgroundColor: '#000',
      padding: { x: 10, y: 5 }
    }).setOrigin(0.5);

    this.add.text(400, 60, 'Arrow Keys / WASD | Avoid Debris | Collect Supplies!', {
      fontSize: '16px',
      fontFamily: 'Arial',
      color: '#fff',
      backgroundColor: '#000',
      padding: { x: 10, y: 5 }
    }).setOrigin(0.5);

    // Rising water level
    this.waterLevel = 550;
    this.water = this.add.tileSprite(400, this.waterLevel, 800, 50, 'water');
    this.water.setDepth(-1);

    // Player
    this.player = this.physics.add.sprite(100, 400, 'player');
    this.player.setCollideWorldBounds(true);

    // Safe building at the end
    this.building = this.physics.add.sprite(700, 400, 'building');
    this.building.setImmovable(true);

    // Obstacles
    this.obstacles = this.physics.add.group();
    
    // Supplies
    this.supplies = this.physics.add.group();

    // Collisions
    this.physics.add.overlap(this.player, this.building, this.reachSafety, null, this);
    this.physics.add.overlap(this.player, this.obstacles, this.hitObstacle, null, this);
    this.physics.add.overlap(this.player, this.supplies, this.collectSupply, null, this);

    // UI
    this.livesText = this.add.text(16, 90, 'Lives: ❤️❤️❤️', {
      fontSize: '20px',
      fontFamily: 'Arial',
      color: '#fff',
      backgroundColor: '#000',
      padding: { x: 10, y: 5 }
    });

    this.waterLevelText = this.add.text(650, 90, '🌊 Water Rising!', {
      fontSize: '20px',
      fontFamily: 'Arial',
      color: '#fff',
      backgroundColor: '#2196F3',
      padding: { x: 10, y: 5 }
    });

    // Water rises over time
    this.time.addEvent({
      delay: 2000,
      callback: () => {
        if (!this.gameOver && this.waterLevel > 200) {
          this.waterLevel -= 10;
          this.water.y = this.waterLevel;
          
          // Check if player is below water
          if (this.player.y > this.waterLevel - 30) {
            this.hitWater();
          }
        }
      },
      callbackScope: this,
      loop: true
    });

    // Spawn obstacles
    this.time.addEvent({
      delay: 2000,
      callback: this.spawnObstacle,
      callbackScope: this,
      loop: true
    });

    // Spawn supplies
    this.time.addEvent({
      delay: 3000,
      callback: this.spawnSupply,
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

    const speed = 180;
    
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

    // Clean up off-screen obstacles
    this.obstacles.children.entries.forEach(obs => {
      if (obs.x < -100 || obs.x > 900) {
        obs.destroy();
      }
    });
  }

  spawnObstacle() {
    if (this.gameOver) return;

    const side = Phaser.Math.Between(0, 1);
    const x = side === 0 ? -50 : 850;
    const y = Phaser.Math.Between(200, 500);
    
    const obstacle = this.obstacles.create(x, y, 'obstacle');
    obstacle.setVelocityX(side === 0 ? 100 : -100);
  }

  spawnSupply() {
    if (this.gameOver) return;

    const x = Phaser.Math.Between(150, 650);
    const y = Phaser.Math.Between(150, 450);
    
    this.supplies.create(x, y, 'supply').setImmovable(true);
  }

  collectSupply(player, supply) {
    supply.destroy();

    const flash = this.add.circle(player.x, player.y, 25, 0xFFC107, 0.7);
    this.tweens.add({
      targets: flash,
      alpha: 0,
      scale: 2,
      duration: 300,
      onComplete: () => flash.destroy()
    });
  }

  hitObstacle(player, obstacle) {
    obstacle.destroy();
    this.lives--;

    const hearts = '❤️'.repeat(this.lives);
    this.livesText.setText('Lives: ' + hearts);

    this.cameras.main.flash(200, 33, 150, 243);

    if (this.lives <= 0) {
      this.endGame(false);
    }
  }

  hitWater() {
    this.lives--;
    
    const hearts = '❤️'.repeat(this.lives);
    this.livesText.setText('Lives: ' + hearts);

    this.cameras.main.flash(200, 33, 150, 243);

    if (this.lives <= 0) {
      this.endGame(false);
    }
  }

  reachSafety() {
    if (!this.gameOver) {
      this.endGame(true);
    }
  }

  endGame(success) {
    this.gameOver = true;
    this.physics.pause();

    const message = success 
      ? `🎉 SUCCESS!\n\nYou reached higher ground!\n\nYou learned:\n✓ Move to higher floors during floods\n✓ Avoid debris in flood water\n✓ Collect emergency supplies`
      : `⚠️ GAME OVER\n\nRemember:\n• Never walk through flood water\n• Move to upper floors immediately\n• Don't drive through flooded roads\n\nTry Again!`;

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
