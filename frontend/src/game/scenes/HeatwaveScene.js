import Phaser from 'phaser';
import VirtualJoystickPlugin from 'phaser3-rex-plugins/plugins/virtualjoystick-plugin.js';

// Heatwave Scene - Find shade and water
export default class HeatwaveScene extends Phaser.Scene {
  constructor() {
    super({ key: 'HeatwaveScene' });
  }

  preload() {
    this.load.plugin('rexvirtualjoystickplugin', VirtualJoystickPlugin, true);
    this.createGraphics();
  }

  createGraphics() {
    const pg = this.make.graphics({ add: false });
    pg.fillStyle(0xFF5722); pg.fillCircle(15, 15, 15);
    pg.generateTexture('player', 30, 30); pg.destroy();

    const wg = this.make.graphics({ add: false });
    wg.fillStyle(0x2196F3); wg.fillCircle(10, 10, 10);
    wg.generateTexture('water', 20, 20); wg.destroy();

    const sg = this.make.graphics({ add: false });
    sg.fillStyle(0x4CAF50, 0.4); sg.fillRect(0, 0, 100, 120);
    sg.generateTexture('shade', 100, 120); sg.destroy();
  }

  create() {
    this.gameOver = false; this.heatLevel = 0;
    this.cameras.main.setBackgroundColor('#FFEB3B');

    this.add.text(400, 30, '🌡️ HEATWAVE! Find shade & water!', {
      fontSize: '22px', color: '#000', backgroundColor: '#FFF', padding: { x: 10, y: 5 }
    }).setOrigin(0.5).setScrollFactor(0);

    this.player = this.physics.add.sprite(400, 300, 'player');
    this.player.setCollideWorldBounds(true);

    this.shadeZone = this.physics.add.sprite(700, 400, 'shade');
    this.waterBottles = this.physics.add.group();

    for (let i = 0; i < 5; i++) {
      const x = Phaser.Math.Between(100, 700);
      const y = Phaser.Math.Between(150, 500);
      this.waterBottles.create(x, y, 'water').setImmovable(true);
    }

    this.physics.add.overlap(this.player, this.shadeZone, () => {
      if (!this.gameOver && this.heatLevel < 100) {
        this.endGame(true);
      }
    });

    this.physics.add.overlap(this.player, this.waterBottles, (p, w) => {
      w.destroy();
      this.heatLevel = Math.max(0, this.heatLevel - 20);
      this.add.circle(p.x, p.y, 20, 0x2196F3, 0.7).setAlpha(0);
    });

    this.heatText = this.add.text(16, 90, '🔥 Heat: 0%', {
      fontSize: '18px', color: '#000', backgroundColor: '#FF5722', padding: { x: 10, y: 5 }
    }).setScrollFactor(0);

    this.time.addEvent({ delay: 500, callback: () => {
      if (!this.gameOver) {
        this.heatLevel += 1;
        this.heatText.setText(`🔥 Heat: ${this.heatLevel}%`);
        if (this.heatLevel >= 100) this.endGame(false);
      }
    }, loop: true });

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
    const speed = 160;
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
      ? `🎉 SUCCESS!\n\nYou learned:\n✓ Stay in shade\n✓ Drink water regularly\n✓ Avoid outdoor activity`
      : `⚠️ GAME OVER\n\nRemember:\n• Stay hydrated\n• Avoid peak sun hours\n• Wear light clothing`;

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
