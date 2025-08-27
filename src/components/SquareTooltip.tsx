// --- src/components/SquareTooltip.tsx ---
import React from 'react';


export default function SquareTooltip({ title, desc }: { title: string; desc?: string }) {
return (
<div className="z-50 max-w-xs rounded-md p-2 text-sm shadow-lg bg-white text-slate-900 border border-slate-200">
<div className="font-semibold">{title}</div>
{desc && <div className="text-xs mt-1 text-slate-600">{desc}</div>}
</div>
);
}
