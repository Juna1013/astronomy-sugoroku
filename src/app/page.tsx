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
  const [players, setPlayers] = useState<Player[]>([]);
  const [currentPlayerIdx, setCurrentPlayerIdx] = useState(0);
  const [diceDisabled, setDiceDisabled] = useState(false);

  // game ended & winner
  const [gameEnded, setGameEnded] = useState(false);
  const [winner, setWinner] = useState<Player | null>(null);

  const lastIndex = demoSquares.length - 1;

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

  const handleStart = (pcMode: boolean = false) => {
    setIsPCMode(pcMode);
    const initial = initPlayers(pcMode);
    setPlayers(initial);
    setCurrentPlayerIdx(0);
    setStarted(true);
    setDiceDisabled(false);
    setGameEnded(false);
    setWinner(null);
  };

  // Check if any player is on goal tile; return winner Player or null
  const checkGoal = (pl: Player[]) => {
    const w = pl.find((p) => p.pos >= lastIndex);
    return w ?? null;
  };

  // Move player by steps, return new players array
  const movePlayerBy = (pl: Player[], idx: number, steps: number) => {
    const next = pl.map((p) => ({ ...p }));
    next[idx].pos = Math.min(next[idx].pos + steps, lastIndex); // don't wrap; reaching last ends game
    return next;
  };

  // Apply square effect for a player index (synchronously, using a snapshot players array)
  const applySquareEffectSync = (plSnapshot: Player[], playerIdx: number) => {
    const player = plSnapshot[playerIdx];
    const sq = demoSquares[player.pos];
    let nextPlayers = plSnapshot.map((p) => ({ ...p }));

    if (sq.effect?.type === 'move' && typeof sq.effect.value === 'number') {
      nextPlayers[playerIdx].pos = Math.min(nextPlayers[playerIdx].pos + sq.effect.value, lastIndex);
    }
    // (拡張) 他の effect.types の処理をここに追加可能

    return nextPlayers;
  };

  // When a roll occurs
  const handleRoll = (value: number) => {
    if (diceDisabled || gameEnded || !started) return;

    setDiceDisabled(true);

    // compute next players immediately from current state snapshot
    const snapshot = players.map((p) => ({ ...p }));
    const moved = movePlayerBy(snapshot, currentPlayerIdx, value);
    setPlayers(moved);

    // check goal immediately
    const maybeWinner = checkGoal(moved);
    if (maybeWinner) {
      endGame(maybeWinner);
      return;
    }

    // apply square effect synchronously (could move further)
    const afterEffect = applySquareEffectSync(moved, currentPlayerIdx);
    setPlayers(afterEffect);

    // check goal again after effect
    const maybeWinner2 = checkGoal(afterEffect);
    if (maybeWinner2) {
      endGame(maybeWinner2);
      return;
    }

    // advance to next player
    const nextIdx = (currentPlayerIdx + 1) % afterEffect.length;
    setCurrentPlayerIdx(nextIdx);

    // if next player is PC, schedule PC move
    if (afterEffect[nextIdx]?.isPC) {
      setTimeout(() => {
        if (gameEnded) return;
        setDiceDisabled(true);
        const pcRoll = Math.floor(Math.random() * 6) + 1;
        // snapshot from latest players state
        setPlayers((prevPlayers) => {
          const snapped = prevPlayers.map((p) => ({ ...p }));
          const afterPc = movePlayerBy(snapped, nextIdx, pcRoll);
          // check PC goal immediately
          const w = checkGoal(afterPc);
          if (w) {
            // apply and end game
            setPlayers(afterPc);
            endGame(w);
            return afterPc;
          }

          // apply PC's square effects
          const afterPcEffect = applySquareEffectSync(afterPc, nextIdx);
          const w2 = checkGoal(afterPcEffect);
          setPlayers(afterPcEffect);
          if (w2) {
            endGame(w2);
            return afterPcEffect;
          }

          // next turn returns to following player
          const following = (nextIdx + 1) % afterPcEffect.length;
          setCurrentPlayerIdx(following);
          setDiceDisabled(false);
          return afterPcEffect;
        });
      }, 800);
    } else {
      // human next turn: enable dice
      setTimeout(() => {
        if (!gameEnded) setDiceDisabled(false);
      }, 250);
    }
  };

  const endGame = (winnerPlayer: Player) => {
    setWinner(winnerPlayer);
    setGameEnded(true);
    setDiceDisabled(true);
    // keep started true so the board stays visible; show modal/banner to user
  };

  const handleReturn = () => {
    // reset everything and go back to dashboard
    setStarted(false);
    setPlayers([]);
    setCurrentPlayerIdx(0);
    setGameEnded(false);
    setWinner(null);
    setDiceDisabled(false);
  };

  const handlePlayAgain = () => {
    // re-start same mode
    handleStart(isPCMode);
  };

  // If the game just started and the first player is PC, trigger its automatic move
  useEffect(() => {
    if (!started) return;
    if (players.length > 0 && players[0].isPC && !gameEnded) {
      // slight delay so UI shows up
      setDiceDisabled(true);
      setTimeout(() => {
        if (gameEnded) return;
        const pcRoll = Math.floor(Math.random() * 6) + 1;
        setPlayers((prevPlayers) => {
          const snapped = prevPlayers.map((p) => ({ ...p }));
          const afterPc = movePlayerBy(snapped, 0, pcRoll);
          const w = checkGoal(afterPc);
          if (w) {
            setPlayers(afterPc);
            endGame(w);
            return afterPc;
          }
          const afterPcEffect = applySquareEffectSync(afterPc, 0);
          const w2 = checkGoal(afterPcEffect);
          setPlayers(afterPcEffect);
          if (w2) {
            endGame(w2);
            return afterPcEffect;
          }
          // next to human
          setCurrentPlayerIdx(1 % afterPcEffect.length);
          setDiceDisabled(false);
          return afterPcEffect;
        });
      }, 800);
    }
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [started]);

  // Top header: title / turn / Return button / DiceRoller aligned
  return (
    <div>
      {!started ? (
        <Dashboard onStart={handleStart} onOpenSettings={() => alert('設定ダイアログ')} />
      ) : (
        <div className="min-h-screen bg-gradient-to-b from-slate-900 to-slate-800 text-white">
          <div className="container mx-auto py-6 px-4">
            {/* Top bar: title + controls */}
            <div className="flex flex-col md:flex-row md:items-center justify-between gap-3 mb-4">
              <div className="flex items-center gap-4">
                <h2 className="text-xl md:text-2xl font-bold">ゲーム画面</h2>
                <div className="text-sm text-white/80">
                  Turn: <span className="font-semibold">{players[currentPlayerIdx]?.name ?? '—'}</span>
                </div>
              </div>

              <div className="flex items-center gap-3">
                {/* DiceRoller is shown in header; disabled state reflects whose turn it is */}
                <div>
                  <DiceRoller
                    onRoll={handleRoll}
                    disabled={(players[currentPlayerIdx]?.isPC ?? false) || diceDisabled || gameEnded}
                    label={players[currentPlayerIdx]?.isPC ? `${players[currentPlayerIdx]?.name} のターン` : '🎲 Roll Dice'}
                  />
                </div>

                <button
                  onClick={handleReturn}
                  className="px-4 py-2 bg-red-500 hover:bg-red-600 text-white rounded-lg shadow hidden sm:inline-block"
                >
                  ホームに戻る
                </button>

                {/* On very small screens, show a compact return button */}
                <button
                  onClick={handleReturn}
                  className="px-3 py-2 bg-red-500 hover:bg-red-600 text-white rounded-lg shadow sm:hidden"
                >
                  戻る
                </button>
              </div>
            </div>

            {/* Board */}
            <GameBoard
              squares={demoSquares}
              players={players}
              started={started}
              currentPlayerId={players[currentPlayerIdx]?.id}
            />
          </div>

          {/* Game over overlay/modal */}
          {gameEnded && winner && (
            <div className="fixed inset-0 z-50 flex items-center justify-center bg-black/50">
              <div className="bg-white/5 backdrop-blur-md border border-white/20 rounded-xl p-6 w-[90%] max-w-lg text-center">
                <h3 className="text-2xl font-bold mb-2 text-white">ゲーム終了 🎉</h3>
                <p className="text-white/90 mb-4">{winner.name} がゴールしました！</p>

                <div className="flex items-center justify-center gap-3">
                  <button
                    onClick={handleReturn}
                    className="px-4 py-2 bg-red-500 hover:bg-red-600 text-white rounded-lg shadow"
                  >
                    ホームに戻る
                  </button>

                  <button
                    onClick={handlePlayAgain}
                    className="px-4 py-2 bg-green-500 hover:bg-green-600 text-white rounded-lg shadow"
                  >
                    もう一度遊ぶ
                  </button>
                </div>
              </div>
            </div>
          )}
        </div>
      )}
    </div>
  );
}
