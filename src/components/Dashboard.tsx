import React from 'react';
import { ThemeSwitcher } from './ThemeSwitcher';

interface DashboardProps {
  onStart: (pcMode?: boolean) => void;
  onOpenSettings: () => void;
}

export default function Dashboard({ onStart, onOpenSettings }: DashboardProps) {
  return (
    <div className="min-h-screen flex flex-col items-center justify-center bg-gray-100 dark:bg-gradient-to-b dark:from-indigo-900 dark:to-slate-900 text-gray-800 dark:text-white px-4 relative">
      <div className="absolute top-4 right-4">
        <ThemeSwitcher />
      </div>

      <h1 className="text-3xl md:text-5xl font-bold mb-6">宇宙すごろく</h1>

      <div className="w-full max-w-sm bg-white/80 dark:bg-white/10 backdrop-blur rounded-xl p-6 shadow-lg border border-gray-200 dark:border-white/10">
        <p className="text-sm text-gray-700 dark:text-white/80 mb-4">
          惑星や星座を巡るすごろく。モードを選んで開始してください。
        </p>

        <div className="flex flex-col gap-3">
          <button
            onClick={() => onStart(false)}
            className="w-full px-4 py-3 bg-emerald-500 hover:bg-emerald-600 rounded-lg shadow text-white text-lg font-semibold transition"
          >
            2人でプレイ
          </button>

          <button
            onClick={() => onStart(true)}
            className="w-full px-4 py-3 bg-sky-500 hover:bg-sky-600 rounded-lg shadow text-white text-lg font-semibold transition"
          >
            PCと対戦
          </button>

          <button
            onClick={onOpenSettings}
            className="w-full px-4 py-2 bg-gray-500 hover:bg-gray-600 text-white rounded-lg text-sm"
          >
            設定
          </button>
        </div>

        <div className="mt-4 text-xs text-gray-600 dark:text-white/60">
          ・ 各マスをホバーすると効果が見えます。<br />
          ・ モバイルでは縦表示に最適化しています。
        </div>
      </div>
    </div>
  );
}
