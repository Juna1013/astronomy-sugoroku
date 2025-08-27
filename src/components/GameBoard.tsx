// src/components/GameBoard.tsx
import React from "react";

type Square = {
  id: number;
  name: string;
  effect?: { type: string; value?: number; desc?: string };
  icon?: string;
};

type Player = {
  id: number;
  name: string;
  pos: number;
  color?: string;
  isPC?: boolean;
};

type Props = {
  squares: Square[];
  players: Player[];
  started?: boolean;
  currentPlayerId?: number;
  /**
   * 列数のヒント（レスポンシブ: デフォルトは sm:3 md:4 lg:6）
   * 例: { base:2, sm:3, md:4, lg:6 } のように調整する場合は CSS 側で行ってください
   */
  onSquareClick?: (sq: Square) => void;
};

function EffectIcon({ type }: { type?: string }) {
  // 必要なら SVG に置き換え
  if (!type) return null;
  if (type === "move") return <span aria-hidden>⇢</span>;
  if (type === "bonus") return <span aria-hidden>＋</span>;
  if (type === "penalty") return <span aria-hidden>−</span>;
  return <span aria-hidden>★</span>;
}

function PlayerToken({ player, isActive }: { player: Player; isActive?: boolean }) {
  // 名前を1〜2文字で表示。必要なら avatar 画像にも差し替え可。
  const label = player.name.slice(0, 2);
  return (
    <div
      className={`flex items-center justify-center text-[10px] sm:text-xs font-semibold w-7 h-7 sm:w-9 sm:h-9 rounded-full shadow select-none border-2 transition-transform ${
        isActive ? "ring-2 ring-white/70" : ""
      }`}
      style={{ background: player.color ?? "#7c3aed", color: "#fff" }}
      title={player.name + (player.isPC ? " (PC)" : "")}
      aria-hidden={false}
      role="img"
      aria-label={player.name}
    >
      {label}
    </div>
  );
}

export default function GameBoard({
  squares,
  players,
  started = true,
  currentPlayerId,
  onSquareClick,
}: Props) {
  const playersOn = (sqId: number) => players.filter((p) => p.pos === sqId);

  return (
    <div className="p-2 md:p-4">
      {!started && (
        <div className="mb-3 text-center text-[12px] text-slate-400">
          ゲームはダッシュボードから開始してください
        </div>
      )}

      {/* グリッド: xs:2 sm:3 md:4 lg:6 */}
      <div className="grid grid-cols-2 sm:grid-cols-3 md:grid-cols-4 lg:grid-cols-6 gap-2 sm:gap-3">
        {squares.map((sq) => {
          const onSquare = playersOn(sq.id);
          return (
            <button
              key={sq.id}
              onClick={() => onSquareClick && onSquareClick(sq)}
              className="relative text-left group rounded-xl p-2 sm:p-3 min-h-[78px] sm:min-h-[96px] bg-gradient-to-br from-white/3 to-white/6 border border-white/6 shadow-sm
                        hover:scale-[1.01] transition-transform focus:outline-none focus:ring-2 focus:ring-indigo-500"
              aria-label={`${sq.name} のマス`}
            >
              {/* 上部 — アイコン + マス名 + 効果バッジ */}
              <div className="flex items-start justify-between">
                <div className="flex items-center gap-2">
                  <div className="text-sm sm:text-lg">{sq.icon ?? "✦"}</div>
                  <div className="text-[12px] sm:text-sm font-medium text-white/95">{sq.name}</div>
                </div>

                {/* 効果バッジ（常時表示） */}
                {sq.effect && (
                  <div
                    className="ml-2 flex items-center gap-1 px-1.5 py-0.5 rounded-md border border-white/10 bg-white/3"
                    aria-hidden={false}
                  >
                    <div className="text-[11px] sm:text-xs font-semibold text-white">{<EffectIcon type={sq.effect.type} />}</div>
                    <div className="hidden sm:block text-[10px] sm:text-xs text-white/90 max-w-[110px] truncate">
                      <span className="font-medium">{sq.effect.type}</span>
                      {sq.effect.desc && <span className="text-white/70"> · {sq.effect.desc}</span>}
                    </div>

                    {/* モバイルでは簡潔にタイプのみ */}
                    <div className="block sm:hidden text-[10px] text-white/90">{sq.effect.type}</div>
                  </div>
                )}
              </div>

              {/* 中央〜下部 — 駒領域 */}
              <div className="mt-2 flex items-end justify-between">
                {/* 駒表示：重なりを小さなスタックで表示 */}
                <div className="flex -space-x-1 items-center">
                  {onSquare.length > 0 ? (
                    onSquare.map((p, idx) => (
                      <div
                        key={p.id}
                        className={`transform transition-transform ${idx === 0 ? "" : "translate-x-[-4px]"} `}
                        style={{ zIndex: 20 + idx }}
                      >
                        <PlayerToken player={p} isActive={currentPlayerId === p.id} />
                      </div>
                    ))
                  ) : (
                    <div className="text-[11px] text-white/40">—</div>
                  )}
                </div>

                {/* 右端に小さなインジケータ（任意） */}
                <div className="text-[10px] sm:text-xs text-white/60">{/* ここにコイン数など表示可 */}</div>
              </div>

              {/* マス下部に小さな詳細（幅が小さいとtruncate） */}
              {sq.effect?.desc && (
                <div className="mt-2">
                  <div className="text-[10px] sm:text-xs text-white/70 truncate">{sq.effect.desc}</div>
                </div>
              )}

              {/* group hover で微妙な強調（アクセント） */}
              <div
                className="pointer-events-none absolute inset-0 rounded-xl transition-opacity opacity-0 group-hover:opacity-5"
                style={{ background: "linear-gradient(90deg, rgba(255,255,255,0.02), rgba(255,255,255,0))" }}
              />
            </button>
          );
        })}
      </div>
    </div>
  );
}
