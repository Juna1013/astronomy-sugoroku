// src/components/GameBoard.tsx の改善版
'use client';

import React, { memo, useMemo } from "react";
import { motion } from "framer-motion";
import { Square, Player } from "@/types";

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
    teleport: "🌀",
    swap: "🔄",
    random_move: "🎲",
    energy_burst: "💥",
    big_bang: "💫",
    gravity: "🌌",
    move_to_nearest: "🧭",
    roll_again: "🎯",
    shield: "🛡️",
    double_next: "⚡",
    rest: "😴",
    lucky: "🍀",
    mystery: "❓",
    reflection: "🪞",
    parallel: "🌈",
    chaos: "🌪️",
    curse: "☠️",
    freeze: "🧊",
    volcano: "🌋",
    geyser: "💦",
    snipe: "🏹",
    black_hole: "⚫",
    wormhole: "🌀",
    comet_tail: "☄️",
    galactic_center: "🌌",
    nebula_birth: "☁️",
    supernova: "💥",
    neutron_pulse: "📡",
    magnetic_storm: "🧲",
    quasar_beam: "💫",
    dark_matter: "❓",
    dark_energy: "🌐",
    spacetime_warp: "🌀",
    edge_of_universe: "🔚",
    dimensional_rift: "🕳️",
    god_zone: "👁️",
    heat_death: "💀",
    big_crunch: "🕳️",
    big_rip: "💥",
    new_big_bang: "✨",
    ultimate_truth: "💎",
    chaos_vortex: "🌪️",
    infinite_loop: "♾️",
    parallel_universe: "🌈",
    cosmic_consciousness: "🧠",
    genesis_light: "💡",
    apocalypse_dark: "🌑",
    time_keeper: "⏰",
    space_ruler: "👑",
    causality_break: "🔄",
    fate_crossroad: "✖️",
    miracle_moment: "⭐",
    despair_abyss: "💔",
  };
  return <span aria-hidden="true">{icons[type as keyof typeof icons] || "★"}</span>;
}

const PlayerToken = memo(function PlayerToken({ player, isActive }: { player: Player; isActive?: boolean }) {
  const label = player.name.slice(0, 2);
  const isResting = player.restTurns && player.restTurns > 0;
  const isCursed = player.curseTurns && player.curseTurns > 0;
  const isConfused = player.confusionTurns && player.confusionTurns > 0;
  const hasStatusEffect = isResting || isCursed || isConfused;
  
  return (
    <div className="relative">
      <motion.div
        key={`${player.id}-${player.pos}`}
        initial={{ scale: 0 }}
        animate={{ 
          scale: 1,
          y: isActive && !hasStatusEffect ? [0, -8, 0] : 0,
          opacity: hasStatusEffect ? 0.7 : 1,
          rotate: isConfused ? [0, 5, -5, 0] : 0
        }}
        transition={{
          scale: { duration: 0.3 },
          y: { duration: 0.6, repeat: isActive && !hasStatusEffect ? Infinity : 0, repeatType: "reverse" },
          opacity: { duration: 0.3 },
          rotate: { duration: 1, repeat: isConfused ? Infinity : 0 }
        }}
        whileHover={{ scale: 1.1 }}
        className={`flex items-center justify-center text-[9px] xs:text-[10px] sm:text-xs font-bold w-5 h-5 xs:w-6 xs:h-6 sm:w-8 sm:h-8 rounded-full shadow-lg select-none border-2 transition-all duration-300 ${
          hasStatusEffect 
            ? "border-gray-400/50" 
            : "border-white/30"
        } ${
          isActive && !hasStatusEffect ? "ring-1 xs:ring-2 ring-white ring-offset-1 xs:ring-offset-2 ring-offset-transparent animate-pulse" : ""
        } ${
          isCursed ? "filter saturate-50" : ""
        }`}
        style={{ 
          background: hasStatusEffect 
            ? `linear-gradient(135deg, #6b7280, #6b7280dd)` 
            : `linear-gradient(135deg, ${player.color || '#7c3aed'}, ${player.color || '#7c3aed'}dd)`,
          color: "#fff" 
        }}
        title={`${player.name}${player.isPC ? " (AI)" : ""}${isResting ? ` - ${player.restTurns}回休み` : ""}${isCursed ? ` - 呪い${player.curseTurns}T` : ""}${isConfused ? ` - 混乱${player.confusionTurns}T` : ""}`}
      >
        {label}
      </motion.div>
      
      {/* Status effect indicators */}
      {isResting && (
        <motion.div
          initial={{ scale: 0, opacity: 0 }}
          animate={{ 
            scale: [0, 1.2, 1], 
            opacity: 1,
            rotate: [0, 10, -10, 0]
          }}
          transition={{ 
            duration: 0.6,
            rotate: { duration: 2, repeat: Infinity }
          }}
          className="absolute -top-1 -right-1 w-3 h-3 xs:w-4 xs:h-4 bg-blue-500 rounded-full flex items-center justify-center text-[6px] xs:text-[8px] shadow-lg"
        >
          💤
        </motion.div>
      )}
      
      {isCursed && (
        <motion.div
          initial={{ scale: 0, opacity: 0 }}
          animate={{ 
            scale: [0, 1.2, 1], 
            opacity: 1,
            rotate: [0, -10, 10, 0]
          }}
          transition={{ 
            duration: 0.6,
            rotate: { duration: 1.5, repeat: Infinity }
          }}
          className="absolute -top-1 -left-1 w-3 h-3 xs:w-4 xs:h-4 bg-purple-600 rounded-full flex items-center justify-center text-[6px] xs:text-[8px] shadow-lg"
        >
          ☠️
        </motion.div>
      )}
      
      {isConfused && (
        <motion.div
          initial={{ scale: 0, opacity: 0 }}
          animate={{ 
            scale: [0, 1.2, 1], 
            opacity: 1,
            y: [0, -2, 0]
          }}
          transition={{ 
            duration: 0.6,
            y: { duration: 0.8, repeat: Infinity }
          }}
          className="absolute -bottom-1 -left-1 w-3 h-3 xs:w-4 xs:h-4 bg-yellow-500 rounded-full flex items-center justify-center text-[6px] xs:text-[8px] shadow-lg"
        >
          😵
        </motion.div>
      )}
      
      {/* Count badges */}
      {(isResting && player.restTurns && player.restTurns > 1) ||
       (isCursed && player.curseTurns && player.curseTurns > 1) ||
       (isConfused && player.confusionTurns && player.confusionTurns > 1) ? (
        <motion.div
          initial={{ scale: 0 }}
          animate={{ scale: 1 }}
          className="absolute -bottom-1 -right-1 w-3 h-3 xs:w-4 xs:h-4 bg-red-500 rounded-full flex items-center justify-center text-[6px] xs:text-[8px] text-white font-bold shadow-lg"
        >
          {Math.max(player.restTurns || 0, player.curseTurns || 0, player.confusionTurns || 0)}
        </motion.div>
      ) : null}
    </div>
  );
});

const GameBoard = memo(function GameBoard({
  squares,
  players,
  started = true,
  currentPlayerId,
  onSquareClick,
}: Props) {
  // メモ化で同じsqIdに対する計算を避ける
  const playersPositionMap = useMemo(() => {
    const map = new Map<number, Player[]>();
    players.forEach(player => {
      const existing = map.get(player.pos) || [];
      map.set(player.pos, [...existing, player]);
    });
    return map;
  }, [players]);
  
  const playersOn = (sqId: number) => playersPositionMap.get(sqId) || [];

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
          const hasActivePlayer = onSquare.some(p => currentPlayerId === p.id);
          
          return (
            <motion.button
              key={sq.id}
              initial={{ opacity: 0, y: 20 }}
              animate={{ 
                opacity: 1, 
                y: 0,
                scale: hasActivePlayer ? [1, 1.05, 1] : 1,
                boxShadow: hasActivePlayer 
                  ? ["0 4px 20px rgba(255,255,255,0.2)", "0 8px 30px rgba(255,255,255,0.4)", "0 4px 20px rgba(255,255,255,0.2)"]
                  : "0 4px 20px rgba(0,0,0,0.1)"
              }}
              transition={{ 
                delay: index * 0.02,
                scale: { duration: 0.8, repeat: hasActivePlayer ? Infinity : 0, repeatType: "reverse" },
                boxShadow: { duration: 0.8, repeat: hasActivePlayer ? Infinity : 0, repeatType: "reverse" }
              }}
              whileHover={{ scale: 1.02, y: -2 }}
              whileTap={{ scale: 0.98 }}
              onClick={() => onSquareClick?.(sq)}
              className={`relative group text-left rounded-xl xs:rounded-2xl p-2 xs:p-3 sm:p-4 min-h-[70px] xs:min-h-[80px] sm:min-h-[100px] md:min-h-[110px] transition-all duration-300 backdrop-blur-sm border shadow-lg hover:shadow-xl ${
                hasActivePlayer
                  ? "bg-gradient-to-br from-blue-500/30 to-purple-500/30 border-blue-400/50"
                  : isGoal
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
});

export default GameBoard;
