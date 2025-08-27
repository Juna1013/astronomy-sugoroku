'use client';

import React from 'react';

type Props = {
  disabled?: boolean;
  onRoll: () => void; // Changed to not pass value
  label?: string;
};

export default function DiceRoller({ disabled = false, onRoll, label = "🎲 サイコロをふる" }: Props) {
  const roll = () => {
    if (disabled) return;
    onRoll(); // Value is now handled in useGameState
  };

  return (
    <div className="mt-6 flex flex-col items-center gap-2">
      <button
        onClick={roll}
        disabled={disabled}
        className={`px-6 py-3 rounded-xl font-bold shadow transition ${
          disabled ? "bg-gray-500 text-white cursor-not-allowed" : "bg-indigo-600 text-white hover:bg-indigo-700"
        }`}
      >
        {label}
      </button>
    </div>
  );
}
