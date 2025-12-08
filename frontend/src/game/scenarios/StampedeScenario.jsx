import React, { useState, useRef } from 'react';
import { Canvas, useFrame } from '@react-three/fiber';
import { OrbitControls, Text, Box, Sphere, Cylinder, Environment, PerspectiveCamera } from '@react-three/drei';

// Crowd person
function CrowdPerson({ position, color, isPanicking }) {
  const meshRef = useRef();
  
  useFrame((state) => {
    if (meshRef.current && isPanicking) {
      meshRef.current.position.x += (Math.random() - 0.5) * 0.05;
      meshRef.current.position.z += (Math.random() - 0.5) * 0.05;
    }
  });

  return (
    <group ref={meshRef} position={position}>
      <Sphere args={[0.25, 16, 16]} position={[0, 0.7, 0]}>
        <meshStandardMaterial color="#FFD700" />
      </Sphere>
      <Box args={[0.35, 0.5, 0.25]} position={[0, 0.25, 0]}>
        <meshStandardMaterial color={color} />
      </Box>
    </group>
  );
}

// Exit door
function ExitDoor({ position, isOpen, onClick, label }) {
  return (
    <group position={position} onClick={onClick}>
      <Box args={[2.5, 4, 0.3]}>
        <meshStandardMaterial color={isOpen ? "#4CAF50" : "#8B4513"} />
      </Box>
      <Text position={[0, 4.8, 0]} fontSize={0.5} color="white">
        {label}
      </Text>
      <Box position={[0, 3, 0]} args={[2, 1, 0.1]}>
        <meshStandardMaterial color="#4CAF50" emissive="#2E7D32" emissiveIntensity={1.5} />
      </Box>
      <Text position={[0, 3, 0.1]} fontSize={0.4} color="white">
        EXIT
      </Text>
    </group>
  );
}

// Pillar/Support structure
function Pillar({ position }) {
  return (
    <Cylinder position={position} args={[0.5, 0.5, 5, 16]}>
      <meshStandardMaterial color="#BDBDBD" />
    </Cylinder>
  );
}

// Barrier/Railing
function Barrier({ position, rotation }) {
  return (
    <Box position={position} rotation={rotation} args={[0.2, 1, 8]}>
      <meshStandardMaterial color="#FFC107" />
    </Box>
  );
}

// Main character (you)
function Player({ position }) {
  return (
    <group position={position}>
      <Sphere args={[0.35, 16, 16]} position={[0, 0.9, 0]}>
        <meshStandardMaterial color="#FFD700" />
      </Sphere>
      <Box args={[0.5, 0.7, 0.35]} position={[0, 0.35, 0]}>
        <meshStandardMaterial color="#2196F3" />
      </Box>
      {/* Glow effect to distinguish from crowd */}
      <Sphere args={[0.6, 16, 16]} position={[0, 0.6, 0]}>
        <meshStandardMaterial color="#2196F3" transparent opacity={0.3} emissive="#2196F3" emissiveIntensity={0.5} />
      </Sphere>
    </group>
  );
}

const StampedeScenario = ({ onComplete }) => {
  const [step, setStep] = useState(0);
  const [score, setScore] = useState(0);
  const [playerPos, setPlayerPos] = useState([0, 0.5, 8]);
  const [foundPillar, setFoundPillar] = useState(false);
  const [usedSideExit, setUsedSideExit] = useState(false);
  const [crowdPanicking, setCrowdPanicking] = useState(false);

  const scenarios = [
    {
      title: "👥 Crowd Starts Panicking!",
      description: "You're in a crowded venue. People start rushing toward the main exit. DON'T FOLLOW!",
      instruction: "Click 'Stay Calm' to avoid joining the panic",
      action: () => {
        setCrowdPanicking(true);
        setScore(score + 30);
        setTimeout(() => nextStep(), 1500);
      }
    },
    {
      title: "🏛️ Find Support Structure",
      description: "The crowd is pushing. You need to protect yourself from being crushed.",
      instruction: "Click the pillar to move toward solid support",
      action: () => {
        setFoundPillar(true);
        setPlayerPos([-6, 0.5, 2]);
        setScore(score + 30);
        setTimeout(() => nextStep(), 2000);
      }
    },
    {
      title: "🚪 Use Alternate Exit",
      description: "Everyone is rushing to the main exit. Alternate exits are safer and less crowded!",
      instruction: "Click the side exit to evacuate safely",
      action: () => {
        setUsedSideExit(true);
        setPlayerPos([12, 0.5, -8]);
        setScore(score + 40);
        setTimeout(() => {
          onComplete({
            success: true,
            score: score + 40,
            lessonsLearned: [
              'Stay calm - panic makes stampedes worse',
              'Don\'t follow the crowd blindly',
              'Move to pillars or solid structures if caught',
              'Use alternate exits, not main entrances',
              'Keep hands up to protect chest',
              'If you fall, curl into fetal position protecting head',
              'Move diagonally away from crowd pressure',
              'Alert security about crowd density'
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

  // Generate crowd
  const crowdPositions = [];
  for (let x = -3; x <= 3; x += 1.5) {
    for (let z = -3; z <= 3; z += 1.5) {
      if (Math.abs(x) > 0.5 || Math.abs(z) > 0.5) {
        crowdPositions.push([x, 0.5, z]);
      }
    }
  }

  return (
    <div style={{ width: '100%', height: '100%', position: 'relative' }}>
      <Canvas>
        <PerspectiveCamera makeDefault position={[18, 14, 18]} />
        <OrbitControls enablePan={false} maxPolarAngle={Math.PI / 2} minDistance={10} maxDistance={30} />
        
        <ambientLight intensity={0.6} />
        <directionalLight position={[10, 15, 10]} intensity={1} />
        <pointLight position={[0, 8, 0]} intensity={0.5} color="#FF9800" />
        
        {/* Floor */}
        <Box position={[0, -0.5, 0]} args={[30, 1, 30]}>
          <meshStandardMaterial color="#757575" />
        </Box>

        {/* Walls */}
        <Box position={[0, 3, -15]} args={[30, 6, 0.5]}>
          <meshStandardMaterial color="#9E9E9E" />
        </Box>
        <Box position={[-15, 3, 0]} args={[0.5, 6, 30]}>
          <meshStandardMaterial color="#9E9E9E" />
        </Box>
        <Box position={[15, 3, 0]} args={[0.5, 6, 30]}>
          <meshStandardMaterial color="#9E9E9E" />
        </Box>

        {/* Pillars (SAFE SPOTS) */}
        <Pillar position={[-6, 2.5, 2]} />
        <Pillar position={[6, 2.5, 2]} />
        <Pillar position={[-6, 2.5, -8]} />
        <Pillar position={[6, 2.5, -8]} />

        {/* Barriers */}
        <Barrier position={[0, 0.5, -5]} rotation={[0, 0, 0]} />

        {/* Exits */}
        <ExitDoor 
          position={[0, 2, 14.7]} 
          isOpen={false}
          label="Main Exit (CROWDED)"
        />
        <ExitDoor 
          position={[14.7, 2, -8]} 
          isOpen={usedSideExit}
          onClick={step === 2 ? scenarios[2].action : null}
          label="Side Exit"
        />

        {/* Crowd */}
        {crowdPositions.map((pos, i) => (
          <CrowdPerson 
            key={i} 
            position={pos} 
            color={i % 3 === 0 ? "#F44336" : i % 3 === 1 ? "#9C27B0" : "#FF9800"}
            isPanicking={crowdPanicking}
          />
        ))}

        {/* Player */}
        <Player position={playerPos} />

        {/* Highlight pillar when needed */}
        {step === 1 && (
          <mesh 
            position={[-6, 2.5, 2]} 
            onClick={scenarios[1].action}
          >
            <cylinderGeometry args={[0.7, 0.7, 5, 16]} />
            <meshStandardMaterial 
              color="#4CAF50" 
              transparent 
              opacity={0.3}
              emissive="#4CAF50"
              emissiveIntensity={0.8}
            />
          </mesh>
        )}

        <Text
          position={[0, 10, -5]}
          fontSize={0.8}
          color="white"
          anchorX="center"
        >
          {scenarios[step].title}
        </Text>

        <Environment preset="warehouse" />
      </Canvas>

      {/* UI Overlay */}
      <div style={{
        position: 'absolute',
        top: '20px',
        left: '20px',
        right: '20px',
        background: 'rgba(233,30,99,0.95)',
        color: 'white',
        padding: '20px',
        borderRadius: '10px',
        maxWidth: '500px',
        border: '3px solid #C2185B'
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
          {!crowdPanicking && <div>✓ Staying calm</div>}
          {foundPillar && <div>✓ Protected by pillar</div>}
          {usedSideExit && <div>✓ Evacuated safely</div>}
        </div>
        {step === 0 && (
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
              width: '100%',
              fontWeight: 'bold'
            }}
          >
            🧘 Stay Calm
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
        🖱️ Drag to rotate view | Scroll to zoom | You are the BLUE glowing person
      </div>
    </div>
  );
};

export default StampedeScenario;
