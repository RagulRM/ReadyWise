import Phaser from 'phaser';
import VirtualJoystickPlugin from 'phaser3-rex-plugins/plugins/virtualjoystick-plugin.js';

// Tsunami Scene - Reach high ground before wave hits
export default class TsunamiScene extends Phaser.Scene {
  constructor() {
    super({ key: 'TsunamiScene' });
  }

  preload() {
    this.load.plugin('rexvirtualjoystickplugin', VirtualJoystickPlugin, true);
    this.createGraphics();
  }

  createGraphics() {
    const pg = this.make.graphics({ add: false });
    pg.fillStyle(0xFFEB3B); pg.fillCircle(15, 15, 15);
    pg.generateTexture('player', 30, 30); pg.destroy();

    const wg = this.make.graphics({ add: false });
    wg.fillStyle(0x1976D2, 0.8); wg.fillRect(0, 0, 800, 100);
    wg.generateTexture('wave', 800, 100); wg.destroy();

    const hg = this.make.graphics({ add: false });
    hg.fillStyle(0x4CAF50); hg.fillRect(0, 50, 100, 50);
    hg.fillStyle(0xE0E0E0); hg.fillRect(10, 10, 80, 40);
    hg.generateTexture('highground', 100, 100); hg.destroy();
  }

  create() {
    this.gameOver = false; this.lives = 3;
    this.waveDistance = 800;
    
    this.cameras.main.setBackgroundColor('#B3E5FC');

    this.add.text(400, 30, '🌊 TSUNAMI! Run to high ground!', {
      fontSize: '22px', color: '#000', backgroundColor: '#FFF', padding: { x: 10, y: 5 }
    }).setOrigin(0.5).setScrollFactor(0);

    this.player = this.physics.add.sprite(100, 500, 'player');
    this.player.setCollideWorldBounds(true);

    this.wave = this.add.tileSprite(0, 550, 800, 100, 'wave');
    this.wave.setOrigin(0, 0);

    this.highGround = this.physics.add.sprite(700, 300, 'highground');

    this.physics.add.overlap(this.player, this.highGround, () => {
      if (!this.gameOver) { this.endGame(true); }
    });

    this.waveText = this.add.text(16, 90, '🌊 Wave: Far', {
      fontSize: '18px', color: '#000', backgroundColor: '#1976D2', padding: { x: 10, y: 5 }
    }).setScrollFactor(0);

    this.time.addEvent({ delay: 100, callback: () => {
      if (!this.gameOver) {
        this.waveDistance -= 3;
        this.wave.x = 800 - this.waveDistance;
        
        const dist = this.waveDistance > 400 ? 'Far' : this.waveDistance > 200 ? 'Close' : 'VERY CLOSE!';
        this.waveText.setText(`🌊 Wave: ${dist}`);

        if (this.wave.x + 100 > this.player.x) {
          this.lives--;
          if (this.lives <= 0) this.endGame(false);
          else this.cameras.main.flash(200, 25, 118, 210);
        }
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
  }

  endGame(success) {
    this.gameOver = true; this.physics.pause();
    const msg = success 
      ? `🎉 SUCCESS!\n\nYou learned:\n✓ Move to high ground immediately\n✓ Don't wait for official warnings\n✓ Speed is critical`
      : `⚠️ GAME OVER\n\nRemember:\n• Feel earthquake? Move inland!\n• Go uphill, not inland only\n• Don't return until safe`;

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
