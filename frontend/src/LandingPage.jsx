import React from 'react';
import { motion } from 'framer-motion';
import ParticleBackground from './animations/ParticlesBackground';
import toast from 'react-hot-toast';
import GlitchText from './animations/GlitchText';
import TextPressure from './animations/TextPressure';

export default function LandingPage({ onPlay, onSetName }) {
  const handleSoundToggle = () => {
    toast.success('Sound toggle coming soon!');
  };

  const buttonHover = {
    scale: 1.05,
    transition: { type: 'spring', stiffness: 300 },
  };

  const buttonTap = {
    scale: 0.95,
  };

  return (
    <div className="relative h-screen w-screen bg-[#0d0d0d] overflow-hidden flex items-center justify-center">
      <ParticleBackground />
      <div className="z-10 flex flex-col gap-6 text-center px-4">
        <GlitchText speed={1} enableShadows={true} className="custom-class">
          DemoRun
        </GlitchText>
        <div className="flex flex-col gap-4">
          <motion.button
            whileHover={buttonHover}
            whileTap={buttonTap}
            className="bg-[#00ffff] text-[#0d0d0d] px-6 py-3 rounded-lg font-bold text-lg"
            onClick={onPlay}
          >
            <TextPressure
              text=" Play Game"
              flex={true}
              alpha={false}
              stroke={false}
              width={true}
              weight={true}
              italic={true}
              textColor="#ffffff"
              strokeColor="#ff0000"
              minFontSize={36}
            />
          </motion.button>
          <motion.button
            whileHover={buttonHover}
            whileTap={buttonTap}
            className="bg-transparent border-2 border-[#00ffff] text-[#00ffff] px-6 py-3 rounded-lg font-bold text-lg"
            onClick={onSetName}
          >
            Enter Name
          </motion.button>
          <motion.button
            whileHover={buttonHover}
            whileTap={buttonTap}
            className="bg-transparent text-[#888] px-6 py-3 rounded-lg font-bold text-lg"
            onClick={handleSoundToggle}
          >
            🔇 Sound (coming soon)
          </motion.button>
        </div>
      </div>
    </div>
  );
}
