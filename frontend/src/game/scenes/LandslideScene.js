import Phaser from 'phaser';
import VirtualJoystickPlugin from 'phaser3-rex-plugins/plugins/virtualjoystick-plugin.js';

export default class LandslideScene extends Phaser.Scene {
  constructor() {
    super({ key: 'LandslideScene' });
  }

  preload() {
    this.load.plugin('rexvirtualjoystickplugin', VirtualJoystickPlugin, true);
    this.createGraphics();
  }

  createGraphics() {
    const playerG = this.make.graphics({ add: false });
    playerG.fillStyle(0x4CAF50);
    playerG.fillCircle(16, 16, 16);
    playerG.generateTexture('player', 32, 32);
    playerG.destroy();

    const rockG = this.make.graphics({ add: false });
    rockG.fillStyle(0x795548);
    rockG.fillCircle(20, 20, 20);
    rockG.generateTexture('rock', 40, 40);
    rockG.destroy();

    const safeG = this.make.graphics({ add: false });
    safeG.fillStyle(0x4CAF50, 0.3);
    safeG.fillRect(0, 0, 100, 80);
    safeG.lineStyle(4, 0x4CAF50);
    safeG.strokeRect(0, 0, 100, 80);
    safeG.generateTexture('safezone', 100, 80);
    safeG.destroy();
  }

  create() {
    this.gameOver = false;
    this.lives = 3;

    this.cameras.main.setBackgroundColor('#8D6E63');

    this.add.text(400, 30, '⛰️ LANDSLIDE! Avoid falling rocks!', {
      fontSize: '24px', fontFamily: 'Arial', color: '#fff',
      backgroundColor: '#000', padding: { x: 10, y: 5 }
    }).setOrigin(0.5).setScrollFactor(0);

    this.player = this.physics.add.sprite(100, 500, 'player');
    this.player.setCollideWorldBounds(true);

    this.safeZone = this.physics.add.sprite(700, 500, 'safezone');
    this.rocks = this.physics.add.group();

    this.physics.add.overlap(this.player, this.safeZone, () => {
      if (!this.gameOver) {
        this.endGame(true);
      }
    }, null, this);

    this.physics.add.overlap(this.player, this.rocks, (p, rock) => {
      rock.destroy();
      this.lives--;
      if (this.lives <= 0) this.endGame(false);
      this.cameras.main.flash(200, 121, 85, 72);
    }, null, this);

    this.livesText = this.add.text(16, 90, 'Lives: ❤️❤️❤️', {
      fontSize: '20px', color: '#fff', backgroundColor: '#000', padding: { x: 10, y: 5 }
    }).setScrollFactor(0);

    this.time.addEvent({ delay: 1200, callback: this.spawnRock, callbackScope: this, loop: true });

    this.cursors = this.input.keyboard.createCursorKeys();
    this.wasd = this.input.keyboard.addKeys({
      up: 'W', down: 'S', left: 'A', right: 'D'
    });

    this.joyStick = this.plugins.get('rexvirtualjoystickplugin').add(this, {
      x: 100, y: 500, radius: 50,
      base: this.add.circle(0, 0, 50, 0x888888, 0.5),
      thumb: this.add.circle(0, 0, 25, 0xcccccc, 0.8),
    });
    this.joyStick.base.setScrollFactor(0);
    this.joyStick.thumb.setScrollFactor(0);
  }

  update() {
    if (this.gameOver) return;

    const speed = 190;
    let vx = 0, vy = 0;

    if (this.cursors.left.isDown || this.wasd.left.isDown) vx = -speed;
    else if (this.cursors.right.isDown || this.wasd.right.isDown) vx = speed;
    if (this.cursors.up.isDown || this.wasd.up.isDown) vy = -speed;
    else if (this.cursors.down.isDown || this.wasd.down.isDown) vy = speed;

    if (this.joyStick.force > 0) {
      vx = Math.cos(this.joyStick.angle) * speed * this.joyStick.force;
      vy = Math.sin(this.joyStick.angle) * speed * this.joyStick.force;
    }

    this.player.setVelocity(vx, vy);
  }

  spawnRock() {
    if (this.gameOver) return;
    const x = Phaser.Math.Between(200, 750);
    const rock = this.rocks.create(x, 0, 'rock');
    rock.setVelocity(Phaser.Math.Between(-50, 50), Phaser.Math.Between(200, 350));
    rock.setAngularVelocity(Phaser.Math.Between(-200, 200));
  }

  endGame(success) {
    this.gameOver = true;
    this.physics.pause();

    const message = success 
      ? `🎉 SUCCESS!\n\nYou learned:\n✓ Move to stable ground\n✓ Avoid landslide paths\n✓ Quick evacuation saves lives`
      : `⚠️ GAME OVER\n\nRemember:\n• Stay away from slopes during rain\n• Watch for warning signs\n• Evacuate immediately\n\nTry Again!`;

    const bg = this.add.rectangle(400, 300, 600, 400, 0x000000, 0.9).setScrollFactor(0);
    this.add.text(400, 250, message, {
      fontSize: '20px', color: '#fff', align: 'center', lineSpacing: 10
    }).setOrigin(0.5).setScrollFactor(0);

    const restartBtn = this.add.text(400, 450, '🔄 Play Again', {
      fontSize: '24px', color: '#fff', backgroundColor: '#4CAF50', padding: { x: 20, y: 10 }
    }).setOrigin(0.5).setInteractive().setScrollFactor(0);
    restartBtn.on('pointerdown', () => this.scene.restart());

    const exitBtn = this.add.text(400, 500, '🏠 Back', {
      fontSize: '24px', color: '#fff', backgroundColor: '#f44336', padding: { x: 20, y: 10 }
    }).setOrigin(0.5).setInteractive().setScrollFactor(0);
    exitBtn.on('pointerdown', () => {
      this.scene.stop();
      if (window.phaserGameCallback) window.phaserGameCallback({ success });
    });
  }
}
