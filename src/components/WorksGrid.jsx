import { works, tags } from '../data/portfolio.js';

// 建立 skill name → color 的查表（复用 TagCloud 那套配色）
const tagColorMap = new Map(tags.map((t) => [t.name, t.color]));

// 给定 skill 名，返回对应的 tag-* class 后缀，没匹配到就默认 peach
const colorOf = (name) => tagColorMap.get(name) || 'peach';

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
              {/* --- 关联技能小标签 --- */}
              {w.skills && w.skills.length > 0 && (
                <div className="work-skills">
                  {w.skills.map((s) => (
                    <span
                      key={s}
                      className={`work-skill-tag tag-${colorOf(s)}`}
                    >
                      #{s}
                    </span>
                  ))}
                </div>
              )}
            </div>
            <i className="fa-solid fa-arrow-up-right-from-square work-link" />
          </a>
        ))}
      </div>
    </section>
  );
}
