'use client';

import { useState, useCallback } from 'react';
import { GameEvent, getRandomEvent, rollDice } from '@/lib/utils';

export interface Player {
  id: number;
  name: string;
  position: number;
  color: string;
}

export interface GameState {
  players: Player[];
  currentPlayerIndex: number;
  isGameOver: boolean;
  winner: Player | null;
  diceValue: number;
  isRolling: boolean;
  lastEvent: GameEvent | null;
}

const BOARD_SIZE = 30;
const INITIAL_PLAYERS: Player[] = [
  { id: 1, name: 'プレイヤー1', position: 0, color: 'bg-blue-500' },
  { id: 2, name: 'プレイヤー2', position: 0, color: 'bg-red-500' },
];

export const useGameState = () => {
  const [gameState, setGameState] = useState<GameState>({
    players: INITIAL_PLAYERS,
    currentPlayerIndex: 0,
    isGameOver: false,
    winner: null,
    diceValue: 1,
    isRolling: false,
    lastEvent: null,
  });

  const rollDiceAction = useCallback(async (): Promise<void> => {
    if (gameState.isRolling || gameState.isGameOver) return;

    setGameState((prev) => ({ ...prev, isRolling: true }));

    // サイコロアニメーション
    for (let i = 0; i < 10; i++) {
      setGameState((prev) => ({ ...prev, diceValue: rollDice() }));
      await new Promise<void>((resolve) => setTimeout(resolve, 100));
    }

    const finalDiceValue = rollDice();
    const currentPlayer = gameState.players[gameState.currentPlayerIndex];
    const event = getRandomEvent();
    const totalMove = finalDiceValue + event.value;
    const newPosition = Math.min(
      currentPlayer.position + Math.max(totalMove, 1),
      BOARD_SIZE - 1
    );

    setGameState((prev) => {
      const newPlayers = prev.players.map((player) =>
        player.id === currentPlayer.id
          ? { ...player, position: newPosition }
          : player
      );

      const isWinner = newPosition >= BOARD_SIZE - 1;
      const nextPlayerIndex = isWinner
        ? prev.currentPlayerIndex
        : (prev.currentPlayerIndex + 1) % prev.players.length;

      return {
        ...prev,
        players: newPlayers,
        currentPlayerIndex: nextPlayerIndex,
        diceValue: finalDiceValue,
        isRolling: false,
        isGameOver: isWinner,
        winner: isWinner ? currentPlayer : null,
        lastEvent: event,
      };
    });
  }, [gameState.isRolling, gameState.isGameOver, gameState.currentPlayerIndex, gameState.players]);

  const resetGame = useCallback((): void => {
    setGameState({
      players: INITIAL_PLAYERS,
      currentPlayerIndex: 0,
      isGameOver: false,
      winner: null,
      diceValue: 1,
      isRolling: false,
      lastEvent: null,
    });
  }, []);

  return {
    gameState,
    rollDice: rollDiceAction,
    resetGame,
    BOARD_SIZE,
  };
};
