'use client';

import { useState, useEffect, useCallback } from 'react';
import { Player, Square } from '../types';
import demoSquares from '../data/squares.json';

// This is a placeholder for the actual event type from utils
export type GameEvent = { type: string; message: string; value: number };

// Re-defining GameState as expected by GameControls
export interface GameState {
  players: Player[];
  currentPlayerIndex: number;
  isGameOver: boolean;
  winner: Player | null;
  diceValue: number;
  isRolling: boolean;
  lastEvent: GameEvent | null;
  started: boolean;
}

export const useGameState = () => {
  const [started, setStarted] = useState(false);
  const [isPCMode, setIsPCMode] = useState(false);
  const [players, setPlayers] = useState<Player[]>([]);
  const [currentPlayerIdx, setCurrentPlayerIdx] = useState(0);
  const [diceDisabled, setDiceDisabled] = useState(false);
  const [gameEnded, setGameEnded] = useState(false);
  const [winner, setWinner] = useState<Player | null>(null);
  const [diceValue, setDiceValue] = useState(1);
  const [isRolling, setIsRolling] = useState(false);
  const [lastEvent, setLastEvent] = useState<GameEvent | null>(null);

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

  const endGame = useCallback((winnerPlayer: Player) => {
    setWinner(winnerPlayer);
    setGameEnded(true);
    setDiceDisabled(true);
  }, []);

  const checkGoal = useCallback((pl: Player[]) => {
    const w = pl.find((p) => p.pos >= lastIndex);
    return w ?? null;
  }, [lastIndex]);

  const movePlayerBy = useCallback((pl: Player[], idx: number, steps: number) => {
    const next = pl.map((p) => ({ ...p }));
    next[idx].pos = Math.min(next[idx].pos + steps, lastIndex);
    return next;
  }, [lastIndex]);

  const applySquareEffectSync = useCallback((plSnapshot: Player[], playerIdx: number) => {
    const player = plSnapshot[playerIdx];
    const sq = demoSquares[player.pos];
    let nextPlayers = plSnapshot.map((p) => ({ ...p }));

    if (sq.effect?.type === 'move' && typeof sq.effect.value === 'number') {
      nextPlayers[playerIdx].pos = Math.min(nextPlayers[playerIdx].pos + sq.effect.value, lastIndex);
    }
    return nextPlayers;
  }, [lastIndex]);

  const handleStart = useCallback((pcMode: boolean = false) => {
    setIsPCMode(pcMode);
    const initial = initPlayers(pcMode);
    setPlayers(initial);
    setCurrentPlayerIdx(0);
    setStarted(true);
    setDiceDisabled(false);
    setGameEnded(false);
    setWinner(null);
  }, []);

  const handleRoll = useCallback(() => {
    if (diceDisabled || gameEnded || !started) return;

    const value = Math.floor(Math.random() * 6) + 1;
    setDiceValue(value);
    setDiceDisabled(true);
    setIsRolling(true);

    // Short delay to show dice animation
    setTimeout(() => {
      setIsRolling(false);

      const snapshot = players.map((p) => ({ ...p }));
      const moved = movePlayerBy(snapshot, currentPlayerIdx, value);
      setPlayers(moved);

      const maybeWinner = checkGoal(moved);
      if (maybeWinner) {
        endGame(maybeWinner);
        return;
      }

      const afterEffect = applySquareEffectSync(moved, currentPlayerIdx);
      setPlayers(afterEffect);

      const maybeWinner2 = checkGoal(afterEffect);
      if (maybeWinner2) {
        endGame(maybeWinner2);
        return;
      }

      const nextIdx = (currentPlayerIdx + 1) % afterEffect.length;
      setCurrentPlayerIdx(nextIdx);

      if (afterEffect[nextIdx]?.isPC) {
        setTimeout(() => {
          if (gameEnded) return;
          setDiceDisabled(true);
          const pcRoll = Math.floor(Math.random() * 6) + 1;
          setDiceValue(pcRoll);
          setPlayers((prevPlayers) => {
            const snapped = prevPlayers.map((p) => ({ ...p }));
            const afterPc = movePlayerBy(snapped, nextIdx, pcRoll);
            const w = checkGoal(afterPc);
            if (w) {
              setPlayers(afterPc);
              endGame(w);
              return afterPc;
            }

            const afterPcEffect = applySquareEffectSync(afterPc, nextIdx);
            const w2 = checkGoal(afterPcEffect);
            setPlayers(afterPcEffect);
            if (w2) {
              endGame(w2);
              return afterPcEffect;
            }

            const following = (nextIdx + 1) % afterPcEffect.length;
            setCurrentPlayerIdx(following);
            setDiceDisabled(false);
            return afterPcEffect;
          });
        }, 800);
      } else {
        setTimeout(() => {
          if (!gameEnded) setDiceDisabled(false);
        }, 250);
      }
    }, 500); // Corresponds to dice animation
  }, [diceDisabled, gameEnded, started, players, currentPlayerIdx, movePlayerBy, checkGoal, endGame, applySquareEffectSync]);

  const handleReturn = useCallback(() => {
    setStarted(false);
    setPlayers([]);
    setCurrentPlayerIdx(0);
    setGameEnded(false);
    setWinner(null);
    setDiceDisabled(false);
  }, []);

  const handlePlayAgain = useCallback(() => {
    handleStart(isPCMode);
  }, [handleStart, isPCMode]);

  useEffect(() => {
    if (!started || gameEnded || players.length === 0 || !players[0].isPC) return;

    setDiceDisabled(true);
    setTimeout(() => {
      if (gameEnded) return;
      const pcRoll = Math.floor(Math.random() * 6) + 1;
      setDiceValue(pcRoll);
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
        setCurrentPlayerIdx(1 % afterPcEffect.length);
        setDiceDisabled(false);
        return afterPcEffect;
      });
    }, 800);
  }, [started, gameEnded, players, movePlayerBy, checkGoal, endGame, applySquareEffectSync]);

  const gameState: GameState = {
    players,
    currentPlayerIndex: currentPlayerIdx,
    isGameOver: gameEnded,
    winner,
    diceValue,
    isRolling,
    lastEvent,
    started,
  };

  return {
    gameState,
    demoSquares,
    handleStart,
    handleRoll, // Now parameter-less
    handleReturn,
    handlePlayAgain,
    resetGame: handleReturn,
  };
};