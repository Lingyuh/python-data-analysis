/* 第 3 周：pandas 登场 —— 把表格变成变量
   同样按「讲 → 工具卡 → 连问 → 写作 → 收尾」排：
   read_csv / head / info / describe / value_counts / loc / iloc / sort_values 各一张工具卡。 */
(window.PY_DAYS = window.PY_DAYS || []).push(

{ id:15, week:3, theme:"pandas 登场：把表格变成变量", title:"装 pandas，认识 DataFrame",
  subtitle:"装三件套、从字典建一张表、head/shape 看它长什么样。",
  cards:[
    { type:"concept", title:"一条命令装齐三件套", tag:"讲一点",
      body:"pandas 是 Python 的数据分析主力，专门处理表格。终端里一条命令装齐：pandas 算数据、openpyxl 读 xlsx、matplotlib 画图。",
      code:`pip install pandas openpyxl matplotlib`,
      tip:"国内慢就加镜像：pip install pandas -i https://pypi.tuna.tsinghua.edu.cn/simple 。装完在 Python 里写 import pandas as pd 不报错就成功了。" },

    { type:"concept", title:"Series 是一列，DataFrame 是一张表", tag:"讲一点",
      body:"DataFrame = 整张表（有行有列，每列一个类型）。Series = 单独一列（一串带行号的值）。\ndf[\"销量\"] 拿到的就是一个 Series。",
      code:`import pandas as pd

s = pd.Series([120, 95, 88])
print(s)
print(type(s))`,
      out:`0    120
1     95
2     88
dtype: int64
<class 'pandas.core.series.Series'>`,
      tip:"记住一句话：DataFrame 是二维的（行 × 列），Series 是一维的（一列）。后面所有报错几乎都在提示你「这里该是表还是列」。" },

    { type:"tool", name:"pd.DataFrame({...}) —— 从字典建一张表",
      oneLine:"字典的键就是列名，每个列表就是一整列。",
      syntax:`df = pd.DataFrame({
    "列名1": [值1, 值2, 值3],
    "列名2": [值1, 值2, 值3],
})`,
      returns:"一个 DataFrame（一张表）。",
      when:"手上是 Python 的列表/字典，想变成能筛、能算、能画图的表。",
      example:`import pandas as pd

df = pd.DataFrame({
    "城市": ["北京", "上海", "广州"],
    "销量": [120, 95, 88],
})
print(df)`,
      out:`   城市  销量
0  北京  120
1  上海   95
2  广州   88`,
      pitfalls:[
        "每个列表长度必须一样，不然直接 ValueError: All arrays must be of the same length",
        "左边那列 0 1 2 是行号（index），不是数据。Excel 行号从 1 起、pandas 从 0 起，对不上是正常的"
      ],
      tip:"这就是第 11 关「列表装字典」的升级版：一行一个字典 → 一列一个列表。数据还是那些数据，换了个更省事的容器。" },

    { type:"tool", name:"df.head(n) / df.tail(n) —— 只看前几行",
      oneLine:"打开任何数据的第一件事：先看它长什么样。",
      syntax:`df.head()      # 前 5 行
df.head(3)     # 前 3 行
df.tail(2)     # 最后 2 行`,
      returns:"一个新的小表（不改变 df 本身）。",
      when:"刚读进来一张表、想确认列名和内容对不对。",
      example:`print(df.head(2))
print(df.shape)`,
      out:`   城市  销量
0  北京  120
1  上海   95
(3, 2)`,
      pitfalls:[
        "head() 只是显示几行，不会改数据。想看真实行数用 len(df) 或 df.shape[0]",
        "df.shape 是属性不是函数，写成 df.shape() 会报 'tuple' object is not callable"
      ],
      tip:"口诀：先 head 看一眼，再 info 看结构，最后 describe 看数。" },

    { type:"drill", title:"建表 / 看表", tag:"连问",
      steps:[
        { q:"{'a': [1, 2], 'b': [1, 2, 3]} 建表会怎样？",
          options:["正常建表，b 列多一行","报错 ValueError（各列长度不一致）","自动把 a 补齐成 3 行","忽略 b 列的第三个值"], answer:1,
          explain:"pandas 要求每列长度相同。遇到这种就先检查数据源，而不是硬塞。" },
        { q:"df 有 3 行数据，df.head(2) 打印几行数据？",
          options:["2 行","3 行","5 行","1 行"], answer:0,
          explain:"head(2) 就是前 2 行（不含表头那行）。" },
        { q:"df 是 3 行 2 列，df.shape 是什么？",
          options:["(3, 2)","(2, 3)","3","6"], answer:0,
          explain:"shape 是 (行数, 列数)，先横数行、再竖数列 → (3, 2)。" }
      ]},

    { type:"quiz", q:"输出是什么？", code:`df = pd.DataFrame({"a": [1, 2]})
print(df.shape)`,
      options:["(2, 1)","(1, 2)","2","[1, 2]"], answer:0,
      explain:"2 行 1 列 → (2, 1)。shape 永远是「行在前、列在后」。" },

    { type:"fill", q:"这行打印什么？", code:`df = pd.DataFrame({"x": [1, 2, 3]})
print(len(df))`,
      ph:"输入一个数字", accept:["3"],
      explain:"len(df) 是行数 → 3。注意不是元素总数（那是 df.size）。" },

    { type:"write", q:"建一张 3 行的表（城市、销量），打印整表、行数、列数。",
      hint:"① import pandas as pd；② df = pd.DataFrame({\"城市\": [\"北京\",\"上海\",\"广州\"], \"销量\": [120, 95, 88]})；③ print(df)；④ print(len(df))；⑤ print(df.shape)。",
      answer:`import pandas as pd

df = pd.DataFrame({
    "城市": ["北京", "上海", "广州"],
    "销量": [120, 95, 88],
})
print(df)
print("行数", len(df))
print("行列", df.shape)`,
      explain:"从这行起你就有一个表了。第 4 周的所有操作（筛、算、分组、画图）都作用在这种对象上。" },

    { type:"concept", title:"本关速查", tag:"讲一点",
      body:"pd.DataFrame({列: 列表}) 建表 · df.head(n) 看前几行 · df.shape 看 (行, 列) · len(df) 看行数 · df[\"列\"] 取一列（Series）",
      tip:"明天：真实数据不会写在代码里，它在 csv 和 Excel 里 —— 怎么读进来？" }
  ]},

{ id:16, week:3, theme:"pandas 登场：把表格变成变量", title:"读文件：read_csv / read_excel",
  subtitle:"路径怎么写、中文乱码、分隔符、多个 sheet 怎么一次读完。",
  cards:[
    { type:"concept", title:"数据在文件里，不在代码里", tag:"讲一点",
      body:"真实工作中，数据是同事发来的 csv、财务的 xlsx、系统导出的 txt。pandas 读进来就变成一个 DataFrame，之后跟第 15 关建的表完全一样。",
      code:`import pandas as pd

df = pd.read_csv("sales.csv")
print(df.head())`,
      tip:"读文件前先确认：文件在哪、叫什么、编码是什么、第一行是不是表头。这四个问题定了，后面就不会踩坑。" },

    { type:"tool", name:"pd.read_csv(路径, ...) —— 读 csv / txt",
      oneLine:"最常用的读文件函数。参数不多，但每一个都对应一个真实的坑。",
      syntax:`pd.read_csv("sales.csv")
pd.read_csv("sales.csv", encoding="gbk")     # 中文乱码
pd.read_csv("sales.csv", sep=";")           # 不是逗号分隔
pd.read_csv("sales.csv", header=None)       # 第一行不是表头
pd.read_csv("sales.csv", usecols=["城市", "销量"])   # 只读这两列`,
      returns:"一个 DataFrame。",
      when:"文件后缀是 .csv / .tsv / .txt（本质都是纯文本表格）。",
      example:`df = pd.read_csv("sales.csv", encoding="utf-8")
print(df.shape)
print(df.columns.tolist())`,
      out:`(3, 2)
['城市', '销量']`,
      pitfalls:[
        "路径错 → FileNotFoundError。Windows 上路径写成 r\"D:\\data\\sales.csv\"（前面加 r）或用正斜杠 \"D:/data/sales.csv\"",
        "中文乱码先试 encoding=\"gbk\"（Excel 另存的 csv 在国内常是 gbk）",
        "分隔符不是逗号（分号、制表符）要写 sep=\";\" 或 sep=\"\\t\"，否则整行会被塞进一列"
      ],
      tip:"读完第一件事不是算，是 df.head()。看错了列、看错了行，后面全白算。" },

    { type:"tool", name:"pd.read_excel(路径, sheet_name=...) —— 读 xlsx",
      oneLine:"一个 Excel 文件里可能有好几个 sheet，一次读一个，也可以一次全读。",
      syntax:`pd.read_excel("报表.xlsx")                    # 第一个 sheet
pd.read_excel("报表.xlsx", sheet_name="1月")    # 指定 sheet
pd.read_excel("报表.xlsx", sheet_name=None)     # 全部读进来，返回字典`,
      returns:"DataFrame；sheet_name=None 时返回 {sheet 名: DataFrame} 的字典。",
      when:"数据在 .xlsx / .xls 里。读 xlsx 需要先 pip install openpyxl。",
      example:`sheets = pd.read_excel("报表.xlsx", sheet_name=None)
print(list(sheets.keys()))
df = sheets["1月"]
print(df.head())`,
      out:`['1月', '2月']
   城市  销量
0  北京  120`,
      pitfalls:[
        "没装 openpyxl → ImportError: Missing optional dependency 'openpyxl'。跟 pandas 一起装上就没事",
        "sheet_name 写错 → ValueError: Worksheet named '1月份' not found。用 sheet_name=None 先看有哪些名字"
      ],
      tip:"sheet 名字严格匹配（空格、全角半角都算）。不确定就先 sheet_name=None 打出来看。" },

    { type:"drill", title:"读文件三连", tag:"连问",
      steps:[
        { q:"pd.read_csv(\"sales.csv\") 报 FileNotFoundError，最可能是？",
          options:["文件路径或文件名写错（或当前目录不在那里）","pandas 没装","文件里没有数据","编码不对"], answer:0,
          explain:"FileNotFoundError 就是「按这个路径找不到文件」。先确认文件真实位置，再看当前工作目录。" },
        { q:"读进来中文全是乱码，先试哪个参数？",
          options:["encoding=\"gbk\"","sep=\";\"","header=None","index_col=0"], answer:0,
          explain:"乱码是编码问题。utf-8 失败就试 gbk（国内 Excel 导出的 csv 很多是 gbk）。" },
        { q:"一份 csv 是用分号分隔的，怎么读？",
          options:["sep=\";\"","header=\";\"","encoding=\";\"","sheet_name=\";\""], answer:0,
          explain:"分隔符不对会导致整行挤成一列。指定的参数叫 sep（separator）。" }
      ]},

    { type:"quiz", q:"一份 xlsx 有「1月」「2月」两个 sheet，怎么一次全读进来？", code:`sheets = pd.read_excel("报表.xlsx", sheet_name=None)`,
      options:["返回一个字典，键是 sheet 名","返回两个 DataFrame 组成的列表","只能读第一个 sheet","会报错"], answer:0,
      explain:"sheet_name=None → {sheet名: DataFrame}。之后 sheets[\"1月\"] 就是 1 月那张表。" },

    { type:"blank", q:"补全：读「1月」这个 sheet", code:`df = pd.read_excel("报表.xlsx", ____)`,
      options:["sheet_name=\"1月\"","sheet=\"1月\"","name=\"1月\"","header=\"1月\""], answer:0,
      explain:"参数名就叫 sheet_name。写 sheet= 会报 TypeError: unexpected keyword argument。" },

    { type:"write", q:"读一个 csv（sales.csv），打印前三行、行列数、所有列名。",
      hint:"① import pandas as pd；② df = pd.read_csv(\"sales.csv\")；③ print(df.head(3))；④ print(df.shape)；⑤ print(df.columns.tolist())。读不到文件就把路径换成你电脑上真实的那个。",
      answer:`import pandas as pd

df = pd.read_csv("sales.csv")
print(df.head(3))
print("行列", df.shape)
print("列名", df.columns.tolist())`,
      explain:"df.columns 是「列名」这个特殊对象，.tolist() 转成普通列表更好看。这三行就是你以后每个脚本的开头。" },

    { type:"concept", title:"本关速查：读文件四参数", tag:"讲一点",
      body:"路径（加 r）· encoding=\"gbk\" 治乱码 · sep=\";\" 治挤成一列 · header=None 治没有表头 · sheet_name=None 一次读全部 sheet",
      tip:"明天：读进来之后，怎么用 30 秒判断这份数据「能不能用」？" }
  ]},

{ id:17, week:3, theme:"pandas 登场：把表格变成变量", title:"结构体检：info / describe / value_counts",
  subtitle:"30 秒看清楚：多少行、每列什么类型、有没有空值、分类长什么样。",
  cards:[
    { type:"concept", title:"拿到表，先问三个问题", tag:"讲一点",
      body:"① 多少行多少列？（df.shape）② 每列是什么类型、有没有空值？（df.info()）③ 数值大概什么范围、分类有哪些值？（describe / value_counts）\n这三个问题答完，你才知道这份数据能不能用、该怎么洗。",
      code:`print(df.shape)
df.info()
print(df.describe())`,
      tip:"体检≠分析。体检是「先确认我没看错数据」，花 30 秒，能省掉后面两小时的错。" },

    { type:"tool", name:"df.info() —— 列名、类型、空值，一眼全看到",
      oneLine:"最像「体检报告」的一个函数：每列几个非空、什么类型。",
      syntax:`df.info()`,
      returns:"没有返回值（返回 None），它直接往屏幕上打印。",
      when:"刚读进数据、怀疑有空值、数字列算不出结果时。",
      example:`df.info()`,
      out:`<class 'pandas.core.frame.DataFrame'>
RangeIndex: 3 entries, 0 to 2
Data columns (total 2 columns):
 #   Column  Non-Null Count  Dtype
---  ------  --------------  -----
 0   城市      3 non-null      object
 1   销量      3 non-null      int64
dtypes: int64(1), object(1)`,
      pitfalls:[
        "info() 是打印，不是返回：x = df.info() 里 x 是 None",
        "object = 字符串。数字列如果是 object，说明里面混了文字、空格或「1,280」这种带逗号的写法，不能直接 sum"
      ],
      tip:"看 Non-Null Count 和 entries 相等不相等：不相等就有空值，差多少就是几个空值。" },

    { type:"tool", name:"df.describe() —— 数值列的分布",
      oneLine:"count / mean / std / min / 25% / 50% / 75% / max，一张小表看完。",
      syntax:`df.describe()                     # 只统计数字列
df.describe(include="object")     # 统计字符串列（unique/top/freq）`,
      returns:"一个新的 DataFrame（统计结果表），不是打印。",
      when:"找异常值：min 是负数？max 大得离谱？mean 和 50% 差很远（有极端值）？",
      example:`print(df.describe())`,
      out:`             销量
count    3.000000
mean   101.000000
std     16.522711
min     88.000000
50%     95.000000
max    120.000000`,
      pitfalls:[
        "默认只统计数字列。全是字符串的表，describe() 会只给一行 count",
        "describe 的 count 是「非空个数」，可能小于 len(df)"
      ],
      tip:"mean 和 50%（中位数）差很多，说明有极端值把平均值拉走了 —— 这时候该看中位数或分组的数。" },

    { type:"tool", name:'df["列"].value_counts() —— 每个值出现了几次',
      oneLine:"看分类字段有哪些取值、分布是否均衡、有没有脏写法。",
      syntax:`df["城市"].value_counts()
df["城市"].value_counts(normalize=True)   # 占比
df["城市"].value_counts(dropna=False)     # 把空值也计入`,
      returns:"一个 Series：值 → 次数，默认按次数从多到少排序。",
      when:"看「有几个城市」「哪种状态最多」「有没有 北京 / 北京市 / 北京（带空格）这种脏数据」。",
      example:`print(df["城市"].value_counts())`,
      out:`北京    2
上海    1
Name: 城市, dtype: int64`,
      pitfalls:[
        "默认不统计空值。想知道 NaN 有多少，用 dropna=False",
        "末尾空格会被当成另一个类别：\"北京\" 和 \"北京 \" 算两个。先 df[\"城市\"].str.strip() 清一下"
      ],
      tip:"这是发现脏数据最快的一招。做数据分析，一半时间花在发现「原来这里有两个北京」上。" },

    { type:"drill", title:"体检三连", tag:"连问",
      steps:[
        { q:"想知道哪一列有空值、每列什么类型，看哪个最快？",
          options:["df.info() 的 Non-Null Count / Dtype","df.head()","df.shape","df.columns"], answer:0,
          explain:"head 只显示几行值，看不出类型和空值统计；info 一次给全。" },
        { q:"一张表里除了一列「销量」是数字，其余都是城市、日期这样的文字。print(df.describe()) 只给了一个数字列的结果，为什么？",
          options:["其他列是字符串（object），describe 默认只统计数字","其他列全是空","describe 坏了","需要先 head"], answer:0,
          explain:"describe 默认 include=\"number\"。想看字符串列加 include=\"object\"。" },
        { q:"「每个城市各有多少行、各占多少比例」，用哪个？",
          options:['df["城市"].value_counts(normalize=True)','df.describe()','df["城市"].count()','df.groupby()'], answer:0,
          explain:"value_counts 数次数，normalize=True 直接给占比。df[\"城市\"].count() 只给一个总数（非空行数）。" }
      ]},

    { type:"quiz", q:"这行打印什么？", code:`df = pd.DataFrame({"c": ["北京", "上海", "北京"]})
print(df["c"].value_counts().iloc[0])`,
      options:["2","1","3","北京"], answer:0,
      explain:"value_counts 从头排：北京 2、上海 1。iloc[0] 取第一个数 → 2。" },

    { type:"fill", q:"这行打印什么？", code:`df = pd.DataFrame({"a": [1, 2, 2, 3]})
print(df["a"].value_counts().iloc[0])`,
      ph:"输入一个数字", accept:["2"],
      explain:"2 出现了两次，是最多的，排在第一 → 2。" },

    { type:"write", q:"写一个体检脚本：读 sales.csv，打印行列数、info()、销量列的 describe()、城市列的 value_counts()。",
      hint:"① df = pd.read_csv(\"sales.csv\")；② print(df.shape)；③ df.info()（不加 print）；④ print(df[\"销量\"].describe())；⑤ print(df[\"城市\"].value_counts())。",
      answer:`import pandas as pd

df = pd.read_csv("sales.csv")
print("行列", df.shape)
df.info()
print(df["销量"].describe())
print(df["城市"].value_counts())`,
      explain:"这五行以后可以用在任何一份新数据上。养成习惯：拿到数据先跑它，再决定怎么分析。" },

    { type:"concept", title:"本关速查", tag:"讲一点",
      body:"df.shape 多大 · df.info() 什么类型几个空 · df.describe() 数值分布 · df[\"列\"].value_counts() 分类分布",
      tip:"明天：看清结构之后，怎么精确地「取某几行某几列」？pandas 有两套语言。" }
  ]},

{ id:18, week:3, theme:"pandas 登场：把表格变成变量", title:"选行列：loc 认名字，iloc 认位置",
  subtitle:"两套地址系统，边界规则还不一样：loc 含尾，iloc 不含尾。",
  cards:[
    { type:"concept", title:"给格子编地址，有两种语言", tag:"讲一点",
      body:"loc = 用「名字」找（行标签、列名）；iloc = 用「位置」找（第几行、第几列，从 0 数）。\n名字你一眼能看懂，位置适合「最后一行」「前 3 列」这种说法。",
      code:`df.loc[1, "销量"]      # 标签为 1 的那行、"销量" 那列
df.iloc[1, 1]          # 第 2 行、第 2 列`,
      tip:"记法：loc 的 l = label（标签），iloc 的 i = integer（整数位置）。" },

    { type:"tool", name:"df.loc[行, 列] —— 按名字取",
      oneLine:"用行标签和列名选，切片「含尾」。",
      syntax:`df.loc[1]                       # 整行
df.loc[1, "销量"]                # 单个格子
df.loc[0:2, ["城市", "销量"]]     # 0、1、2 三行（含尾！）
df.loc[df["销量"] > 90, "城市"]   # 按条件选行 + 选一列`,
      returns:"整行 → Series；单格 → 一个值；多行多列 → 新 DataFrame。",
      when:"你知道列名、知道行标签，或者要按条件选。",
      example:`print(df.loc[0:1, ["城市", "销量"]])
print(df.loc[2, "销量"])`,
      out:`   城市  销量
0  北京  120
1  上海   95
88`,
      pitfalls:[
        "loc 的切片含尾：df.loc[0:2] 是 0、1、2 三行（iloc 的 0:2 只有两行）",
        "行标签不是 0、1、2 的时候（比如按日期做了 index），df.loc[0] 会 KeyError —— 先 print(df.index) 看一眼"
      ],
      tip:"loc 就是「按名字查户口」，名字必须真实存在。" },

    { type:"tool", name:"df.iloc[行号, 列号] —— 按位置取",
      oneLine:"用整数位置选，切片「含头不含尾」，和列表一个规矩。",
      syntax:`df.iloc[0]              # 第 1 行
df.iloc[0, 1]          # 第 1 行第 2 列
df.iloc[0:2, 0:2]      # 前 2 行、前 2 列（不含 2）
df.iloc[-1]            # 最后一行`,
      returns:"整行 → Series；单格 → 一个值；多行多列 → 新 DataFrame。",
      when:"不知道列名、列太多、要最后一行、要前 N 行。",
      example:`print(df.iloc[0:2])
print(df.iloc[-1, 1])`,
      out:`   城市  销量
0  北京  120
1  上海   95
88`,
      pitfalls:[
        "iloc 切片不含尾：df.iloc[0:2] 只有 0、1 两行",
        "iloc 只吃整数：df.iloc[\"城市\"] 报 TypeError；给列名的活儿归 loc"
      ],
      tip:"一句话对比：loc[0:2] 三行，iloc[0:2] 两行。考试/面试最爱考这一点。" },

    { type:"drill", title:"含尾还是不含尾", tag:"连问",
      steps:[
        { q:"df 有 3 行，df.loc[0:2] 选出几行？",
          options:["3 行","2 行","1 行","报错"], answer:0,
          explain:"loc 含尾：0、1、2 → 3 行。" },
        { q:"df 有 3 行，df.iloc[0:2] 选出几行？",
          options:["2 行","3 行","1 行","报错"], answer:0,
          explain:"iloc 不含尾（跟列表切片一样）：只取位置 0、1 → 2 行。" },
        { q:"想拿最后一行、最后一列的那个值，最省事的写法？",
          options:["df.iloc[-1, -1]","df.loc[-1, -1]","df[-1]","df.tail(1)[-1]"], answer:0,
          explain:"iloc 支持负数位置（-1 是最后）。loc 的 -1 是「名字叫 -1 的行」，通常不存在 → KeyError。" }
      ]},

    { type:"quiz", q:"输出是什么？", code:`df = pd.DataFrame({"a": [10, 20, 30]})
print(len(df.loc[0:1]))`,
      options:["2","1","3","报错"], answer:0,
      explain:"loc 含尾：0 和 1 → 2 行。如果写 df.iloc[0:1] 就只有 1 行。" },

    { type:"blank", q:"补全：取第 1 行第 2 列（按位置）", code:`print(df.____[0, 1])`,
      options:["iloc","loc","at","ix"], answer:0,
      explain:"按整数位置 → iloc。df.ix 是老版本写法，早就删了，看到别人用说明是很老的代码。" },

    { type:"write", q:"用 loc 和 iloc 各取一次「前两行、城市和销量两列」，打印出来对比行数。",
      hint:"① print(df.loc[0:1, [\"城市\", \"销量\"]])；② print(df.iloc[0:2, 0:2])；③ 想验证差异：len(df.loc[0:2]) 和 len(df.iloc[0:2])。",
      answer:`print(df.loc[0:1, ["城市", "销量"]])
print(df.iloc[0:2, 0:2])

print(len(df.loc[0:2]))
print(len(df.iloc[0:2]))`,
      explain:"前两句结果一样（都是两行两列），但边界规则不同：loc[0:2] 是 3 行，iloc[0:2] 是 2 行。写代码时选哪个，取决于你手上是名字还是位置。" },

    { type:"concept", title:"本关速查", tag:"讲一点",
      body:"df.loc[行标签, 列名] 含尾 · df.iloc[行号, 列号] 不含尾 · df.iloc[-1] 最后一行 · df.loc[条件, 列] 条件选",
      tip:"明天：条件选行是 pandas 最常用的动作，它的写法有个必须记住的规矩 —— 括号加 &。" }
  ]},

{ id:19, week:3, theme:"pandas 登场：把表格变成变量", title:"布尔筛选：把要的行挑出来",
  subtitle:"条件是 True/False 的一整列；多条件要括号 + & | ~；还有 isin / contains / query。",
  cards:[
    { type:"concept", title:"条件本身，就是一整列 True/False", tag:"讲一点",
      body:"df[\"销量\"] > 90 不是一句话，它是一列：每一行算一遍，得到 True 或 False。把这个布尔列塞回 df[...]，就只留下 True 的行。",
      code:`mask = df["销量"] > 90
print(mask)
print(df[mask])`,
      out:`0     True
1     True
2    False
Name: 销量, dtype: bool
   城市  销量
0  北京  120
1  上海   95`,
      tip:"理解了「掩码（mask）」这件事，后面的条件筛选、isin、query 全是它的变形。" },

    { type:"tool", name:"df[条件] —— 筛行",
      oneLine:"最简单的筛选：把布尔列塞进方括号。多条件必须加括号 + & | ~。",
      syntax:`df[df["销量"] > 90]
df[(df["销量"] > 80) & (df["城市"] == "北京")]     # 且
df[(df["销量"] > 100) | (df["城市"] == "广州")]    # 或
df[~(df["城市"] == "北京")]                        # 非`,
      returns:"一个新表，只含符合条件的行。行号（index）保留原样。",
      when:"只要一部分数据：及格的人、某个城市、某个时间段。",
      example:`print(df[df["销量"] > 90])`,
      out:`   城市  销量
0  北京  120
1  上海   95`,
      pitfalls:[
        "多条件必须每个条件加括号，并用 & | ~。用 and / or 会报 ValueError: The truth value of a Series is ambiguous",
        "筛完 index 是断的（0 1 3），想变连续用 .reset_index(drop=True)"
      ],
      tip:"死记：括号 + 一个 &。四个字的错误，能让你调十分钟。" },

    { type:"tool", name:".isin() / .between() / .str.contains() —— 三种常见条件",
      oneLine:"在几个值里 / 在某个区间 / 包含某段文字。",
      syntax:`df[df["城市"].isin(["北京", "上海"])]
df[df["销量"].between(80, 100)]
df[df["城市"].str.contains("京")]
df[df["城市"].str.contains("京", case=False)]    # 不分大小写`,
      returns:"都是布尔 Series，塞回 df[...] 才筛出行。",
      when:"枚举几个值、卡一个区间、模糊匹配文字。",
      example:`print(df[df["城市"].isin(["上海", "广州"])])`,
      out:`   城市  销量
1  上海   95
2  广州   88`,
      pitfalls:[
        ".isin 只认完全相等，\"北京 \" 带空格匹配不到 \"北京\"",
        ".str.contains 默认区分大小写，也不忽略空格；它后面可以接正则，括号等字符要转义"
      ],
      tip:"记法：isin 是「名单里有」，between 是「区间里」，contains 是「文字里有」。" },

    { type:"tool", name:'df.query("表达式") —— 像写 SQL 一样筛',
      oneLine:"条件多的时候比一堆方括号好读；这里能用 and / or。",
      syntax:`df.query("销量 > 90")
df.query("销量 > 80 and 城市 == '北京'")
df.query("城市 in ['北京', '上海']")`,
      returns:"筛完的新表。",
      when:"三四个条件、想一眼看懂在筛什么。",
      example:`print(df.query("销量 > 90 and 城市 != '广州'"))`,
      out:`   城市  销量
0  北京  120
1  上海   95`,
      pitfalls:[
        "列名有空格或特殊字符时用反引号包起来：df.query(\"`销售 额` > 100\")",
        "字符串常量要带引号：城市 == 北京 会报错（它以为北京是个变量名）"
      ],
      tip:"简单条件用 df[...]，条件多或要复用字符串时用 query。" },

    { type:"drill", title:"多条件与三种条件", tag:"连问",
      steps:[
        { q:"筛「销量 > 90 且城市是北京」，哪个写法对？",
          options:['df[(df["销量"] > 90) & (df["城市"] == "北京")]','df[df["销量"] > 90 and df["城市"] == "北京"]','df[df["销量"] > 90 & df["城市"] == "北京"]','df[df["销量" > 90]]'], answer:0,
          explain:"每个条件单独括号，再用 & 连。用 and 会报 Series 真值不明；不加括号时 & 优先级高于比较，结果全错。" },
        { q:"筛完行号变成 0、2、5，想变回 0、1、2？",
          options:[".reset_index(drop=True)",".index(True)",".sort_index()",".reindex()"], answer:0,
          explain:"reset_index(drop=True) 丢掉旧行号重建。不加 drop=True 会把旧行号变成一列 index。" },
        { q:"想筛「城市里包含『京』字的行」，用哪个？",
          options:['df[df["城市"].str.contains("京")]','df[df["城市"] == "京"]','df[df["城市"].isin("京")]','df["城市"].find("京")'], answer:0,
          explain:"== 是整串相等，isin 吃列表且要求完全相等，find 是字符串方法不适用于整列。" }
      ]},

    { type:"quiz", q:"输出是什么？", code:`df = pd.DataFrame({"a": [1, 2, 3, 4]})
print(len(df[(df["a"] > 1) & (df["a"] < 4)]))`,
      options:["2","3","1","4"], answer:0,
      explain:"大于 1 且小于 4 → 2 和 3，两行。边界值 1 和 4 都不算。" },

    { type:"fill", q:"这行打印什么？", code:`df = pd.DataFrame({"c": ["北京", "上海", "广州"]})
print(len(df[df["c"].isin(["北京", "广州"])]))`,
      ph:"输入一个数字", accept:["2"],
      explain:"名单里有两个值命中 → 2 行。" },

    { type:"write", q:"筛选「销量 > 80 且城市不是北京」的行，打印筛选结果、行数、销量平均值。",
      hint:"① m = (df[\"销量\"] > 80) & (df[\"城市\"] != \"北京\")；② print(df[m])；③ print(len(df[m]))；④ print(df[m][\"销量\"].mean())。也可以写成 df[~(df[\"城市\"] == \"北京\")]。",
      answer:`m = (df["销量"] > 80) & (df["城市"] != "北京")
print(df[m])
print("行数", len(df[m]))
print("平均销量", df[m]["销量"].mean())`,
      explain:"「先筛 → 再看」是最常见的一段分析。注意别写 df[m][\"销量\"].mean() 的时候忘了先筛 —— 那样算的是全部行的平均。" },

    { type:"concept", title:"本关速查", tag:"讲一点",
      body:"df[条件] 筛行 · 多条件 (a) & (b) · 或 | 非 ~ · 名单 isin · 区间 between · 文字 contains · 条件多就用 query",
      tip:"明天：筛出来之后，怎么按大小排、怎么只要前十名？" }
  ]},

{ id:20, week:3, theme:"pandas 登场：把表格变成变量", title:"排序与前十名",
  subtitle:"sort_values 两个参数、nlargest/nsmallest 一步到位、rank 给名次。",
  cards:[
    { type:"concept", title:"排序是为了看见头和尾", tag:"讲一点",
      body:"分析的第一步经常是「谁的数最大」「哪个月最低」。排序 + 取前几行，就能回答。",
      code:`print(df.sort_values("销量", ascending=False).head(3))`,
      tip:"sort_values 一定返回新表，不会改原 df（想改就 df = df.sort_values(...)）。" },

    { type:"tool", name:"df.sort_values(by, ascending, na_position)",
      oneLine:"按某一列（或几列）排序。",
      syntax:`df.sort_values("销量")                        # 默认升序
df.sort_values("销量", ascending=False)        # 降序
df.sort_values(["城市", "销量"])                # 先按城市，同城市内按销量
df.sort_values("销量", na_position="first")    # 空值放最前面`,
      returns:"排好序的新表。",
      when:"看最大/最小的几条、按时间顺序摊开、分组后排序。",
      example:`print(df.sort_values("销量", ascending=False))`,
      out:`   城市  销量
0  北京  120
1  上海   95
2  广州   88`,
      pitfalls:[
        "by 写错列名 → KeyError。先 print(df.columns) 确认",
        "空值默认排在最后，看着像「最小的」；要明确位置就写 na_position"
      ],
      tip:"想「不改变原表，只给我看排序后的」→ sort_values；想「永久改序」→ df = df.sort_values(...)。" },

    { type:"tool", name:"df.nlargest(n, 列) / df.nsmallest(n, 列)",
      oneLine:"「最大的前 n 个」一步到位，比「排序再 head」更省事也更快。",
      syntax:`df.nlargest(3, "销量")
df.nsmallest(2, "销量")`,
      returns:"新的小表，按该列从大到小（或小到大）排好。",
      when:"只要前十名、只看最低的 5 个异常值。",
      example:`print(df.nlargest(2, "销量"))`,
      out:`   城市  销量
0  北京  120
1  上海   95`,
      pitfalls:[
        "n 比行数大不会报错，就是全部返回",
        "有并列时 nlargest 会按原始顺序取够 n 个，不保证「并列的都进来」"
      ],
      tip:"要名次也要其它列 → nlargest；只要名次数字 → rank。" },

    { type:"tool", name:"df[\"列\"].rank(method=...) —— 给名次",
      oneLine:"算出每行在这一列里排第几，返回一列数字。",
      syntax:`df["销量"].rank(ascending=False)          # 1 = 最大
df["销量"].rank(method="dense", ascending=False)   # 并列时名次不跳号
df["销量"].rank(method="min", ascending=False)     # 并列同名次，下一名跳号`,
      returns:"一列数字（Series），和 df 行对齐，可以贴回 df 当新列。",
      when:"要「排名」这一列，而不是要排序后的表。",
      example:`df["名次"] = df["销量"].rank(ascending=False, method="min")
print(df)`,
      out:`   城市  销量   名次
0  北京  120  1.0
1  上海   95  2.0
2  广州   88  3.0`,
      pitfalls:[
        "rank 默认升序（小的第 1），要有「第一名是最大值」必须写 ascending=False",
        "并列时默认 method=\"average\"，会出现 1.5 这样的名次；要整数就用 min 或 dense"
      ],
      tip:"排序是「把行搬位置」，rank 是「在原位置写个数字」。两件事。" },

    { type:"drill", title:"排序 / 前十 / 名次", tag:"连问",
      steps:[
        { q:"想让销量从高到低排，写法是？",
          options:['df.sort_values("销量", ascending=False)','df.sort_values("销量")','df.sort("销量")','df.order_by("销量")'], answer:0,
          explain:"sort_values 默认升序；降序要显式写 ascending=False。df.sort 不是 DataFrame 的方法。" },
        { q:"只要销量最高的 3 行，最直接的写法？",
          options:['df.nlargest(3, "销量")','df.head(3)','df.sort_values("销量").head(3)','df["销量"].max()'], answer:0,
          explain:"nlargest 一步到位。head(3) 是原顺序前三行；sort_values 默认升序那取到的是最小的三个；max 只给一个数。" },
        { q:"想把名次作为新的一列加进表里，用？",
          options:['df["名次"] = df["销量"].rank(ascending=False)','df.sort_values("销量")','df.nlargest(3, "销量")','df["销量"].max()'], answer:0,
          explain:"rank 返回和行对齐的一列数字，直接赋给新列名就贴进去了。" }
      ]},

    { type:"quiz", q:"输出是什么？", code:`df = pd.DataFrame({"a": [3, 1, 2]})
print(df.sort_values("a")["a"].tolist())`,
      options:["[1, 2, 3]","[3, 2, 1]","[3, 1, 2]","报错"], answer:0,
      explain:"默认升序 → [1, 2, 3]。sort_values 返回新表，再取 a 列转列表。" },

    { type:"fill", q:"这行打印什么？", code:`df = pd.DataFrame({"a": [10, 30, 20]})
print(df.nlargest(1, "a")["a"].iloc[0])`,
      ph:"输入一个数字", accept:["30"],
      explain:"最大的 1 个 → 30。" },

    { type:"write", q:"找出销量前三名：打印它们的城市和销量，并给每行标上名次（新列「名次」）。",
      hint:"① df[\"名次\"] = df[\"销量\"].rank(ascending=False, method=\"min\")；② top3 = df.nlargest(3, \"销量\")；③ print(top3[[\"城市\", \"销量\", \"名次\"]])。",
      answer:`df["名次"] = df["销量"].rank(ascending=False, method="min")
top3 = df.nlargest(3, "销量")
print(top3[["城市", "销量", "名次"]])`,
      explain:"nlargest 给排序好的行，rank 给每行的名次。两个一起用，就是一张排行榜。真实报表里这一招出现频率极高。" },

    { type:"concept", title:"本关速查", tag:"讲一点",
      body:"sort_values(by, ascending=False) 排序 · nlargest(n, 列) 前 n 名 · rank(ascending=False) 名次列 · na_position 管空值位置",
      tip:"明天：把前四关的武器合起来，做第一次真正的「数据体检」。" }
  ]},

{ id:21, week:3, theme:"pandas 登场：把表格变成变量", title:"复习 + 第一次数据体检",
  subtitle:"读 → 看结构 → 看分布 → 筛 → 排，一套走完，输出一份体检结论。",
  cards:[
    { type:"concept", title:"数据体检：五个动作，两分钟", tag:"讲一点",
      body:"① read_csv 读进来 ② head + shape 看大小 ③ info 看类型和空值 ④ describe / value_counts 看分布 ⑤ 排序看极值是否合理。\n跑完这五步，你就能回答「这份数据能不能用」。",
      code:`df = pd.read_csv("sales.csv")
print(df.shape)
df.info()
print(df["销量"].describe())
print(df["城市"].value_counts())
print(df.nlargest(3, "销量"))`,
      tip:"体检的目的是发现问题，不是得出答案。发现「有 3 个空值」「有两个北京」，这趟就值了。" },

    { type:"drill", title:"回忆一遍本周的五个工具", tag:"连问",
      steps:[
        { q:"想知道每列有没有空值、是什么类型？",
          options:["df.info()","df.head()","df.shape","df.describe()"], answer:0,
          explain:"info 的 Non-Null Count 和 Dtype 就是干这个的。describe 只看数值分布，不显示类型。" },
        { q:"想按列名取「城市」这一列的 0 到 2 行（含 2）？",
          options:['df.loc[0:2, "城市"]','df.iloc[0:2, "城市"]','df[0:2, "城市"]','df.loc[0:2]["城市"][0:2]'], answer:0,
          explain:"loc 认名字且含尾。iloc 的第二个参数必须是整数位置；df[0:2, ...] 这种写法 pandas 不支持。" },
        { q:"筛「销量 > 90」的行、只留城市列，哪个写法对？",
          options:['df.loc[df["销量"] > 90, "城市"]','df.loc["城市", df["销量"] > 90]','df.loc[df["销量"] > 90, columns="城市"]','df.loc[df["销量"] > 90][0]'], answer:0,
          explain:"loc 的第一个参数永远是「行」、第二个是「列」。行列写反会报错；最后一个 [0] 取的是第一行（一个 Series），不是城市那一列。" }
      ]},

    { type:"quiz", q:"输出是什么？", code:`df = pd.DataFrame({"城市": ["北京", "上海", "北京"], "销量": [120, 95, 88]})
print(df[df["城市"] == "北京"]["销量"].sum())`,
      options:["208","120","95","3"], answer:0,
      explain:"北京有两行：120 + 88 = 208。筛行 → 取列 → 求和，三步。" },

    { type:"fill", q:"这行打印什么？", code:`df = pd.DataFrame({"a": [5, 9, 2]})
print(df.sort_values("a", ascending=False)["a"].iloc[1])`,
      ph:"输入一个数字", accept:["5"],
      explain:"降序 → [9, 5, 2]，iloc[1] 是第二个 → 5。" },

    { type:"blank", q:"补全：只读 csv 里的城市和销量两列", code:`df = pd.read_csv("sales.csv", ____)`,
      options:['usecols=["城市", "销量"]','columns=["城市", "销量"]','only=["城市", "销量"]','select=["城市", "销量"]'], answer:0,
      explain:"参数名是 usecols。大文件只读需要的列，速度会快很多。" },

    { type:"concept", title:"拆解：体检脚本长什么样", tag:"讲一点",
      body:"把五个动作按顺序写下来就是脚本。注意每一步之后加一句 print 的说明文字，输出才读得懂。",
      code:`import pandas as pd

df = pd.read_csv("sales.csv")

print("== 大小 ==")
print(df.shape)

print("== 结构 ==")
df.info()

print("== 销量分布 ==")
print(df["销量"].describe())

print("== 城市取值 ==")
print(df["城市"].value_counts())

print("== 前三名 ==")
print(df.nlargest(3, "销量")[["城市", "销量"]])`,
      tip:"这种「分段 print」的习惯很土但很有效：出问题时你能立刻知道哪一段炸了。" },

    { type:"write", q:"写一份完整数据体检：读 sales.csv，输出大小、结构、销量分布、城市分布、销量前三名。",
      hint:"照着上面那张卡的骨架抄，把列名换成你文件里真实的列名。读不到文件时，先用 pd.DataFrame({...}) 造 5 行数据练手。",
      answer:`import pandas as pd

df = pd.read_csv("sales.csv")

print("== 大小 ==")
print(df.shape)

print("== 结构 ==")
df.info()

print("== 销量分布 ==")
print(df["销量"].describe())

print("== 城市取值 ==")
print(df["城市"].value_counts())

print("== 前三名 ==")
print(df.nlargest(3, "销量")[["城市", "销量"]])`,
      explain:"以后每拿到一份新数据，先把这份脚本跑一遍。它不产出结论，但它帮你决定「下一步该洗哪里」。" },

    { type:"concept", title:"第 3 周结束", tag:"讲一点",
      body:"你现在会：读文件、看结构、选行列、条件筛、排序取前几。这五件事覆盖了日常 80% 的表格操作。",
      tip:"第 4 周开始处理「脏数据」：空值、类型乱、要新增列、要分组统计 —— 那才是真实工作的主战场。" }
  ]}
);
