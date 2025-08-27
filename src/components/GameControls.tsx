'use client';

import React from 'react';
import { motion } from 'framer-motion';
import { Dice1, Dice2, Dice3, Dice4, Dice5, Dice6, RotateCcw } from 'lucide-react';
import { cn } from '@/lib/utils';
import { GameState } from '@/hooks/useGameState';

interface GameControlsProps {
  gameState: GameState;
  onRollDice: () => void;
  onResetGame: () => void;
}

const diceIcons = [Dice1, Dice2, Dice3, Dice4, Dice5, Dice6];

const GameControls: React.FC<GameControlsProps> = ({
  gameState,
  onRollDice,
  onResetGame,
}) => {
  const DiceIcon = diceIcons[gameState.diceValue - 1];
  const currentPlayer = gameState.players[gameState.currentPlayerIndex];

  return (
    <div className="space-y-6">
      {/* プレイヤー情報 */}
      <div className="grid grid-cols-2 gap-4">
        {gameState.players.map((player) => (
          <motion.div
            key={player.id}
            className={cn(
              'p-4 rounded-xl border-2 transition-all duration-300',
              player.id === currentPlayer?.id
                ? 'border-blue-400 bg-blue-50 shadow-lg'
                : 'border-gray-200 bg-white'
            )}
            animate={
              player.id === currentPlayer?.id
                ? { scale: [1, 1.02, 1] }
                : { scale: 1 }
            }
            transition={{ duration: 0.5, repeat: Infinity, repeatDelay: 2 }}
          >
            <div className="flex items-center space-x-3">
              <div className={cn('w-4 h-4 rounded-full', player.color)} />
              <div>
                <h3 className="font-semibold text-gray-800">{player.name}</h3>
                <p className="text-sm text-gray-600">位置: {player.position}</p>
              </div>
            </div>
          </motion.div>
        ))}
      </div>

      {/* サイコロとボタン */}
      <div className="text-center space-y-4">
        <motion.div
          className="inline-block p-6 bg-white rounded-2xl shadow-lg"
          animate={gameState.isRolling ? { rotate: 360 } : { rotate: 0 }}
          transition={{ duration: 0.2 }}
        >
          <DiceIcon className="w-16 h-16 text-blue-600" />
        </motion.div>

        <div className="space-y-3">
          <motion.button
            onClick={onRollDice}
            disabled={gameState.isRolling || gameState.isGameOver}
            className={cn(
              'px-8 py-3 rounded-xl font-semibold text-white transition-all duration-200',
              gameState.isRolling || gameState.isGameOver
                ? 'bg-gray-400 cursor-not-allowed'
                : 'bg-blue-600 hover:bg-blue-700 shadow-lg hover:shadow-xl'
            )}
            whileHover={
              !gameState.isRolling && !gameState.isGameOver
                ? { scale: 1.05 }
                : {}
            }
            whileTap={
              !gameState.isRolling && !gameState.isGameOver
                ? { scale: 0.95 }
                : {}
            }
          >
            {gameState.isRolling ? 'サイコロを振っています...' : 'サイコロを振る'}
          </motion.button>

          <motion.button
            onClick={onResetGame}
            className="flex items-center space-x-2 px-6 py-2 bg-gray-600 hover:bg-gray-700 text-white rounded-lg transition-colors duration-200 mx-auto"
            whileHover={{ scale: 1.05 }}
            whileTap={{ scale: 0.95 }}
          >
            <RotateCcw className="w-4 h-4" />
            <span>リセット</span>
          </motion.button>
        </div>
      </div>

      {/* イベント表示 */}
      {gameState.lastEvent && (
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          className={cn(
            'p-4 rounded-xl text-center font-medium',
            gameState.lastEvent.type === 'bonus' && 'bg-green-100 text-green-800',
            gameState.lastEvent.type === 'penalty' && 'bg-red-100 text-red-800',
            gameState.lastEvent.type === 'neutral' && 'bg-gray-100 text-gray-800'
          )}
        >
          {gameState.lastEvent.message}
          {gameState.lastEvent.value !== 0 && (
            <span className="ml-2">
              ({gameState.lastEvent.value > 0 ? '+' : ''}
              {gameState.lastEvent.value} マス)
            </span>
          )}
        </motion.div>
      )}

      {/* 勝利メッセージ */}
      {gameState.isGameOver && gameState.winner && (
        <motion.div
          initial={{ scale: 0 }}
          animate={{ scale: 1 }}
          className="p-6 bg-gradient-to-r from-yellow-400 to-yellow-500 rounded-2xl text-center shadow-lg"
        >
          <h2 className="text-2xl font-bold text-white mb-2">🎉 ゲーム終了！</h2>
          <p className="text-white text-lg">
            {gameState.winner.name} の勝利です！
          </p>
        </motion.div>
      )}
    </div>
  );
};

export default GameControls;
