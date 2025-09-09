'use client';
import React from 'react';
import Dashboard from '@/components/Dashboard';
import GameBoard from '@/components/GameBoard';
import GameHeader from '@/components/GameHeader';
import GameOverModal from '@/components/GameOverModal';
import SquareEffectPopup from '@/components/SquareEffectPopup';
import DiceResultEffect from '@/components/DiceResultEffect';
import RestEffect from '@/components/RestEffect';
import { useGameState } from '@/hooks/useGameState';

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

      <SquareEffectPopup
        square={popupState.square}
        playerName={popupState.playerName}
        show={popupState.show}
        onClose={hideSquarePopup}
      />

      <DiceResultEffect
        diceValue={diceResultState.value}
        show={diceResultState.show}
        playerName={diceResultState.playerName}
      />

      <RestEffect
        show={restEffectState.show}
        playerName={restEffectState.playerName}
        restTurns={restEffectState.restTurns}
        restReason={restEffectState.restReason}
      />

      <GameOverModal
        winner={gameState.winner}
        onReturn={handleReturn}
        onPlayAgain={handlePlayAgain}
      />
    </div>
  );
}
