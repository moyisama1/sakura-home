// ============ Cloudflare Pages Function: GET /api/stickers ============
// 前端浏览贴纸列表（公开，无鉴权）
// 从 D1 查元数据 → 拼 R2 公开 URL 返回
// Cloudflare Dashboard 绑定：
//   R2 Bucket:   stickers (variable name: STICKERS_BUCKET)
//   D1 Database: stickersdb (variable name: STICKERS_DB)
//   环境变量:    R2_PUBLIC_URL (如 https://stickers-<accountid>.r2.dev)

export async function onRequest(context) {
  const { STICKERS_DB, R2_PUBLIC_URL } = context.env;

  if (!STICKERS_DB) {
    return new Response(JSON.stringify({ error: 'D1 未绑定' }), {
      status: 500,
      headers: { 'Content-Type': 'application/json' },
    });
  }

  // 可选：按 tag 筛选  /api/stickers?tag=搞怪
  const url = new URL(context.request.url);
  const tag = url.searchParams.get('tag');

  let results;
  try {
    if (tag) {
      const stmt = STICKERS_DB.prepare(
        'SELECT * FROM stickers WHERE tag = ? ORDER BY uploaded_at DESC'
      ).bind(tag);
      results = await stmt.all();
    } else {
      const stmt = STICKERS_DB.prepare(
        'SELECT * FROM stickers ORDER BY uploaded_at DESC'
      );
      results = await stmt.all();
    }
  } catch (e) {
    return new Response(JSON.stringify({ error: e.message }), {
      status: 500,
      headers: { 'Content-Type': 'application/json' },
    });
  }

  const items = (results.results || []).map((row) => ({
    id: row.id,
    filename: row.filename,
    tag: row.tag,
    uploaded_at: row.uploaded_at,
    url: `${R2_PUBLIC_URL || ''}/${row.r2_key}`,
  }));

  return new Response(JSON.stringify({ items, count: items.length }), {
    headers: {
      'Content-Type': 'application/json',
      'Cache-Control': 'public, max-age=60', // 1 分钟缓存
    },
  });
}
