import { useEffect, useState, useCallback } from 'react';

/**
 * 贴纸浏览网格
 * GET /api/stickers → R2 公开 URL → 网格展示
 * 点击打开预览大图 · 右键/长按保存 · 按 tag 筛选
 */
const API = '/api/stickers';

export default function StickerGallery() {
  const [items, setItems] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);
  const [activeTag, setActiveTag] = useState('');
  const [preview, setPreview] = useState(null);

  const fetchStickers = useCallback(async (tag = '') => {
    setLoading(true);
    setError(null);
    try {
      const qs = tag ? `?tag=${encodeURIComponent(tag)}` : '';
      const res = await fetch(`${API}${qs}`);
      if (!res.ok) throw new Error(`HTTP ${res.status}`);
      const json = await res.json();
      setItems(json.items || []);
    } catch (e) {
      setError(e.message);
    } finally {
      setLoading(false);
    }
  }, []);

  useEffect(() => {
    fetchStickers(activeTag);
  }, [activeTag, fetchStickers]);

  // 从已有数据提取所有 tag（+ "全部"）
  const allTags = [
    ...new Set(items.map((i) => i.tag).filter(Boolean)),
  ];

  return (
    <section className="section stickers-section">
      <h2 className="section-title">
        <span className="title-icon">🍡</span>
        魔法贴纸库
        <span className="sticker-count">{items.length}</span>
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

      {loading && <p className="hint">🌀 召唤贴纸中…</p>}
      {error && <p className="hint error">⚠️ 加载失败：{error}</p>}

      {!loading && !error && items.length === 0 && (
        <p className="hint">🍬 还没有贴纸哦，去上传页添加第一张吧！</p>
      )}

      {items.length > 0 && (
        <div className="stickers-grid">
          {items.map((s) => (
            <div
              key={s.id}
              className="sticker-card"
              onClick={() => setPreview(s)}
            >
              <img
                src={s.url}
                alt={s.filename}
                loading="lazy"
                draggable={false}
              />
              {s.tag && <span className="sticker-tag">{s.tag}</span>}
            </div>
          ))}
        </div>
      )}

      {/* 预览遮罩 */}
      {preview && (
        <div
          className="preview-overlay"
          onClick={() => setPreview(null)}
        >
          <div className="preview-box" onClick={(e) => e.stopPropagation()}>
            <img src={preview.url} alt={preview.filename} />
            <div className="preview-info">
              <p className="preview-fname">{preview.filename}</p>
              <p className="preview-meta">
                {preview.tag} · {preview.uploaded_at?.slice(0, 16)}
              </p>
              <div className="preview-actions">
                <a
                  href={preview.url}
                  download={preview.filename}
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
        </div>
      )}
    </section>
  );
}
