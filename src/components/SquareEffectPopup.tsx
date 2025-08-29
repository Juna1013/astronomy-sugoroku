// src/components/SquareEffectPopup.tsx
'use client';

import React from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import { X, Gift, Zap, ArrowRight, ArrowLeft, RotateCcw } from 'lucide-react';
import { Square } from '../types';

interface SquareEffectPopupProps {
  square: Square | null;
  playerName: string;
  onClose: () => void;
  show: boolean;
}

const SquareEffectPopup: React.FC<SquareEffectPopupProps> = ({
  square,
  playerName,
  onClose,
  show
}) => {
  if (!square || !show) return null;

  const getEffectIcon = () => {
    switch (square.effect?.type) {
      case 'move':
        return square.effect.value && square.effect.value > 0 ? (
          <ArrowRight className="w-8 h-8 text-green-400" />
        ) : (
          <ArrowLeft className="w-8 h-8 text-red-400" />
        );
      case 'bonus':
        return <Gift className="w-8 h-8 text-yellow-400" />;
      case 'penalty':
        return <RotateCcw className="w-8 h-8 text-red-400" />;
      default:
        return <Zap className="w-8 h-8 text-blue-400" />;
    }
  };

  const getEffectColor = () => {
    switch (square.effect?.type) {
      case 'bonus':
        return 'from-green-500/20 to-emerald-500/20 border-green-400/30';
      case 'penalty':
        return 'from-red-500/20 to-pink-500/20 border-red-400/30';
      case 'move':
        return square.effect.value && square.effect.value > 0
          ? 'from-blue-500/20 to-cyan-500/20 border-blue-400/30'
          : 'from-orange-500/20 to-red-500/20 border-orange-400/30';
      default:
        return 'from-purple-500/20 to-indigo-500/20 border-purple-400/30';
    }
  };

  return (
    <AnimatePresence>
      <motion.div
        initial={{ opacity: 0 }}
        animate={{ opacity: 1 }}
        exit={{ opacity: 0 }}
        className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-black/60 backdrop-blur-sm"
        onClick={onClose}
      >
        <motion.div
          initial={{ scale: 0.5, opacity: 0, y: 50 }}
          animate={{ scale: 1, opacity: 1, y: 0 }}
          exit={{ scale: 0.5, opacity: 0, y: 50 }}
          transition={{ type: 'spring', duration: 0.6 }}
          className="relative w-full max-w-sm sm:max-w-md mx-auto"
          onClick={(e) => e.stopPropagation()}
        >
          <div className={`backdrop-blur-xl bg-gradient-to-br ${getEffectColor()} border rounded-3xl p-6 sm:p-8 shadow-2xl text-center relative overflow-hidden`}>
            {/* Close button */}
            <button
              onClick={onClose}
              className="absolute top-4 right-4 p-2 rounded-full bg-white/10 hover:bg-white/20 text-white transition-colors duration-200"
            >
              <X className="w-4 h-4" />
            </button>

            {/* Square icon */}
            <motion.div
              initial={{ scale: 0, rotate: -180 }}
              animate={{ scale: 1, rotate: 0 }}
              transition={{ delay: 0.2, type: 'spring', stiffness: 200 }}
              className="text-6xl sm:text-7xl mb-4"
            >
              {square.icon || '✦'}
            </motion.div>

            {/* Square name */}
            <motion.h2
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ delay: 0.3 }}
              className="text-2xl sm:text-3xl font-bold text-white mb-2"
            >
              {square.name}
            </motion.h2>

            {/* Player info */}
            <motion.p
              initial={{ opacity: 0 }}
              animate={{ opacity: 1 }}
              transition={{ delay: 0.4 }}
              className="text-white/80 mb-6"
            >
              {playerName} が到着しました！
            </motion.p>

            {/* Effect section */}
            {square.effect && (
              <motion.div
                initial={{ opacity: 0, y: 30 }}
                animate={{ opacity: 1, y: 0 }}
                transition={{ delay: 0.5 }}
                className="bg-white/10 rounded-2xl p-4 sm:p-6 mb-6 border border-white/20"
              >
                <div className="flex items-center justify-center gap-3 mb-4">
                  {getEffectIcon()}
                  <span className="text-lg sm:text-xl font-semibold text-white">
                    効果発動！
                  </span>
                </div>
                
                <div className="text-white/90 text-sm sm:text-base leading-relaxed">
                  {square.effect.desc || '特別な効果があります'}
                </div>

                {square.effect.type === 'move' && square.effect.value && (
                  <div className="mt-3 p-3 bg-white/10 rounded-lg">
                    <div className="text-white font-semibold">
                      {square.effect.value > 0 ? '前進' : '後退'}: {Math.abs(square.effect.value)} マス
                    </div>
                  </div>
                )}
              </motion.div>
            )}

            {/* No effect message */}
            {!square.effect && (
              <motion.div
                initial={{ opacity: 0, y: 30 }}
                animate={{ opacity: 1, y: 0 }}
                transition={{ delay: 0.5 }}
                className="bg-white/10 rounded-2xl p-4 sm:p-6 mb-6 border border-white/20"
              >
                <div className="text-white/80">
                  特別な効果はありませんが、美しい景色を楽しめます✨
                </div>
              </motion.div>
            )}

            {/* Close button */}
            <motion.button
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ delay: 0.6 }}
              whileHover={{ scale: 1.05 }}
              whileTap={{ scale: 0.95 }}
              onClick={onClose}
              className="w-full py-3 bg-gradient-to-r from-indigo-500 to-purple-500 hover:from-indigo-600 hover:to-purple-600 text-white font-semibold rounded-xl shadow-lg transition-all duration-200"
            >
              続ける
            </motion.button>
          </div>

          {/* Floating particles effect for bonus */}
          {square.effect?.type === 'bonus' && (
            <div className="absolute inset-0 pointer-events-none">
              {[...Array(6)].map((_, i) => (
                <motion.div
                  key={i}
                  initial={{ scale: 0, opacity: 0 }}
                  animate={{ 
                    scale: [0, 1, 0],
                    opacity: [0, 1, 0],
                    x: [0, (Math.random() - 0.5) * 100],
                    y: [0, (Math.random() - 0.5) * 100],
                  }}
                  transition={{
                    duration: 2,
                    delay: i * 0.2,
                    repeat: Infinity,
                    repeatDelay: 2
                  }}
                  className="absolute top-1/2 left-1/2 w-1 h-1 bg-yellow-400 rounded-full"
                />
              ))}
            </div>
          )}
        </motion.div>
      </motion.div>
    </AnimatePresence>
  );
};

export default SquareEffectPopup;
