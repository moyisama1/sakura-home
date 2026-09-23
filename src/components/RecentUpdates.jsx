import { timeline } from '../data/portfolio.js';

/** 最近动态 · 垂直时间线 */
export default function RecentUpdates() {
  // 日期格式：2026-09-23 → 9/23
  const fmtDate = (d) => {
    const [, m, day] = d.split('-');
    return `${parseInt(m)}/${parseInt(day)}`;
  };

  // tag 对应的色号（复用 .tag-* 那套的浅色调）
  const tagTint = {
    考据: 'timeline-tag-pink',
    同人: 'timeline-tag-purple',
    实况: 'timeline-tag-blue',
    碎碎念: 'timeline-tag-peach',
  };

  return (
    <section id="thoughts" className="section recent-updates">
      <h2 className="section-title">
        <span className="title-icon">📜</span>
        最近动态
      </h2>
      <div className="timeline">
        {timeline.map((item, i) => (
          <div className="timeline-item" key={i}>
            <div className="timeline-rail">
              <span className="timeline-dot" />
              {i < timeline.length - 1 && <span className="timeline-line" />}
            </div>
            <div className="timeline-content">
              <div className="timeline-head">
                <span className="timeline-date">{fmtDate(item.date)}</span>
                {item.tag && (
                  <span className={`timeline-tag ${tagTint[item.tag] || 'timeline-tag-peach'}`}>
                    {item.tag}
                  </span>
                )}
              </div>
              <p className="timeline-text">
                <span className="timeline-emoji">{item.emoji}</span>
                {item.text}
              </p>
            </div>
          </div>
        ))}
      </div>
    </section>
  );
}
