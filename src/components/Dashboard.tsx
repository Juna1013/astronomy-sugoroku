// --- src/components/Dashboard.tsx ---
import React from 'react';


type Props = {
onStart: () => void;
onOpenSettings?: () => void;
};


export default function Dashboard({ onStart, onOpenSettings }: Props) {
return (
<div className="min-h-screen flex items-center justify-center bg-gradient-to-br from-slate-900 to-sky-900 text-white p-6">
<div className="max-w-2xl w-full bg-white/5 backdrop-blur rounded-2xl p-6 shadow-2xl border border-white/10">
<h1 className="text-3xl font-bold mb-2">Astronomy Sugoroku</h1>
<p className="mb-4 text-sm text-white/80">惑星や星座を巡るすごろく — 遊ぶ前に設定を確認できます。</p>


<div className="space-y-4">
<button
onClick={onStart}
className="w-full py-3 rounded-xl bg-gradient-to-r from-indigo-500 to-violet-500 text-white font-semibold shadow-md hover:scale-[1.02] transition-transform"
>
Start Game
</button>


<button
onClick={onOpenSettings}
className="w-full py-2 rounded-xl border border-white/20 text-white/90 bg-white/5 hover:bg-white/10"
>
Settings
</button>


<div className="text-xs text-white/60 mt-2">
・ 各マスをホバーすると効果が見えます。
</div>
</div>
</div>
</div>
);
}