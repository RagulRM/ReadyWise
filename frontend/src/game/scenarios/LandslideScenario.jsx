import React, { useState, useRef } from 'react';
import { Canvas, useFrame } from '@react-three/fiber';
import { OrbitControls, Text, Box, Sphere, Cylinder, Environment, PerspectiveCamera } from '@react-three/drei';

// Mountain slope
function Mountain({ position }) {
  return (
    <group position={position}>
      <Box position={[0, 5, 0]} args={[20, 10, 15]} rotation={[0, 0, 0.3]}>
        <meshStandardMaterial color="#795548" />
      </Box>
      <Box position={[3, 2, 0]} args={[15, 4, 15]} rotation={[0, 0, 0.3]}>
        <meshStandardMaterial color="#8D6E63" />
      </Box>
    </group>
  );
}

// Falling rocks
function FallingRock({ position, speed }) {
  const meshRef = useRef();
  
  useFrame(() => {
    if (meshRef.current && meshRef.current.position.y > -2) {
      meshRef.current.position.y -= speed * 0.1;
      meshRef.current.position.x -= speed * 0.05;
      meshRef.current.rotation.x += 0.1;
      meshRef.current.rotation.z += 0.15;
    }
  });

  return (
    <Sphere ref={meshRef} position={position} args={[0.8, 16, 16]}>
      <meshStandardMaterial color="#616161" roughness={0.9} />
    </Sphere>
  );
}

// Warning sign
function WarningSign({ position, noticed, onClick }) {
  return (
    <group position={position} onClick={onClick}>
      <Cylinder args={[0.1, 0.1, 2, 8]}>
        <meshStandardMaterial color="#424242" />
      </Cylinder>
      <Box position={[0, 1.5, 0]} args={[1.5, 1.5, 0.1]} rotation={[0, 0, Math.PI / 4]}>
        <meshStandardMaterial color={noticed ? "#4CAF50" : "#FFD600"} />
      </Box>
      <Text position={[0, 1.5, 0.1]} fontSize={0.5} color="red">
        ⚠️
      </Text>
      <Text position={[0, 0.5, 0]} fontSize={0.25} color="white">
        LANDSLIDE
      </Text>
    </group>
  );
}

// Safe zone
function SafeZone({ position, reached, onClick }) {
  return (
    <group position={position} onClick={onClick}>
      <Box args={[6, 0.5, 6]}>
        <meshStandardMaterial color={reached ? "#66BB6A" : "#8BC34A"} />
      </Box>
      <Text position={[0, 2, 0]} fontSize={0.8} color="white">
        SAFE ZONE
      </Text>
    </group>
  );
}

// House (vulnerable)
function House({ position, damaged }) {
  return (
    <group position={position}>
      <Box args={[3, 3, 3]} rotation={damaged ? [0, 0, 0.2] : [0, 0, 0]}>
        <meshStandardMaterial color={damaged ? "#D32F2F" : "#8B7355"} />
      </Box>
      <Box position={[0, 2, 0]} args={[3.5, 0.5, 3.5]}>
        <meshStandardMaterial color="#5D4037" />
      </Box>
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

// Cracks in ground (warning sign)
function GroundCracks({ position }) {
  return (
    <>
      <Box position={[position[0], 0.01, position[2]]} args={[5, 0.05, 0.3]}>
        <meshStandardMaterial color="#212121" />
      </Box>
      <Box position={[position[0] + 1, 0.01, position[2] + 1]} args={[4, 0.05, 0.3]} rotation={[0, 0.3, 0]}>
        <meshStandardMaterial color="#212121" />
      </Box>
    </>
  );
}

const LandslideScenario = ({ onComplete }) => {
  const [step, setStep] = useState(0);
  const [score, setScore] = useState(0);
  const [signNoticed, setSignNoticed] = useState(false);
  const [rocksStarted, setRocksStarted] = useState(false);
  const [personPos, setPersonPos] = useState([0, 0.5, 10]);
  const [reachedSafety, setReachedSafety] = useState(false);

  const scenarios = [
    {
      title: "⚠️ Landslide Risk Zone",
      description: "You're in a hilly area after heavy rainfall. Notice the warning signs!",
      instruction: "Click the warning sign to acknowledge the risk",
      action: () => {
        setSignNoticed(true);
        setScore(score + 30);
        setTimeout(() => nextStep(), 1500);
      }
    },
    {
      title: "🪨 Rocks Begin to Fall!",
      description: "You notice cracks in the ground and hear rumbling. Landslide is imminent!",
      instruction: "Click 'Move to Safety' immediately!",
      action: () => {
        setRocksStarted(true);
        setScore(score + 30);
        setTimeout(() => nextStep(), 2000);
      }
    },
    {
      title: "🏃 Evacuate Perpendicular!",
      description: "Move sideways (perpendicular) to the landslide path, not downhill!",
      instruction: "Click the Safe Zone to evacuate correctly",
      action: () => {
        setReachedSafety(true);
        setPersonPos([15, 0.5, 10]);
        setScore(score + 40);
        setTimeout(() => {
          onComplete({
            success: true,
            score: score + 40,
            lessonsLearned: [
              'Watch for warning signs: tilted trees, cracks in ground',
              'Evacuate perpendicular to landslide path',
              'Never build houses on steep slopes',
              'Heavy rainfall increases landslide risk',
              'Alert authorities if you notice warning signs',
              'Stay away from landslide-prone areas during monsoons',
              'Listen for rumbling sounds from hillside'
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
        
        <ambientLight intensity={0.5} />
        <directionalLight position={[10, 20, 10]} intensity={1} />
        
        {/* Ground */}
        <Box position={[0, -1, 0]} args={[50, 2, 40]}>
          <meshStandardMaterial color="#6D4C41" />
        </Box>

        {/* Mountain slope */}
        <Mountain position={[-10, 0, 0]} />

        {/* Ground cracks (warning) */}
        {step >= 1 && <GroundCracks position={[-2, 0, 8]} />}

        {/* Falling rocks */}
        {rocksStarted && (
          <>
            <FallingRock position={[-8, 10, 8]} speed={1.5} />
            <FallingRock position={[-6, 12, 6]} speed={1.2} />
            <FallingRock position={[-10, 11, 9]} speed={1.8} />
            <FallingRock position={[-7, 13, 7]} speed={1.4} />
          </>
        )}

        {/* House at risk */}
        <House position={[-3, 1.5, 6]} damaged={rocksStarted} />

        {/* Warning sign */}
        <WarningSign 
          position={[2, 1, 8]} 
          noticed={signNoticed}
          onClick={step === 0 ? scenarios[0].action : null}
        />

        {/* Safe zone */}
        <SafeZone 
          position={[15, 0, 10]} 
          reached={reachedSafety}
          onClick={step === 2 ? scenarios[2].action : null}
        />

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

        <Environment preset="forest" />
      </Canvas>

      {/* UI Overlay */}
      <div style={{
        position: 'absolute',
        top: '20px',
        left: '20px',
        right: '20px',
        background: 'rgba(121,85,72,0.95)',
        color: 'white',
        padding: '20px',
        borderRadius: '10px',
        maxWidth: '500px',
        border: '3px solid #6D4C41'
      }}>
        <h2 style={{ margin: '0 0 10px 0' }}>{scenarios[step].title}</h2>
        <p style={{ margin: '0 0 10px 0' }}>{scenarios[step].description}</p>
        <p style={{ 
          margin: '0 0 15px 0', 
          color: '#FFD600',
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
          {signNoticed && <div>✓ Warning signs noticed</div>}
          {rocksStarted && <div>⚠️ Landslide in progress!</div>}
          {reachedSafety && <div>✓ Evacuated safely</div>}
        </div>
        {step === 1 && (
          <button
            onClick={scenarios[step].action}
            style={{
              background: '#FF5722',
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
            🚨 Move to Safety NOW!
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

export default LandslideScenario;
