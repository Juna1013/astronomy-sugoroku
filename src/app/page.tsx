'use client';
import React, { useEffect, useState } from 'react';
import Dashboard from '../../src/components/Dashboard';
import GameBoard from '../../src/components/GameBoard';
import DiceRoller from '../../src/components/DiceRoller';

type Square = {
  id: number;
  name: string;
  icon?: string;
  effect?: { type: string; value?: number; desc?: string };
};

type Player = {
  id: number;
  name: string;
  pos: number;
  color?: string;
  isPC?: boolean;
};

const demoSquares: Square[] = Array.from({ length: 24 }).map((_, i) => ({
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

export default function Page() {
  const [started, setStarted] = useState(false);
  const [isPCMode, setIsPCMode] = useState(false);

  // players は開始時に初期化する
  const [players, setPlayers] = useState<Player[]>([]);
  const [currentPlayerIdx, setCurrentPlayerIdx] = useState(0);
  const [diceDisabled, setDiceDisabled] = useState(false);

  // モード選択で初期プレイヤー配列を作る
  const initPlayers = (pcMode: boolean) => {
    if (pcMode) {
      return [
        { id: 1, name: 'You', pos: 0, color: '#ef4444', isPC: false },
        { id: 2, name: 'PC', pos: 0, color: '#3b82f6', isPC: true },
      ];
    } else {
      return [
        { id: 1, name: 'A', pos: 0, color: '#ef4444', isPC: false },
        { id: 2, name: 'B', pos: 3, color: '#10b981', isPC: false },
      ];
    }
  };

  // Dashboard の Start ボタンの onStart で呼ばれる
  const handleStart = (pcMode: boolean = false) => {
    setIsPCMode(pcMode);
    setPlayers(initPlayers(pcMode));
    setCurrentPlayerIdx(0);
    setStarted(true);
    setDiceDisabled(false);
  };

  // サイコロを振ったときの一般処理：value を受け取り現在のプレイヤーを進める
  const handleRoll = (value: number) => {
    setDiceDisabled(true); // 連打防止
    setPlayers((prev) => {
      const next = [...prev];
      const p = { ...next[currentPlayerIdx] };
      p.pos = (p.pos + value) % demoSquares.length;
      next[currentPlayerIdx] = p;
      return next;
    });

    // マス効果（シンプル実装）：移動後に effect に応じた追加移動（例）
    setTimeout(() => {
      applySquareEffect(currentPlayerIdx);
    }, 250);

    // ターンを次に回す処理は applySquareEffect の中か、ここで行う（簡易的に遅延して次へ）
  };

  // マス効果を適用して次ターンへ（単純化）
  const applySquareEffect = (playerIdx: number) => {
    const p = players[playerIdx];
    const square = demoSquares[p.pos];
    if (square.effect?.type === 'move' && square.effect.value) {
      // 例: 強制移動
      setPlayers((prev) => {
        const next = [...prev];
        const pp = { ...next[playerIdx] };
        pp.pos = (pp.pos + (square.effect?.value ?? 0)) % demoSquares.length;
        next[playerIdx] = pp;
        return next;
      });
    }

    // 次ターンへ
    setTimeout(() => {
      const nextIdx = (playerIdx + 1) % players.length;
      setCurrentPlayerIdx(nextIdx);
      setDiceDisabled(false);

      // PC の番なら自動で振らせる
      if (players[nextIdx]?.isPC) {
        // 少し待ってから振る
        setDiceDisabled(true);
        setTimeout(() => {
          const pcRoll = Math.floor(Math.random() * 6) + 1;
          // advance PC
          setPlayers((prev) => {
            const next = [...prev];
            const pp = { ...next[nextIdx] };
            pp.pos = (pp.pos + pcRoll) % demoSquares.length;
            next[nextIdx] = pp;
            return next;
          });
          // apply PC's square effects, then back to human
          setTimeout(() => {
            applySquareEffect(nextIdx);
          }, 400);
        }, 800);
      }
    }, 300);
  };

  // Return ボタン（ダッシュボードへ戻る）
  const handleReturn = () => {
    setStarted(false);
    setPlayers([]);
  };

  // If started becomes true and first player is PC, kick off PC move automatically
  useEffect(() => {
    if (!started) return;
    if (players.length > 0 && players[0].isPC) {
      // start with PC move
      setDiceDisabled(true);
      setTimeout(() => {
        const pcRoll = Math.floor(Math.random() * 6) + 1;
        setPlayers((prev) => {
          const next = [...prev];
          next[0] = { ...next[0], pos: (next[0].pos + pcRoll) % demoSquares.length };
          return next;
        });
        setTimeout(() => applySquareEffect(0), 300);
      }, 800);
    }
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [started, players.length]);

  return (
    <div>
      {!started ? (
        <Dashboard onStart={handleStart} onOpenSettings={() => alert('設定ダイアログ')} />
      ) : (
        <div className="min-h-screen bg-gradient-to-b from-slate-900 to-slate-800 text-white">
          <div className="container mx-auto py-8 px-4">
            <div className="flex flex-col md:flex-row items-start md:items-center justify-between mb-6 gap-4">
              <h2 className="text-xl md:text-2xl font-bold">ゲーム画面</h2>

              <div className="flex items-center gap-3">
                <div className="text-sm text-white/80">
                  Turn: <span className="font-semibold">{players[currentPlayerIdx]?.name}</span>
                </div>

                <button
                  onClick={handleReturn}
                  className="px-4 py-2 bg-red-500 hover:bg-red-600 text-white rounded-lg shadow"
                >
                  Return to Dashboard
                </button>
              </div>
            </div>

            <GameBoard
              squares={demoSquares}
              players={players}
              started={started}
              currentPlayerId={players[currentPlayerIdx]?.id}
            />

            {/* Dice area: disable if it's PC's turn */}
            <div className="mt-6 flex flex-col items-center">
              <DiceRoller
                onRoll={handleRoll}
                disabled={(players[currentPlayerIdx]?.isPC ?? false) || diceDisabled}
                label={players[currentPlayerIdx]?.isPC ? `${players[currentPlayerIdx]?.name} のターン` : '🎲 Roll Dice'}
              />
            </div>
          </div>
        </div>
      )}
    </div>
  );
}
