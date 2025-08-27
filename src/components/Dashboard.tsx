import React from 'react';

interface DashboardProps {
  onStart: (pcMode?: boolean) => void;
  onOpenSettings: () => void;
}

export default function Dashboard({ onStart, onOpenSettings }: DashboardProps) {
  return (
    <div className="min-h-screen flex flex-col items-center justify-center bg-gradient-to-b from-indigo-900 to-slate-900 text-white px-4">
      <h1 className="text-3xl md:text-5xl font-bold mb-6">宇宙すごろく</h1>

      <div className="w-full max-w-sm bg-white/6 backdrop-blur rounded-xl p-6 shadow-lg border border-white/10">
        <p className="text-sm text-white/80 mb-4">
          惑星や星座を巡るすごろく。モードを選んで開始してください。
        </p>

        <div className="flex flex-col gap-3">
          <button
            onClick={() => onStart(false)}
            className="w-full px-4 py-3 bg-emerald-500 hover:bg-emerald-600 rounded-lg shadow text-lg font-semibold transition"
          >
            2人でプレイ
          </button>

          <button
            onClick={() => onStart(true)}
            className="w-full px-4 py-3 bg-sky-500 hover:bg-sky-600 rounded-lg shadow text-lg font-semibold transition"
          >
            PCと対戦
          </button>

          <button
            onClick={onOpenSettings}
            className="w-full px-4 py-2 bg-gray-600 hover:bg-gray-700 rounded-lg text-sm"
          >
            設定
          </button>
        </div>

        <div className="mt-4 text-xs text-white/60">
          ・ 各マスをホバーすると効果が見えます。<br />
          ・ モバイルでは縦表示に最適化しています。
        </div>
      </div>
    </div>
  );
}
