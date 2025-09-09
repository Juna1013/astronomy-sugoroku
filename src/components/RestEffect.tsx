'use client';

import React from 'react';
import { motion, AnimatePresence } from 'framer-motion';

interface RestEffectProps {
  show: boolean;
  playerName: string;
  restTurns: number;
  restReason: string;
}

const RestEffect: React.FC<RestEffectProps> = ({ 
  show, 
  playerName, 
  restTurns,
  restReason 
}) => {
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
          {/* Main rest display */}
          <motion.div
            initial={{ scale: 0, rotate: -180 }}
            animate={{ scale: 1, rotate: 0 }}
            exit={{ scale: 0, rotate: 180 }}
            transition={{ 
              type: "spring", 
              stiffness: 200, 
              damping: 20 
            }}
            className="relative bg-gradient-to-br from-gray-600/30 to-gray-800/30 backdrop-blur-xl border-2 border-gray-400/50 rounded-3xl p-8 sm:p-12 text-center shadow-2xl"
          >
            {/* Floating Z's for sleep effect */}
            {[...Array(6)].map((_, i) => (
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
                  scale: [0, 1.5, 0],
                  x: [0, (Math.random() - 0.5) * 150],
                  y: [0, -100 - Math.random() * 100]
                }}
                transition={{ 
                  duration: 2, 
                  delay: i * 0.3,
                  ease: "easeOut",
                  repeat: Infinity,
                  repeatDelay: 2
                }}
                className="absolute text-4xl pointer-events-none text-blue-300"
                style={{
                  left: '50%',
                  top: '50%'
                }}
              >
                💤
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

            {/* Rest icon */}
            <motion.div
              initial={{ scale: 0 }}
              animate={{ scale: [0, 1.2, 1] }}
              transition={{ 
                delay: 0.3, 
                duration: 0.6,
                times: [0, 0.6, 1]
              }}
              className="text-8xl sm:text-9xl mb-4 drop-shadow-2xl"
            >
              😴
            </motion.div>

            {/* Rest turns indicator */}
            <motion.div
              initial={{ opacity: 0, scale: 0 }}
              animate={{ opacity: 1, scale: 1 }}
              transition={{ delay: 0.4 }}
              className="flex items-center justify-center gap-2 mb-4"
            >
              <div className="text-red-400 text-2xl sm:text-3xl font-bold">
                {restTurns}
              </div>
              <div className="text-white text-lg sm:text-xl">
                回休み
              </div>
            </motion.div>

            {/* Reason */}
            <motion.div
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ delay: 0.5 }}
              className="text-white text-xl sm:text-2xl font-semibold mb-2"
            >
              休憩中...
            </motion.div>

            <motion.div
              initial={{ opacity: 0 }}
              animate={{ opacity: 1 }}
              transition={{ delay: 0.7 }}
              className="text-white/70 text-sm sm:text-base"
            >
              {restReason}
            </motion.div>

            {/* Pulsing border effect */}
            <motion.div
              animate={{ 
                opacity: [0.3, 0.7, 0.3],
                scale: [1, 1.02, 1]
              }}
              transition={{ 
                duration: 2, 
                repeat: Infinity,
                ease: "easeInOut"
              }}
              className="absolute inset-0 rounded-3xl border-2 border-gray-400/50 pointer-events-none"
            />

            {/* Sleep wave effect */}
            <motion.div
              animate={{ 
                rotate: [0, 360]
              }}
              transition={{ 
                duration: 8, 
                repeat: Infinity,
                ease: "linear"
              }}
              className="absolute inset-0 opacity-20 pointer-events-none"
            >
              <div className="w-full h-full rounded-3xl bg-gradient-conic from-blue-400 via-transparent via-transparent via-transparent to-blue-400" />
            </motion.div>
          </motion.div>
        </motion.div>
      )}
    </AnimatePresence>
  );
};

export default RestEffect;