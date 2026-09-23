import { tags } from '../data/portfolio.js';

export default function TagCloud() {
  return (
    <section className="section">
      <h2 className="section-title">
        <span className="title-icon">🎀</span>
        技能与爱好
      </h2>
      <div className="tag-cloud">
        {tags.map((t, i) => (
          <span
            key={t.name}
            className={`tag tag-${t.color}`}
            style={{ '--tag-idx': i }}
          >
            {t.name}
          </span>
        ))}
      </div>
    </section>
  );
}