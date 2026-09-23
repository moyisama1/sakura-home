import Layout from '../Layout.jsx';
import WorksGrid from '../components/WorksGrid.jsx';
import RecentUpdates from '../components/RecentUpdates.jsx';

export default function ThoughtsPage() {
  return (
    <Layout>
      <section id="thoughts" className="page-section">
        <header className="page-header">
          <h1 className="page-title">
            <span className="page-title-emoji">✒️</span>
            拙见
          </h1>
          <p className="page-subtitle">一些碎碎念 · 近期的小想法和动态</p>
        </header>
        <div className="desktop-grid">
          <WorksGrid />
          <RecentUpdates />
        </div>
      </section>
    </Layout>
  );
}
