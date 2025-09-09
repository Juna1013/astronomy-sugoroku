// src/components/DiceRoller.tsx の改善版
'use client';

import React from 'react';
import { motion } from 'framer-motion';
import { Dice1, Dice2, Dice3, Dice4, Dice5, Dice6, Loader2 } from 'lucide-react';

type Props = {
  disabled?: boolean;
  onRoll: () => void;
  label?: string;
  diceValue?: number;
  isRolling?: boolean;
  showResult?: boolean;
};

const diceIcons = [Dice1, Dice2, Dice3, Dice4, Dice5, Dice6];

export default function DiceRoller({ 
  disabled = false, 
  onRoll, 
  label = "🎲 サイコロをふる",
  diceValue = 1,
  isRolling = false,
  showResult = false
}: Props) {
  const roll = () => {
    if (disabled) return;
    onRoll();
  };

  const DiceIcon = diceIcons[diceValue - 1];

  // 出目に応じた色とエフェクト
  const getDiceEffects = (value: number) => {
    const effects = {
      1: { color: "text-red-400", glow: "drop-shadow-[0_0_8px_rgba(248,113,113,0.8)]", particles: "🔥" },
      2: { color: "text-orange-400", glow: "drop-shadow-[0_0_8px_rgba(251,146,60,0.8)]", particles: "⚡" },
      3: { color: "text-yellow-400", glow: "drop-shadow-[0_0_8px_rgba(250,204,21,0.8)]", particles: "✨" },
      4: { color: "text-green-400", glow: "drop-shadow-[0_0_8px_rgba(74,222,128,0.8)]", particles: "🌟" },
      5: { color: "text-blue-400", glow: "drop-shadow-[0_0_8px_rgba(96,165,250,0.8)]", particles: "💫" },
      6: { color: "text-purple-400", glow: "drop-shadow-[0_0_8px_rgba(196,181,253,0.8)]", particles: "🎆" }
    };
    return effects[value as keyof typeof effects] || effects[1];
  };

  const diceEffects = getDiceEffects(diceValue);

  return (
    <div className="flex flex-col items-center gap-2 sm:gap-3">
      {/* Dice Display with Enhanced Effects */}
      <div className="relative">
        <motion.div
          animate={isRolling ? { 
            rotate: [0, 180, 360, 540, 720],
            scale: [1, 1.2, 1, 1.1, 1]
          } : showResult ? {
            scale: [1, 1.5, 1.2, 1],
            rotate: [0, 360]
          } : { 
            rotate: 0,
            scale: 1
          }}
          transition={isRolling ? { 
            duration: 0.8, 
            ease: "easeInOut",
            times: [0, 0.25, 0.5, 0.75, 1]
          } : showResult ? {
            duration: 0.6,
            ease: "easeOut"
          } : {}}
          className={`relative ${showResult ? diceEffects.glow : ""}`}
        >
          {isRolling ? (
            <div className="relative">
              <Loader2 className="w-8 h-8 sm:w-10 sm:h-10 text-white animate-spin" />
              {/* Rolling particles */}
              <motion.div
                animate={{ rotate: 360, scale: [1, 1.2, 1] }}
                transition={{ duration: 0.5, repeat: Infinity }}
                className="absolute -inset-2 text-yellow-400 text-xs opacity-70"
              >
                ✨
              </motion.div>
            </div>
          ) : (
            <div className="relative">
              <DiceIcon className={`w-8 h-8 sm:w-10 sm:h-10 ${showResult ? diceEffects.color : "text-white"} transition-all duration-300`} />
              
              {/* Result particles */}
              {showResult && (
                <>
                  <motion.div
                    key={`particle-1-${diceValue}`}
                    initial={{ opacity: 0, scale: 0, x: 0, y: 0 }}
                    animate={{ 
                      opacity: [0, 1, 0], 
                      scale: [0, 1, 0], 
                      x: [-20, -30],
                      y: [-10, -20]
                    }}
                    transition={{ duration: 1, ease: "easeOut" }}
                    className="absolute text-sm"
                  >
                    {diceEffects.particles}
                  </motion.div>
                  <motion.div
                    key={`particle-2-${diceValue}`}
                    initial={{ opacity: 0, scale: 0, x: 0, y: 0 }}
                    animate={{ 
                      opacity: [0, 1, 0], 
                      scale: [0, 1, 0], 
                      x: [20, 30],
                      y: [-10, -20]
                    }}
                    transition={{ duration: 1, ease: "easeOut", delay: 0.1 }}
                    className="absolute text-sm"
                  >
                    {diceEffects.particles}
                  </motion.div>
                  <motion.div
                    key={`particle-3-${diceValue}`}
                    initial={{ opacity: 0, scale: 0, x: 0, y: 0 }}
                    animate={{ 
                      opacity: [0, 1, 0], 
                      scale: [0, 1, 0], 
                      x: [0, 10],
                      y: [20, 30]
                    }}
                    transition={{ duration: 1, ease: "easeOut", delay: 0.2 }}
                    className="absolute text-sm"
                  >
                    {diceEffects.particles}
                  </motion.div>
                </>
              )}
            </div>
          )}
        </motion.div>

        {/* Large result number overlay */}
        {showResult && !isRolling && (
          <motion.div
            key={`result-${diceValue}`}
            initial={{ opacity: 0, scale: 0, y: 20 }}
            animate={{ opacity: 1, scale: 1, y: 0 }}
            exit={{ opacity: 0, scale: 0 }}
            transition={{ duration: 0.4, delay: 0.2 }}
            className="absolute -bottom-8 left-1/2 transform -translate-x-1/2"
          >
            <div className={`text-2xl sm:text-3xl font-bold ${diceEffects.color} ${diceEffects.glow} bg-black/50 rounded-full w-8 h-8 sm:w-10 sm:h-10 flex items-center justify-center border-2 border-current`}>
              {diceValue}
            </div>
          </motion.div>
        )}
      </div>

      {/* Roll Button */}
      <motion.button
        whileHover={!disabled ? { scale: 1.05 } : {}}
        whileTap={!disabled ? { scale: 0.95 } : {}}
        onClick={roll}
        disabled={disabled}
        className={`px-4 sm:px-6 py-2 sm:py-3 rounded-lg sm:rounded-xl font-semibold shadow-lg transition-all duration-200 backdrop-blur-sm border text-sm sm:text-base ${
          disabled 
            ? "bg-gray-500/50 text-white/50 cursor-not-allowed border-gray-400/30" 
            : "bg-gradient-to-r from-indigo-500 to-purple-500 hover:from-indigo-600 hover:to-purple-600 text-white border-indigo-400/30 shadow-indigo-500/25"
        }`}
      >
        <span className="hidden xs:inline">{label}</span>
        <span className="xs:hidden">🎲</span>
      </motion.button>
      
      {!disabled && (
        <div className="text-[10px] sm:text-xs text-white/60 text-center hidden sm:block">
          スペースキーでも振れます
        </div>
      )}
    </div>
  );
}
