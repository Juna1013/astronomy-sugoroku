// src/app/page.tsx の更新版
'use client';
import React from 'react';
import Dashboard from '@/components/Dashboard';
import GameBoard from '@/components/GameBoard';
import GameHeader from '@/components/GameHeader';
import GameOverModal from '@/components/GameOverModal';
import SquareEffectPopup from '@/components/SquareEffectPopup';
import { useGameState } from '@/hooks/useGameState';

export default function Page() {
  const {
    gameState,
    popupState,
    demoSquares,
    handleStart,
    handleRoll,
    handleReturn,
    handlePlayAgain,
    hideSquarePopup,
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
      <div className="container mx-auto py-3 sm:py-6 px-2 sm:px-4">
        <GameHeader
          currentPlayer={gameState.players[gameState.currentPlayerIndex]}
          onRoll={handleRoll}
          diceDisabled={gameState.isRolling || !gameState.started || popupState.show}
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

      <SquareEffectPopup
        square={popupState.square}
        playerName={popupState.playerName}
        show={popupState.show}
        onClose={hideSquarePopup}
      />

      <GameOverModal
        winner={gameState.winner}
        onReturn={handleReturn}
        onPlayAgain={handlePlayAgain}
      />
    </div>
  );
}
