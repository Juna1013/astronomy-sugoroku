'use client';

import { useState, useEffect, useCallback } from 'react';
import { Player, Square } from '../types';
import demoSquares from '../data/squares.json';

export type GameEvent = { type: string; message: string; value: number };

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

  const initPlayers = (pcMode: boolean): Player[] => {
    if (pcMode) {
      return [
        { id: 1, name: 'あなた', pos: 0, color: '#ef4444', isPC: false },
        { id: 2, name: 'AI', pos: 0, color: '#3b82f6', isPC: true },
      ];
    } else {
      return [
        { id: 1, name: 'プレイヤー1', pos: 0, color: '#ef4444', isPC: false },
        { id: 2, name: 'プレイヤー2', pos: 0, color: '#10b981', isPC: false },
      ];
    }
  };

  const endGame = useCallback((winnerPlayer: Player) => {
    setWinner(winnerPlayer);
    setGameEnded(true);
    setDiceDisabled(true);
    setIsRolling(false);
  }, []);

  const checkGoal = useCallback((pl: Player[]) => {
    const w = pl.find((p) => p.pos >= lastIndex);
    return w ?? null;
  }, [lastIndex]);

  const movePlayerBy = useCallback((pl: Player[], idx: number, steps: number): Player[] => {
    const next = pl.map((p) => ({ ...p }));
    next[idx].pos = Math.max(0, Math.min(next[idx].pos + steps, lastIndex));
    return next;
  }, [lastIndex]);

  const applySquareEffect = useCallback((plSnapshot: Player[], playerIdx: number): Player[] => {
    const player = plSnapshot[playerIdx];
    const sq = demoSquares[player.pos] as Square;
    const nextPlayers = plSnapshot.map((p) => ({ ...p }));

    if (sq.effect?.type === 'move' && typeof sq.effect.value === 'number') {
      nextPlayers[playerIdx].pos = Math.max(0, Math.min(nextPlayers[playerIdx].pos + sq.effect.value, lastIndex));
      
      // Set event for UI feedback
      setLastEvent({
        type: sq.effect.value > 0 ? 'bonus' : 'penalty',
        message: sq.effect.desc || `${sq.effect.value > 0 ? '+' : ''}${sq.effect.value} マス移動`,
        value: sq.effect.value
      });
    } else if (sq.effect?.type === 'bonus') {
      setLastEvent({
        type: 'bonus',
        message: sq.effect.desc || 'ボーナス効果発動！',
        value: 0
      });
    } else if (sq.effect?.type === 'penalty') {
      setLastEvent({
        type: 'penalty',
        message: sq.effect.desc || 'ペナルティ効果発動',
        value: 0
      });
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
    setLastEvent(null);
    setDiceValue(1);
    setIsRolling(false);
  }, []);

  const processPlayerTurn = useCallback(async (playerIndex: number, rollValue: number) => {
    return new Promise<void>((resolve) => {
      setPlayers(prevPlayers => {
        const snapshot = prevPlayers.map(p => ({ ...p }));
        const moved = movePlayerBy(snapshot, playerIndex, rollValue);
        
        const maybeWinner = checkGoal(moved);
        if (maybeWinner) {
          setPlayers(moved);
          endGame(maybeWinner);
          resolve();
          return moved;
        }

        const afterEffect = applySquareEffect(moved, playerIndex);
        setPlayers(afterEffect);

        const finalWinner = checkGoal(afterEffect);
        if (finalWinner) {
          endGame(finalWinner);
          resolve();
          return afterEffect;
        }

        setTimeout(() => {
          const nextIdx = (playerIndex + 1) % afterEffect.length;
          setCurrentPlayerIdx(nextIdx);
          setDiceDisabled(false);
          resolve();
        }, 1000);

        return afterEffect;
      });
    });
  }, [movePlayerBy, checkGoal, endGame, applySquareEffect]);

  const handleRoll = useCallback(async () => {
    if (diceDisabled || gameEnded || !started) return;

    const rollValue = Math.floor(Math.random() * 6) + 1;
    setDiceValue(rollValue);
    setDiceDisabled(true);
    setIsRolling(true);
    setLastEvent(null);

    // Dice animation delay
    setTimeout(async () => {
      setIsRolling(false);
      await processPlayerTurn(currentPlayerIdx, rollValue);
    }, 800);
  }, [diceDisabled, gameEnded, started, currentPlayerIdx, processPlayerTurn]);

  const handleReturn = useCallback(() => {
    setStarted(false);
    setPlayers([]);
    setCurrentPlayerIdx(0);
    setGameEnded(false);
    setWinner(null);
    setDiceDisabled(false);
    setLastEvent(null);
    setDiceValue(1);
    setIsRolling(false);
  }, []);

  const handlePlayAgain = useCallback(() => {
    handleStart(isPCMode);
  }, [handleStart, isPCMode]);

  // PC Player turn handling
  useEffect(() => {
    if (!started || gameEnded || players.length === 0) return;
    
    const currentPlayer = players[currentPlayerIdx];
    if (!currentPlayer?.isPC || diceDisabled) return;

    const pcTurnTimeout = setTimeout(async () => {
      const pcRoll = Math.floor(Math.random() * 6) + 1;
      setDiceValue(pcRoll);
      setDiceDisabled(true);
      setIsRolling(true);

      setTimeout(async () => {
        setIsRolling(false);
        await processPlayerTurn(currentPlayerIdx, pcRoll);
      }, 1200);
    }, 1500);

    return () => clearTimeout(pcTurnTimeout);
  }, [started, gameEnded, players, currentPlayerIdx, diceDisabled, processPlayerTurn]);

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
    demoSquares: demoSquares as Square[],
    handleStart,
    handleRoll,
    handleReturn,
    handlePlayAgain,
    resetGame: handleReturn,
  };
};
