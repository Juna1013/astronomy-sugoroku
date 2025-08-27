'use client';

import React from 'react';
import GameBoard from '@/components/GameBoard';
import GameControls from '@/components/GameControls';
import { useGameState } from '@/hooks/useGameState';

const HomePage: React.FC = () => {
  const { gameState, rollDice, resetGame, BOARD_SIZE } = useGameState();

  return (
    <div className="min-h-screen bg-gradient-to-br from-purple-100 via-blue-50 to-green-100 py-8 px-4">
      <div className="container mx-auto max-w-6xl">
        <div className="grid lg:grid-cols-3 gap-8">
          <div className="lg:col-span-2">
            <GameBoard players={gameState.players} boardSize={BOARD_SIZE} />
          </div>
          <div className="lg:col-span-1">
            <GameControls
              gameState={gameState}
              onRollDice={rollDice}
              onResetGame={resetGame}
            />
          </div>
        </div>
      </div>
    </div>
  );
};

export default HomePage;
