import { works } from '../data/portfolio.js';

export default function WorksGrid() {
  return (
    <section className="section">
      <h2 className="section-title">
        <span className="title-icon">💖</span>
        作品集
      </h2>
      <div className="works-grid">
        {works.map((w) => (
          <a
            key={w.title}
            className="work-card"
            href={w.url}
            target="_blank"
            rel="noopener noreferrer"
            style={{ '--card-grad': w.gradient }}
          >
            <div className="work-emoji">{w.emoji}</div>
            <div className="work-info">
              <h3>{w.title}</h3>
              <p>{w.desc}</p>
            </div>
            <i className="fa-solid fa-arrow-up-right-from-square work-link" />
          </a>
        ))}
      </div>
    </section>
  );
}