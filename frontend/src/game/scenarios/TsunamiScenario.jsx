import React, { useState, useRef } from 'react';
import { Canvas, useFrame } from '@react-three/fiber';
import { OrbitControls, Text, Box, Sphere, Environment, PerspectiveCamera } from '@react-three/drei';
import * as THREE from 'three';

// Animated water wave
function WaterWave({ height, speed }) {
  const meshRef = useRef();
  
  useFrame((state) => {
    if (meshRef.current) {
      const time = state.clock.elapsedTime * speed;
      meshRef.current.position.z = -10 + time * 2;
      if (meshRef.current.position.z > 10) {
        meshRef.current.position.z = -10;
      }
    }
  });

  return (
    <Box ref={meshRef} position={[0, height, 0]} args={[50, height * 2, 3]}>
      <meshStandardMaterial color="#1E88E5" transparent opacity={0.7} />
    </Box>
  );
}

// Beach area
function Beach({ position }) {
  return (
    <Box position={position} args={[50, 0.5, 20]}>
      <meshStandardMaterial color="#F4A460" />
    </Box>
  );
}

// Hill/High ground
function Hill({ position, isSafe }) {
  return (
    <group position={position}>
      <Box position={[0, 2, 0]} args={[8, 4, 8]}>
        <meshStandardMaterial color={isSafe ? "#2E7D32" : "#558B2F"} />
      </Box>
      <Box position={[0, 0.5, 0]} args={[10, 1, 10]}>
        <meshStandardMaterial color="#7CB342" />
      </Box>
    </group>
  );
}

// Building (potential shelter)
function Building({ position, height, isTall }) {
  return (
    <Box position={[position[0], height / 2, position[2]]} args={[3, height, 3]}>
      <meshStandardMaterial color={isTall ? "#FF5722" : "#8B7355"} />
    </Box>
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

// Warning sign
function WarningSign({ position, onClick }) {
  return (
    <group position={position} onClick={onClick}>
      <Box args={[0.1, 2, 0.1]} position={[0, 1, 0]}>
        <meshStandardMaterial color="#654321" />
      </Box>
      <Box args={[1.5, 1.5, 0.1]} position={[0, 2.5, 0]}>
        <meshStandardMaterial color="#FFD700" />
      </Box>
      <Text position={[0, 2.5, 0.1]} fontSize={0.6} color="red">
        ⚠️
      </Text>
    </group>
  );
}

const TsunamiScenario = ({ onComplete }) => {
  const [step, setStep] = useState(0);
  const [score, setScore] = useState(0);
  const [waterLevel, setWaterLevel] = useState(0.5);
  const [personPos, setPersonPos] = useState([0, 0, 5]);
  const [showWarning, setShowWarning] = useState(true);

  const scenarios = [
    {
      title: "🌊 Warning: Tsunami Alert!",
      description: "You are at the beach. An earthquake has occurred offshore and a tsunami warning has been issued.",
      instruction: "Click the warning sign to acknowledge the alert",
      action: () => {
        setScore(score + 20);
        setShowWarning(false);
        setTimeout(() => nextStep(), 1500);
      }
    },
    {
      title: "🏃 Evacuate Immediately!",
      description: "Water is receding rapidly from the shore - this is a sign a tsunami is coming!",
      instruction: "Click 'Move to High Ground' to evacuate",
      action: () => {
        setPersonPos([12, 3, -8]);
        setScore(score + 40);
        setTimeout(() => {
          setWaterLevel(4);
          nextStep();
        }, 2000);
      }
    },
    {
      title: "✅ You are Safe!",
      description: "You reached high ground in time. The tsunami wave passed below you.",
      instruction: "Click 'Complete' to finish",
      action: () => {
        setScore(score + 40);
        onComplete({
          success: true,
          score: score + 40,
          lessonsLearned: [
            'Heed tsunami warnings immediately',
            'Move to high ground (at least 30m elevation)',
            'Never go to the beach to watch the wave',
            'Stay on high ground until authorities say it\'s safe',
            'Receding water is a natural tsunami warning sign'
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
        <PerspectiveCamera makeDefault position={[20, 15, 20]} />
        <OrbitControls enablePan={false} maxPolarAngle={Math.PI / 2} minDistance={10} maxDistance={40} />
        
        <ambientLight intensity={0.6} />
        <directionalLight position={[10, 20, 10]} intensity={1} />
        
        {/* Ocean */}
        <Box position={[0, -5, -15]} args={[50, 10, 30]}>
          <meshStandardMaterial color="#006994" />
        </Box>

        {/* Beach */}
        <Beach position={[0, 0, 5]} />

        {/* Buildings near shore (DANGEROUS) */}
        <Building position={[-8, 0, 8]} height={3} isTall={false} />
        <Building position={[8, 0, 7]} height={4} isTall={false} />

        {/* Hill (SAFE) */}
        <Hill position={[12, 0, -8]} isSafe={step >= 2} />

        {/* Person */}
        <Person position={personPos} />

        {/* Warning sign */}
        {showWarning && (
          <WarningSign 
            position={[0, 0, 8]} 
            onClick={step === 0 ? scenarios[0].action : null}
          />
        )}

        {/* Tsunami wave */}
        {waterLevel > 0.5 && (
          <>
            <WaterWave height={waterLevel} speed={1.5} />
            <WaterWave height={waterLevel - 0.5} speed={1.2} />
          </>
        )}

        {/* Title in 3D */}
        <Text
          position={[0, 10, -5]}
          fontSize={0.8}
          color="white"
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
        background: 'rgba(255,69,0,0.95)',
        color: 'white',
        padding: '20px',
        borderRadius: '10px',
        maxWidth: '500px',
        border: '3px solid #FF0000'
      }}>
        <h2 style={{ margin: '0 0 10px 0' }}>{scenarios[step].title}</h2>
        <p style={{ margin: '0 0 10px 0' }}>{scenarios[step].description}</p>
        <p style={{ 
          margin: '0 0 15px 0', 
          color: '#FFFF00',
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
        </div>
        {step === 1 && (
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
            🏃 Move to High Ground NOW!
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

      {/* Controls hint */}
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

export default TsunamiScenario;
