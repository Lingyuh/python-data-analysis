// 打包成「一个 html 文件」：样式和所有数据、代码全部内联，双击就能用，方便发给别人
import fs from 'node:fs'
import path from 'node:path'
import { JSDOM } from 'jsdom'

const root = path.resolve(import.meta.dirname, '..')
const read = (p) => fs.readFileSync(path.join(root, p), 'utf8')

let html = read('index.html')
const css = read('styles.css')
const scripts = ['data/w1.js', 'data/w2.js', 'data/w3.js', 'data/w4.js', 'data/w5.js', 'app.js']

html = html.replace('<link rel="stylesheet" href="styles.css">', `<style>\n${css}\n</style>`)
for (const f of scripts) {
  const tag = `<script src="${f}"></script>`
  if (!html.includes(tag)) throw new Error('index.html 里找不到：' + tag)
  // 脚本内容里出现 </script> 会提前截断整段，这里做个保险
  html = html.replace(tag, `<script>\n${read(f).replace(/<\/script>/g, '<\\/script>')}\n</script>`)
}
html = html.replace('<title>Python 数据分析 · 每天 15 分钟</title>', '<title>Python 数据分析 · 百词斩式 35 关</title>')

const out = path.join(root, 'dist', 'Python数据分析·百词斩式35关.html')
fs.mkdirSync(path.dirname(out), { recursive: true })
fs.writeFileSync(out, html, 'utf8')

// 自检 1：不能残留外部引用
const leftovers = [...html.matchAll(/(?:src|href)="([^"]+)"/g)].map((m) => m[1]).filter((u) => !/^(data:|#|https?:)/.test(u))
if (leftovers.length) throw new Error('还有外部引用没内联：' + leftovers.join(', '))

// 自检 2：用 jsdom 真跑一遍，确认能渲染出首页
const dom = new JSDOM(html, { url: 'https://inline.local/', runScripts: 'dangerously', pretendToBeVisual: true })
await new Promise((r) => setTimeout(r, 120))
const txt = dom.window.document.querySelector('#view-home')?.textContent.replace(/\s+/g, ' ') || ''
if (!/开始第 1 关/.test(txt)) throw new Error('打包后的文件没能渲染首页')
if (!dom.window.PY_DAYS || dom.window.PY_DAYS.length !== 36) throw new Error('打包后的课程数据不完整')
dom.window.close()

const kb = (fs.statSync(out).size / 1024).toFixed(0)
console.log(`✅ 已生成：${out}`)
console.log(`   大小 ${kb} KB · 36 关 · ${dom ? '' : ''}自检通过（首页可渲染、数据完整、无外部依赖）`)
