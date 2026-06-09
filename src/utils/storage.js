/* ═══════════════════════════════════════════
   CORE HELPERS
═══════════════════════════════════════════ */
export function getToday() {
  const d = new Date()
  return `${d.getFullYear()}-${String(d.getMonth()+1).padStart(2,'0')}-${String(d.getDate()).padStart(2,'0')}`
}

export function formatDate(dateStr) {
  const d = new Date(dateStr + 'T00:00:00')
  const days = ['日','月','火','水','木','金','土']
  return `${d.getFullYear()}年${d.getMonth()+1}月${d.getDate()}日（${days[d.getDay()]}）`
}

export function load(key) {
  try { const r = localStorage.getItem(key); return r ? JSON.parse(r) : null } catch { return null }
}
export function save(key, val) {
  try { localStorage.setItem(key, JSON.stringify(val)) } catch(e) { console.error(e) }
}

/* ═══════════════════════════════════════════
   SETTINGS & THEME
═══════════════════════════════════════════ */
const DEFAULT_SETTINGS = { theme: 'cream-street', onboarded: false }

export function getSettings() { return { ...DEFAULT_SETTINGS, ...(load('settings') || {}) } }
export function saveSettings(s) { save('settings', s) }

export function getTheme() { return getSettings().theme }
export function saveTheme(t) { saveSettings({ ...getSettings(), theme: t }) }

/* ═══════════════════════════════════════════
   ATTITUDE OPTIONS
═══════════════════════════════════════════ */
export const DEFAULT_ATTITUDES = [
  '余裕のある男', '明るく場を作る', '人をよく見る', '目の前の人をちゃんと見る',
  '優しく強くいる', '嫌われる勇気を持って優しくする', '自分の機嫌を自分で取る',
  '感情をちゃんと出す', '楽しむ時はちゃんと楽しむ', '笑う時はちゃんと笑う',
  '悲しい時はちゃんと受け止める', '驚きを隠さない', 'この場を1%良くする',
  '価値は渡すだけ', '見返りを求めない', '人の可能性を引き出す',
  '話に入れていない人を拾う', 'いじりが強くなったら自然に止める',
  '誰かの良いところを話題に出す', '目的がズレたら戻す', '場の温度を上げる',
  '相手の背景を見る', '性格ではなく構造で見る', '相手の頑張っていることを見る',
  '人が意識していることを褒める', 'かっこよさは余裕から出す', '優しさと強さを両立する',
  '自分の世界を持つ', '自分の人生を前に進める', '今日も誰かを少し前向きにする',
  '一緒にいる人の自己肯定感を上げる', '自分から空気を変える', '人を安心させる',
  '静かな自信を持つ', '主人公感を持って過ごす', 'でも偉そうにはしない',
  '言葉より行動で示す', '小さい約束を守る', '雑に扱わない', 'ちゃんと目を見る',
  '相手の話を最後まで聞く', 'まず受け止める', '今日も少し良い男になる',
]
export const RARE_ATTITUDES = [
  '今日は主人公の日', '場を変える男', '人の可能性を引き出す日',
  '優しさと強さを両立する日', '空気を支配せず、空気を良くする日',
  '静かなカリスマを出す日', 'なぜかついていきたくなる日',
  '余裕で勝つ日', '誰かの人生を1%良くする日',
]

export function getAttitudeOptions() { return load('attitudeOptions') || DEFAULT_ATTITUDES }
export function saveAttitudeOptions(list) { save('attitudeOptions', list) }

/* ═══════════════════════════════════════════
   QUOTES
═══════════════════════════════════════════ */
export const DEFAULT_QUOTES = [
  { id:1, text:'失敗しなくちゃ、成功はしない。', author:'ココ・シャネル', fav:false },
  { id:2, text:'夢を見るから、人生は輝く。', author:'モーツァルト', fav:false },
  { id:3, text:'準備しておこう。チャンスはいつか訪れる。', author:'リンカーン', fav:false },
  { id:4, text:'できると思えばできる、できないと思えばできない。', author:'ヘンリー・フォード', fav:false },
  { id:5, text:'小さいことを重ねることが、とんでもないところに行くただ一つの道。', author:'イチロー', fav:false },
  { id:6, text:'今日の自分が、明日の雰囲気を作る。', author:'名言風', fav:false },
  { id:7, text:'価値は渡すだけ。返ってくるかは相手の自由。', author:'名言風', fav:false },
  { id:8, text:'この場を1%良くする人は、どこに行っても必要とされる。', author:'名言風', fav:false },
  { id:9, text:'かっこよさは、余裕と優しさから出る。', author:'名言風', fav:false },
  { id:10, text:'努力する人は希望を語り、怠ける人は不満を語る。', author:'井上靖', fav:false },
  { id:11, text:'行動した人だけが、雰囲気を持っている。', author:'名言風', fav:false },
  { id:12, text:'今日出会う人は、みんな何かを背負っている。だから優しくできる。', author:'名言風', fav:false },
  { id:13, text:'自分を整えた分だけ、人に与えられる。', author:'名言風', fav:false },
  { id:14, text:'感情をちゃんと出す人は、人の心を動かす。', author:'名言風', fav:false },
]

export function getQuotes() { return load('quoteOptions') || DEFAULT_QUOTES }
export function saveQuotes(list) { save('quoteOptions', list) }

export function getDailyQuote() {
  const quotes = getQuotes()
  if (!quotes.length) return DEFAULT_QUOTES[0]
  const idx = Math.floor((Date.now() / 86400000)) % quotes.length
  return quotes[idx]
}

/* ═══════════════════════════════════════════
   CHECKLIST TEMPLATES
═══════════════════════════════════════════ */
export const DEFAULT_CHECKLISTS = {
  morning: [
    { key:'water',      label:'水を飲んだ' },
    { key:'wash',       label:'洗顔した' },
    { key:'moisturize', label:'保湿した' },
    { key:'sunscreen',  label:'日焼け止めを塗った' },
    { key:'hair',       label:'髪を整えた' },
    { key:'eyebrow',    label:'眉毛を整えた' },
    { key:'outfit',     label:'服装を確認した' },
    { key:'stretch',    label:'姿勢改善ストレッチをした' },
    { key:'workout',    label:'軽い筋トレをした' },
    { key:'arikataCk',  label:'今日の在り方を確認した' },
  ],
  afternoon: [
    { key:'greet',     label:'目を見て挨拶した' },
    { key:'name',      label:'名前を呼んだ' },
    { key:'impression',label:'会った瞬間の印象を取った' },
    { key:'praise',    label:'1人以上を具体的に褒めた' },
    { key:'summarize', label:'相手の話を要約した' },
    { key:'include',   label:'話に入れていない人を拾った' },
    { key:'improve',   label:'場を1%良くする行動をした' },
    { key:'stopBully', label:'いじりが強い時に自然に止めた' },
    { key:'emotion',   label:'感情を豊かに出した' },
    { key:'selfMood',  label:'自分の機嫌を自分で取った' },
    { key:'noReturn',  label:'価値提供に見返りを求めなかった' },
  ],
}

export function getChecklistTemplate(cat) {
  const all = load('checklistTemplates') || {}
  return all[cat] || DEFAULT_CHECKLISTS[cat] || []
}
export function saveChecklistTemplate(cat, items) {
  const all = load('checklistTemplates') || {}
  all[cat] = items
  save('checklistTemplates', all)
}

/* ═══════════════════════════════════════════
   DAILY RECORDS
═══════════════════════════════════════════ */
export function createEmptyDayRecord(date) {
  const mChecks = {}
  getChecklistTemplate('morning').forEach(c => { mChecks[c.key] = false })
  const aChecks = {}
  getChecklistTemplate('afternoon').forEach(c => { aChecks[c.key] = false })
  return {
    date, createdAt: Date.now(), updatedAt: Date.now(), mood: null,
    morning: {
      arikata: '', wordTheme: '', rule: '',
      checks: mChecks,
      valuePeople: [
        { name:'', valueType:'', action:'', done:false },
        { name:'', valueType:'', action:'', done:false },
        { name:'', valueType:'', action:'', done:false },
      ],
    },
    afternoon: {
      checks: aChecks,
      praised:'', improvedScene:'', noticedbg:'', weakPerson:'', selfCare:'',
    },
    evening: {
      arikataResult:'', goodInteraction:'', eyeContact:'', praised:'',
      improvedScene:'', roughAction:'', emotionBreak:'', emotionBg:'',
      bgView:'', tomorrowImprove:'', satisfaction:3, diary:'',
    },
    investment: {
      theme:'TOEIC', toeicSub:'', plan:'', done:'', focus:3,
      learned:'', tomorrow:'', timerSeconds:0, timerDone:false,
    },
  }
}

export function getTodayRecord() {
  const today = getToday()
  const records = load('dailyRecords') || {}
  if (!records[today]) {
    records[today] = createEmptyDayRecord(today)
    save('dailyRecords', records)
  }
  return records[today]
}

export function updateTodayRecord(partial) {
  const today = getToday()
  const records = load('dailyRecords') || {}
  if (!records[today]) records[today] = createEmptyDayRecord(today)
  records[today] = { ...records[today], ...partial, updatedAt: Date.now() }
  save('dailyRecords', records)
  return records[today]
}

export function getAllRecords() { return load('dailyRecords') || {} }

/* ═══════════════════════════════════════════
   TODOS
═══════════════════════════════════════════ */
export function getTodos() { return load('todos') || [] }
export function saveTodos(list) { save('todos', list) }

export function addTodo(text, opts = {}) {
  const list = getTodos()
  const item = { id: Date.now(), text, priority: 'mid', category: 'その他', deadline: '', memo: '', done: false, todayFlag: true, ...opts }
  saveTodos([item, ...list])
  return item
}

/* ═══════════════════════════════════════════
   SUMMARIES
═══════════════════════════════════════════ */
export function getSummaries() { return load('summaries') || [] }
export function saveSummary(item) {
  const list = getSummaries()
  if (item.id) {
    const idx = list.findIndex(s => s.id === item.id)
    if (idx >= 0) list[idx] = item; else list.unshift(item)
  } else list.unshift({ ...item, id: Date.now(), date: getToday() })
  save('summaries', list)
}
export function deleteSummary(id) { save('summaries', getSummaries().filter(s => s.id !== id)) }

/* ═══════════════════════════════════════════
   FUNNY STORIES
═══════════════════════════════════════════ */
export function getFunnyStories() { return load('funnyStories') || [] }
export function saveFunnyStory(item) {
  const list = getFunnyStories()
  if (item.id) {
    const idx = list.findIndex(s => s.id === item.id)
    if (idx >= 0) list[idx] = item; else list.unshift(item)
  } else list.unshift({ ...item, id: Date.now(), date: getToday() })
  save('funnyStories', list)
}

/* ═══════════════════════════════════════════
   CHALLENGES
═══════════════════════════════════════════ */
export function getWeeklyChallenges() { return load('weeklyChallenges') || [] }
export function saveWeeklyChallenge(item) {
  const list = getWeeklyChallenges()
  if (item.id) { const i = list.findIndex(s => s.id === item.id); if (i >= 0) list[i] = item; else list.unshift(item) }
  else list.unshift({ ...item, id: Date.now() })
  save('weeklyChallenges', list)
}
export function getMonthlyChallenges() { return load('monthlyChallenges') || [] }
export function saveMonthlyChallenge(item) {
  const list = getMonthlyChallenges()
  if (item.id) { const i = list.findIndex(s => s.id === item.id); if (i >= 0) list[i] = item; else list.unshift(item) }
  else list.unshift({ ...item, id: Date.now() })
  save('monthlyChallenges', list)
}

/* ═══════════════════════════════════════════
   LOG IDEAS (editable)
═══════════════════════════════════════════ */
export const DEFAULT_WEEKLY_IDEAS = [
  '友達を誘ってご飯を企画する', '勉強会を作る', '後輩や友達の相談に乗る',
  '旅行や遊びを企画する', 'SNSで学びを発信する', '先輩・社会人に会う',
]
export const DEFAULT_MONTHLY_IDEAS = [
  '一人旅', '高めの店で食事', '美術館', '映画館', '初対面の場に行く',
  '社会人に会う', 'プレゼンする', '服を研究して買う', '新しい場所に行く',
]

export function getLogIdeas(key, defaults) { return load(`logIdeas_${key}`) || defaults }
export function saveLogIdeas(key, list) { save(`logIdeas_${key}`, list) }

/* ═══════════════════════════════════════════
   WORD THEME OPTIONS
═══════════════════════════════════════════ */
export const DEFAULT_WORD_THEMES = [
  '名前を呼ぶ', '目を見て話す', '否定から入らない', '最後まで聞く', 'まず受け止める',
  '相手の話を要約する', '「つまりこういうこと？」を使う', '「どういう気持ちだった？」を聞く',
  '具体的に褒める', '頑張っている部分を褒める', '変化に気づいて伝える', '感謝を言葉にする',
  '場を明るくする一言を言う', '相手が話しやすい質問をする', '話に入れていない人に振る',
  'いじりを優しく止める', '自分の感情をちゃんと出す', '面白い例えを1つ使う',
  '今日あった出来事を面白く話す', '余裕のある返しをする', '相手を下げる笑いをしない',
  '場の目的を整理する', '「一回整理すると」を使う', 'ありがとうを雑に言わない',
  '相手の背景を想像して話す', '自分の話を短く、相手の話を深く', '少し背中を押す',
]
export function getWordThemeOptions() { return load('wordThemeOptions') || DEFAULT_WORD_THEMES }
export function saveWordThemeOptions(list) { save('wordThemeOptions', list) }

/* ═══════════════════════════════════════════
   MUST KEEP OPTIONS
═══════════════════════════════════════════ */
export const DEFAULT_MUST_KEEPS = [
  '不機嫌を人に出さない', '遅刻しない', '返信を放置しない', '人の話を遮らない',
  '目を見て挨拶する', '1人は具体的に褒める', '1人は話に入れてあげる',
  '価値提供に見返りを求めない', '陰口で盛り上がらない', '雑ないじりをしない',
  'きついいじりを自然に止める', '約束を守る', 'やると言ったことをやる',
  '今日のToDoを1つ終わらせる', 'TOEICを90分やる', 'ストレッチだけはやる',
  'スキンケアを飛ばさない', '姿勢を意識する', 'スマホを見すぎない',
  '言い訳から入らない', '自分を大きく見せようとしない', '感謝を1回は伝える',
  '相手の変化に気づく', '場を1%良くする', '今日の出来事を1つ面白く話す',
  'アニメ・映画・YouTubeの要約をする', '夜に振り返りを書く',
  '自分の機嫌を自分で取る', '迷ったら優しい方を選ぶ', 'でも自分を犠牲にしすぎない',
]
export function getMustKeepOptions() { return load('mustKeepOptions') || DEFAULT_MUST_KEEPS }
export function saveMustKeepOptions(list) { save('mustKeepOptions', list) }

/* ═══════════════════════════════════════════
   FAVORITES
═══════════════════════════════════════════ */
export function getFavorites(key) { return load(key) || [] }
export function saveFavorites(key, list) { save(key, list) }

/* ═══════════════════════════════════════════
   STREAK & PROGRESS
═══════════════════════════════════════════ */
export function getStreak() {
  const records = getAllRecords()
  const dates = Object.keys(records).sort().reverse()
  if (!dates.length) return 0
  let streak = 0
  const now = new Date(); now.setHours(0,0,0,0)
  for (let i = 0; i < dates.length; i++) {
    const d = new Date(dates[i] + 'T00:00:00'); d.setHours(0,0,0,0)
    if (Math.round((now - d) / 86400000) === i) streak++
    else break
  }
  return streak
}

export function calcDayProgress(record) {
  if (!record) return 0
  let total = 0, done = 0
  const mc = Object.values(record.morning?.checks || {})
  total += mc.length; done += mc.filter(Boolean).length
  const ac = Object.values(record.afternoon?.checks || {})
  total += ac.length; done += ac.filter(Boolean).length
  const vp = record.morning?.valuePeople || []
  total += vp.length; done += vp.filter(p => p.done).length
  if (record.evening?.diary) done++; total++
  if (record.investment?.timerDone) done++; total++
  return total === 0 ? 0 : Math.round((done / total) * 100)
}

/* ═══════════════════════════════════════════
   SAMPLE DATA (first launch only)
═══════════════════════════════════════════ */
export function initSampleData() {
  if (load('dailyRecords')) return
  const today = getToday()
  const yd = new Date(); yd.setDate(yd.getDate() - 1)
  const ydStr = `${yd.getFullYear()}-${String(yd.getMonth()+1).padStart(2,'0')}-${String(yd.getDate()).padStart(2,'0')}`
  const records = {
    [ydStr]: { ...createEmptyDayRecord(ydStr),
      mood:'😌',
      morning: {
        arikata:'余裕のある男', wordTheme:'名前を呼ぶ', rule:'不機嫌を出さない',
        checks:{ water:true,wash:true,moisturize:true,sunscreen:true,hair:true,eyebrow:true,outfit:true,stretch:false,workout:false,arikataCk:true },
        valuePeople:[
          { name:'田中くん', valueType:'褒める', action:'プレゼン構成が分かりやすいと伝えた', done:true },
          { name:'佐藤さん', valueType:'聞く',   action:'就活の不安を全部聞いた', done:true },
          { name:'山田先輩', valueType:'感謝する',action:'先日の助けへのお礼を伝えた', done:true },
        ],
      },
      afternoon: {
        checks:{ greet:true,name:true,impression:true,praise:true,summarize:true,include:false,improve:true,stopBully:false,emotion:true,selfMood:true,noReturn:true },
        praised:'田中くんのプレゼン構成を褒めた', improvedScene:'ランチで話題が途切れた時に明るい話を振った',
        noticedbg:'佐藤さんが最近元気なさそうだった', weakPerson:'会話に入れてない後輩に話しかけた', selfCare:'深呼吸して気分を整えた',
      },
      evening: { arikataResult:'ほぼできた', goodInteraction:'佐藤さんの話をじっくり聞けた', eyeContact:'田中くんと話す時ちゃんと目を見れた', praised:'田中くんに具体的な褒め言葉を言えた', improvedScene:'ランチの空気を明るくした', roughAction:'少し急いでいて雑な返事をした', emotionBreak:'グループ課題でイライラしかけた', emotionBg:'自分の意見が通らなくて焦った', bgView:'相手も最善を尽くしていた', tomorrowImprove:'グループ内で率先して意見をまとめる', satisfaction:4, diary:'今日は3人に価値を渡せた。少しずつ「余裕のある男」に近づいてる気がする。' },
      investment:{ theme:'TOEIC', toeicSub:'Part3', plan:'Part3の問題を15問解く', done:'20問解いた。先読みのコツが掴めてきた', focus:4, learned:'先読みで設問の意図を把握してから聞くと正答率が上がる', tomorrow:'Part4を同じ方法で練習する', timerSeconds:5400, timerDone:true },
    },
    [today]: createEmptyDayRecord(today),
  }
  save('dailyRecords', records)
  save('todos', [
    { id:1, text:'TOEIC模試を申し込む', priority:'high', category:'TOEIC', deadline:'', memo:'', done:false, todayFlag:true },
    { id:2, text:'卒論の構成を考える',  priority:'high', category:'大学', deadline:'', memo:'', done:false, todayFlag:true },
    { id:3, text:'旅行の宿を予約する',  priority:'mid',  category:'旅行', deadline:'', memo:'', done:false, todayFlag:false },
  ])
  save('summaries', [
    { id:1, date:ydStr, type:'アニメ', title:'ハイキュー!! TO THE TOP', summary:'烏野高校が強豪校と戦うシーン。努力が突然花開く瞬間の描写が圧巻。チームワークと個の成長が交差する熱い作品。', movingScene:'日向が空中で止まって見えた瞬間', whyMoved:'努力が突然花開く瞬間の美しさ', learned:'努力の積み重ねは、ある日突然形になる', myLife:'毎日の小さな習慣が、いつか大きな変化を生む', howToTell:'バレーの試合中に時間が止まる感覚があってさ…', depth:'努力の継続が「ゾーン」を生むという感覚を学んだ' },
  ])
}
