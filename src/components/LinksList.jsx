import { useCallback } from 'react';
import { links } from '../data/portfolio.js';

/** 社交链接列表 · 点击涟漪反馈 */
export default function LinksList() {
  const handleClick = useCallback((e) => {
    const btn = e.currentTarget;
    const rect = btn.getBoundingClientRect();
    const size = Math.max(rect.width, rect.height);
    const ripple = document.createElement('span');
    ripple.className = 'ripple';
    ripple.style.width = ripple.style.height = size + 'px';
    ripple.style.left = e.clientX - rect.left - size / 2 + 'px';
    ripple.style.top = e.clientY - rect.top - size / 2 + 'px';
    btn.appendChild(ripple);
    setTimeout(() => ripple.remove(), 600);
  }, []);

  return (
    <section className="section">
      <h2 className="section-title">
        <span className="title-icon">🍡</span>
        联系我
      </h2>
      <div className="links-list">
        {links.map((l) => (
          <a
            key={l.key}
            className={`link-btn link-${l.key}`}
            href={l.url}
            target={l.url.startsWith('mailto:') ? undefined : '_blank'}
            rel="noopener noreferrer"
            onClick={handleClick}
          >
            <i className={l.icon} />
            <span>{l.label}</span>
            <i className="fa-solid fa-chevron-right link-arrow" />
          </a>
        ))}
      </div>
    </section>
  );
}
