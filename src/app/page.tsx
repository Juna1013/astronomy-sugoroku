'use client';
import React from 'react';
import Dashboard from '@/components/Dashboard';
import GameBoard from '@/components/GameBoard';
import GameHeader from '@/components/GameHeader';
import GameOverModal from '@/components/GameOverModal';
import { useGameState } from '@/hooks/useGameState';

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
    return (
      <div className="min-h-screen relative">
        <Dashboard 
          onStart={handleStart} 
          onOpenSettings={() => alert('設定ダイアログ（開発中）')} 
        />
      </div>
    );
  }

  return (
    <div className="min-h-screen relative">
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
