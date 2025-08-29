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
      className={`flex items-center justify-center text-[10px] sm:text-xs font-bold w-6 h-6 sm:w-8 sm:h-8 rounded-full shadow-lg select-none border-2 border-white/30 transition-all duration-300 ${
        isActive ? "ring-2 ring-white ring-offset-2 ring-offset-transparent animate-pulse" : ""
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
    <div className="p-4">
      {!started && (
        <div className="mb-4 text-center text-sm text-white/60 bg-white/10 rounded-lg py-2 px-4 backdrop-blur-sm border border-white/20">
          ゲームはダッシュボードから開始してください
        </div>
      )}

      <div className="grid grid-cols-2 sm:grid-cols-3 md:grid-cols-4 lg:grid-cols-6 gap-3 sm:gap-4">
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
              className={`relative group text-left rounded-2xl p-3 sm:p-4 min-h-[90px] sm:min-h-[110px] transition-all duration-300 backdrop-blur-sm border shadow-lg hover:shadow-xl ${
                isGoal
                  ? "bg-gradient-to-br from-yellow-500/20 to-orange-500/20 border-yellow-400/30"
                  : isStart
                  ? "bg-gradient-to-br from-green-500/20 to-emerald-500/20 border-green-400/30"
                  : "bg-white/10 border-white/20 hover:bg-white/15"
              }`}
            >
              {/* Header with icon and name */}
              <div className="flex items-start justify-between mb-2">
                <div className="flex items-center gap-2">
                  <motion.div 
                    animate={{ rotate: sq.effect ? [0, 10, 0] : 0 }}
                    transition={{ duration: 2, repeat: Infinity }}
                    className="text-base sm:text-xl"
                  >
                    {sq.icon || "✦"}
                  </motion.div>
                  <div className="text-xs sm:text-sm font-semibold text-white/95 leading-tight">
                    {sq.name}
                  </div>
                </div>

                {/* Effect badge */}
                {sq.effect && (
                  <div className="flex items-center gap-1 px-2 py-1 rounded-full border border-white/20 bg-white/10 backdrop-blur-sm">
                    <div className="text-xs">
                      <EffectIcon type={sq.effect.type} />
                    </div>
                  </div>
                )}
              </div>

              {/* Players area */}
              <div className="flex items-center justify-between">
                <div className="flex -space-x-1 items-center">
                  {onSquare.length > 0 ? (
                    onSquare.map((p, idx) => (
                      <div
                        key={p.id}
                        style={{ zIndex: 10 + idx }}
                      >
                        <PlayerToken 
                          player={p} 
                          isActive={currentPlayerId === p.id} 
                        />
                      </div>
                    ))
                  ) : (
                    <div className="w-6 h-6 sm:w-8 sm:h-8 rounded-full border-2 border-dashed border-white/20 flex items-center justify-center">
                      <div className="text-[8px] text-white/40">—</div>
                    </div>
                  )}
                </div>
              </div>

              {/* Effect description */}
              {sq.effect?.desc && (
                <div className="mt-2 pt-2 border-t border-white/10">
                  <div className="text-[10px] sm:text-xs text-white/70 leading-tight">
                    {sq.effect.desc}
                  </div>
                </div>
              )}

              {/* Hover effect overlay */}
              <div className="absolute inset-0 rounded-2xl bg-gradient-to-t from-white/5 to-transparent opacity-0 group-hover:opacity-100 transition-opacity duration-300 pointer-events-none" />

              {/* Special square indicators */}
              {isStart && (
                <div className="absolute -top-1 -right-1 w-3 h-3 bg-green-400 rounded-full border-2 border-white shadow-sm" />
              )}
              {isGoal && (
                <div className="absolute -top-1 -right-1 w-3 h-3 bg-yellow-400 rounded-full border-2 border-white shadow-sm animate-pulse" />
              )}
            </motion.button>
          );
        })}
      </div>
    </div>
  );
}
