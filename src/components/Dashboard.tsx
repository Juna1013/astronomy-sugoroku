// src/components/Dashboard.tsx の改善版
'use client';

import React from 'react';
import { motion } from 'framer-motion';
import { Rocket, Settings, Users, Bot } from 'lucide-react';

interface DashboardProps {
  onStart: (pcMode?: boolean) => void;
  onOpenSettings: () => void;
}

export default function Dashboard({ onStart, onOpenSettings }: DashboardProps) {
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
        className="w-full max-w-xs sm:max-w-sm"
      >
        <div className="backdrop-blur-xl bg-white/10 border border-white/20 rounded-2xl p-6 sm:p-8 shadow-2xl">
          <div className="space-y-3 sm:space-y-4">
            <motion.button
              whileHover={{ scale: 1.02 }}
              whileTap={{ scale: 0.98 }}
              onClick={() => onStart(false)}
              className="w-full group relative overflow-hidden bg-gradient-to-r from-emerald-500 to-teal-500 hover:from-emerald-600 hover:to-teal-600 text-white font-semibold py-3 sm:py-4 px-4 sm:px-6 rounded-xl shadow-lg transition-all duration-300 flex items-center justify-center gap-2 sm:gap-3 text-sm sm:text-base"
            >
              <Users className="w-4 h-4 sm:w-5 sm:h-5" />
              <span>2人でプレイ</span>
              <div className="absolute inset-0 bg-white/20 opacity-0 group-hover:opacity-100 transition-opacity duration-300" />
            </motion.button>

            <motion.button
              whileHover={{ scale: 1.02 }}
              whileTap={{ scale: 0.98 }}
              onClick={() => onStart(true)}
              className="w-full group relative overflow-hidden bg-gradient-to-r from-blue-500 to-indigo-500 hover:from-blue-600 hover:to-indigo-600 text-white font-semibold py-3 sm:py-4 px-4 sm:px-6 rounded-xl shadow-lg transition-all duration-300 flex items-center justify-center gap-2 sm:gap-3 text-sm sm:text-base"
            >
              <Bot className="w-4 h-4 sm:w-5 sm:h-5" />
              <span>AIと対戦</span>
              <div className="absolute inset-0 bg-white/20 opacity-0 group-hover:opacity-100 transition-opacity duration-300" />
            </motion.button>

            <motion.button
              whileHover={{ scale: 1.02 }}
              whileTap={{ scale: 0.98 }}
              onClick={onOpenSettings}
              className="w-full group relative overflow-hidden bg-white/10 hover:bg-white/20 border border-white/30 text-white font-medium py-2.5 sm:py-3 px-4 sm:px-6 rounded-xl shadow-lg transition-all duration-300 flex items-center justify-center gap-2 sm:gap-3 text-sm"
            >
              <Settings className="w-3 h-3 sm:w-4 sm:h-4" />
              <span>設定</span>
            </motion.button>
          </div>

          <div className="mt-4 sm:mt-6 pt-4 sm:pt-6 border-t border-white/20">
            <div className="text-xs text-white/60 space-y-1">
              <p>• 各マスをタップすると効果を確認できます</p>
              <p>• モバイル・デスクトップ両対応</p>
              <p className="hidden sm:block">• スペースキーでサイコロを振れます</p>
            </div>
          </div>
        </div>
      </motion.div>

      {/* Floating elements - レスポンシブ対応 */}
      <motion.div
        animate={{ 
          y: [-10, 10, -10],
          rotate: [0, 5, 0, -5, 0]
        }}
        transition={{ 
          duration: 8,
          repeat: Infinity,
          ease: "easeInOut"
        }}
        className="absolute top-1/4 left-1/4 text-xl sm:text-2xl opacity-20 sm:opacity-30"
      >
        🪐
      </motion.div>

      <motion.div
        animate={{ 
          y: [10, -10, 10],
          rotate: [0, -5, 0, 5, 0]
        }}
        transition={{ 
          duration: 6,
          repeat: Infinity,
          ease: "easeInOut",
          delay: 1
        }}
        className="absolute bottom-1/4 right-1/4 text-xl sm:text-2xl opacity-20 sm:opacity-30"
      >
        ⭐
      </motion.div>

      <motion.div
        animate={{ 
          y: [-5, 5, -5],
          x: [-5, 5, -5]
        }}
        transition={{ 
          duration: 10,
          repeat: Infinity,
          ease: "easeInOut",
          delay: 2
        }}
        className="absolute top-1/3 right-1/3 text-lg sm:text-xl opacity-15 sm:opacity-20"
      >
        🌙
      </motion.div>
    </div>
  );
}
