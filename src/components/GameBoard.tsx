'use client';

import React from 'react';
import { motion } from 'framer-motion';
import { cn } from '@/lib/utils';
import { Player } from '@/hooks/useGameState';

interface GameBoardProps {
  players: Player[];
  boardSize: number;
}

const GameBoard: React.FC<GameBoardProps> = ({ players, boardSize }) => {
  const renderCell = (index: number): JSX.Element => {
    const playersOnCell = players.filter((player) => player.position === index);
    const isSpecialCell = index % 5 === 0 && index !== 0;

    return (
      <motion.div
        key={index}
        className={cn(
          'relative w-16 h-16 border-2 border-gray-300 flex items-center justify-center text-sm font-medium rounded-lg',
          isSpecialCell ? 'bg-yellow-100 border-yellow-400' : 'bg-white',
          index === 0 && 'bg-green-100 border-green-400',
          index === boardSize - 1 && 'bg-red-100 border-red-400'
        )}
        whileHover={{ scale: 1.05 }}
      >
        <span className="absolute top-1 left-1 text-xs text-gray-500">
          {index}
        </span>
        
        {index === 0 && (
          <span className="text-green-600 font-bold text-xs">START</span>
        )}
        
        {index === boardSize - 1 && (
          <span className="text-red-600 font-bold text-xs">GOAL</span>
        )}

        <div className="absolute bottom-1 right-1 flex gap-1">
          {playersOnCell.map((player) => (
            <motion.div
              key={player.id}
              className={cn(
                'w-3 h-3 rounded-full border-2 border-white shadow-sm',
                player.color
              )}
              initial={{ scale: 0 }}
              animate={{ scale: 1 }}
              transition={{ type: 'spring', stiffness: 500, damping: 30 }}
            />
          ))}
        </div>
      </motion.div>
    );
  };

  return (
    <div className="p-6 bg-gradient-to-br from-blue-50 to-purple-50 rounded-2xl shadow-lg">
      <h2 className="text-2xl font-bold text-center mb-6 text-gray-800">
        人生ゲーム すごろく
      </h2>
      <div className="grid grid-cols-6 gap-2 max-w-2xl mx-auto">
        {Array.from({ length: boardSize }, (_, index) => renderCell(index))}
      </div>
    </div>
  );
};

export default GameBoard;