import { useEffect, useRef } from 'react';

/**
 * 《魔法少女ノ魔女裁判》主题粒子 · 魔法樱花 + 星尘
 * 性能优化：
 *  - shadowBlur 改为离屏预渲染光晕 sprite（每帧 drawImage 零开销）
 *  - 移动端自动降低粒子数（花瓣 18 / 星星 15）
 *  - 移动端星星用 fillRect 替代 drawImage
 *  - DPR 硬上限 2，避免 3x 屏过度绘制
 *  - 页面隐藏时暂停动画
 */
export default function SakuraCanvas() {
  const canvasRef = useRef(null);

  useEffect(() => {
    const canvas = canvasRef.current;
    if (!canvas) return;
    const ctx = canvas.getContext('2d', { alpha: true });
    if (!ctx) return;

    const reduceMotion = window.matchMedia(
      '(prefers-reduced-motion: reduce)',
    ).matches;

    const isMobile =
      window.innerWidth < 768 ||
      window.matchMedia('(pointer: coarse)').matches;

    // ===== 花瓣 SVG 源 =====
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

    // ===== 离屏预渲染：带光晕的花瓣 sprite（最大尺寸 32） =====
    // 只做一次 shadowBlur，结果缓存为 canvas，后续每帧 drawImage 即可
    const makeGlowSprite = (maxSize = 32) => {
      const off = document.createElement('canvas');
      const pad = 14; // 光晕边距
      off.width = maxSize + pad * 2;
      off.height = maxSize * 1.2 + pad * 2;
      const octx = off.getContext('2d');
      if (!octx) return null;

      const img = new Image();
      img.src = `data:image/svg+xml;utf8,${encodeURIComponent(petalSvg)}`;
      // 同步等待 dataURL 图片可用（dataURL 通常同步，但保险起见）
      if (!img.complete) {
        // 放弃光晕预渲染，直接用原始花瓣图
        return null;
      }
      octx.shadowBlur = pad;
      octx.shadowColor = 'rgba(216,119,170,0.55)';
      octx.drawImage(
        img,
        pad,
        pad,
        maxSize,
        maxSize * 1.2,
      );
      octx.shadowBlur = 0;
      return { canvas: off, pad };
    };

    let glowSprite = null; // { canvas, pad }
    let petalImg = new Image();
    petalImg.src = `data:image/svg+xml;utf8,${encodeURIComponent(petalSvg)}`;

    // 等花瓣图加载完，预渲染光晕
    const tryMakeGlow = () => {
      if (petalImg.complete) {
        glowSprite = makeGlowSprite(32);
      }
    };
    if (petalImg.complete) {
      tryMakeGlow();
    } else {
      petalImg.addEventListener('load', tryMakeGlow, { once: true });
    }

    let petals = [];
    let stars = [];
    let animationId = null;
    let isPageVisible = true;

    const resize = () => {
      const dpr = Math.min(window.devicePixelRatio || 1, 2);
      canvas.width = window.innerWidth * dpr;
      canvas.height = window.innerHeight * dpr;
      canvas.style.width = window.innerWidth + 'px';
      canvas.style.height = window.innerHeight + 'px';
      ctx.setTransform(dpr, 0, 0, dpr, 0, 0);
    };

    // 移动端缩减粒子数
    const LAYERS = isMobile
      ? [
          { count: 6, sizeRange: [14, 22], speedY: [0.22, 0.48], alpha: [0.35, 0.55] },
          { count: 8, sizeRange: [10, 16], speedY: [0.52, 0.95], alpha: [0.5, 0.7] },
          { count: 4, sizeRange: [16, 26], speedY: [0.13, 0.32], alpha: [0.68, 0.9] },
        ]
      : [
          { count: 20, sizeRange: [14, 22], speedY: [0.22, 0.48], alpha: [0.35, 0.55] },
          { count: 24, sizeRange: [10, 16], speedY: [0.52, 0.95], alpha: [0.5, 0.7] },
          { count: 14, sizeRange: [16, 26], speedY: [0.13, 0.32], alpha: [0.68, 0.9] },
        ];

    const STAR_COUNT = isMobile ? 15 : 50;

    const rnd = (min, max) => min + Math.random() * (max - min);

    const createPetal = (layerCfg) => ({
      layerCfg, // 直接存引用，避免每帧 LAYERS.find
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
      glow: Math.random() * Math.PI * 2,
      glowSpeed: rnd(0.01, 0.02),
    });

    const createStar = () => ({
      x: Math.random() * window.innerWidth,
      y: Math.random() * window.innerHeight * 1.2,
      size: rnd(isMobile ? 1.2 : 1.5, isMobile ? 2.2 : 3.5),
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
      stars = Array.from({ length: STAR_COUNT }, createStar);
    };

    // ===== 渲染循环 =====
    let timeTick = 0;
    let lastFrame = 0;
    const frameInterval = isMobile ? 1000 / 45 : 1000 / 60; // 移动端 ~45fps 也够用

    const frame = (timestamp) => {
      animationId = requestAnimationFrame(frame);

      if (!isPageVisible) return;
      if (timestamp - lastFrame < frameInterval) return;
      lastFrame = timestamp;

      ctx.clearRect(0, 0, window.innerWidth, window.innerHeight);
      timeTick++;

      const magicDrift =
        Math.sin(timeTick * 0.008) * 0.35 +
        Math.sin(timeTick * 0.017) * 0.2;

      // --- 星光层（底层） ---
      // 移动端：直接 fillRect，零 image 解码开销
      if (isMobile) {
        for (const s of stars) {
          s.y += s.speedY;
          s.x += s.speedX + Math.sin(s.twinkle * 0.5) * 0.1;
          s.twinkle += s.twinkleSpeed;
          if (s.y > window.innerHeight + 10) {
            Object.assign(s, createStar());
            s.y = -10;
          }
          const a = s.alpha * (0.5 + 0.5 * Math.sin(s.twinkle));
          ctx.fillStyle = `rgba(255,200,230,${a})`;
          ctx.fillRect(s.x - s.size / 2, s.y - s.size / 2, s.size, s.size);
        }
      } else {
        for (const s of stars) {
          s.y += s.speedY;
          s.x += s.speedX + Math.sin(s.twinkle * 0.5) * 0.1;
          s.twinkle += s.twinkleSpeed;
          if (s.y > window.innerHeight + 10) {
            Object.assign(s, createStar());
            s.y = -10;
          }
          const a = s.alpha * (0.5 + 0.5 * Math.sin(s.twinkle));
          ctx.save();
          ctx.globalAlpha = a;
          ctx.fillStyle = 'rgba(255,200,230,0.9)';
          ctx.fillRect(s.x - s.size / 2, s.y - s.size / 2, s.size, s.size);
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
          Object.assign(p, createPetal(p.layerCfg));
          p.x = Math.random() * window.innerWidth;
        }

        if (!petalImg.complete) continue;

        const glowBoost = 0.7 + 0.3 * Math.sin(p.glow); // 缩小光晕脉动范围，视觉更稳

        ctx.save();
        ctx.globalAlpha = p.alpha;
        ctx.translate(p.x, p.y);
        ctx.rotate(p.rot);

        if (glowSprite) {
          // 离屏预渲染光晕 sprite：一次 shadowBlur，之后全是 drawImage
          const pad = glowSprite.pad;
          const w = p.size + pad * 2;
          const h = p.size * 1.2 + pad * 2;
          ctx.globalAlpha = p.alpha * glowBoost;
          ctx.drawImage(glowSprite.canvas, -w / 2, -h / 2, w, h);
        } else {
          // 降级：不画光晕，直接花瓣
          ctx.drawImage(petalImg, -p.size / 2, -p.size / 2, p.size, p.size * 1.2);
        }

        ctx.restore();
      }
    };

    const onVisibilityChange = () => {
      isPageVisible = document.visibilityState === 'visible';
      if (isPageVisible) lastFrame = 0;
    };

    resize();
    init();
    animationId = requestAnimationFrame(frame);

    window.addEventListener('resize', resize);
    document.addEventListener('visibilitychange', onVisibilityChange);

    return () => {
      window.removeEventListener('resize', resize);
      document.removeEventListener('visibilitychange', onVisibilityChange);
      petalImg.removeEventListener('load', tryMakeGlow);
      if (animationId) cancelAnimationFrame(animationId);
    };
  }, []);

  return <canvas id="sakura-canvas" ref={canvasRef} aria-hidden="true" />;
}
