// 课程数据体检：node tools/validate.mjs
import fs from 'node:fs';
import path from 'node:path';

const root = path.resolve(import.meta.dirname, '..');
const win = {};
const files = ['w1', 'w2', 'w3', 'w4', 'w5'].map(f => path.join(root, 'data', f + '.js'));
for (const f of files) {
  const code = fs.readFileSync(f, 'utf8');
  new Function('window', code)(win);
}
const DAYS = win.PY_DAYS || [];
const errs = [];
const warns = [];
const TYPES = new Set(['concept', 'tool', 'drill', 'quiz', 'fill', 'blank', 'order', 'write']);
const ids = new Set();
let cards = 0, byType = {};

DAYS.forEach(d => {
  if (!d.id) errs.push('day 缺 id');
  if (ids.has(d.id)) errs.push(`day ${d.id} 重复`);
  ids.add(d.id);
  if (d.week == null) errs.push(`day ${d.id} 缺 week`);
  for (const k of ['title', 'subtitle', 'theme']) if (!d[k]) errs.push(`day ${d.id} 缺 ${k}`);
  if (!Array.isArray(d.cards) || d.cards.length < 4) errs.push(`day ${d.id} 卡片太少 (${d.cards && d.cards.length})`);
  (d.cards || []).forEach((c, i) => {
    cards++;
    const tag = `D${d.id}#${i + 1}(${c.type})`;
    byType[c.type] = (byType[c.type] || 0) + 1;
    if (!TYPES.has(c.type)) return errs.push(`${tag} 未知类型`);
    if (!c.q && !c.title && !c.name) errs.push(`${tag} 缺题目/标题`);
    if (c.type === 'tool') {
      if (!c.name) errs.push(`${tag} 缺 name`);
      if (!c.syntax) errs.push(`${tag} 缺 syntax`);
      if (!c.returns) errs.push(`${tag} 缺 returns（返回什么）`);
      if (!c.example) errs.push(`${tag} 缺 example（例子）`);
      if (!Array.isArray(c.pitfalls) || !c.pitfalls.length) errs.push(`${tag} 没有 pitfalls（至少一条坑）`);
    }
    if (c.type === 'drill') {
      if (!Array.isArray(c.steps) || c.steps.length < 2) errs.push(`${tag} steps 少于 2 问`);
      if (c.setup !== undefined && (typeof c.setup !== 'string' || !c.setup.trim())) errs.push(`${tag} setup 必须是非空字符串`);
      (c.steps || []).forEach((s, j) => {
        const st = `${tag}.${j + 1}`;
        if (!s.q) errs.push(`${st} 缺 q`);
        if (s.code !== undefined && typeof s.code !== 'string') errs.push(`${st} code 必须是字符串`);
        if (!Array.isArray(s.options) || s.options.length < 2) errs.push(`${st} 选项不足`);
        else if (!(s.answer >= 0 && s.answer < s.options.length)) errs.push(`${st} answer 越界`);
        else if (new Set(s.options).size !== s.options.length) errs.push(`${st} 选项重复`);
        if (!s.explain) errs.push(`${st} 缺 explain`);
        // 题目里出现了变量，但这一段既没 setup 也没 code、文字里也没交代 —— 做题的人看不到上下文
        const inline = /[=＝]|有|表|列|for \w+ in/.test(s.q)
        const vars = (s.q.match(/\b(x|df|p|students)\b(?=\[|\.|\)|,|\s)/g) || []).slice(0, 3)
        if (vars.length && !inline && !c.setup && !s.code) warns.push(`${st} 提到 ${[...new Set(vars)].join('/')} 但没显示数据`);
      });
    }
    if (c.type === 'quiz') {
      if (!Array.isArray(c.options) || c.options.length < 2) errs.push(`${tag} 选项不足`);
      else if (!(c.answer >= 0 && c.answer < c.options.length)) errs.push(`${tag} answer 越界`);
      if (c.options && new Set(c.options).size !== c.options.length) errs.push(`${tag} 选项重复`);
      if (!c.explain) errs.push(`${tag} 缺 explain`);
    }
    if (c.type === 'fill') {
      if (!Array.isArray(c.accept) || !c.accept.length) errs.push(`${tag} 缺 accept`);
      if (!c.explain) errs.push(`${tag} 缺 explain`);
    }
    if (c.type === 'blank') {
      if (!String(c.code || '').includes('___')) errs.push(`${tag} code 里没有 ___ 占位`);
      if (!Array.isArray(c.options) || c.options.length < 2) errs.push(`${tag} 选项不足`);
      else if (!(c.answer >= 0 && c.answer < c.options.length)) errs.push(`${tag} answer 越界`);
      if (!c.explain) errs.push(`${tag} 缺 explain`);
    }
    if (c.type === 'order') {
      if (!Array.isArray(c.lines) || c.lines.length < 2) errs.push(`${tag} lines 不足`);
      if (!c.explain) errs.push(`${tag} 缺 explain`);
    }
    if (c.type === 'write') {
      if (typeof c.answer !== 'string' || !c.answer.trim()) errs.push(`${tag} 缺 answer`);
    }
    if (c.type === 'concept') {
      if (!c.body) errs.push(`${tag} 缺 body`);
    }
  });
});

// 「用了但没讲」：正确选项里出现的 参数=值，必须在同一天更早的 concept/tool 卡里出现过
// （错选项不用管 —— 都是故意写成看着对的诱饵）
const SKIP = new Set(['sep', 'encoding', 'header', 'index_col', 'sheet_name', 'engine', 'mode']); // 语法糖，允许出现在诱饵里
let taught = '';
DAYS.forEach((d) => {
  d.cards.forEach((c, i) => {
    const miss = [];
    const scan = (text) => {
      for (const m of (text || '').matchAll(/\b([a-z_]{3,})\s*=\s*(?:True|False|"[^"]*"|'[^']*'|\d+)/g)) {
        if (!taught.includes(m[1]) && !SKIP.has(m[1]) && !miss.includes(m[1])) miss.push(m[1]);
      }
    };
    if (c.type === 'blank' || c.type === 'quiz') scan(c.options[c.answer]);
    if (c.type === 'drill') (c.steps || []).forEach((s) => scan(s.options[s.answer]));
    if (miss.length) warns.push(`D${d.id}#${i} 的正确选项用了没讲过的 ${miss.join('/')}`);
    if (c.type === 'concept' || c.type === 'tool') taught += JSON.stringify(c) + ' ';
  });
});

for (let i = 1; i <= 35; i++) if (!ids.has(i)) errs.push(`缺少第 ${i} 关`);
const sorted = [...ids].filter((n) => n <= 35).sort((a, b) => a - b);
if (sorted.join() !== [...Array(35)].map((_, i) => i + 1).join()) warns.push('关卡编号不连续: ' + sorted.join(','));

const cnt = s => (s.match(/[a-zA-Z_][a-zA-Z_0-9]*/g) || []).length;

console.log(`关卡数 ${DAYS.length} · 卡片数 ${cards}`);
console.log('类型分布', byType);
console.log(errs.length ? `\n❌ ${errs.length} 个问题:\n - ` + errs.join('\n - ') : '\n✅ 数据体检全通过');
if (warns.length) console.log(`\n⚠️ ${warns.length} 条提醒:\n - ` + warns.join('\n - '));
process.exit(errs.length ? 1 : 0);
