import React, { useState, useRef } from 'react';
import { Canvas, useFrame } from '@react-three/fiber';
import { OrbitControls, Text, Box, Sphere, Environment, PerspectiveCamera } from '@react-three/drei';

// Animated fire/smoke
function Fire({ position }) {
  const meshRef = useRef();
  
  useFrame((state) => {
    if (meshRef.current) {
      meshRef.current.position.y = position[1] + Math.sin(state.clock.elapsedTime * 3) * 0.3;
      meshRef.current.scale.x = 1 + Math.sin(state.clock.elapsedTime * 2) * 0.2;
      meshRef.current.scale.z = 1 + Math.cos(state.clock.elapsedTime * 2) * 0.2;
    }
  });

  return (
    <Sphere ref={meshRef} position={position} args={[0.8, 16, 16]}>
      <meshStandardMaterial color="#FF6B00" emissive="#FF4500" emissiveIntensity={2} />
    </Sphere>
  );
}

// Smoke
function Smoke({ position, height }) {
  const meshRef = useRef();
  
  useFrame((state) => {
    if (meshRef.current) {
      meshRef.current.position.y = position[1] + (state.clock.elapsedTime % 5);
    }
  });

  return (
    <Sphere ref={meshRef} position={position} args={[1.5, 16, 16]}>
      <meshStandardMaterial color="#555" transparent opacity={0.4} />
    </Sphere>
  );
}

// Room with door
function Room({ position, doorOpen }) {
  return (
    <group position={position}>
      {/* Walls */}
      <Box position={[0, 2, -5]} args={[10, 4, 0.2]}>
        <meshStandardMaterial color="#E0E0E0" />
      </Box>
      <Box position={[-5, 2, 0]} args={[0.2, 4, 10]}>
        <meshStandardMaterial color="#E0E0E0" />
      </Box>
      <Box position={[5, 2, 0]} args={[0.2, 4, 10]}>
        <meshStandardMaterial color="#E0E0E0" />
      </Box>
      
      {/* Door */}
      {!doorOpen && (
        <Box position={[0, 2, 5]} args={[2, 4, 0.2]}>
          <meshStandardMaterial color="#8B4513" />
        </Box>
      )}
      
      {/* Floor */}
      <Box position={[0, 0, 0]} args={[10, 0.2, 10]}>
        <meshStandardMaterial color="#BDBDBD" />
      </Box>
    </group>
  );
}

// Exit sign
function ExitSign({ position, onClick, isCorrect }) {
  return (
    <group position={position} onClick={onClick}>
      <Box args={[1.5, 0.8, 0.1]}>
        <meshStandardMaterial color={isCorrect ? "#4CAF50" : "#F44336"} emissive={isCorrect ? "#2E7D32" : "#C62828"} emissiveIntensity={1} />
      </Box>
      <Text position={[0, 0, 0.1]} fontSize={0.4} color="white">
        EXIT
      </Text>
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

// Wet cloth (for smoke protection)
function WetCloth({ position, collected, onClick }) {
  if (collected) return null;
  
  return (
    <group position={position} onClick={onClick}>
      <Box args={[0.8, 0.6, 0.1]}>
        <meshStandardMaterial color="#4FC3F7" />
      </Box>
      <Text position={[0, 0.8, 0]} fontSize={0.3} color="white">
        🧻
      </Text>
    </group>
  );
}

const FireScenario = ({ onComplete }) => {
  const [step, setStep] = useState(0);
  const [score, setScore] = useState(0);
  const [personPos, setPersonPos] = useState([0, 0.5, 0]);
  const [clothCollected, setClothCollected] = useState(false);
  const [doorOpen, setDoorOpen] = useState(false);
  const [smokeDensity, setSmokeDensity] = useState(3);

  const scenarios = [
    {
      title: "🔥 Fire in the Building!",
      description: "Smoke is filling the room. You need to protect yourself before evacuating.",
      instruction: "Click the wet cloth to cover your nose and mouth",
      action: () => {
        setClothCollected(true);
        setScore(score + 30);
        setTimeout(() => nextStep(), 1500);
      }
    },
    {
      title: "🚪 Check the Door",
      description: "Before opening a door during a fire, you should check if it's hot!",
      instruction: "Click 'Touch Door' to check temperature",
      action: () => {
        setScore(score + 30);
        setTimeout(() => nextStep(), 2000);
      }
    },
    {
      title: "✅ Safe to Exit!",
      description: "Door is not hot. Exit quickly staying low to avoid smoke.",
      instruction: "Click 'Exit' to escape safely",
      action: () => {
        setDoorOpen(true);
        setPersonPos([0, 0.5, 8]);
        setScore(score + 40);
        setTimeout(() => {
          onComplete({
            success: true,
            score: score + 40,
            lessonsLearned: [
              'Cover nose and mouth with wet cloth',
              'Stay low where air is clearer',
              'Touch doors before opening (check for heat)',
              'Never use elevators during fire',
              'Once out, stay out - never go back',
              'Call emergency services (fire department)'
            ]
          });
        }, 2000);
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
        <PerspectiveCamera makeDefault position={[8, 6, 12]} />
        <OrbitControls enablePan={false} maxPolarAngle={Math.PI / 2} minDistance={5} maxDistance={20} />
        
        <ambientLight intensity={0.3} />
        <pointLight position={[-3, 1, -3]} intensity={10} color="#FF4500" />
        <directionalLight position={[10, 10, 5]} intensity={0.5} />
        
        {/* Room */}
        <Room position={[0, 0, 0]} doorOpen={doorOpen} />

        {/* Fire source */}
        <Fire position={[-3, 1, -3]} />
        <Fire position={[-2, 0.8, -2]} />

        {/* Smoke */}
        {Array.from({ length: smokeDensity }).map((_, i) => (
          <Smoke key={i} position={[Math.random() * 4 - 2, 2, Math.random() * 4 - 2]} />
        ))}

        {/* Person */}
        <Person position={personPos} />

        {/* Wet cloth */}
        <WetCloth 
          position={[2, 1, 2]} 
          collected={clothCollected}
          onClick={step === 0 ? scenarios[0].action : null}
        />

        {/* Exit sign */}
        {step >= 1 && (
          <ExitSign 
            position={[0, 3.5, 4.9]} 
            onClick={step === 2 ? scenarios[2].action : null}
            isCorrect={true}
          />
        )}

        <Text
          position={[0, 5, 0]}
          fontSize={0.6}
          color="white"
          anchorX="center"
        >
          {scenarios[step].title}
        </Text>

        <Environment preset="night" />
      </Canvas>

      {/* UI Overlay */}
      <div style={{
        position: 'absolute',
        top: '20px',
        left: '20px',
        right: '20px',
        background: 'rgba(244,67,54,0.95)',
        color: 'white',
        padding: '20px',
        borderRadius: '10px',
        maxWidth: '500px',
        border: '3px solid #D32F2F'
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
          {clothCollected && <div>✓ Protected from smoke</div>}
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
            👋 Touch Door (Check Temperature)
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

export default FireScenario;
