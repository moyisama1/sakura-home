import { useState } from 'react';
import SakuraCanvas from './components/SakuraCanvas.jsx';
import FloatingDecor from './components/FloatingDecor.jsx';
import ProfileCard from './components/ProfileCard.jsx';
import TodayBadge from './components/TodayBadge.jsx';
import TagCloud from './components/TagCloud.jsx';
import WorksGrid from './components/WorksGrid.jsx';
import LinksList from './components/LinksList.jsx';
import StickerGallery from './components/StickerGallery.jsx';
import StickerUpload from './components/StickerUpload.jsx';

export default function App() {
  // 管理员上传面板（URL 带 ?admin=1 才显示）
  const showAdmin = new URLSearchParams(window.location.search).get('admin') === '1';
  const [uploadKey, setUploadKey] = useState(0); // 上传成功后刷新 Gallery

  return (
    <>
      <SakuraCanvas />
      <FloatingDecor />
      <main className="container">
        <ProfileCard />
        <TodayBadge />
        <TagCloud />
        <WorksGrid />
        <StickerGallery key={uploadKey} />
        {showAdmin && <StickerUpload onUploaded={() => setUploadKey((k) => k + 1)} />}
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