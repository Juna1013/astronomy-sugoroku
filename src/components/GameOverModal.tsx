'use client';

import React from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import { Trophy, Home, RotateCcw, Sparkles } from 'lucide-react';
import { Player } from '../types';

interface GameOverModalProps {
  winner: Player | null;
  onReturn: () => void;
  onPlayAgain: () => void;
}

const GameOverModal: React.FC<GameOverModalProps> = ({ winner, onReturn, onPlayAgain }) => {
  if (!winner) return null;

  return (
    <AnimatePresence>
      <motion.div
        initial={{ opacity: 0 }}
        animate={{ opacity: 1 }}
        exit={{ opacity: 0 }}
        className="fixed inset-0 z-50 flex items-center justify-center p-4"
        style={{ backgroundColor: 'rgba(0, 0, 0, 0.8)' }}
      >
        <motion.div
          initial={{ scale: 0.5, opacity: 0, y: 50 }}
          animate={{ scale: 1, opacity: 1, y: 0 }}
          exit={{ scale: 0.5, opacity: 0, y: 50 }}
          transition={{ type: 'spring', duration: 0.6 }}
          className="relative w-full max-w-md mx-auto"
        >
          {/* Celebration particles effect */}
          <div className="absolute inset-0 pointer-events-none">
            {[...Array(12)].map((_, i) => (
              <motion.div
                key={i}
                initial={{ scale: 0, opacity: 0 }}
                animate={{ 
                  scale: [0, 1, 0],
                  opacity: [0, 1, 0],
                  x: [0, (Math.random() - 0.5) * 200],
                  y: [0, (Math.random() - 0.5) * 200],
                }}
                transition={{
                  duration: 2,
                  delay: i * 0.1,
                  repeat: Infinity,
                  repeatDelay: 3
                }}
                className="absolute top-1/2 left-1/2 w-2 h-2 bg-yellow-400 rounded-full"
                style={{
                  filter: 'drop-shadow(0 0 6px rgba(255, 255, 0, 0.8))'
                }}
              />
            ))}
          </div>

          {/* Modal content */}
          <div className="backdrop-blur-xl bg-white/10 border border-white/20 rounded-3xl p-8 shadow-2xl text-center relative overflow-hidden">
            {/* Background gradient */}
            <div className="absolute inset-0 bg-gradient-to-br from-yellow-500/20 via-orange-500/10 to-red-500/20 rounded-3xl" />
            
            <div className="relative z-10">
              {/* Winner icon */}
              <motion.div
                initial={{ scale: 0, rotate: -180 }}
                animate={{ scale: 1, rotate: 0 }}
                transition={{ delay: 0.2, type: 'spring', stiffness: 200 }}
                className="w-20 h-20 mx-auto mb-6 bg-gradient-to-br from-yellow-400 to-orange-500 rounded-full flex items-center justify-center shadow-2xl"
              >
                <Trophy className="w-10 h-10 text-white" />
              </motion.div>

              {/* Title */}
              <motion.div
                initial={{ opacity: 0, y: 20 }}
                animate={{ opacity: 1, y: 0 }}
                transition={{ delay: 0.4 }}
                className="mb-6"
              >
                <h2 className="text-3xl font-bold text-white mb-2 flex items-center justify-center gap-2">
                  <Sparkles className="w-6 h-6 text-yellow-300" />
                  ゲーム終了！
                  <Sparkles className="w-6 h-6 text-yellow-300" />
                </h2>
                <motion.p 
                  initial={{ scale: 0.8 }}
                  animate={{ scale: 1 }}
                  transition={{ delay: 0.6, type: 'spring' }}
                  className="text-xl text-white/90"
                >
                  🎉 <span className="font-bold bg-gradient-to-r from-yellow-300 to-orange-300 bg-clip-text text-transparent">
                    {winner.name}
                  </span> の勝利です！ 🎉
                </motion.p>
              </motion.div>

              {/* Winner badge */}
              <motion.div
                initial={{ opacity: 0, scale: 0 }}
                animate={{ opacity: 1, scale: 1 }}
                transition={{ delay: 0.8 }}
                className="inline-flex items-center gap-2 px-6 py-3 bg-gradient-to-r from-yellow-500/30 to-orange-500/30 rounded-full border border-yellow-400/30 mb-8"
              >
                <div 
                  className="w-4 h-4 rounded-full border-2 border-white"
                  style={{ backgroundColor: winner.color }}
                />
                <span className="text-white font-semibold">
                  {winner.name} {winner.isPC && '(AI)'}
                </span>
              </motion.div>

              {/* Action buttons */}
              <motion.div
                initial={{ opacity: 0, y: 30 }}
                animate={{ opacity: 1, y: 0 }}
                transition={{ delay: 1 }}
                className="flex flex-col sm:flex-row items-center justify-center gap-3"
              >
                <motion.button
                  whileHover={{ scale: 1.05 }}
                  whileTap={{ scale: 0.95 }}
                  onClick={onPlayAgain}
                  className="flex items-center gap-2 px-6 py-3 bg-gradient-to-r from-green-500 to-emerald-500 hover:from-green-600 hover:to-emerald-600 text-white font-semibold rounded-xl shadow-lg transition-all duration-200 backdrop-blur-sm border border-green-400/30"
                >
                  <RotateCcw className="w-4 h-4" />
                  <span>もう一度遊ぶ</span>
                </motion.button>

                <motion.button
                  whileHover={{ scale: 1.05 }}
                  whileTap={{ scale: 0.95 }}
                  onClick={onReturn}
                  className="flex items-center gap-2 px-6 py-3 bg-white/20 hover:bg-white/30 text-white font-medium rounded-xl shadow-lg transition-all duration-200 backdrop-blur-sm border border-white/30"
                >
                  <Home className="w-4 h-4" />
                  <span>ホームに戻る</span>
                </motion.button>
              </motion.div>

              {/* Game stats (optional) */}
              <motion.div
                initial={{ opacity: 0 }}
                animate={{ opacity: 1 }}
                transition={{ delay: 1.2 }}
                className="mt-6 pt-6 border-t border-white/20"
              >
                <p className="text-sm text-white/70">
                  素晴らしいゲームでした！🚀
                </p>
              </motion.div>
            </div>
          </div>
        </motion.div>
      </motion.div>
    </AnimatePresence>
  );
};

export default GameOverModal;
