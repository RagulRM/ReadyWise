import Phaser from 'phaser';
import VirtualJoystickPlugin from 'phaser3-rex-plugins/plugins/virtualjoystick-plugin.js';

// Avalanche Scene - Ski away from avalanche
export default class AvalancheScene extends Phaser.Scene {
  constructor() {
    super({ key: 'AvalancheScene' });
  }

  preload() {
    this.load.plugin('rexvirtualjoystickplugin', VirtualJoystickPlugin, true);
    this.createGraphics();
  }

  createGraphics() {
    const pg = this.make.graphics({ add: false });
    pg.fillStyle(0xFF5722); pg.fillCircle(12, 12, 12);
    pg.fillStyle(0x000); pg.fillRect(10, 15, 4, 8);
    pg.generateTexture('player', 24, 24); pg.destroy();

    const sg = this.make.graphics({ add: false });
    sg.fillStyle(0xE0E0E0); sg.fillCircle(15, 15, 15);
    sg.generateTexture('snow', 30, 30); sg.destroy();

    const zg = this.make.graphics({ add: false });
    zg.fillStyle(0x4CAF50, 0.4); zg.fillRect(0, 0, 100, 80);
    zg.fillStyle(0x8B4513); zg.fillRect(35, 20, 30, 40);
    zg.generateTexture('safezone', 100, 80); zg.destroy();
  }

  create() {
    this.gameOver = false; this.lives = 3;
    this.cameras.main.setBackgroundColor('#E1F5FE');

    this.add.text(400, 30, '❄️ AVALANCHE! Ski to shelter!', {
      fontSize: '22px', color: '#000', backgroundColor: '#FFF', padding: { x: 10, y: 5 }
    }).setOrigin(0.5).setScrollFactor(0);

    this.player = this.physics.add.sprite(100, 300, 'player');
    this.player.setCollideWorldBounds(true);

    this.shelter = this.physics.add.sprite(700, 500, 'safezone');
    this.snowballs = this.physics.add.group();

    this.physics.add.overlap(this.player, this.shelter, () => {
      if (!this.gameOver) { this.endGame(true); }
    });

    this.physics.add.overlap(this.player, this.snowballs, (p, s) => {
      s.destroy();
      this.lives--;
      this.cameras.main.flash(200, 224, 224, 224);
      if (this.lives <= 0) this.endGame(false);
    });

    this.livesText = this.add.text(16, 90, 'Lives: ❤️❤️❤️', {
      fontSize: '18px', color: '#000', backgroundColor: '#FFF', padding: { x: 10, y: 5 }
    }).setScrollFactor(0);

    this.time.addEvent({ delay: 1000, callback: this.spawnSnow, callbackScope: this, loop: true });

    this.cursors = this.input.keyboard.createCursorKeys();
    this.wasd = this.input.keyboard.addKeys({ up: 'W', down: 'S', left: 'A', right: 'D' });

    this.joyStick = this.plugins.get('rexvirtualjoystickplugin').add(this, {
      x: 100, y: 500, radius: 50,
      base: this.add.circle(0, 0, 50, 0x888888, 0.5),
      thumb: this.add.circle(0, 0, 25, 0xcccccc, 0.8)
    });
    this.joyStick.base.setScrollFactor(0);
    this.joyStick.thumb.setScrollFactor(0);
  }

  update() {
    if (this.gameOver) return;
    const speed = 200;
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

    const hearts = '❤️'.repeat(this.lives);
    this.livesText.setText('Lives: ' + hearts);
  }

  spawnSnow() {
    if (this.gameOver) return;
    const x = Phaser.Math.Between(50, 750);
    const snow = this.snowballs.create(x, 0, 'snow');
    snow.setVelocity(Phaser.Math.Between(-50, 50), Phaser.Math.Between(200, 300));
  }

  endGame(success) {
    this.gameOver = true; this.physics.pause();
    const msg = success 
      ? `🎉 SUCCESS!\n\nYou learned:\n✓ Move perpendicular to avalanche\n✓ Seek shelter immediately\n✓ Stay on ridges, not valleys`
      : `⚠️ GAME OVER\n\nRemember:\n• Check avalanche forecasts\n• Carry safety equipment\n• Know escape routes`;

    this.add.rectangle(400, 300, 600, 400, 0x000000, 0.9).setScrollFactor(0);
    this.add.text(400, 250, msg, { fontSize: '18px', color: '#fff', align: 'center' }).setOrigin(0.5).setScrollFactor(0);

    const restart = this.add.text(400, 450, '🔄 Play Again', {
      fontSize: '22px', color: '#fff', backgroundColor: '#4CAF50', padding: { x: 20, y: 10 }
    }).setOrigin(0.5).setInteractive().setScrollFactor(0);
    restart.on('pointerdown', () => this.scene.restart());

    const exit = this.add.text(400, 500, '🏠 Back', {
      fontSize: '22px', color: '#fff', backgroundColor: '#f44336', padding: { x: 20, y: 10 }
    }).setOrigin(0.5).setInteractive().setScrollFactor(0);
    exit.on('pointerdown', () => {
      this.scene.stop();
      if (window.phaserGameCallback) window.phaserGameCallback({ success });
    });
  }
}
