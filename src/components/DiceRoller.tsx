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
    <div className="flex flex-col items-center gap-3">
      {/* Dice Display */}
      <motion.div
        animate={isRolling ? { rotate: 360 } : { rotate: 0 }}
        transition={{ duration: 0.5, ease: "easeInOut" }}
        className="relative"
      >
        {isRolling ? (
          <Loader2 className="w-8 h-8 text-white animate-spin" />
        ) : (
          <DiceIcon className="w-8 h-8 text-white" />
        )}
      </motion.div>

      {/* Roll Button */}
      <motion.button
        whileHover={!disabled ? { scale: 1.05 } : {}}
        whileTap={!disabled ? { scale: 0.95 } : {}}
        onClick={roll}
        disabled={disabled}
        className={`px-6 py-3 rounded-xl font-semibold shadow-lg transition-all duration-200 backdrop-blur-sm border ${
          disabled 
            ? "bg-gray-500/50 text-white/50 cursor-not-allowed border-gray-400/30" 
            : "bg-gradient-to-r from-indigo-500 to-purple-500 hover:from-indigo-600 hover:to-purple-600 text-white border-indigo-400/30 shadow-indigo-500/25"
        }`}
      >
        {label}
      </motion.button>
      
      {!disabled && (
        <div className="text-xs text-white/60">
          スペースキーでも振れます
        </div>
      )}
    </div>
  );
}
