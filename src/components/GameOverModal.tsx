
import React from 'react';
import { Player } from '../types';

interface GameOverModalProps {
  winner: Player | null;
  onReturn: () => void;
  onPlayAgain: () => void;
}

const GameOverModal: React.FC<GameOverModalProps> = ({ winner, onReturn, onPlayAgain }) => {
  if (!winner) return null;

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center bg-black/50">
      <div className="bg-white/5 backdrop-blur-md border border-white/20 rounded-xl p-6 w-[90%] max-w-lg text-center">
        <h3 className="text-2xl font-bold mb-2 text-white">ゲーム終了 🎉</h3>
        <p className="text-white/90 mb-4">{winner.name} がゴールしました！</p>

        <div className="flex items-center justify-center gap-3">
          <button
            onClick={onReturn}
            className="px-4 py-2 bg-red-500 hover:bg-red-600 text-white rounded-lg shadow"
          >
            ホームに戻る
          </button>

          <button
            onClick={onPlayAgain}
            className="px-4 py-2 bg-green-500 hover:bg-green-600 text-white rounded-lg shadow"
          >
            もう一度遊ぶ
          </button>
        </div>
      </div>
    </div>
  );
};

export default GameOverModal;
