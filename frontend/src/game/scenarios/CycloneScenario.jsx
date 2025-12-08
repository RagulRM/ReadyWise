import React, { useState } from 'react';
import { Canvas } from '@react-three/fiber';
import { OrbitControls, Text, Box, Environment, PerspectiveCamera } from '@react-three/drei';

function CycloneScenario({ onComplete }) {
  const [currentStep, setCurrentStep] = useState(0);
  const [score, setScore] = useState(0);

  const scenes = [
    {
      question: "A cyclone warning has been issued. What should you do first?",
      options: [
        { text: "Close all windows and doors", correct: true, points: 100 },
        { text: "Go outside to check", correct: false, points: 0 },
        { text: "Ignore the warning", correct: false, points: 0 }
      ]
    },
    {
      question: "Where is the safest place during a cyclone?",
      options: [
        { text: "Inside a strong building", correct: true, points: 100 },
        { text: "Under a tree", correct: false, points: 0 },
        { text: "In an open field", correct: false, points: 0 }
      ]
    }
  ];

  const handleAnswer = (option) => {
    if (option.correct) {
      setScore(score + option.points);
    }

    if (currentStep < scenes.length - 1) {
      setCurrentStep(currentStep + 1);
    } else {
      onComplete({ score: score + (option.correct ? option.points : 0), maxScore: 200 });
    }
  };

  return (
    <div style={{ width: '100%', height: '100vh', background: '#0a0f1e' }}>
      <Canvas>
        <PerspectiveCamera makeDefault position={[0, 5, 10]} />
        <OrbitControls enableZoom={false} />
        <Environment preset="sunset" />
        <ambientLight intensity={0.5} />
        <directionalLight position={[10, 10, 5]} intensity={1} />
        
        <Text position={[0, 3, 0]} fontSize={0.5} color="white">
          🌀 Cyclone Safety Scenario
        </Text>
        
        <Box position={[0, 0, 0]} args={[2, 3, 2]}>
          <meshStandardMaterial color="#2196F3" />
        </Box>
      </Canvas>

      <div style={{
        position: 'absolute',
        bottom: '20px',
        left: '50%',
        transform: 'translateX(-50%)',
        background: 'rgba(30, 41, 59, 0.95)',
        padding: '20px',
        borderRadius: '12px',
        maxWidth: '600px',
        width: '90%'
      }}>
        <h3 style={{ color: 'white', marginBottom: '15px' }}>
          {scenes[currentStep].question}
        </h3>
        <div style={{ display: 'flex', flexDirection: 'column', gap: '10px' }}>
          {scenes[currentStep].options.map((option, idx) => (
            <button
              key={idx}
              onClick={() => handleAnswer(option)}
              style={{
                padding: '12px',
                background: '#6366f1',
                color: 'white',
                border: 'none',
                borderRadius: '8px',
                cursor: 'pointer',
                fontSize: '16px'
              }}
            >
              {option.text}
            </button>
          ))}
        </div>
        <p style={{ color: '#22d3ee', marginTop: '10px' }}>Score: {score}</p>
      </div>
    </div>
  );
}

export default CycloneScenario;
