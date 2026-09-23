import Layout from '../Layout.jsx';
import StickerGallery from '../components/StickerGallery.jsx';

export default function PhotosPage() {
  return (
    <Layout>
      <section id="photos" className="page-section">
        <header className="page-header">
          <h1 className="page-title">
            <span className="page-title-emoji">📸</span>
            照片墙
          </h1>
          <p className="page-subtitle">收藏的魔法贴纸库 · 记录生活里的小碎片</p>
        </header>
        <StickerGallery />
      </section>
    </Layout>
  );
}
