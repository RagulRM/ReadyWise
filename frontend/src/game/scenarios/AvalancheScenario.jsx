import React, { useState, useRef } from 'react';
import { Canvas, useFrame } from '@react-three/fiber';
import { OrbitControls, Text, Box, Sphere, Cylinder, Environment, PerspectiveCamera } from '@react-three/drei';

// Mountain with snow
function SnowyMountain({ position }) {
  return (
    <group position={position}>
      <Box position={[0, 8, 0]} args={[25, 16, 20]} rotation={[0, 0, 0.4]}>
        <meshStandardMaterial color="#E0E0E0" />
      </Box>
      <Box position={[5, 4, 0]} args={[20, 8, 20]} rotation={[0, 0, 0.4]}>
        <meshStandardMaterial color="#F5F5F5" />
      </Box>
    </group>
  );
}

// Avalanche (rolling snow)
function AvalancheSnow({ position, speed, active }) {
  const meshRef = useRef();
  
  useFrame(() => {
    if (meshRef.current && active) {
      meshRef.current.position.y -= speed * 0.08;
      meshRef.current.position.x -= speed * 0.12;
      meshRef.current.scale.x += 0.02;
      meshRef.current.scale.z += 0.02;
    }
  });

  if (!active) return null;

  return (
    <Sphere ref={meshRef} position={position} args={[2, 16, 16]}>
      <meshStandardMaterial color="#FAFAFA" opacity={0.8} transparent />
    </Sphere>
  );
}

// Safe shelter
function Shelter({ position, reached, onClick }) {
  return (
    <group position={position} onClick={onClick}>
      <Box args={[4, 3, 4]}>
        <meshStandardMaterial color={reached ? "#4CAF50" : "#795548"} />
      </Box>
      <Box position={[0, 2, 0]} args={[5, 1, 5]}>
        <meshStandardMaterial color="#5D4037" />
      </Box>
      <Text position={[0, 4, 0]} fontSize={0.6} color="white">
        ⛺ SHELTER
      </Text>
    </group>
  );
}

// Warning flag
function WarningFlag({ position, acknowledged, onClick }) {
  return (
    <group position={position} onClick={onClick}>
      <Cylinder args={[0.1, 0.1, 3, 8]}>
        <meshStandardMaterial color="#424242" />
      </Cylinder>
      <Box position={[0.5, 2, 0]} args={[1, 0.6, 0.1]}>
        <meshStandardMaterial color={acknowledged ? "#4CAF50" : "#F44336"} />
      </Box>
      <Text position={[0.5, 2, 0.1]} fontSize={0.3} color="white">
        ⚠️
      </Text>
    </group>
  );
}

// Tree (obstacle - dangerous during avalanche)
function Tree({ position }) {
  return (
    <group position={position}>
      <Cylinder args={[0.3, 0.4, 4, 8]} position={[0, 2, 0]}>
        <meshStandardMaterial color="#4E342E" />
      </Cylinder>
      <Sphere args={[1.2, 16, 16]} position={[0, 4.5, 0]}>
        <meshStandardMaterial color="#1B5E20" />
      </Sphere>
    </group>
  );
}

// Person (skier/hiker)
function Person({ position }) {
  return (
    <group position={position}>
      <Sphere args={[0.3, 16, 16]} position={[0, 0.8, 0]}>
        <meshStandardMaterial color="#FFD700" />
      </Sphere>
      <Box args={[0.4, 0.6, 0.3]} position={[0, 0.3, 0]}>
        <meshStandardMaterial color="#FF5722" />
      </Box>
    </group>
  );
}

// Emergency beacon
function Beacon({ position, activated, onClick }) {
  return (
    <group position={position} onClick={onClick}>
      <Box args={[0.4, 0.6, 0.3]}>
        <meshStandardMaterial 
          color={activated ? "#4CAF50" : "#FF9800"} 
          emissive={activated ? "#4CAF50" : "#FF9800"}
          emissiveIntensity={activated ? 1.5 : 0.5}
        />
      </Box>
      <Text position={[0, 0.8, 0]} fontSize={0.3} color="white">
        📡
      </Text>
    </group>
  );
}

const AvalancheScenario = ({ onComplete }) => {
  const [step, setStep] = useState(0);
  const [score, setScore] = useState(0);
  const [flagAcknowledged, setFlagAcknowledged] = useState(false);
  const [beaconActivated, setBeaconActivated] = useState(false);
  const [avalancheActive, setAvalancheActive] = useState(false);
  const [personPos, setPersonPos] = useState([0, 0.5, 12]);
  const [reachedShelter, setReachedShelter] = useState(false);

  const scenarios = [
    {
      title: "⚠️ High Avalanche Risk!",
      description: "You're on a snowy mountain. Avalanche warning flags are posted.",
      instruction: "Click the red warning flag to check risk level",
      action: () => {
        setFlagAcknowledged(true);
        setScore(score + 25);
        setTimeout(() => nextStep(), 1500);
      }
    },
    {
      title: "📡 Activate Emergency Beacon",
      description: "Before going further, activate your avalanche beacon so rescuers can find you if buried.",
      instruction: "Click the beacon to turn it on",
      action: () => {
        setBeaconActivated(true);
        setScore(score + 30);
        setTimeout(() => nextStep(), 1500);
      }
    },
    {
      title: "❄️ Avalanche Triggered!",
      description: "You hear a crack - avalanche is coming! Run SIDEWAYS to the slope, not downhill!",
      instruction: "Click the shelter to evacuate perpendicular to avalanche path",
      action: () => {
        setAvalancheActive(true);
        setReachedShelter(true);
        setPersonPos([15, 0.5, 8]);
        setScore(score + 45);
        setTimeout(() => {
          onComplete({
            success: true,
            score: score + 45,
            lessonsLearned: [
              'Check avalanche warnings before mountain activities',
              'Always carry and activate avalanche beacon',
              'Travel with partners in avalanche terrain',
              'If caught, try to "swim" to stay on top',
              'Create air pocket in front of face if buried',
              'Move perpendicular (sideways) to avalanche, not downhill',
              'Avoid slopes steeper than 30° after heavy snowfall',
              'Learn to recognize avalanche terrain'
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
        <PerspectiveCamera makeDefault position={[20, 15, 20]} />
        <OrbitControls enablePan={false} maxPolarAngle={Math.PI / 2} minDistance={12} maxDistance={35} />
        
        <ambientLight intensity={0.8} />
        <directionalLight position={[10, 20, 10]} intensity={1.2} />
        
        {/* Snowy ground */}
        <Box position={[0, -0.5, 0]} args={[50, 1, 40]}>
          <meshStandardMaterial color="#FFFFFF" />
        </Box>

        {/* Mountain */}
        <SnowyMountain position={[-15, 0, -5]} />

        {/* Trees */}
        <Tree position={[-5, 0, 8]} />
        <Tree position={[3, 0, 6]} />
        <Tree position={[-8, 0, 2]} />

        {/* Warning flag */}
        <WarningFlag 
          position={[2, 0, 10]} 
          acknowledged={flagAcknowledged}
          onClick={step === 0 ? scenarios[0].action : null}
        />

        {/* Emergency beacon */}
        {step >= 1 && (
          <Beacon 
            position={[0, 1, 12]} 
            activated={beaconActivated}
            onClick={step === 1 ? scenarios[1].action : null}
          />
        )}

        {/* Shelter */}
        <Shelter 
          position={[15, 1.5, 8]} 
          reached={reachedShelter}
          onClick={step === 2 ? scenarios[2].action : null}
        />

        {/* Avalanche snow */}
        {avalancheActive && (
          <>
            <AvalancheSnow position={[-10, 15, 0]} speed={2} active={avalancheActive} />
            <AvalancheSnow position={[-8, 16, 2]} speed={1.8} active={avalancheActive} />
            <AvalancheSnow position={[-12, 14, -1]} speed={2.2} active={avalancheActive} />
            <AvalancheSnow position={[-9, 15.5, 1]} speed={1.9} active={avalancheActive} />
          </>
        )}

        {/* Person */}
        <Person position={personPos} />

        <Text
          position={[0, 12, -5]}
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
          {flagAcknowledged && <div>✓ Warning acknowledged</div>}
          {beaconActivated && <div>✓ Beacon active</div>}
          {reachedShelter && <div>✓ Reached safety</div>}
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

export default AvalancheScenario;
