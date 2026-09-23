import SakuraCanvas from './components/SakuraCanvas.jsx';
import FloatingDecor from './components/FloatingDecor.jsx';
import Header from './components/Header.jsx';
import ProfileCard from './components/ProfileCard.jsx';
import TodayBadge from './components/TodayBadge.jsx';
import TagCloud from './components/TagCloud.jsx';
import WorksGrid from './components/WorksGrid.jsx';
import StickerGallery from './components/StickerGallery.jsx';
import LinksList from './components/LinksList.jsx';
import RecentUpdates from './components/RecentUpdates.jsx';

export default function App() {
  return (
    <>
      <SakuraCanvas />
      <FloatingDecor />
      <Header />
      <main className="container">
        <section id="about" className="section-about">
          <ProfileCard />
          <TodayBadge />
        </section>
        <div className="desktop-grid">
          <WorksGrid />
          <TagCloud />
          <RecentUpdates />
          <LinksList />
        </div>
        <StickerGallery />
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
