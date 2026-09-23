import { useEffect, useRef, useState } from 'react';

// 每个导航项 → 独立 HTML 页面（点击触发 full page reload）
const NAV_ITEMS = [
  { id: 'about', label: '关于我', icon: 'fa-solid fa-user', href: '/' },
  { id: 'photos', label: '照片墙', icon: 'fa-solid fa-camera-retro', href: '/photos.html' },
  { id: 'thoughts', label: '拙见', icon: 'fa-solid fa-feather-pointed', href: '/thoughts.html' },
  { id: 'share', label: '分享', icon: 'fa-solid fa-share-nodes', href: '/share.html' },
];

/** 根据当前 URL path 判断应该高亮哪个导航项 */
function detectActiveId() {
  const path = window.location.pathname;
  // 兼容末尾斜杠 + 子路径
  const normalized = path.replace(/\/+$/, '') || '/';
  const match = NAV_ITEMS.find((item) => item.href === normalized);
  return match ? match.id : 'about';
}

export default function Header() {
  const [activeId, setActiveId] = useState(() => detectActiveId());
  const [menuOpen, setMenuOpen] = useState(false);
  const menuRef = useRef(null);

  // 点击汉堡菜单外部 → 关闭
  useEffect(() => {
    if (!menuOpen) return;
    const handler = (e) => {
      if (menuRef.current && !menuRef.current.contains(e.target)) {
        setMenuOpen(false);
      }
    };
    document.addEventListener('mousedown', handler);
    document.addEventListener('touchstart', handler);
    return () => {
      document.removeEventListener('mousedown', handler);
      document.removeEventListener('touchstart', handler);
    };
  }, [menuOpen]);

  // ESC 关闭菜单
  useEffect(() => {
    if (!menuOpen) return;
    const handler = (e) => {
      if (e.key === 'Escape') setMenuOpen(false);
    };
    document.addEventListener('keydown', handler);
    return () => document.removeEventListener('keydown', handler);
  }, [menuOpen]);

  // 移动端点击导航链接 → 关闭菜单后自然触发页面跳转
  const handleMobileNavClick = () => {
    setMenuOpen(false);
  };

  return (
    <header className="site-header">
      <div className="header-inner">
        {/* Logo / 品牌 — 点击回首页触发 full reload */}
        <a href="/" className="header-logo" onClick={() => handleMobileNavClick()}>
          <span className="logo-emoji">🌸</span>
          <span className="logo-text">Sakura Home</span>
        </a>

        {/* 桌面端导航 — plain <a href>，点击触发 full page reload */}
        <nav className="header-nav desktop-nav" aria-label="主导航">
          {NAV_ITEMS.map((item) => (
            <a
              key={item.id}
              href={item.href}
              className={`nav-link ${activeId === item.id ? 'nav-link--active' : ''}`}
            >
              <i className={item.icon} aria-hidden="true" />
              <span>{item.label}</span>
              {activeId === item.id && <span className="nav-indicator" aria-hidden="true" />}
            </a>
          ))}
        </nav>

        {/* 汉堡按钮（移动端） */}
        <button
          className="hamburger"
          type="button"
          aria-label={menuOpen ? '关闭菜单' : '打开菜单'}
          aria-expanded={menuOpen}
          aria-controls="mobile-menu"
          onClick={() => setMenuOpen((v) => !v)}
        >
          <span className={`hamburger-bar hamburger-bar--1 ${menuOpen ? 'open' : ''}`} />
          <span className={`hamburger-bar hamburger-bar--2 ${menuOpen ? 'open' : ''}`} />
          <span className={`hamburger-bar hamburger-bar--3 ${menuOpen ? 'open' : ''}`} />
        </button>
      </div>

      {/* 移动端下拉菜单 — plain <a href> */}
      <nav
        id="mobile-menu"
        ref={menuRef}
        className={`mobile-nav ${menuOpen ? 'mobile-nav--open' : ''}`}
        aria-label="移动端导航"
      >
        {NAV_ITEMS.map((item) => (
          <a
            key={item.id}
            href={item.href}
            className={`mobile-nav-link ${activeId === item.id ? 'mobile-nav-link--active' : ''}`}
            onClick={handleMobileNavClick}
          >
            <i className={item.icon} aria-hidden="true" />
            <span>{item.label}</span>
            {activeId === item.id && <i className="fa-solid fa-chevron-right mobile-nav-arrow" />}
          </a>
        ))}
      </nav>
    </header>
  );
}
