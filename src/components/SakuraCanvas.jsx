import { useEffect, useRef } from 'react';

/**
 * 《魔法少女ノ魔女裁判》主题粒子 · 魔法樱花 + 星尘
 * - 深粉黑色调 · 黑暗中发光的玫瑰花瓣
 * - 极细星光粒子点缀（透明小方块 + 十字星）
 * - 保留分层 + 轻柔旋转漂移，替换风脉冲为魔法飘移
 */
export default function SakuraCanvas() {
  const canvasRef = useRef(null);

  useEffect(() => {
    const canvas = canvasRef.current;
    if (!canvas) return;
    const ctx = canvas.getContext('2d');
    if (!ctx) return;

    const reduceMotion = window.matchMedia(
      '(prefers-reduced-motion: reduce)',
    ).matches;

    // 深色魔法花瓣 SVG：黑边 + 深粉填充 + 粉色发光
    const petalSvg = `
      <svg xmlns='http://www.w3.org/2000/svg' viewBox='0 0 24 28'>
        <defs>
          <radialGradient id='g' cx='50%' cy='30%' r='70%'>
            <stop offset='0%' stop-color='rgba(255,180,210,0.95)'/>
            <stop offset='60%' stop-color='rgba(180,60,120,0.85)'/>
            <stop offset='100%' stop-color='rgba(70,20,50,0.75)'/>
          </radialGradient>
        </defs>
        <g stroke='rgba(30,10,25,0.7)' stroke-width='0.6' stroke-linejoin='round'>
          <ellipse cx='12' cy='18' rx='5' ry='10' fill='url(#g)'/>
          <ellipse cx='7' cy='10' rx='3.5' ry='8' fill='url(#g)' transform='rotate(-25 7 10)'/>
          <ellipse cx='17' cy='10' rx='3.5' ry='8' fill='url(#g)' transform='rotate(25 17 10)'/>
          <ellipse cx='8' cy='6' rx='3' ry='7' fill='url(#g)' transform='rotate(-50 8 6)'/>
          <ellipse cx='16' cy='6' rx='3' ry='7' fill='url(#g)' transform='rotate(50 16 6)'/>
        </g>
        <circle cx='12' cy='14' r='1.5' fill='rgba(255,230,240,0.9)'/>
      </svg>`;
    const petalImg = new Image();
    petalImg.src = `data:image/svg+xml;utf8,${encodeURIComponent(petalSvg)}`;

    // 十字星光（1px）
    const crossSvg = `<svg xmlns='http://www.w3.org/2000/svg' viewBox='0 0 8 8'><g stroke='rgba(255,200,230,0.85)' stroke-width='1'><line x1='4' y1='0' x2='4' y2='8'/><line x1='0' y1='4' x2='8' y2='4'/></g></svg>`;
    const crossImg = new Image();
    crossImg.src = `data:image/svg+xml;utf8,${encodeURIComponent(crossSvg)}`;

    let petals = [];
    let stars = [];
    let animationId = null;

    const resize = () => {
      const dpr = Math.min(window.devicePixelRatio || 1, 2);
      canvas.width = window.innerWidth * dpr;
      canvas.height = window.innerHeight * dpr;
      canvas.style.width = window.innerWidth + 'px';
      canvas.style.height = window.innerHeight + 'px';
      ctx.setTransform(dpr, 0, 0, dpr, 0, 0);
    };

    const LAYERS = [
      { count: 20, sizeRange: [14, 22], speedY: [0.22, 0.48], alpha: [0.35, 0.55] },
      { count: 24, sizeRange: [10, 16], speedY: [0.52, 0.95], alpha: [0.5, 0.7] },
      { count: 14, sizeRange: [16, 26], speedY: [0.13, 0.32], alpha: [0.68, 0.9] },
    ];

    const rnd = (min, max) => min + Math.random() * (max - min);

    const createPetal = (layerCfg) => ({
      x: Math.random() * window.innerWidth,
      y: -30 - Math.random() * 120,
      size: rnd(layerCfg.sizeRange[0], layerCfg.sizeRange[1]),
      speedY: rnd(layerCfg.speedY[0], layerCfg.speedY[1]),
      baseX: rnd(-0.18, 0.18),
      sway: Math.random() * Math.PI * 2,
      swaySpeed: rnd(0.01, 0.025),
      rot: Math.random() * Math.PI * 2,
      rotSpeed: rnd(-0.03, 0.03),
      alpha: rnd(layerCfg.alpha[0], layerCfg.alpha[1]),
      // 每隔若干帧"闪一下" · 魔法发光脉冲
      glow: Math.random() * Math.PI * 2,
      glowSpeed: rnd(0.01, 0.02),
    });

    const createStar = () => ({
      x: Math.random() * window.innerWidth,
      y: Math.random() * window.innerHeight * 1.2,
      size: rnd(1.5, 3.5),
      speedY: rnd(0.1, 0.3),
      speedX: rnd(-0.15, 0.15),
      twinkle: Math.random() * Math.PI * 2,
      twinkleSpeed: rnd(0.02, 0.05),
      alpha: rnd(0.2, 0.6),
    });

    const init = () => {
      if (reduceMotion) {
        petals = [];
        stars = [];
        return;
      }
      petals = LAYERS.flatMap((l) =>
        Array.from({ length: l.count }, () => createPetal(l)),
      );
      stars = Array.from({ length: 50 }, createStar);
    };

    let timeTick = 0;
    const frame = () => {
      ctx.clearRect(0, 0, window.innerWidth, window.innerHeight);
      timeTick++;

      // 魔法缓漂移：低频正弦波（代替风脉冲，更神秘）
      const magicDrift = Math.sin(timeTick * 0.008) * 0.35 + Math.sin(timeTick * 0.017) * 0.2;

      // --- 星光层（底层） ---
      for (const s of stars) {
        s.y += s.speedY;
        s.x += s.speedX + Math.sin(s.twinkle * 0.5) * 0.1;
        s.twinkle += s.twinkleSpeed;
        if (s.y > window.innerHeight + 10) {
          Object.assign(s, createStar());
          s.y = -10;
        }
        const a = s.alpha * (0.5 + 0.5 * Math.sin(s.twinkle));
        if (crossImg.complete) {
          ctx.save();
          ctx.globalAlpha = a;
          ctx.translate(s.x, s.y);
          ctx.drawImage(crossImg, -s.size / 2, -s.size / 2, s.size, s.size);
          ctx.restore();
        } else {
          ctx.save();
          ctx.globalAlpha = a;
          ctx.fillStyle = 'rgba(255,200,230,0.9)';
          ctx.beginPath();
          ctx.arc(s.x, s.y, s.size / 2, 0, Math.PI * 2);
          ctx.fill();
          ctx.restore();
        }
      }

      // --- 魔法花瓣层 ---
      for (const p of petals) {
        p.y += p.speedY;
        p.sway += p.swaySpeed;
        p.glow += p.glowSpeed;
        p.x += p.baseX + Math.sin(p.sway) * 0.3 + magicDrift;
        p.rot += p.rotSpeed + Math.sin(p.sway * 0.5) * 0.01;

        if (p.x < -30) p.x = window.innerWidth + 20;
        if (p.x > window.innerWidth + 30) p.x = -20;

        if (p.y > window.innerHeight + 30) {
          const layerCfg = LAYERS.find(
            (l) =>
              p.speedY >= l.speedY[0] &&
              p.speedY <= l.speedY[1],
          );
          Object.assign(p, createPetal(layerCfg || LAYERS[1]));
          p.x = Math.random() * window.innerWidth;
        }

        if (petalImg.complete) {
          // 魔法发光脉冲
          const glowBoost = 0.5 + 0.5 * Math.sin(p.glow);
          ctx.save();
          ctx.globalAlpha = p.alpha;
          // 柔和粉色外发光
          ctx.shadowBlur = 14 * glowBoost;
          ctx.shadowColor = 'rgba(216,119,170,0.55)';
          ctx.translate(p.x, p.y);
          ctx.rotate(p.rot);
          ctx.drawImage(petalImg, -p.size / 2, -p.size / 2, p.size, p.size * 1.2);
          ctx.restore();
        }
      }

      animationId = requestAnimationFrame(frame);
    };

    resize();
    init();
    frame();

    window.addEventListener('resize', resize);

    return () => {
      window.removeEventListener('resize', resize);
      if (animationId) cancelAnimationFrame(animationId);
    };
  }, []);

  return <canvas id="sakura-canvas" ref={canvasRef} aria-hidden="true" />;
}
