/* 第 5 周：合并、时间、图与结业
   模板：讲一点 → 工具卡（语法/返回/何时用/例子/坑）→ 连问 → 练习 → 收尾 */
(window.PY_DAYS = window.PY_DAYS || []).push(

{ id:29, week:5, theme:"合并、时间、图与结业", title:"concat 与 merge：把表拼起来",
  subtitle:"上下摞（concat）和左右连（merge），两件事别混。",
  cards:[
    { type:"concept", title:"两种拼法：竖着摞、横着连", tag:"讲一点",
      body:"数据散在 1 月.csv、2 月.csv、3 月.csv 里，结构一样 → 竖着摞（concat）。\n销售表和部门主管表要按「部门」对上 → 横着连（merge）。",
      code:`pd.concat([jan, feb, mar], ignore_index=True)          # 摞
pd.merge(sales, head, on="部门", how="left")             # 连`,
      tip:"一个判断口径：表的结构（列）一样 → concat；要拿另一张表的列来补充 → merge。" },

    { type:"tool", name:"pd.concat([表1, 表2, ...], ignore_index=True)",
      oneLine:"把几个结构相同的表上下摞成一个。",
      syntax:`pd.concat([jan, feb])
pd.concat([jan, feb], ignore_index=True)     # 重建 0..n 的索引
pd.concat([jan, feb], keys=["1月", "2月"])    # 记住数据来自哪张表`,
      returns:"一个新的表。",
      when:"多个月/多个门店/多个文件的结构一样，要一起算。",
      example:`jan = pd.DataFrame({"城市": ["北京"], "销量": [120]})
feb = pd.DataFrame({"城市": ["上海"], "销量": [95]})
df = pd.concat([jan, feb], ignore_index=True)
print(df)`,
      out:`   城市  销量
0  北京  120
1  上海   95`,
      pitfalls:[
        "不加 ignore_index，索引会变成 0、1、0、1 —— 后面按索引取值会一次出两行，这种 bug 极难查",
        "列名不完全一致时，对不上的列会变 NaN（不是报错）。concat 前先核对 df.columns"
      ],
      tip:"concat 之后第一件事：print(df.shape)，行数对不对得上你心里的数。" },

    { type:"tool", name:"pd.merge(左, 右, on=, how=) —— 按某个键连接",
      oneLine:"Excel 的 VLOOKUP 加强版：还能一次带过来好几列。",
      syntax:`pd.merge(sales, head, on="部门", how="left")
pd.merge(a, b, left_on="编号", right_on="id", how="inner")
pd.merge(a, b, on="部门", how="outer", suffixes=("_左", "_右"))`,
      returns:"一个新的表：左表所有列 + 右表带过来的列。",
      when:"要把两张表按某个公共列对上（部门→主管、商品编号→名称）。",
      example:`sales = pd.DataFrame({"部门": ["技术", "技术", "销售"], "金额": [100, 200, 300]})
head = pd.DataFrame({"部门": ["技术", "销售"], "主管": ["老王", "老李"]})

print(pd.merge(sales, head, on="部门", how="left"))`,
      out:`   部门   金额  主管
0  技术   100  老王
1  技术   200  老王
2  销售   300  老李`,
      pitfalls:[
        "how=\"left\" 保留左表全部行，右表没有的填 NaN；how=\"inner\"（默认）只留两边都有的 —— 默认值会悄悄删数据",
        "两边都有同名列（非连接键）时会自动加 _x/_y 后缀，容易看错；用 suffixes= 显式起名"
      ],
      tip:"左表 3 行、右表 2 行，结果 3 行 —— 正常。右表的「技术」要匹配左表两行，所以会重复出现。merge 后行数变多不一定是错。" },

    { type:"drill", title:"拼表三连", tag:"连问",
      steps:[
        { q:"1 月、2 月、3 月三个 csv 结构一样，怎么合成一张表？",
          options:["pd.concat([...], ignore_index=True)","pd.merge(..., how=\"outer\")","df.append 三次","pd.join 三次"], answer:0,
          explain:"结构相同 → 纵向摞。append 已废弃。" },
        { q:"merge 时 how=\"left\" 意味着？",
          options:["保留左表所有行，右表没有的填 NaN","只保留两边都有的行","只保留右表的行","随机保留"], answer:0,
          explain:"left = 以左表为准。默认的 inner 会丢掉左表匹配不上的行。" },
        { q:"merge 后行数比左表多了，最可能的原因？",
          options:["右表在连接键上有重复值，一对多把行数放大了","pandas 出 bug 了","忘了 ignore_index","列名重复"], answer:0,
          explain:"右表「技术」有 2 行、左表「技术」有 3 行 → 3×2=6 行。连之前先查右表的键是否唯一：df[\"键\"].duplicated().sum()。" }
      ]},

    { type:"quiz", q:"输出是什么？", code:`a = pd.DataFrame({"城市": ["北京"], "销量": [120]})
b = pd.DataFrame({"城市": ["上海"], "销量": [95]})
print(pd.concat([a, b], ignore_index=True).shape)`,
      options:["(2, 2)","(1, 2)","(2, 1)","(4, 2)"], answer:0,
      explain:"2 行 2 列 → (2, 2)。ignore_index 让索引变 0、1。" },

    { type:"blank", q:"补全：连接后索引重建为连续", code:`df = pd.concat([jan, feb], ____)`,
      options:["ignore_index=True","reset=True","index=True","new_index=1"], answer:0,
      explain:"参数名就是 ignore_index=True。" },

    { type:"write", q:"把两张表按「部门」连接（保留左表全部行），打印行数和「主管」列缺失的个数。",
      hint:"① df = pd.merge(sales, head, on=\"部门\", how=\"left\")；② print(df.shape)；③ print(df[\"主管\"].isna().sum())。",
      answer:`df = pd.merge(sales, head, on="部门", how="left")
print(df.shape)
print("主管缺失", df["主管"].isna().sum())`,
      explain:"连接后马上查两件事：行数对不对、有没有 NaN。这两句能挡掉绝大多数 merge 事故。" },

    { type:"concept", title:"本关速查", tag:"讲一点",
      body:"结构相同 → concat(ignore_index=True) · 按列对上 → merge(on=, how=\"left\") · 连完先查 shape 和 NaN",
      tip:"明天：date 那一列是字符串，没法「按月汇总」—— 先转成真正的时间。" }
  ]},

{ id:30, week:5, theme:"合并、时间、图与结业", title:"时间：字符串变日期，按月汇总",
  subtitle:"to_datetime 转换、.dt 取年月日、to_period(\"M\") 按月汇总。",
  cards:[
    { type:"concept", title:"「2026-03-15」只是一串字符", tag:"讲一点",
      body:"从 csv 读进来的日期列，默认是 object（字符串）。字符串不能比大小（\"2026-10\" < \"2026-9\" 是错的）、不能取月份。必须先转成 datetime。",
      code:`df["日期"] = pd.to_datetime(df["日期"])
print(df["日期"].dtype)`,
      out:`datetime64[ns]`,
      tip:"看到日期列先喊一句：转 datetime。这一步没做，后面按月、按周、算间隔全是错的。" },

    { type:"tool", name:"pd.to_datetime(s, errors=\"coerce\") —— 转日期",
      oneLine:"认得出 2026-03-15、2026/3/15、20260315 这些常见格式。",
      syntax:`pd.to_datetime(df["日期"])
pd.to_datetime(df["日期"], errors="coerce")          # 转不了的变 NaT，不崩
pd.to_datetime(df["日期"], format="%Y年%m月%d日")     # 奇怪格式指定模板`,
      returns:"datetime64 类型的 Series。",
      when:"读进来的日期列要参与比较、排序、按月汇总。",
      example:`s = pd.Series(["2026-03-15", "2026-04-01", "坏日期"])
s = pd.to_datetime(s, errors="coerce")
print(s.dt.month.tolist())`,
      out:`[3, 4, nan]`,
      pitfalls:[
        "转不了的会变成 NaT（Not a Time），不是报错 —— 后面统计会静悄悄少几条，要用 isna() 查一下",
        "日/月顺序有歧义时（03/04/2026）一定要写 format 或 dayfirst，否则会被猜错"
      ],
      tip:"errors=\"coerce\" 之后紧跟一句 df[\"日期\"].isna().sum()，看有几个坏日期。" },

    { type:"tool", name:"s.dt.year / .month / .day / .dayofweek —— 取时间零件",
      oneLine:".dt 是时间列的「开关」，打开就能取年月日、星期几。",
      syntax:`df["日期"].dt.year
df["日期"].dt.month
df["日期"].dt.day
df["日期"].dt.dayofweek       # 周一=0 … 周日=6
df["日期"].dt.hour
df["日期"].dt.strftime("%Y-%m")     # 变成 "2026-03" 这样的字符串`,
      returns:"一个 Series（整数，或 strftime 之后是字符串）。",
      when:"按年/月/星期分组、筛选「周末的数据」、给报表加一列月份。",
      example:`df["月份"] = df["日期"].dt.month
print(df.groupby("月份")["销量"].sum())`,
      pitfalls:[
        ".dt 只能用在 datetime 列上；字符串列调用会报 Can only use .dt accessor with datetimelike values",
        "dayofweek 是周一=0，不是周日=0，写「周末」判断时容易错一天"
      ],
      tip:"取零件是为了分组：groupby(df[\"日期\"].dt.month) 就能看每月合计。" },

    { type:"tool", name:"s.dt.to_period(\"M\") —— 按月归组",
      oneLine:"把「2026-03-15」变成「2026-03」，同一个月的数据自动归到一组。",
      syntax:`df["月"] = df["日期"].dt.to_period("M")
df.groupby(df["日期"].dt.to_period("M"))["销量"].sum()
df["日期"].dt.to_period("M").astype(str)     # 变回 "2026-03" 字符串`,
      returns:"Period 类型的 Series，可以直接 groupby。",
      when:"按月/按季度/按年汇总（\"M\" 月、\"Q\" 季、\"Y\" 年）。",
      example:`df.groupby(df["日期"].dt.to_period("M"))["销量"].sum()`,
      out:`日期
2026-03    215
2026-04    180
Freq: M, Name: 销量, dtype: int64`,
      pitfalls:[
        "to_period 的结果是 Period，画图/导出前一般要 .astype(str) 变成普通字符串",
        "别用 resample 硬凑：resample 要求日期是索引，而且不同 pandas 版本的 \"M\"/\"ME\" 名字变过，容易报错。to_period 更稳"
      ],
      tip:"「按月汇总」这三个字，标准解法就是 dt.to_period(\"M\") + groupby。" },

    { type:"drill", title:"时间三连", tag:"连问",
      steps:[
        { q:"日期列是 object，直接 .dt.month 会怎样？",
          options:["报错：只有 datetime 列才能用 .dt","自动转换","返回 NaN","返回字符串"], answer:0,
          explain:"先 pd.to_datetime 转，再用 .dt。" },
        { q:"想知道每个月的销量合计，最稳的写法？",
          options:['df.groupby(df["日期"].dt.to_period("M"))["销量"].sum()','df.groupby("日期")["销量"].sum()','df["日期"].sum()','df.resample("M")'], answer:0,
          explain:"to_period(\"M\") 把同月归一组。直接按日期分组会变成每天一组；resample 要求日期当索引。" },
        { q:"pd.to_datetime(..., errors=\"coerce\") 之后发现有 3 个 NaT，说明？",
          options:["有 3 个值不是合法日期，需要人工看或清洗","pandas 版本不对","时间跨度太大","需要重新读文件"], answer:0,
          explain:"NaT 就是「这个字符串认不出来」。打印出来看原值，才知道是格式问题还是脏数据。" }
      ]},

    { type:"quiz", q:"输出是什么？", code:`s = pd.to_datetime(pd.Series(["2026-03-15"]))
print(s.dt.month.iloc[0])`,
      options:["3","15","2026","2026-03"], answer:0,
      explain:"是 3 月 15 日 → month 是 3，day 才是 15。" },

    { type:"fill", q:"这行打印什么？", code:`s = pd.to_datetime(pd.Series(["2026-01-05"]))
print(s.dt.dayofweek.iloc[0])`,
      ph:"输入一个数字（周一=0）", accept:["0"],
      explain:"2026-01-05 是周一 → 0。" },

    { type:"write", q:"把日期列转成 datetime，新增「月份」列，按月汇总销量并打印。",
      hint:"① df[\"日期\"] = pd.to_datetime(df[\"日期\"], errors=\"coerce\")；② df[\"月份\"] = df[\"日期\"].dt.to_period(\"M\").astype(str)；③ print(df.groupby(\"月份\")[\"销量\"].sum())。",
      answer:`df["日期"] = pd.to_datetime(df["日期"], errors="coerce")
df["月份"] = df["日期"].dt.to_period("M").astype(str)
print(df.groupby("月份")["销量"].sum())`,
      explain:"先转类型 → 再造月份列 → 再分组。顺序反了就会报错。" },

    { type:"concept", title:"本关速查", tag:"讲一点",
      body:"to_datetime(errors=\"coerce\") 转 · .dt.year/.month/.dayofweek 取零件 · .dt.to_period(\"M\") 按月归组 · .dt.strftime 格式化",
      tip:"明天：数字看完了，怎么画成一张图？三行代码。" }
  ]},

{ id:31, week:5, theme:"合并、时间、图与结业", title:"matplotlib：把数画成图",
  subtitle:"三行出图、中文乱码、savefig 必须在 show 之前。",
  cards:[
    { type:"concept", title:"画图只要三行", tag:"讲一点",
      body:"准备 x、y → plt.plot 或 plt.bar → plt.show。图会弹出在一个窗口里。",
      code:`import matplotlib.pyplot as plt

x = ["北京", "上海", "广州"]
y = [120, 95, 88]
plt.bar(x, y)
plt.show()`,
      tip:"Jupyter 里图直接显示在格子下面；VS Code 里会弹窗。看不到图多半是忘了 plt.show()。" },

    { type:"tool", name:"plt.plot / plt.bar —— 折线与柱状",
      oneLine:"plot 画趋势，bar 比大小。",
      syntax:`plt.plot(x, y)            # 折线
plt.bar(x, y)             # 柱状
plt.figure(figsize=(8, 4))       # 先定画布大小
plt.title("标题")
plt.xlabel("横轴")
plt.ylabel("纵轴")
plt.show()`,
      returns:"没有返回值，直接往画布上画。",
      when:"折线看随时间的变化，柱状比不同类目的大小。",
      example:`plt.figure(figsize=(6, 3))
plt.bar(["北京", "上海"], [120, 95])
plt.title("各城市销量")
plt.show()`,
      pitfalls:[
        "figsize 是英寸不是像素：(8, 4) 大约是 800×400 像素",
        "连续画两张图而不 plt.close() 或分 figure，会叠在一张画布上"
      ],
      tip:"顺序是：figure（画布）→ 画 → 标题 → show。show 放最后。" },

    { type:"tool", name:"修中文方块 + 保存图片",
      oneLine:"默认字体没有中文，标题会变成一串 □□□。两行参数解决。",
      syntax:`plt.rcParams["font.sans-serif"] = ["Microsoft YaHei", "SimHei"]
plt.rcParams["axes.unicode_minus"] = False     # 负号显示正常

plt.savefig("销量.png", dpi=150, bbox_inches="tight")
plt.show()`,
      returns:"savefig 把当前画布写到文件；show 把它显示出来。",
      when:"标题/标签里有中文，或者要把图存下来发给别人。",
      example:`import matplotlib.pyplot as plt

plt.rcParams["font.sans-serif"] = ["Microsoft YaHei"]
plt.rcParams["axes.unicode_minus"] = False

plt.bar(["北京", "上海"], [120, 95])
plt.title("各城市销量")
plt.savefig("销量.png", dpi=150, bbox_inches="tight")
plt.show()`,
      pitfalls:[
        "savefig 必须在 show 之前！show 之后画布已被清空，存出来是白图",
        "Mac 上没有 Microsoft YaHei，用 \"PingFang SC\" 或 \"Heiti SC\"；Linux 用 \"Noto Sans CJK SC\""
      ],
      tip:"这两行 rcParams 建议写进每个画图脚本的开头，省得每次调字体。" },

    { type:"drill", title:"画图三连", tag:"连问",
      steps:[
        { q:"标题里的中文变成方块，怎么修？",
          options:['plt.rcParams["font.sans-serif"] = ["Microsoft YaHei"]','plt.title(encoding="utf-8")','plt.fontsize=20','plt.show(中文)'], answer:0,
          explain:"是字体问题，不是编码问题。设一个带中文字形的字体即可。" },
        { q:"想让保存的图是高清的，改哪个参数？",
          options:["savefig 的 dpi=150","figsize","title","linewidth"], answer:0,
          explain:"dpi 是每英寸点数，150~300 就足够清晰。" },
        { q:"保存出来是一张白图，最可能的原因？",
          options:["savefig 写在了 show 后面","没有 plt.show()","figsize 太小","图片格式不对"], answer:0,
          explain:"show() 会清空当前画布，之后再 savefig 就存到空白。" }
      ]},

    { type:"quiz", q:"画柱状图用哪个函数？", code:`plt.____(x, y)`,
      options:["bar","plot","hist","scatter"], answer:0,
      explain:"bar 柱状、plot 折线、hist 直方图、scatter 散点。" },

    { type:"fill", q:"这行打印什么？", code:`x = [1, 2, 3]
print(len(x))`,
      ph:"输入一个数字", accept:["3"],
      explain:"3 个点。画折线时 x 和 y 的长度必须一致，否则报错。" },

    { type:"write", q:"画一张各城市销量的柱状图：设画布 8×4、标题中文、保存成 sales.png。",
      hint:"① import matplotlib.pyplot as plt；② plt.rcParams[\"font.sans-serif\"] = [\"Microsoft YaHei\"]；③ plt.figure(figsize=(8, 4))；④ plt.bar(df[\"城市\"], df[\"销量\"])；⑤ plt.title(\"各城市销量\")；⑥ plt.savefig(\"sales.png\", dpi=150)；⑦ plt.show()。",
      answer:`import matplotlib.pyplot as plt

plt.rcParams["font.sans-serif"] = ["Microsoft YaHei"]
plt.rcParams["axes.unicode_minus"] = False

plt.figure(figsize=(8, 4))
plt.bar(df["城市"], df["销量"])
plt.title("各城市销量")
plt.savefig("sales.png", dpi=150, bbox_inches="tight")
plt.show()`,
      explain:"这段可以当模板：以后换数据只改 bar 那两行。" },

    { type:"concept", title:"本关速查", tag:"讲一点",
      body:"plt.figure(figsize) 画布 · plt.plot/bar(x, y) 画 · plt.title/xlabel/ylabel · plt.savefig 在 show 之前 · 中文靠 rcParams 字体",
      tip:"明天：不是所有数据都该画柱状图 —— 选错图型，图会骗人。" }
  ]},

{ id:32, week:5, theme:"合并、时间、图与结业", title:"选对图型 + df.plot 一步出图",
  subtitle:"折线/柱状/直方/散点/箱线，各管一种问题。",
  cards:[
    { type:"concept", title:"图型跟着问题走", tag:"讲一点",
      body:"趋势（时间变化）→ 折线；比大小（类目之间）→ 柱状；看分布（一堆数长什么样）→ 直方图；看两个数的关系 → 散点；看离群值/波动 → 箱线图。",
      code:`plt.plot     # 趋势
plt.bar      # 比较
plt.hist     # 分布
plt.scatter  # 相关性
plt.boxplot  # 离群值`,
      tip:"判断标准：你想让看图的人得出什么结论？「在涨」「谁最大」「分布偏不偏」「这两个有关吗」—— 问题决定图型。" },

    { type:"tool", name:"df.plot(kind=..., figsize=...) —— 直接从表出图",
      oneLine:"pandas 内置的绘图接口，比手搓 plt 少写几行。",
      syntax:`df.plot(kind="bar", x="城市", y="销量", figsize=(8, 4))
df.plot(kind="line", x="月份", y="销量")
df["销量"].plot(kind="hist", bins=20)
df.plot(kind="scatter", x="单价", y="销量")
df.plot(kind="box")`,
      returns:"返回一个 Axes 对象（一般不用接，直接 plt.show()）。",
      when:"数据已经是一个 DataFrame，直接画。",
      example:`df.plot(kind="bar", x="城市", y="销量", figsize=(8, 4), title="各城市销量")
plt.show()`,
      pitfalls:[
        "x=、y= 里的列名必须真实存在，写错报 KeyError",
        "kind=\"line\" 时如果不给 x，pandas 会用索引当 x 轴 —— 索引不是时间的话，折线会乱"
      ],
      tip:"df.plot 之后仍然能用 plt.title / plt.show，两者是同一套底层。" },

    { type:"tool", name:"plt.subplots(行, 列) —— 一张画布放几张图",
      oneLine:"对比两个指标时，并排两张图比挤在一张里清楚。",
      syntax:`fig, axes = plt.subplots(1, 2, figsize=(10, 4))
axes[0].bar(df["城市"], df["销量"])
axes[0].set_title("销量")
axes[1].hist(df["单价"], bins=10)
axes[1].set_title("单价分布")
plt.tight_layout()
plt.show()`,
      returns:"fig（整张画布）+ axes（子图数组）。",
      when:"同一份数据看好几个角度。",
      example:`fig, axes = plt.subplots(1, 2, figsize=(10, 4))
axes[0].plot(df["月份"], df["销量"])
axes[1].bar(df["月份"], df["销量"])
plt.tight_layout()
plt.show()`,
      pitfalls:[
        "子图的标题用 axes[i].set_title()，不是 plt.title()（后者会盖住整张画布的标题）",
        "不调 tight_layout()，标签容易被裁掉"
      ],
      tip:"只有一个子图时 plt.subplots() 返回的 axes 不是数组（新版行为不同），要稳妥就先写 1, 2。" },

    { type:"drill", title:"图型三连", tag:"连问",
      steps:[
        { q:"想看销量这 12 个月的变化趋势，用？",
          options:["折线图","柱状图","直方图","散点图"], answer:0,
          explain:"时间序列看趋势 → 折线。" },
        { q:"想看「单价」这一列几十个数的分布形状，用？",
          options:["直方图 hist","折线图 line","饼图 pie","柱状图 bar"], answer:0,
          explain:"一个数值列的分布 → 直方图（分箱数数）。" },
        { q:"想看单价和销量之间有没有关系，用？",
          options:["散点图 scatter","柱状图","箱线图","折线图"], answer:0,
          explain:"两个数值列的关系 → 散点图。每个点是一行数据。" }
      ]},

    { type:"quiz", q:"这行代码画的是什么图？", code:`df["销量"].plot(kind="hist", bins=20)`,
      options:["销量这一列分布情况的直方图","销量的折线","城市销量柱状图","散点图"], answer:0,
      explain:"kind=\"hist\" + 单个 Series → 直方图。bins=20 是把范围切成 20 个箱子。" },

    { type:"blank", q:"补全：画散点图", code:`df.plot(kind=____, x="单价", y="销量")`,
      options:['"scatter"','"bar"','"line"','"hist"'], answer:0,
      explain:"散点图 kind=\"scatter\"。" },

    { type:"write", q:"用 df.plot 画两张子图：左边折线（月份-销量），右边柱状（城市-销量）。",
      hint:"① fig, axes = plt.subplots(1, 2, figsize=(10, 4))；② axes[0].plot(df[\"月份\"], df[\"销量\"])；③ axes[1].bar(df[\"城市\"], df[\"销量\"])；④ 各自 set_title；⑤ plt.tight_layout()；⑥ plt.show()。",
      answer:`import matplotlib.pyplot as plt

plt.rcParams["font.sans-serif"] = ["Microsoft YaHei"]

fig, axes = plt.subplots(1, 2, figsize=(10, 4))
axes[0].plot(df["月份"], df["销量"])
axes[0].set_title("月度销量")
axes[1].bar(df["城市"], df["销量"])
axes[1].set_title("城市销量")
plt.tight_layout()
plt.show()`,
      explain:"axes[i] 就是第 i 个子图的「笔」，所有 plt.xxx 都有对应的 axes[i].set_xxx。" },

    { type:"concept", title:"本关速查", tag:"讲一点",
      body:"趋势折线 · 比大小柱状 · 分布直方 · 关系散点 · 离群箱线 · df.plot(kind=, x=, y=) 一步出图 · subplots + tight_layout 多图",
      tip:"明天：算完了、画完了，怎么把结果导出成 Excel 交给同事？" }
  ]},

{ id:33, week:5, theme:"合并、时间、图与结业", title:"导出：csv 与多 sheet Excel",
  subtitle:"给同事的文件要能双击打开、中文不乱码、一列解释一行。",
  cards:[
    { type:"concept", title:"最后一步是把结果交出去", tag:"讲一点",
      body:"分析做完了没人看见等于没做。最常见的两种交付：csv（给程序吃）和 xlsx（给人看）。\n交付文件有三条铁律：中文不乱码、不要莫名其妙的行号列、每列有清楚的表头。",
      code:`df.to_csv("结果.csv", index=False, encoding="utf-8-sig")
df.to_excel("结果.xlsx", index=False)`,
      tip:"index=False 是这三条里最容易被忘的一条。默认会把 0、1、2 写成一列，看起来极不专业。" },

    { type:"tool", name:"df.to_csv(路径, index=False, encoding=\"utf-8-sig\")",
      oneLine:"读是 read_csv，写是 to_csv —— 参数少但对不上的话 Excel 打不开中文。",
      syntax:`df.to_csv("结果.csv", index=False)
df.to_csv("结果.csv", index=False, encoding="utf-8-sig")   # Excel 打开不乱码
df.to_csv("结果.csv", index=False, sep=";")                # 分号分隔（某些地区 Excel 习惯）`,
      returns:"没有返回值，直接写文件（返回 None）。",
      when:"结果要给程序继续处理、或者文件很大。",
      example:`df.to_csv("月度汇总.csv", index=False, encoding="utf-8-sig")
print("已保存")`,
      pitfalls:[
        "不加 utf-8-sig，Windows 上用 Excel 打开会中文乱码（BOM 头就是给 Excel 看的）",
        "忘了 index=False，文件第一列多出一列 0、1、2 没名字的列"
      ],
      tip:"「utf-8-sig」里的 sig 就是签名（BOM）。给 Excel 看的中文 csv 一律用它。" },

    { type:"tool", name:"pd.ExcelWriter(path) —— 一个文件多个 sheet",
      oneLine:"月度报表的正确形态：一个 xlsx，每个城市/每个月一个 sheet。",
      syntax:`with pd.ExcelWriter("报表.xlsx", engine="openpyxl") as w:
    df1.to_excel(w, sheet_name="汇总", index=False)
    df2.to_excel(w, sheet_name="明细", index=False)`,
      returns:"with 块里把多个表写进同一个文件。",
      when:"要给领导一份「能点开看」的多页报表。",
      example:`with pd.ExcelWriter("报表.xlsx", engine="openpyxl") as w:
    df.groupby("城市")["销量"].sum().to_excel(w, sheet_name="城市汇总")
    df.to_excel(w, sheet_name="明细", index=False)`,
      pitfalls:[
        "to_excel 默认 index=True，写进去会多一列行号；每个 sheet 都要显式写 index=False",
        "sheet_name 不能超过 31 个字符、不能含 : \\ / ? * [ ]",
        "失败最常见原因：没装 openpyxl（ImportError: Missing optional dependency 'openpyxl'）"
      ],
      tip:"ExcelWriter 用 with 语句，写完自动关闭文件；不用 with 就得手动 w.close()，忘了会写不完整。" },

    { type:"drill", title:"导出三连", tag:"连问",
      steps:[
        { q:"导出的 csv 用 Excel 打开中文乱码，加什么？",
          options:['encoding="utf-8-sig"','encoding="gbk"（给程序读时会崩）','sep=";"','index=True'], answer:0,
          explain:"utf-8-sig 带 BOM，Excel 才认得出是 UTF-8。" },
        { q:"导出的 Excel 第一列多了一串 0、1、2，怎么去掉？",
          options:["to_excel(..., index=False)","df.drop(columns=[0])","to_excel(..., header=False)","删掉第一列"], answer:0,
          explain:"那是行索引。index=False 就不写。" },
        { q:"一份 xlsx 里要放「汇总」和「明细」两个 sheet，用？",
          options:["pd.ExcelWriter + 两次 to_excel(sheet_name=...)","to_excel 两次（第二次会覆盖）","to_csv 两次","concat"], answer:0,
          explain:"两次直接 to_excel 同一路径会互相覆盖，只剩最后一个 sheet。" }
      ]},

    { type:"quiz", q:"这段代码的结果？", code:`df.to_csv("a.csv", index=False)
print(df.to_csv("a.csv"))`,
      options:["返回 None（to_csv 不返回值）","返回文件路径","返回 DataFrame","报错"], answer:0,
      explain:"to_系函数都是「写文件」，返回值是 None。所以别写 df2 = df.to_csv(...)。" },

    { type:"blank", q:"补全：导出 csv 不让 Excel 乱码、不带行号", code:`df.to_csv("结果.csv", index=False, ____)`,
      options:['encoding="utf-8-sig"','encoding="ascii"','header=False','mode="a"'], answer:0,
      explain:"utf-8-sig 是 Windows + Excel 场景的标准答案。" },

    { type:"write", q:"把「城市汇总」和「明细」写进同一个 报表.xlsx，两个 sheet 都不要行号。",
      hint:"① with pd.ExcelWriter(\"报表.xlsx\", engine=\"openpyxl\") as w:；② 汇总.to_excel(w, sheet_name=\"汇总\", index=False)；③ df.to_excel(w, sheet_name=\"明细\", index=False)。",
      answer:`with pd.ExcelWriter("报表.xlsx", engine="openpyxl") as w:
    汇总.to_excel(w, sheet_name="汇总", index=False)
    df.to_excel(w, sheet_name="明细", index=False)`,
      explain:"注意缩进：两个 to_excel 都要在 with 里面。写完之后 print(\"done\") 确认没报错。" },

    { type:"concept", title:"本关速查", tag:"讲一点",
      body:"to_csv(index=False, encoding=\"utf-8-sig\") · to_excel(index=False) · ExcelWriter + sheet_name 多页 · 装 openpyxl",
      tip:"明天：把前面 30 多关串起来 —— 一份完整 EDA（探索性分析）的标准动作。" }
  ]},

{ id:34, week:5, theme:"合并、时间、图与结业", title:"EDA 清单：拿到新数据先做什么",
  subtitle:"七步走完，从「一堆数」到「三个结论」。",
  cards:[
    { type:"concept", title:"七步 EDA", tag:"讲一点",
      body:"① 读进来 + shape ② info 看类型空值 ③ describe 看数值范围 ④ value_counts 看分类 ⑤ 时间/分组趋势 ⑥ 画 2~3 张图 ⑦ 写三句话结论。\n前四步是体检，后三步是讲故事。",
      code:`df = pd.read_csv("data.csv")
print(df.shape)
df.info()
print(df.describe())
print(df["城市"].value_counts())
print(df.groupby("月份")["销量"].sum())
df.plot(kind="bar", x="城市", y="销量")`,
      tip:"EDA 的产出不是代码，是三句话：「哪个城市贡献最大」「哪个月最低」「单价和销量没有明显关系」。说不出三句话，说明还没分析完。" },

    { type:"tool", name:"nunique / corr / idxmax —— EDA 的三个小工具",
      oneLine:"有多少个不同值、两列相关性、最大值的行号。",
      syntax:`df["城市"].nunique()          # 有几个不同的城市
df.corr(numeric_only=True)     # 数值列之间的相关系数
df["销量"].idxmax()            # 最大值所在的行索引
df.loc[df["销量"].idxmax()]    # 直接取出那一行
df["城市"].unique()            # 去重后的值（数组）`,
      returns:"nunique 整数 · corr 相关系数矩阵 · idxmax 索引 · unique 数组。",
      when:"摸清维度、看两列有没有线性关系、找出「最高/最低是哪一个」。",
      example:`print(df["城市"].nunique())
print(df.loc[df["销量"].idxmax(), ["城市", "销量"]])`,
      out:`3
城市    北京
销量    120
Name: 0, dtype: object`,
      pitfalls:[
        "corr 只对数值列有用，遇到字符串列要加 numeric_only=True（老版本会直接报错）",
        "相关系数接近 0 只说明「没有线性关系」，不代表没关系（可能是 U 形）"
      ],
      tip:"idxmax + loc 是「找出第一名那一整行」的标准组合，比排序再取第一行更直接。" },

    { type:"drill", title:"EDA 三连", tag:"连问",
      steps:[
        { q:"想知道「城市」这一列有几个不同的值，用？",
          options:["df[\"城市\"].nunique()","df[\"城市\"].count()","len(df)","df.shape"], answer:0,
          explain:"nunique 数不重复的个数；count 数非空行数（北京出现 50 次它算 50）。" },
        { q:"想直接拿到「销量最高」那一整行，最直接的写法？",
          options:['df.loc[df["销量"].idxmax()]','df.sort_values("销量")','df["销量"].max()','df.nlargest(1)'], answer:0,
          explain:"idxmax 给行号，loc 取行。df.nlargest(1) 也能拿到，但多一层。" },
        { q:"一张表里既有城市（文字）又有销量（数字），df.corr() 报错说不能处理字符串，怎么办？",
          options:["加 numeric_only=True","先 to_numeric 转全部列","删掉所有字符串列","用 describe"], answer:0,
          explain:"corr 只算数值列，加参数让它自动跳过非数值列。" }
      ]},

    { type:"quiz", q:"输出是什么？", code:`df = pd.DataFrame({"c": ["A", "B", "A"], "v": [5, 9, 2]})
print(df.loc[df["v"].idxmax()]["c"])`,
      options:["B","A","9","5"], answer:0,
      explain:"最大值 9 在索引 1，那一行的 c 是 B。" },

    { type:"fill", q:"这行打印什么？", code:`df = pd.DataFrame({"c": ["A", "B", "A"]})
print(df["c"].nunique())`,
      ph:"输入一个数字", accept:["2"],
      explain:"A、B 两个不同值 → 2（哪怕 A 出现了两次）。" },

    { type:"write", q:"对一份销售数据做完整 EDA：shape、info、describe、城市分布、月度趋势、一张柱状图，最后 print 三句结论。",
      hint:"前五步照着清单抄。结论用 f-string 拼，比如：print(f\"销量最高的城市是 {df.loc[df['销量'].idxmax(), '城市']}\")。",
      answer:`import pandas as pd

df = pd.read_csv("sales.csv")

print("行列", df.shape)
df.info()
print(df.describe())
print(df["城市"].value_counts())

df["月份"] = pd.to_datetime(df["日期"]).dt.to_period("M").astype(str)
print(df.groupby("月份")["销量"].sum())

top = df.loc[df["销量"].idxmax()]
print(f"销量最高的城市是 {top['城市']}，{top['销量']}")
print(f"一共有 {df['城市'].nunique()} 个城市")
print(f"平均销量 {df['销量'].mean():.1f}")`,
      explain:"这三句结论就是你的分析结果。真实工作里，领导只看这三句和一张图 —— 代码是过程，不是交付物。" },

    { type:"concept", title:"本关速查", tag:"讲一点",
      body:"shape → info → describe → value_counts → 时间趋势 → 2 张图 → 三句结论。nunique 数维度、idxmax+loc 找第一、corr 看相关。",
      tip:"明天：结业。从一张原始表到一份能发出去的报表，完整走一遍。" }
  ]},

{ id:35, week:5, theme:"合并、时间、图与结业", title:"结业项目：一份完整的月度销售报告",
  subtitle:"读 → 洗 → 算 → 图 → 导出，五段脚本，一次跑通。",
  cards:[
    { type:"concept", title:"项目任务", tag:"讲一点",
      body:"给你三份 csv（1/2/3 月的销售明细，列：日期、城市、单价、数量），要求产出一份 Excel 报表：\n① sheet「月度汇总」：每月总金额\n② sheet「城市汇总」：每个城市的总金额和订单数\n③ sheet「明细」：清洗后的全部数据\n④ 另存一张「城市销量」柱状图 png。",
      code:`sales_1月.csv / sales_2月.csv / sales_3月.csv
列：日期, 城市, 单价, 数量`,
      tip:"没有真实文件也能练：用 pd.DataFrame 造 10 行数据，列名按上面的来。逻辑一样。" },

    { type:"concept", title:"拆解：五个小节", tag:"讲一点",
      body:"① 读取与拼接（concat）② 清洗（类型、空格、空值）③ 派生列（金额 = 单价 × 数量；月份）④ 分组汇总（groupby）⑤ 导出（ExcelWriter + png）。\n每一节单独 print 一次，出问题能立刻定位。",
      code:`# 1 读取
# 2 清洗
# 3 派生列
# 4 汇总
# 5 导出`,
      tip:"写脚本的顺序建议：先把 1~3 跑通 print 出来看一眼，再加 4，最后加 5。一口气写完再调试最费时间。" },

    { type:"quiz", q:"月度汇总应该怎么算？", code:"（按月份分组，对金额求和）",
      options:["df.groupby(\"月份\")[\"金额\"].sum()","df[\"月份\"].sum()","df.groupby(\"金额\")[\"月份\"].count()","df.describe()"], answer:0,
      explain:"按月份分组 → 对金额求和。顺序不能反。" },

    { type:"blank", q:"补全：多 sheet 写入", code:`with pd.ExcelWriter("报表.xlsx", engine=____) as w:`,
      options:['"openpyxl"','"xlsxwriter"（也能用，但要另装）','"pandas"','"excel"'], answer:0,
      explain:"openpyxl 是 pandas 读写的标准依赖，跟 pandas 一起装过。" },

    { type:"write", q:"写完整脚本：读三份 csv → concat → 清洗（数字转类型、城市去空格）→ 加「金额」「月份」列 → 两个汇总表 + 明细写进 报表.xlsx → 画城市金额柱状图存 png。",
      hint:"按五段写：① pd.concat([...], ignore_index=True)；② to_numeric + str.strip；③ df[\"金额\"] = df[\"单价\"] * df[\"数量\"]，df[\"月份\"] = pd.to_datetime(df[\"日期\"]).dt.to_period(\"M\").astype(str)；④ groupby 两次；⑤ ExcelWriter 三次 to_excel + plt.savefig。",
      answer:`import pandas as pd
import matplotlib.pyplot as plt

plt.rcParams["font.sans-serif"] = ["Microsoft YaHei"]

# 1 读取与拼接
dfs = [pd.read_csv(f"sales_{m}月.csv") for m in (1, 2, 3)]
df = pd.concat(dfs, ignore_index=True)

# 2 清洗
df["单价"] = pd.to_numeric(df["单价"], errors="coerce").fillna(0)
df["数量"] = pd.to_numeric(df["数量"], errors="coerce").fillna(0)
df["城市"] = df["城市"].str.strip()

# 3 派生列
df["金额"] = df["单价"] * df["数量"]
df["月份"] = pd.to_datetime(df["日期"]).dt.to_period("M").astype(str)

# 4 汇总
月度 = df.groupby("月份")["金额"].sum().reset_index()
城市 = df.groupby("城市").agg(金额=("金额", "sum"), 订单数=("金额", "size")).reset_index()

# 5 导出
with pd.ExcelWriter("报表.xlsx", engine="openpyxl") as w:
    月度.to_excel(w, sheet_name="月度汇总", index=False)
    城市.to_excel(w, sheet_name="城市汇总", index=False)
    df.to_excel(w, sheet_name="明细", index=False)

城市.plot(kind="bar", x="城市", y="金额", figsize=(8, 4), title="各城市金额")
plt.savefig("城市金额.png", dpi=150, bbox_inches="tight")
plt.show()
print("完成")`,
      explain:"这段脚本你已经具备了写出来的全部知识：concat、to_numeric、str、赋值新列、groupby、agg、ExcelWriter、plot、savefig。能独立写出来，这门课就算过了。" },

    { type:"concept", title:"接下来往哪走", tag:"讲一点",
      body:"三条路，按你的目标选：\n① 更深的 pandas：多层索引、窗口函数、大数据（polars）。\n② 统计与建模：scipy、statsmodels、scikit-learn —— 从「描述」到「预测」。\n③ 工程化：把脚本包成函数、加参数、定时跑（schedule / 计划任务）。",
      code:`numpy → 数值计算的地基
scikit-learn → 机器学习
polars → 大数据版 pandas`,
      tip:"别同时学三条。先用 pandas 把手上的活干利索，再选一条深挖。" },

    { type:"concept", title:"结业", tag:"讲一点",
      body:"35 关走完，你现在能独立完成：读文件 → 清洗 → 分组汇总 → 画图 → 导出报表。这就是「数据分析」在日常工作里 90% 的样子。",
      tip:"最后一件事：把结业脚本里的 /tmp 路径、样例文件名换成你自己电脑上的真实文件，跑一次。跑通了，才算真的会。" }
  ]}
);
