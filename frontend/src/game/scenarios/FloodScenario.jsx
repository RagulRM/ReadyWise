import React, { useState, useRef } from 'react';
import { Canvas, useFrame } from '@react-three/fiber';
import { OrbitControls, Text, Box, Sphere, Environment, PerspectiveCamera } from '@react-three/drei';

// Rising water
function Water({ level }) {
  return (
    <Box position={[0, level / 2, 0]} args={[40, level, 40]}>
      <meshStandardMaterial color="#4FC3F7" transparent opacity={0.6} />
    </Box>
  );
}

// House
function House({ position, floors }) {
  return (
    <group position={position}>
      {Array.from({ length: floors }).map((_, i) => (
        <Box key={i} position={[0, i * 3 + 1.5, 0]} args={[4, 3, 4]}>
          <meshStandardMaterial color={i === floors - 1 ? "#D32F2F" : "#8B7355"} />
        </Box>
      ))}
      {/* Roof */}
      <Box position={[0, floors * 3 + 0.3, 0]} args={[4.5, 0.3, 4.5]}>
        <meshStandardMaterial color="#5D4037" />
      </Box>
    </group>
  );
}

// Tree
function Tree({ position, isSafe }) {
  return (
    <group position={position}>
      <Box position={[0, 2, 0]} args={[0.5, 4, 0.5]}>
        <meshStandardMaterial color="#6D4C41" />
      </Box>
      <Sphere position={[0, 5, 0]} args={[2, 16, 16]}>
        <meshStandardMaterial color={isSafe ? "#FF6B6B" : "#4CAF50"} />
      </Sphere>
    </group>
  );
}

// Person
function Person({ position }) {
  return (
    <group position={position}>
      <Sphere args={[0.3, 16, 16]} position={[0, 0.8, 0]}>
        <meshStandardMaterial color="#FFD700" />
      </Sphere>
      <Box args={[0.4, 0.6, 0.3]} position={[0, 0.3, 0]}>
        <meshStandardMaterial color="#4169E1" />
      </Box>
    </group>
  );
}

// Emergency supplies
function Supplies({ position, collected, onClick }) {
  if (collected) return null;
  
  return (
    <group position={position} onClick={onClick}>
      <Box args={[0.8, 0.8, 0.8]}>
        <meshStandardMaterial color="#FFA726" />
      </Box>
      <Text position={[0, 1.2, 0]} fontSize={0.5} color="white">
        📦
      </Text>
    </group>
  );
}

const FloodScenario = ({ onComplete }) => {
  const [step, setStep] = useState(0);
  const [score, setScore] = useState(0);
  const [waterLevel, setWaterLevel] = useState(0.5);
  const [personPos, setPersonPos] = useState([0, 0, 8]);
  const [suppliesCollected, setSuppliesCollected] = useState(false);

  const scenarios = [
    {
      title: "🌧️ Flash Flood Warning!",
      description: "Heavy rain has caused rapid flooding in your area. Water is rising quickly!",
      instruction: "Click the emergency supply box to grab essential items",
      action: () => {
        setSuppliesCollected(true);
        setScore(score + 25);
        setTimeout(() => nextStep(), 1500);
      }
    },
    {
      title: "🏠 Move to Higher Floor",
      description: "Water is entering the ground floor. You need to move up immediately!",
      instruction: "Click 'Move Upstairs' to reach the second floor",
      action: () => {
        setPersonPos([0, 6, 8]);
        setScore(score + 35);
        setWaterLevel(3);
        setTimeout(() => nextStep(), 2000);
      }
    },
    {
      title: "✅ Safe on Upper Floor",
      description: "You're safe on the second floor with emergency supplies. Help is on the way!",
      instruction: "Click 'Complete' to finish the scenario",
      action: () => {
        setScore(score + 40);
        onComplete({
          success: true,
          score: score + 40,
          lessonsLearned: [
            'Move to higher floors during flooding',
            'Grab emergency supplies if safe to do so',
            'Never walk through flowing water',
            'Avoid basements and ground floors',
            'Wait for rescue - don\'t try to swim out',
            'Turn off electricity at main switch if safe'
          ]
        });
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
        <PerspectiveCamera makeDefault position={[15, 12, 15]} />
        <OrbitControls enablePan={false} maxPolarAngle={Math.PI / 2} minDistance={8} maxDistance={30} />
        
        <ambientLight intensity={0.4} />
        <directionalLight position={[10, 20, 10]} intensity={0.8} />
        
        {/* Ground */}
        <Box position={[0, -1, 0]} args={[40, 2, 40]}>
          <meshStandardMaterial color="#8D6E63" />
        </Box>

        {/* House (2 floors) */}
        <House position={[0, 0, 8]} floors={2} />

        {/* Trees (DANGEROUS in flood) */}
        <Tree position={[-8, 0, 5]} isSafe={false} />
        <Tree position={[8, 0, 6]} isSafe={false} />

        {/* Rising water */}
        <Water level={waterLevel} />

        {/* Person */}
        <Person position={personPos} />

        {/* Emergency supplies */}
        <Supplies 
          position={[2, 0.5, 8]} 
          collected={suppliesCollected}
          onClick={step === 0 ? scenarios[0].action : null}
        />

        {/* Rain effect (particles) */}
        {step < 2 && (
          <Text position={[0, 15, 0]} fontSize={2} color="#64B5F6" opacity={0.3}>
            🌧️ 🌧️ 🌧️
          </Text>
        )}

        <Text
          position={[0, 12, -5]}
          fontSize={0.8}
          color="white"
          anchorX="center"
        >
          {scenarios[step].title}
        </Text>

        <Environment preset="city" />
      </Canvas>

      {/* UI Overlay */}
      <div style={{
        position: 'absolute',
        top: '20px',
        left: '20px',
        right: '20px',
        background: 'rgba(33,150,243,0.95)',
        color: 'white',
        padding: '20px',
        borderRadius: '10px',
        maxWidth: '500px',
        border: '3px solid #1976D2'
      }}>
        <h2 style={{ margin: '0 0 10px 0' }}>{scenarios[step].title}</h2>
        <p style={{ margin: '0 0 10px 0' }}>{scenarios[step].description}</p>
        <p style={{ 
          margin: '0 0 15px 0', 
          color: '#FFEB3B',
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
          Score: {score}/100
          {suppliesCollected && <div>✓ Emergency supplies collected</div>}
        </div>
        {step === 1 && (
          <button
            onClick={scenarios[step].action}
            style={{
              background: '#FF9800',
              color: 'white',
              border: 'none',
              padding: '12px 24px',
              borderRadius: '5px',
              fontSize: '16px',
              cursor: 'pointer',
              width: '100%',
              fontWeight: 'bold'
            }}
          >
            🏃 Move Upstairs Now!
          </button>
        )}
        {step === scenarios.length - 1 && (
          <button
            onClick={scenarios[step].action}
            style={{
              background: '#4CAF50',
              color: 'white',
              border: 'none',
              padding: '12px 24px',
              borderRadius: '5px',
              fontSize: '16px',
              cursor: 'pointer',
              width: '100%'
            }}
          >
            Complete Scenario ✓
          </button>
        )}
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

export default FloodScenario;
