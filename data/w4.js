/* 第 4 周：清洗与计算 —— 把脏数据变成结论
   模板：讲一点 → 工具卡（语法/返回/何时用/例子/坑）→ 连问 → 练习 → 收尾 */
(window.PY_DAYS = window.PY_DAYS || []).push(

{ id:22, week:4, theme:"清洗与计算：把脏数据变干净", title:"缺失值：NaN 是什么、怎么处理",
  subtitle:"真实数据永远缺东西。三种处理方式，选错等于编数据。",
  cards:[
    { type:"concept", title:"NaN 会传染，但统计会跳过它", tag:"讲一点",
      body:"pandas 用 NaN 表示「这里没有值」。NaN 参与四则运算会变成 NaN，但 sum / mean 这类统计默认跳过它（skipna=True）。",
      code:`df = pd.DataFrame({"姓名": ["张三", "李四"], "薪资": [8000, None]})
print(df["薪资"])
print(df["薪资"].sum())
print(df["薪资"].mean())`,
      out:`0    8000.0
1       NaN
Name: 薪资, dtype: float64
8000.0
8000.0`,
      tip:"注意 8000 变成了 8000.0：一列里只要有 NaN，整列就升成 float。这就是「本来该是整数怎么变小数」的常见原因。" },

    { type:"tool", name:"df.isna() / df.isnull() —— 找出哪里是空的",
      oneLine:"返回一张同样大小的 True/False 表：True 就是空。",
      syntax:`df.isna()                 # 整张表的布尔表
df["薪资"].isna()         # 只看一列
df.isna().sum()           # 每一列各有几个空值
df.isna().sum().sum()     # 全表一共几个空值`,
      returns:"布尔 DataFrame / Series；加 .sum() 后是每列的空值个数。",
      when:"刚拿到数据、想确认「缺多少、缺在哪一列」。",
      example:`df = pd.DataFrame({"a": [1, None, 3], "b": ["x", "y", None]})
print(df.isna().sum())`,
      out:`a    1
b    1
dtype: int64`,
      pitfalls:[
        "别用 == None 或 == np.nan 判断空值：NaN 连自己都不等于自己，结果永远 False",
        "isna 和 isnull 是同一个函数，用哪个都行；notna / notnull 是它的反"
      ],
      tip:"记忆：isna().sum() 是数据体检的第三句话，比 info() 更好数。" },

    { type:"tool", name:"df.dropna(...) —— 把空值所在的行删掉",
      oneLine:"简单粗暴，但删多了会把数据删没。",
      syntax:`df.dropna()                          # 任何一列有空就删这行
df.dropna(subset=["薪资"])             # 只看薪资这一列
df.dropna(how="all")                   # 整行全空才删
df.dropna(thresh=3)                    # 至少 3 个非空值才留下`,
      returns:"删除后的新表（原表不动）。",
      when:"空值很少（< 5%）、且缺的那几行不影响结论。",
      example:`print(len(df))
print(len(df.dropna(subset=["薪资"])))`,
      out:`10
8`,
      pitfalls:[
        "不加 subset 就是「任何一列空就删整行」，很容易把一半数据删掉",
        "默认不修改原表，要生效得写 df = df.dropna(...) 或 dropna(inplace=True)"
      ],
      tip:"删之前先数一下：len(df) - len(df.dropna()) 就是你要删掉多少行。心里有数再删。" },

    { type:"tool", name:"df[\"列\"].fillna(值) / .ffill() —— 把空值填上",
      oneLine:"用 0、平均值、中位数、上一行的值填。填什么取决于业务。",
      syntax:`df["薪资"].fillna(0)                        # 填 0
df["薪资"].fillna(df["薪资"].mean())        # 填平均值
df["薪资"].fillna(df["薪资"].median())      # 填中位数（更抗极端值）
df["薪资"].ffill()                          # 用上一个有效值往下填
df["薪资"].bfill()                          # 用下一个有效值往上填`,
      returns:"填好之后的新 Series（不改变原列）。",
      when:"空值不少、又不能删（删了样本就不全了）。",
      example:`s = pd.Series([8000, None, 10000])
print(s.fillna(s.mean()))`,
      out:`0     8000.0
1     9000.0
2    10000.0
dtype: float64`,
      pitfalls:[
        "薪资缺失填 0 是错的：0 是「不发工资」，不是「不知道」。缺失值要用平均值/中位数/未知来填",
        "整列都是空的时候，mean() 也是 NaN，fillna 填不进去 —— 这种列应该直接扔掉"
      ],
      tip:"选择顺序：能删就删（少量）→ 能用业务含义填就用业务含义 → 最后才用平均值/中位数兜底。" },

    { type:"drill", title:"缺失值三连", tag:"连问",
      steps:[
        { q:"判断某一列哪些是空值，写法正确的是？",
          options:['df["薪资"].isna()','df["薪资"] == None','df["薪资"] == np.nan','df["薪资"] == "NaN"'], answer:0,
          explain:"NaN 不等于任何东西（包括它自己），所以 == 永远 False。统一用 isna()。" },
        { q:"薪资列有 2 个空值，mean() 得到 9000，它算的是？",
          options:["两个非空值的平均，跳过了 NaN","把 NaN 当 0 算的平均","报错","总和"], answer:0,
          explain:"mean 默认 skipna=True，只对非空值求平均。" },
        { q:"想把「薪资」这一列里的空值行删掉、只看薪资，怎么写？",
          options:['df.dropna(subset=["薪资"])','df.dropna()','df["薪资"].drop()','df.drop("薪资")'], answer:0,
          explain:"subset 指定看哪一列。df.dropna() 是任何列空就删行；df.drop(\"薪资\") 是删掉整列。" }
      ]},

    { type:"quiz", q:"输出是什么？", code:`df = pd.DataFrame({"薪资": [8000, None, 10000]})
print(df["薪资"].mean())`,
      options:["9000.0","6000.0","NaN","报错"], answer:0,
      explain:"跳过 NaN，(8000 + 10000) / 2 = 9000。不会把缺失当 0 —— 否则平均值会被系统性拉低。" },

    { type:"fill", q:"这行打印什么？", code:`df = pd.DataFrame({"a": [1, None, 3]})
print(df.isna().sum().sum())`,
      ph:"输入一个数字", accept:["1"],
      explain:"全表只有 1 个空值 → 1。sum().sum() 是先按列数、再把各列加起来。" },

    { type:"write", q:"造一个含 3 个空值的表，打印每列空值个数；然后把「薪资」的空值用中位数填上，再打印一次。",
      hint:"① df = pd.DataFrame({\"姓名\": [\"张三\",\"李四\",\"王五\"], \"薪资\": [8000, None, 10000]})；② print(df.isna().sum())；③ df[\"薪资\"] = df[\"薪资\"].fillna(df[\"薪资\"].median())；④ print(df)。",
      answer:`import pandas as pd

df = pd.DataFrame({
    "姓名": ["张三", "李四", "王五"],
    "薪资": [8000, None, 10000],
})
print(df.isna().sum())

df["薪资"] = df["薪资"].fillna(df["薪资"].median())
print(df)`,
      explain:"关键在 df[\"薪资\"] = ...：不赋值等于白填。这是新手最常见的「明明填了怎么没变」。" },

    { type:"concept", title:"本关速查", tag:"讲一点",
      body:"isna().sum() 数空值 · dropna(subset=) 删行 · fillna(值) 填上 · ffill/bfill 用邻居填 · 缺失别填 0",
      tip:"明天：另一种「脏」——数字看着是数字，其实是文字，sum 出来是字符串拼接。" }
  ]},

{ id:23, week:4, theme:"清洗与计算：把脏数据变干净", title:"类型与文本：数字怎么变成真的数字",
  subtitle:"object 列、to_numeric(errors=\"coerce\")、.str 访问器。",
  cards:[
    { type:"concept", title:"「1,280」不是数字，是文字", tag:"讲一点",
      body:"Excel 里带千分位逗号、带空格、带「元」字的数字，读进 pandas 都是 object（字符串）。这时 sum() 会把它们连起来，mean() 直接报错。",
      code:`df = pd.DataFrame({"销量": ["1,280", "980"]})
print(df["销量"].dtype)
print(df["销量"].sum())`,
      out:`object
1,280980`,
      tip:"看到 object 的「数字列」，第一步永远是转类型，而不是硬算。" },

    { type:"tool", name:"pd.to_numeric(s, errors=\"coerce\") —— 转数字，坏值变 NaN",
      oneLine:"最稳的转换方式：能转的转，转不了的留 NaN，绝不崩。",
      syntax:`pd.to_numeric(df["销量"])                      # 有坏值会报错
pd.to_numeric(df["销量"], errors="coerce")      # 坏值 → NaN
pd.to_numeric(df["销量"], errors="coerce").fillna(0)`,
      returns:"转好的 Series（int64 或 float64）。",
      when:"列里有「1,280」「980元」「」这类混合内容。",
      example:`s = pd.Series(["1,280", "980", "无"])
s = s.str.replace(",", "")
s = pd.to_numeric(s, errors="coerce")
print(s)`,
      out:`0    1280.0
1     980.0
2       NaN
dtype: float64`,
      pitfalls:[
        "「1,280」这种要先把逗号去掉：.str.replace(\",\", \"\")，否则整个变 NaN",
        "errors=\"ignore\" 是老写法，会把整列原样返回（等于没转），别用"
      ],
      tip:"口诀：先洗字符（逗号、空格、单位），再 to_numeric，最后 fillna。" },

    { type:"tool", name:"s.astype(int) —— 转成整数（遇 NaN 会炸）",
      oneLine:"干净数据用 astype，脏数据用 to_numeric。",
      syntax:`df["数量"].astype(int)              # 有 NaN → ValueError
df["数量"].fillna(0).astype(int)    # 先填再转
df["数量"].astype("Int64")          # 大写 I：允许空的整数类型`,
      returns:"转换后的 Series。",
      when:"确认这一列没有空值、没有脏字符，只是类型不对。",
      example:`df["数量"] = df["数量"].fillna(0).astype(int)
print(df["数量"].dtype)`,
      out:`int64`,
      pitfalls:[
        "Cannot convert non-finite values (NA or inf) to integer —— 有 NaN 时 astype(int) 必报错",
        "Int64（大写 I）是 pandas 自己的可空整数类型，能存 NA，但有些库不认它"
      ],
      tip:"优先级：有脏字符 → to_numeric(coerce)；只是想改类型且没空值 → astype。" },

    { type:"tool", name:"s.str.xxx —— 字符串列专用工具箱",
      oneLine:".str 是字符串列的「开关」，打开之后就能用 Python 的字符串方法。",
      syntax:`df["城市"].str.strip()                # 去首尾空格
df["城市"].str.replace("北京市", "北京")
df["城市"].str.lower()                # 转小写
df["城市"].str.contains("京")          # 是否包含（得到 True/False）
df["城市"].str.len()                  # 每个值的长度
df["城市"].str.split("-")             # 按分隔符切开（得到列表）`,
      returns:"一个新的 Series（长度不变，值的形态变了）。",
      when:"数据里全角和半角混用、首尾有空格、要拆「北京市-朝阳区」这种。",
      example:`s = pd.Series([" 北京 ", "上海"])
print(s.str.strip().tolist())`,
      out:`['北京', '上海']`,
      pitfalls:[
        ".str 只能用在字符串列上；数字列调用会报错（AttributeError: Can only use .str accessor with string values）",
        "对空值调用 .str.xxx 结果还是 NaN，不会报错 —— 别以为它处理了"
      ],
      tip:"每次读完数据都可以先来一句：df.select_dtypes(\"object\").apply(lambda s: s.str.strip())，把全表首尾空格清一遍。" },

    { type:"drill", title:"类型三连", tag:"连问",
      setup:`df = pd.DataFrame({
    "数量": [980, None, 1280],
    "销量": ["980", "1280", "760"],
})`,
      steps:[
        { q:"「数量」列里混着 980、1280 和一个空值，怎么安全转成数字？",
          options:['先 str.replace(",", "")，再 pd.to_numeric(errors="coerce")','直接 astype(int)','直接 sum()','用 float() 循环'], answer:0,
          explain:"先洗掉字符，再交给 to_numeric。\ncoerce 把「无」变成 NaN，不会让整个脚本崩掉。" },
        { q:"df[\"数量\"].astype(int) 报 Cannot convert non-finite values，说明？",
          options:["列里有 NaN，要先 fillna 或去掉空行","列名写错了","pandas 没装","列里全是字符串"], answer:0,
          explain:"int 装不下 NaN。要么 fillna(0).astype(int)，要么用可空的 Int64。" },
        { q:"df[\"销量\"].sum() 得到一个很长的数字串（\"9801280760\"），说明？",
          options:["这列是字符串（object），sum 在拼接","pandas 版本太老","列名重复","数据有重复行"], answer:0,
          explain:"字符串相加就是拼接。看到这种结果先去查 dtype。" }
      ]},

    { type:"quiz", q:"输出是什么？", code:`s = pd.Series(["1", "2", "x"])
print(pd.to_numeric(s, errors="coerce").sum())`,
      options:["3.0","3","报错","NaN"], answer:0,
      explain:"「x」变 NaN，1 + 2 = 3.0（有 NaN 的列是 float，所以带小数点）。sum 跳过 NaN。" },

    { type:"blank", q:"补全：转数字，坏值变 NaN", code:`df["销量"] = pd.to_numeric(df["销量"], ____)`,
      options:["errors=\"coerce\"","errors=\"ignore\"","on_error=\"skip\"","na=True"], answer:0,
      explain:"errors=\"coerce\" 是唯一正确的选项。errors=\"ignore\" 等于不转。" },

    { type:"write", q:"「销量」列里有逗号和「无」，把它转成数字、空值填 0，打印 dtype 和总和。",
      hint:"① df[\"销量\"] = df[\"销量\"].str.replace(\",\", \"\")；② df[\"销量\"] = pd.to_numeric(df[\"销量\"], errors=\"coerce\")；③ df[\"销量\"] = df[\"销量\"].fillna(0)；④ print(df[\"销量\"].dtype, df[\"销量\"].sum())。",
      answer:`df["销量"] = df["销量"].str.replace(",", "")
df["销量"] = pd.to_numeric(df["销量"], errors="coerce")
df["销量"] = df["销量"].fillna(0)
print(df["销量"].dtype)
print(df["销量"].sum())`,
      explain:"三步走：洗字符 → 转数字 → 填空值。顺序不能反：先 to_numeric 的话「1,280」直接变 NaN，数据就丢了。" },

    { type:"concept", title:"本关速查", tag:"讲一点",
      body:"object 列先怀疑 → str.replace 洗字符 → to_numeric(errors=\"coerce\") → fillna → astype(int)。.str 访问器管所有文本清洗。",
      tip:"明天：表里缺列、列名看不懂、列算错了 —— 增删改列。" }
  ]},

{ id:24, week:4, theme:"清洗与计算：把脏数据变干净", title:"增删改列：新列、改名、去重",
  subtitle:"整列运算、np.where 分档、rename / drop / drop_duplicates。",
  cards:[
    { type:"concept", title:"整列运算不用循环", tag:"讲一点",
      body:"df[\"单价\"] * df[\"数量\"] 是「一列 × 一列」，pandas 会一行一行对齐算好 —— 这叫向量化。写 for 循环反而慢几十倍。",
      code:`df["金额"] = df["单价"] * df["数量"]
print(df[["单价", "数量", "金额"]])`,
      tip:"只要两个 Series 长度一样，加减乘除都按行对齐。行号对不上的地方会变成 NaN —— 这也是「莫名出现 NaN」的一个来源。" },

    { type:"tool", name:"df[\"新列\"] = 表达式 —— 加一列",
      oneLine:"右边可以是列运算、一个常数、一个函数的结果，甚至一个 Series。",
      syntax:`df["金额"] = df["单价"] * df["数量"]
df["备注"] = "待核"                 # 整列同一个值
df["是否达标"] = df["金额"] > 1000   # 整列 True/False
df = df.assign(金额2=lambda d: d["单价"] * 2)   # 链式写法`,
      returns:"没有返回值，直接给 df 加一列（原地改）。",
      when:"算新指标（金额、毛利率）、打标签、做分档。",
      example:`df["毛利率"] = (df["收入"] - df["成本"]) / df["收入"]
print(df[["收入", "成本", "毛利率"]])`,
      pitfalls:[
        "右边长度必须和行数一致，否则 ValueError: Length of values does not match length of index",
        "会触发 SettingWithCopyWarning 的写法：先把筛选结果赋值给一个变量，再往它上面加列。要加列就 df = df[m].copy() 之后加"
      ],
      tip:"这一行的左边永远带方括号：df[\"新列\"] = ...，不是 df.新列 = ...。" },

    { type:"tool", name:"np.where(条件, 真值, 假值) —— 分档打标签",
      oneLine:"相当于 Excel 的 IF，但一次作用整列。",
      syntax:`import numpy as np
df["等级"] = np.where(df["金额"] > 1000, "大单", "小单")
df["等级"] = np.where(df["金额"] > 1000, "大单",
             np.where(df["金额"] > 500, "中单", "小单"))   # 三档：嵌套`,
      returns:"一个和条件等长的数组，可以直接赋给新列。",
      when:"二档、三档的简单分档（大/中/小、达标/未达标）。",
      example:`df["是否大单"] = np.where(df["金额"] > 1000, "是", "否")
print(df[["金额", "是否大单"]])`,
      pitfalls:[
        "别忘了 import numpy as np，否则 NameError: name 'np' is not defined",
        "嵌套超过两层就换 pd.cut（按区间分箱）或写个函数配合 apply，别硬套"
      ],
      tip:"二档用 np.where 最快，多档用 pd.cut（下一关的工具卡）。" },

    { type:"tool", name:"df.rename / df.drop / df.drop_duplicates —— 改名字、删东西、去重",
      oneLine:"改名不改值，删列不删行，去重保留第一条。",
      syntax:`df.rename(columns={"旧名": "新名"})          # 改列名
df.drop(columns=["没用的列"])                   # 删列
df.drop(index=[0, 2])                          # 删行
df.drop_duplicates()                           # 完全相同的行只留一条
df.drop_duplicates(subset=["订单号"])           # 按订单号去重（重复订单只留一条）`,
      returns:"都是新表（原表不动），要保留结果就 df = ...",
      when:"列名有空格/中文难打字、有多余列、有重复记录。",
      example:`df = df.rename(columns={"销售 额": "销售额"})
df = df.drop(columns=["备注"])
df = df.drop_duplicates(subset=["订单号"], keep="first")
print(df.shape)`,
      pitfalls:[
        "drop 默认删行（axis=0），删列必须写 columns=[...] 或 axis=1",
        "drop_duplicates 默认比较所有列；有订单号这种唯一标识时要写 subset，否则「金额一样的两笔不同订单」会被误删"
      ],
      tip:"养成习惯：改完立刻 print(df.shape) 和 print(df.columns.tolist())，一眼看出删对了没有。" },

    { type:"drill", title:"增删改三连", tag:"连问",
      steps:[
        { q:"想加一列「金额 = 单价 × 数量」，写法是？",
          options:['df["金额"] = df["单价"] * df["数量"]','df["金额"] = 单价 * 数量','df[金额] = df[单价] * df[数量]','df.金额 = df.单价 * df.数量'], answer:0,
          explain:"列名要带引号放进方括号：df[\"列名\"]。去掉引号就变成没定义的变量名，报 NameError；点号写法 df.金额 只能读、不能这样赋值。" },
        { q:"二档打标签（大于 1000 是大单，否则小单），最简洁？",
          options:['np.where(df["金额"] > 1000, "大单", "小单")','df["金额"].ifelse("大单")','pd.cut(df["金额"])','df.apply("大单")'], answer:0,
          explain:"np.where 三参数：条件、真值、假值。一次作用整列。" },
        { q:"按订单号去重，只留第一条，怎么写？",
          options:['df.drop_duplicates(subset=["订单号"], keep="first")','df.drop_duplicates()','df.drop("订单号")','df.unique()'], answer:0,
          explain:"不加 subset 会按所有列比较，两笔金额刚好相同的不同订单会被误删。" }
      ]},

    { type:"quiz", q:"输出是什么？", code:`df = pd.DataFrame({"a": [1, 2], "b": [10, 20]})
df["c"] = df["a"] + df["b"]
print(df["c"].tolist())`,
      options:["[11, 22]","[1, 2, 10, 20]","[3, 30]","报错"], answer:0,
      explain:"按行对齐：1+10=11，2+20=22。" },

    { type:"blank", q:"补全：把列名「销售 额」改成「销售额」", code:`df = df.rename(____={"销售 额": "销售额"})`,
      options:["columns","index","names","header"], answer:0,
      explain:"rename(columns={旧: 新}) 改列名，rename(index={...}) 改行标签。" },

    { type:"write", q:"给表加「金额」列（单价×数量），再加「是否大单」列（金额>1000 为 是），最后按订单号去重。",
      hint:"① df[\"金额\"] = df[\"单价\"] * df[\"数量\"]；② import numpy as np；③ df[\"是否大单\"] = np.where(df[\"金额\"] > 1000, \"是\", \"否\")；④ df = df.drop_duplicates(subset=[\"订单号\"])。",
      answer:`import numpy as np

df["金额"] = df["单价"] * df["数量"]
df["是否大单"] = np.where(df["金额"] > 1000, "是", "否")
df = df.drop_duplicates(subset=["订单号"])
print(df)`,
      explain:"注意 df = 的那一步：drop_duplicates 不改原表，不接住就等于没去重。" },

    { type:"concept", title:"本关速查", tag:"讲一点",
      body:"df[\"新列\"] = 表达式 · np.where(条件, 真, 假) · rename(columns=) · drop(columns=) · drop_duplicates(subset=, keep=)",
      tip:"明天：条件逻辑复杂到 np.where 写不下时 —— apply + lambda。" }
  ]},

{ id:25, week:4, theme:"清洗与计算：把脏数据变干净", title:"apply / map / lambda：把函数用在每一行上",
  subtitle:"写一次逻辑，作用到整列或整行。",
  cards:[
    { type:"concept", title:"lambda：不取名字的一次性函数", tag:"讲一点",
      body:"lambda x: x * 2 就是「给我 x，我还你 x*2」的一个小函数，不用 def、不用起名。它适合只在一处用一次的逻辑。",
      code:`f = lambda x: x * 2
print(f(3))
print((lambda a, b: a + b)(1, 2))`,
      out:`6
3`,
      tip:"lambda 后面只能写一个表达式（不能写 if 语句块、不能循环）。逻辑超过一行就老实写 def。" },

    { type:"tool", name:"s.map(字典或函数) —— 按值替换",
      oneLine:"最常用的是「查表替换」：把 1/2/3 换成 男/女/未知。",
      syntax:`df["性别"].map({"1": "男", "2": "女"})
df["等级"].map({"A": 1, "B": 2})
df["金额"].map(lambda x: x * 1.1)      # 每个值过一遍函数`,
      returns:"一个新的 Series，长度和原来一样。",
      when:"编码转文字、文字转分数、每个值统一计算。",
      example:`s = pd.Series(["1", "2", "9"])
print(s.map({"1": "男", "2": "女"}).tolist())`,
      out:`['男', '女', nan]`,
      pitfalls:[
        "字典里没写到的键会变成 NaN —— 不是报错，静悄悄变空。查表前先 value_counts 看全所有取值",
        "map 是 Series 的方法；DataFrame 没有 .map（有 .applymap / .map 在新版才有，别混）"
      ],
      tip:"map + 字典 = Excel 的 VLOOKUP 简版，专门干「编码换成含义」这件事。" },

    { type:"tool", name:"df.apply(函数, axis=1) —— 整行传给函数",
      oneLine:"需要同时看一行的好几列时用它。",
      syntax:`def 等级(r):
    if r["金额"] > 1000:
        return "大单"
    return "小单"

df["等级"] = df.apply(等级, axis=1)

df["等级2"] = df.apply(lambda r: "大单" if r["金额"] > 1000 else "小单", axis=1)`,
      returns:"一个 Series（每个元素是函数的返回值）。",
      when:"逻辑有 if/else 多层、要读同一行的多个列。",
      example:`df["标签"] = df.apply(lambda r: r["城市"] + "-" + str(r["销量"]), axis=1)
print(df["标签"].tolist())`,
      pitfalls:[
        "忘了 axis=1：默认 axis=0 是把「整列」传给函数，结果完全不对（通常报 KeyError）",
        "apply 是 Python 层循环，几万行还行，几百万行会明显变慢 —— 那时改用向量化或 np.select"
      ],
      tip:"记法：axis=0 竖向（一列一列地传），axis=1 横向（一行一行地传）。想按行算，就要 axis=1。" },

    { type:"tool", name:"pd.cut(s, bins) —— 按区间分箱",
      oneLine:"连续的数字切成几档（0-60、60-80、80-100），比嵌套 np.where 好读。",
      syntax:`pd.cut(df["分数"], bins=[0, 60, 80, 100], labels=["不及格", "及格", "优秀"])
pd.qcut(df["金额"], q=4)        # 按分位数四等分（每档人数差不多）`,
      returns:"一个 Categorical 类型的 Series（每行一个档位标签）。",
      when:"成绩分档、金额分区间、年龄段。",
      example:`s = pd.Series([55, 75, 95])
print(pd.cut(s, bins=[0, 60, 80, 100], labels=["不及格", "及格", "优秀"]).tolist())`,
      out:`['不及格', '及格', '优秀']`,
      pitfalls:[
        "bins 默认左开右闭 (a, b]：bins=[0,60] 时 0 分会被判成 NaN，最小值要留出边界",
        "标签个数必须比 bins 少一个（4 个边界 → 3 个标签）"
      ],
      tip:"cut 按你指定的边界切，qcut 按人数切。要「固定标准」用 cut，要「排名分四组」用 qcut。" },

    { type:"drill", title:"apply 三连", tag:"连问",
      steps:[
        { q:"把 1/2 换成「男/女」，用哪个最直接？",
          options:['df["性别"].map({"1": "男", "2": "女"})','df["性别"].apply({"1": "男"})','df["性别"].replace(1, 2)','df["性别"].astype("男")'], answer:0,
          explain:"map 吃字典就是查表替换。没在字典里的值会变 NaN。" },
        { q:"要同时用一行的「城市」和「销量」算新值，怎么写？",
          options:['df.apply(lambda r: ..., axis=1)','df.apply(lambda s: ..., axis=0)','df["城市"].apply(...)','df.map(...)'], answer:0,
          explain:"axis=1 才会把整行传给函数。axis=0 传的是一列。" },
        { q:"分数切成 不及格/及格/优秀 三档，最清楚的做法？",
          options:['pd.cut(df["分数"], bins=[0,60,80,100], labels=[...])','np.where 嵌套三层','for 循环','df["分数"] > 60'], answer:0,
          explain:"cut 一次写好边界和标签，比嵌套 np.where 好读也好改。" }
      ]},

    { type:"quiz", q:"输出是什么？", code:`s = pd.Series([1, 2, 3])
print(s.map(lambda x: x * 10).tolist())`,
      options:["[10, 20, 30]","[1, 2, 3]","[11, 22, 33]","报错"], answer:0,
      explain:"每个值乘 10 → [10, 20, 30]。map 对整列逐个作用。" },

    { type:"blank", q:"补全：按行处理，函数接收整行", code:`df["标签"] = df.apply(加标签, ____)`,
      options:["axis=1","axis=0","by=1","row=True"], answer:0,
      explain:"axis=1 才是按行。这是 apply 最高频的错。" },

    { type:"write", q:"用 apply 给每行生成「城市-销量」标签；再用 map 把「是/否」转成「✓/✗」。",
      hint:"① df[\"标签\"] = df.apply(lambda r: r[\"城市\"] + \"-\" + str(r[\"销量\"]), axis=1)；② df[\"标记\"] = df[\"是否大单\"].map({\"是\": \"✓\", \"否\": \"✗\"})；③ print(df)。",
      answer:`df["标签"] = df.apply(lambda r: r["城市"] + "-" + str(r["销量"]), axis=1)
df["标记"] = df["是否大单"].map({"是": "✓", "否": "✗"})
print(df)`,
      explain:"字符串拼接时数字要 str()，不然 TypeError: can only concatenate str (not \"int\") to str。" },

    { type:"concept", title:"本关速查", tag:"讲一点",
      body:"lambda x: 表达式 · s.map(字典) 查表 · df.apply(f, axis=1) 按行 · pd.cut(s, bins, labels) 分档",
      tip:"明天：分组统计 —— pandas 最值钱的一个动作。" }
  ]},

{ id:26, week:4, theme:"清洗与计算：把脏数据变干净", title:"groupby：按部门/城市分组算",
  subtitle:"拆分 → 计算 → 合并。三行代码顶一个数据透视表。",
  cards:[
    { type:"concept", title:"分组统计就是「分类汇总」", tag:"讲一点",
      body:"老板要的不是「公司一共花了多少」，而是「每个部门各花了多少」。groupby 做的就是：按某列的值把行分成几堆，每堆算一个数，再合起来。",
      code:`df.groupby("部门")["金额"].sum()`,
      out:`部门
技术    300
销售    450
Name: 金额, dtype: int64`,
      tip:"记住这个形状：df.groupby(按什么分)[算哪一列].算什么。三个位置缺一不可（算全部列可以省中间）。" },

    { type:"tool", name:"df.groupby(列)[列].聚合 —— 主力写法",
      oneLine:"最常用的四个：sum 求和、mean 平均、count 计数、size 行数。",
      syntax:`df.groupby("部门")["金额"].sum()
df.groupby("部门")["金额"].mean()
df.groupby("部门")["金额"].count()      # 非空个数
df.groupby("部门").size()               # 每个部门的行数（含空值行）
df.groupby(["部门", "城市"])["金额"].sum()   # 多列分组`,
      returns:"一个 Series，索引是分组的值。",
      when:"每个分组的合计、平均、人数、单数。",
      example:`print(df.groupby("部门")["金额"].sum())`,
      out:`部门
技术    300
销售    450
Name: 金额, dtype: int64`,
      pitfalls:[
        "count 和 size 不一样：count 不算空值，size 算行数。算「有多少单」要用 size 或 count 在非空列上",
        "分组列自己也会被拿去算（比如对「部门」求 sum 会拼接字符串），所以中括号里写要算的那一列"
      ],
      tip:"想变回普通表就 .reset_index()，不然索引是部门名，后面取值很别扭。" },

    { type:"tool", name:"groupby(...).agg(...) —— 一次算多个指标",
      oneLine:"同一组里同时要总和、平均、最大，一次给全。",
      syntax:`df.groupby("部门")["金额"].agg(["sum", "mean", "max"])
df.groupby("部门").agg({"金额": "sum", "订单号": "count"})
df.groupby("部门").agg(
    总额=("金额", "sum"),
    单数=("订单号", "count"),
    均价=("金额", "mean"),
)`,
      returns:"DataFrame（多列指标）。",
      when:"要做一张「部门 × 指标」的表给领导看。",
      example:`print(df.groupby("部门").agg(总额=("金额", "sum"), 单数=("订单号", "count")))`,
      out:`      总额  单数
部门
技术   300   2
销售   450   1`,
      pitfalls:[
        "命名聚合的括号是「新列名=(原列, 函数名)」，写成 (\"金额\", sum) 少引号会变成函数对象，报错很绕",
        "agg 里的函数名是字符串（\"sum\"）不是调用（sum()）"
      ],
      tip:"命名聚合那三行值得抄下来，做报表 90% 的场合都用它。" },

    { type:"drill", title:"分组三连", tag:"连问",
      steps:[
        { q:"按部门算金额总额，写法是？",
          options:['df.groupby("部门")["金额"].sum()','df["部门"].sum()','df.sum("部门")','df.group("部门")'], answer:0,
          explain:"分组 → 选列 → 算。顺序固定。" },
        { q:"想知道每个部门各有几行（含空值行），用？",
          options:['df.groupby("部门").size()','df.groupby("部门")["金额"].count()','df.shape','df["部门"].count()'], answer:0,
          explain:"size 数行数（不排除空值），count 数非空值。要「几单」通常用 size。" },
        { q:"分组结果想变回带普通 0、1、2 索引的表，加什么？",
          options:[".reset_index()",".index()",".T()",".values"], answer:0,
          explain:"分组结果的索引是部门名，reset_index() 把它变成一列普通数据。" }
      ]},

    { type:"quiz", q:"输出是什么？", code:`df = pd.DataFrame({"部门": ["技术", "技术", "销售"], "金额": [100, 200, 300]})
print(df.groupby("部门")["金额"].sum().loc["技术"])`,
      options:["300","100","600","报错"], answer:0,
      explain:"技术的两笔：100 + 200 = 300。结果索引是部门名，所以能用 .loc[\"技术\"] 取。" },

    { type:"fill", q:"这行打印什么？", code:`df = pd.DataFrame({"k": ["a", "a", "b"], "v": [1, 2, 3]})
print(df.groupby("k")["v"].mean().loc["a"])`,
      ph:"输入一个数字", accept:["1.5"],
      explain:"a 组是 1 和 2，平均 1.5。注意有小数——mean 返回 float。" },

    { type:"write", q:"按城市统计销量总和、平均、订单数（用 size），打印成一张表。",
      hint:"① df.groupby(\"城市\")[\"销量\"].agg([\"sum\", \"mean\"])；② 想要三列：df.groupby(\"城市\").agg(总销量=(\"销量\", \"sum\"), 平均=(\"销量\", \"mean\"), 单数=(\"销量\", \"size\"))；③ print(...)。",
      answer:`报表 = df.groupby("城市").agg(
    总销量=("销量", "sum"),
    平均=("销量", "mean"),
    单数=("销量", "size"),
)
print(报表)`,
      explain:"中文变量名在 Python 3 是合法的，练习时用着顺手；真实项目里建议用英文。" },

    { type:"concept", title:"本关速查", tag:"讲一点",
      body:"groupby(分什么)[算哪列].sum/mean/count/size · agg 多指标 · agg(新名=(列, 函数)) 命名聚合 · reset_index() 变回普通表",
      tip:"明天：一张「行 × 列」的交叉表 —— pivot_table，Excel 透视表的亲兄弟。" }
  ]},

{ id:27, week:4, theme:"清洗与计算：把脏数据变干净", title:"透视表：pivot_table 与 crosstab",
  subtitle:"行是一个维度、列是另一个维度，格子里放统计值。",
  cards:[
    { type:"concept", title:"交叉表：两个维度一起看", tag:"讲一点",
      body:"groupby 一次只能按一组分。想知道「每个城市 × 每个季度的销量」，就要两个维度 —— 一个放行、一个放列，中间填数。这就是透视表。",
      code:`pd.pivot_table(df, index="城市", columns="季度", values="销量", aggfunc="sum")`,
      out:`季度    Q1   Q2
城市
北京   120   90
上海    95  110`,
      tip:"index 放行、columns 放列、values 放要算的数、aggfunc 放算法。四个参数记住，Excel 透视表就会了。" },

    { type:"tool", name:"pd.pivot_table(...) —— 透视表",
      oneLine:"默认 aggfunc 是 mean，这是第一个大坑。",
      syntax:`pd.pivot_table(df, index="城市", columns="季度", values="销量", aggfunc="sum")
pd.pivot_table(df, index=["城市", "渠道"], values="销量", aggfunc="sum")
pd.pivot_table(df, index="城市", values="销量", aggfunc="sum", margins=True)   # 加合计行`,
      returns:"一个 DataFrame：行索引 = index 的取值，列 = columns 的取值。",
      when:"两个维度交叉看数、做月度/地区报表。",
      example:`p = pd.pivot_table(df, index="城市", columns="季度", values="销量", aggfunc="sum", fill_value=0)
print(p)`,
      pitfalls:[
        "不写 aggfunc 默认是 mean（平均），不是 sum —— 数字看着差不多但含义完全不同",
        "某个「城市 × 季度」没有数据时格子里是 NaN，要显示 0 得加 fill_value=0"
      ],
      tip:"每次写 pivot_table 都把 aggfunc 显式写上，省得后面怀疑人生。" },

    { type:"tool", name:"pd.crosstab(...) —— 数频次的透视表",
      oneLine:"只想看「各有多少个」，用 crosstab 更快。",
      syntax:`pd.crosstab(df["城市"], df["季度"])
pd.crosstab(df["城市"], df["季度"], normalize="index")   # 按行算占比
pd.crosstab(df["城市"], df["季度"], values=df["销量"], aggfunc="sum")`,
      returns:"DataFrame：行 = 第一个参数，列 = 第二个参数，格子 = 个数。",
      when:"看两个分类变量的分布、做交叉统计（男女各多少人买了/没买）。",
      example:`print(pd.crosstab(df["城市"], df["季度"]))`,
      out:`季度  Q1  Q2
城市
北京   2   1
上海   1   2`,
      pitfalls:[
        "crosstab 默认数「行数」；要算金额得显式传 values= 和 aggfunc=",
        "normalize=\"index\" 是按行算占比，normalize=\"columns\" 按列，normalize=True 按全表 —— 三种结果完全不同"
      ],
      tip:"groupby 算数、pivot_table 摆形状、crosstab 数个数。三件工具，一件事的不同侧面。" },

    { type:"drill", title:"透视三连", tag:"连问",
      steps:[
        { q:"pivot_table 不写 aggfunc，默认算什么？",
          options:["平均值 mean","总和 sum","个数 count","报错"], answer:0,
          explain:"默认是 mean。这就是为什么「明明要合计，得出来的数却像平均」。" },
        { q:"透视表里某个格子显示 NaN，想显示 0，加什么参数？",
          options:["fill_value=0","values=0","na=0","dropna=False"], answer:0,
          explain:"fill_value 专门填透视表空格。" },
        { q:"只想数「每个城市在每个季度各有几单」，用哪个最省事？",
          options:['pd.crosstab(df["城市"], df["季度"])','pd.pivot_table(..., aggfunc="count")','df.groupby("城市").size()','df.describe()'], answer:0,
          explain:"crosstab 默认就是数个数，两个参数搞定。pivot_table 也能做，但要写更多参数。" }
      ]},

    { type:"quiz", q:"输出是什么？", code:`df = pd.DataFrame({"c": ["北京", "北京", "上海"], "q": ["Q1", "Q2", "Q1"]})
print(pd.crosstab(df["c"], df["q"]).loc["北京"].sum())`,
      options:["2","1","3","报错"], answer:0,
      explain:"北京在 Q1、Q2 各 1 条 → 该行合计 2。" },

    { type:"blank", q:"补全：按城市求销量总和", code:`pd.pivot_table(df, index="城市", values="销量", ____)`,
      options:['aggfunc="sum"','aggfunc="count"','sum=True','agg="total"'], answer:0,
      explain:"不写就默认 mean。要总和必须显式 aggfunc=\"sum\"。" },

    { type:"write", q:"做一张「城市 × 季度」的销量总和透视表，空值填 0，再加一行合计。",
      hint:"① p = pd.pivot_table(df, index=\"城市\", columns=\"季度\", values=\"销量\", aggfunc=\"sum\", fill_value=0, margins=True, margins_name=\"合计\")；② print(p)。",
      answer:`p = pd.pivot_table(
    df, index="城市", columns="季度", values="销量",
    aggfunc="sum", fill_value=0, margins=True, margins_name="合计",
)
print(p)`,
      explain:"margins=True 就是 Excel 透视表的「总计」行列。margins_name 改它的名字。" },

    { type:"concept", title:"本关速查", tag:"讲一点",
      body:"pivot_table(index=, columns=, values=, aggfunc=\"sum\", fill_value=0, margins=True) · crosstab(行, 列) 数个数 · normalize 算占比",
      tip:"明天：第 4 周收尾 —— 把一份脏表从头洗到能算。" }
  ]},

{ id:28, week:4, theme:"清洗与计算：把脏数据变干净", title:"复习：一份脏表，洗到能算",
  subtitle:"空值、类型、文本、新列、分组，五步走完。",
  cards:[
    { type:"concept", title:"洗数据的固定顺序", tag:"讲一点",
      body:"① 读进来，head 看一眼 ② isna().sum() 数空值 → 删或填 ③ 检查 object 的「数字列」→ 转类型 ④ 文本列 strip / replace 统一写法 ⑤ 加需要的列、分组算指标。\n顺序不要乱：先洗值、再转类型、最后算 —— 反过来会一路报错。",
      code:`df = pd.read_csv("sales.csv")
print(df.isna().sum())

df["销量"] = pd.to_numeric(df["销量"], errors="coerce").fillna(0)
df["城市"] = df["城市"].str.strip()

df["金额"] = df["单价"] * df["销量"]
print(df.groupby("城市")["金额"].sum())`,
      tip:"洗数据最花时间的不是写代码，是「判断这个值该填什么」。填之前先问业务：缺失是真的没有，还是没记录？" },

    { type:"drill", title:"洗表流程三连", tag:"连问",
      steps:[
        { q:"第一步该做什么？",
          options:["head + isna().sum() 看清数据和空值","直接 groupby","直接 to_csv","先画图"], answer:0,
          explain:"先看再动手。没看清就洗，洗完还得重洗。" },
        { q:"「销量」列 object 且含「1,280」，正确顺序是？",
          options:['str.replace 去逗号 → to_numeric(coerce) → fillna','先 fillna 再 replace','先 astype(int) 再 replace','直接 sum'], answer:0,
          explain:"先洗字符才能转数字；先 astype 会直接报错。" },
        { q:"按城市算金额合计，但结果里有两个「北京」，说明？",
          options:["有一边带空格或写法不同，要 str.strip() 统一","pandas 有 bug","要 reset_index","要排序"], answer:0,
          explain:"分组结果出现重复的「同类」值，基本都是文本不一致。先 value_counts 看。" }
      ]},

    { type:"quiz", q:"输出是什么？", code:`df = pd.DataFrame({"城市": ["北京 ", "北京"], "v": [1, 2]})
print(df.groupby("城市")["v"].sum().shape[0])`,
      options:["2","1","3","报错"], answer:0,
      explain:"「北京 」和「北京」是两个不同的键 → 两组。这就是脏数据最典型的症状。" },

    { type:"fill", q:"这行打印什么？", code:`df = pd.DataFrame({"a": [1, None, 3]})
print(df["a"].fillna(0).sum())`,
      ph:"输入一个数字", accept:["4"],
      explain:"1 + 0 + 3 = 4。" },

    { type:"write", q:"洗一份脏表：销量列含逗号和「无」→ 转数字填 0；城市列去空格；新增「金额」列（单价×销量）；按城市输出金额合计。",
      hint:"按顺序：① str.replace(\",\", \"\")；② pd.to_numeric(..., errors=\"coerce\").fillna(0)；③ df[\"城市\"].str.strip()；④ df[\"金额\"] = df[\"单价\"] * df[\"销量\"]；⑤ df.groupby(\"城市\")[\"金额\"].sum()。",
      answer:`import pandas as pd

df = pd.read_csv("sales.csv")

df["销量"] = df["销量"].str.replace(",", "")
df["销量"] = pd.to_numeric(df["销量"], errors="coerce").fillna(0)
df["城市"] = df["城市"].str.strip()

df["金额"] = df["单价"] * df["销量"]
print(df.groupby("城市")["金额"].sum().sort_values(ascending=False))`,
      explain:"最后加了个 sort_values：报表习惯上从大到小排。这一整段可以直接当「清洗模板」存起来复用。" },

    { type:"concept", title:"第 4 周结束", tag:"讲一点",
      body:"你现在会处理：空值、类型错、文本脏、要新增列、要分组汇总。这五件事构成了「数据清洗」的全部日常。",
      tip:"第 5 周：把多个月的表拼起来、按时间汇总、画成图、导出成 Excel 交给别人。" }
  ]}
);
