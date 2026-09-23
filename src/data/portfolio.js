// ============ 《魔法少女ノ魔女裁判》主题个人信息 ============
// 改这里就能定制你自己的内容 ✨

export const profile = {
  // 日语标题 + 中文名
  jpTitle: '桜羽エマ',
  cnName: '樱羽 · エマ',
  // 头像：主角风 AI 同人图（哥特萝莉 + 粉毛双马尾）
  avatar:
    'https://upload-bbs.miyoushe.com/upload/2025/08/08/301948200/7f2d1ecefc7a3090aa071d30a2bdd23c_43893946314782340.jpg?x-oss-process=image/resize,s_600/quality,q_80/auto-orient,0/interlace,1/format,jpg',
  bio: [
    '「この中に、魔女になった少女がいる」',
    '——《魔法少女ノ魔女裁判》 实况 / 考据 / 同人',
    '一个在牢屋敷里寻找真相的 658 号囚人 🔎',
  ].join('\n'),
  status: [
    { icon: 'fa-solid fa-scale-balanced', text: '进行中：第 3 章 魔女裁判' },
    { icon: 'fa-solid fa-owl', text: '暗号解读：进行中' },
    { icon: 'fa-solid fa-moon', text: '时区：UTC+8' },
  ],
};

// ============ 技能 / 关键词标签（游戏 + 个人双线） ============
export const tags = [
  { name: '魔女裁判', color: 'pink' },
  { name: 'Acacia', color: 'purple' },
  { name: '梅まろ', color: 'pink' },
  { name: 'SLAVE.V-V-R', color: 'mint' },
  { name: '推理考据', color: 'blue' },
  { name: '哥特萝莉', color: 'purple' },
  { name: 'TypeScript', color: 'blue' },
  { name: 'React', color: 'mint' },
  { name: '像素风', color: 'peach' },
  { name: '同人插画', color: 'pink' },
  { name: '游戏实况', color: 'blue' },
  { name: '神秘学', color: 'purple' },
];

// ============ 作品 / 项目（游戏相关） ============
export const works = [
  {
    emoji: '🔮',
    title: '魔女裁判 · 全流程实况',
    desc: '逐章通关解说 + 隐藏路线考据 · 全结局收集',
    url: 'https://www.bilibili.com/video/BV1XTqKBaED9/?spm_id_from=333.337.search-card.all.click',
    gradient: 'linear-gradient(135deg, #d4a5f7, #8ec5fc)',
  },
  {
    emoji: '🗝️',
    title: '牢屋敷暗号全解',
    desc: '日语原文比对 + 多语言考据 + 黑幕推测',
    url: '#',
    gradient: 'linear-gradient(135deg, #ff9ab5, #6b4cff)',
  },
  {
    emoji: '🎨',
    title: 'まのさば 同人集',
    desc: 'エマ / ヒロ / ココ 角色同人 · 梅まろ风临摹',
    url: 'https://twiman.net/search?q=%E3%81%BE%E3%81%AE%E3%81%95%E3%81%B0&m=tweet&o=1',
    gradient: 'linear-gradient(135deg, #fce0a6, #ff6b94)',
  },
  {
    emoji: '📝',
    title: '设定考据 Blog',
    desc: '每话剧情分析 · 伏笔回收 · 魔法系统解析',
    url: 'https://www.bilibili.com/video/BV1Do4S6hEan/?spm_id_from=333.337.search-card.all.click',
    gradient: 'linear-gradient(135deg, #c9ecd4, #6b4cff)',
  },
];

// ============ 社交链接 ============
export const links = [
  { key: 'bilibili', icon: 'fa-brands fa-bilibili', label: 'B 站 · 实况录像', url: 'https://www.bilibili.com/video/BV1XTqKBaED9/?spm_id_from=333.337.search-card.all.click' },
  { key: 'github', icon: 'fa-brands fa-github', label: 'GitHub · 考据笔记', url: 'https://github.com/moyisama1' },
  { key: 'twitter', icon: 'fa-brands fa-x-twitter', label: 'Pixiv · 同人插图', url: 'https://www.pixiv.net/tags/%E9%AD%94%E6%B3%95%E5%B0%91%E5%A5%B3%E3%83%8E%E9%AD%94%E5%A5%B3%E8%A3%81%E5%88%A4' },
//   { key: 'weibo', icon: 'fa-brands fa-weibo', label: '微博 · 碎碎念', url: '#' },
  { key: 'steam', icon: 'fa-brands fa-steam', label: 'Steam · 库', url: 'https://steamcommunity.com/profiles/76561198835418480/' },
  { key: 'email', icon: 'fa-solid fa-envelope', label: '邮箱 · 考据交流', url: 'mailto:2383899071@qq.com' },
];
