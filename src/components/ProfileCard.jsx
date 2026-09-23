import { profile } from '../data/portfolio.js';

export default function ProfileCard() {
  return (
    <section className="profile-card">
      <div className="avatar-wrapper">
        <div className="avatar-ring" />
        <div className="avatar">
          <img src={profile.avatar} alt="我的头像" />
          <span className="online-dot" title="在线中" />
        </div>
      </div>

      <h1 className="nickname">
        <span className="jp-title">{profile.jpTitle}</span>
        <span className="cn-name">{profile.cnName}</span>
      </h1>

      <p className="bio">{profile.bio}</p>

      <div className="status-row">
        {profile.status.map((s, i) => (
          <span className="status-badge" key={i}>
            <i className={s.icon} /> {s.text}
          </span>
        ))}
      </div>
    </section>
  );
}