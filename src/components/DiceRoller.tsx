import React, { useState } from "react";

type Props = {
  disabled?: boolean;
  onRoll: (value: number) => void;
  label?: string;
};

export default function DiceRoller({ disabled = false, onRoll, label = "🎲 サイコロをふる" }: Props) {
  const [lastRoll, setLastRoll] = useState<number | null>(null);

  const roll = () => {
    if (disabled) return;
    const value = Math.floor(Math.random() * 6) + 1;
    setLastRoll(value);
    onRoll(value);
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

      <div className="text-sm text-white/80 min-h-[1.2rem]">
        {lastRoll ? `出目: ${lastRoll}` : "まだ振られていません"}
      </div>
    </div>
  );
}
