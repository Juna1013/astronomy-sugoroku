'use client';

import React, { useEffect } from 'react';
import { motion } from 'framer-motion';
import { Home, Dice6 } from 'lucide-react';
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
    <div className="flex flex-col lg:flex-row lg:items-center justify-between gap-4 mb-6 p-4 bg-white/10 backdrop-blur-sm border border-white/20 rounded-2xl shadow-lg">
      <div className="flex items-center gap-4">
        <motion.div
          initial={{ scale: 0 }}
          animate={{ scale: 1 }}
          className="flex items-center gap-3"
        >
          <div className="w-10 h-10 bg-gradient-to-br from-indigo-500 to-purple-600 rounded-full flex items-center justify-center shadow-lg">
            <Dice6 className="w-5 h-5 text-white" />
          </div>
          <div>
            <h2 className="text-xl lg:text-2xl font-bold text-white">宇宙すごろく</h2>
            <div className="text-sm text-white/80">
              現在のプレイヤー: <span className="font-semibold text-white">{currentPlayer?.name || '—'}</span>
              {currentPlayer?.isPC && <span className="ml-1 text-blue-300">(AI)</span>}
            </div>
          </div>
        </motion.div>
      </div>

      <div className="flex items-center gap-3 justify-center lg:justify-end">
        <ThemeSwitcher />
        
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

        <motion.button
          whileHover={{ scale: 1.05 }}
          whileTap={{ scale: 0.95 }}
          onClick={onReturn}
          className="flex items-center gap-2 px-4 py-2 bg-red-500/80 hover:bg-red-500 text-white font-medium rounded-xl shadow-lg transition-all duration-200 backdrop-blur-sm border border-red-400/30"
        >
          <Home className="w-4 h-4" />
          <span className="hidden sm:inline">ホーム</span>
        </motion.button>
      </div>
    </div>
  );
};

export default GameHeader;
