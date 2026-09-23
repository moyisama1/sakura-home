import Layout from '../Layout.jsx';
import ProfileCard from '../components/ProfileCard.jsx';
import TodayBadge from '../components/TodayBadge.jsx';
import TagCloud from '../components/TagCloud.jsx';
import WorksGrid from '../components/WorksGrid.jsx';

export default function AboutPage() {
  return (
    <Layout>
      <section id="about">
        <ProfileCard />
        <TodayBadge />
      </section>

      <div className="desktop-grid">
        <WorksGrid />
        <TagCloud />
      </div>
    </Layout>
  );
}
