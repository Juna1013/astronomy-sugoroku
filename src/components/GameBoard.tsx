// src/components/GameBoard.tsx の改善版
'use client';

import React from "react";
import { motion } from "framer-motion";

type Square = {
  id: number;
  name: string;
  effect?: { type: string; value?: number; desc?: string };
  icon?: string;
};

type Player = {
  id: number;
  name: string;
  pos: number;
  color?: string;
  isPC?: boolean;
};

type Props = {
  squares: Square[];
  players: Player[];
  started?: boolean;
  currentPlayerId?: number;
  onSquareClick?: (sq: Square) => void;
};

function EffectIcon({ type }: { type?: string }) {
  const icons = {
    move: "⇢",
    bonus: "✨",
    penalty: "⚠️",
  };
  return <span aria-hidden="true">{icons[type as keyof typeof icons] || "★"}</span>;
}

function PlayerToken({ player, isActive }: { player: Player; isActive?: boolean }) {
  const label = player.name.slice(0, 2);
  
  return (
    <motion.div
      initial={{ scale: 0 }}
      animate={{ scale: 1 }}
      whileHover={{ scale: 1.1 }}
      className={`flex items-center justify-center text-[9px] xs:text-[10px] sm:text-xs font-bold w-5 h-5 xs:w-6 xs:h-6 sm:w-8 sm:h-8 rounded-full shadow-lg select-none border-2 border-white/30 transition-all duration-300 ${
        isActive ? "ring-1 xs:ring-2 ring-white ring-offset-1 xs:ring-offset-2 ring-offset-transparent animate-pulse" : ""
      }`}
      style={{ 
        background: `linear-gradient(135deg, ${player.color || '#7c3aed'}, ${player.color || '#7c3aed'}dd)`,
        color: "#fff" 
      }}
      title={`${player.name}${player.isPC ? " (AI)" : ""}`}
    >
      {label}
    </motion.div>
  );
}

export default function GameBoard({
  squares,
  players,
  started = true,
  currentPlayerId,
  onSquareClick,
}: Props) {
  const playersOn = (sqId: number) => players.filter((p) => p.pos === sqId);

  return (
    <div className="p-2 xs:p-3 sm:p-4">
      {!started && (
        <div className="mb-3 sm:mb-4 text-center text-xs sm:text-sm text-white/60 bg-white/10 rounded-lg py-2 px-3 sm:px-4 backdrop-blur-sm border border-white/20">
          ゲームはダッシュボードから開始してください
        </div>
      )}

      <div className="grid grid-cols-2 xs:grid-cols-3 sm:grid-cols-4 md:grid-cols-5 lg:grid-cols-6 xl:grid-cols-8 gap-2 xs:gap-3 sm:gap-4">
        {squares.map((sq, index) => {
          const onSquare = playersOn(sq.id);
          const isGoal = sq.id === squares.length - 1;
          const isStart = sq.id === 0;
          
          return (
            <motion.button
              key={sq.id}
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ delay: index * 0.02 }}
              whileHover={{ scale: 1.02, y: -2 }}
              whileTap={{ scale: 0.98 }}
              onClick={() => onSquareClick?.(sq)}
              className={`relative group text-left rounded-xl xs:rounded-2xl p-2 xs:p-3 sm:p-4 min-h-[70px] xs:min-h-[80px] sm:min-h-[100px] md:min-h-[110px] transition-all duration-300 backdrop-blur-sm border shadow-lg hover:shadow-xl ${
                isGoal
                  ? "bg-gradient-to-br from-yellow-500/20 to-orange-500/20 border-yellow-400/30"
                  : isStart
                  ? "bg-gradient-to-br from-green-500/20 to-emerald-500/20 border-green-400/30"
                  : "bg-white/10 border-white/20 hover:bg-white/15"
              }`}
            >
              {/* Header with icon and name */}
              <div className="flex items-start justify-between mb-1 xs:mb-2">
                <div className="flex items-center gap-1 xs:gap-2 min-w-0 flex-1">
                  <motion.div 
                    animate={{ rotate: sq.effect ? [0, 10, 0] : 0 }}
                    transition={{ duration: 2, repeat: Infinity }}
                    className="text-sm xs:text-base sm:text-xl flex-shrink-0"
                  >
                    {sq.icon || "✦"}
                  </motion.div>
                  <div className="text-[10px] xs:text-xs sm:text-sm font-semibold text-white/95 leading-tight truncate">
                    {sq.name}
                  </div>
                </div>

                {/* Effect badge */}
                {sq.effect && (
                  <div className="flex items-center justify-center w-4 h-4 xs:w-5 xs:h-5 sm:w-6 sm:h-6 rounded-full border border-white/20 bg-white/10 backdrop-blur-sm flex-shrink-0">
                    <div className="text-[8px] xs:text-xs">
                      <EffectIcon type={sq.effect.type} />
                    </div>
                  </div>
                )}
              </div>

              {/* Players area */}
              <div className="flex items-center justify-between">
                <div className="flex -space-x-0.5 xs:-space-x-1 items-center">
                  {onSquare.length > 0 ? (
                    onSquare.slice(0, 3).map((p, idx) => (
                      <div
                        key={p.id}
                        style={{ zIndex: 10 + idx }}
                        className={idx > 0 ? "ml-0.5 xs:ml-1" : ""}
                      >
                        <PlayerToken 
                          player={p} 
                          isActive={currentPlayerId === p.id} 
                        />
                      </div>
                    ))
                  ) : (
                    <div className="w-5 h-5 xs:w-6 xs:h-6 sm:w-8 sm:h-8 rounded-full border-2 border-dashed border-white/20 flex items-center justify-center">
                      <div className="text-[6px] xs:text-[8px] text-white/40">—</div>
                    </div>
                  )}
                  {/* Show overflow count for more than 3 players */}
                  {onSquare.length > 3 && (
                    <div className="ml-0.5 xs:ml-1 text-[8px] xs:text-[9px] text-white/60 bg-white/20 rounded-full w-4 h-4 xs:w-5 xs:h-5 flex items-center justify-center">
                      +{onSquare.length - 3}
                    </div>
                  )}
                </div>
              </div>

              {/* Effect description - only show on larger screens */}
              {sq.effect?.desc && (
                <div className="mt-1 xs:mt-2 pt-1 xs:pt-2 border-t border-white/10 hidden sm:block">
                  <div className="text-[9px] xs:text-[10px] sm:text-xs text-white/70 leading-tight">
                    {sq.effect.desc}
                  </div>
                </div>
              )}

              {/* Hover effect overlay */}
              <div className="absolute inset-0 rounded-xl xs:rounded-2xl bg-gradient-to-t from-white/5 to-transparent opacity-0 group-hover:opacity-100 transition-opacity duration-300 pointer-events-none" />

              {/* Special square indicators */}
              {isStart && (
                <div className="absolute -top-0.5 -right-0.5 xs:-top-1 xs:-right-1 w-2 h-2 xs:w-3 xs:h-3 bg-green-400 rounded-full border border-white shadow-sm" />
              )}
              {isGoal && (
                <div className="absolute -top-0.5 -right-0.5 xs:-top-1 xs:-right-1 w-2 h-2 xs:w-3 xs:h-3 bg-yellow-400 rounded-full border border-white shadow-sm animate-pulse" />
              )}
            </motion.button>
          );
        })}
      </div>
    </div>
  );
}
