'use client';
import React, { Suspense, lazy } from 'react';
import Dashboard from '@/components/Dashboard';
import GameBoard from '@/components/GameBoard';
import GameHeader from '@/components/GameHeader';
import { useGameState, DifficultyLevel } from '@/hooks/useGameState';

// Heavy components を lazy load
const GameOverModal = lazy(() => import('@/components/GameOverModal'));
const SquareEffectPopup = lazy(() => import('@/components/SquareEffectPopup'));
const DiceResultEffect = lazy(() => import('@/components/DiceResultEffect'));
const RestEffect = lazy(() => import('@/components/RestEffect'));

export default function Page() {
  const {
    gameState,
    popupState,
    diceResultState,
    restEffectState,
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
          diceValue={gameState.diceValue}
          isRolling={gameState.isRolling}
        />

        <GameBoard
          squares={demoSquares}
          players={gameState.players}
          started={gameState.started}
          currentPlayerId={gameState.players[gameState.currentPlayerIndex]?.id}
        />
      </div>

      <Suspense fallback={null}>
        <SquareEffectPopup
          square={popupState.square}
          playerName={popupState.playerName}
          show={popupState.show}
          onClose={hideSquarePopup}
        />
      </Suspense>

      <Suspense fallback={null}>
        <DiceResultEffect
          diceValue={diceResultState.value}
          show={diceResultState.show}
          playerName={diceResultState.playerName}
        />
      </Suspense>

      <Suspense fallback={null}>
        <RestEffect
          show={restEffectState.show}
          playerName={restEffectState.playerName}
          restTurns={restEffectState.restTurns}
          restReason={restEffectState.restReason}
        />
      </Suspense>

      <Suspense fallback={null}>
        <GameOverModal
          winner={gameState.winner}
          onReturn={handleReturn}
          onPlayAgain={handlePlayAgain}
        />
      </Suspense>
    </div>
  );
}
