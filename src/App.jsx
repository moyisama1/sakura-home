import SakuraCanvas from './components/SakuraCanvas.jsx';
import FloatingDecor from './components/FloatingDecor.jsx';
import ProfileCard from './components/ProfileCard.jsx';
import TodayBadge from './components/TodayBadge.jsx';
import TagCloud from './components/TagCloud.jsx';
import WorksGrid from './components/WorksGrid.jsx';
import LinksList from './components/LinksList.jsx';

export default function App() {
  return (
    <>
      <SakuraCanvas />
      <FloatingDecor />
      <main className="container">
        <ProfileCard />
        <TodayBadge />
        <TagCloud />
        <WorksGrid />
        <LinksList />
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