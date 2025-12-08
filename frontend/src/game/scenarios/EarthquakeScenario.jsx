import React, { useState, useRef } from 'react';
import { Canvas, useFrame } from '@react-three/fiber';
import { OrbitControls, Text, Box, Sphere, Environment, PerspectiveCamera } from '@react-three/drei';
import * as THREE from 'three';

// Animated Building Component
function Building({ position, shake }) {
  const meshRef = useRef();
  
  useFrame((state) => {
    if (shake && meshRef.current) {
      meshRef.current.rotation.x = Math.sin(state.clock.elapsedTime * 10) * 0.05;
      meshRef.current.rotation.z = Math.cos(state.clock.elapsedTime * 10) * 0.05;
      meshRef.current.position.y = position[1] + Math.sin(state.clock.elapsedTime * 15) * 0.1;
    }
  });

  return (
    <Box ref={meshRef} position={position} args={[2, 4, 2]}>
      <meshStandardMaterial color="#8B7355" />
    </Box>
  );
}

// Desk for Drop-Cover-Hold demonstration
function Desk({ position, isUnder, onClick }) {
  return (
    <group position={position} onClick={onClick}>
      <Box position={[0, 0.75, 0]} args={[2, 0.1, 1.5]}>
        <meshStandardMaterial color={isUnder ? "#4CAF50" : "#8B4513"} />
      </Box>
      <Box position={[-0.9, 0.35, -0.6]} args={[0.1, 0.7, 0.1]}>
        <meshStandardMaterial color="#654321" />
      </Box>
      <Box position={[0.9, 0.35, -0.6]} args={[0.1, 0.7, 0.1]}>
        <meshStandardMaterial color="#654321" />
      </Box>
      <Box position={[-0.9, 0.35, 0.6]} args={[0.1, 0.7, 0.1]}>
        <meshStandardMaterial color="#654321" />
      </Box>
      <Box position={[0.9, 0.35, 0.6]} args={[0.1, 0.7, 0.1]}>
        <meshStandardMaterial color="#654321" />
      </Box>
    </group>
  );
}

// Falling debris
function Debris({ position }) {
  const meshRef = useRef();
  const velocity = useRef(0);
  
  useFrame(() => {
    if (meshRef.current && meshRef.current.position.y > 0) {
      velocity.current += 0.01;
      meshRef.current.position.y -= velocity.current;
      meshRef.current.rotation.x += 0.1;
      meshRef.current.rotation.y += 0.05;
    }
  });

  return (
    <Box ref={meshRef} position={position} args={[0.3, 0.3, 0.3]}>
      <meshStandardMaterial color="#666" />
    </Box>
  );
}

// Person (student)
function Person({ position, isUnderDesk }) {
  return (
    <group position={position}>
      {/* Head */}
      <Sphere args={[0.2, 16, 16]} position={[0, isUnderDesk ? 0.3 : 0.6, 0]}>
        <meshStandardMaterial color="#FFD700" />
      </Sphere>
      {/* Body */}
      <Box args={[0.3, isUnderDesk ? 0.2 : 0.4, 0.2]} position={[0, isUnderDesk ? 0.1 : 0.3, 0]}>
        <meshStandardMaterial color="#4169E1" />
      </Box>
    </group>
  );
}

const EarthquakeScenario = ({ onComplete }) => {
  const [step, setStep] = useState(0);
  const [score, setScore] = useState(0);
  const [shake, setShake] = useState(false);
  const [isUnderDesk, setIsUnderDesk] = useState(false);
  const [showDebris, setShowDebris] = useState(false);

  const scenarios = [
    {
      title: "📚 You are in a classroom",
      description: "Suddenly, you feel the ground shaking. What should you do?",
      instruction: "Click on the desk to practice DROP, COVER, and HOLD ON!",
      action: () => {
        setIsUnderDesk(true);
        setScore(score + 30);
        setTimeout(() => nextStep(), 2000);
      }
    },
    {
      title: "🏫 Earthquake intensifies!",
      description: "The building is shaking violently. Debris is falling from the ceiling.",
      instruction: "Stay under the desk and observe how it protects you",
      action: () => {
        setShake(true);
        setShowDebris(true);
        setScore(score + 30);
        setTimeout(() => nextStep(), 3000);
      }
    },
    {
      title: "✅ Shaking has stopped",
      description: "The earthquake is over. Now you need to evacuate safely.",
      instruction: "Click 'Complete' to finish the scenario",
      action: () => {
        setScore(score + 40);
        onComplete({ 
          success: true, 
          score: score + 40,
          lessonsLearned: [
            'DROP to hands and knees',
            'COVER head and neck under desk',
            'HOLD ON until shaking stops',
            'Evacuate calmly after earthquake'
          ]
        });
      }
    }
  ];

  const nextStep = () => {
    if (step < scenarios.length - 1) {
      setStep(step + 1);
      if (step === 0) {
        scenarios[step + 1].action();
      }
    }
  };

  return (
    <div style={{ width: '100%', height: '100%', position: 'relative' }}>
      {/* 3D Scene */}
      <Canvas>
        <PerspectiveCamera makeDefault position={[8, 6, 8]} />
        <OrbitControls enablePan={false} maxPolarAngle={Math.PI / 2} minDistance={5} maxDistance={15} />
        
        <ambientLight intensity={0.5} />
        <directionalLight position={[10, 10, 5]} intensity={1} />
        
        {/* Ground */}
        <Box position={[0, -0.1, 0]} args={[20, 0.2, 20]}>
          <meshStandardMaterial color="#E0E0E0" />
        </Box>

        {/* Buildings in background */}
        <Building position={[-6, 2, -6]} shake={shake} />
        <Building position={[6, 2, -6]} shake={shake} />
        
        {/* Classroom desk */}
        <Desk 
          position={[0, 0, 0]} 
          isUnder={isUnderDesk}
          onClick={step === 0 ? scenarios[0].action : null}
        />

        {/* Person */}
        <Person position={[0, 0, 0]} isUnderDesk={isUnderDesk} />

        {/* Falling debris */}
        {showDebris && (
          <>
            <Debris position={[-3, 6, 2]} />
            <Debris position={[2, 7, -1]} />
            <Debris position={[4, 6.5, 3]} />
          </>
        )}

        {/* Instructions in 3D space */}
        <Text
          position={[0, 4, -5]}
          fontSize={0.5}
          color="black"
          anchorX="center"
          anchorY="middle"
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
        background: 'rgba(0,0,0,0.8)',
        color: 'white',
        padding: '20px',
        borderRadius: '10px',
        maxWidth: '500px'
      }}>
        <h2 style={{ margin: '0 0 10px 0' }}>{scenarios[step].title}</h2>
        <p style={{ margin: '0 0 10px 0' }}>{scenarios[step].description}</p>
        <p style={{ 
          margin: '0 0 15px 0', 
          color: '#4CAF50',
          fontWeight: 'bold'
        }}>
          💡 {scenarios[step].instruction}
        </p>
        <div style={{ 
          background: 'rgba(255,255,255,0.1)', 
          padding: '10px', 
          borderRadius: '5px',
          marginBottom: '10px'
        }}>
          Score: {score}/100
        </div>
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

export default EarthquakeScenario;
