// src/components/GameHeader.tsx の改善版
'use client';

import React, { useEffect } from 'react';
import { motion } from 'framer-motion';
import { Home, Dice6, Menu } from 'lucide-react';
import DiceRoller from './DiceRoller';
import { Player } from '../types';
import { ThemeSwitcher } from './ThemeSwitcher';

interface GameHeaderProps {
  currentPlayer: Player | undefined;
  onRoll: () => void;
  diceDisabled: boolean;
  onReturn: () => void;
  gameEnded: boolean;
}

const GameHeader: React.FC<GameHeaderProps> = ({
  currentPlayer,
  onRoll,
  diceDisabled,
  onReturn,
  gameEnded,
}) => {
  // Keyboard shortcut for dice roll
  useEffect(() => {
    const handleKeyPress = (e: KeyboardEvent) => {
      if (e.code === 'Space' && !diceDisabled && !gameEnded && currentPlayer && !currentPlayer.isPC) {
        e.preventDefault();
        onRoll();
      }
    };

    window.addEventListener('keydown', handleKeyPress);
    return () => window.removeEventListener('keydown', handleKeyPress);
  }, [diceDisabled, gameEnded, currentPlayer, onRoll]);

  return (
    <div className="flex flex-col gap-3 sm:gap-4 mb-4 sm:mb-6 p-3 sm:p-4 bg-white/10 backdrop-blur-sm border border-white/20 rounded-xl sm:rounded-2xl shadow-lg">
      {/* Top row - Title and controls */}
      <div className="flex items-center justify-between">
        <motion.div
          initial={{ scale: 0 }}
          animate={{ scale: 1 }}
          className="flex items-center gap-2 sm:gap-3"
        >
          <div className="w-8 h-8 sm:w-10 sm:h-10 bg-gradient-to-br from-indigo-500 to-purple-600 rounded-full flex items-center justify-center shadow-lg">
            <Dice6 className="w-4 h-4 sm:w-5 sm:h-5 text-white" />
          </div>
          <div>
            <h2 className="text-lg sm:text-xl lg:text-2xl font-bold text-white">宇宙すごろく</h2>
          </div>
        </motion.div>

        <div className="flex items-center gap-2 sm:gap-3">
          <div className="hidden sm:block">
            <ThemeSwitcher />
          </div>
          
          <motion.button
            whileHover={{ scale: 1.05 }}
            whileTap={{ scale: 0.95 }}
            onClick={onReturn}
            className="flex items-center gap-1 sm:gap-2 px-3 sm:px-4 py-2 bg-red-500/80 hover:bg-red-500 text-white font-medium rounded-lg sm:rounded-xl shadow-lg transition-all duration-200 backdrop-blur-sm border border-red-400/30 text-sm"
          >
            <Home className="w-3 h-3 sm:w-4 sm:h-4" />
            <span className="hidden xs:inline">ホーム</span>
          </motion.button>
        </div>
      </div>

      {/* Bottom row - Player info and dice */}
      <div className="flex flex-col xs:flex-row items-center justify-between gap-3 xs:gap-4">
        {/* Current player info */}
        <div className="text-center xs:text-left">
          <div className="text-sm sm:text-base text-white/80">
            現在のプレイヤー: <span className="font-semibold text-white">{currentPlayer?.name || '—'}</span>
            {currentPlayer?.isPC && <span className="ml-1 text-blue-300 text-xs sm:text-sm">(AI)</span>}
          </div>
        </div>

        {/* Dice controls */}
        <div className="flex-shrink-0">
          <DiceRoller
            onRoll={onRoll}
            disabled={(currentPlayer?.isPC ?? false) || diceDisabled || gameEnded}
            label={
              currentPlayer?.isPC 
                ? `${currentPlayer?.name} 思考中...` 
                : gameEnded 
                ? 'ゲーム終了' 
                : '🎲 サイコロを振る'
            }
          />
        </div>
      </div>

      {/* Theme switcher for mobile */}
      <div className="sm:hidden flex justify-center pt-2 border-t border-white/10">
        <ThemeSwitcher />
      </div>
    </div>
  );
};

export default GameHeader;
