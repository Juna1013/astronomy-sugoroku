// src/components/SpaceBackground.tsx
import React, { useRef, useEffect } from 'react';

const SpaceBackground: React.FC = () => {
  const ref = useRef<HTMLCanvasElement | null>(null);

  useEffect(() => {
    const canvas = ref.current!;
    const ctx = canvas.getContext('2d')!;
    let w = (canvas.width = window.innerWidth);
    let h = (canvas.height = window.innerHeight);
    const starsCount = Math.floor((w * h) / 7000);
    let stars: { x:number;y:number;z:number;vx:number }[] = [];

    function init() {
      stars = [];
      for (let i = 0; i < starsCount; i++) {
        stars.push({
          x: Math.random() * w,
          y: Math.random() * h,
          z: 0.2 + Math.random() * 1,
          vx: 0.1 + Math.random() * 0.4
        });
      }
    }
    init();

    function onResize() {
      w = canvas.width = window.innerWidth;
      h = canvas.height = window.innerHeight;
      init();
    }
    window.addEventListener('resize', onResize);

    let raf = 0;
    function draw() {
      ctx.clearRect(0, 0, w, h);
      // 背景（うっすら暗めのグラデ）
      const g = ctx.createLinearGradient(0, 0, 0, h);
      g.addColorStop(0, 'rgba(6,10,30,0.6)');
      g.addColorStop(1, 'rgba(2,6,20,0.95)');
      ctx.fillStyle = g;
      ctx.fillRect(0, 0, w, h);

      for (let s of stars) {
        s.x += s.vx * s.z;
        s.y += Math.sin((s.x + s.y) * 0.0005) * 0.2;
        if (s.x > w + 50) s.x = -50;
        const size = 0.6 + s.z * 1.8;
        ctx.beginPath();
        ctx.fillStyle = `rgba(255,255,255,${0.6 * s.z})`;
        ctx.arc(s.x, s.y, size, 0, Math.PI * 2);
        ctx.fill();
      }
      raf = requestAnimationFrame(draw);
    }
    draw();

    return () => {
      cancelAnimationFrame(raf);
      window.removeEventListener('resize', onResize);
    };
  }, []);

  return (
    <canvas
      ref={ref}
      className="pointer-events-none fixed inset-0 z-2"
      aria-hidden
    />
  );
};

export default SpaceBackground;
