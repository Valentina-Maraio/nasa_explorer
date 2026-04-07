import { useEffect, useRef } from 'react';

const LAYERS = [
  { count: 120, speed: 0.08, minSize: 0.6, maxSize: 1.0, opacity: 0.5 },
  { count: 60,  speed: 0.18, minSize: 1.0, maxSize: 1.6, opacity: 0.7 },
  { count: 25,  speed: 0.32, minSize: 1.6, maxSize: 2.4, opacity: 0.9 },
];

const STAR_COLORS = ['#ffffff', '#d8dce2', '#c6ccd4', '#8db0ff', '#b8bec8'];

function randomBetween(a, b) {
  return a + Math.random() * (b - a);
}

function buildStars(w, h) {
  return LAYERS.flatMap((layer) =>
    Array.from({ length: layer.count }, () => ({
      x: randomBetween(0, w),
      y: randomBetween(0, h),
      r: randomBetween(layer.minSize, layer.maxSize),
      speed: layer.speed * randomBetween(0.7, 1.3),
      color: STAR_COLORS[Math.floor(Math.random() * STAR_COLORS.length)],
      baseOpacity: layer.opacity * randomBetween(0.6, 1.0),
      twinkleOffset: randomBetween(0, Math.PI * 2),
      twinkleSpeed: randomBetween(0.3, 1.2),
    }))
  );
}

export default function StarField() {
  const canvasRef = useRef(null);

  useEffect(() => {
    const canvas = canvasRef.current;
    const ctx = canvas.getContext('2d');
    let animId;
    let stars = [];

    function resize() {
      canvas.width = window.innerWidth;
      canvas.height = window.innerHeight;
      stars = buildStars(canvas.width, canvas.height);
    }

    function draw(timestamp) {
      const t = timestamp / 1000;
      ctx.clearRect(0, 0, canvas.width, canvas.height);

      for (const star of stars) {
        star.y += star.speed;
        if (star.y > canvas.height + star.r) {
          star.y = -star.r;
          star.x = randomBetween(0, canvas.width);
        }

        const twinkle = 0.5 + 0.5 * Math.sin(t * star.twinkleSpeed + star.twinkleOffset);
        const opacity = star.baseOpacity * (0.6 + 0.4 * twinkle);

        ctx.beginPath();
        ctx.arc(star.x, star.y, star.r, 0, Math.PI * 2);
        ctx.fillStyle = star.color;
        ctx.globalAlpha = opacity;
        ctx.fill();
      }

      ctx.globalAlpha = 1;
      animId = requestAnimationFrame(draw);
    }

    resize();
    animId = requestAnimationFrame(draw);
    window.addEventListener('resize', resize);

    return () => {
      cancelAnimationFrame(animId);
      window.removeEventListener('resize', resize);
    };
  }, []);

  return (
    <canvas
      ref={canvasRef}
      style={{
        position: 'fixed',
        inset: 0,
        zIndex: 0,
        pointerEvents: 'none',
        display: 'block',
      }}
    />
  );
}
