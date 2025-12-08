import React, { useState, useRef } from 'react';
import { Canvas, useFrame } from '@react-three/fiber';
import { OrbitControls, Text, Box, Sphere, Cylinder, Environment, PerspectiveCamera } from '@react-three/drei';

// Sun (intense heat visualization)
function Sun({ intensity }) {
  return (
    <Sphere position={[15, 15, -10]} args={[3, 32, 32]}>
      <meshStandardMaterial 
        color="#FFA000" 
        emissive="#FF6F00" 
        emissiveIntensity={intensity}
      />
    </Sphere>
  );
}

// Water bottle
function WaterBottle({ position, collected, onClick }) {
  if (collected) return null;
  
  return (
    <group position={position} onClick={onClick}>
      <Cylinder args={[0.2, 0.2, 0.8, 16]}>
        <meshStandardMaterial color="#4FC3F7" transparent opacity={0.7} />
      </Cylinder>
      <Text position={[0, 1, 0]} fontSize={0.4} color="white">
        💧
      </Text>
    </group>
  );
}

// Shade/Tree
function ShadeTree({ position, underShade, onClick }) {
  return (
    <group position={position} onClick={onClick}>
      <Cylinder args={[0.4, 0.5, 6, 8]} position={[0, 3, 0]}>
        <meshStandardMaterial color="#6D4C41" />
      </Cylinder>
      <Sphere args={[3, 16, 16]} position={[0, 7, 0]}>
        <meshStandardMaterial color={underShade ? "#2E7D32" : "#66BB6A"} />
      </Sphere>
    </group>
  );
}

// Person (with heat stress indicators)
function Person({ position, hasWater, inShade }) {
  const color = hasWater && inShade ? "#4CAF50" : (!hasWater || !inShade) ? "#FF9800" : "#F44336";
  
  return (
    <group position={position}>
      <Sphere args={[0.3, 16, 16]} position={[0, 0.8, 0]}>
        <meshStandardMaterial color="#FFD700" />
      </Sphere>
      <Box args={[0.4, 0.6, 0.3]} position={[0, 0.3, 0]}>
        <meshStandardMaterial color={color} />
      </Box>
      {/* Sweat particles */}
      {!inShade && (
        <>
          <Sphere args={[0.05, 8, 8]} position={[-0.2, 0.7, 0.2]}>
            <meshStandardMaterial color="#4FC3F7" transparent opacity={0.6} />
          </Sphere>
          <Sphere args={[0.05, 8, 8]} position={[0.2, 0.7, 0.2]}>
            <meshStandardMaterial color="#4FC3F7" transparent opacity={0.6} />
          </Sphere>
        </>
      )}
    </group>
  );
}

// Building (potential air-conditioned shelter)
function Building({ position, isCooled, onClick }) {
  return (
    <group position={position} onClick={onClick}>
      <Box args={[4, 5, 4]}>
        <meshStandardMaterial color={isCooled ? "#42A5F5" : "#8B7355"} />
      </Box>
      {isCooled && (
        <Text position={[0, 6, 0]} fontSize={0.6} color="white">
          ❄️ AC
        </Text>
      )}
    </group>
  );
}

const HeatwaveScenario = ({ onComplete }) => {
  const [step, setStep] = useState(0);
  const [score, setScore] = useState(0);
  const [hasWater, setHasWater] = useState(false);
  const [inShade, setInShade] = useState(false);
  const [inCooledBuilding, setInCooledBuilding] = useState(false);
  const [personPos, setPersonPos] = useState([0, 0.5, 8]);
  const [temperature, setTemperature] = useState(45);

  const scenarios = [
    {
      title: "☀️ Extreme Heatwave Alert!",
      description: "Temperature is 45°C (113°F). You're outside and feeling dizzy.",
      instruction: "Click the water bottle to hydrate immediately",
      action: () => {
        setHasWater(true);
        setScore(score + 30);
        setTimeout(() => nextStep(), 1500);
      }
    },
    {
      title: "🌳 Find Shade",
      description: "Direct sunlight is dangerous. You need to cool down.",
      instruction: "Click the tree to move into shade",
      action: () => {
        setInShade(true);
        setPersonPos([-6, 0.5, 2]);
        setTemperature(38);
        setScore(score + 30);
        setTimeout(() => nextStep(), 2000);
      }
    },
    {
      title: "❄️ Move Indoors",
      description: "It's still very hot. The safest place is an air-conditioned building.",
      instruction: "Click the building to go inside",
      action: () => {
        setInCooledBuilding(true);
        setPersonPos([8, 0.5, -6]);
        setTemperature(24);
        setScore(score + 40);
        setTimeout(() => {
          onComplete({
            success: true,
            score: score + 40,
            lessonsLearned: [
              'Drink plenty of water (avoid caffeine/alcohol)',
              'Stay in shade during peak sun hours (11 AM - 4 PM)',
              'Wear light-colored, loose-fitting clothes',
              'Use air conditioning or go to cooling centers',
              'Never leave children/pets in vehicles',
              'Check on elderly neighbors',
              'Recognize heat stroke symptoms: confusion, no sweating, rapid pulse'
            ]
          });
        }, 2500);
      }
    }
  ];

  const nextStep = () => {
    if (step < scenarios.length - 1) {
      setStep(step + 1);
    }
  };

  return (
    <div style={{ width: '100%', height: '100%', position: 'relative' }}>
      <Canvas>
        <PerspectiveCamera makeDefault position={[15, 10, 15]} />
        <OrbitControls enablePan={false} maxPolarAngle={Math.PI / 2} minDistance={10} maxDistance={30} />
        
        <ambientLight intensity={0.8} />
        <directionalLight position={[15, 15, -10]} intensity={2} color="#FFA000" />
        <pointLight position={[0, 10, 0]} intensity={1} color="#FFD54F" />
        
        {/* Ground (hot pavement) */}
        <Box position={[0, -0.5, 0]} args={[40, 1, 40]}>
          <meshStandardMaterial color="#D7CCC8" />
        </Box>

        {/* Sun */}
        <Sun intensity={temperature / 20} />

        {/* Shade tree */}
        <ShadeTree 
          position={[-6, 0, 2]} 
          underShade={inShade}
          onClick={step === 1 ? scenarios[1].action : null}
        />

        {/* Air-conditioned building */}
        <Building 
          position={[8, 2.5, -6]} 
          isCooled={inCooledBuilding}
          onClick={step === 2 ? scenarios[2].action : null}
        />

        {/* Water bottle */}
        <WaterBottle 
          position={[2, 0.5, 6]} 
          collected={hasWater}
          onClick={step === 0 ? scenarios[0].action : null}
        />

        {/* Person */}
        <Person position={personPos} hasWater={hasWater} inShade={inShade || inCooledBuilding} />

        {/* Heat wave effect text */}
        <Text
          position={[0, 12, -5]}
          fontSize={0.8}
          color="#FF6F00"
          anchorX="center"
        >
          {scenarios[step].title}
        </Text>

        <Environment preset="sunset" />
      </Canvas>

      {/* UI Overlay */}
      <div style={{
        position: 'absolute',
        top: '20px',
        left: '20px',
        right: '20px',
        background: 'rgba(255,152,0,0.95)',
        color: 'white',
        padding: '20px',
        borderRadius: '10px',
        maxWidth: '500px',
        border: '3px solid #F57C00'
      }}>
        <h2 style={{ margin: '0 0 10px 0' }}>{scenarios[step].title}</h2>
        <p style={{ margin: '0 0 10px 0' }}>{scenarios[step].description}</p>
        <p style={{ 
          margin: '0 0 15px 0', 
          color: '#FFF59D',
          fontWeight: 'bold'
        }}>
          💡 {scenarios[step].instruction}
        </p>
        <div style={{ 
          background: 'rgba(255,255,255,0.2)', 
          padding: '10px', 
          borderRadius: '5px',
          marginBottom: '10px'
        }}>
          <div>Score: {score}/100</div>
          <div style={{ color: temperature > 40 ? '#FF1744' : temperature > 35 ? '#FFC107' : '#4CAF50' }}>
            🌡️ Temperature: {temperature}°C
          </div>
          {hasWater && <div>✓ Hydrated</div>}
          {inShade && <div>✓ In shade</div>}
          {inCooledBuilding && <div>✓ Cooled down</div>}
        </div>
      </div>

      <div style={{
        position: 'absolute',
        bottom: '20px',
        left: '50%',
        transform: 'translateX(-50%)',
        background: 'rgba(0,0,0,0.7)',
        color: 'white',
        padding: '10px 20px',
        borderRadius: '20px',
        fontSize: '14px'
      }}>
        🖱️ Drag to rotate view | Scroll to zoom
      </div>
    </div>
  );
};

export default HeatwaveScenario;
