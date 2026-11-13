/* 第 2 周：容器 —— 一次拿一堆数据
   本版按「讲 → 工具卡 → 连问 → 写作 → 收尾」重排：
   每个内置函数/方法单独一张工具卡（语法 / 返回什么 / 什么时候用 / 例子 / 坑），
   再用「连问」把同一个工具问三遍（认语法 → 预测结果 → 换情景）。 */
(window.PY_DAYS = window.PY_DAYS || []).push(

{ id:8, week:2, theme:"容器：一次拿一堆数据", title:"list：一排抽屉",
  subtitle:"为什么需要列表、编号怎么数、末尾怎么加、怎么排序。",
  cards:[
    { type:"concept", title:"为什么要有列表", tag:"讲一点",
      body:"一个班 5 个人的分数，如果写成 s1、s2、s3、s4、s5 五个变量，求平均要一个个加，多一个人就多改一行。\n列表把「同类的一串值」装进一个变量：一个名字管一整排。",
      code:`scores = [88, 92, 76, 95, 61]
print(scores)
print(len(scores))`,
      out:`[88, 92, 76, 95, 61]
5`,
      tip:"方括号 + 逗号。列表里可以放数字、字符串，甚至别的列表，但实际写代码时尽量装同一种东西。" },

    { type:"tool", name:"len(列表) —— 数几个",
      oneLine:"数一数里面有几个元素。列表、字符串、字典都能数。",
      syntax:`len(一串东西)`,
      returns:"一个整数：元素的个数。它只「读」，不会改动原数据。",
      when:"算平均分（总分 ÷ 人数）、判断列表是不是空的、循环次数要看有几个。",
      example:`scores = [88, 92, 76]
print(len(scores))
print(len("python"))
print(len([]))`,
      out:`3
6
0`,
      pitfalls:[
        "len(scores) 不会改变 scores，它只是看一眼；别写成 scores = len(scores)，那就把列表变成数字了",
        "字符串的 len 数是「几个字符」，中文一个字也算 1 个：len(\"你好\") 是 2"
      ],
      tip:"平均分公式从今天起就一个：sum(scores) / len(scores)" },

    { type:"tool", name:"scores[编号] —— 取第几个",
      oneLine:"方括号里写编号，编号从 0 开始数；写 -1 是最后一个。",
      syntax:`列表[编号]
列表[-1]        # 最后一个
列表[0:2]       # 取一段（含头不含尾）`,
      returns:"那个位置上的元素（单个值）。切片返回的是一个新的列表。",
      when:"要单独处理某一个人的分数、拿第一名、取最后一行的数据。",
      example:`scores = [88, 92, 76]
print(scores[0], scores[1], scores[-1])
print(scores[0:2])`,
      out:`88 92 76
[88, 92]`,
      pitfalls:[
        "3 个元素的最大编号是 2。写 scores[3] 会 IndexError: list index out of range",
        "切片 scores[0:2] 拿到的是 2 个元素（编号 0 和 1），不含编号 2 —— 「含头不含尾」"
      ],
      tip:"记法：编号 = 位置 − 1；负数从尾巴数。这个「含头不含尾」的规矩，range 和后面 pandas 的切片全都一样。" },

    { type:"drill", title:"编号从 0 开始，含头不含尾", tag:"连问",
      setup:`x = [10, 20, 30, 40]`,
      steps:[
        { q:"x[2] 是几？",
          options:["20","30","40","报错"], answer:1,
          explain:"编号 0→10、1→20、2→30。所以 x[2] 是 30。" },
        { q:"想取最后一个 40，哪个写法能行？",
          options:["x[4]","x[-1]","x[len(x)]","x[3.0]"], answer:1,
          explain:"4 个元素最大编号是 3：x[4] 越界，x[len(x)] = x[4] 也越界，编号必须是整数。x[-1] 从尾巴数第一个，就是 40。" },
        { q:"print(x[0:2]) 打印什么？",
          options:["[10, 20]","[10, 20, 30]","[20, 30]","10 20"], answer:0,
          explain:"切片含头不含尾：编号 0 和 1，两个元素 → [10, 20]。要连 30 一起就写 x[0:3]。" }
      ]},

    { type:"tool", name:"列表.append(值) —— 末尾加一个",
      oneLine:"把一个新元素加到列表末尾，就地修改原列表。",
      syntax:`列表.append(值)`,
      returns:"None。它没有返回值 —— 变化发生在原列表自己身上。",
      when:"一条一条往结果里塞数据：读完一行 Excel 就 append 一个字典。",
      example:`scores = [88, 92]
scores.append(76)
print(scores)`,
      out:`[88, 92, 76]`,
      pitfalls:[
        "scores = scores.append(76) → scores 变成 None，整个列表废了。append 不返回新列表",
        "想一次加一串用 extend([76, 80])；用 append([76, 80]) 会把整个列表当成一个元素塞进去"
      ],
      tip:"能改变原数据的操作，通常不需要你重新赋值：直接 scores.append(x) 一行就行。" },

    { type:"quiz", q:"输出是什么？", code:`s = [1, 2]
s.append(3)
print(s)`,
      options:["[1, 2, 3]","None","[1, 2]","[3]"], answer:0,
      explain:"append 就地改 s，print 打印的是 s 本身 → [1, 2, 3]。如果写 print(s.append(3)) 才会打印 None。" },

    { type:"tool", name:"值 in 列表 —— 在不在里面",
      oneLine:"判断某个值有没有在这个列表里，返回 True 或 False。",
      syntax:`值 in 列表
值 not in 列表`,
      returns:"布尔值 True / False。",
      when:"if 92 in scores: 这种「先看一眼再决定」的时刻。",
      example:`scores = [88, 92, 76]
print(92 in scores)
print(100 in scores)
print("py" in "python")`,
      out:`True
False
True`,
      pitfalls:[
        "in 只能回答「有没有」，要问「在第几个」得用 scores.index(92)（找不到会报 ValueError）",
        "对字符串用 in 是「子串」判断：\"py\" in \"python\" 是 True；对列表才是「有没有这一整项」"
      ],
      tip:"读法：if 92 in scores: → 「如果 92 在分数里」。" },

    { type:"concept", title:"sort 和 sorted 到底差在哪", tag:"划重点",
      body:"排序有两种写法，一种「就地排」，一种「排一份新的给你」。搞混了就会拿到 None —— 这是新手最高频的坑之一。排序默认从小到大，想倒过来（大到小）就加 reverse=True，两种写法都收这个参数 —— 下一张工具卡专门讲。",
      code:`a = [3, 1, 2]
a.sort()                 # 就地排：a 自己变了
print(a)

b = [3, 1, 2]
c = sorted(b)            # 返回新列表：b 没动
print(b, c)

print(sorted(b, reverse=True))   # reverse=True = 从大到小`,
      out:`[1, 2, 3]
[3, 1, 2] [1, 2, 3]
[3, 2, 1]`,
      tip:"sorted 有「d」= 它「做出一份新的」；sort 是「就地动手」。看到 print(x.sort()) 就知道要打印 None 了。" },

    { type:"tool", name:"reverse=True —— 排序时的「倒过来」",
      oneLine:"sorted 和 .sort 都收这个参数：True 就是从大到小，不给就是从小到大。",
      syntax:`sorted(列表, reverse=True)
列表.sort(reverse=True)`,
      returns:"sorted 返回新列表（可以接 print）；.sort 返回 None（就地改，别接 print）。",
      when:"成绩排行、销量从高到低、日期从新到旧 —— 凡是「倒着排」的场合。",
      example:`scores = [88, 92, 76]
print(sorted(scores))                 # 默认小到大
print(sorted(scores, reverse=True))   # 大到小
scores.sort(reverse=True)             # 就地排，没有返回值
print(scores)`,
      out:`[76, 88, 92]
[92, 88, 76]
[92, 88, 76]`,
      pitfalls:[
        "print(scores.sort(reverse=True)) 打印 None —— .sort 是就地动手，不返回列表",
        "sorted(scores).reverse() 也打印 None：.reverse() 同样是就地反转、不给返回值",
        "拼错成 reverce / reserve 会报 TypeError: 'reverse' is an invalid keyword argument"
      ],
      tip:"记法：reverse = 反过来。能直接接 print 的只有 sorted(...)，因为它负责「做一份新的」。" },

    { type:"blank", q:"补全：把分数从大到小打印出来", code:`scores = [88, 92, 76]
print(____)`,
      options:["sorted(scores, reverse=True)","scores.sort(reverse=True)","sorted(scores).reverse()"], answer:0,
      explain:"① sorted 返回新列表，可以直接 print；② scores.sort() 返回 None，打印出来是 None；③ sorted(scores) 是列表，但列表的 .reverse() 也是就地反转、返回 None，最后还是打印 None。" },

    { type:"tool", name:"sum / max / min —— 吃一个列表，吐一个数",
      oneLine:"求和、最大值、最小值，Python 自带，不用写循环。",
      syntax:`sum(列表)
max(列表)
min(列表)`,
      returns:"一个数。sum 对空列表返回 0；max/min 对空列表会报 ValueError。",
      when:"算总分、找最高分、找最低温度。",
      example:`scores = [88, 92, 76]
print(sum(scores), max(scores), min(scores))
print(sum(scores) / len(scores))
print(round(sum(scores) / len(scores), 1))`,
      out:`256 92 76
85.33333333333333
85.3`,
      pitfalls:[
        "max([]) 会报 ValueError: max() arg is an empty sequence —— 数据可能是空的时候先用 if 判一下",
        "round 是四舍六入五成双（Python 的规矩），财务精确到分要做别的处理，先别用它算钱"
      ],
      tip:"这一组就是「列 → 一个数」的统计动作。第 3 周 pandas 里叫 df[\"score\"].mean()，同一个意思。" },

    { type:"write", q:"建一个列表装 3 个科目的分数，再往末尾加一门，然后打印总分、平均分（保留 1 位小数）、最高分。",
      hint:"① scores = [78, 91, 66]；② scores.append(85)；③ total = sum(scores)；④ print(round(total / len(scores), 1))；⑤ print(max(scores))。照抄改数字就行。",
      answer:`scores = [78, 91, 66]
scores.append(85)
total = sum(scores)
print("总分", total)
print("平均", round(total / len(scores), 1))
print("最高", max(scores))`,
      explain:"这题把「建列表 → append 加一项 → sum/len 算平均 → max 找最高」串了一遍。这就是一份最小的成绩单脚本。" },

    { type:"concept", title:"本关速查：6 个动作", tag:"讲一点",
      body:"len(x) 有几个 · x[i] 取第 i 个（从 0 数，-1 是最后）· x.append(v) 末尾加 · v in x 在不在 · sorted(x) 排一份新的 · sorted(x, reverse=True) 从大到小",
      tip:"明天：这排抽屉里的东西，怎么能一个个拿出来看一遍？—— 那就是「遍历」。" }
  ]},

{ id:9, week:2, theme:"容器：一次拿一堆数据", title:"遍历：把抽屉一个个打开",
  subtitle:"for 循环、累加器模式、enumerate 带编号、列表推导式。",
  cards:[
    { type:"concept", title:"不写 5 遍 print", tag:"讲一点",
      body:"列表有 100 个元素，你不能写 100 行 print。for 循环做的事就是：对着列表，把里面的东西一个个拿出来，每次做同样的事。",
      code:`scores = [88, 92, 76]
for s in scores:
    print(s)`,
      out:`88
92
76`,
      tip:"三件套：for 变量 in 列表: → 冒号不能丢 → 下一行缩进 4 个空格。缩进就是「这些事属于循环」的意思。" },

    { type:"tool", name:"for + 累加器模式 —— 数据分析里出现最多的三行",
      oneLine:"先准备一个空口袋，循环里往口袋里塞，循环结束后打开口袋看结果。",
      syntax:`total = 0
for x in 一堆数:
    total = total + x
print(total)`,
      returns:"循环本身不返回值。结果在你准备好的那个变量里。",
      when:"求和、数个数、找最大、拼字符串、往新列表里挑数据。",
      example:`total = 0
for s in [88, 92, 76]:
    total = total + s
print(total)`,
      out:`256`,
      pitfalls:[
        "total = 0 必须写在 for 外面（不缩进）。写进循环里，每一轮都清零，最后只剩最后一个数",
        "total = total + s 必须写在 for 里面（缩进）。跑出去就只加了最后一个数"
      ],
      tip:"记法：口袋在外，塞钱在内。总共 6 个空格的位置搞错，结果就全错。" },

    { type:"drill", title:"循环里 / 循环外", tag:"连问",
      steps:[
        { q:"下面打印什么？",
          code:`total = 0
for x in [1, 2, 3]:
    total = x
print(total)`,
          options:["6","3","1","0"], answer:1,
          explain:"每轮是 total = x（覆盖，不是累加）：1 → 2 → 3。最后是 3。想累加要写 total = total + x。" },
        { q:"想数出「有几个及格的（>= 60）」，该怎么改？",
          code:`total = 0
for x in [88, 52, 76]:
    total = x`,
          options:["把 total = 0 改成 total = 1","改成 for 里面写 if x >= 60: total = total + 1","把 print 放进循环里","不用改，现在就是对的"], answer:1,
          explain:"计数器的模式：口袋给 0，满足条件才加 1。条件用 if，加 1 要缩进在 if 里面（比 for 多缩进一层）。" },
        { q:"for i in [0, 1, 2]: print(i) 打印几行？",
          options:["3 行","1 行","2 行","报错"], answer:0,
          explain:"列表里有 3 个元素，就转 3 圈，每圈打印一行：0、1、2。" }
      ]},

    { type:"tool", name:"enumerate(列表) —— 同时拿到编号和值",
      oneLine:"循环时既要「第几个」又要「是什么」，不用自己维护计数器。",
      syntax:`for i, x in enumerate(列表):
    ...
for i, x in enumerate(列表, start=1):   # 编号从 1 开始`,
      returns:"每次吐出一对 (编号, 值)，可以直接拆成两个变量。",
      when:"打印「第 3 名：王五」、生成带序号的清单。",
      example:`names = ["张三", "李四", "王五"]
for i, n in enumerate(names, start=1):
    print(i, n)`,
      out:`1 张三
2 李四
3 王五`,
      pitfalls:[
        "写成 for i in enumerate(names): 时 i 是一个元组 (0, \"张三\")，不是编号 —— 要两个变量接",
        "两个变量名随便起，但顺序固定：先编号，后值"
      ],
      tip:"记法：enumerate = 「编号 + 值」打包发快递，你一次签收两件。" },

    { type:"quiz", q:"输出是什么？", code:`for i, c in enumerate(["a", "b"], start=1):
    print(i, c)`,
      options:["1 a / 2 b（两行）","0 a / 1 b（两行）","1 b / 2 a（两行）","(1, 'a') / (2, 'b')"], answer:0,
      explain:"start=1 让编号从 1 开始；i 是编号、c 是值，所以是「1 a」「2 b」两行。写成 print(c, i) 才会反过来。" },

    { type:"tool", name:"列表推导式 —— 一行写完「每个都做同一件事」",
      oneLine:"把 for 循环压成一行，直接造出一个新列表。",
      syntax:`[对 x 做什么 for x in 列表]
[对 x 做什么 for x in 列表 if 条件]`,
      returns:"一个新的列表。原列表不动。",
      when:"给整列数字 +5、把整列名字变大写、只挑出及格的那些。",
      example:`scores = [88, 92, 76]
print([s + 5 for s in scores])
print([s for s in scores if s >= 80])
print([s * 2 for s in scores if s >= 80])`,
      out:`[93, 97, 81]
[88, 92]
[176, 184]`,
      pitfalls:[
        "外面写成圆括号 () 得到的是「生成器」，不是列表，print 出来是 <generator object ...>",
        "推导式永远造新列表，不会改原列表；想就地改要写 scores = [s + 5 for s in scores] 重新赋值"
      ],
      tip:"读法：把 scores 里每个 s 变成 s + 5，收成一个新列表。if 写在最后面，先筛再做。" },

    { type:"drill", title:"推导式 + if", tag:"连问",
      steps:[
        { q:"[x * 2 for x in [1, 2, 3]] 的结果？",
          options:["[2, 4, 6]","[1, 2, 3]","[1, 2, 3, 1, 2, 3]","[2, 3, 6]"], answer:0,
          explain:"每个 x 都乘 2 收进新列表：1*2、2*2、3*2 → [2, 4, 6]。" },
        { q:"[x for x in [5, 12, 8] if x > 6] 的结果？",
          options:["[12, 8]","[5]","[5, 12, 8]","[]"], answer:0,
          explain:"if 先筛：5 不大于 6 被扔掉，剩下 12 和 8，顺序不变 → [12, 8]。" },
        { q:"把所有名字变大写、存进新列表，哪个写法对？",
          options:["[n.upper() for n in names]","names.upper()","[upper(n) for n in names]","names = [n].upper()"], answer:0,
          explain:"字符串的大写方法叫 .upper()，要作用在每个 n 上。列表本身没有 .upper()；upper(n) 这种函数式写法 Python 里没有。" }
      ]},

    { type:"concept", title:"sum / max / min 和白手写循环，什么时候用哪个", tag:"讲一点",
      body:"如果只是「求和、最大、最小、个数」，Python 有现成的，别再手写循环。手写循环留给「要按条件挑、要拼字符串、要算复杂公式」的场合。",
      code:`scores = [88, 92, 76]
print(sum(scores))                    # 256
print(max(scores), min(scores))       # 92 76
print(sum(scores) / len(scores))      # 85.33...
print(round(sum(scores) / len(scores), 1))   # 85.3`,
      tip:"「有没有内置函数」的判断标准：这是不是一件人人都会做的常见小事。是，就一定有现成的。" },

    { type:"fill", q:"这行打印什么？", code:`print(sum([1, 2, 3]) / len([1, 2, 3]))`,
      ph:"输入结果", accept:["2.0","2"],
      explain:"6 / 3 = 2.0。Python 3 的除法 / 永远得到小数，print 显示 2.0（不是 2）。" },

    { type:"write", q:"给一个分数列表，用推导式筛出及格的（>= 60），打印及格人数和及格平均分（保留 1 位小数）。",
      hint:"① scores = [88, 52, 76, 41, 90]；② passed = [s for s in scores if s >= 60]；③ print(len(passed))；④ print(round(sum(passed) / len(passed), 1))。",
      answer:`scores = [88, 52, 76, 41, 90]
passed = [s for s in scores if s >= 60]
print("及格人数", len(passed))
print("及格平均", round(sum(passed) / len(passed), 1))`,
      explain:"「先筛（推导式）→ 再算（len/sum/round）」是数据处理最常见的两步。第 4 周 pandas 里就是 df[df.score >= 60].score.mean()。" },

    { type:"concept", title:"本关速查", tag:"讲一点",
      body:"for x in 列表 挨个打开 · 累加器三行（口袋在外、塞钱在内）· enumerate 带编号 · [f(x) for x in 列表 if 条件] 造新列表 · sum/max/min 直接用",
      tip:"明天：如果每个学生有「姓名 + 分数 + 城市」三个信息，一个列表装不下怎么办？" }
  ]},

{ id:10, week:2, theme:"容器：一次拿一堆数据", title:"dict：按名字找",
  subtitle:"取值、get 安全取值、keys/values/items、f-string 引号打架。",
  cards:[
    { type:"concept", title:"列表只能按编号找，字典能按名字找", tag:"讲一点",
      body:"你要查「张三的分数」，用列表得先知道张三排第几个。字典直接拿名字当钥匙：p[\"name\"]。\n字典长这样：花括号，里面是「键: 值」，键通常用字符串。",
      code:`p = {"name": "张三", "score": 88}
print(p["name"])
print(len(p))`,
      out:`张三
2`,
      tip:"键名必须带引号（它是字符串）。写 p[name] 会报 NameError —— Python 会以为 name 是个变量。" },

    { type:"tool", name:"d[键] —— 直接取",
      oneLine:"拿键换值。键不存在就直接崩。",
      syntax:`字典[键]`,
      returns:"键对应的值。键不存在 → KeyError。",
      when:"你确定这个键一定在（比如自己刚写进去的）。",
      example:`p = {"name": "张三", "score": 88}
print(p["score"])
print(p["score"] + 2)`,
      out:`88
90`,
      pitfalls:[
        "键不存在 → KeyError: 'score'，程序当场停。这是新手最常见的崩溃之一",
        "键名大小写敏感：p[\"Name\"] 和 p[\"name\"] 是两个不同的键，取不到就是 KeyError"
      ],
      tip:"不确定有没有这个键时，用下一张卡的 get。" },

    { type:"tool", name:"d.get(键, 默认值) —— 取不到也不砸锅",
      oneLine:"有就返回那个值，没有就返回你给的默认值，绝不报错。",
      syntax:`字典.get(键)
字典.get(键, 默认值)`,
      returns:"键在 → 对应的值；键不在 → 默认值（不写默认值就是 None）。",
      when:"数据是别人给的、字段可能缺、算平均分前要处理缺项。",
      example:`p = {"name": "张三"}
print(p.get("score"))
print(p.get("score", 0))
print(p.get("name", "无名"))`,
      out:`None
0
张三`,
      pitfalls:[
        "默认值只在「键不存在」时生效。键在、但值是 0 或空字符串，get 照样返回 0 / 空字符串，不会被替换成默认值",
        "get 只读不写。想「没有就设成 0 并且写进字典」要用 p.setdefault(\"score\", 0)"
      ],
      tip:"一句话：d[键] 是「必须给我」，get 是「有就给我，没有就算了」。写处理数据的脚本，八成情况该用 get。" },

    { type:"drill", title:"直接取 vs get", tag:"连问",
      steps:[
        { q:"p = {\"a\": 1}，执行 print(p[\"b\"])，结果？",
          options:["None","0","报错 KeyError","报错 TypeError"], answer:2,
          explain:"方括号取值，键不在就 KeyError。程序直接停止，后面的代码都不执行。" },
        { q:"同样 p = {\"a\": 1}，print(p.get(\"b\", -1)) ？",
          options:["-1","None","1","报错"], answer:0,
          explain:"键 b 不存在，返回你给的默认值 -1。不写默认值时才返回 None。" },
        { q:"p = {\"a\": 0}，print(p.get(\"a\", 99)) ？",
          options:["99","0","None","报错"], answer:1,
          explain:"键 a 是存在的，值是 0，get 老老实实返回 0 —— 默认值 99 根本没机会出场。这是 get 最容易被误解的一点。" }
      ]},

    { type:"tool", name:"d.keys() / d.values() / d.items()",
      oneLine:"要所有的键、所有的值，还是要成对的 (键, 值)。",
      syntax:`字典.keys()
字典.values()
字典.items()`,
      returns:"keys 所有键 · values 所有值 · items 所有 (键, 值) 对。它们不是普通列表，是「视图」，要用列表就 list(...) 包一下。",
      when:"遍历字典、检查数据里到底有哪些字段、把字典转成列表。",
      example:`p = {"name": "张三", "score": 88}
print(list(p.keys()))
print(list(p.values()))
for k, v in p.items():
    print(k, "=", v)`,
      out:`['name', 'score']
['张三', 88]
name = 张三
score = 88`,
      pitfalls:[
        "直接 print(p.keys()) 会显示 dict_keys([...])，不是你以为的列表 —— 要列表就 list(p.keys())",
        "遍历字典时 for x in p 拿到的也是「键」，跟 p.keys() 一样；想同时要键和值必须 items()"
      ],
      tip:"记法：keys 看「有哪些字段」，values 看「值都有什么」，items 是「一条一条拆开看」。" },

    { type:"concept", title:"遍历字典 + f-string 引号打架", tag:"划重点",
      body:"一层套一层最容易崩在这里：字典取值要引号，f-string 的花括号里再放带引号的取值 → 引号打架。\n解法只有一个：先取出来存变量，再塞进 f-string。",
      code:`p = {"title": "Python 入门", "author": "老王"}

# 写法 A：双引号里套单引号，能跑但很难读，还容易数错
print(f"《{p['title']}》")

# 写法 B（推荐）：先取出来，再塞进去
t = p["title"]
print(f"《{t}》")

# 遍历时更自然
for k, v in p.items():
    print(f"{k}：{v}")`,
      out:`《Python 入门》
《Python 入门》
title：Python 入门
author：老王`,
      tip:"花括号里只放变量名最安全。非要就地取值，外层引号换一种（双套单、或单套双）。" },

    { type:"fill", q:"这行打印什么？", code:`name = "小明"
print(f"你好，{name}")`,
      ph:"照抄结果", accept:["你好，小明"],
      explain:"f 打开开关，{name} 被替换成「小明」。漏了 f 就会原样打印「你好，{name}」。" },

    { type:"blank", q:"补全：安全地取年龄（没有就当 0）", code:`p = {"name": "张三"}
age = p.____("age", 0)
print(age)`,
      options:["get","values","items","keys"], answer:0,
      explain:"只有 get 支持「键 + 默认值」两个参数。values/items/keys 是无参的查看方法。" },

    { type:"quiz", q:"输出是什么？", code:`p = {"a": 1, "b": 2}
for k, v in p.items():
    print(k)`,
      options:["a / b（两行）","1 / 2（两行）","a 1 / b 2（两行）","报错"], answer:0,
      explain:"items() 每次给一对 (k, v)，print(k) 只打印键 → a、b 两行。改成 print(v) 就是 1、2。" },

    { type:"write", q:"建一个字典存一本书：书名、作者、价格。再用 get 读「库存」字段（没有就给 0），最后打印书名和库存。",
      hint:"① book = {\"title\": \"Python 入门\", \"author\": \"老王\", \"price\": 59}；② stock = book.get(\"stock\", 0)；③ t = book[\"title\"]；④ print(f\"《{t}》库存 {stock}\")。",
      answer:`book = {"title": "Python 入门", "author": "老王", "price": 59}
stock = book.get("stock", 0)
t = book["title"]
print(f"《{t}》库存 {stock}")`,
      explain:"这题三个动作：建字典 → get 容错取值 → f-string 排版。现实数据里「字段可能缺」是常态，get 就是你的安全带。" },

    { type:"concept", title:"列表还是字典？一句话判断", tag:"讲一点",
      body:"查「某个名字对应的值」→ 字典；存「一串同类的、有顺序的」→ 列表；问「这个键在不在」→ \"score\" in 字典。",
      tip:"明天：如果一张表里有 100 个学生，每人三个字段 —— 列表里装字典，就成了「一张表」。" }
  ]},

{ id:11, week:2, theme:"容器：一次拿一堆数据", title:"列表装字典 = 一张表",
  subtitle:"一行一个字典，一列一个键 —— pandas 之前，这是表格的原型。",
  cards:[
    { type:"concept", title:"一行数据 = 一个字典，整张表 = 一个列表", tag:"讲一点",
      body:"表有三列：姓名、分数、城市。每一行是这三个值配一个名字，正好是一个字典。所有行排在一起，就是列表。\n这就是 Excel / csv 在 Python 里最朴素的形态：列名 = 每个字典的键。",
      code:`students = [
    {"name": "张三", "score": 88, "city": "北京"},
    {"name": "李四", "score": 52, "city": "上海"},
    {"name": "王五", "score": 76, "city": "北京"},
]
print(len(students))
print(students[0]["name"])`,
      out:`3
张三`,
      tip:"两层方括号的读法：students[0] 是「第一行」，再 [\"name\"] 是「这一行的 name 列」。" },

    { type:"tool", name:'取一列：[row["列名"] for row in 表]',
      oneLine:"把表格里某一列整列拿出来，变成普通列表。",
      syntax:`[row["列名"] for row in 表]`,
      returns:"一个列表：这一列的所有值。",
      when:"要对着某一列求和、平均、找最大，或者扔给画图。",
      example:`scores = [s["score"] for s in students]
print(scores)
print(sum(scores) / len(scores))`,
      out:`[88, 52, 76]
72.0`,
      pitfalls:[
        "列名必须和数据完全一致：大小写、前后空格都算，写 \"Score\" 就是 KeyError",
        "某个字典缺这一列会 KeyError。脏数据先用 row.get(\"score\", 0) 兜住"
      ],
      tip:"这一行就是 pandas 的 df[\"score\"] 的手写版。等你学 pandas，会发现这行被一个方括号替掉了。" },

    { type:"drill", title:"取列 / 筛行 / 算数", tag:"连问",
      setup:`students = [
    {"name": "小明", "score": 88},
    {"name": "小红", "score": 52},
    {"name": "小刚", "score": 76},
]`,
      steps:[
        { q:'sum([s["score"] for s in students]) 得到什么？',
          options:["所有分数加起来的总分","分数列表","人数","报错"], answer:0,
          explain:"[s[\"score\"] ...] 先得到 [88, 52, 76]，sum 再对它求和 → 216。" },
        { q:"想打印「最高分那个人的名字」，哪个思路对？",
          options:["max(students)","先求最高分 m = max([s[\"score\"] for s in students])，再 [s[\"name\"] for s in students if s[\"score\"] == m]","students[\"name\"].max()","max(students[\"score\"])"], answer:1,
          explain:"字典之间没法比大小，students[\"name\"] 也取不了列（它是个列表，只能用编号）。必须先算出最高分，再回头筛出对应的人。" },
        { q:'有个字典缺了 "score"，算平均时会怎样？',
          options:["自动跳过这个","报错 KeyError","自动当成 0","报错 TypeError"], answer:1,
          explain:'KeyError: \'score\'。处理办法：把 s["score"] 换成 s.get("score", 0)，或者先筛掉缺值的行。' }
      ]},

    { type:"tool", name:'筛行：[row for row in 表 if 条件]',
      oneLine:"只要满足条件的那些行，其它行扔掉。",
      syntax:`[row for row in 表 if 条件]`,
      returns:"一个新的列表，里面是完整的那些行（每个还是一整个字典）。",
      when:"只看及格的人、只看北京的数据、只看某个月的记录。",
      example:`passed = [s for s in students if s["score"] >= 60]
print(len(passed))
for s in passed:
    print(s["name"], s["score"])`,
      out:`2
张三 88
王五 76`,
      pitfalls:[
        "条件里要写清楚是哪一列：if s >= 60 会报 TypeError（字典不能和数字比）",
        "筛完拿到的还是「行」的列表，要某一列还得再取一次（或者直接 [s[\"name\"] for s in 筛完的]）"
      ],
      tip:"读法：从 students 里，把每个 s 挑出来，如果 s[\"score\"] >= 60 就留下。这就是 pandas 的 df[df.score >= 60]。" },

    { type:"quiz", q:"输出是什么？", code:`rows = [{"c": "北京"}, {"c": "上海"}, {"c": "北京"}]
print(len([r for r in rows if r["c"] == "北京"]))`,
      options:["2","1","3","报错"], answer:0,
      explain:"筛出 c 是北京的两行，len 数一下 → 2。字符串比较要一模一样，\"北京 \" （带空格）就匹配不上。" },

    { type:"write", q:"用列表装 3 个字典（姓名、分数），打印：平均分（1 位小数）、最高分的人名、及格人数。",
      hint:"① students = [{\"name\": \"张三\", \"score\": 88}, …]；② scores = [s[\"score\"] for s in students]；③ print(round(sum(scores)/len(scores), 1))；④ m = max(scores)，再 [s[\"name\"] for s in students if s[\"score\"] == m]；⑤ 及格人数用 len([s for s in students if s[\"score\"] >= 60])。",
      answer:`students = [
    {"name": "张三", "score": 88},
    {"name": "李四", "score": 52},
    {"name": "王五", "score": 76},
]
scores = [s["score"] for s in students]
print("平均", round(sum(scores) / len(scores), 1))
m = max(scores)
print("最高", [s["name"] for s in students if s["score"] == m])
print("及格人数", len([s for s in students if s["score"] >= 60]))`,
      explain:"取列 → 算统计 → 按条件筛行，这套动作你以后每天都要用。第 3 周开始用 pandas 写，同样的三件事各一行。" },

    { type:"concept", title:"本关速查：一张表的三件套", tag:"讲一点",
      body:"取列 [row[\"列\"] for row in 表] · 筛行 [row for row in 表 if 条件] · 算数 sum/len/max 套在外面",
      tip:"这一关的东西手写起来还是挺啰嗦的 —— 明天开始学 for/range，把「重复 N 次」也拿下，然后就该 pandas 出场了。" }
  ]},

{ id:12, week:2, theme:"容器：一次拿一堆数据", title:"for + range：重复 N 次",
  subtitle:"range 三个参数、含头不含尾、按编号访问。",
  cards:[
    { type:"concept", title:"列表里得有东西才能遍历", tag:"讲一点",
      body:"想「重复 5 次」或者「从 1 数到 100」，可你手上没有这样一个列表。range 就是现场造一串数字给你。",
      code:`for i in range(3):
    print(i)`,
      out:`0
1
2`,
      tip:"range 造的是数字序列，不是一个真的列表；要列表就 list(range(3)) → [0, 1, 2]。" },

    { type:"tool", name:"range(start, stop, step) —— 造一串数字",
      oneLine:"从 start 开始，到 stop 之前停下（不含 stop），每次加 step。",
      syntax:`range(5)          # 0 1 2 3 4
range(1, 6)       # 1 2 3 4 5
range(0, 10, 2)   # 0 2 4 6 8
range(10, 0, -1)  # 10 9 8 ... 1`,
      returns:"一个「数字序列」对象（不是列表）。能直接用在 for 里，也能 list() 转成列表。",
      when:"重复固定次数、按编号访问列表、生成 1..100 这样的数。",
      example:`print(list(range(5)))
print(list(range(1, 6)))
print(list(range(0, 10, 2)))
print(list(range(10, 0, -1)))`,
      out:`[0, 1, 2, 3, 4]
[1, 2, 3, 4, 5]
[0, 2, 4, 6, 8]
[10, 9, 8, 7, 6, 5, 4, 3, 2, 1]`,
      pitfalls:[
        "不含尾：range(1, 6) 只到 5。想 1 到 10 必须写 range(1, 11)",
        "range(5) 从 0 开始，不是 1。想从 1 开始写 range(1, 6)",
        "步长不能是 0，range(0, 5, 0) 会报 ValueError"
      ],
      tip:"记法：range 和切片一个规矩 —— 含头不含尾。这个规矩你会在 pandas 的 iloc 里再遇到一次。" },

    { type:"drill", title:"range 的边界", tag:"连问",
      steps:[
        { q:"for i in range(3): print(i) 打印几个数？",
          options:["3 个（0 1 2）","4 个（0 1 2 3）","3 个（1 2 3）","报错"], answer:0,
          explain:"range(3) = 0,1,2，不含 3。所以是 3 个数。" },
        { q:"list(range(2, 5)) 的结果？",
          options:["[2, 3, 4]","[2, 3, 4, 5]","[3, 4, 5]","[2, 5]"], answer:0,
          explain:"从 2 开始，到 5 之前停下 → 2、3、4。" },
        { q:"range(10, 0, -1) 的第一个数是？",
          options:["10","9","0","报错"], answer:0,
          explain:"start 是 10，包含在序列里；step 是 -1 就往回走。所以第一个是 10，最后一个是 1。" }
      ]},

    { type:"fill", q:"这行打印什么？", code:`print(len(range(1, 11)))`,
      ph:"输入一个数字", accept:["10"],
      explain:"1..10 一共 10 个数（含 1 不含 11），所以 len 是 10。" },

    { type:"concept", title:"range(len(列表)) 是「按编号访问」的老写法", tag:"讲一点",
      body:"想知道「第几个 + 是什么」，除了 enumerate，还有一种老写法：用 range 生成编号，再用编号去取值。看得懂就行，自己写优先用 enumerate。",
      code:`scores = [88, 92, 76]
for i in range(len(scores)):
    print(i, scores[i])

# 更推荐：
for i, s in enumerate(scores):
    print(i, s)`,
      out:`0 88
1 92
2 76
0 88
1 92
2 76`,
      tip:"看到 range(len(x)) 就知道「这是在拿编号」。读别人的代码经常遇到，所以必须认得。" },

    { type:"blank", q:"补全：1 到 10 求和", code:`total = 0
for i in range(____):
    total = total + i
print(total)`,
      options:["1, 11","11","1, 10","0, 10"], answer:0,
      explain:"要 1..10 → start=1，stop 写 11（不含尾）。写 range(1, 10) 只加到 9，结果是 45 而不是 55。" },

    { type:"quiz", q:"输出是什么？", code:`for i in range(3):
    print(i * 2)`,
      options:["0 2 4（三行）","2 4 6（三行）","0 1 2（三行）","报错"], answer:0,
      explain:"i 依次是 0、1、2，乘 2 → 0、2、4。" },

    { type:"write", q:"用 for + range 打印 1 到 10 中「偶数」的平方（每行一个）。",
      hint:"① for i in range(1, 11): ；② 里面写 if i % 2 == 0: ；③ 缩进再写 print(i * i)。% 是取余数，判断奇偶用它。",
      answer:`for i in range(1, 11):
    if i % 2 == 0:
        print(i * i)`,
      explain:"输出 4、16、36、64、100。注意三层缩进：for 里套 if，if 里的 print 要比 if 再缩进 4 格。" },

    { type:"concept", title:"本关速查", tag:"讲一点",
      body:"range(stop) 从 0 · range(start, stop) 含头不含尾 · range(start, stop, step) 大步或倒着走 · 步长不能为 0",
      tip:"明天：如果不知道要转几圈（比如「一直加，直到超过 100」），for 就不够用了。" }
  ]},

{ id:13, week:2, theme:"容器：一次拿一堆数据", title:"while 与 break：不知道转几圈",
  subtitle:"条件成立就一直转、别写成死循环、break 和 continue 的区别。",
  cards:[
    { type:"concept", title:"for 是「有几个就转几圈」，while 是「条件成立就一直转」", tag:"讲一点",
      body:"for 要事先知道容器。while 只问一句话：条件还成立吗？成立就再转一圈。适合「加到超过 100 为止」这种不知道圈数的场景。",
      code:`i = 0
while i < 3:
    print(i)
    i = i + 1`,
      out:`0
1
2`,
      tip:"while 里必须有一句让条件「走向不成立」的代码（这里是 i = i + 1）。没有它，就是死循环。" },

    { type:"tool", name:"while 条件: —— 条件成立就一直转",
      oneLine:"循环体里必须改变条件里的变量，否则永远转下去。",
      syntax:`while 条件:
    做点事
    改一下条件里的变量     # 这一句是保命的`,
      returns:"没有返回值；结果都在你循环里改的变量上。",
      when:"不知道要转几圈、要一直读到某个值出现为止、菜单等待输入。",
      example:`i = 1
total = 0
while i <= 5:
    total = total + i
    i = i + 1
print(total)`,
      out:`15`,
      pitfalls:[
        "忘了 i = i + 1 → 死循环，程序卡住。跑飞了按 Ctrl + C 停",
        "条件一开始就不成立 → 循环体一次都不执行（比如 while i < 0）"
      ],
      tip:"调试死循环的三步：看条件变量、看循环里有没有改它、把 i 的值 print 出来看它在不在变。" },

    { type:"drill", title:"while 什么时候停", tag:"连问",
      steps:[
        { q:"i = 0 之后执行 while i < 3: i = i + 1，循环体执行几次？",
          options:["3 次","4 次","无数 次","1 次"], answer:0,
          explain:"i 依次变 1、2、3。i=0、1、2 时条件都成立 → 转 3 次；到 3 时条件不成立，停。" },
        { q:"如果循环体里只写 print(i)，没有 i = i + 1，会怎样？",
          options:["打印一次就停","一直打印 0，停不下来","报错","什么都不打印"], answer:1,
          explain:"i 永远是 0，条件永远成立 → 死循环，屏幕上 0 刷个不停。" },
        { q:"while True: 配什么能正常退出？",
          options:["配 break","配 continue","配 pass","什么都配不了"], answer:0,
          explain:"while True 是「永远成立」，只有 break 能真正跳出循环。continue 只是跳过本轮，循环还在。" }
      ]},

    { type:"tool", name:"break / continue —— 提前跳出、跳过本轮",
      oneLine:"break 整个循环结束；continue 只是这一圈剩下的不做了，直接下一圈。",
      syntax:`break       # 立刻跳出整个循环
continue    # 跳过本轮剩下的代码，进入下一轮`,
      returns:"都不返回值，只控制流程。",
      when:"找到想要的就可以停了（break）、跳过不合格的数据（continue）。",
      example:`for i in range(5):
    if i == 3:
        break
    print(i)
print("---")
for i in range(5):
    if i == 2:
        continue
    print(i)`,
      out:`0
1
2
---
0
1
3
4`,
      pitfalls:[
        "break 只跳出「最近的一层」循环，嵌套两层要跳出去得配合标志变量或直接 return",
        "continue 后面写的代码在本轮永远不会执行 —— 别把关键逻辑放在 continue 下面"
      ],
      tip:"记法：break 是「不玩了」，continue 是「这局不算，下一局」。" },

    { type:"quiz", q:"输出是什么？", code:`for i in range(5):
    if i == 2:
        continue
    print(i)`,
      options:["0 1 3 4（四行）","0 1 2 3 4（五行）","0 1（两行）","2（一行）"], answer:0,
      explain:"i 等于 2 时 continue，本轮不再 print，直接进下一轮 → 打印 0、1、3、4。" },

    { type:"fill", q:"这行打印什么？", code:`i = 0
while i < 3:
    i = i + 1
print(i)`,
      ph:"输入一个数字", accept:["3"],
      explain:"i 从 0 加到 3，条件不成立退出；此时 i 就是 3。注意循环结束后 i 还活着，值是最新那个。" },

    { type:"write", q:"用 while 从 1 开始累加（1+2+3+…），直到总和超过 100 为止。打印最后的那个加数 n 和总和。",
      hint:"① n = 0；total = 0；② while total <= 100: 里写 n = n + 1；total = total + n；③ 循环完了 print(n, total)。先写再跑，看是不是 14 和 105。",
      answer:`n = 0
total = 0
while total <= 100:
    n = n + 1
    total = total + n
print(n, total)`,
      explain:"n 是 0 时加 1 → 1，加 2 → 3 …一直加到超过 100。答案是 n=14、total=105（1 加到 13 是 91，加 14 就 105）。" },

    { type:"concept", title:"for 还是 while，一句话判断", tag:"讲一点",
      body:"知道要转几圈 / 有一堆东西要挨个处理 → for；只知道「条件还成立就继续」→ while。写不出来的时候，先问自己这个问题。",
      tip:"第 2 周的容器到这里就齐了：列表装一串、字典按名字查、两者组合成表、for/while 处理它们。下一关把它们全串起来。" }
  ]},

{ id:14, week:2, theme:"容器：一次拿一堆数据", title:"复习 + 成绩报告",
  subtitle:"把列表、字典、循环、条件拼成一个真能跑的脚本。",
  cards:[
    { type:"concept", title:"这一关只做一件事：把一周的东西串起来", tag:"讲一点",
      body:"前面每一关都是一个零件。真正的脚本是「取数 → 算 → 判断 → 打印」四步连起来。\n题目：给一张学生表（列表装字典，字段：姓名、分数），输出一份成绩报告。",
      code:`students = [
    {"name": "张三", "score": 88},
    {"name": "李四", "score": 52},
    {"name": "王五", "score": 76},
]`,
      tip:"别急着写。先把四步用中文写在纸上：① 取出一列分数 ② 算平均/最高 ③ 筛出及格的 ④ 排版打印。" },

    { type:"drill", title:"回忆一遍：四个零件", tag:"连问",
      steps:[
        { q:"把一个列表里每项都加 5，最简洁的写法是？",
          options:["[x + 5 for x in nums]","for x in nums: x + 5","nums + 5","map(nums, 5)"], answer:0,
          explain:"列表推导式一行搞定，并返回新列表。for 循环里光写 x + 5 不会存下任何东西。" },
        { q:"想数出列表里有几个元素，用？",
          options:["len(nums)","count(nums)","size(nums)","nums.length"], answer:0,
          explain:"Python 用 len()。nums.length 是 JavaScript 的写法，Python 里没有。" },
        { q:"字典里取一个可能不存在的键，安全写法是？",
          options:["d.get(键, 默认值)","d[键]","d.find(键)","d.键"], answer:0,
          explain:"get 不会因为缺键而崩。d[键] 缺键就 KeyError；d.find 是字符串/列表的方法，字典没有。" }
      ]},

    { type:"quiz", q:"输出是什么？", code:`students = [{"name": "张三", "score": 88}, {"name": "李四", "score": 52}]
print([s["name"] for s in students if s["score"] >= 60])`,
      options:["['张三']","['张三', '李四']","[88]","报错"], answer:0,
      explain:"只筛出张三那一行，再取 name 列 → ['张三']。注意结果是列表，不是字符串。" },

    { type:"fill", q:"这行打印什么？", code:`nums = [3, 1, 2]
print(sorted(nums, reverse=True)[0])`,
      ph:"输入一个数字", accept:["3"],
      explain:"sorted 从大到小 → [3, 2, 1]，[0] 取第一个 → 3。（其实 max(nums) 更直接，但这条链也常写。）" },

    { type:"blank", q:"补全：算出平均分", code:`scores = [88, 52, 76]
avg = ____ / len(scores)
print(avg)`,
      options:["sum(scores)","max(scores)","scores[0]","len(scores)"], answer:0,
      explain:"平均分 = 总分 ÷ 个数 = sum(scores) / len(scores)。" },

    { type:"concept", title:"拆解：四个零件怎么拼成脚本", tag:"讲一点",
      body:"① 取列：scores = [s[\"score\"] for s in students]\n② 算统计：avg = sum(scores) / len(scores)，最好的 m = max(scores)\n③ 筛行：passed = [s for s in students if s[\"score\"] >= 60]\n④ 打印：用 f-string 排版，或者逐行 for 循环打印。\n写完先跑，看输出跟你手算的对不对 —— 对不上就 print 中间变量。",
      code:`scores = [s["score"] for s in students]
avg = sum(scores) / len(scores)
m = max(scores)
passed = [s for s in students if s["score"] >= 60]
print(f"共 {len(students)} 人，平均 {avg:.1f} 分")
print(f"最高分 {m}：{[s['name'] for s in students if s['score'] == m]}")
print(f"及格 {len(passed)} 人，及格率 {len(passed) / len(students):.0%}")`,
      out:`共 3 人，平均 72.9 分
最高分 88：['张三']
及格 2 人，及格率 67%`,
      tip:"f\"{avg:.1f}\" 是「保留 1 位小数」的写法，比 round 更适合直接排版；{x:.0%} 是百分数。这两个格式化小抄记住很划算。" },

    { type:"write", q:"写一份完整成绩报告：给定 students（3 个人，字段 name / score），打印总人数、平均分（1 位小数）、最高分的人名、及格人数、及格率（百分数）。",
      hint:"① scores = [s[\"score\"] for s in students]；② avg = sum(scores) / len(scores)；③ m = max(scores)，用推导式找名字；④ passed = [s for s in students if s[\"score\"] >= 60]，及格率 = len(passed)/len(students)；⑤ print 里用 f\"{avg:.1f}\" 和 f\"{rate:.0%}\"。",
      answer:`students = [
    {"name": "张三", "score": 88},
    {"name": "李四", "score": 52},
    {"name": "王五", "score": 76},
]
scores = [s["score"] for s in students]
avg = sum(scores) / len(scores)
m = max(scores)
best = [s["name"] for s in students if s["score"] == m]
passed = [s for s in students if s["score"] >= 60]
print(f"总人数 {len(students)}")
print(f"平均分 {avg:.1f}")
print(f"最高分 {m}：{best}")
print(f"及格 {len(passed)} 人")
print(f"及格率 {len(passed) / len(students):.0%}")`,
      explain:"输出：总人数 3 / 平均分 72.0 / 最高分 88：['张三'] / 及格 2 人 / 及格率 67%。\n这份脚本手写要 8 行。第 3 周学 pandas 之后，同样的报告两三行就出来了 —— 但你现在先手写一遍，才知道那两三行在替你做什么。" },

    { type:"concept", title:"第 2 周结束，你手里有什么", tag:"讲一点",
      body:"列表（一排抽屉）· 字典（按名字查）· 列表装字典（一张表）· for/while（把表跑一遍）· 推导式（一行筛行取列）· f-string（排版输出）",
      tip:"明天的第 15 关开始 pandas。你会看到：今天用 8 行写的成绩报告，pandas 里读文件 1 行、算平均 1 行、筛人 1 行。" }
  ]},

{ id:101, week:2, extra:true, theme:"慢速补课", title:"补课：列表 / 字典 / f-string 慢速版",
  subtitle:"第 8–11 关觉得虚的时候来这一关。全部照抄，不用自己设计逻辑。",
  cards:[
    { type:"concept", title:"这一关怎么用", tag:"讲一点",
      body:"三遍法：① 只看代码，一行一行念出来「把什么存进什么」；② 抄一遍，一个字不改；③ 只改一处（把名字换掉），看输出跟着变。不用理解到能默写，能照着改就行。",
      tip:"学代码的第一阶段不是「会写」，是「看得懂 + 敢改」。卡住往往是因为跳过了「敢改」这一步。" },

    { type:"concept", title:"列表：一排抽屉，编号从 0 开始", tag:"讲一点",
      body:"方括号包起来的一串东西叫列表。取第几个用 x[编号]，编号从 0 数：第 1 个是 x[0]，第 3 个是 x[2]。",
      code:`x = ["甲", "乙", "丙"]
print(x[0])
print(x[2])`,
      out:`甲
丙`,
      tip:"x[-1] 是最后一个。记不住编号就从 0 开始数手指。" },

    { type:"quiz", q:"输出是什么？", code:`x = ["甲", "乙", "丙"]
print(x[1])`,
      options:["甲", "乙", "丙", "报错"], answer:1,
      explain:"编号从 0 开始：x[0] 是甲，x[1] 是乙，x[2] 是丙。所以 x[1] 是乙。" },

    { type:"concept", title:"字典：靠名字找，不靠编号", tag:"讲一点",
      body:"大括号包起来的「键: 值」对。取值时把编号换成键名：d[\"名字\"]。字典里没有「第几项」，只有「叫什么」。",
      code:`p = {"name": "小明", "age": 18}
print(p["name"])
print(p["age"])`,
      out:`小明
18`,
      tip:"键名要带引号（它是字符串）。写 p[name] 会报 NameError——Python 会以为 name 是个变量。" },

    { type:"quiz", q:"输出是什么？", code:`d = {"x": 1, "y": 2}
print(len(d))`,
      options:["1", "2", "3", "报错"], answer:1,
      explain:"len 数的是有几项（几个键值对）。这里 x 和 y 两项，所以是 2。" },

    { type:"order", q:"排成能跑的顺序：用字典存一本书，再打印书名。",
      lines:[
        'book = {"title": "Python 入门"}',
        't = book["title"]',
        'print(f"书名是《{t}》")'
      ],
      explain:"先建（book），再取（t），最后打印。这个「建 → 取 → 打印」是后面所有数据处理脚本的骨架。" },

    { type:"concept", title:"f-string 三步法（背下来就够用）", tag:"划重点",
      body:"第 1 步：把要用到的值取成变量；第 2 步：写 print(f\"…{变量}…\")；第 3 步：花括号里只放变量名，不放方括号。",
      code:`city = "北京"
temp = 24
print(f"{city} 今天 {temp} 度")`,
      out:`北京 今天 24 度`,
      tip:"漏掉 f，{city} 会原样打印；花括号里的变量名不要加引号。" },

    { type:"fill", q:"这行会打印什么？", tag:"推一遍",
      code:`a = 3
b = 4
print(f"{a} + {b} = {a + b}")`,
      ph:"3 + 4 = …", accept:["3 + 4 = 7"],
      explain:"花括号里可以写算式，Python 先算再填。所以 {a + b} 填进去的是 7。" },

    { type:"write", q:"建一个列表 fruits 装三种水果，把第二种取到变量 second，然后打印「我最喜欢 second」。照抄上面的三步法。",
      hint:"① fruits = [\"苹果\", \"香蕉\", \"橙子\"]；② second = fruits[1]；③ print(f\"我最喜欢{second}\")。",
      answer:`fruits = ["苹果", "香蕉", "橙子"]
second = fruits[1]
print(f"我最喜欢{second}")`,
      explain:"全套动作：列表取值 → 存变量 → f-string 打印。第 3 周开始，同样的动作换成从 Excel 里取一列。" }
  ]}
);
