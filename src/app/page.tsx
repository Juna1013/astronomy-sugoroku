'use client';
import React, { useState } from 'react';
import Dashboard from '../../src/components/Dashboard';
import GameBoard from '../../src/components/GameBoard';
import DiceRoller from '../../src/components/DiceRoller'; // 🎲 追加

const demoSquares = Array.from({ length: 24 }).map((_, i) => ({
  id: i,
  name: `マス ${i + 1}`,
  icon: ['☀️', '🪐', '⭐️', '🌙'][i % 4],
  effect:
    i % 5 === 0
      ? { type: 'bonus', desc: 'コインを2枚もらう' }
      : i % 7 === 0
      ? { type: 'move', value: 2, desc: '2マス進む' }
      : undefined,
}));

const demoPlayers = [
  { id: 1, name: 'A', pos: 0, color: '#ef4444' },
  { id: 2, name: 'B', pos: 3, color: '#10b981' },
];

export default function Page() {
  const [started, setStarted] = useState(false);
  const [players, setPlayers] = useState(demoPlayers);

  // 🎲 サイコロを振ったときの処理
  const handleRoll = (value: number) => {
    setPlayers((prev) =>
      prev.map((p, i) =>
        i === 0 // いまはプレイヤー1だけ動かす
          ? { ...p, pos: (p.pos + value) % demoSquares.length }
          : p
      )
    );
  };

  return (
    <div>
      {!started ? (
        <Dashboard
          onStart={() => setStarted(true)}
          onOpenSettings={() => alert('設定ダイアログを作ってください')}
        />
      ) : (
        <div className="min-h-screen bg-gradient-to-b from-slate-900 to-slate-800 text-white">
          <div className="container mx-auto py-8">
            <div className="flex items-center justify-between mb-6">
              <h2 className="text-2xl font-bold">ゲーム画面</h2>
              <button
                onClick={() => setStarted(false)}
                className="text-sm text-white/80 underline"
              >
                Return to Dashboard
              </button>
            </div>

            <GameBoard squares={demoSquares} players={players} started={started} />

            {/* 🎲 サイコロ */}
            <DiceRoller onRoll={handleRoll} />
          </div>
        </div>
      )}
    </div>
  );
}
