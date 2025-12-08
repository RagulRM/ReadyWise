import Phaser from 'phaser';
import VirtualJoystickPlugin from 'phaser3-rex-plugins/plugins/virtualjoystick-plugin.js';

// Stampede Scene - Navigate crowd safely
export default class StampedeScene extends Phaser.Scene {
  constructor() {
    super({ key: 'StampedeScene' });
  }

  preload() {
    this.load.plugin('rexvirtualjoystickplugin', VirtualJoystickPlugin, true);
    this.createGraphics();
  }

  createGraphics() {
    const pg = this.make.graphics({ add: false });
    pg.fillStyle(0x2196F3); pg.fillCircle(12, 12, 12);
    pg.generateTexture('player', 24, 24); pg.destroy();

    const cg = this.make.graphics({ add: false });
    cg.fillStyle(0xFF9800); cg.fillCircle(10, 10, 10);
    cg.generateTexture('crowd', 20, 20); cg.destroy();

    const eg = this.make.graphics({ add: false });
    eg.fillStyle(0x4CAF50); eg.fillRect(0, 0, 80, 100);
    eg.fillStyle(0xFFF); eg.fillRect(25, 30, 30, 40);
    eg.generateTexture('exit', 80, 100); eg.destroy();
  }

  create() {
    this.gameOver = false; this.lives = 3;
    this.cameras.main.setBackgroundColor('#FFEBEE');

    this.add.text(400, 30, '🏃 STAMPEDE! Navigate crowd to exit!', {
      fontSize: '22px', color: '#000', backgroundColor: '#FFF', padding: { x: 10, y: 5 }
    }).setOrigin(0.5).setScrollFactor(0);

    this.player = this.physics.add.sprite(100, 300, 'player');
    this.player.setCollideWorldBounds(true);

    this.exitDoor = this.physics.add.sprite(700, 450, 'exit');
    this.crowd = this.physics.add.group();

    for (let i = 0; i < 12; i++) {
      const x = Phaser.Math.Between(200, 700);
      const y = Phaser.Math.Between(100, 500);
      const person = this.crowd.create(x, y, 'crowd');
      person.setVelocity(Phaser.Math.Between(-100, 100), Phaser.Math.Between(-100, 100));
      person.setBounce(1);
      person.setCollideWorldBounds(true);
    }

    this.physics.add.collider(this.crowd, this.crowd);
    this.physics.add.overlap(this.player, this.exitDoor, () => {
      if (!this.gameOver) { this.endGame(true); }
    });
    this.physics.add.overlap(this.player, this.crowd, (p, c) => {
      this.lives--; this.cameras.main.flash(150, 255, 152, 0);
      if (this.lives <= 0) this.endGame(false);
    });

    this.livesText = this.add.text(16, 90, 'Lives: ❤️❤️❤️', {
      fontSize: '18px', color: '#000', backgroundColor: '#FFF', padding: { x: 10, y: 5 }
    }).setScrollFactor(0);

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
    const speed = 150;
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

  endGame(success) {
    this.gameOver = true; this.physics.pause();
    const msg = success 
      ? `🎉 SUCCESS!\n\nYou learned:\n✓ Stay calm in crowds\n✓ Move to edges\n✓ Find nearest exit`
      : `⚠️ GAME OVER\n\nRemember:\n• Don't push others\n• Stay on your feet\n• Move sideways out of crowd`;

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
