import { useState } from 'react';

/**
 * 贴纸上传表单（需 token 鉴权）
 * POST /api/upload  multipart/form-data { file, tag }
 * 生产环境 token 存 Cloudflare env UPLOAD_SECRET
 * 前端 token 通过页面底部一个"管理员开关"触发（不硬编码在公开 JS 里）
 */
const API = '/api/upload';

const ACCEPTED = 'image/jpeg,image/png,image/gif,image/webp';

export default function StickerUpload({ onUploaded }) {
  const [token, setToken] = useState('');
  const [file, setFile] = useState(null);
  const [tag, setTag] = useState('');
  const [uploading, setUploading] = useState(false);
  const [msg, setMsg] = useState(null); // { ok: bool, text: str }

  const handleSubmit = async (e) => {
    e.preventDefault();
    if (!file || !token) {
      setMsg({ ok: false, text: '请先填写 token 并选择文件' });
      return;
    }

    setUploading(true);
    setMsg(null);

    try {
      const fd = new FormData();
      fd.append('file', file);
      if (tag) fd.append('tag', tag);

      const res = await fetch(API, {
        method: 'POST',
        headers: { 'X-Upload-Token': token },
        body: fd,
      });

      const data = await res.json().catch(() => ({}));

      if (!res.ok) {
        throw new Error(data.error || `HTTP ${res.status}`);
      }

      setMsg({ ok: true, text: `✅ 上传成功！ID=${data.id}  ${data.url}` });
      setFile(null);
      setTag('');
      if (onUploaded) onUploaded();
    } catch (err) {
      setMsg({ ok: false, text: `❌ ${err.message}` });
    } finally {
      setUploading(false);
    }
  };

  return (
    <section className="section stickers-section admin-section">
      <h2 className="section-title">
        <span className="title-icon">🔐</span>
        上传贴纸 · 管理员
      </h2>

      <form className="upload-form" onSubmit={handleSubmit}>
        <label className="form-row">
          <span>鉴权 Token</span>
          <input
            type="password"
            placeholder="UPLOAD_SECRET 的值"
            value={token}
            onChange={(e) => setToken(e.target.value)}
            autoComplete="off"
          />
        </label>

        <label className="form-row">
          <span>选择文件</span>
          <input
            type="file"
            accept={ACCEPTED}
            onChange={(e) => setFile(e.target.files?.[0] || null)}
          />
          {file && (
            <span className="file-info">
              {file.name} · {(file.size / 1024).toFixed(1)} KB · {file.type}
            </span>
          )}
        </label>

        <label className="form-row">
          <span>标签（可选）</span>
          <input
            type="text"
            placeholder="如：搞怪 / 卖萌 / 颜艺"
            value={tag}
            maxLength={20}
            onChange={(e) => setTag(e.target.value)}
          />
        </label>

        <button
          type="submit"
          className="upload-btn"
          disabled={uploading || !file}
        >
          {uploading ? '🌀 上传中…' : '🌸 上传到 R2'}
        </button>

        {msg && (
          <div className={`form-msg ${msg.ok ? 'ok' : 'err'}`}>
            {msg.text}
          </div>
        )}
      </form>
    </section>
  );
}
