import SakuraCanvas from './components/SakuraCanvas.jsx';
import FloatingDecor from './components/FloatingDecor.jsx';
import Header from './components/Header.jsx';

/** 共享页面布局：每个独立页面都包裹此 Layout */
export default function Layout({ children }) {
  return (
    <>
      <SakuraCanvas />
      <FloatingDecor />
      <Header />
      <main className="container">
        {children}
        <footer className="footer">
          <div className="divider">🌸 ✦ 🌸</div>
          <p>
            Made with <i className="fa-solid fa-heart heart-icon" /> &amp;{' '}
            <i className="fa-solid fa-mug-hot" /> by Sakura
          </p>
          <p className="footer-sub">© 2026 · Powered by dreams and matcha</p>
        </footer>
      </main>
    </>
  );
}
