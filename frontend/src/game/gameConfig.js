import Phaser from 'phaser';
import EarthquakeScene from './scenes/EarthquakeScene';
import FloodScene from './scenes/FloodScene';
import CycloneScene from './scenes/CycloneScene';
import FireScene from './scenes/FireScene';
import DroughtScene from './scenes/DroughtScene';
import LandslideScene from './scenes/LandslideScene';
import StampedeScene from './scenes/StampedeScene';
import HeatwaveScene from './scenes/HeatwaveScene';
import TsunamiScene from './scenes/TsunamiScene';
import AvalancheScene from './scenes/AvalancheScene';

export const createGameConfig = (disasterType, containerId) => {
  // Map disaster types to scenes
  const sceneMap = {
    earthquake: EarthquakeScene,
    flood: FloodScene,
    cyclone: CycloneScene,
    fire: FireScene,
    drought: DroughtScene,
    landslide: LandslideScene,
    stampede: StampedeScene,
    heatwave: HeatwaveScene,
    tsunami: TsunamiScene,
    avalanche: AvalancheScene
  };

  const SceneClass = sceneMap[disasterType.toLowerCase()] || EarthquakeScene;

  return {
    type: Phaser.AUTO,
    parent: containerId,
    width: 800,
    height: 600,
    backgroundColor: '#87CEEB',
    physics: {
      default: 'arcade',
      arcade: {
        gravity: { y: 0 },
        debug: false
      }
    },
    scene: SceneClass,
    scale: {
      mode: Phaser.Scale.FIT,
      autoCenter: Phaser.Scale.CENTER_BOTH
    }
  };
};
