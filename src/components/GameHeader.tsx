
import React from 'react';
import DiceRoller from './DiceRoller';
import { Player } from '../types';

interface GameHeaderProps {
  currentPlayer: Player | undefined;
  onRoll: () => void; // Changed from (value: number) => void
  diceDisabled: boolean;
  onReturn: () => void;
  gameEnded: boolean;
}

const GameHeader: React.FC<GameHeaderProps> = ({
  currentPlayer,
  onRoll,
  diceDisabled,
  onReturn,
  gameEnded,
}) => {
  return (
    <div className="flex flex-col md:flex-row md:items-center justify-between gap-3 mb-4">
      <div className="flex items-center gap-4">
        <h2 className="text-xl md:text-2xl font-bold">ゲーム画面</h2>
        <div className="text-sm text-white/80">
          Turn: <span className="font-semibold">{currentPlayer?.name ?? '—'}</span>
        </div>
      </div>

      <div className="flex items-center gap-3">
        <div>
          <DiceRoller
            onRoll={onRoll}
            disabled={(currentPlayer?.isPC ?? false) || diceDisabled || gameEnded}
            label={currentPlayer?.isPC ? `${currentPlayer?.name} のターン` : '🎲 Roll Dice'}
          />
        </div>

        <button
          onClick={onReturn}
          className="px-4 py-2 bg-red-500 hover:bg-red-600 text-white rounded-lg shadow hidden sm:inline-block"
        >
          ホームに戻る
        </button>

        <button
          onClick={onReturn}
          className="px-3 py-2 bg-red-500 hover:bg-red-600 text-white rounded-lg shadow sm:hidden"
        >
          戻る
        </button>
      </div>
    </div>
  );
};

export default GameHeader;
