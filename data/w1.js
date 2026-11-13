/* 第 1 周：让程序听你话 —— 环境 / 变量 / 字符串 / 数字 / 输入输出 / 条件 */
(window.PY_DAYS = window.PY_DAYS || []).push(

{ id:1, week:1, theme:"基础：从第一行代码开始", title:"装好 Python，说第一句话",
  subtitle:"今天只要成功跑出第一行 print。",
  cards:[
    { type:"concept", title:"Python 到底装了些什么", tag:"讲一点",
      body:"想跑代码，你需要两样东西：\n① 解释器（真正的 Python，负责执行）\n② 一个写代码的地方（任何文本编辑器都行，推荐 VS Code）\n\n写好的文件存成 .py，用解释器运行它——就这么简单。",
      code:`print("你好，世界")`,
      tip:"安装时务必勾上 Add python.exe to PATH，否则在终端里敲 python 会提示「不是内部或外部命令」。" },

    { type:"concept", title:"程序 = 一行一行往下执行", tag:"讲一点",
      body:"Python 从第一行开始，一行一行往下走。所以顺序就是一切——同一批代码换个顺序，结果完全不同。",
      code:`print("第一行")
print("第二行")
print("第三行")`,
      out:`第一行
第二行
第三行`,
      tip:"文件名别用中文、别带空格、别叫 test.py（会和 Python 自带的库撞名）。" },

    { type:"quiz", q:"这行代码会在屏幕上打出什么？", code:`print("2+3")`,
      options:["5","2+3","\"2+3\"","报错"], answer:1,
      explain:"引号把内容变成了「字符串」——字符串里的东西原样吐出，不做计算。想让电脑算 2+3，引号得去掉：print(2+3)。" },

    { type:"quiz", q:"下面哪一行才是正确的打印？",
      options:["print \"hi\"","print(\"hi\")","Print(\"hi\")","echo(\"hi\")"], answer:1,
      explain:"Python 3 的 print 必须带圆括号；而且函数名区分大小写，Print 不等于 print。第一行是 Python 2 的老写法，现在会直接报错。" },

    { type:"fill", q:"补全代码，让它打印：你好", code:`____("你好")`,
      accept:["print(\"你好\")","print('你好')"], ph:"print(...)",
      explain:"print 是 Python 的「喇叭」，括号里放要显示的内容。中文、英文、符号都行，引号单双都可，但必须成对。" },

    { type:"write", q:"写一行代码，在屏幕上打印：我是小明（把名字换成你自己的）。",
      hint:"只需要一行 print，注意引号要成对。",
      answer:`print("我是小明")`,
      explain:"跑通这一行，你就已经会「调用函数」了——print 是函数，括号里的是参数。" }
  ]},

{ id:2, week:1, theme:"基础：从第一行代码开始", title:"变量：给数据贴个名字",
  subtitle:"变量不是数学里的 x，它是贴在数据上的标签。",
  cards:[
    { type:"concept", title:"变量 = 贴了名字的盒子", tag:"讲一点",
      body:"把数据放进盒子，以后叫名字就能取出来用。等号左边是名字，右边是数据。",
      code:`name = "小明"
age = 18
print(name, age)`,
      out:`小明 18`,
      tip:"= 是「把右边塞进左边」，不是数学的「等于」。判断相等要用两个等号 ==。" },

    { type:"concept", title:"四个基本类型，随时用 type() 查", tag:"讲一点",
      body:"整数 int、小数 float、字符串 str、布尔 bool（只有 True / False）。搞不清一个东西是什么类型，就 type() 一下——这是新手最常用的救命函数。",
      code:`print(type(3))
print(type(3.0))
print(type("3"))
print(type(True))`,
      out:`<class 'int'>
<class 'float'>
<class 'str'>
<class 'bool'>`,
      tip:"3 和 \"3\" 是两个世界的东西：前者能算数，后者只是文字。" },

    { type:"quiz", q:"屏幕会打印什么？", code:`x = 5
x = x + 1
print(x)`,
      options:["5","6","x + 1","报错"], answer:1,
      explain:"先取出 x 的旧值 5，加 1 得 6，再塞回 x。所以 x 变成了 6——这叫「重新赋值」。" },

    { type:"quiz", q:"下面哪个是字符串？",
      options:["42","3.14","\"42\"","True"], answer:2,
      explain:"被引号包起来的才是字符串。42 是整数，3.14 是小数，True 是布尔值。" },

    { type:"blank", q:"把名字填对：这个变量应该叫 name，值是一串文字。", code:`____ = "Python"`,
      options:["1name","name","\"name\"","name 1"], answer:1,
      explain:"变量名不能数字开头、不能有空格、也不能加引号——加了引号它本身就变成字符串了，左边就不能放变量名。" },

    { type:"write", q:"建两个变量 city 和 food，分别存你的城市和爱吃的东西，然后打印：我在北京吃烤鸭（换成你的内容）。",
      hint:"三行：两次赋值 + 一次 print。print 里用逗号隔开多个东西，会自动加空格。",
      answer:`city = "北京"
food = "烤鸭"
print("我在", city, "吃", food)`,
      out:`我在 北京 吃 烤鸭`,
      explain:"print 用逗号连接多项时会自动补空格，所以输出里字间有空隙。想严丝合缝，用字符串拼接 + 或者 f-string（第 3 天讲）。" }
  ]},

{ id:3, week:1, theme:"基础：从第一行代码开始", title:"字符串：处理文字的本事",
  subtitle:"办公自动化的 80% 时间都在跟文字打交道。",
  cards:[
    { type:"concept", title:"索引和切片：字符串是排队的字符", tag:"讲一点",
      body:"位置从 0 开始数。s[0] 是第一个，s[-1] 是最后一个，s[0:3] 是「从 0 取到 3，但不含 3」。",
      code:`s = "Python"
print(s[0], s[-1], s[0:3])`,
      out:`P n Pyt`,
      tip:"记牢这条：取头不取尾。s[0:3] 拿到 3 个字符，不是 4 个。" },

    { type:"concept", title:"四个最常用的字符串方法", tag:"讲一点",
      body:"strip() 去首尾空格，upper() 转大写，replace() 替换，split() 切开成列表。",
      code:`s = "  Hello World  "
print(s.strip())
print(s.upper())
print(s.replace("World", "Python"))
print("a,b,c".split(","))`,
      out:`Hello World
  HELLO WORLD  
  Hello Python  
['a', 'b', 'c']`,
      tip:"方法不会改动原字符串，它返回一个新的。不 print 或者不接住，新结果就等于白做。" },

    { type:"quiz", q:"输出是什么？", code:`print("Python"[1])`,
      options:["P","y","Py","报错"], answer:1,
      explain:"索引从 0 开始数：P 是第 0 个，y 是第 1 个。想拿第一个字符要写 [0]。" },

    { type:"quiz", q:"len 会打印几？", code:`print(len("你好abc"))`,
      options:["3","4","5","8"], answer:2,
      explain:"len 数的是「字符个数」，一个汉字算 1 个。2 个汉字 + 3 个字母 = 5。（有些语言按字节算会是 9，Python 3 不会。）" },

    { type:"blank", q:"把首尾空格去掉：", code:`s = "  hi  "
print(s.____())`,
      options:["strip","trim","clean","remove"], answer:0,
      explain:"Python 里是 strip()；trim 是 JavaScript 的叫法。顺便记：去掉左边的空格是 lstrip()，右边是 rstrip()。" },

    { type:"fill", q:"这行会打印什么？", code:`print("abc".upper())`,
      accept:["ABC"], ph:"写出结果",
      explain:"upper() 把字母全转大写。反过来 lower() 是转小写。" },

    { type:"write", q:"有一段脏数据 \"  张三  \"（前后各有空格），打印出去掉空格后的版本。",
      hint:"一行就够，直接用 strip()。可以 print(\"  张三  \".strip())。",
      answer:`print("  张三  ".strip())`,
      out:`张三`,
      explain:"strip() 可以把「直接写在字面量后面」——Python 里数据和点号之间不用加东西。" }
  ]},

{ id:4, week:1, theme:"基础：从第一行代码开始", title:"数字与运算",
  subtitle:"算钱、算时间、算几行数据，都靠这几个符号。",
  cards:[
    { type:"concept", title:"七个运算符", tag:"讲一点",
      body:"+ - * / 是加减乘除；// 是整除（只要整数部分）；% 是取余（剩下的零头）；** 是乘方。",
      code:`print(7 / 2)
print(7 // 2)
print(7 % 2)
print(2 ** 3)`,
      out:`3.5
3
1
8`,
      tip:"在 Python 里 / 永远得到小数：10 / 2 是 5.0 而不是 5。要整数用 //。" },

    { type:"concept", title:"括号优先，别猜", tag:"讲一点",
      body:"跟数学一样先乘除后加减，拿不准就加括号。round(x, 2) 保留两位小数。",
      code:`print(2 + 3 * 4)
print((2 + 3) * 4)
print(round(3.14159, 2))`,
      out:`14
20
3.14`,
      tip:"计算钱的时候要小心浮点数：0.1 + 0.2 会得到 0.30000000000000004。精确到分建议 round 或用 decimal。" },

    { type:"quiz", q:"输出是什么？", code:`print(9 // 2)`,
      options:["4.5","4","5","1"], answer:1,
      explain:"// 是整除，把小数部分直接砍掉，不做四舍五入。9 // 2 = 4，而且结果是整数。" },

    { type:"quiz", q:"输出是什么？", code:`print(9 % 4)`,
      options:["0","1","2","2.25"], answer:1,
      explain:"9 = 4 × 2 余 1，所以 % 得 1。% 最常用的地方就是判断奇偶：n % 2 等于 0 是偶数，等于 1 是奇数。" },

    { type:"quiz", q:"输出是什么？", code:`print(2 ** 4)`,
      options:["8","16","24","4"], answer:1,
      explain:"** 是乘方：2 的 4 次方 = 2×2×2×2 = 16。注意不是 ^（^ 在 Python 里是另一个运算）。" },

    { type:"blank", q:"补全：判断 n 是偶数。", code:`if n % 2 == ____:
    print("偶数")`,
      options:["0","1","2","n"], answer:0,
      explain:"被 2 整除的数余数为 0，所以拿 n % 2 和 0 比。这个套路以后会反复出现：判断能不能被某个数整除，就 % 那个数看余数。" },

    { type:"write", q:"算出 123 乘 456，并打印结果。",
      hint:"一行 print，中间乘号别写成字母 x。",
      answer:`print(123 * 456)`,
      out:`56088`,
      explain:"想连算式一起显示得漂亮，可以写 print(\"123 × 456 =\", 123 * 456)。" }
  ]},

{ id:5, week:1, theme:"基础：从第一行代码开始", title:"input：让程序会问话",
  subtitle:"从「死程序」到「会对话的程序」，就差这一个函数。",
  cards:[
    { type:"concept", title:"input 拿回来的永远是字符串", tag:"讲一点",
      body:"不管用户敲的是 5 还是 5.5，input 都返回字符串。要拿它算数，必须先转换。",
      code:`name = input("你叫什么？")
print("你好，" + name)`,
      tip:"这是新手第一大坑：用 input 拿到数字直接加 1，程序会崩（TypeError）。先 int() 或 float()。" },

    { type:"concept", title:"转类型 + print 的两个小参数", tag:"讲一点",
      body:"int() 转整数，float() 转小数，str() 转文字。print 的 sep 控制多项之间插什么，end 控制结尾换不换行。",
      code:`age = int(input("几岁？"))
print(age + 1)
print("a", "b", sep="-")`,
      out:`19
a-b`,
      tip:"年龄这种用 int，身高体重这种带小数的用 float。转换失败（比如输入了「十八」）也会报错。" },

    { type:"quiz", q:"屏幕上 type 的输出是什么？", code:`name = input("名字：")
print(type(name))`,
      options:["<class 'int'>","<class 'str'>","<class 'float'>","看用户输入什么"], answer:1,
      explain:"input 永远返回字符串，跟用户敲了什么无关。所以「5」是文字，不是数字。" },

    { type:"quiz", q:"用户输入 5，这行代码会怎样？", code:`a = input("数字：")
print(a + 1)`,
      options:["打印 6","打印 51","报错 TypeError","打印 5"], answer:2,
      explain:"a 是字符串 \"5\"，字符串不能和整数相加，Python 直接抛 TypeError。正确写法：print(int(a) + 1)。" },

    { type:"blank", q:"补全：把用户输入转成整数。", code:`age = ____(input("几岁？"))`,
      options:["int","str","print","input"], answer:0,
      explain:"int() 把字符串转成整数。要小数就用 float()。注意是「套在 input 外面」，顺序不能反。" },

    { type:"write", q:"让程序问两个数（都是整数），打印它们的和。",
      hint:"两次 int(input(...))，然后 print 相加。",
      answer:`a = int(input("第一个数："))
b = int(input("第二个数："))
print(a + b)`,
      explain:"这是所有「计算器」程序的最小骨架：输入 → 转换 → 计算 → 输出。" }
  ]},

{ id:6, week:1, theme:"基础：从第一行代码开始", title:"if：让程序会分岔",
  subtitle:"程序开始有判断力，这是「智能」的第一层。",
  cards:[
    { type:"concept", title:"if / elif / else 三件套", tag:"讲一点",
      body:"条件后面一定要冒号，下一行必须缩进（4 个空格）。缩进不是排版好看，它就是 Python 的语法。",
      code:`score = 75
if score >= 90:
    print("优秀")
elif score >= 60:
    print("及格")
else:
    print("不及格")`,
      out:`及格`,
      tip:"同一层的 if/elif/else 要顶格对齐；属于这个分支的代码统一缩进。混用空格和 Tab 会报 IndentationError。" },

    { type:"concept", title:"比较和逻辑", tag:"讲一点",
      body:"== 判断相等，!= 不等，> < >= <= 比大小。and 两个都要真，or 一个真就行，not 取反。",
      code:`print(3 > 2, 2 == 2, 1 != 1)
print(3 > 2 and 1 > 2)
print(not True)`,
      out:`True True False
False
False`,
      tip:"= 是赋值，== 是比较。写 if x = 5 会报错，别写错。" },

    { type:"quiz", q:"哪个条件表示「n 是正数」？",
      options:["n >= 1 就是唯一写法","n > 0","n = > 0","n != 0"], answer:1,
      explain:"n > 0 就是正数（大于零）。n != 0 只排除零，负数也会通过，不行。" },

    { type:"quiz", q:"输出是什么？", code:`print(3 > 2 and 1 > 2)`,
      options:["True","False","报错","3"], answer:1,
      explain:"and 要求两边都是 True。1 > 2 是 False，所以整体 False。" },

    { type:"order", q:"把这段成绩判断的代码排成能正确运行的样子：",
      lines:[
        "score = 85",
        "if score >= 90:",
        "    print(\"优秀\")",
        "elif score >= 60:",
        "    print(\"及格\")",
        "else:",
        "    print(\"不及格\")"
      ],
      explain:"顺序是：先给变量，再 if，再 elif（可以有多个，从上往下第一个成立的分支执行），最后 else 兜底。缩进的行必须紧跟在带冒号的那行下面。" },

    { type:"write", q:"输入一个分数，>= 60 打印「及格」，否则打印「不及格」。",
      hint:"int(input(...)) 拿到分数，然后 if / else 两条路。",
      answer:`score = int(input("分数："))
if score >= 60:
    print("及格")
else:
    print("不及格")`,
      explain:"if 后面那句 print 缩进了 4 个空格，表示「只有条件成立才执行」。没缩进的就会无条件执行——这是最常见的逻辑 bug。" }
  ]},

{ id:7, week:1, theme:"基础：从第一行代码开始", title:"周复习 + BMI 计算器",
  subtitle:"把这一周学的六个词串起来，做出第一个真能用的程序。",
  cards:[
    { type:"quiz", q:"哪一行会报错？",
      options:["print(3 + 2)","print(\"3\" + \"2\")","print(\"3\" + 2)","print(3 * 2)"], answer:2,
      explain:"字符串 + 整数 → TypeError。字符串只能和字符串相加（拼接）。想拼数字先 str(2) 转一下。" },

    { type:"quiz", q:"输出是什么？", code:`x = "5"
print(x * 2)`,
      options:["10","55","5*2","报错"], answer:1,
      explain:"字符串乘整数 = 重复。\"5\" * 2 得到 \"55\"。因为 x 是字符串不是数字——类型不对，结果就完全跑偏。" },

    { type:"fill", q:"这行打印什么？", code:`print(len("Python"))`,
      accept:["6"], ph:"一个数字",
      explain:"P-y-t-h-o-n 六个字符，所以是 6。" },

    { type:"blank", q:"补全：把输入的两段文字接成一句完整的话。", code:`a = input("姓：")
b = input("名：")
print(a ____ b)`,
      options:["+","*","-","&"], answer:0,
      explain:"字符串用 + 拼接。如果是数字相加也用 +，但两边都得是数字。" },

    { type:"concept", title:"本周六个词，能背下来就掌握了 70%", tag:"讲一点",
      body:"① print(…)：把东西打到屏幕\n② 变量 = 值：给数据起名字\n③ 类型：int / float / str / bool，用 type() 查\n④ 运算符：+ - * / // % **\n⑤ input(…)：从键盘取文字，永远是字符串\n⑥ if / elif / else：按条件走不同分支",
      tip:"这六个词就是这个工具的全部地基。接下来所有花活，都是它们的组合。" },

    { type:"write", q:"小项目：BMI 计算器。输入身高（米，比如 1.72）和体重（公斤），算 BMI = 体重 ÷ 身高²，打印结果（保留两位小数）。",
      hint:"身高体重都用 float(input(...))；乘方用 **；结果用 round(bmi, 2)。",
      answer:`h = float(input("身高(米)："))
w = float(input("体重(公斤)："))
bmi = w / (h ** 2)
print("你的 BMI 是", round(bmi, 2))`,
      out:`你的 BMI 是 22.32`,
      explain:"注意 w / (h ** 2) 的括号：先算身高平方，再拿体重除。不加括号运算顺序会变，结果全错。" }
  ]}
);
