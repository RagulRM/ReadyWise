/**
 * Third Person Perspective (TPP) Game Engine
 * Core engine for disaster response training games
 * Features: WASD movement, mouse look, climbing, fullscreen, goal system
 */

import React, { useRef, useEffect, useState, useCallback } from 'react';
import * as THREE from 'three';

// Constants
const PLAYER_SPEED = 5;
const PLAYER_JUMP_FORCE = 8;
const GRAVITY = 20;
const CAMERA_DISTANCE = 8;
const CAMERA_HEIGHT = 4;
const MOUSE_SENSITIVITY = 0.002;

/**
 * TPP Game Engine Component
 */
function TPPGameEngine({ 
  disasterType,
  onComplete,
  onProgress,
  environmentConfig,
  goals,
  instructions,
  obstacles,
  collectibles
}) {
  const containerRef = useRef(null);
  const rendererRef = useRef(null);
  const sceneRef = useRef(null);
  const cameraRef = useRef(null);
  const playerRef = useRef(null);
  const clockRef = useRef(new THREE.Clock());
  const keysRef = useRef({});
  const mouseRef = useRef({ x: 0, y: 0 });
  const velocityRef = useRef(new THREE.Vector3());
  const isGroundedRef = useRef(true);
  const cameraAngleRef = useRef({ horizontal: 0, vertical: 0.3 });
  const animationFrameRef = useRef(null);
  
  // Disaster effect refs
  const disasterEffectsRef = useRef({
    particles: [],
    rain: null,
    wind: { strength: 0, direction: new THREE.Vector3() },
    water: { level: 0, rising: false },
    shake: { intensity: 0, active: false },
    debris: [],
    trees: [],
    flames: [],
    snowflakes: [],
    crowds: [],
    ladders: []
  });
  const screenShakeRef = useRef({ x: 0, y: 0 });
  const waterLevelRef = useRef(0);
  const isSwimmingRef = useRef(false);
  const isClimbingRef = useRef(false);

  const [score, setScore] = useState(0);
  const [currentGoalIndex, setCurrentGoalIndex] = useState(0);
  const [isFullscreen, setIsFullscreen] = useState(false);
  const [showInstructions, setShowInstructions] = useState(true);
  const [gameStarted, setGameStarted] = useState(false);
  const [goalReached, setGoalReached] = useState(false);
  const [collectedItems, setCollectedItems] = useState([]);
  const [health, setHealth] = useState(100);
  const [timeElapsed, setTimeElapsed] = useState(0);
  const [waterLevel, setWaterLevel] = useState(0);
  const [isSwimming, setIsSwimming] = useState(false);
  const [isClimbing, setIsClimbing] = useState(false);
  const [windIntensity, setWindIntensity] = useState(0);
  const [statusEffect, setStatusEffect] = useState(null); // 'drowning', 'burning', 'freezing', etc.

  // Initialize Three.js scene
  const initScene = useCallback(() => {
    if (!containerRef.current) return;

    // Scene
    const scene = new THREE.Scene();
    scene.fog = new THREE.Fog(environmentConfig?.fogColor || 0x87ceeb, 20, 100);
    sceneRef.current = scene;

    // Camera
    const camera = new THREE.PerspectiveCamera(
      60,
      window.innerWidth / window.innerHeight,
      0.1,
      1000
    );
    cameraRef.current = camera;

    // Renderer
    const renderer = new THREE.WebGLRenderer({ antialias: true });
    renderer.setSize(window.innerWidth, window.innerHeight);
    renderer.setPixelRatio(Math.min(window.devicePixelRatio, 2));
    renderer.shadowMap.enabled = true;
    renderer.shadowMap.type = THREE.PCFSoftShadowMap;
    containerRef.current.appendChild(renderer.domElement);
    rendererRef.current = renderer;

    // Lighting
    setupLighting(scene, environmentConfig);

    // Environment
    setupEnvironment(scene, environmentConfig);

    // Player
    const player = createPlayer();
    scene.add(player);
    playerRef.current = player;

    // Goals
    createGoals(scene, goals);

    // Obstacles
    createObstacles(scene, obstacles);

    // Collectibles
    createCollectibles(scene, collectibles);

    // Set initial camera position
    updateCamera();

    return () => {
      if (rendererRef.current && containerRef.current) {
        containerRef.current.removeChild(rendererRef.current.domElement);
      }
      rendererRef.current?.dispose();
    };
  }, [environmentConfig, goals, obstacles, collectibles]);

  // Setup lighting based on disaster type
  const setupLighting = (scene, config) => {
    // Ambient light
    const ambientLight = new THREE.AmbientLight(
      config?.ambientColor || 0x404040,
      config?.ambientIntensity || 0.5
    );
    scene.add(ambientLight);

    // Directional light (sun)
    const directionalLight = new THREE.DirectionalLight(
      config?.sunColor || 0xffffff,
      config?.sunIntensity || 1
    );
    directionalLight.position.set(50, 100, 50);
    directionalLight.castShadow = true;
    directionalLight.shadow.mapSize.width = 2048;
    directionalLight.shadow.mapSize.height = 2048;
    directionalLight.shadow.camera.near = 0.5;
    directionalLight.shadow.camera.far = 500;
    directionalLight.shadow.camera.left = -100;
    directionalLight.shadow.camera.right = 100;
    directionalLight.shadow.camera.top = 100;
    directionalLight.shadow.camera.bottom = -100;
    scene.add(directionalLight);

    // Hemisphere light for better ambient
    const hemiLight = new THREE.HemisphereLight(
      config?.skyColor || 0x87ceeb,
      config?.groundColor || 0x444444,
      0.4
    );
    scene.add(hemiLight);
  };

  // Setup environment based on config
  const setupEnvironment = (scene, config) => {
    // Sky
    scene.background = new THREE.Color(config?.skyColor || 0x87ceeb);

    // Ground
    const groundGeometry = new THREE.PlaneGeometry(200, 200, 50, 50);
    const groundMaterial = new THREE.MeshStandardMaterial({
      color: config?.groundColor || 0x3d5c3d,
      roughness: 0.8,
      metalness: 0.1
    });
    const ground = new THREE.Mesh(groundGeometry, groundMaterial);
    ground.rotation.x = -Math.PI / 2;
    ground.receiveShadow = true;
    ground.userData.isGround = true;
    scene.add(ground);

    // Add terrain variation
    if (config?.terrainHeight) {
      const positions = groundGeometry.attributes.position.array;
      for (let i = 0; i < positions.length; i += 3) {
        positions[i + 2] = Math.random() * config.terrainHeight;
      }
      groundGeometry.computeVertexNormals();
    }

    // Add environment objects based on disaster type
    addEnvironmentObjects(scene, config);
    
    // Initialize disaster-specific effects
    initializeDisasterEffects(scene, disasterType);
  };

  // Initialize disaster-specific visual effects
  const initializeDisasterEffects = (scene, type) => {
    const effects = disasterEffectsRef.current;
    
    switch (type?.toLowerCase()) {
      case 'earthquake':
        initEarthquakeEffects(scene);
        break;
      case 'tsunami':
        initTsunamiEffects(scene);
        break;
      case 'flood':
        initFloodEffects(scene);
        break;
      case 'fire':
        initFireEffects(scene);
        break;
      case 'cyclone':
        initCycloneEffects(scene);
        break;
      case 'heatwave':
        initHeatwaveEffects(scene);
        break;
      case 'drought':
        initDroughtEffects(scene);
        break;
      case 'landslide':
        initLandslideEffects(scene);
        break;
      case 'stampede':
        initStampedeEffects(scene);
        break;
      case 'avalanche':
        initAvalancheEffects(scene);
        break;
    }
  };

  // EARTHQUAKE EFFECTS - Screen shake, falling debris, cracking ground
  const initEarthquakeEffects = (scene) => {
    const effects = disasterEffectsRef.current;
    effects.shake.active = true;
    effects.shake.intensity = 0.3;
    
    // Create falling debris
    for (let i = 0; i < 30; i++) {
      const debrisGeometry = new THREE.BoxGeometry(
        0.3 + Math.random() * 0.5,
        0.3 + Math.random() * 0.5,
        0.3 + Math.random() * 0.5
      );
      const debrisMaterial = new THREE.MeshStandardMaterial({
        color: Math.random() > 0.5 ? 0x808080 : 0x5d4e37
      });
      const debris = new THREE.Mesh(debrisGeometry, debrisMaterial);
      debris.position.set(
        (Math.random() - 0.5) * 80,
        20 + Math.random() * 30,
        (Math.random() - 0.5) * 80
      );
      debris.userData.isDebris = true;
      debris.userData.fallSpeed = 5 + Math.random() * 10;
      debris.userData.rotation = new THREE.Vector3(
        Math.random() * 0.1,
        Math.random() * 0.1,
        Math.random() * 0.1
      );
      debris.castShadow = true;
      scene.add(debris);
      effects.debris.push(debris);
    }
    
    // Create ground cracks
    for (let i = 0; i < 15; i++) {
      const crackGroup = new THREE.Group();
      const crackLength = 5 + Math.random() * 15;
      const segments = Math.floor(crackLength / 2);
      
      for (let j = 0; j < segments; j++) {
        const crackGeometry = new THREE.PlaneGeometry(0.3 + Math.random() * 0.3, 2);
        const crackMaterial = new THREE.MeshStandardMaterial({
          color: 0x1a1a1a,
          roughness: 1
        });
        const crack = new THREE.Mesh(crackGeometry, crackMaterial);
        crack.rotation.x = -Math.PI / 2;
        crack.position.set(
          (Math.random() - 0.5) * 2,
          0.01,
          j * 2 - crackLength / 2
        );
        crack.rotation.z = (Math.random() - 0.5) * 0.5;
        crackGroup.add(crack);
      }
      
      crackGroup.position.set(
        (Math.random() - 0.5) * 100,
        0,
        (Math.random() - 0.5) * 100
      );
      crackGroup.rotation.y = Math.random() * Math.PI;
      crackGroup.userData.isCrack = true;
      crackGroup.userData.damage = 15;
      scene.add(crackGroup);
    }
  };

  // TSUNAMI EFFECTS - Rising water, waves, floating debris
  const initTsunamiEffects = (scene) => {
    const effects = disasterEffectsRef.current;
    effects.water.rising = true;
    
    // Create large water plane
    const waterGeometry = new THREE.PlaneGeometry(250, 250, 100, 100);
    const waterMaterial = new THREE.MeshStandardMaterial({
      color: 0x006994,
      transparent: true,
      opacity: 0.85,
      roughness: 0.1,
      metalness: 0.3
    });
    const water = new THREE.Mesh(waterGeometry, waterMaterial);
    water.rotation.x = -Math.PI / 2;
    water.position.y = -2;
    water.userData.isFloodWater = true;
    scene.add(water);
    effects.water.mesh = water;
    
    // Create floating debris
    for (let i = 0; i < 20; i++) {
      const debrisTypes = ['box', 'plank', 'barrel'];
      const type = debrisTypes[Math.floor(Math.random() * debrisTypes.length)];
      let geometry;
      
      if (type === 'box') {
        geometry = new THREE.BoxGeometry(1, 0.8, 1);
      } else if (type === 'plank') {
        geometry = new THREE.BoxGeometry(2, 0.2, 0.4);
      } else {
        geometry = new THREE.CylinderGeometry(0.4, 0.4, 1, 8);
      }
      
      const material = new THREE.MeshStandardMaterial({
        color: type === 'barrel' ? 0x8b4513 : 0x5d4e37
      });
      const debris = new THREE.Mesh(geometry, material);
      debris.position.set(
        (Math.random() - 0.5) * 100,
        -1,
        (Math.random() - 0.5) * 100
      );
      debris.userData.isFloating = true;
      debris.userData.floatOffset = Math.random() * Math.PI * 2;
      debris.castShadow = true;
      scene.add(debris);
      effects.debris.push(debris);
    }
    
    // Create wave particles
    for (let i = 0; i < 200; i++) {
      const dropGeometry = new THREE.SphereGeometry(0.05, 4, 4);
      const dropMaterial = new THREE.MeshBasicMaterial({
        color: 0x87ceeb,
        transparent: true,
        opacity: 0.6
      });
      const drop = new THREE.Mesh(dropGeometry, dropMaterial);
      drop.position.set(
        (Math.random() - 0.5) * 100,
        Math.random() * 5,
        (Math.random() - 0.5) * 100
      );
      drop.userData.isWaveParticle = true;
      drop.userData.speed = 2 + Math.random() * 3;
      scene.add(drop);
      effects.particles.push(drop);
    }
  };

  // FLOOD EFFECTS - Rising water, ladders, half-drowning
  const initFloodEffects = (scene) => {
    const effects = disasterEffectsRef.current;
    effects.water.rising = true;
    
    // Create muddy flood water
    const waterGeometry = new THREE.PlaneGeometry(250, 250, 50, 50);
    const waterMaterial = new THREE.MeshStandardMaterial({
      color: 0x5d4e37,
      transparent: true,
      opacity: 0.9,
      roughness: 0.3
    });
    const water = new THREE.Mesh(waterGeometry, waterMaterial);
    water.rotation.x = -Math.PI / 2;
    water.position.y = -0.5;
    water.userData.isFloodWater = true;
    scene.add(water);
    effects.water.mesh = water;
    
    // Create ladders on buildings
    const ladderPositions = [
      { x: 10, z: 10 }, { x: -15, z: 20 }, { x: 25, z: -10 },
      { x: -20, z: -15 }, { x: 30, z: 25 }
    ];
    
    ladderPositions.forEach(pos => {
      const ladderGroup = new THREE.Group();
      
      // Ladder rails
      const railGeometry = new THREE.BoxGeometry(0.1, 8, 0.1);
      const railMaterial = new THREE.MeshStandardMaterial({ color: 0xffd700 });
      
      const leftRail = new THREE.Mesh(railGeometry, railMaterial);
      leftRail.position.x = -0.3;
      ladderGroup.add(leftRail);
      
      const rightRail = new THREE.Mesh(railGeometry, railMaterial);
      rightRail.position.x = 0.3;
      ladderGroup.add(rightRail);
      
      // Rungs
      for (let i = 0; i < 10; i++) {
        const rungGeometry = new THREE.BoxGeometry(0.6, 0.08, 0.1);
        const rung = new THREE.Mesh(rungGeometry, railMaterial);
        rung.position.y = -3.5 + i * 0.8;
        ladderGroup.add(rung);
      }
      
      ladderGroup.position.set(pos.x, 4, pos.z);
      ladderGroup.userData.isLadder = true;
      ladderGroup.userData.climbHeight = 8;
      scene.add(ladderGroup);
      effects.ladders.push(ladderGroup);
    });
    
    // Create floating objects
    for (let i = 0; i < 25; i++) {
      const types = ['car', 'log', 'furniture'];
      const type = types[Math.floor(Math.random() * types.length)];
      let mesh;
      
      if (type === 'car') {
        const carGroup = new THREE.Group();
        const bodyGeometry = new THREE.BoxGeometry(2, 0.8, 1);
        const bodyMaterial = new THREE.MeshStandardMaterial({
          color: Math.random() > 0.5 ? 0xff0000 : 0x0000ff
        });
        const body = new THREE.Mesh(bodyGeometry, bodyMaterial);
        carGroup.add(body);
        mesh = carGroup;
      } else if (type === 'log') {
        const logGeometry = new THREE.CylinderGeometry(0.3, 0.3, 3, 8);
        const logMaterial = new THREE.MeshStandardMaterial({ color: 0x4a3728 });
        mesh = new THREE.Mesh(logGeometry, logMaterial);
        mesh.rotation.z = Math.PI / 2;
      } else {
        const furnGeometry = new THREE.BoxGeometry(1, 0.5, 1);
        const furnMaterial = new THREE.MeshStandardMaterial({ color: 0x8b4513 });
        mesh = new THREE.Mesh(furnGeometry, furnMaterial);
      }
      
      mesh.position.set(
        (Math.random() - 0.5) * 80,
        0,
        (Math.random() - 0.5) * 80
      );
      mesh.userData.isFloating = true;
      mesh.userData.floatOffset = Math.random() * Math.PI * 2;
      mesh.userData.damage = 10;
      mesh.castShadow = true;
      scene.add(mesh);
      effects.debris.push(mesh);
    }
  };

  // FIRE EFFECTS - Animated flames, smoke, spreading fire
  const initFireEffects = (scene) => {
    const effects = disasterEffectsRef.current;
    
    // Create fire sources
    const firePositions = [];
    for (let i = 0; i < 15; i++) {
      firePositions.push({
        x: (Math.random() - 0.5) * 60,
        z: (Math.random() - 0.5) * 60
      });
    }
    
    firePositions.forEach(pos => {
      const fireGroup = new THREE.Group();
      
      // Create flame particles
      for (let i = 0; i < 15; i++) {
        const flameGeometry = new THREE.ConeGeometry(0.3 + Math.random() * 0.4, 1.5 + Math.random(), 8);
        const flameMaterial = new THREE.MeshBasicMaterial({
          color: new THREE.Color().setHSL(0.05 + Math.random() * 0.05, 1, 0.5),
          transparent: true,
          opacity: 0.9
        });
        const flame = new THREE.Mesh(flameGeometry, flameMaterial);
        flame.position.set(
          (Math.random() - 0.5) * 2,
          Math.random() * 2,
          (Math.random() - 0.5) * 2
        );
        flame.userData.baseY = flame.position.y;
        flame.userData.flickerSpeed = 5 + Math.random() * 5;
        flame.userData.flickerOffset = Math.random() * Math.PI * 2;
        fireGroup.add(flame);
      }
      
      // Add point light for glow
      const fireLight = new THREE.PointLight(0xff4500, 2, 15);
      fireLight.position.y = 2;
      fireGroup.add(fireLight);
      
      fireGroup.position.set(pos.x, 0, pos.z);
      fireGroup.userData.isFire = true;
      fireGroup.userData.damage = 15;
      fireGroup.userData.light = fireLight;
      scene.add(fireGroup);
      effects.flames.push(fireGroup);
    });
    
    // Create smoke particles
    for (let i = 0; i < 100; i++) {
      const smokeGeometry = new THREE.SphereGeometry(0.5 + Math.random() * 1, 8, 8);
      const smokeMaterial = new THREE.MeshBasicMaterial({
        color: 0x333333,
        transparent: true,
        opacity: 0.3
      });
      const smoke = new THREE.Mesh(smokeGeometry, smokeMaterial);
      smoke.position.set(
        (Math.random() - 0.5) * 80,
        5 + Math.random() * 20,
        (Math.random() - 0.5) * 80
      );
      smoke.userData.isSmoke = true;
      smoke.userData.riseSpeed = 1 + Math.random() * 2;
      smoke.userData.drift = (Math.random() - 0.5) * 0.5;
      scene.add(smoke);
      effects.particles.push(smoke);
    }
  };

  // CYCLONE EFFECTS - Wind, rain, swaying trees, flying debris
  const initCycloneEffects = (scene) => {
    const effects = disasterEffectsRef.current;
    effects.wind.strength = 15;
    effects.wind.direction.set(1, 0, 0.3).normalize();
    setWindIntensity(15);
    
    // Create rain particles
    for (let i = 0; i < 500; i++) {
      const rainGeometry = new THREE.CylinderGeometry(0.02, 0.02, 0.5, 4);
      const rainMaterial = new THREE.MeshBasicMaterial({
        color: 0xaaaaaa,
        transparent: true,
        opacity: 0.6
      });
      const raindrop = new THREE.Mesh(rainGeometry, rainMaterial);
      raindrop.position.set(
        (Math.random() - 0.5) * 150,
        Math.random() * 50,
        (Math.random() - 0.5) * 150
      );
      raindrop.rotation.x = 0.3; // Angled due to wind
      raindrop.userData.isRain = true;
      raindrop.userData.speed = 30 + Math.random() * 20;
      scene.add(raindrop);
      effects.particles.push(raindrop);
    }
    
    // Create swaying trees
    const treePositions = [];
    for (let i = 0; i < 20; i++) {
      treePositions.push({
        x: (Math.random() - 0.5) * 100,
        z: (Math.random() - 0.5) * 100
      });
    }
    
    treePositions.forEach(pos => {
      const treeGroup = new THREE.Group();
      
      // Trunk
      const trunkGeometry = new THREE.CylinderGeometry(0.3, 0.5, 5, 8);
      const trunkMaterial = new THREE.MeshStandardMaterial({ color: 0x4a3728 });
      const trunk = new THREE.Mesh(trunkGeometry, trunkMaterial);
      trunk.position.y = 2.5;
      trunk.castShadow = true;
      treeGroup.add(trunk);
      
      // Foliage
      const foliageGeometry = new THREE.SphereGeometry(3, 8, 8);
      const foliageMaterial = new THREE.MeshStandardMaterial({ color: 0x228b22 });
      const foliage = new THREE.Mesh(foliageGeometry, foliageMaterial);
      foliage.position.y = 6;
      foliage.castShadow = true;
      treeGroup.add(foliage);
      
      treeGroup.position.set(pos.x, 0, pos.z);
      treeGroup.userData.isTree = true;
      treeGroup.userData.swayOffset = Math.random() * Math.PI * 2;
      treeGroup.userData.swaySpeed = 2 + Math.random();
      scene.add(treeGroup);
      effects.trees.push(treeGroup);
    });
    
    // Create flying debris
    for (let i = 0; i < 30; i++) {
      const debrisTypes = ['leaf', 'branch', 'shingle'];
      const type = debrisTypes[Math.floor(Math.random() * debrisTypes.length)];
      let geometry, material;
      
      if (type === 'leaf') {
        geometry = new THREE.PlaneGeometry(0.2, 0.3);
        material = new THREE.MeshBasicMaterial({
          color: 0x228b22,
          side: THREE.DoubleSide
        });
      } else if (type === 'branch') {
        geometry = new THREE.CylinderGeometry(0.05, 0.08, 1, 4);
        material = new THREE.MeshStandardMaterial({ color: 0x4a3728 });
      } else {
        geometry = new THREE.BoxGeometry(0.5, 0.05, 0.3);
        material = new THREE.MeshStandardMaterial({ color: 0x696969 });
      }
      
      const debris = new THREE.Mesh(geometry, material);
      debris.position.set(
        (Math.random() - 0.5) * 100,
        2 + Math.random() * 15,
        (Math.random() - 0.5) * 100
      );
      debris.userData.isFlyingDebris = true;
      debris.userData.damage = type === 'branch' ? 10 : 5;
      scene.add(debris);
      effects.debris.push(debris);
    }
  };

  // HEATWAVE EFFECTS - Heat shimmer, sun glare
  const initHeatwaveEffects = (scene) => {
    // Increase ambient warmth
    scene.fog = new THREE.Fog(0xffcc88, 30, 150);
    scene.background = new THREE.Color(0xffdd99);
    
    // Add intense sun
    const sunGeometry = new THREE.SphereGeometry(5, 16, 16);
    const sunMaterial = new THREE.MeshBasicMaterial({
      color: 0xffff00,
      transparent: true,
      opacity: 0.8
    });
    const sun = new THREE.Mesh(sunGeometry, sunMaterial);
    sun.position.set(50, 80, 50);
    scene.add(sun);
    
    // Add sun glow
    const glowGeometry = new THREE.SphereGeometry(15, 16, 16);
    const glowMaterial = new THREE.MeshBasicMaterial({
      color: 0xffaa00,
      transparent: true,
      opacity: 0.3
    });
    const glow = new THREE.Mesh(glowGeometry, glowMaterial);
    glow.position.copy(sun.position);
    scene.add(glow);
    
    // Create heat shimmer particles
    const effects = disasterEffectsRef.current;
    for (let i = 0; i < 50; i++) {
      const shimmerGeometry = new THREE.PlaneGeometry(2, 3);
      const shimmerMaterial = new THREE.MeshBasicMaterial({
        color: 0xffffff,
        transparent: true,
        opacity: 0.1,
        side: THREE.DoubleSide
      });
      const shimmer = new THREE.Mesh(shimmerGeometry, shimmerMaterial);
      shimmer.position.set(
        (Math.random() - 0.5) * 100,
        0.5 + Math.random() * 2,
        (Math.random() - 0.5) * 100
      );
      shimmer.userData.isShimmer = true;
      shimmer.userData.shimmerSpeed = 3 + Math.random() * 2;
      scene.add(shimmer);
      effects.particles.push(shimmer);
    }
  };

  // DROUGHT EFFECTS - Cracked earth, dust, dried vegetation
  const initDroughtEffects = (scene) => {
    const effects = disasterEffectsRef.current;
    scene.fog = new THREE.Fog(0xd4a574, 50, 200);
    
    // Create dust particles
    for (let i = 0; i < 150; i++) {
      const dustGeometry = new THREE.SphereGeometry(0.1 + Math.random() * 0.2, 4, 4);
      const dustMaterial = new THREE.MeshBasicMaterial({
        color: 0xd4a574,
        transparent: true,
        opacity: 0.4
      });
      const dust = new THREE.Mesh(dustGeometry, dustMaterial);
      dust.position.set(
        (Math.random() - 0.5) * 100,
        Math.random() * 5,
        (Math.random() - 0.5) * 100
      );
      dust.userData.isDust = true;
      dust.userData.driftSpeed = 0.5 + Math.random();
      scene.add(dust);
      effects.particles.push(dust);
    }
    
    // Create dead trees
    for (let i = 0; i < 15; i++) {
      const treeGroup = new THREE.Group();
      
      // Dead trunk
      const trunkGeometry = new THREE.CylinderGeometry(0.2, 0.4, 4, 6);
      const trunkMaterial = new THREE.MeshStandardMaterial({ color: 0x3d2914 });
      const trunk = new THREE.Mesh(trunkGeometry, trunkMaterial);
      trunk.position.y = 2;
      trunk.rotation.z = (Math.random() - 0.5) * 0.3;
      treeGroup.add(trunk);
      
      // Dead branches
      for (let j = 0; j < 3; j++) {
        const branchGeometry = new THREE.CylinderGeometry(0.05, 0.1, 1.5, 4);
        const branch = new THREE.Mesh(branchGeometry, trunkMaterial);
        branch.position.set(0, 2.5 + j * 0.5, 0);
        branch.rotation.z = (Math.random() - 0.5) * 1.5;
        treeGroup.add(branch);
      }
      
      treeGroup.position.set(
        (Math.random() - 0.5) * 80,
        0,
        (Math.random() - 0.5) * 80
      );
      scene.add(treeGroup);
    }
  };

  // LANDSLIDE EFFECTS - Falling rocks, mud flow
  const initLandslideEffects = (scene) => {
    const effects = disasterEffectsRef.current;
    
    // Create falling boulders
    for (let i = 0; i < 25; i++) {
      const size = 0.5 + Math.random() * 2;
      const rockGeometry = new THREE.DodecahedronGeometry(size);
      const rockMaterial = new THREE.MeshStandardMaterial({
        color: 0x696969,
        roughness: 0.9
      });
      const rock = new THREE.Mesh(rockGeometry, rockMaterial);
      rock.position.set(
        -50 + Math.random() * 20,
        30 + Math.random() * 20,
        (Math.random() - 0.5) * 60
      );
      rock.userData.isBoulder = true;
      rock.userData.fallSpeed = 8 + Math.random() * 5;
      rock.userData.damage = 20 + size * 10;
      rock.userData.rotation = new THREE.Vector3(
        Math.random() * 0.1,
        Math.random() * 0.1,
        Math.random() * 0.1
      );
      rock.castShadow = true;
      scene.add(rock);
      effects.debris.push(rock);
    }
    
    // Create mud flow
    const mudGeometry = new THREE.PlaneGeometry(30, 100, 20, 50);
    const mudMaterial = new THREE.MeshStandardMaterial({
      color: 0x5d4e37,
      roughness: 0.8
    });
    const mud = new THREE.Mesh(mudGeometry, mudMaterial);
    mud.rotation.x = -Math.PI / 2;
    mud.rotation.z = Math.PI / 6;
    mud.position.set(-40, 0.1, 0);
    mud.userData.isMudFlow = true;
    mud.userData.damage = 5;
    scene.add(mud);
  };

  // STAMPEDE EFFECTS - Moving crowd NPCs
  const initStampedeEffects = (scene) => {
    const effects = disasterEffectsRef.current;
    
    // Create crowd NPCs
    for (let i = 0; i < 40; i++) {
      const npcGroup = new THREE.Group();
      
      // Simple humanoid
      const bodyGeometry = new THREE.CapsuleGeometry(0.3, 0.8, 4, 8);
      const colors = [0xff0000, 0x00ff00, 0x0000ff, 0xffff00, 0xff00ff, 0x00ffff];
      const bodyMaterial = new THREE.MeshStandardMaterial({
        color: colors[Math.floor(Math.random() * colors.length)]
      });
      const body = new THREE.Mesh(bodyGeometry, bodyMaterial);
      body.position.y = 0.9;
      npcGroup.add(body);
      
      // Head
      const headGeometry = new THREE.SphereGeometry(0.25, 8, 8);
      const headMaterial = new THREE.MeshStandardMaterial({ color: 0xffdbac });
      const head = new THREE.Mesh(headGeometry, headMaterial);
      head.position.y = 1.7;
      npcGroup.add(head);
      
      npcGroup.position.set(
        (Math.random() - 0.5) * 60,
        0,
        (Math.random() - 0.5) * 60
      );
      npcGroup.userData.isNPC = true;
      npcGroup.userData.speed = 3 + Math.random() * 4;
      npcGroup.userData.direction = new THREE.Vector3(
        (Math.random() - 0.5),
        0,
        (Math.random() - 0.5)
      ).normalize();
      npcGroup.userData.changeTimer = Math.random() * 3;
      npcGroup.userData.damage = 5;
      scene.add(npcGroup);
      effects.crowds.push(npcGroup);
    }
  };

  // AVALANCHE EFFECTS - Snow, rolling snowballs, reduced visibility
  const initAvalancheEffects = (scene) => {
    const effects = disasterEffectsRef.current;
    scene.fog = new THREE.Fog(0xffffff, 10, 60);
    scene.background = new THREE.Color(0xe8e8e8);
    
    // Create snowfall
    for (let i = 0; i < 400; i++) {
      const snowGeometry = new THREE.SphereGeometry(0.05 + Math.random() * 0.05, 4, 4);
      const snowMaterial = new THREE.MeshBasicMaterial({
        color: 0xffffff,
        transparent: true,
        opacity: 0.8
      });
      const snowflake = new THREE.Mesh(snowGeometry, snowMaterial);
      snowflake.position.set(
        (Math.random() - 0.5) * 100,
        Math.random() * 40,
        (Math.random() - 0.5) * 100
      );
      snowflake.userData.isSnowflake = true;
      snowflake.userData.fallSpeed = 2 + Math.random() * 3;
      snowflake.userData.drift = (Math.random() - 0.5) * 2;
      scene.add(snowflake);
      effects.snowflakes.push(snowflake);
    }
    
    // Create rolling snowballs/avalanche chunks
    for (let i = 0; i < 15; i++) {
      const size = 1 + Math.random() * 3;
      const snowballGeometry = new THREE.SphereGeometry(size, 8, 8);
      const snowballMaterial = new THREE.MeshStandardMaterial({
        color: 0xfafafa,
        roughness: 0.8
      });
      const snowball = new THREE.Mesh(snowballGeometry, snowballMaterial);
      snowball.position.set(
        -50 + Math.random() * 20,
        size + Math.random() * 10,
        (Math.random() - 0.5) * 60
      );
      snowball.userData.isSnowball = true;
      snowball.userData.rollSpeed = 5 + Math.random() * 5;
      snowball.userData.damage = 15 + size * 5;
      snowball.castShadow = true;
      scene.add(snowball);
      effects.debris.push(snowball);
    }
  };

  // Add environment-specific objects
  const addEnvironmentObjects = (scene, config) => {
    const objects = config?.objects || [];
    
    objects.forEach(obj => {
      let geometry, material, mesh;
      
      switch (obj.type) {
        case 'building':
          geometry = new THREE.BoxGeometry(obj.width || 4, obj.height || 8, obj.depth || 4);
          material = new THREE.MeshStandardMaterial({ 
            color: obj.color || 0x808080,
            roughness: 0.7
          });
          mesh = new THREE.Mesh(geometry, material);
          mesh.position.set(obj.x, (obj.height || 8) / 2, obj.z);
          mesh.castShadow = true;
          mesh.receiveShadow = true;
          mesh.userData.isClimbable = obj.climbable || false;
          mesh.userData.isObstacle = true;
          scene.add(mesh);
          break;

        case 'tree':
          // Trunk
          const trunkGeometry = new THREE.CylinderGeometry(0.3, 0.4, 3, 8);
          const trunkMaterial = new THREE.MeshStandardMaterial({ color: 0x4a3728 });
          const trunk = new THREE.Mesh(trunkGeometry, trunkMaterial);
          trunk.position.set(obj.x, 1.5, obj.z);
          trunk.castShadow = true;
          scene.add(trunk);
          
          // Foliage
          const foliageGeometry = new THREE.SphereGeometry(2, 8, 8);
          const foliageMaterial = new THREE.MeshStandardMaterial({ color: 0x228b22 });
          const foliage = new THREE.Mesh(foliageGeometry, foliageMaterial);
          foliage.position.set(obj.x, 4.5, obj.z);
          foliage.castShadow = true;
          scene.add(foliage);
          break;

        case 'rock':
          geometry = new THREE.DodecahedronGeometry(obj.size || 1);
          material = new THREE.MeshStandardMaterial({ 
            color: obj.color || 0x696969,
            roughness: 0.9
          });
          mesh = new THREE.Mesh(geometry, material);
          mesh.position.set(obj.x, (obj.size || 1) / 2, obj.z);
          mesh.rotation.set(Math.random(), Math.random(), Math.random());
          mesh.castShadow = true;
          mesh.receiveShadow = true;
          scene.add(mesh);
          break;

        case 'water':
          geometry = new THREE.PlaneGeometry(obj.width || 20, obj.depth || 20);
          material = new THREE.MeshStandardMaterial({
            color: 0x1e90ff,
            transparent: true,
            opacity: 0.7,
            roughness: 0.1,
            metalness: 0.3
          });
          mesh = new THREE.Mesh(geometry, material);
          mesh.rotation.x = -Math.PI / 2;
          mesh.position.set(obj.x, obj.y || 0.1, obj.z);
          mesh.userData.isWater = true;
          mesh.userData.isDangerous = obj.dangerous || false;
          scene.add(mesh);
          break;

        case 'safeZone':
          geometry = new THREE.CylinderGeometry(obj.radius || 3, obj.radius || 3, 0.2, 32);
          material = new THREE.MeshStandardMaterial({
            color: 0x00ff00,
            transparent: true,
            opacity: 0.5,
            emissive: 0x00ff00,
            emissiveIntensity: 0.3
          });
          mesh = new THREE.Mesh(geometry, material);
          mesh.position.set(obj.x, 0.1, obj.z);
          mesh.userData.isSafeZone = true;
          scene.add(mesh);
          break;
      }
    });
  };

  // Create player character
  const createPlayer = () => {
    const playerGroup = new THREE.Group();

    // Body
    const bodyGeometry = new THREE.CapsuleGeometry(0.4, 1, 8, 16);
    const bodyMaterial = new THREE.MeshStandardMaterial({ color: 0x2196f3 });
    const body = new THREE.Mesh(bodyGeometry, bodyMaterial);
    body.position.y = 1;
    body.castShadow = true;
    playerGroup.add(body);

    // Head
    const headGeometry = new THREE.SphereGeometry(0.3, 16, 16);
    const headMaterial = new THREE.MeshStandardMaterial({ color: 0xffdbac });
    const head = new THREE.Mesh(headGeometry, headMaterial);
    head.position.y = 2;
    head.castShadow = true;
    playerGroup.add(head);

    // Arms
    const armGeometry = new THREE.CapsuleGeometry(0.12, 0.6, 4, 8);
    const armMaterial = new THREE.MeshStandardMaterial({ color: 0x2196f3 });
    
    const leftArm = new THREE.Mesh(armGeometry, armMaterial);
    leftArm.position.set(-0.55, 1.2, 0);
    leftArm.rotation.z = 0.2;
    playerGroup.add(leftArm);

    const rightArm = new THREE.Mesh(armGeometry, armMaterial);
    rightArm.position.set(0.55, 1.2, 0);
    rightArm.rotation.z = -0.2;
    playerGroup.add(rightArm);

    // Legs
    const legGeometry = new THREE.CapsuleGeometry(0.15, 0.5, 4, 8);
    const legMaterial = new THREE.MeshStandardMaterial({ color: 0x1565c0 });

    const leftLeg = new THREE.Mesh(legGeometry, legMaterial);
    leftLeg.position.set(-0.2, 0.35, 0);
    playerGroup.add(leftLeg);

    const rightLeg = new THREE.Mesh(legGeometry, legMaterial);
    rightLeg.position.set(0.2, 0.35, 0);
    playerGroup.add(rightLeg);

    playerGroup.position.set(0, 0, 0);
    playerGroup.userData.velocity = new THREE.Vector3();
    playerGroup.userData.isGrounded = true;

    return playerGroup;
  };

  // Create goal markers
  const createGoals = (scene, goals) => {
    if (!goals) return;

    goals.forEach((goal, index) => {
      // Goal marker
      const markerGeometry = new THREE.CylinderGeometry(0, 1.5, 3, 4);
      const markerMaterial = new THREE.MeshStandardMaterial({
        color: index === 0 ? 0xffd700 : 0x808080,
        emissive: index === 0 ? 0xffd700 : 0x000000,
        emissiveIntensity: index === 0 ? 0.3 : 0,
        transparent: true,
        opacity: 0.8
      });
      const marker = new THREE.Mesh(markerGeometry, markerMaterial);
      marker.position.set(goal.x, 4, goal.z);
      marker.rotation.x = Math.PI;
      marker.userData.isGoal = true;
      marker.userData.goalIndex = index;
      marker.userData.goalData = goal;
      scene.add(marker);

      // Goal base glow
      const glowGeometry = new THREE.CircleGeometry(2, 32);
      const glowMaterial = new THREE.MeshStandardMaterial({
        color: 0xffd700,
        emissive: 0xffd700,
        emissiveIntensity: 0.5,
        transparent: true,
        opacity: index === 0 ? 0.5 : 0.2
      });
      const glow = new THREE.Mesh(glowGeometry, glowMaterial);
      glow.rotation.x = -Math.PI / 2;
      glow.position.set(goal.x, 0.05, goal.z);
      glow.userData.isGoalGlow = true;
      glow.userData.goalIndex = index;
      scene.add(glow);
    });
  };

  // Create obstacles
  const createObstacles = (scene, obstacles) => {
    if (!obstacles) return;

    obstacles.forEach(obstacle => {
      let geometry, material, mesh;

      switch (obstacle.type) {
        case 'debris':
          geometry = new THREE.BoxGeometry(
            obstacle.width || 2,
            obstacle.height || 1,
            obstacle.depth || 2
          );
          material = new THREE.MeshStandardMaterial({
            color: obstacle.color || 0x5d4e37,
            roughness: 0.9
          });
          mesh = new THREE.Mesh(geometry, material);
          mesh.position.set(obstacle.x, (obstacle.height || 1) / 2, obstacle.z);
          mesh.rotation.y = Math.random() * Math.PI;
          mesh.castShadow = true;
          mesh.receiveShadow = true;
          mesh.userData.isObstacle = true;
          mesh.userData.damage = obstacle.damage || 0;
          scene.add(mesh);
          break;

        case 'fire':
          // Fire particle effect placeholder
          const fireGroup = new THREE.Group();
          for (let i = 0; i < 5; i++) {
            const fireGeometry = new THREE.ConeGeometry(0.5, 2, 8);
            const fireMaterial = new THREE.MeshStandardMaterial({
              color: 0xff4500,
              emissive: 0xff4500,
              emissiveIntensity: 0.8,
              transparent: true,
              opacity: 0.8
            });
            const fireMesh = new THREE.Mesh(fireGeometry, fireMaterial);
            fireMesh.position.set(
              (Math.random() - 0.5) * 2,
              1 + Math.random(),
              (Math.random() - 0.5) * 2
            );
            fireGroup.add(fireMesh);
          }
          fireGroup.position.set(obstacle.x, 0, obstacle.z);
          fireGroup.userData.isFire = true;
          fireGroup.userData.damage = obstacle.damage || 10;
          scene.add(fireGroup);
          break;

        case 'crack':
          geometry = new THREE.PlaneGeometry(obstacle.width || 3, obstacle.depth || 1);
          material = new THREE.MeshStandardMaterial({
            color: 0x1a1a1a,
            roughness: 1
          });
          mesh = new THREE.Mesh(geometry, material);
          mesh.rotation.x = -Math.PI / 2;
          mesh.position.set(obstacle.x, 0.02, obstacle.z);
          mesh.userData.isCrack = true;
          mesh.userData.damage = obstacle.damage || 20;
          scene.add(mesh);
          break;
      }
    });
  };

  // Create collectibles
  const createCollectibles = (scene, collectibles) => {
    if (!collectibles) return;

    collectibles.forEach((item, index) => {
      let geometry, material;

      switch (item.type) {
        case 'firstAid':
          geometry = new THREE.BoxGeometry(0.5, 0.5, 0.2);
          material = new THREE.MeshStandardMaterial({
            color: 0xff0000,
            emissive: 0xff0000,
            emissiveIntensity: 0.2
          });
          break;

        case 'water':
          geometry = new THREE.CylinderGeometry(0.15, 0.15, 0.5, 16);
          material = new THREE.MeshStandardMaterial({
            color: 0x00bfff,
            emissive: 0x00bfff,
            emissiveIntensity: 0.2
          });
          break;

        case 'flashlight':
          geometry = new THREE.CylinderGeometry(0.1, 0.15, 0.6, 16);
          material = new THREE.MeshStandardMaterial({
            color: 0xffff00,
            emissive: 0xffff00,
            emissiveIntensity: 0.3
          });
          break;

        default:
          geometry = new THREE.SphereGeometry(0.3, 16, 16);
          material = new THREE.MeshStandardMaterial({
            color: 0xffd700,
            emissive: 0xffd700,
            emissiveIntensity: 0.3
          });
      }

      const mesh = new THREE.Mesh(geometry, material);
      mesh.position.set(item.x, 1, item.z);
      mesh.userData.isCollectible = true;
      mesh.userData.collectibleIndex = index;
      mesh.userData.collectibleType = item.type;
      mesh.userData.points = item.points || 10;
      mesh.userData.healthBonus = item.healthBonus || 0;
      scene.add(mesh);
    });
  };

  // Update camera to follow player in TPP
  const updateCamera = () => {
    if (!cameraRef.current || !playerRef.current) return;

    const player = playerRef.current;
    const camera = cameraRef.current;
    const angles = cameraAngleRef.current;

    // Calculate camera position based on angles
    const horizontalDistance = CAMERA_DISTANCE * Math.cos(angles.vertical);
    const verticalDistance = CAMERA_DISTANCE * Math.sin(angles.vertical);

    const cameraX = player.position.x - horizontalDistance * Math.sin(angles.horizontal);
    const cameraY = player.position.y + CAMERA_HEIGHT + verticalDistance;
    const cameraZ = player.position.z - horizontalDistance * Math.cos(angles.horizontal);

    camera.position.set(cameraX, cameraY, cameraZ);
    camera.lookAt(
      player.position.x,
      player.position.y + 1.5,
      player.position.z
    );
  };

  // Handle player movement - FIXED CONTROLS
  const handleMovement = (delta) => {
    if (!playerRef.current || !gameStarted) return;

    const player = playerRef.current;
    const velocity = velocityRef.current;
    const keys = keysRef.current;
    const angles = cameraAngleRef.current;
    const effects = disasterEffectsRef.current;

    // Calculate movement direction based on camera angle
    // FIXED: Changed signs to make W go forward, S go backward
    const forward = new THREE.Vector3(
      Math.sin(angles.horizontal),  // Changed from -Math.sin
      0,
      Math.cos(angles.horizontal)   // Changed from -Math.cos
    );
    const right = new THREE.Vector3(
      Math.cos(angles.horizontal),
      0,
      -Math.sin(angles.horizontal)
    );

    // WASD movement
    const moveDirection = new THREE.Vector3();
    if (keys['w'] || keys['arrowup']) moveDirection.add(forward);
    if (keys['s'] || keys['arrowdown']) moveDirection.sub(forward);
    if (keys['a'] || keys['arrowleft']) moveDirection.sub(right);
    if (keys['d'] || keys['arrowright']) moveDirection.add(right);

    // Adjust speed based on conditions
    let currentSpeed = PLAYER_SPEED;
    
    // Swimming - slower movement
    if (isSwimmingRef.current) {
      currentSpeed = PLAYER_SPEED * 0.5;
    }
    
    // Wind resistance (cyclone)
    if (effects.wind.strength > 0) {
      const windForce = effects.wind.direction.clone().multiplyScalar(effects.wind.strength * 0.3 * delta);
      player.position.add(windForce);
      currentSpeed *= 0.7;
    }

    if (moveDirection.length() > 0) {
      moveDirection.normalize();
      velocity.x = moveDirection.x * currentSpeed;
      velocity.z = moveDirection.z * currentSpeed;

      // Rotate player to face movement direction
      const targetRotation = Math.atan2(moveDirection.x, moveDirection.z);
      player.rotation.y = THREE.MathUtils.lerp(
        player.rotation.y,
        targetRotation,
        0.1
      );
    } else {
      velocity.x *= 0.9;
      velocity.z *= 0.9;
    }

    // Jumping / Swimming up
    if ((keys[' '] || keys['space'])) {
      if (isSwimmingRef.current) {
        // Swim up
        velocity.y = 3;
      } else if (isGroundedRef.current && !isClimbingRef.current) {
        velocity.y = PLAYER_JUMP_FORCE;
        isGroundedRef.current = false;
      }
    }

    // Apply gravity (reduced in water)
    if (isSwimmingRef.current) {
      velocity.y -= GRAVITY * 0.1 * delta;
      // Buoyancy
      const waterY = waterLevelRef.current;
      if (player.position.y < waterY - 0.5) {
        velocity.y += 5 * delta;
      }
    } else if (!isClimbingRef.current) {
      velocity.y -= GRAVITY * delta;
    }

    // Update position
    player.position.x += velocity.x * delta;
    player.position.y += velocity.y * delta;
    player.position.z += velocity.z * delta;

    // Ground collision
    if (player.position.y <= 0) {
      player.position.y = 0;
      velocity.y = 0;
      isGroundedRef.current = true;
    }

    // Boundary limits
    const boundary = 95;
    player.position.x = Math.max(-boundary, Math.min(boundary, player.position.x));
    player.position.z = Math.max(-boundary, Math.min(boundary, player.position.z));

    // Check collisions
    checkCollisions();
  };

  // Check collisions with objects
  const checkCollisions = () => {
    if (!sceneRef.current || !playerRef.current) return;

    const player = playerRef.current;
    const playerPos = player.position;

    // Safety check: ensure scene and traverse method exist
    if (!sceneRef || !sceneRef.current || typeof sceneRef.current.traverse !== 'function') {
      return;
    }

    try {
      sceneRef.current.traverse((object) => {
      if (!object.userData) return;

      const distance = object.position ? 
        playerPos.distanceTo(object.position) : Infinity;

      // Goal collision
      if (object.userData.isGoalGlow && object.userData.goalIndex === currentGoalIndex) {
        if (distance < 2.5) {
          handleGoalReached(object.userData.goalIndex);
        }
      }

      // Collectible collision
      if (object.userData.isCollectible && !collectedItems.includes(object.userData.collectibleIndex)) {
        if (distance < 1.5) {
          handleCollectItem(object);
        }
      }

      // Damage collision
      if ((object.userData.isFire || object.userData.isCrack) && distance < 1.5) {
        handleDamage(object.userData.damage || 5);
      }
      });
    } catch (error) {
      console.error('Error in checkCollisions traverse:', error);
    }
  };

  // Handle reaching a goal
  const handleGoalReached = (goalIndex) => {
    if (goalIndex !== currentGoalIndex) return;

    const newScore = score + 100;
    setScore(newScore);

    if (goalIndex < (goals?.length || 1) - 1) {
      setCurrentGoalIndex(goalIndex + 1);
      // Update goal markers
      updateGoalMarkers(goalIndex + 1);
    } else {
      setGoalReached(true);
      if (onComplete) {
        onComplete({
          success: true,
          score: newScore,
          time: timeElapsed,
          health,
          collectibles: collectedItems.length
        });
      }
    }
  };

  // Update goal marker visibility
  const updateGoalMarkers = (newIndex) => {
    if (!sceneRef.current || typeof sceneRef.current.traverse !== 'function') return;

    sceneRef.current.traverse((object) => {
      if (object.userData.isGoal || object.userData.isGoalGlow) {
        const isActive = object.userData.goalIndex === newIndex;
        object.material.opacity = isActive ? 0.8 : 0.3;
        object.material.emissiveIntensity = isActive ? 0.5 : 0;
      }
    });
  };

  // Handle collecting items
  const handleCollectItem = (object) => {
    const index = object.userData.collectibleIndex;
    if (collectedItems.includes(index)) return;

    setCollectedItems([...collectedItems, index]);
    setScore(score + (object.userData.points || 10));

    if (object.userData.healthBonus) {
      setHealth(Math.min(100, health + object.userData.healthBonus));
    }

    // Remove from scene
    sceneRef.current.remove(object);
  };

  // Handle damage
  const handleDamage = (amount) => {
    setHealth(prev => Math.max(0, prev - amount * 0.1));
  };

  // Game loop
  const animate = useCallback(() => {
    if (!rendererRef.current || !sceneRef.current || !cameraRef.current) return;

    const delta = clockRef.current.getDelta();

    // Update time
    if (gameStarted && !goalReached) {
      setTimeElapsed(prev => prev + delta);
    }

    // Handle movement
    handleMovement(delta);

    // Update camera
    updateCamera();

    // Animate objects
    animateObjects(delta);

    // Render
    rendererRef.current.render(sceneRef.current, cameraRef.current);

    animationFrameRef.current = requestAnimationFrame(animate);
  }, [gameStarted, goalReached, currentGoalIndex, score, health, collectedItems]);

  // Animate scene objects
  const animateObjects = (delta) => {
    if (!sceneRef.current || typeof sceneRef.current.traverse !== 'function') return;

    sceneRef.current.traverse((object) => {
      // Animate goal markers
      if (object.userData.isGoal) {
        object.rotation.y += delta * 2;
        object.position.y = 4 + Math.sin(Date.now() * 0.003) * 0.5;
      }

      // Animate collectibles
      if (object.userData.isCollectible) {
        object.rotation.y += delta * 3;
        object.position.y = 1 + Math.sin(Date.now() * 0.005) * 0.2;
      }

      // Animate fire
      if (object.userData.isFire) {
        object.children.forEach((child, i) => {
          child.scale.y = 1 + Math.sin(Date.now() * 0.01 + i) * 0.3;
        });
      }
    });
    
    // Animate disaster-specific effects
    animateDisasterEffects(delta);
  };

  // Animate disaster-specific effects
  const animateDisasterEffects = (delta) => {
    const effects = disasterEffectsRef.current;
    const time = Date.now() * 0.001;
    
    // EARTHQUAKE - Screen shake and falling debris
    if (effects.shake.active && gameStarted) {
      screenShakeRef.current.x = (Math.random() - 0.5) * effects.shake.intensity;
      screenShakeRef.current.y = (Math.random() - 0.5) * effects.shake.intensity;
      
      if (cameraRef.current) {
        cameraRef.current.position.x += screenShakeRef.current.x;
        cameraRef.current.position.y += screenShakeRef.current.y;
      }
    }
    
    // Animate falling debris (earthquake, landslide)
    effects.debris.forEach(debris => {
      if (debris.userData.isDebris || debris.userData.isBoulder) {
        debris.position.y -= debris.userData.fallSpeed * delta;
        debris.rotation.x += debris.userData.rotation?.x || 0.05;
        debris.rotation.z += debris.userData.rotation?.z || 0.05;
        
        // Reset debris when it hits ground
        if (debris.position.y < 0) {
          debris.position.y = 25 + Math.random() * 20;
          debris.position.x = (Math.random() - 0.5) * 80;
          debris.position.z = (Math.random() - 0.5) * 80;
        }
        
        // Check collision with player
        if (playerRef.current) {
          const dist = debris.position.distanceTo(playerRef.current.position);
          if (dist < 2) {
            handleDamage(debris.userData.damage || 10);
          }
        }
      }
      
      // Floating debris (tsunami, flood)
      if (debris.userData.isFloating) {
        const waterLevel = effects.water.mesh?.position.y || 0;
        debris.position.y = waterLevel + 0.3 + Math.sin(time * 2 + debris.userData.floatOffset) * 0.3;
        debris.rotation.z = Math.sin(time + debris.userData.floatOffset) * 0.2;
        debris.rotation.x = Math.cos(time * 0.5 + debris.userData.floatOffset) * 0.1;
        
        // Move with current
        debris.position.x += delta * 2;
        if (debris.position.x > 50) debris.position.x = -50;
      }
      
      // Flying debris (cyclone)
      if (debris.userData.isFlyingDebris) {
        const wind = effects.wind;
        debris.position.x += wind.direction.x * wind.strength * delta;
        debris.position.z += wind.direction.z * wind.strength * delta;
        debris.position.y += Math.sin(time * 5) * delta * 2;
        debris.rotation.x += delta * 5;
        debris.rotation.y += delta * 3;
        
        // Reset position
        if (debris.position.x > 60) debris.position.x = -60;
        if (debris.position.z > 60) debris.position.z = -60;
        
        // Check collision
        if (playerRef.current) {
          const dist = debris.position.distanceTo(playerRef.current.position);
          if (dist < 1.5) {
            handleDamage(debris.userData.damage || 5);
          }
        }
      }
      
      // Rolling snowballs (avalanche)
      if (debris.userData.isSnowball) {
        debris.position.x += debris.userData.rollSpeed * delta;
        debris.rotation.z -= debris.userData.rollSpeed * delta * 0.5;
        
        if (debris.position.x > 60) {
          debris.position.x = -50;
          debris.position.z = (Math.random() - 0.5) * 60;
        }
        
        // Check collision
        if (playerRef.current) {
          const dist = debris.position.distanceTo(playerRef.current.position);
          if (dist < debris.geometry?.parameters?.radius + 1 || dist < 2) {
            handleDamage(debris.userData.damage || 15);
          }
        }
      }
    });
    
    // WATER EFFECTS - Rising water
    if (effects.water.rising && effects.water.mesh) {
      const riseSpeed = disasterType === 'tsunami' ? 0.15 : 0.08;
      const maxLevel = disasterType === 'tsunami' ? 8 : 3;
      
      if (effects.water.mesh.position.y < maxLevel) {
        effects.water.mesh.position.y += riseSpeed * delta;
        setWaterLevel(effects.water.mesh.position.y);
        waterLevelRef.current = effects.water.mesh.position.y;
      }
      
      // Wave animation
      if (effects.water.mesh.geometry) {
        const positions = effects.water.mesh.geometry.attributes.position.array;
        for (let i = 0; i < positions.length; i += 3) {
          positions[i + 2] = Math.sin(positions[i] * 0.1 + time * 2) * 0.3 +
                            Math.cos(positions[i + 1] * 0.1 + time * 1.5) * 0.2;
        }
        effects.water.mesh.geometry.attributes.position.needsUpdate = true;
      }
      
      // Check if player is in water
      if (playerRef.current) {
        const playerY = playerRef.current.position.y;
        const waterY = effects.water.mesh.position.y;
        
        if (playerY < waterY) {
          setIsSwimming(true);
          isSwimmingRef.current = true;
          setStatusEffect('drowning');
          
          // Drowning damage
          if (playerY < waterY - 1) {
            handleDamage(0.5);
          }
        } else {
          setIsSwimming(false);
          isSwimmingRef.current = false;
          if (statusEffect === 'drowning') setStatusEffect(null);
        }
      }
    }
    
    // RAIN PARTICLES (Cyclone)
    effects.particles.forEach(particle => {
      if (particle.userData.isRain) {
        particle.position.y -= particle.userData.speed * delta;
        particle.position.x += effects.wind.strength * 0.5 * delta;
        
        if (particle.position.y < 0) {
          particle.position.y = 50;
          particle.position.x = (Math.random() - 0.5) * 150;
          particle.position.z = (Math.random() - 0.5) * 150;
        }
      }
      
      // Wave particles (tsunami)
      if (particle.userData.isWaveParticle) {
        particle.position.y = (effects.water.mesh?.position.y || 0) + 
                             Math.abs(Math.sin(time * particle.userData.speed + particle.position.x * 0.1)) * 2;
        particle.position.x += particle.userData.speed * delta;
        if (particle.position.x > 50) particle.position.x = -50;
      }
      
      // Smoke particles (fire)
      if (particle.userData.isSmoke) {
        particle.position.y += particle.userData.riseSpeed * delta;
        particle.position.x += particle.userData.drift * delta;
        particle.scale.multiplyScalar(1 + delta * 0.1);
        particle.material.opacity -= delta * 0.02;
        
        if (particle.position.y > 30 || particle.material.opacity <= 0) {
          particle.position.y = 2;
          particle.position.x = (Math.random() - 0.5) * 80;
          particle.position.z = (Math.random() - 0.5) * 80;
          particle.scale.set(1, 1, 1);
          particle.material.opacity = 0.3;
        }
      }
      
      // Heat shimmer (heatwave)
      if (particle.userData.isShimmer) {
        particle.material.opacity = 0.05 + Math.sin(time * particle.userData.shimmerSpeed) * 0.05;
        particle.scale.x = 1 + Math.sin(time * 3) * 0.2;
      }
      
      // Dust particles (drought)
      if (particle.userData.isDust) {
        particle.position.x += particle.userData.driftSpeed * delta;
        particle.position.y += Math.sin(time * 2 + particle.position.x) * delta * 0.5;
        
        if (particle.position.x > 50) particle.position.x = -50;
      }
    });
    
    // SNOWFALL (Avalanche)
    effects.snowflakes.forEach(snowflake => {
      snowflake.position.y -= snowflake.userData.fallSpeed * delta;
      snowflake.position.x += snowflake.userData.drift * delta;
      
      if (snowflake.position.y < 0) {
        snowflake.position.y = 40;
        snowflake.position.x = (Math.random() - 0.5) * 100;
        snowflake.position.z = (Math.random() - 0.5) * 100;
      }
    });
    
    // SWAYING TREES (Cyclone)
    effects.trees.forEach(tree => {
      const sway = Math.sin(time * tree.userData.swaySpeed + tree.userData.swayOffset) * 
                   (effects.wind.strength * 0.02);
      tree.rotation.z = sway;
      tree.rotation.x = sway * 0.5;
    });
    
    // FIRE ANIMATION
    effects.flames.forEach(fireGroup => {
      fireGroup.children.forEach((child, i) => {
        if (child.userData.baseY !== undefined) {
          child.position.y = child.userData.baseY + 
                            Math.sin(time * child.userData.flickerSpeed + child.userData.flickerOffset) * 0.5;
          child.scale.x = 0.8 + Math.sin(time * 10 + i) * 0.3;
          child.scale.z = 0.8 + Math.cos(time * 8 + i) * 0.3;
        }
      });
      
      // Flicker light
      if (fireGroup.userData.light) {
        fireGroup.userData.light.intensity = 1.5 + Math.sin(time * 10) * 0.5;
      }
      
      // Check player collision
      if (playerRef.current && fireGroup.position) {
        const dist = playerRef.current.position.distanceTo(fireGroup.position);
        if (dist < 3) {
          handleDamage(fireGroup.userData.damage || 10);
          setStatusEffect('burning');
        }
      }
    });
    
    // CROWD MOVEMENT (Stampede)
    effects.crowds.forEach(npc => {
      // Move NPC
      npc.position.x += npc.userData.direction.x * npc.userData.speed * delta;
      npc.position.z += npc.userData.direction.z * npc.userData.speed * delta;
      
      // Change direction periodically
      npc.userData.changeTimer -= delta;
      if (npc.userData.changeTimer <= 0) {
        npc.userData.direction = new THREE.Vector3(
          (Math.random() - 0.5),
          0,
          (Math.random() - 0.5)
        ).normalize();
        npc.userData.changeTimer = 1 + Math.random() * 3;
        
        // Face movement direction
        npc.rotation.y = Math.atan2(npc.userData.direction.x, npc.userData.direction.z);
      }
      
      // Keep in bounds
      if (Math.abs(npc.position.x) > 40) npc.userData.direction.x *= -1;
      if (Math.abs(npc.position.z) > 40) npc.userData.direction.z *= -1;
      
      // Animate running
      npc.children[0].position.y = 0.9 + Math.abs(Math.sin(time * 10)) * 0.1;
      
      // Check collision with player
      if (playerRef.current) {
        const dist = npc.position.distanceTo(playerRef.current.position);
        if (dist < 1) {
          handleDamage(npc.userData.damage || 5);
          // Push player
          const pushDir = new THREE.Vector3()
            .subVectors(playerRef.current.position, npc.position)
            .normalize();
          playerRef.current.position.add(pushDir.multiplyScalar(0.5));
        }
      }
    });
    
    // LADDER CLIMBING
    effects.ladders.forEach(ladder => {
      if (playerRef.current) {
        const dist = playerRef.current.position.distanceTo(ladder.position);
        if (dist < 1.5 && keysRef.current['w']) {
          setIsClimbing(true);
          isClimbingRef.current = true;
          playerRef.current.position.y += 3 * delta;
          velocityRef.current.y = 0;
        } else if (isClimbingRef.current && !keysRef.current['w']) {
          setIsClimbing(false);
          isClimbingRef.current = false;
        }
      }
    });
  };

  // Event handlers
  useEffect(() => {
    const handleKeyDown = (e) => {
      keysRef.current[e.key.toLowerCase()] = true;
      
      // Prevent default for game keys
      if (['w', 'a', 's', 'd', ' ', 'arrowup', 'arrowdown', 'arrowleft', 'arrowright'].includes(e.key.toLowerCase())) {
        e.preventDefault();
      }
    };

    const handleKeyUp = (e) => {
      keysRef.current[e.key.toLowerCase()] = false;
    };

    const handleMouseMove = (e) => {
      if (!gameStarted || document.pointerLockElement !== containerRef.current) return;

      cameraAngleRef.current.horizontal += e.movementX * MOUSE_SENSITIVITY;
      cameraAngleRef.current.vertical = Math.max(
        -0.5,
        Math.min(1, cameraAngleRef.current.vertical - e.movementY * MOUSE_SENSITIVITY)
      );
    };

    const handleResize = () => {
      if (!cameraRef.current || !rendererRef.current) return;

      cameraRef.current.aspect = window.innerWidth / window.innerHeight;
      cameraRef.current.updateProjectionMatrix();
      rendererRef.current.setSize(window.innerWidth, window.innerHeight);
    };

    const handleClick = () => {
      if (containerRef.current && gameStarted) {
        containerRef.current.requestPointerLock();
      }
    };

    window.addEventListener('keydown', handleKeyDown);
    window.addEventListener('keyup', handleKeyUp);
    window.addEventListener('mousemove', handleMouseMove);
    window.addEventListener('resize', handleResize);
    containerRef.current?.addEventListener('click', handleClick);

    return () => {
      window.removeEventListener('keydown', handleKeyDown);
      window.removeEventListener('keyup', handleKeyUp);
      window.removeEventListener('mousemove', handleMouseMove);
      window.removeEventListener('resize', handleResize);
    };
  }, [gameStarted]);

  // Initialize scene
  useEffect(() => {
    const cleanup = initScene();
    animationFrameRef.current = requestAnimationFrame(animate);

    return () => {
      if (animationFrameRef.current) {
        cancelAnimationFrame(animationFrameRef.current);
      }
      cleanup?.();
    };
  }, [initScene, animate]);

  // Fullscreen handler
  const toggleFullscreen = () => {
    if (!document.fullscreenElement) {
      containerRef.current?.requestFullscreen();
      setIsFullscreen(true);
    } else {
      document.exitFullscreen();
      setIsFullscreen(false);
    }
  };

  // Start game
  const startGame = () => {
    setShowInstructions(false);
    setGameStarted(true);
    containerRef.current?.requestPointerLock();
  };

  return (
    <div 
      ref={containerRef} 
      style={{ 
        width: '100vw', 
        height: '100vh', 
        position: 'relative',
        overflow: 'hidden',
        cursor: gameStarted ? 'none' : 'default'
      }}
    >
      {/* Instructions Overlay */}
      {showInstructions && (
        <div style={{
          position: 'absolute',
          top: 0,
          left: 0,
          width: '100%',
          height: '100%',
          background: 'rgba(0, 0, 0, 0.85)',
          display: 'flex',
          flexDirection: 'column',
          alignItems: 'center',
          justifyContent: 'center',
          zIndex: 100,
          color: 'white',
          fontFamily: 'Arial, sans-serif'
        }}>
          <h1 style={{ fontSize: '2.5rem', marginBottom: '20px', color: '#ffd700' }}>
            🎮 {disasterType?.toUpperCase()} SAFETY TRAINING
          </h1>
          
          <div style={{
            background: 'rgba(30, 41, 59, 0.9)',
            padding: '30px',
            borderRadius: '16px',
            maxWidth: '600px',
            textAlign: 'center'
          }}>
            <h2 style={{ marginBottom: '20px', color: '#22d3ee' }}>📋 Mission Objectives</h2>
            <ul style={{ textAlign: 'left', marginBottom: '20px', lineHeight: '1.8' }}>
              {instructions?.map((instruction, i) => (
                <li key={i} style={{ marginBottom: '8px' }}>{instruction}</li>
              )) || (
                <>
                  <li>Navigate to the safe zone marked in gold</li>
                  <li>Avoid hazards and dangerous areas</li>
                  <li>Collect safety items for bonus points</li>
                  <li>Complete all objectives as quickly as possible</li>
                </>
              )}
            </ul>

            <h3 style={{ marginBottom: '15px', color: '#22d3ee' }}>🎮 Controls</h3>
            <div style={{ 
              display: 'grid', 
              gridTemplateColumns: 'repeat(2, 1fr)', 
              gap: '10px',
              marginBottom: '25px'
            }}>
              <div><kbd>W</kbd> <kbd>A</kbd> <kbd>S</kbd> <kbd>D</kbd> - Move</div>
              <div><kbd>SPACE</kbd> - Jump</div>
              <div><kbd>MOUSE</kbd> - Look around</div>
              <div><kbd>ESC</kbd> - Pause</div>
            </div>

            <button
              onClick={startGame}
              style={{
                padding: '15px 40px',
                fontSize: '1.3rem',
                background: 'linear-gradient(135deg, #6366f1, #22d3ee)',
                color: 'white',
                border: 'none',
                borderRadius: '8px',
                cursor: 'pointer',
                fontWeight: 'bold',
                transition: 'transform 0.2s'
              }}
              onMouseOver={(e) => e.target.style.transform = 'scale(1.05)'}
              onMouseOut={(e) => e.target.style.transform = 'scale(1)'}
            >
              🚀 START MISSION
            </button>
          </div>
        </div>
      )}

      {/* Game UI */}
      {gameStarted && !showInstructions && (
        <>
          {/* Top HUD */}
          <div style={{
            position: 'absolute',
            top: '20px',
            left: '20px',
            right: '20px',
            display: 'flex',
            justifyContent: 'space-between',
            alignItems: 'flex-start',
            zIndex: 50,
            pointerEvents: 'none'
          }}>
            {/* Left - Health & Score */}
            <div style={{
              background: 'rgba(0, 0, 0, 0.7)',
              padding: '15px 20px',
              borderRadius: '12px',
              color: 'white'
            }}>
              <div style={{ marginBottom: '10px' }}>
                <span style={{ marginRight: '10px' }}>❤️ Health</span>
                <div style={{
                  width: '150px',
                  height: '12px',
                  background: '#333',
                  borderRadius: '6px',
                  overflow: 'hidden',
                  display: 'inline-block',
                  verticalAlign: 'middle'
                }}>
                  <div style={{
                    width: `${health}%`,
                    height: '100%',
                    background: health > 50 ? '#22c55e' : health > 25 ? '#fbbf24' : '#ef4444',
                    transition: 'width 0.3s'
                  }} />
                </div>
              </div>
              <div>⭐ Score: <strong style={{ color: '#ffd700' }}>{score}</strong></div>
              <div>⏱️ Time: <strong>{Math.floor(timeElapsed)}s</strong></div>
              
              {/* Status Effects */}
              {statusEffect && (
                <div style={{
                  marginTop: '10px',
                  padding: '5px 10px',
                  borderRadius: '5px',
                  background: statusEffect === 'drowning' ? 'rgba(0, 100, 255, 0.5)' :
                             statusEffect === 'burning' ? 'rgba(255, 100, 0, 0.5)' :
                             statusEffect === 'freezing' ? 'rgba(100, 200, 255, 0.5)' : 'rgba(255, 255, 255, 0.3)',
                  animation: 'pulse 1s infinite'
                }}>
                  {statusEffect === 'drowning' && '🌊 DROWNING!'}
                  {statusEffect === 'burning' && '🔥 BURNING!'}
                  {statusEffect === 'freezing' && '❄️ FREEZING!'}
                </div>
              )}
              
              {/* Swimming indicator */}
              {isSwimming && (
                <div style={{
                  marginTop: '8px',
                  color: '#60a5fa',
                  fontWeight: 'bold'
                }}>
                  🏊 Swimming - Press SPACE to go up
                </div>
              )}
              
              {/* Climbing indicator */}
              {isClimbing && (
                <div style={{
                  marginTop: '8px',
                  color: '#fbbf24',
                  fontWeight: 'bold'
                }}>
                  🪜 Climbing - Hold W to climb
                </div>
              )}
              
              {/* Water level warning */}
              {waterLevel > 0.5 && (
                <div style={{
                  marginTop: '8px',
                  color: '#3b82f6',
                  fontWeight: 'bold'
                }}>
                  💧 Water Level: {waterLevel.toFixed(1)}m
                </div>
              )}
              
              {/* Wind indicator */}
              {windIntensity > 0 && (
                <div style={{
                  marginTop: '8px',
                  color: '#94a3b8'
                }}>
                  💨 Wind: {windIntensity.toFixed(0)} km/h
                </div>
              )}
            </div>

            {/* Right - Goal Info */}
            <div style={{
              background: 'rgba(0, 0, 0, 0.7)',
              padding: '15px 20px',
              borderRadius: '12px',
              color: 'white',
              textAlign: 'right'
            }}>
              <div style={{ color: '#ffd700', fontWeight: 'bold', marginBottom: '5px' }}>
                🎯 Current Objective
              </div>
              <div>{goals?.[currentGoalIndex]?.description || 'Reach the safe zone'}</div>
              <div style={{ fontSize: '0.9rem', color: '#888', marginTop: '5px' }}>
                Goal {currentGoalIndex + 1} of {goals?.length || 1}
              </div>
            </div>
          </div>

          {/* Fullscreen Button */}
          <button
            onClick={toggleFullscreen}
            style={{
              position: 'absolute',
              bottom: '20px',
              right: '20px',
              padding: '10px 15px',
              background: 'rgba(0, 0, 0, 0.7)',
              color: 'white',
              border: 'none',
              borderRadius: '8px',
              cursor: 'pointer',
              zIndex: 50
            }}
          >
            {isFullscreen ? '⬜ Exit Fullscreen' : '⬛ Fullscreen'}
          </button>

          {/* Crosshair */}
          <div style={{
            position: 'absolute',
            top: '50%',
            left: '50%',
            transform: 'translate(-50%, -50%)',
            width: '20px',
            height: '20px',
            border: '2px solid rgba(255, 255, 255, 0.5)',
            borderRadius: '50%',
            pointerEvents: 'none',
            zIndex: 50
          }}>
            <div style={{
              position: 'absolute',
              top: '50%',
              left: '50%',
              transform: 'translate(-50%, -50%)',
              width: '4px',
              height: '4px',
              background: 'rgba(255, 255, 255, 0.8)',
              borderRadius: '50%'
            }} />
          </div>
          
          {/* Disaster visual overlays */}
          {/* Underwater effect */}
          {isSwimming && (
            <div style={{
              position: 'absolute',
              top: 0,
              left: 0,
              width: '100%',
              height: '100%',
              background: 'linear-gradient(180deg, rgba(0, 100, 150, 0.4) 0%, rgba(0, 50, 100, 0.6) 100%)',
              pointerEvents: 'none',
              zIndex: 40
            }} />
          )}
          
          {/* Fire/heat overlay */}
          {statusEffect === 'burning' && (
            <div style={{
              position: 'absolute',
              top: 0,
              left: 0,
              width: '100%',
              height: '100%',
              background: 'radial-gradient(circle, transparent 30%, rgba(255, 100, 0, 0.3) 100%)',
              pointerEvents: 'none',
              zIndex: 40,
              animation: 'flicker 0.1s infinite'
            }} />
          )}
          
          {/* Rain overlay (cyclone) */}
          {windIntensity > 0 && (
            <div style={{
              position: 'absolute',
              top: 0,
              left: 0,
              width: '100%',
              height: '100%',
              background: 'repeating-linear-gradient(100deg, transparent, transparent 10px, rgba(200, 200, 255, 0.1) 10px, rgba(200, 200, 255, 0.1) 12px)',
              pointerEvents: 'none',
              zIndex: 40,
              animation: 'rain 0.3s linear infinite'
            }} />
          )}
          
          {/* Low health warning */}
          {health < 25 && (
            <div style={{
              position: 'absolute',
              top: 0,
              left: 0,
              width: '100%',
              height: '100%',
              border: '10px solid rgba(255, 0, 0, 0.5)',
              boxSizing: 'border-box',
              pointerEvents: 'none',
              zIndex: 45,
              animation: 'pulse 1s infinite'
            }} />
          )}
          
          {/* CSS Animations */}
          <style>{`
            @keyframes pulse {
              0%, 100% { opacity: 1; }
              50% { opacity: 0.5; }
            }
            @keyframes flicker {
              0%, 100% { opacity: 0.3; }
              50% { opacity: 0.5; }
            }
            @keyframes rain {
              0% { background-position: 0 0; }
              100% { background-position: 20px 40px; }
            }
          `}</style>
        </>
      )}

      {/* Victory Screen */}
      {goalReached && (
        <div style={{
          position: 'absolute',
          top: 0,
          left: 0,
          width: '100%',
          height: '100%',
          background: 'rgba(0, 0, 0, 0.9)',
          display: 'flex',
          flexDirection: 'column',
          alignItems: 'center',
          justifyContent: 'center',
          zIndex: 100,
          color: 'white'
        }}>
          <h1 style={{ fontSize: '3rem', color: '#22c55e', marginBottom: '20px' }}>
            🎉 MISSION COMPLETE!
          </h1>
          <div style={{
            background: 'rgba(30, 41, 59, 0.9)',
            padding: '30px',
            borderRadius: '16px',
            textAlign: 'center'
          }}>
            <div style={{ fontSize: '1.5rem', marginBottom: '15px' }}>
              ⭐ Final Score: <strong style={{ color: '#ffd700' }}>{score}</strong>
            </div>
            <div style={{ marginBottom: '10px' }}>⏱️ Time: {Math.floor(timeElapsed)} seconds</div>
            <div style={{ marginBottom: '10px' }}>❤️ Health: {health}%</div>
            <div style={{ marginBottom: '20px' }}>📦 Items Collected: {collectedItems.length}</div>
            
            <button
              onClick={() => onComplete?.({
                success: true,
                score,
                time: timeElapsed,
                health,
                collectibles: collectedItems.length
              })}
              style={{
                padding: '15px 30px',
                fontSize: '1.2rem',
                background: 'linear-gradient(135deg, #22c55e, #16a34a)',
                color: 'white',
                border: 'none',
                borderRadius: '8px',
                cursor: 'pointer',
                fontWeight: 'bold'
              }}
            >
              ✅ Continue
            </button>
          </div>
        </div>
      )}
    </div>
  );
}

export default TPPGameEngine;
