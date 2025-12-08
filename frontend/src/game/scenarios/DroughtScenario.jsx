import React, { useState, useRef } from 'react';
import { Canvas, useFrame } from '@react-three/fiber';
import { OrbitControls, Text, Box, Sphere, Cylinder, Environment, PerspectiveCamera } from '@react-three/drei';

// Cracked earth
function CrackedGround({ position }) {
  return (
    <Box position={position} args={[40, 0.5, 40]}>
      <meshStandardMaterial color="#8D6E63" roughness={1} />
    </Box>
  );
}

// Dried plant
function DriedPlant({ position }) {
  return (
    <group position={position}>
      <Cylinder args={[0.1, 0.1, 1, 8]} position={[0, 0.5, 0]}>
        <meshStandardMaterial color="#795548" />
      </Cylinder>
      <Sphere args={[0.3, 8, 8]} position={[0, 1.2, 0]}>
        <meshStandardMaterial color="#8B4513" />
      </Sphere>
    </group>
  );
}

// Water storage tank
function WaterTank({ position, hasWater, onClick }) {
  return (
    <group position={position} onClick={onClick}>
      <Cylinder args={[1.5, 1.5, 3, 16]}>
        <meshStandardMaterial color="#37474F" />
      </Cylinder>
      {hasWater && (
        <Cylinder args={[1.4, 1.4, 1.5, 16]} position={[0, -0.75, 0]}>
          <meshStandardMaterial color="#4FC3F7" transparent opacity={0.7} />
        </Cylinder>
      )}
      <Text position={[0, 2.5, 0]} fontSize={0.5} color="white">
        {hasWater ? '💧' : '🚱'}
      </Text>
    </group>
  );
}

// Drip irrigation system
function IrrigationSystem({ position, installed, onClick }) {
  if (!installed) {
    return (
      <group position={position} onClick={onClick}>
        <Box args={[0.8, 0.6, 0.6]}>
          <meshStandardMaterial color="#FF9800" />
        </Box>
        <Text position={[0, 0.8, 0]} fontSize={0.4} color="white">
          📦 Drip Kit
        </Text>
      </group>
    );
  }
  
  return (
    <group position={position}>
      <Cylinder args={[0.05, 0.05, 8, 8]} rotation={[0, 0, Math.PI / 2]} position={[0, 0.1, 0]}>
        <meshStandardMaterial color="#424242" />
      </Cylinder>
      {[...Array(5)].map((_, i) => (
        <Sphere key={i} args={[0.08, 8, 8]} position={[i * 2 - 4, 0, 0]}>
          <meshStandardMaterial color="#2196F3" />
        </Sphere>
      ))}
    </group>
  );
}

// Farm field
function Field({ position, watered }) {
  return (
    <Box position={position} args={[8, 0.3, 8]}>
      <meshStandardMaterial color={watered ? "#7CB342" : "#D7CCC8"} />
    </Box>
  );
}

// Person (farmer)
function Person({ position }) {
  return (
    <group position={position}>
      <Sphere args={[0.3, 16, 16]} position={[0, 0.8, 0]}>
        <meshStandardMaterial color="#FFD700" />
      </Sphere>
      <Box args={[0.4, 0.6, 0.3]} position={[0, 0.3, 0]}>
        <meshStandardMaterial color="#8B4513" />
      </Box>
    </group>
  );
}

// Educational poster
function Poster({ position, onClick }) {
  return (
    <group position={position} onClick={onClick}>
      <Box args={[2, 2.5, 0.1]}>
        <meshStandardMaterial color="#FFFFFF" />
      </Box>
      <Text position={[0, 1, 0.1]} fontSize={0.3} color="black">
        Water Conservation
      </Text>
      <Text position={[0, 0.3, 0.1]} fontSize={0.25} color="green">
        Click to Learn
      </Text>
    </group>
  );
}

const DroughtScenario = ({ onComplete }) => {
  const [step, setStep] = useState(0);
  const [score, setScore] = useState(0);
  const [tankFilled, setTankFilled] = useState(false);
  const [irrigationInstalled, setIrrigationInstalled] = useState(false);
  const [fieldWatered, setFieldWatered] = useState(false);
  const [personPos, setPersonPos] = useState([0, 0.5, 8]);

  const scenarios = [
    {
      title: "☀️ Severe Drought Conditions",
      description: "No rain for months. Groundwater is depleting. You need to conserve water wisely.",
      instruction: "Click the poster to learn water conservation techniques",
      action: () => {
        setScore(score + 25);
        setTimeout(() => nextStep(), 2000);
      }
    },
    {
      title: "💧 Harvest Rainwater",
      description: "Even small amounts of rain should be collected and stored.",
      instruction: "Click the water tank to implement rainwater harvesting",
      action: () => {
        setTankFilled(true);
        setScore(score + 30);
        setTimeout(() => nextStep(), 1500);
      }
    },
    {
      title: "🌱 Install Drip Irrigation",
      description: "Use water efficiently! Drip irrigation saves 70% more water than flooding.",
      instruction: "Click the drip irrigation kit to install it",
      action: () => {
        setIrrigationInstalled(true);
        setFieldWatered(true);
        setScore(score + 45);
        setTimeout(() => {
          onComplete({
            success: true,
            score: score + 45,
            lessonsLearned: [
              'Harvest and store rainwater',
              'Use drip irrigation for farming',
              'Fix all water leaks immediately',
              'Reuse greywater for gardening',
              'Grow drought-resistant crops',
              'Check groundwater levels regularly',
              'Avoid water wastage in daily activities',
              'Community awareness about conservation'
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
        <PerspectiveCamera makeDefault position={[15, 12, 15]} />
        <OrbitControls enablePan={false} maxPolarAngle={Math.PI / 2} minDistance={10} maxDistance={30} />
        
        <ambientLight intensity={0.9} />
        <directionalLight position={[10, 20, 10]} intensity={1.5} color="#FFA726" />
        
        {/* Cracked ground */}
        <CrackedGround position={[0, -0.5, 0]} />

        {/* Farm field */}
        <Field position={[-8, 0, -2]} watered={fieldWatered} />

        {/* Dried plants */}
        <DriedPlant position={[5, 0, 5]} />
        <DriedPlant position={[-5, 0, 6]} />
        <DriedPlant position={[7, 0, -4]} />

        {/* Water tank */}
        <WaterTank 
          position={[-3, 1.5, 8]} 
          hasWater={tankFilled}
          onClick={step === 1 ? scenarios[1].action : null}
        />

        {/* Drip irrigation */}
        <IrrigationSystem 
          position={[-8, 0.5, -2]} 
          installed={irrigationInstalled}
          onClick={step === 2 ? scenarios[2].action : null}
        />

        {/* Educational poster */}
        {step === 0 && (
          <Poster 
            position={[3, 1.5, 6]} 
            onClick={scenarios[0].action}
          />
        )}

        {/* Person */}
        <Person position={personPos} />

        <Text
          position={[0, 10, -5]}
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
        background: 'rgba(139,69,19,0.95)',
        color: 'white',
        padding: '20px',
        borderRadius: '10px',
        maxWidth: '500px',
        border: '3px solid #8B4513'
      }}>
        <h2 style={{ margin: '0 0 10px 0' }}>{scenarios[step].title}</h2>
        <p style={{ margin: '0 0 10px 0' }}>{scenarios[step].description}</p>
        <p style={{ 
          margin: '0 0 15px 0', 
          color: '#4FC3F7',
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
          {tankFilled && <div>✓ Rainwater harvested</div>}
          {irrigationInstalled && <div>✓ Drip irrigation installed</div>}
          {fieldWatered && <div>✓ Field efficiently watered</div>}
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

export default DroughtScenario;
