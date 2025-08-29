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
};

const diceIcons = [Dice1, Dice2, Dice3, Dice4, Dice5, Dice6];

export default function DiceRoller({ 
  disabled = false, 
  onRoll, 
  label = "🎲 サイコロをふる",
  diceValue = 1,
  isRolling = false
}: Props) {
  const roll = () => {
    if (disabled) return;
    onRoll();
  };

  const DiceIcon = diceIcons[diceValue - 1];

  return (
    <div className="flex flex-col items-center gap-2 sm:gap-3">
      {/* Dice Display */}
      <motion.div
        animate={isRolling ? { rotate: 360 } : { rotate: 0 }}
        transition={{ duration: 0.5, ease: "easeInOut" }}
        className="relative"
      >
        {isRolling ? (
          <Loader2 className="w-6 h-6 sm:w-8 sm:h-8 text-white animate-spin" />
        ) : (
          <DiceIcon className="w-6 h-6 sm:w-8 sm:h-8 text-white" />
        )}
      </motion.div>

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
