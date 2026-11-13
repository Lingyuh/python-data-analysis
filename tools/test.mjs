// 端到端流程测试：真的点进去答完关卡、复用存档、跑复习关
import fs from 'node:fs';
import path from 'node:path';
import { JSDOM } from 'jsdom';

const root = path.resolve(import.meta.dirname, '..');
let html = fs.readFileSync(path.join(root, 'index.html'), 'utf8');
const inline = (p) => `<script>\n${fs.readFileSync(path.join(root, p), 'utf8')}\n</script>`;
for (const f of ['data/w1.js', 'data/w2.js', 'data/w3.js', 'data/w4.js', 'data/w5.js', 'app.js']) {
  html = html.replace(`<script src="${f}"></script>`, inline(f));
}

const errs = [];
const check = (cond, label) => { if (cond) console.log('  ✓ ' + label); else { console.log('  ✗ ' + label); errs.push(label); } };
const sleep = (ms = 0) => new Promise((r) => setTimeout(r, ms));
const txt = (n) => (n ? n.textContent.replace(/\s+/g, ' ').trim() : '');

function boot(seed) {
  const dom = new JSDOM(html, {
    url: 'https://test.local/', runScripts: 'dangerously', pretendToBeVisual: true,
    beforeParse(w) { if (seed) w.localStorage.setItem('pybz.v1', seed); },
  });
  dom.virtualConsole.on('jsdomError', () => {});
  return dom;
}

function makeHelpers(dom) {
  const doc = dom.window.document;
  const all = (sel) => [...doc.querySelectorAll(sel)];
  const byText = (sel, t) => all(sel).find((n) => txt(n).includes(t));
  return { doc, all, byText };
}

async function answerOneCard(dom) {
  const { doc, all, byText } = makeHelpers(dom);
  const opts = all('.qcard .opt'), chips = all('.qcard .chipbtn'), pool = all('.orderbox.pool .oline');
  const inp = doc.querySelector('.qcard input[type=text]'), ta = doc.querySelector('.qcard textarea');
  if (opts.length) { opts[0].click(); await sleep(2); return !!doc.querySelector('.feedback'); }
  if (chips.length) { chips[0].click(); await sleep(2); return !!doc.querySelector('.feedback'); }
  if (pool.length) {
    const n = pool.length;
    for (let i = 0; i < n; i++) { all('.orderbox.pool .oline')[0].click(); await sleep(1); }
    const btn = byText('#footHost button', '检查顺序');
    if (!btn) return false;
    btn.click(); await sleep(2); return !!doc.querySelector('.feedback');
  }
  if (inp) {
    inp.value = '随便写的';
    inp.closest('form').dispatchEvent(new dom.window.Event('submit', { bubbles: true, cancelable: true }));
    await sleep(2); return !!doc.querySelector('.feedback');
  }
  if (ta) {
    byText('.qcard button', '看参考答案')?.click(); await sleep(2);
    byText('.qcard button', '我自己写对了')?.click(); await sleep(2);
    return !!doc.querySelector('.feedback');
  }
  return null;
}

async function playToEnd(dom, max = 200) {
  const { doc, byText } = makeHelpers(dom);
  for (let i = 0; i < max; i++) {
    if (doc.querySelector('#view-result.on')) return true;
    const concept = byText('#footHost button', '明白了');
    if (concept) { concept.click(); await sleep(3); continue; }
    const tool = byText('#footHost button', '记下了');
    if (tool) { tool.click(); await sleep(3); continue; }
    const ok = await answerOneCard(dom);
    if (ok === null) return false;
    const go = doc.querySelector('#footHost button');
    if (!go) return false;
    go.click(); await sleep(3);
  }
  return false;
}

const run = async () => {
  // ---------- 第一次打开 ----------
  let dom = boot(null);
  let { doc, all, byText } = makeHelpers(dom);
  await sleep(80);

  console.log('\n[1] 首次打开首页');
  check(!!doc.querySelector('#view-home.on'), '首页已渲染');
  check(/第 1 关/.test(txt(doc.querySelector('#view-home'))), '首页显示「第 1 关」');
  const heat = all('.heat i').length;
  check(heat >= 84, `热力图格子数量 ${heat}（≈12 周）`);
  check(all('.stats .stat').length === 4, '四个统计块');
  check(dom.window.PY_DAYS.length === 36, '36 个关卡已加载（35 关主线 + 1 关补课）');
  check(!!doc.querySelector('#logoSlot svg'), '吉祥物 SVG 已插入');
  check(/0 天/.test(txt(doc.querySelector('#chipStreak'))), '连击从 0 开始');

  console.log('\n[2] 打通第 1 关');
  byText('#view-home button', '开始第 1 关').click();
  await sleep(6);
  check(!!doc.querySelector('#view-learn.on'), '进入学习页');
  check(!!doc.querySelector('.qcard'), '卡片已渲染');
  check(/第 1 关/.test(txt(doc.querySelector('#learnTitle'))), '顶部显示关卡名');
  const done = await playToEnd(dom);
  check(done && !!doc.querySelector('#view-result.on'), '第 1 关打通，进入结算页');
  const rt = txt(doc.querySelector('#view-result'));
  check(/经验值/.test(rt) && /最高连击/.test(rt) && /连续打卡/.test(rt), '结算页有经验 / 连击 / 打卡');
  const st = JSON.parse(dom.window.localStorage.getItem('pybz.v1') || '{}');
  check(st.days?.['1']?.done === true, '存档：第 1 关标记完成');
  check(st.done >= 6, `存档：累计答过 ${st.done} 张`);
  check(Object.keys(st.srs || {}).length === 4, `存档：SRS 建了 ${Object.keys(st.srs || {}).length} 条（第 1 关 4 张可判分卡）`);
  check(st.streak === 1 && !!st.lastStudy, '存档：打卡 1 天');

  console.log('\n[3] 第 2 关（覆盖选择/填空/排序/写作）');
  byText('#view-result button', '下一关').click();
  await sleep(6);
  check(!!doc.querySelector('#view-learn.on'), '进入第 2 关');
  check(await playToEnd(dom), '第 2 关也能打通');

  console.log('\n[4] 课程地图 / 错题本 / 设置');
  byText('#view-result button', '回首页')?.click(); await sleep(5);
  byText('#view-home .qbtn', '课程地图').click(); await sleep(5);
  check(!!doc.querySelector('#view-map.on'), '课程地图已渲染');
  check(all('#view-map .dcard').length === 36, `地图上 ${all('#view-map .dcard').length} 个关卡`);
  check(all('#view-map .dcard.done').length === 2, '两个已完成关卡有 ✓');
  byText('#view-map button', '回首页').click(); await sleep(4);
  byText('#view-home .qbtn', '错题本').click(); await sleep(4);
  check(!!doc.querySelector('#view-wrong.on'), '错题本已渲染');
  check(all('#view-wrong .wnote').length >= 1, `错题本里有 ${all('#view-wrong .wnote').length} 张卡`);
  byText('#view-wrong button', '回首页').click(); await sleep(4);
  doc.querySelector('#btnSettings').click(); await sleep(4);
  check(!doc.querySelector('#modal').classList.contains('hidden'), '设置弹窗能打开');
  check(/导出存档/.test(txt(doc.querySelector('#modal'))), '设置里有导出 / 导入存档');
  doc.querySelector('#modal .btn.dark')?.click(); await sleep(3);

  const saved = dom.window.localStorage.getItem('pybz.v1');

  // ---------- 复用存档：进度续上 ----------
  console.log('\n[5] 关掉重开（存档续上）');
  dom = boot(saved);
  ({ doc, all, byText } = makeHelpers(dom));
  await sleep(80);
  check(/第 3 关/.test(txt(doc.querySelector('#view-home'))), '重开后接着第 3 关');
  check(all('#view-home .stat').length === 4, '统计块重新渲染');
  check(/2\/35/.test(txt(doc.querySelector('#view-home'))), '已通关数 2/35');
  check(/2 天|1 天/.test(txt(doc.querySelector('#chipStreak'))), '打卡天数保留：' + txt(doc.querySelector('#chipStreak')));

  // ---------- 复习关：把 due 全部拨到过去 ----------
  console.log('\n[6] 复习关（SRS 到期）');
  const st2 = JSON.parse(saved);
  Object.keys(st2.srs).forEach((k) => { st2.srs[k].due = Date.now() - 60000; });
  dom = boot(JSON.stringify(st2));
  ({ doc, all, byText } = makeHelpers(dom));
  await sleep(80);
  const reviewBtn = byText('#view-home button', '复习');
  check(!!reviewBtn, '首页出现「复习 N 张」按钮');
  reviewBtn && reviewBtn.click();
  await sleep(6);
  check(!!doc.querySelector('#view-learn.on'), '复习关已开始');
  check(/复习关/.test(txt(doc.querySelector('#learnTitle'))), '标题是复习关：' + txt(doc.querySelector('#learnTitle')));
  check(await playToEnd(dom), '复习关能走完');

  // ---------- 键盘 ----------
  console.log('\n[7] 键盘操作');
  byText('#view-result button', '下一关')?.click();
  await sleep(6);
  if (all('.qcard .opt').length) {
    doc.dispatchEvent(new dom.window.KeyboardEvent('keydown', { key: '1', bubbles: true }));
    await sleep(5);
    check(!!doc.querySelector('.feedback'), '按 1 能作答');
    doc.dispatchEvent(new dom.window.KeyboardEvent('keydown', { key: 'Enter', bubbles: true }));
    await sleep(5);
    check(!!doc.querySelector('.qcard'), '按 Enter 进入下一张');
  } else {
    console.log('  - 首个卡片非选择题，键盘用例跳过');
  }

  console.log('\n[8] 第 8 关：工具卡 + 连问');
  const seed8 = JSON.parse(saved);
  seed8.days = {};
  for (let i = 1; i <= 7; i++) seed8.days[i] = { done: true, rate: 100, at: Date.now() };
  dom = boot(JSON.stringify(seed8));
  ({ doc, all, byText } = makeHelpers(dom));
  await sleep(80);
  check(/第 8 关/.test(txt(doc.querySelector('#view-home'))), '首页接着第 8 关');
  byText('#view-home button', '开始第 8 关').click();
  await sleep(6);
  byText('#footHost button', '明白了').click();
  await sleep(5);
  check(!!doc.querySelector('.toolcard'), '出现工具卡');
  check(all('.toolcard .trow2').length >= 2, '工具卡有「返回什么 / 什么时候用」' + `（${all('.toolcard .trow2').length} 行）`);
  check(all('.toolcard .pitfalls li').length >= 1, `工具卡有「会踩的坑」（${all('.toolcard .pitfalls li').length} 条）`);
  check(!!doc.querySelector('.toolcard pre.code'), '工具卡有语法 / 例子代码块');
  byText('#footHost button', '记下了').click();
  await sleep(5);
  byText('#footHost button', '记下了')?.click();
  await sleep(5);
  check(!!doc.querySelector('.drill-head'), '出现连问卡');
  check(/第 1 \/ 3 问/.test(txt(doc.querySelector('.drill-head'))), '连问显示 1/3：' + txt(doc.querySelector('.drill-head')));
  check(!!doc.querySelector('.drill-setup pre.code'), '连问卡顶部显示了「这几问都基于的数据」');
  check(/x = \[10, 20, 30, 40\]/.test(txt(doc.querySelector('.drill-setup'))), '数据就是本题用到的 x');
  check(await playToEnd(dom), '第 8 关（含工具卡 + 连问）能打通');
  check(!!doc.querySelector('#view-result.on'), '第 8 关进入结算页');

  console.log('\n[9] 半关暂停 / 下次续做');
  dom = boot(saved);
  ({ doc, all, byText } = makeHelpers(dom));
  await sleep(80);
  // 先做掉 1 关的前几张，再「先存着」
  byText('#view-home button', '开始第 3 关').click();
  await sleep(6);
  for (let i = 0; i < 3; i++) {
    const fb = byText('#footHost button', '明白了') || byText('#footHost button', '继续');
    if (fb) { fb.click(); await sleep(5); }
    const opt = all('.qcard .opt')[0] || all('.qcard .chipbtn')[0];
    if (opt) { opt.click(); await sleep(5); }
    const go = doc.querySelector('#footHost button');
    if (go && !/明白了|继续/.test(txt(go))) { go.click(); await sleep(5); }
  }
  const pauseBtn = byText('#view-learn button', '先存着');
  check(!!pauseBtn, '学习页有「⏸ 先存着」按钮');
  pauseBtn && pauseBtn.click();
  await sleep(8);
  const part = JSON.parse(dom.window.localStorage.getItem('pybz.v1')).part;
  check(!!part && part.dayId === 3 && part.left.length > 0, `存档记下了第 3 关剩 ${part ? part.left.length : 0} 张`);
  check(!!doc.querySelector('#view-home.on'), '暂停后回到首页');
  check(/接着做第 3 关/.test(txt(doc.querySelector('#view-home'))), '首页按钮变成「接着做第 3 关」');
  byText('#view-home button', '接着做第 3 关').click();
  await sleep(6);
  check(/接着上次第 \d+ 张/.test(txt(doc.querySelector('#learnTitle'))), '标题提示从第几张接着做：' + txt(doc.querySelector('#learnTitle')));
  check(await playToEnd(dom), '续做能做完这一关');
  check(!JSON.parse(dom.window.localStorage.getItem('pybz.v1')).part, '做完后暂停记录被清掉');

  console.log('\n' + (errs.length ? `❌ ${errs.length} 个失败:\n - ` + errs.join('\n - ') : '✅ 全流程测试通过'));
  process.exit(errs.length ? 1 : 0);
};

run().catch((e) => { console.error('测试脚本崩了:', e); process.exit(2); });
