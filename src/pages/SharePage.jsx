import Layout from '../Layout.jsx';
import LinksList from '../components/LinksList.jsx';

export default function SharePage() {
  return (
    <Layout>
      <section id="share" className="page-section">
        <header className="page-header">
          <h1 className="page-title">
            <span className="page-title-emoji">🔗</span>
            分享
          </h1>
          <p className="page-subtitle">在各个角落都能找到我 · 欢迎来唠唠嗑</p>
        </header>
        <LinksList />
      </section>
    </Layout>
  );
}
