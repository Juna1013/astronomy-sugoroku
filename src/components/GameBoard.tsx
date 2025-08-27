import React, { useState } from 'react';
import SquareTooltip from './SquareTooltip';

type Square = {
  id: number;
  name: string;
  effect?: { type: string; value?: number; desc?: string };
  icon?: string;
};

type Props = {
  squares: Square[];
  players: { id: number; name: string; pos: number; color?: string }[];
  started: boolean;
};

export default function GameBoard({ squares, players, started }: Props) {
  const [hovered, setHovered] = useState<number | null>(null);

  return (
    <div className="p-6">
      {!started && (
        <div className="mb-4 text-center text-sm text-slate-500">
          ゲームはダッシュボードから開始してください
        </div>
      )}

      <div className="grid grid-cols-6 gap-3">
        {squares.map((sq) => (
          <div
            key={sq.id}
            onMouseEnter={() => setHovered(sq.id)}
            onMouseLeave={() => setHovered(null)}
            className="relative bg-white/5 rounded-lg p-3 min-h-[92px] flex flex-col justify-between border border-white/5 hover:scale-[1.01] transition-transform"
          >
            {/* アイコン & マス名 */}
            <div className="flex items-start justify-between">
              <div className="flex items-center gap-2">
                <div className="text-lg">{sq.icon ?? '✦'}</div>
                <div className="text-sm font-medium">{sq.name}</div>
              </div>

              {/* 小さな効果バッジ */}
              {sq.effect && (
                <div className="text-xs text-white/80 px-2 py-1 rounded-md bg-white/6 border border-white/8">
                  {sq.effect.type}
                </div>
              )}
            </div>

            {/* 駒を表示 */}
            <div className="flex gap-2 items-end justify-start">
              {players
                .filter((p) => p.pos === sq.id)
                .map((p) => (
                  <div
                    key={p.id}
                    className="flex items-center justify-center text-xs font-semibold min-w-[36px] min-h-[36px] rounded-full shadow-md border-2 border-white/20 select-none"
                    style={{ background: p.color ?? '#7c3aed', color: '#fff' }}
                    title={p.name}
                  >
                    {p.name.slice(0, 2)}
                  </div>
                ))}
            </div>

            {/* ツールチップ */}
            {hovered === sq.id && sq.effect && (
              <div className="absolute z-40" style={{ top: -8, right: -8 }}>
                <SquareTooltip title={sq.effect.type} desc={sq.effect.desc ?? ''} />
              </div>
            )}
          </div>
        ))}
      </div>
    </div>
  );
}
