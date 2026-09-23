// ============ Cloudflare Pages Function: POST /api/upload ============
// 上传贴纸（需鉴权：header X-Upload-Token 必须等于 UPLOAD_SECRET）
// multipart/form-data → 解析文件 → 存 R2 → 写 D1
// 支持 jpg / png / gif / webp
// Cloudflare Dashboard 绑定：
//   R2 Bucket:   stickers (variable name: STICKERS_BUCKET)
//   D1 Database: stickersdb (variable name: STICKERS_DB)
//   环境变量:    UPLOAD_SECRET (自定义字符串，前端上传时用)

const ALLOWED_TYPES = ['image/jpeg', 'image/png', 'image/gif', 'image/webp'];
const MAX_SIZE = 10 * 1024 * 1024; // 10MB 上限

function extFromMime(mime) {
  return {
    'image/jpeg': 'jpg',
    'image/png': 'png',
    'image/gif': 'gif',
    'image/webp': 'webp',
  }[mime] || 'bin';
}

export async function onRequest(context) {
  const { STICKERS_BUCKET, STICKERS_DB, UPLOAD_SECRET, R2_PUBLIC_URL } = context.env;

  // 1. 鉴权
  const token = context.request.headers.get('X-Upload-Token');
  if (!UPLOAD_SECRET || token !== UPLOAD_SECRET) {
    return new Response(JSON.stringify({ error: '鉴权失败' }), {
      status: 401,
      headers: { 'Content-Type': 'application/json' },
    });
  }

  if (!STICKERS_BUCKET || !STICKERS_DB) {
    return new Response(JSON.stringify({ error: 'R2/D1 未绑定' }), {
      status: 500,
      headers: { 'Content-Type': 'application/json' },
    });
  }

  // 2. 解析 multipart
  let formData;
  try {
    formData = await context.request.formData();
  } catch {
    return new Response(JSON.stringify({ error: '请求格式错误，需要 multipart/form-data' }), {
      status: 400,
      headers: { 'Content-Type': 'application/json' },
    });
  }

  const file = formData.get('file');
  const tag = (formData.get('tag') || '').toString().slice(0, 20);

  if (!file) {
    return new Response(JSON.stringify({ error: '缺少文件字段 file' }), {
      status: 400,
      headers: { 'Content-Type': 'application/json' },
    });
  }

  // 3. 校验
  if (!ALLOWED_TYPES.includes(file.type)) {
    return new Response(JSON.stringify({ error: `不支持的类型 ${file.type}，仅允许 jpg/png/gif/webp` }), {
      status: 400,
      headers: { 'Content-Type': 'application/json' },
    });
  }
  if (file.size > MAX_SIZE) {
    return new Response(JSON.stringify({ error: `文件过大 ${(file.size / 1024 / 1024).toFixed(1)}MB，上限 10MB` }), {
      status: 413,
      headers: { 'Content-Type': 'application/json' },
    });
  }

  // 4. 生成 R2 key: stickers/2026/09/uuid.ext
  const ext = extFromMime(file.type);
  const now = new Date();
  const y = now.getUTCFullYear();
  const m = String(now.getUTCMonth() + 1).padStart(2, '0');
  const uuid = crypto.randomUUID();
  const r2Key = `stickers/${y}/${m}/${uuid}.${ext}`;
  const filename = file.name || `${uuid}.${ext}`;

  // 5. 写 R2
  try {
    await STICKERS_BUCKET.put(r2Key, file, {
      httpMetadata: { contentType: file.type },
    });
  } catch (e) {
    return new Response(JSON.stringify({ error: `R2 写入失败: ${e.message}` }), {
      status: 500,
      headers: { 'Content-Type': 'application/json' },
    });
  }

  // 6. 写 D1
  let result;
  try {
    const stmt = STICKERS_DB.prepare(
      'INSERT INTO stickers (filename, r2_key, tag) VALUES (?, ?, ?)'
    ).bind(filename, r2Key, tag || '未分类');
    result = await stmt.run();
  } catch (e) {
    // 回滚 R2
    try { await STICKERS_BUCKET.delete(r2Key); } catch {}
    return new Response(JSON.stringify({ error: `D1 写入失败: ${e.message}` }), {
      status: 500,
      headers: { 'Content-Type': 'application/json' },
    });
  }

  return new Response(
    JSON.stringify({
      ok: true,
      id: result.lastRowId,
      filename,
      tag: tag || '未分类',
      url: `${R2_PUBLIC_URL || ''}/${r2Key}`,
    }),
    {
      status: 201,
      headers: { 'Content-Type': 'application/json' },
    }
  );
}

// 只允许 POST
export const onRequestGet = () =>
  new Response(JSON.stringify({ error: 'Use GET /api/stickers instead' }), {
    status: 405,
    headers: { Allow: 'POST' },
  });
