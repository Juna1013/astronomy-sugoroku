'use client';

import React from 'react';
import { motion, AnimatePresence } from 'framer-motion';

interface DiceResultEffectProps {
  diceValue: number;
  show: boolean;
  playerName: string;
}

const DiceResultEffect: React.FC<DiceResultEffectProps> = ({ 
  diceValue, 
  show, 
  playerName 
}) => {
  const getDiceEffects = (value: number) => {
    const effects = {
      1: { 
        color: "text-red-500", 
        bgGradient: "from-red-500/20 to-red-600/20",
        borderColor: "border-red-400",
        particles: "🔥",
        message: "小さく前進！"
      },
      2: { 
        color: "text-orange-500", 
        bgGradient: "from-orange-500/20 to-orange-600/20",
        borderColor: "border-orange-400",
        particles: "⚡",
        message: "まずまずの出目！"
      },
      3: { 
        color: "text-yellow-500", 
        bgGradient: "from-yellow-500/20 to-yellow-600/20",
        borderColor: "border-yellow-400",
        particles: "✨",
        message: "順調な歩み！"
      },
      4: { 
        color: "text-green-500", 
        bgGradient: "from-green-500/20 to-green-600/20",
        borderColor: "border-green-400",
        particles: "🌟",
        message: "良い出目です！"
      },
      5: { 
        color: "text-blue-500", 
        bgGradient: "from-blue-500/20 to-blue-600/20",
        borderColor: "border-blue-400",
        particles: "💫",
        message: "素晴らしい！"
      },
      6: { 
        color: "text-purple-500", 
        bgGradient: "from-purple-500/20 to-purple-600/20",
        borderColor: "border-purple-400",
        particles: "🎆",
        message: "最高の出目！"
      }
    };
    return effects[value as keyof typeof effects] || effects[1];
  };

  const effects = getDiceEffects(diceValue);

  return (
    <AnimatePresence>
      {show && (
        <motion.div
          initial={{ opacity: 0 }}
          animate={{ opacity: 1 }}
          exit={{ opacity: 0 }}
          transition={{ duration: 0.3 }}
          className="fixed inset-0 z-50 flex items-center justify-center bg-black/50 backdrop-blur-sm"
        >
          {/* Main result display */}
          <motion.div
            initial={{ scale: 0, rotate: -180 }}
            animate={{ scale: 1, rotate: 0 }}
            exit={{ scale: 0, rotate: 180 }}
            transition={{ 
              type: "spring", 
              stiffness: 200, 
              damping: 20 
            }}
            className={`relative bg-gradient-to-br ${effects.bgGradient} backdrop-blur-xl border-2 ${effects.borderColor} rounded-3xl p-8 sm:p-12 text-center shadow-2xl`}
          >
            {/* Floating particles */}
            {[...Array(8)].map((_, i) => (
              <motion.div
                key={i}
                initial={{ 
                  opacity: 0, 
                  scale: 0,
                  x: 0,
                  y: 0
                }}
                animate={{ 
                  opacity: [0, 1, 0], 
                  scale: [0, 1, 0],
                  x: [0, (Math.random() - 0.5) * 200],
                  y: [0, (Math.random() - 0.5) * 200]
                }}
                transition={{ 
                  duration: 2, 
                  delay: i * 0.1,
                  ease: "easeOut"
                }}
                className="absolute text-2xl pointer-events-none"
                style={{
                  left: '50%',
                  top: '50%'
                }}
              >
                {effects.particles}
              </motion.div>
            ))}

            {/* Player name */}
            <motion.div
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ delay: 0.2 }}
              className="text-white/80 text-lg sm:text-xl mb-4"
            >
              {playerName}
            </motion.div>

            {/* Dice value */}
            <motion.div
              initial={{ scale: 0 }}
              animate={{ scale: [0, 1.2, 1] }}
              transition={{ 
                delay: 0.3, 
                duration: 0.6,
                times: [0, 0.6, 1]
              }}
              className={`text-8xl sm:text-9xl font-bold ${effects.color} mb-4 drop-shadow-2xl`}
            >
              {diceValue}
            </motion.div>

            {/* Message */}
            <motion.div
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ delay: 0.5 }}
              className="text-white text-xl sm:text-2xl font-semibold mb-2"
            >
              {effects.message}
            </motion.div>

            <motion.div
              initial={{ opacity: 0 }}
              animate={{ opacity: 1 }}
              transition={{ delay: 0.7 }}
              className="text-white/70 text-sm sm:text-base"
            >
              {diceValue}マス進みます
            </motion.div>

            {/* Pulsing border effect */}
            <motion.div
              animate={{ 
                opacity: [0.5, 1, 0.5],
                scale: [1, 1.02, 1]
              }}
              transition={{ 
                duration: 2, 
                repeat: Infinity,
                ease: "easeInOut"
              }}
              className={`absolute inset-0 rounded-3xl border-2 ${effects.borderColor} pointer-events-none`}
            />
          </motion.div>
        </motion.div>
      )}
    </AnimatePresence>
  );
};

export default DiceResultEffect;