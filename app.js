/* Python 百词斩 —— 本地学习引擎（无依赖，file:// 直接可跑） */ ;(function () {
  'use strict'
  var DAYS = (window.PY_DAYS || []).slice().sort(function (a, b) {
    return a.id - b.id
  })
  var MAIN = DAYS.filter(function (d) {
    return !d.extra
  }).length // 主线关卡数（不含补课）
  var STORE = 'pybz.v1'
  var DM = 86400000
  var LV_STEP = 120
  var GAPS = [1, 3, 7, 15, 30] // SRS 间隔（天）
  var TITLES = [
    '刚破壳的小蛇',
    '会写脚本的小蟒',
    '自动化学徒',
    '表格忍者',
    '文件管家',
    '正则猎人',
    '代码包工头',
    '自动化工程师',
  ]
  /* ---------------- 小工具 ---------------- */ function el(tag, attrs) {
    var e = document.createElement(tag),
      kids = [].slice.call(arguments, 2)
    if (attrs)
      for (var k in attrs) {
        var v = attrs[k]
        if (v == null || v === false) continue
        if (k === 'class') e.className = v
        else if (k === 'text') e.textContent = v
        else if (k === 'html') e.innerHTML = v
        else if (k.slice(0, 2) === 'on') e.addEventListener(k.slice(2), v)
        else e.setAttribute(k, v)
      }
    ;(function add(list) {
      list.forEach(function (x) {
        if (x == null || x === false) return
        if (Array.isArray(x)) return add(x)
        e.appendChild(typeof x === 'object' ? x : document.createTextNode(String(x)))
      })
    })(kids)
    return e
  }
  function $(s) {
    return document.querySelector(s)
  }
  function pad(n) {
    return String(n).padStart(2, '0')
  }
  function dk(d) {
    d = d || new Date()
    return d.getFullYear() + '-' + pad(d.getMonth() + 1) + '-' + pad(d.getDate())
  }
  function esc(s) {
    return String(s).replace(/&/g, '&amp;').replace(/</g, '&lt;').replace(/>/g, '&gt;')
  }
  var KW =
    /\b(def|return|if|elif|else|for|while|in|not|and|or|import|from|as|with|try|except|finally|lambda|class|break|continue|pass|global|None|True|False|print|len|range|open|int|str|float|list|dict|input|sum|sorted|enumerate|zip|type|round|abs|max|min|append|split|join|strip|replace|upper|lower|keys|values|items|get)\b/
  function hl(code) {
    var re = /(#[^\n]*)|('(?:[^'\\]|\\.)*'|"(?:[^"\\]|\\.)*")|\b(\d+(?:\.\d+)?)\b|([A-Za-z_][A-Za-z_0-9]*)/g
    var out = '',
      last = 0,
      m
    while ((m = re.exec(code))) {
      out += esc(code.slice(last, m.index))
      var t = m[0],
        cls = ''
      if (m[1]) cls = 'c-com'
      else if (m[2]) cls = 'c-str'
      else if (m[3]) cls = 'c-num'
      else if (KW.test(t) && t.length === m[4].length) cls = 'c-kw'
      out += cls ? '<span class="' + cls + '">' + esc(t) + '</span>' : esc(t)
      last = m.index + t.length
    }
    out += esc(code.slice(last))
    return out
  }
  function codeEl(code, cap) {
    var box = el('div')
    if (cap) box.appendChild(el('div', { class: 'slot-hint', text: cap }))
    box.appendChild(el('pre', { class: 'code', html: '<code>' + hl(code) + '</code>' }))
    return box
  }
  /* ---------------- 吉祥物 ---------------- */ var MASCOT =
    '<svg viewBox="0 0 64 64" xmlns="http://www.w3.org/2000/svg">' +
    '<ellipse cx="33" cy="57" rx="19" ry="4.2" fill="#16a34a" opacity=".13"/>' +
    '<path d="M18 51.5c-6.4-.6-10-6-10-12.4 0-9.2 7.4-15.6 16.6-15.6h9.6" stroke="#2fbf5f" stroke-width="8.4" fill="none" stroke-linecap="round"/>' +
    '<circle cx="41" cy="22" r="10.6" fill="#43cf74"/>' +
    '<circle cx="37.6" cy="20.6" r="2.1" fill="#0d1b13"/><circle cx="45.4" cy="20.6" r="2.1" fill="#0d1b13"/>' +
    '<circle cx="38.3" cy="19.8" r=".75" fill="#fff"/><circle cx="46.1" cy="19.8" r=".75" fill="#fff"/>' +
    '<path d="M39.4 26.2c1 1.4 3.1 1.4 4.1 0" stroke="#0d1b13" stroke-width="1.5" fill="none" stroke-linecap="round"/>' +
    '<ellipse cx="34.2" cy="24.4" rx="2.2" ry="1.4" fill="#ff9d9d" opacity=".6"/>' +
    '<ellipse cx="47.8" cy="24.4" rx="2.2" ry="1.4" fill="#ff9d9d" opacity=".6"/>' +
    '<path d="M41 28.4v2.4m0 0-1.5 2m1.5-2 1.5 2" stroke="#ef4444" stroke-width="1.3" stroke-linecap="round" fill="none"/>' +
    '<path d="M30.4 12.2 41 7.4l10.6 4.8L41 17z" fill="#22322a"/>' +
    '<path d="M41 17v5" stroke="#22322a" stroke-width="1.7" stroke-linecap="round"/>' +
    '<circle cx="41" cy="23.2" r="1.8" fill="#f59e0b"/>' +
    '</svg>'
  /* ---------------- 存档 ---------------- */ function blank() {
    return {
      v: 1,
      xp: 0,
      streak: 0,
      best: 0,
      lastStudy: null,
      days: {},
      srs: {},
      history: {},
      part: null,
      mute: false,
      done: 0,
      right: 0,
      tries: 0,
      createdAt: Date.now(),
    }
  }
  var S = load()
  function load() {
    try {
      var raw = localStorage.getItem(STORE)
      if (raw) {
        var o = JSON.parse(raw)
        return Object.assign(blank(), o)
      }
    } catch (e) {}
    return blank()
  }
  var canSave = true
  function save() {
    try {
      localStorage.setItem(STORE, JSON.stringify(S))
    } catch (e) {
      canSave = false
    }
  }
  function lv(xp) {
    return 1 + Math.floor(xp / LV_STEP)
  }
  function titleOf(n) {
    return TITLES[Math.min(n - 1, TITLES.length - 1)]
  }
  function liveStreak() {
    if (!S.lastStudy) return 0
    var t = dk(),
      y = dk(new Date(Date.now() - DM))
    return S.lastStudy === t || S.lastStudy === y ? S.streak : 0
  }
  /* ---------------- 声音 ---------------- */ var AC = null
  function beep(kind) {
    if (S.mute) return
    try {
      AC = AC || new (window.AudioContext || window.webkitAudioContext)()
      var now = AC.currentTime
      function tone(f, t0, dur, type, vol) {
        var o = AC.createOscillator(),
          g = AC.createGain()
        o.type = type || 'sine'
        o.frequency.value = f
        g.gain.setValueAtTime(0, now + t0)
        g.gain.linearRampToValueAtTime(vol || 0.16, now + t0 + 0.012)
        g.gain.exponentialRampToValueAtTime(0.0001, now + t0 + dur)
        o.connect(g)
        g.connect(AC.destination)
        o.start(now + t0)
        o.stop(now + t0 + dur + 0.02)
      }
      if (kind === 'ok') {
        tone(660, 0, 0.1)
        tone(990, 0.085, 0.14)
      } else if (kind === 'bad') {
        tone(190, 0, 0.18, 'triangle', 0.18)
      } else if (kind === 'win') {
        tone(523, 0, 0.12)
        tone(659, 0.1, 0.12)
        tone(784, 0.2, 0.22)
      } else {
        tone(420, 0, 0.06, 'sine', 0.1)
      }
    } catch (e) {}
  }
  /* ---------------- 通用 UI ---------------- */ var toastT = null
  function toast(msg) {
    var t = $('#toast')
    t.textContent = msg
    t.classList.add('on')
    clearTimeout(toastT)
    toastT = setTimeout(function () {
      t.classList.remove('on')
    }, 2000)
  }
  function showView(name) {
    document.querySelectorAll('.view').forEach(function (v) {
      v.classList.remove('on')
    })
    var v = $('#view-' + name)
    if (v) v.classList.add('on')
    try {
      window.scrollTo({ top: 0, behavior: 'smooth' })
    } catch (e) {}
  }
  function hud() {
    $('#chipStreak').textContent = '🔥 ' + liveStreak() + ' 天'
    var n = lv(S.xp)
    $('#chipXp').textContent = '⭐ Lv.' + n + ' · ' + titleOf(n)
    $('#btnSettings').onclick = openSettings
  }
  function closeModal() {
    $('#modal').classList.add('hidden')
    $('#modalBody').innerHTML = ''
  }
  function modal(title, bodyNode, buttons) {
    var b = $('#modalBody')
    b.innerHTML = ''
    b.appendChild(el('h3', { text: title }))
    if (bodyNode) b.appendChild(bodyNode)
    var row = el('div', { class: 'mrow' })
    ;(buttons || [{ label: '知道了', cls: 'btn sm' }]).forEach(function (btn) {
      row.appendChild(
        el('button', {
          class: 'btn sm ' + (btn.cls || ''),
          text: btn.label,
          onclick: function () {
            closeModal()
            if (btn.fn) btn.fn()
          },
        }),
      )
    })
    b.appendChild(row)
    $('#modal').classList.remove('hidden')
  }
  /* ---------------- 复习队列 ---------------- */ function dueList() {
    var now = Date.now(),
      out = []
    DAYS.forEach(function (d) {
      d.cards.forEach(function (c, i) {
        if (c.type === 'concept') return
        var key = d.id + '-' + i,
          r = S.srs[key]
        if (r && r.due <= now) out.push({ card: c, key: key, dayId: d.id, due: r.due, w: r.w || 0 })
      })
    })
    out.sort(function (a, b) {
      return a.due - b.due
    })
    return out
  }
  function wrongList() {
    var out = []
    DAYS.forEach(function (d) {
      d.cards.forEach(function (c, i) {
        var key = d.id + '-' + i,
          r = S.srs[key]
        if (r && (r.w || 0) > 0) out.push({ card: c, key: key, dayId: d.id, r: r })
      })
    })
    out.sort(function (a, b) {
      return (b.r.w || 0) - (a.r.w || 0) || a.r.due - b.r.due
    })
    return out
  }
  function grade(key, ok) {
    var r = S.srs[key] || { level: 0, w: 0, r: 0, due: 0 }
    if (ok) {
      r.level = Math.min(r.level + 1, GAPS.length - 1)
      r.r = (r.r || 0) + 1
    } else {
      r.level = 0
      r.w = (r.w || 0) + 1
    }
    r.due = Date.now() + GAPS[r.level] * DM
    r.last = Date.now()
    S.srs[key] = r
  }
  /* ---------------- 首页 ---------------- */ function nextDay() {
    for (var i = 0; i < DAYS.length; i++) if (!S.days[DAYS[i].id] && !DAYS[i].extra) return DAYS[i]
    return null
  }
  function heatmap() {
    var weeks = 12,
      cells = []
    var today = new Date()
    today.setHours(0, 0, 0, 0)
    var dow = (today.getDay() + 6) % 7 // 周一=0
    var start = new Date(today.getTime() - (weeks * 7 + dow) * DM)
    for (var i = 0; i <= weeks * 7 + dow; i++) {
      var d = new Date(start.getTime() + i * DM),
        k = dk(d)
      var h = S.history[k],
        n = h ? h.cards : 0
      var l = n === 0 ? 0 : n < 6 ? 1 : n < 12 ? 2 : n < 22 ? 3 : 4
      cells.push(el('i', { 'data-l': String(l), title: k + (n ? ' · ' + n + ' 张卡' : ' · 没学') }))
    }
    var wrap = el('div', { class: 'heatwrap' })
    wrap.appendChild(el('div', { class: 'heat' }, cells))
    var lg = el('div', { class: 'heat-legend' }, '少')
    ;['#e8f0ea', '#bbf0c9', '#6dda8c', '#2eb85c', '#0f7a38'].forEach(function (c) {
      lg.appendChild(el('i', { style: 'background:' + c }))
    })
    lg.appendChild(el('span', { text: '多' }))
    wrap.appendChild(lg)
    return wrap
  }
  function renderHome() {
    var v = $('#view-home')
    v.innerHTML = ''
    var due = dueList(),
      nd = nextDay()
    var part = S.part && nd && S.part.dayId === nd.id ? S.part : null
    var doneCount = Object.keys(S.days).length
    /* 今日卡 */ var hero = el('div', { class: 'card' })
    var top = el('div', { class: 'hero' })
    top.appendChild(el('div', { class: 'hero-art', html: MASCOT }))
    var txt = el('div')
    var heading = nd
      ? part
        ? '接着来：第 ' + nd.id + ' 关 · ' + nd.title
        : doneCount === 0 && !S.lastStudy
          ? '第 1 关：' + nd.title
          : '今天：第 ' + nd.id + ' 关 · ' + nd.title
      : MAIN + ' 关全部通关了 🎉'
    txt.appendChild(el('h2', { text: heading }))
    txt.appendChild(
      el('p', {
        text: nd
          ? part
            ? '上次还剩 ' + part.left.length + ' 张没做，接着做完这一关就好。'
            : nd.subtitle +
              '\n' +
              (due.length
                ? '另有 ' + Math.min(due.length, 6) + ' 张卡到复习时间了，先复习记得更牢。'
                : '一张卡一个知识点，答错立刻讲，答对就往下走。')
          : '接下来用「错题本」和「课程地图」随便重温，或者导出存档留个纪念。',
      }),
    )
    var btns = el('div', { class: 'hero-btns' })
    if (nd)
      btns.appendChild(
        el('button', {
          class: 'btn',
          text: (part ? '接着做第 ' : '开始第 ') + nd.id + ' 关 →',
          onclick: function () {
            startDay(nd.id)
          },
        }),
      )
    if (due.length)
      btns.appendChild(
        el('button', { class: 'btn warm', text: '复习 ' + Math.min(due.length, 6) + ' 张', onclick: startReview }),
      )
    if (!nd && !due.length) btns.appendChild(el('button', { class: 'btn', text: '回到课程地图', onclick: renderMap }))
    txt.appendChild(btns)
    top.appendChild(txt)
    hero.appendChild(top)
    v.appendChild(hero)
    /* 数据 */ var acc = S.tries ? Math.round((S.right / S.tries) * 100) : 0
    var stats = el(
      'div',
      { class: 'stats' },
      stat(String(liveStreak()), '连续打卡'),
      stat(String(doneCount) + '/' + MAIN, '已通关'),
      stat(String(S.done), '答过的卡'),
      stat(acc + '%', '正确率'),
    )
    v.appendChild(stats)
    /* 热力图 */ var hc = el('div', { class: 'card' })
    hc.appendChild(
      el(
        'div',
        { class: 'between' },
        el('h3', { text: '打卡记录' }),
        el('span', { class: 'muted', text: '最近 12 周' }),
      ),
    )
    hc.appendChild(heatmap())
    v.appendChild(hc)
    /* 快捷入口 */ var wl = wrongList()
    var quick = el(
      'div',
      { class: 'quick' },
      el('button', { class: 'qbtn', onclick: renderMap }, el('b', { text: '🗺' }), el('span', { text: '课程地图' })),
      el(
        'button',
        { class: 'qbtn', onclick: renderWrong },
        el('b', { text: '📕' }),
        el('span', { text: '错题本 ' + wl.length }),
      ),
      el(
        'button',
        { class: 'qbtn', onclick: openSettings },
        el('b', { text: '💾' }),
        el('span', { text: '存档 / 设置' }),
      ),
    )
    v.appendChild(quick)
    if (!canSave)
      v.appendChild(
        el('div', { class: 'card muted', text: '⚠ 浏览器不让存进度（可能是无痕模式）。点「存档」可以手动导出备份。' }),
      )
    showView('home')
    hud()
  }
  function stat(big, small) {
    return el('div', { class: 'stat' }, el('b', { text: big }), el('small', { text: small }))
  }
  /* ---------------- 会话 ---------------- */ var session = null
  function packCards(dayId) {
    var d = DAYS.filter(function (x) {
      return x.id === dayId
    })[0]
    return d.cards.map(function (c, i) {
      return Object.assign({}, c, { key: dayId + '-' + i, dayId: dayId })
    })
  }
  function startDay(id, opts) {
    var d = DAYS.filter(function (x) {
      return x.id === id
    })[0]
    if (!d) return toast('找不到这一关')
    var cards = packCards(id),
      resumeFrom = 0
    if (S.part && S.part.dayId === id && S.part.left && S.part.left.length) {
      var pool = {}
      cards.forEach(function (c) {
        pool[c.key] = c
      })
      var left = S.part.left
        .map(function (k) {
          return pool[k]
        })
        .filter(Boolean)
      if (left.length && left.length < cards.length) {
        resumeFrom = cards.length - left.length
        cards = left
      }
    }
    session = {
      mode: 'day',
      dayId: id,
      title:
        (d.extra ? '补课 · ' + d.title.replace(/^补课：/, '') : '第 ' + id + ' 关 · ' + d.title) +
        (resumeFrom ? '（接着上次第 ' + (resumeFrom + 1) + ' 张）' : ''),
      cards: cards,
      idx: 0,
      correct: 0,
      total: 0,
      combo: 0,
      maxCombo: 0,
      xp: 0,
      wrongs: [],
      t0: Date.now(),
      resolved: false,
      footNext: null,
    }
    if (resumeFrom) {
      session.correct = S.part.correct || 0
      session.total = S.part.total || 0
    }
    showView('learn')
    buildLearn()
    showCard()
  }
  function pauseDay() {
    if (!session || session.mode !== 'day') return renderHome()
    var left = session.cards
      .slice(session.idx)
      .map(function (c) {
        return c.key
      })
      .filter(Boolean)
    if (!left.length) return finish()
    var doneN = session.cards.length - left.length
    S.part = { dayId: session.dayId, left: left, correct: session.correct, total: session.total, at: Date.now() }
    save()
    toast('存好了，下次打开从第 ' + (doneN + 1) + ' 张接着做')
    renderHome()
    hud()
  }
  function startReview() {
    var items = dueList().slice(0, 6)
    if (!items.length) return toast('现在没有到期的卡，去学新课吧')
    session = {
      mode: 'review',
      dayId: null,
      title: '复习关 · ' + items.length + ' 张',
      cards: items.map(function (it) {
        return Object.assign({}, it.card, { key: it.key, dayId: it.dayId })
      }),
      idx: 0,
      correct: 0,
      total: 0,
      combo: 0,
      maxCombo: 0,
      xp: 0,
      wrongs: [],
      t0: Date.now(),
      resolved: false,
      footNext: null,
    }
    showView('learn')
    buildLearn()
    showCard()
  }
  function buildLearn() {
    var v = $('#view-learn')
    v.innerHTML = ''
    var head = el('div', { class: 'learn-head' })
    head.appendChild(
      el('button', {
        class: 'xbtn',
        text: '✕',
        title: '退出',
        onclick: function () {
          if (session.total > 0 && !confirm('退出这次学习？已完成的不算进关卡记录。')) return
          renderHome()
        },
      }),
    )
    head.appendChild(el('div', { class: 'bar' }, el('i', { id: 'barFill' })))
    head.appendChild(el('div', { class: 'combo', id: 'comboChip', text: 'COMBO 0' }))
    v.appendChild(head)
    var trow = el(
      'div',
      { class: 'trow', style: 'margin:-2px 0 10px 46px' },
      el('span', { class: 'muted', id: 'learnTitle', text: session.title }),
    )
    trow.appendChild(el('button', { class: 'linkbtn', text: '📖 回看讲解', onclick: openReteach }))
    if (session.mode === 'day' && session.cards.length > 1)
      trow.appendChild(
        el('button', {
          class: 'linkbtn',
          text: '⏸ 先存着',
          title: '今天做到这，下次打开接着做',
          onclick: pauseDay,
        }),
      )
    v.appendChild(trow)
    v.appendChild(el('div', { id: 'cardHost' }))
    v.appendChild(el('div', { class: 'footbar', id: 'footHost' }))
    v.appendChild(
      el('div', {
        class: 'hintline',
        text: '快捷键：1-4 选答案 / Enter 继续。答错的卡会自动记进「错题本」，明天再练。',
      }),
    )
  }
  function openReteach() {
    var c = session && session.cards[session.idx]
    var id = session.dayId || (c && c.dayId)
    var d = DAYS.filter(function (x) {
      return x.id === id
    })[0]
    if (!d) return toast('这一关没有讲解')
    var box = el('div', { class: 'reteach' }),
      n = 0
    d.cards.forEach(function (k) {
      if (k.type !== 'concept' && k.type !== 'tool') return
      n++
      var item = el('div', { class: 'reteach-item' })
      if (k.type === 'tool') {
        item.appendChild(el('div', { class: 'qtitle', text: '🔧 ' + k.name }))
        if (k.oneLine) item.appendChild(el('div', { class: 'body', text: k.oneLine }))
        if (k.syntax) item.appendChild(codeEl(k.syntax, '语法'))
        if (k.returns) item.appendChild(el('div', { class: 'body', text: '返回：' + k.returns }))
        if (k.pitfalls && k.pitfalls.length)
          item.appendChild(el('div', { class: 'body', text: '⚠️ ' + k.pitfalls.join('；') }))
        if (k.tip) item.appendChild(el('div', { class: 'tip2', text: '💡 ' + k.tip }))
        box.appendChild(item)
        return
      }
      item.appendChild(el('div', { class: 'qtitle', text: k.title }))
      if (k.body) item.appendChild(el('div', { class: 'body', text: k.body }))
      if (k.code) item.appendChild(codeEl(k.code))
      if (k.out) item.appendChild(codeEl(k.out, '运行结果'))
      if (k.tip) item.appendChild(el('div', { class: 'tip2', text: '💡 ' + k.tip }))
      box.appendChild(item)
    })
    if (!n) box.appendChild(el('p', { class: 'muted', text: '这一关是纯练习，没有讲解卡。' }))
    modal('回看讲解 · ' + d.title, box, [{ label: '回去继续做题' }])
  }
  function updateHead() {
    var p = session.cards.length ? (session.idx / session.cards.length) * 100 : 0
    var f = $('#barFill')
    if (f) f.style.width = Math.min(100, p) + '%'
    var c = $('#comboChip')
    if (c) {
      c.textContent = 'COMBO ' + session.combo
      if (session.combo > 1) {
        c.classList.add('bump')
        setTimeout(function () {
          c.classList.remove('bump')
        }, 200)
      }
    }
  }
  function setFoot() {
    var f = $('#footHost')
    if (!f) return
    f.innerHTML = ''
    ;[].slice.call(arguments, 0).forEach(function (n) {
      if (n) f.appendChild(n)
    })
  }
  function showCard() {
    var host = $('#cardHost')
    if (!host) return
    host.innerHTML = ''
    if (session.idx >= session.cards.length) return finish()
    var c = session.cards[session.idx]
    session.resolved = false
    session.footNext = null
    host.appendChild(renderCard(c))
    updateHead()
  }
  function nextCard() {
    session.idx++
    showCard()
  }
  /* 判定一个小关卡是否结束 */ function resolve(ok, o) {
    o = o || {}
    var c = session.cards[session.idx]
    if (session.resolved) return
    session.resolved = true
    session.total++
    S.tries++
    if (ok) {
      session.correct++
      S.right++
      session.combo++
      session.maxCombo = Math.max(session.maxCombo, session.combo)
      session.xp += c.type === 'write' || c.type === 'order' || c.type === 'drill' ? 12 : 8
      if (session.combo > 1 && session.combo % 3 === 0) beep('win')
      else beep('ok')
    } else {
      session.combo = 0
      beep('bad')
      session.wrongs.push(c)
      /* 答错的卡补到本轮末尾再来一次 */ if (!c._again) {
        var cp = Object.assign({}, c, { _again: 1 })
        cp.key = c.key
        session.cards.push(cp)
      }
    }
    if (c.key && c.type !== 'concept') grade(c.key, ok && o.srsOk !== false)
    save()
    setFoot(
      el('button', {
        class: 'btn',
        text: session.idx + 1 >= session.cards.length ? '完成这一关 ✓' : '继续 →',
        onclick: nextCard,
      }),
    )
    session.footNext = nextCard
    /* 让「继续」按钮自动获得焦点，Enter 就能走 */ setTimeout(function () {
      var b = $('#footHost .btn')
      if (b) b.focus()
    }, 30)
  }
  /* ---------------- 卡片渲染 ---------------- */ function renderCard(c) {
    if (c.type === 'concept') return cardConcept(c)
    if (c.type === 'tool') return cardTool(c)
    if (c.type === 'drill') return cardDrill(c)

    if (c.type === 'quiz') return cardQuiz(c)
    if (c.type === 'fill') return cardFill(c)
    if (c.type === 'blank') return cardBlank(c)
    if (c.type === 'order') return cardOrder(c)
    if (c.type === 'write') return cardWrite(c)
    return cardConcept(c)
  }
  function fbNode(ok, head, why, ans) {
    var f = el('div', { class: 'feedback ' + (ok ? 'ok' : 'bad') })
    f.appendChild(el('div', { class: 'fb-head', text: head }))
    if (ans) f.appendChild(el('div', { class: 'ans', text: ans }))
    if (why) f.appendChild(el('div', { class: 'why', text: why }))
    return f
  }
  /* 1) 讲解卡 */ function cardConcept(c) {
    var w = el('div', { class: 'qcard card' })
    w.appendChild(
      el('span', { class: 'tag' + (c.tag === 'tip' ? ' t2' : ''), text: c.tag === 'tip' ? '划重点' : '讲一点' }),
    )
    w.appendChild(el('div', { class: 'qtitle', text: c.title }))
    w.appendChild(el('div', { class: 'body', text: c.body }))
    if (c.code) w.appendChild(codeEl(c.code))
    if (c.out) w.appendChild(codeEl(c.out, '运行结果'))
    if (c.tip) w.appendChild(fbNode(true, '💡 记住这句', c.tip))
    setFoot(
      el('button', {
        class: 'btn',
        text: '明白了 →',
        onclick: function () {
          if (c.key && c.type === 'concept') {
            /* 讲解卡不进 SRS */
          }
          nextCard()
        },
      }),
    )
    session.footNext = function () {
      nextCard()
    }
    return w
  }
  /* 1.5) 工具卡：一个方法/函数讲透 —— 语法 / 返回什么 / 什么时候用 / 例子 / 坑 */
  function cardTool(c) {
    var w = el('div', { class: 'qcard card toolcard' })
    w.appendChild(el('span', { class: 'tag t3', text: c.tag || '工具卡' }))
    w.appendChild(el('div', { class: 'qtitle', text: c.name }))
    if (c.oneLine) w.appendChild(el('div', { class: 'tool-one', text: c.oneLine }))
    if (c.syntax) w.appendChild(codeEl(c.syntax, '语法'))
    var rows = el('div', { class: 'tool-rows' })
    function row(k, v) {
      if (!v) return
      rows.appendChild(el('div', { class: 'trow2' }, el('b', { text: k }), el('span', { text: v })))
    }
    row('返回什么', c.returns)
    row('什么时候用', c.when)
    w.appendChild(rows)
    if (c.example) w.appendChild(codeEl(c.example, '例子'))
    if (c.out) w.appendChild(codeEl(c.out, '运行结果'))
    if (c.pitfalls && c.pitfalls.length) {
      w.appendChild(el('div', { class: 'pit-title', text: '⚠️ 会踩的坑' }))
      var ul = el('ul', { class: 'pitfalls' })
      c.pitfalls.forEach(function (p) {
        ul.appendChild(el('li', { text: p }))
      })
      w.appendChild(ul)
    }
    if (c.tip) w.appendChild(fbNode(true, '💡 记法', c.tip))
    setFoot(el('button', { class: 'btn', text: '记下了 →', onclick: nextCard }))
    session.footNext = nextCard
    return w
  }
  /* 1.6) 连问：同一个工具，三步由易到难，一张卡里走完 */
  function cardDrill(c) {
    var w = el('div', { class: 'qcard card drill' }),
      steps = c.steps || [],
      at = 0,
      bad = 0
    w.appendChild(el('span', { class: 'tag', text: c.tag || '连问' }))
    if (c.title) w.appendChild(el('div', { class: 'qtitle', text: c.title }))
    /* 这一组问题共用的数据：三问都基于它，每一问都显示，不用往上翻 */
    if (c.setup || c.code) {
      var setup = el('div', { class: 'drill-setup' })
      setup.appendChild(el('div', { class: 'drill-setup-h', text: '📌 这几问都基于下面这段数据' }))
      setup.appendChild(codeEl(c.setup || c.code, '数据'))
      w.appendChild(setup)
    }
    var head = el('div', { class: 'drill-head' }),
      body = el('div', { class: 'drill-body' })
    w.appendChild(head)
    w.appendChild(body)
    function step() {
      var s = steps[at]
      head.textContent = '第 ' + (at + 1) + ' / ' + steps.length + ' 问'
      body.innerHTML = ''
      body.appendChild(el('div', { class: 'drill-q', text: s.q }))
      if (s.code) body.appendChild(codeEl(s.code))
      var opts = el('div', { class: 'options' }),
        btns = [],
        done = false
      s.options.forEach(function (o, i) {
        var b = el(
          'button',
          { class: 'opt', type: 'button' },
          el('span', { class: 'key', text: String(i + 1) }),
          el('span', { class: 'txt', text: o }),
        )
        b.addEventListener('click', function () {
          pick(i)
        })
        btns.push(b)
        opts.appendChild(b)
      })
      body.appendChild(opts)
      function pick(i) {
        if (done) return
        done = true
        var ok = i === s.answer
        if (!ok) bad++
        btns.forEach(function (b, j) {
          b.disabled = true
          if (j === s.answer) b.classList.add('is-right')
          else if (j === i) b.classList.add('is-wrong')
          else b.classList.add('is-dim')
        })
        body.appendChild(
          fbNode(ok, ok ? '✅ 对了' : '❌ 正确答案是 ' + (s.answer + 1) + '.', s.explain, ok ? null : s.options[s.answer]),
        )
        var last = at + 1 >= steps.length
        setFoot(
          el('button', {
            class: 'btn',
            text: last ? '这一张完成 ✓' : '下一问 →',
            onclick: function () {
              if (last) return resolve(bad === 0)
              at++
              step()
            },
          }),
        )
        setTimeout(function () {
          var b = $('#footHost .btn')
          if (b) b.focus()
        }, 30)
      }
      pick.byIndex = function (n) {
        if (!done && n < s.options.length) pick(n)
      }
      cardKeyHandlers = pick.byIndex
      setFoot(el('span', { class: 'hintline', text: '点选项作答 · 键盘 1-4 也可以' }))
    }
    step()
    return w
  }
  /* 2) 选择题 */ function cardQuiz(c) {
    var w = el('div', { class: 'qcard card' })
    w.appendChild(el('span', { class: 'tag', text: c.tag || '选一个' }))
    w.appendChild(el('div', { class: 'qtitle', text: c.q }))
    if (c.code) w.appendChild(codeEl(c.code))
    var opts = el('div', { class: 'options' }),
      btns = []
    c.options.forEach(function (o, i) {
      var b = el(
        'button',
        { class: 'opt', type: 'button' },
        el('span', { class: 'key', text: String(i + 1) }),
        el('span', { class: 'txt', text: o }),
      )
      b.addEventListener('click', function () {
        pick(i)
      })
      btns.push(b)
      opts.appendChild(b)
    })
    w.appendChild(opts)
    var done = false
    function pick(i) {
      if (done) return
      done = true
      var ok = i === c.answer
      btns.forEach(function (b, j) {
        b.disabled = true
        if (j === c.answer) b.classList.add('is-right')
        else if (j === i) b.classList.add('is-wrong')
        else b.classList.add('is-dim')
      })
      w.appendChild(
        fbNode(
          ok,
          ok ? '✅ 答对了' : '❌ 不对，正确答案是 ' + (c.answer + 1) + '.',
          c.explain,
          ok ? null : c.options[c.answer],
        ),
      )
      resolve(ok)
    }
    pick.byIndex = function (n) {
      if (!done && n < c.options.length) pick(n)
    }
    cardKeyHandlers = pick.byIndex
    setFoot(el('span', { class: 'hintline', text: '点选项作答 · 键盘 1-4 也可以' }))
    return w
  }
  /* 3) 填空（打字） */ function cardFill(c) {
    var w = el('div', { class: 'qcard card' })
    w.appendChild(el('span', { class: 'tag', text: c.tag || '写出结果' }))
    w.appendChild(el('div', { class: 'qtitle', text: c.q }))
    if (c.code) w.appendChild(codeEl(c.code))
    var inp = el('input', {
      type: 'text',
      placeholder: c.ph || '在这里输入…',
      autocomplete: 'off',
      spellcheck: 'false',
    })
    var form = el('form', { class: 'inputline' }, inp, el('button', { class: 'btn sm', type: 'submit', text: '提交' }))
    w.appendChild(form)
    var done = false
    form.addEventListener('submit', function (ev) {
      ev.preventDefault()
      if (done) return
      var raw = inp.value,
        val = String(raw).replace(/\s+/g, ' ').trim()
      var ok = (c.accept || []).some(function (a) {
        return String(a).replace(/\s+/g, ' ').trim() === val
      })
      done = true
      inp.disabled = true
      w.appendChild(fbNode(ok, ok ? '✅ 对了' : '❌ 答案是：', c.explain, ok ? null : c.accept && c.accept[0]))
      resolve(ok)
    })
    setTimeout(function () {
      inp.focus()
    }, 40)
    setFoot(el('span', { class: 'hintline', text: '打不出来就写你猜的结果，错了会讲。' }))
    return w
  }
  /* 4) 填空（选词） */ function cardBlank(c) {
    var w = el('div', { class: 'qcard card' })
    w.appendChild(el('span', { class: 'tag', text: c.tag || '补全代码' }))
    w.appendChild(el('div', { class: 'qtitle', text: c.q }))
    var pre = el('pre', { class: 'code' })
    var parts = String(c.code).split(/_{3,}/)
    var gap = el('span', { class: 'gap', text: '?' })
    pre.appendChild(el('code', { html: hl(parts[0]) }))
    pre.appendChild(gap)
    if (parts[1] != null) pre.appendChild(el('code', { html: hl(parts[1]) }))
    w.appendChild(pre)
    var chips = el('div', { class: 'chips' }),
      done = false
    c.options.forEach(function (o, i) {
      var b = el('button', { class: 'chipbtn', type: 'button', text: o })
      b.addEventListener('click', function () {
        if (done) return
        done = true
        var ok = i === c.answer
        gap.textContent = o
        gap.className = 'gap ' + (ok ? 'hit' : 'miss')
        if (!ok) gap.textContent = o + '（应为 ' + c.options[c.answer] + '）'
        chips.querySelectorAll('.chipbtn').forEach(function (x) {
          x.disabled = true
        })
        w.appendChild(fbNode(ok, ok ? '✅ 补对了' : '❌ 这里该填 ' + c.options[c.answer], c.explain, null))
        resolve(ok)
      })
      chips.appendChild(b)
    })
    w.appendChild(chips)
    setFoot(el('span', { class: 'hintline', text: '点一个词填进空格。' }))
    return w
  }
  /* 5) 排代码顺序 */ function cardOrder(c) {
    var w = el('div', { class: 'qcard card' })
    w.appendChild(el('span', { class: 'tag t3', text: '排顺序' }))
    w.appendChild(el('div', { class: 'qtitle', text: c.q }))
    var correct = c.lines.slice()
    /* 稳定打乱：同一张卡每次顺序一致 */ var seed = 0
    ;(c.key || 'x').split('').forEach(function (ch) {
      seed = (seed * 31 + ch.charCodeAt(0)) % 9973
    })
    var pool = correct.map(function (t, i) {
      return { t: t, i: i }
    })
    for (var k = pool.length - 1; k > 0; k--) {
      seed = (seed * 1103515245 + 12345) % 2147483648
      var j = seed % (k + 1)
      var tmp = pool[k]
      pool[k] = pool[j]
      pool[j] = tmp
    }
    var poolBox = el('div', { class: 'orderbox pool' })
    var ansBox = el('div', { class: 'orderbox ans' })
    var picked = []
    w.appendChild(el('div', { class: 'slot-hint', text: '点下面任一行，加到上面的答案区；点答案区里的行可以撤掉。' }))
    w.appendChild(ansBox)
    w.appendChild(el('div', { class: 'slot-hint', text: '待选：' }))
    w.appendChild(poolBox)
    function renderPool() {
      poolBox.innerHTML = ''
      if (!pool.length) {
        poolBox.appendChild(el('div', { class: 'slot-hint', text: '（都放上去了）' }))
        return
      }
      pool.forEach(function (it) {
        poolBox.appendChild(
          el('button', {
            class: 'oline',
            type: 'button',
            text: it.t,
            onclick: function () {
              pick(it)
            },
          }),
        )
      })
    }
    function renderAns() {
      ansBox.innerHTML = ''
      if (!picked.length) {
        ansBox.appendChild(el('div', { class: 'slot-hint', text: '答案区（空的）' }))
        return
      }
      picked.forEach(function (it, idx) {
        ansBox.appendChild(
          el(
            'button',
            {
              class: 'oline',
              type: 'button',
              onclick: function () {
                if (done) return
                picked.splice(idx, 1)
                pool.push(it)
                renderAll()
              },
            },
            el('span', { class: 'n', text: idx + 1 + '.' }),
            el('span', { text: it.t }),
          ),
        )
      })
    }
    var done = false
    function renderAll() {
      renderPool()
      renderAns()
    }
    function pick(it) {
      if (done) return
      pool.splice(pool.indexOf(it), 1)
      picked.push(it)
      renderAll()
    }
    renderAll()
    var submit = el('button', {
      class: 'btn sm',
      text: '检查顺序',
      onclick: function () {
        if (done) return
        if (picked.length !== correct.length) return toast('先把所有行都放上去')
        done = true
        var ok = picked.every(function (it, i) {
          return it.i === i
        })
        ansBox.querySelectorAll('.oline').forEach(function (n) {
          n.disabled = true
        })
        var ans = correct
          .map(function (t, i) {
            return i + 1 + '. ' + t
          })
          .join('\n')
        w.appendChild(fbNode(ok, ok ? '✅ 顺序完全对' : '❌ 正确顺序是：', c.explain, ok ? null : ans))
        resolve(ok)
      },
    })
    setFoot(submit)
    return w
  }
  /* 6) 自己写代码 */ function cardWrite(c) {
    var w = el('div', { class: 'qcard card' })
    w.appendChild(el('span', { class: 'tag', text: c.tag || '动手写' }))
    w.appendChild(el('div', { class: 'qtitle', text: c.q }))
    if (c.hint) w.appendChild(el('div', { class: 'body', text: c.hint }))
    var ta = el('textarea', { placeholder: c.ph || '在这里写代码…（先自己想，卡住了再看答案）', spellcheck: 'false' })
    w.appendChild(ta)
    var done = false
    var btnRow = el('div', { class: 'selfgrade' })
    btnRow.appendChild(
      el('button', {
        class: 'btn ghost',
        text: '👀 看参考答案',
        onclick: function () {
          if (w.querySelector('.reveal')) return
          var box = el('div', { class: 'reveal' })
          box.appendChild(el('span', { class: 'lbl', text: '参考答案' }))
          box.appendChild(document.createTextNode(c.answer))
          if (c.explain) {
            var note = el('div', {
              class: 'why',
              style: 'margin-top:10px;font-family:system-ui;color:#b7d6c3',
              text: c.explain,
            })
            box.appendChild(note)
          }
          w.appendChild(box)
          if (c.out) w.appendChild(codeEl(c.out, '运行结果'))
          btns.style.display = 'grid'
        },
      }),
    )
    w.appendChild(btnRow)
    var btns = el('div', { class: 'selfgrade', style: 'display:none' })
    function self(ok, srsOk, label) {
      if (done) return
      done = true
      btns.style.display = 'none'
      var head = ok ? '✅ 记下来了' : '📌 这题进错题本了'
      w.appendChild(fbNode(ok, head, label || null, null))
      resolve(ok, { srsOk: srsOk })
    }
    btns.appendChild(
      el('button', {
        class: 'btn',
        text: '我自己写对了',
        onclick: function () {
          self(true, true, '好，下一张。')
        },
      }),
    )
    btns.appendChild(
      el('button', {
        class: 'btn ghost',
        text: '差不多，但要再练',
        onclick: function () {
          self(true, false, '算你过，但明天复习会再考一次。')
        },
      }),
    )
    btns.appendChild(
      el('button', {
        class: 'btn dark',
        text: '没写出来',
        onclick: function () {
          self(false, false, '没关系，抄一遍答案再继续。')
        },
      }),
    )
    btnRow.appendChild(btns)
    setFoot(el('span', { class: 'hintline', text: '这张不算自动判分 —— 自己诚实打钩，系统按你的分数安排复习。' }))
    return w
  }
  /* ---------------- 结算 ---------------- */ function finish() {
    var acc = session.total ? session.correct / session.total : 1
    var bonus = 20 + (acc === 1 ? 30 : 0)
    session.xp += bonus
    S.xp += session.xp
    S.done += session.total
    S.tries += 0
    if (session.mode === 'day') S.days[session.dayId] = { done: true, rate: Math.round(acc * 100), at: Date.now() }
    if (session.mode === 'day' && S.part && S.part.dayId === session.dayId) S.part = null
    var tk = dk()
    if (S.lastStudy !== tk) {
      var y = dk(new Date(Date.now() - DM))
      S.streak = S.lastStudy === y ? S.streak + 1 : 1
      S.lastStudy = tk
      S.best = Math.max(S.best || 0, S.streak)
    }
    var h = S.history[tk] || { cards: 0, correct: 0, xp: 0, days: 0 }
    h.cards += session.total
    h.correct += session.correct
    h.xp += session.xp
    if (session.mode === 'day') h.days += 1
    S.history[tk] = h
    save()
    beep('win')
    renderResult(acc)
  }
  function renderResult(acc) {
    var v = $('#view-result')
    v.innerHTML = ''
    var secs = Math.max(1, Math.round((Date.now() - session.t0) / 1000))
    var mins = Math.floor(secs / 60),
      s2 = secs % 60
    var pct = Math.round(acc * 100)
    var card = el('div', { class: 'card' })
    var top = el('div', { class: 'result-top' })
    top.appendChild(
      el('h2', {
        text: acc === 1 ? '完美通关！' : acc >= 0.8 ? '这关过了' : '过关了，但错得不少',
        style: 'margin:0 0 2px;font-size:19px',
      }),
    )
    top.appendChild(
      el('p', { class: 'muted', text: session.title + ' · 用时 ' + (mins ? mins + ' 分 ' : '') + s2 + ' 秒' }),
    )
    var ring = el(
      'div',
      { class: 'ring', style: '--p:' + pct + '%' },
      el('b', null, String(pct), el('small', { text: '分' })),
    )
    top.appendChild(ring)
    card.appendChild(top)
    card.appendChild(
      el(
        'div',
        { class: 'rstats' },
        stat('+' + session.xp, '经验值'),
        stat(String(session.maxCombo), '最高连击'),
        stat(String(session.wrongs.length), '要复习的卡'),
      ),
    )
    card.appendChild(
      el('div', {
        class: 'muted',
        text:
          '🔥 连续打卡 ' +
          liveStreak() +
          ' 天' +
          (S.best > liveStreak() ? '（最长 ' + S.best + ' 天）' : '') +
          ' · 累计答过 ' +
          S.done +
          ' 张卡',
      }),
    )
    v.appendChild(card)
    if (session.wrongs.length) {
      var wc = el('div', { class: 'card' })
      wc.appendChild(el('h3', { text: '📕 今天错的 ' + session.wrongs.length + ' 张，已经收进错题本' }))
      var list = el('div', { class: 'wronglist' })
      var seen = {}
      session.wrongs.forEach(function (c) {
        if (seen[c.key]) return
        seen[c.key] = 1
        var it = el('div', { class: 'wrongitem' })
        it.appendChild(el('div', { class: 'q', text: c.q || c.title || '（讲解卡）' }))
        var ans =
          c.answer != null && typeof c.answer === 'number' && c.options
            ? c.options[c.answer]
            : c.accept
              ? c.accept[0]
              : c.type === 'write'
                ? '见参考答案'
                : typeof c.answer === 'string'
                  ? c.answer.split('\n')[0]
                  : ''
        if (ans) it.appendChild(el('div', { class: 'a', text: String(ans) }))
        list.appendChild(it)
      })
      wc.appendChild(list)
      v.appendChild(wc)
    }
    var nd = nextDay()
    var f = el('div', { class: 'footbar', style: 'flex-wrap:wrap' })
    if (nd)
      f.appendChild(
        el('button', {
          class: 'btn',
          text: '下一关：第 ' + nd.id + ' 关 →',
          onclick: function () {
            startDay(nd.id)
          },
        }),
      )
    f.appendChild(el('button', { class: 'btn ghost', text: '回首页', onclick: renderHome }))
    f.appendChild(el('button', { class: 'btn dark', text: '看看课程地图', onclick: renderMap }))
    v.appendChild(f)
    showView('result')
    hud()
  }
  /* ---------------- 课程地图 ---------------- */ function renderMap() {
    var v = $('#view-map')
    v.innerHTML = ''
    var head = el(
      'div',
      { class: 'between' },
      el('h2', { text: '课程地图', style: 'margin:0;font-size:19px' }),
      el('button', { class: 'btn dark sm', text: '← 回首页', onclick: renderHome }),
    )
    v.appendChild(head)
    v.appendChild(
      el('div', {
        class: 'muted',
        style: 'margin:6px 0 4px',
        text: '5 周 · ' + MAIN + ' 关 · 顺序刷最省力。灰色的关也能点开提前看。',
      }),
    )
    var nd = nextDay()
    var weeks = {}
    DAYS.forEach(function (d) {
      ;(weeks[d.week] = weeks[d.week] || []).push(d)
    })
    Object.keys(weeks)
      .sort(function (a, b) {
        return a - b
      })
      .forEach(function (wk) {
        var list = weeks[wk]
        var box = el('div', { class: 'card week' })
        box.appendChild(
          el(
            'h4',
            null,
            '第 ' + wk + ' 周',
            el('span', { text: list[0].theme || '' }),
            el('span', {
              text:
                '· 已完成 ' +
                list.filter(function (d) {
                  return S.days[d.id]
                }).length +
                '/' +
                list.length,
            }),
          ),
        )
        var grid = el('div', { class: 'days' })
        list.forEach(function (d) {
          var st = d.extra ? 'extra' : S.days[d.id] ? 'done' : nd && d.id === nd.id ? 'today' : 'locked'
          var b = el(
            'button',
            { class: 'dcard ' + st },
            el('b', { text: d.extra ? '补' : 'D' + d.id }),
            el('small', { text: d.extra ? d.title.replace(/^补课：/, '') : d.title }),
          )
          b.addEventListener('click', function () {
            if (S.days[d.id] || d.extra) {
              startDay(d.id)
              return
            }
            if (st === 'locked' && !confirm('还没到第 ' + d.id + ' 关，跳着刷会乱节奏。真要现在学吗？')) return
            startDay(d.id)
          })
          grid.appendChild(b)
        })
        box.appendChild(grid)
        v.appendChild(box)
      })
    showView('map')
    hud()
  }
  /* ---------------- 错题本 ---------------- */ function renderWrong() {
    var v = $('#view-wrong')
    v.innerHTML = ''
    var list = wrongList()
    v.appendChild(
      el(
        'div',
        { class: 'between' },
        el('h2', { text: '错题本', style: 'margin:0;font-size:19px' }),
        el('button', { class: 'btn dark sm', text: '← 回首页', onclick: renderHome }),
      ),
    )
    v.appendChild(
      el('div', {
        class: 'muted',
        style: 'margin:6px 0 10px',
        text: '答错过的卡都在这里，按错误次数排序。练对了会自动毕业。',
      }),
    )
    if (!list.length) {
      v.appendChild(
        el(
          'div',
          { class: 'card empty' },
          el('b', { text: '🎉' }),
          '错题本是空的。',
          el('div', { text: '去刷几关，错了的会自己跑进来。' }),
        ),
      )
      showView('wrong')
      return
    }
    var top = el('div', { class: 'footbar', style: 'justify-content:flex-start;margin:0 0 4px' })
    top.appendChild(
      el('button', {
        class: 'btn sm',
        text: '练这一批（' + Math.min(list.length, 8) + ' 张）',
        onclick: function () {
          var pick = list.slice(0, 8)
          session = {
            mode: 'review',
            dayId: null,
            title: '错题重练 · ' + pick.length + ' 张',
            cards: pick.map(function (it) {
              return Object.assign({}, it.card, { key: it.key, dayId: it.dayId })
            }),
            idx: 0,
            correct: 0,
            total: 0,
            combo: 0,
            maxCombo: 0,
            xp: 0,
            wrongs: [],
            t0: Date.now(),
            resolved: false,
            footNext: null,
          }
          showView('learn')
          buildLearn()
          showCard()
        },
      }),
    )
    top.appendChild(
      el('button', {
        class: 'btn dark sm',
        text: '清空错题本',
        onclick: function () {
          modal('清空错题本？', el('p', { text: '会清掉所有「错了几次」的记录，复习计划也会跟着重排。' }), [
            { label: '算了', cls: 'dark' },
            {
              label: '确定清空',
              cls: '',
              fn: function () {
                Object.keys(S.srs).forEach(function (k) {
                  S.srs[k].w = 0
                })
                save()
                renderWrong()
              },
            },
          ])
        },
      }),
    )
    v.appendChild(top)
    list.forEach(function (it) {
      var c = it.card,
        d = DAYS.filter(function (x) {
          return x.id === it.dayId
        })[0]
      var box = el('div', { class: 'wnote' })
      box.appendChild(el('div', { class: 'q', text: c.q || c.title }))
      if (c.code) box.appendChild(codeEl(c.code))
      var why = c.explain || ''
      if (!why && c.accept) why = '参考答案：' + c.accept[0]
      if (!why && c.options && typeof c.answer === 'number') why = '正确答案：' + c.options[c.answer]
      if (why) box.appendChild(el('div', { class: 'why', style: 'margin-top:8px', text: why }))
      var meta = el('div', { class: 'meta' })
      meta.appendChild(el('span', { class: 'pill', text: '错 ' + (it.r.w || 0) + ' 次' }))
      meta.appendChild(el('span', { class: 'pill', text: '第 ' + it.dayId + ' 关' }))
      meta.appendChild(
        el('span', { class: 'pill', text: '下次复习：' + new Date(it.r.due).toLocaleDateString('zh-CN') }),
      )
      box.appendChild(meta)
      v.appendChild(box)
    })
    showView('wrong')
    hud()
  }
  /* ---------------- 设置 ---------------- */ function openSettings() {
    var b = $('#modalBody')
    b.innerHTML = ''
    b.appendChild(el('h3', { text: '设置 / 存档' }))
    var sw = el('button', { class: 'switch' + (S.mute ? '' : ' on'), title: '音效' })
    sw.addEventListener('click', function () {
      S.mute = !S.mute
      sw.classList.toggle('on', !S.mute)
      save()
    })
    var lab = el('label', null, el('span', { text: '答对答错的音效' }), sw)
    b.appendChild(lab)
    b.appendChild(
      el('div', {
        class: 'muted',
        style: 'margin-top:12px',
        text: '进度保存在这台电脑的浏览器里（换浏览器或清缓存就会丢）。想搬走或备份就导出存档。',
      }),
    )
    var row = el('div', { class: 'mrow' })
    row.appendChild(el('button', { class: 'btn dark sm', text: '导出存档', onclick: exportSave }))
    row.appendChild(el('button', { class: 'btn dark sm', text: '导入存档', onclick: importSave }))
    row.appendChild(el('button', { class: 'btn sm', text: '关闭', onclick: closeModal }))
    b.appendChild(row)
    var row2 = el('div', { class: 'mrow' })
    row2.appendChild(
      el('button', {
        class: 'btn dark sm',
        text: '重置全部进度',
        onclick: function () {
          if (!confirm('会清掉所有进度、错题和打卡记录，确定？')) return
          S = blank()
          save()
          closeModal()
          renderHome()
          toast('已重置')
        },
      }),
    )
    b.appendChild(row2)
    b.appendChild(
      el('div', { class: 'muted', style: 'margin-top:14px;font-size:12px', text: '共 ' + MAIN + ' 关 · 进度 v' + S.v }),
    )
    $('#modal').classList.remove('hidden')
  }
  function exportSave() {
    try {
      var blob = new Blob([JSON.stringify(S, null, 2)], { type: 'application/json' })
      var a = document.createElement('a')
      a.href = URL.createObjectURL(blob)
      a.download = 'python-daily-存档-' + dk() + '.json'
      document.body.appendChild(a)
      a.click()
      document.body.removeChild(a)
      toast('存档已下载')
    } catch (e) {
      toast('导出失败：' + e.message)
    }
  }
  function importSave() {
    var inp = el('input', { type: 'file', accept: '.json', style: 'display:none' })
    document.body.appendChild(inp)
    inp.addEventListener('change', function () {
      var f = inp.files[0]
      if (!f) return
      var fr = new FileReader()
      fr.onload = function () {
        try {
          var o = JSON.parse(fr.result)
          if (typeof o.xp !== 'number' || !o.days) throw new Error('文件不像存档')
          S = Object.assign(blank(), o)
          save()
          closeModal()
          renderHome()
          toast('存档已导入')
        } catch (e) {
          toast('导入失败：' + e.message)
        }
      }
      fr.readAsText(f)
    })
    inp.click()
  }
  /* ---------------- 键盘 ---------------- */ var cardKeyHandlers = null
  document.addEventListener('keydown', function (ev) {
    if ($('#modal').classList.contains('hidden') === false) {
      if (ev.key === 'Escape') closeModal()
      return
    }
    if (!$('#view-learn').classList.contains('on')) return
    var tag = (document.activeElement || {}).tagName
    if (tag === 'INPUT' || tag === 'TEXTAREA') {
      if (ev.key === 'Escape') document.activeElement.blur()
      return
    }
    if (session && session.resolved) {
      if (ev.key === 'Enter' || ev.key === ' ' || ev.key === 'ArrowRight') {
        ev.preventDefault()
        if (session.footNext) session.footNext()
      }
      return
    }
    if (/^[1-9]$/.test(ev.key) && typeof cardKeyHandlers === 'function') {
      cardKeyHandlers(Number(ev.key) - 1)
    }
  })
  /* ---------------- 启动 ---------------- */ function boot() {
    $('#logoSlot').innerHTML = MASCOT
    if (!DAYS.length) {
      $('#view-home').appendChild(
        el(
          'div',
          { class: 'card' },
          el('h3', { text: '课程数据没加载到' }),
          el('p', { class: 'muted', text: '确认 data 文件夹里的 w1.js…w5.js 和 index.html 在一起。' }),
        ),
      )
      showView('home')
      return
    }
    $('#modal').addEventListener('click', function (e) {
      if (e.target.id === 'modal') closeModal()
    })
    renderHome()
  }
  if (document.readyState === 'loading') document.addEventListener('DOMContentLoaded', boot)
  else boot()
})()
