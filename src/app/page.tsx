'use client';
import React from 'react';
import Dashboard from '../../src/components/Dashboard';
import GameBoard from '../../src/components/GameBoard';
import GameHeader from '../../src/components/GameHeader';
import GameOverModal from '../../src/components/GameOverModal';
import { useGameState } from '../../src/hooks/useGameState';

export default function Page() {
  const {
    gameState,
    demoSquares,
    handleStart,
    handleRoll,
    handleReturn,
    handlePlayAgain,
  } = useGameState();

  if (!gameState.started) {
    return <Dashboard onStart={handleStart} onOpenSettings={() => alert('設定ダイアログ')} />;
  }

  return (
    <div className="min-h-screen bg-white dark:bg-gradient-to-b dark:from-slate-900 dark:to-slate-800 text-black dark:text-white">
      <div className="container mx-auto py-6 px-4">
        <GameHeader
          currentPlayer={gameState.players[gameState.currentPlayerIndex]}
          onRoll={handleRoll}
          diceDisabled={gameState.isRolling || !gameState.started}
          onReturn={handleReturn}
          gameEnded={gameState.isGameOver}
        />

        <GameBoard
          squares={demoSquares}
          players={gameState.players}
          started={gameState.started}
          currentPlayerId={gameState.players[gameState.currentPlayerIndex]?.id}
        />
      </div>

      <GameOverModal
        winner={gameState.winner}
        onReturn={handleReturn}
        onPlayAgain={handlePlayAgain}
      />
    </div>
  );
}
