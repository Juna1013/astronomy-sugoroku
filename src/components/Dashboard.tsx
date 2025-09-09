// src/components/Dashboard.tsx の改善版
'use client';

import React, { useState } from 'react';
import { motion } from 'framer-motion';
import { Rocket, Settings, Bot, Zap, Star, Flame } from 'lucide-react';
import { DifficultyLevel } from '@/hooks/useGameState';

interface DashboardProps {
  onStart: (pcMode?: boolean, difficulty?: DifficultyLevel) => void;
  onOpenSettings: () => void;
}

export default function Dashboard({ onStart, onOpenSettings }: DashboardProps) {
  const [selectedDifficulty, setSelectedDifficulty] = useState<DifficultyLevel>('normal');

  const difficulties = [
    {
      id: 'easy' as DifficultyLevel,
      name: 'かんたん',
      icon: Zap,
      color: 'from-green-500 to-emerald-500',
      hoverColor: 'hover:from-green-600 hover:to-emerald-600',
      description: '16マス - 初心者向け',
      details: '基本的な効果のみ'
    },
    {
      id: 'normal' as DifficultyLevel,
      name: 'ふつう',
      icon: Star,
      color: 'from-blue-500 to-indigo-500',
      hoverColor: 'hover:from-blue-600 hover:to-indigo-600',
      description: '26マス - バランス重視',
      details: '様々な効果とイベント'
    },
    {
      id: 'hard' as DifficultyLevel,
      name: 'カオス',
      icon: Flame,
      color: 'from-red-500 to-orange-500',
      hoverColor: 'hover:from-red-600 hover:to-orange-600',
      description: '51マス - 予測不可能',
      details: '破天荒な効果が満載'
    }
  ];

  return (
    <div className="min-h-screen flex flex-col items-center justify-center px-4 py-8 relative">

      <motion.div
        initial={{ opacity: 0, y: 20 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ duration: 0.8 }}
        className="text-center mb-6 sm:mb-8"
      >
        <motion.div
          initial={{ scale: 0 }}
          animate={{ scale: 1 }}
          transition={{ delay: 0.2, type: "spring", stiffness: 200 }}
          className="mb-4 sm:mb-6"
        >
          <div className="w-16 h-16 sm:w-20 sm:h-20 mx-auto mb-3 sm:mb-4 bg-gradient-to-br from-indigo-500 to-purple-600 rounded-full flex items-center justify-center shadow-2xl">
            <Rocket className="w-8 h-8 sm:w-10 sm:h-10 text-white" />
          </div>
        </motion.div>
        
        <motion.h1 
          initial={{ opacity: 0 }}
          animate={{ opacity: 1 }}
          transition={{ delay: 0.4 }}
          className="text-3xl sm:text-4xl md:text-5xl lg:text-6xl font-bold bg-gradient-to-r from-indigo-400 to-purple-400 bg-clip-text text-transparent mb-2 sm:mb-3"
        >
          宇宙すごろく
        </motion.h1>
        
        <motion.p 
          initial={{ opacity: 0 }}
          animate={{ opacity: 1 }}
          transition={{ delay: 0.6 }}
          className="text-base sm:text-lg text-white/80 max-w-md mx-auto px-4"
        >
          惑星や星座を巡る壮大な宇宙の旅に出発しよう
        </motion.p>
      </motion.div>

      <motion.div
        initial={{ opacity: 0, y: 30 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ delay: 0.8, duration: 0.6 }}
        className="w-full max-w-md sm:max-w-lg"
      >
        <div className="backdrop-blur-xl bg-white/10 border border-white/20 rounded-2xl p-6 sm:p-8 shadow-2xl">
          {/* Difficulty Selection */}
          <div className="mb-6">
            <h3 className="text-lg sm:text-xl font-semibold text-white mb-4 text-center">
              難易度を選択
            </h3>
            <div className="grid grid-cols-1 gap-3">
              {difficulties.map((difficulty) => {
                const Icon = difficulty.icon;
                const isSelected = selectedDifficulty === difficulty.id;
                
                return (
                  <motion.button
                    key={difficulty.id}
                    whileHover={{ scale: 1.02 }}
                    whileTap={{ scale: 0.98 }}
                    onClick={() => setSelectedDifficulty(difficulty.id)}
                    className={`relative overflow-hidden rounded-xl p-4 border-2 transition-all duration-300 ${
                      isSelected 
                        ? `bg-gradient-to-r ${difficulty.color} border-white/50 shadow-lg` 
                        : 'bg-white/5 border-white/20 hover:bg-white/10'
                    }`}
                  >
                    <div className="flex items-center gap-3">
                      <div className={`p-2 rounded-lg ${isSelected ? 'bg-white/20' : 'bg-white/10'}`}>
                        <Icon className="w-5 h-5 text-white" />
                      </div>
                      <div className="flex-1 text-left">
                        <div className="font-semibold text-white text-base">
                          {difficulty.name}
                        </div>
                        <div className="text-sm text-white/80">
                          {difficulty.description}
                        </div>
                        <div className="text-xs text-white/60">
                          {difficulty.details}
                        </div>
                      </div>
                      {isSelected && (
                        <motion.div
                          initial={{ scale: 0 }}
                          animate={{ scale: 1 }}
                          className="w-6 h-6 bg-white rounded-full flex items-center justify-center"
                        >
                          <div className="w-3 h-3 bg-green-500 rounded-full" />
                        </motion.div>
                      )}
                    </div>
                  </motion.button>
                );
              })}
            </div>
          </div>

          {/* Start Game Button */}
          <motion.button
            whileHover={{ scale: 1.02 }}
            whileTap={{ scale: 0.98 }}
            onClick={() => onStart(true, selectedDifficulty)}
            className="w-full group relative overflow-hidden bg-gradient-to-r from-purple-500 to-pink-500 hover:from-purple-600 hover:to-pink-600 text-white font-semibold py-4 px-6 rounded-xl shadow-lg transition-all duration-300 flex items-center justify-center gap-3 text-base sm:text-lg"
          >
            <Bot className="w-5 h-5 sm:w-6 sm:h-6" />
            <span>AIと対戦開始</span>
            <div className="absolute inset-0 bg-white/20 opacity-0 group-hover:opacity-100 transition-opacity duration-300" />
          </motion.button>

          {/* Additional Options */}
          <div className="mt-4 space-y-2">
            <motion.button
              whileHover={{ scale: 1.02 }}
              whileTap={{ scale: 0.98 }}
              onClick={onOpenSettings}
              className="w-full group relative overflow-hidden bg-white/5 hover:bg-white/10 border border-white/20 text-white font-medium py-2.5 px-4 rounded-xl shadow-lg transition-all duration-300 flex items-center justify-center gap-2 text-sm"
            >
              <Settings className="w-3 h-3 sm:w-4 sm:h-4" />
              <span>設定</span>
            </motion.button>
          </div>

          <div className="mt-6 pt-4 border-t border-white/20">
            <div className="text-xs text-white/60 space-y-1">
              <p>• 各マスをタップすると効果を確認できます</p>
              <p>• モバイル・デスクトップ両対応</p>
              <p className="hidden sm:block">• スペースキーでサイコロを振れます</p>
            </div>
          </div>
        </div>
      </motion.div>

      {/* Floating elements - 軽量化 */}
      <motion.div
        animate={{ 
          y: [-8, 8, -8],
          rotate: [0, 10, 0]
        }}
        transition={{ 
          duration: 6,
          repeat: Infinity,
          ease: "linear"
        }}
        className="absolute top-1/4 left-1/4 text-xl sm:text-2xl opacity-20 sm:opacity-30"
      >
        🪐
      </motion.div>

      <motion.div
        animate={{ 
          y: [8, -8, 8]
        }}
        transition={{ 
          duration: 4,
          repeat: Infinity,
          ease: "linear",
          delay: 1
        }}
        className="absolute bottom-1/4 right-1/4 text-xl sm:text-2xl opacity-20 sm:opacity-30"
      >
        ⭐
      </motion.div>

      <motion.div
        animate={{ 
          x: [-6, 6, -6]
        }}
        transition={{ 
          duration: 8,
          repeat: Infinity,
          ease: "linear",
          delay: 2
        }}
        className="absolute top-1/3 right-1/3 text-lg sm:text-xl opacity-15 sm:opacity-20"
      >
        🌙
      </motion.div>
    </div>
  );
}
