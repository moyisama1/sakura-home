import { useState, useMemo, useEffect } from 'react';
import { createPortal } from 'react-dom';
import { stickers } from '../data/stickers.js';

/**
 * 纯静态贴纸浏览网格（方案 A：无后端）
 * 图片放 public/stickers/，数据在 src/data/stickers.js
 * 点击打开预览大图 · 右键/长按保存 · 按 tag 筛选
 * 预览遮罩用 React Portal 渲染到 body 根节点，避免被 container 遮挡
 */
export default function StickerGallery() {
  const [activeTag, setActiveTag] = useState('');
  const [preview, setPreview] = useState(null);

  // 按 tag 筛选
  const filtered = useMemo(() => {
    if (!activeTag) return stickers;
    return stickers.filter((s) => s.tag === activeTag);
  }, [activeTag]);

  // 所有 tag（去重 + 过滤空）
  const allTags = useMemo(
    () => [...new Set(stickers.map((s) => s.tag).filter(Boolean))],
    []
  );

  // 构造完整 URL（Vite 开发时 / 部署后 都兼容）
  const urlOf = (file) => {
    if (!file) return '';
    if (/^https?:\/\//.test(file)) return file;
    return `/stickers/${file}`;
  };

  // 打开预览时锁 body 滚动 + ESC 关闭
  useEffect(() => {
    if (!preview) return;
    document.body.style.overflow = 'hidden';
    const onKey = (e) => { if (e.key === 'Escape') setPreview(null); };
    window.addEventListener('keydown', onKey);
    return () => {
      document.body.style.overflow = '';
      window.removeEventListener('keydown', onKey);
    };
  }, [preview]);

  return (
    <section className="section stickers-section">
      <h2 className="section-title">
        <span className="title-icon">🍡</span>
        魔法贴纸库
        <span className="sticker-count">{filtered.length}</span>
      </h2>

      {/* Tag 筛选 */}
      {allTags.length > 0 && (
        <div className="tag-filter">
          <button
            className={`tag-filter-btn ${activeTag === '' ? 'active' : ''}`}
            onClick={() => setActiveTag('')}
          >
            全部
          </button>
          {allTags.map((t) => (
            <button
              key={t}
              className={`tag-filter-btn ${activeTag === t ? 'active' : ''}`}
              onClick={() => setActiveTag(t === activeTag ? '' : t)}
            >
              {t}
            </button>
          ))}
        </div>
      )}

      {filtered.length === 0 ? (
        <p className="hint">
          🍬 还没有贴纸哦～
          <br />
          把 jpg / gif 图片放到 <code>public/stickers/</code>，
          <br />
          再在 <code>src/data/stickers.js</code> 里加一条记录就好啦！
        </p>
      ) : (
        <div className="stickers-grid">
          {filtered.map((s, i) => (
            <div
              key={s.file + i}
              className="sticker-card"
              onClick={() =>
                setPreview({
                  ...s,
                  url: urlOf(s.file),
                })
              }
            >
              <img
                src={urlOf(s.file)}
                alt={s.file}
                loading="lazy"
                draggable={false}
                onError={(e) => {
                  e.target.src =
                    "data:image/svg+xml;utf8,<svg xmlns='http://www.w3.org/2000/svg' width='80' height='80' viewBox='0 0 80 80'><rect width='80' height='80' fill='%23fbe2ee'/><text x='50%25' y='50%25' dominant-baseline='middle' text-anchor='middle' font-size='24'>🌸</text></svg>";
                }}
              />
              {s.tag && <span className="sticker-tag">{s.tag}</span>}
            </div>
          ))}
        </div>
      )}

      {/* 预览遮罩 → Portal 到 body 根节点，彻底脱离 stacking context */}
      {preview && createPortal(
        <div className="preview-overlay" onClick={() => setPreview(null)}>
          <div className="preview-box" onClick={(e) => e.stopPropagation()}>
            <img src={preview.url} alt={preview.file} />
            <div className="preview-info">
              <p className="preview-fname">{preview.file}</p>
              {preview.tag && <p className="preview-meta">{preview.tag}</p>}
              <div className="preview-actions">
                <a
                  href={preview.url}
                  download={preview.file}
                  className="preview-btn"
                >
                  💾 下载
                </a>
                <button
                  className="preview-btn ghost"
                  onClick={() => setPreview(null)}
                >
                  关闭
                </button>
              </div>
            </div>
          </div>
        </div>,
        document.body
      )}
    </section>
  );
}
