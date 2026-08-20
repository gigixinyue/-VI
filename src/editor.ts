export type Reflection = {
  event: string; detail: string; before: string; after: string;
  insight: string; audience: string; action: string; change: string;
};

export const questions = [
  { key:'event', title:'具体发生了什么？', hint:'只写事情，先别写观点。' },
  { key:'detail', title:'哪个瞬间或细节最戳你？', hint:'找“好爽 / 好烦 / 好奇怪 / 居然这样”的地方。' },
  { key:'contrast', title:'它和你原来以为的有什么不一样？', hint:'寻找：我原来以为 A → 但后来发现 B。' },
  { key:'insight', title:'如果这一篇只能讲清楚一件事，你选什么？', hint:'一篇只讲一个发现。其他想法留给下一篇。' },
  { key:'audience', title:'谁也正在经历类似的问题？', hint:'描述一种处境，而不是只写年龄、性别或职业。' },
  { key:'action', title:'为了理解或解决它，你真的做了什么？', hint:'试过、买过、学过、比较过、失败过、改过、观察过，都算。' },
  { key:'change', title:'经历这件事以后，你有什么地方和以前不一样了？', hint:'想法、能力、做法或新问题；没有也没关系。' },
] as const;

export function diagnose(r: Reflection) {
  const insights = r.insight.split(/[；;。\n]/).filter(Boolean);
  const hasContrast = Boolean(r.before.trim() && r.after.trim());
  const hasAction = r.action.trim().length > 8;
  const hasChange = r.change.trim().length > 4;
  let type = '继续观察';
  if (r.event && r.insight && hasAction && (hasContrast || hasChange)) type = '主线候选';
  else if (r.event && r.insight && hasAction) type = '研究型内容';
  else if (r.event && r.detail) type = '轻内容';
  const strongest = hasContrast ? `最值得保留的是“${r.before} → ${r.after}”这段真实认知变化。` : `最值得保留的是这件真实发生的事：${r.event}`;
  const problem = insights.length > 2 ? `你现在写出了至少 ${insights.length} 个发现。这里很可能已经包含多个选题。` : !hasAction ? '现在最缺的是行动证据：你还需要真正试一次、比较一次或继续观察。' : '结构已经比较完整，下一步要避免继续加观点。';
  const focus = r.insight || '暂时还没有形成唯一发现，先不要急着想标题。';
  const next = type === '继续观察' ? '继续生活和观察，补足一个真实行动或认知变化后再回来。' : type === '轻内容' ? '可以低成本表达，不需要强行升华。' : '进入选题池；制作时只证明这个唯一发现。';
  return { type, strongest, problem, focus, next };
}

export function score(r: Reflection) {
  const s = {
    real: r.event.trim().length > 18 ? 2 : r.event ? 1 : 0,
    specific: r.detail.trim().length > 18 ? 2 : r.detail ? 1 : 0,
    contrast: r.before && r.after ? 2 : (r.before || r.after) ? 1 : 0,
    action: r.action.trim().length > 18 ? 2 : r.action ? 1 : 0,
    resonance: r.audience.trim().length > 15 ? 2 : r.audience ? 1 : 0,
    extensibility: r.change.trim().length > 12 ? 2 : r.change ? 1 : 0,
  };
  return { ...s, total: Object.values(s).reduce((a,b)=>a+b,0) };
}

export const EDITOR_PRINCIPLES = [
  '具体先于抽象','经验先于知识','行动先于结论','一篇只讲一个发现',
  '探索者优先于老师','真实变化优先于漂亮金句','不要为了深刻而深刻'
];
