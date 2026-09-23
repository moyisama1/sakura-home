import { useMemo } from 'react';

/** 《魔法少女ノ魔女裁判》主题状态条：章节 / 囚人番号 / 今日魔法 */
const chapters = [
  '序章 · 牢屋敷',
  '第 1 章 · 魔女の予言',
  '第 2 章 · エマの秘密',
  '第 3 章 · 魔女裁判',
  '第 4 章 · 二階堂の正体',
  '终章 · 真実の扉',
];
const magics = ['🪄 言葉の魔法', '🗝️ 隠し部屋発見', '🔮 占い結果：凶', '🖋️ 新たな容疑者'];
const runes = ['✠', '☽', '⚜', '♆', '⚝', '☥', '✦'];

export default function TodayBadge() {
  const { ch, magic, rune } = useMemo(() => {
    const now = new Date();
    const idx = (now.getMonth() + now.getDate()) % chapters.length;
    return {
      ch: chapters[idx],
      magic: magics[(now.getHours()) % magics.length],
      rune: runes[now.getDate() % runes.length],
    };
  }, []);

  return (
    <div className="today-badge" role="status" aria-label="魔女裁判状态">
      <span className="today-emoji">🔮</span>
      <span>{ch}</span>
      <span className="today-sep">{rune}</span>
      <span>{magic}</span>
    </div>
  );
}
