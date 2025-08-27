import React, { useState } from 'react';

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
  started: boolean;
  currentPlayerId?: number;
};

export default function GameBoard({ squares, players, started, currentPlayerId }: Props) {
  const [hovered, setHovered] = useState<number | null>(null);

  return (
    <div className="p-4">
      {!started && (
        <div className="mb-4 text-center text-sm text-slate-400">ゲームはダッシュボードから開始してください</div>
      )}

      {/* レスポンシブ: small: 2列, md: 4列, lg: 6列 */}
      <div className="grid grid-cols-2 md:grid-cols-4 lg:grid-cols-6 gap-3">
        {squares.map((sq) => {
          const playersOnSquare = players.filter((p) => p.pos === sq.id);
          return (
            <div
              key={sq.id}
              onMouseEnter={() => setHovered(sq.id)}
              onMouseLeave={() => setHovered(null)}
              className={`relative bg-gradient-to-br from-white/3 to-white/2 rounded-lg p-3 min-h-[100px] flex flex-col justify-between border ${
                hovered === sq.id ? 'border-yellow-300 scale-[1.01]' : 'border-white/6'
              } transition-transform`}
            >
              <div className="flex items-start justify-between">
                <div className="flex items-center gap-2">
                  <div className="text-lg">{sq.icon ?? '✦'}</div>
                  <div className="text-sm font-medium">{sq.name}</div>
                </div>

                {sq.effect && (
                  <div className="text-xs px-2 py-1 rounded-md bg-white/6 border border-white/10">
                    {sq.effect.type}
                  </div>
                )}
              </div>

              {/* 駒表示: 同一マスに複数駒があるときは小さく並べる */}
              <div className="flex gap-2 items-end justify-start flex-wrap mt-2">
                {playersOnSquare.map((p) => (
                  <div
                    key={p.id}
                    className={`flex items-center justify-center text-xs font-semibold w-9 h-9 rounded-full shadow-md border-2 select-none ${
                      currentPlayerId === p.id ? 'ring-2 ring-white/60' : ''
                    }`}
                    style={{ background: p.color ?? '#7c3aed', color: '#fff' }}
                    title={p.name + (p.isPC ? ' (PC)' : '')}
                  >
                    {p.name.slice(0, 2)}
                  </div>
                ))}
              </div>

              {/* ホバーツールチップ（簡易） */}
              {hovered === sq.id && sq.effect && (
                <div className="absolute z-40" style={{ top: -8, right: -8 }}>
                  <div className="max-w-xs rounded-md p-2 text-sm shadow-lg bg-white text-slate-900 border border-slate-200">
                    <div className="font-semibold">{sq.effect.type}</div>
                    {sq.effect.desc && <div className="text-xs mt-1 text-slate-600">{sq.effect.desc}</div>}
                  </div>
                </div>
              )}
            </div>
          );
        })}
      </div>
    </div>
  );
}
