import React, { useState } from "react";

type Props = {
  onRoll: (value: number) => void;
};

export default function DiceRoller({ onRoll }: Props) {
  const [lastRoll, setLastRoll] = useState<number | null>(null);

  const roll = () => {
    const value = Math.floor(Math.random() * 6) + 1; // 1〜6
    setLastRoll(value);
    onRoll(value);
  };

  return (
    <div className="mt-6 text-center">
      <button
        onClick={roll}
        className="px-6 py-3 rounded-xl bg-indigo-600 text-white font-bold shadow hover:bg-indigo-700 transition"
      >
        🎲 Roll Dice
      </button>
      {lastRoll && (
        <div className="mt-2 text-lg font-semibold text-white">
          出目: {lastRoll}
        </div>
      )}
    </div>
  );
}
