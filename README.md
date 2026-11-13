# Python 数据分析 · 每天 15 分钟

照着百词斩那套「小卡片 + 立刻测 + 连击 + 打卡」的路子做的 **pandas 数据分析学习器**。纯本地、零依赖、断网可用，进度存在你自己的浏览器里。

主线就一条：**读进来 → 看清楚 → 洗干净 → 分组算 → 画出来 → 说结论**。

## 30 秒上手

1. 双击 **`打开学习器.bat`**（会起一个本地小服务并自动开浏览器）
   或者直接双击 **`index.html`**
2. 点「开始第 1 关 →」
3. 每天一关，20 分钟左右（做不完就点学习页顶部的「⏸ 先存着」，下次接着做）

> 建议用 bat 打开：`file://` 下个别浏览器会限制 localStorage，进度可能存不住。bat 用本地 http 打开，一定存得住。你机器上已经有 Python 3.12.9。

## 一关是怎么走的

| 卡片 | 干什么 |
|---|---|
| **讲一点** | 一个知识点，配代码和运行结果，10 秒看完 |
| **工具卡** | 一个函数/方法独占一张卡，固定五段：**语法 → 返回什么 → 什么时候用 → 例子+运行结果 → 会踩的坑**。get、append、loc、read_csv 这种，每一个都有一张 |
| **连问** | 一张卡里连着问 3 个问题（同一主题的三个角度），三问全对才算过，专治「看懂了但一用就错」。三问共用同一份数据时，数据会**固定显示在卡顶**，翻到第 3 问也看得见 |
| **选一个** | 4 选 1，选错立刻变红并解释为什么错 |
| **写出结果** | 打字填答案，回车提交，空格大小写都宽容处理 |
| **补全代码** | 点一个词填进 `___` 空格 |
| **排顺序** | 把打乱的代码行点成正确顺序 |
| **动手写** | 给题目自己写代码，卡住可看参考答案，然后诚实自评 |

一关的固定节奏：**讲一点 → 工具卡（1～4 张）→ 连问 → 选择题/填空 → 动手写 → 一句话收尾**。先讲透，再逼你输出，最后合成一个小例子。

答错不会扣分，只是那张卡会被**补到本轮末尾再来一次**，同时进「错题本」。

## 它会记住什么

- **连击（COMBO）**：连续答对，右上角会跳
- **经验 / 等级**：答对 +8，写作题 +12，通关另加 20，满分再 +30
- **打卡热力图**：最近 12 周，每格是一天，颜色越深答得越多
- **间隔重复（SRS）**：每张卡按答对次数排下一次复习 —— 1 / 3 / 7 / 15 / 30 天，到期的会出现在首页「复习 N 张」
- **错题本**：答错过的卡按错误次数排序，可整批重练，练对自动「毕业」
- **回看讲解**：做题卡住时，点学习页顶部的「📖 回看讲解」，把这一关的讲解卡全部重新展开
- **半关续做**：一关做到一半没力气了，点顶部「⏸ 先存着」就回首页；下次打开首页按钮会变成「接着做第 N 关」，从剩下的卡继续，不用重头再来
- **补课关**：地图第 2 周最后有一关「补」——列表 / 字典 / f-string 的慢速版，全程照抄，觉得虚就回去走一遍

进度存在 `localStorage`（key = `pybz.v1`）。换电脑或清缓存会丢，所以设置里给了**导出存档 / 导入存档**（一个 JSON 文件）。

## 课程大纲：5 周 35 关 292 张卡（+ 1 关补课）

每一关里那些「看着会用、一写就错」的内置函数，现在都有独立的工具卡，不再一句话带过。

**第 1 周 · 基础语法（够数据分析用就行）**
D1 装 Python 说第一句话 · D2 变量与类型 · D3 字符串 · D4 数字运算 · D5 input · D6 if · D7 复习 + BMI 计算器

**第 2 周 · 容器与循环**
D8 list · D9 遍历与推导式 · D10 dict（含 f-string 引号打架的解法）· D11 列表装字典=一张表 · D12 for/range · D13 while/break · D14 复习 + 成绩单统计
（额外：地图上标「补」的慢速关，讲同一批概念的「照抄改一处」版本）

**第 3 周 · pandas 登场**
D15 装 pandas、Series 与 DataFrame · D16 read_csv / read_excel · D17 先看清结构 info/describe · D18 选列选行 loc/iloc · D19 布尔筛选 · D20 排序与前十名 · D21 复习 + **第一次数据体检**

**第 4 周 · 清洗与计算**
D22 缺失值 NaN 处理 · D23 类型与字符串（「1,280 元」怎么办）· D24 新增列 / 改列名 / 条件列 · D25 apply / map / lambda · D26 groupby · D27 agg 命名聚合 + pivot_table · D28 复习 + **把脏表洗成汇总表**

**第 5 周 · 合并、时间、图与结业**
D29 concat 与 merge · D30 时间列与按月汇总 · D31 matplotlib + 中文乱码 · D32 选对图 · D33 导出多 sheet Excel · D34 EDA 前 30 分钟清单 · D35 **结业项目：从原始 csv 到一张趋势图 + 前三名城市**

## 想加自己的卡？

课程就是 `data/w1.js … w5.js` 五个文件，结构一眼就懂：

```js
{ id: 36, week: 6, theme: "我的实战", title: "关卡标题", subtitle: "一句副标题",
  cards: [
    { type: "concept", title: "…", body: "…", code: `print("hi")`, out: `hi`, tip: "…" },
    { type: "tool", name: "s.append(x) —— 往列表末尾加一个", oneLine: "一句话说清它干什么",
      syntax: `s.append(值)`, returns: "返回 None（别接返回值）", when: "要往列表尾部加元素时",
      example: `s = [1]; s.append(2)`, out: `[1, 2]`,
      pitfalls: ["append 返回 None，`s = s.append(2)` 会让 s 变成 None"],
      tip: "记法：…" },
    { type: "drill", title: "三连问", tag: "连问",
      setup: `x = [10, 20, 30]`,          // 可选：三问共用的数据，会一直显示在卡顶
      steps: [
        { q: "…？", options: ["A","B","C","D"], answer: 0, explain: "…" },
        { q: "…？", options: ["A","B"], answer: 1, explain: "…" }
      ]},
    { type: "quiz", q: "输出是什么？", code: `print(1+1)`, options: ["1","2","3","4"], answer: 1, explain: "…" },
    { type: "fill", q: "这行打印什么？", code: `print(len("ab"))`, accept: ["2"], explain: "…" },
    { type: "blank", q: "补全：", code: `print(____)`, options: ["1+1","'1+1'","x"], answer: 0, explain: "…" },
    { type: "order", q: "排好顺序：", lines: ["a = 1", "print(a)"], explain: "…" },
    { type: "write", q: "自己写：", hint: "…", answer: `print("参考答案")`, explain: "…" },
  ]}
```

改完刷新页面就生效（注意 `answer` 是选项的**下标**，从 0 开始）。新增文件还要在 `index.html` 里加一行 `<script src="data/w6.js"></script>`。

## 自测

```bash
node tools/validate.mjs    # 课程数据体检（字段、答案下标、占位符）
node tools/test.mjs        # 端到端：真点进去打通两关 + 复习关 + 存档续上 + 半关暂停续做
```

`test.mjs` 需要先 `cd tools && npm i jsdom`。两个脚本目前都是全绿的。

## 怎么分享给别人

先跑一次打包（会生成 `dist/` 里那两个文件）：

```bash
node tools/build-single.mjs
```

**方式一：只发一个文件（最推荐）**

`dist/Python数据分析·百词斩式35关.html` —— 样式、课程数据、代码全在里面，**255 KB**。

- 微信 / QQ / 邮件直接发这个文件；对方存到电脑上，双击，用浏览器打开就完事。
- 对方**不需要装 Python、不需要联网、不需要解压**。
- 进度存在他自己浏览器的 localStorage 里，各人独立互不影响；想搬进度就用「设置 → 导出存档」，在另一台机器「导入存档」。

**方式二：发整个文件夹（对方想改内容时用）**

`dist/Python数据分析学习器-全量.zip`（97 KB）。解压后双击 `index.html` 即可；双击 `打开学习器.bat` 会起一个本地服务器（需要电脑有 Python）。

**方式三：给一个链接（发群里、手机点开）**

单文件版就是一张网页，扔到任意静态托管就有网址：

| 服务 | 怎么做 | 备注 |
|---|---|---|
| Netlify Drop | 打开 app.netlify.com/drop，把**单文件 html** 拖进去 | 最快，免注册也能出临时网址 |
| Cloudflare Pages | 新建项目 → 直接上传（Direct Upload） | 国内有时能开，速度一般 |
| Vercel | `vercel deploy` 或网页拖拽 | 同上 |
| GitHub Pages | 新建仓库 → 上传 html 改名 `index.html` → Settings → Pages | 国内访问不稳 |

> 我这边运行环境连不上这些托管服务（DNS 被限制），所以上传这一步得你自己点几下，我没法替你传。

**方式四：同一个 WiFi 里现场演示（不联网也能用）**

在 `python-daily` 文件夹里运行 `python -m http.server 8080`，让同学手机浏览器打开 `http://你电脑的IPv4:8080`（IPv4 用 `ipconfig` 查，形如 `192.168.1.7`）。适合课堂上一起刷。

> 注意：单文件 html 是**一份快照**。你以后改了课程内容，要重新跑 `node tools/build-single.mjs`，再把新生成的文件发出去。

## 放到 GitHub（拿一个网址）

这是一个纯静态站点，`index.html` 在根目录，**不需要构建、不需要后端**，所以 GitHub Pages 直接就能托管。

### 最省事：双击上传（不用装 git）

双击根目录的 **`上传到GitHub.bat`**（或运行 `powershell -NoProfile -ExecutionPolicy Bypass -File tools\upload-to-github.ps1`），它会：

1. 问你要一个 GitHub 令牌（`https://github.com/settings/tokens` → Generate new token (classic) → 勾选 `repo` → 复制 `ghp_…`，输入时屏幕不显示）；
2. 建一个名为 `python-data-analysis` 的公开仓库（已存在就复用，同名可加 `-Repo 别的名字`）；
3. 把这 13 个文件逐个上传（`index.html` / `styles.css` / `app.js` / `README.md` / `.gitignore` / `data/w1..w5.js` / `tools/*.mjs`）；
4. 自动开启 GitHub Pages（`main` 分支根目录），等构建完成；
5. 打印最终网址 `https://<用户名>.github.io/python-data-analysis/`。

想先看看它会干什么：加 `-DryRun` 只打印请求、不联网。

> 令牌只在本机用一次，传完可以去 `https://github.com/settings/tokens` 把它删掉；建令牌时 Expiration 选 7 天最省心。

### 手动上传（不想用令牌时）

1. 新建仓库，名字用英文（如 `python-data-analysis`），勾上 **Add a license: MIT**。
2. 上传这些（`.npmcache`、`dist`、`node_modules` 一律**不要**传，已在 `.gitignore` 里屏蔽）：
   ```
   index.html
   styles.css
   app.js
   data/          ← 5 个 w*.js
   tools/         ← 可选，给想自测/改卡的人
   README.md
   .gitignore
   ```
3. 仓库 **Settings → Pages** → Source: `Deploy from a branch` → Branch: `main` / `(root)` → Save。
4. 等 1 分钟左右，网址是 `https://<你的用户名>.github.io/<仓库名>/`。

注意：
- 路径**区分大小写**，`data/w1.js` 里的文件名必须和实际上传的一致；直接用文件夹里的原样文件就不会错。
- Pages 首次发布要等 30 秒~2 分钟，期间访问是 404，别慌。
- 国内访问 `github.io` 时快时慢，发给同学时可以**再给一个 Netlify 链接**做备用。
- 以后改了内容，重新上传对应文件即可，Pages 会自动重新发布（也可能要等一两分钟）。

## 教学设计参考

这套卡片的结构不是拍脑袋定的，参照了 GitHub 上三份流传最广的 Python 教程的做法：

| 参考 | 借了什么 |
|---|---|
| **Asabeneh / 30-Days-Of-Python** | 一天一个主题、每天结尾有编号练习；方法（method）单独列清单，而不是混在正文里 |
| **jackfrued / Python-100-Days** | 每个语言元素按「为什么需要它 → 语法 → 例子 → 常见错误」四段写 |
| **A Byte of Python**（Swaroop） | 先让你跑出结果，再解释原理 —— 所以这里每张工具卡都带「运行结果」 |

再叠上百词斩的机制：小卡片、立刻测、答错重来、连击与打卡。**知识密度**来自前三份，**节奏**来自百词斩。

> 说明：我这次的运行环境连不上 github.com（DNS 把它解析到非公网地址，`raw.githubusercontent.com` 也一样），所以没能把这三份教程的原文抓下来逐段对照，上面是依据它们的公开结构与通行做法重排的。你在自己电脑上打开原仓库对照，会看到对应关系。

## 已知限制

- 「动手写」卡没法自动判分（浏览器里跑不了 Python），用的是自评：写对了 / 差不多 / 没写出来。诚实打分它才准。
- 代码示例里的 `df` 指的是你刚读进来的那张表，不是魔法变量——真跑的时候记得先 `df = pd.read_csv(...)`。
- 这不是 Kaggle 教程：不做机器学习、不做统计检验，目标是「能把业务表格变成可信的结论和图」。
- 真卡住了回来问我就行，我可以针对某一天的卡给你加题。
