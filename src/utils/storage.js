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
  { id:15, text:'昨日より1%だけ良くなれ。それが365日続けば、あなたは別人になる。', author:'名言風', fav:false },
  { id:16, text:'誰も見ていない時の行動が、本当の自分を作る。', author:'名言風', fav:false },
  { id:17, text:'天才とは、1%の才能と99%の努力である。', author:'エジソン', fav:false },
  { id:18, text:'やる前から諦める人に、チャンスは来ない。', author:'名言風', fav:false },
  { id:19, text:'今日という日は、残りの人生の最初の日だ。', author:'名言風', fav:false },
  { id:20, text:'成功とは、情熱を失わずに失敗を重ねていく能力である。', author:'チャーチル', fav:false },
  { id:21, text:'最大の栄光は、一度も失敗しないことではなく、倒れるたびに起き上がることだ。', author:'孔子', fav:false },
  { id:22, text:'行動しなければ何も変わらない。行動すれば何かが変わる。', author:'名言風', fav:false },
  { id:23, text:'あなたの時間は限られている。他人の人生を生きて無駄にするな。', author:'スティーブ・ジョブズ', fav:false },
  { id:24, text:'迷ったらやれ。後悔はやらなかった時に来る。', author:'名言風', fav:false },
  { id:25, text:'自分を信じる力が、現実を変える最初の一歩だ。', author:'名言風', fav:false },
  { id:26, text:'苦しい時ほど、笑え。それが強さの証明だ。', author:'名言風', fav:false },
  { id:27, text:'人生に遅すぎることはない。今日が残りの人生で一番若い日だ。', author:'名言風', fav:false },
  { id:28, text:'才能は練習で作られる。天才は継続で生まれる。', author:'名言風', fav:false },
  { id:29, text:'どんな偉大な旅も、最初の一歩から始まる。', author:'老子', fav:false },
  { id:30, text:'限界は、あなたが自分で設定したものだ。', author:'名言風', fav:false },
  { id:31, text:'結果を出す人は、気分に関係なく動く。', author:'名言風', fav:false },
  { id:32, text:'本気でやれば、大抵のことはできる。本気でやらないから、できない。', author:'名言風', fav:false },
  { id:33, text:'辛い練習は、試合の時に助けてくれる。', author:'名言風', fav:false },
  { id:34, text:'挑戦することで失敗するより、挑戦しないことで後悔する方が怖い。', author:'名言風', fav:false },
  { id:35, text:'今日の自分への投資が、10年後の自分を作る。', author:'名言風', fav:false },
  { id:36, text:'弱さを認める勇気が、本当の強さだ。', author:'名言風', fav:false },
  { id:37, text:'人の悪口を言う暇があるなら、自分を磨け。', author:'名言風', fav:false },
  { id:38, text:'環境のせいにするな。環境を変えるのが、お前の仕事だ。', author:'名言風', fav:false },
  { id:39, text:'1日1日を全力で生きた人間だけが、死ぬ時に笑える。', author:'名言風', fav:false },
  { id:40, text:'習慣は第二の天性である。', author:'キケロ', fav:false },
  { id:41, text:'どんな小さな進歩も、昨日の自分への勝利だ。', author:'名言風', fav:false },
  { id:42, text:'諦めた瞬間に、ゲームオーバーになる。', author:'名言風', fav:false },
  { id:43, text:'自分が変われば、世界が変わる。', author:'名言風', fav:false },
  { id:44, text:'熱量は伝染する。あなたの本気が周りを動かす。', author:'名言風', fav:false },
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
  evening: [
    { key:'ev_score',   label:'今日のスコアをつけた' },
    { key:'ev_diary',   label:'日記を書いた' },
    { key:'ev_eq',      label:'感情ログを記録した' },
    { key:'ev_learn',   label:'今日の学びをメモした' },
    { key:'ev_tomorrow',label:'明日やることを1つ決めた' },
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
      arikataResult:'', goodInteraction:'',
      improvedScene:'', roughAction:'', emotionBreak:'', emotionBg:'',
      bgView:'', tomorrowImprove:'',
      // 午後の3チェック（夜タブに表示）
      afternoonMini: { breathe: false, emotion: false, plan: false },
      // 夜のチェックリスト（カスタマイズ可）
      checks: {},
      // スコア制（0-100）
      score: 0,
      // EQ ログ
      eqEmotion:'', eqReason:'', eqNeed:'', eqAction:'',
      // IQ・学び
      learnedToday:'', iqSummary:'',
      // 日記
      diary:'', diaryTitle:'',
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
   WEEKLY REVIEW
═══════════════════════════════════════════ */
// weekKey = "YYYY-WNN"
export function getWeekKey(date = new Date()) {
  const d = new Date(date); d.setHours(0,0,0,0)
  // 月曜始まりの週番号
  const dow = (d.getDay() + 6) % 7
  const monday = new Date(d); monday.setDate(d.getDate() - dow)
  const year = monday.getFullYear()
  const startOfYear = new Date(year, 0, 1)
  const weekNum = Math.ceil(((monday - startOfYear) / 86400000 + 1) / 7)
  return `${year}-W${String(weekNum).padStart(2,'0')}`
}

export function getWeeklyReview(weekKey) {
  const all = load('weeklyReviews') || {}
  return all[weekKey] || { weekKey, note:'', plans:['','',''] }
}

export function saveWeeklyReview(weekKey, data) {
  const all = load('weeklyReviews') || {}
  all[weekKey] = { ...data, weekKey, updatedAt: Date.now() }
  save('weeklyReviews', all)
}

// ガチャ回数カウント（シークレット報酬用）
export function getGachaCount() { return load('gachaCount') || 0 }
export function incrementGachaCount() {
  const n = getGachaCount() + 1; save('gachaCount', n); return n
}

// 各種カウンター（シークレット条件）
export function getSecretCounts() {
  const records = getAllRecords()
  const vals = Object.values(records)
  const diaryCount  = vals.filter(r => r.evening?.diary?.trim() || r.evening?.diaryTitle?.trim()).length
  const eqDays      = vals.filter(r => r.evening?.eqEmotion?.trim()).length
  const gachaCount  = getGachaCount()
  const perfect     = vals.filter(r => {
    // 簡易チェック（循環参照回避のためインライン）
    const mc = Object.values(r.morning?.checks || {})
    const timerOk = r.investment?.timerDone === true
    const manualOk = (r.investment?.manualMinutes || 0) >= 90
    const hasDiary = !!(r.evening?.diary?.trim() || r.evening?.diaryTitle?.trim())
    const vp = r.morning?.valuePeople || []
    return mc.length > 0 && mc.every(Boolean) && hasDiary && (timerOk || manualOk) && vp.some(p => p.done)
  }).length
  const weeklyCount = Object.keys(load('weeklyReviews') || {}).length
  const worldCount  = load('worldViewCount') || 0
  return { diaryCount, eqDays, gachaCount, perfect, weeklyCount, worldCount }
}
export function incrementWorldCount() {
  const n = (load('worldViewCount') || 0) + 1; save('worldViewCount', n); return n
}

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

/**
 * 完璧の日の定義：
 *   1. 朝の儀式（モーニングチェックリスト）全て完了
 *   2. 振り返り（夜の日記）記入済み
 *   3. 自己投資90分タイマー完了
 *   4. 価値提供3人 全員完了
 */
// 朝の儀式完了判定：現在のテンプレート項目が全てチェック済みかどうか
function isMorningChecksDone(record) {
  const template = getChecklistTemplate('morning')
  if (template.length === 0) return false
  const checks = record.morning?.checks || {}
  return template.every(c => checks[c.key] === true)
}

export function isPerfectDay(record) {
  if (!record) return false
  // 1. 朝の儀式：現在のテンプレート全項目チェック済み
  if (!isMorningChecksDone(record)) return false
  // 2. 振り返り：日記の題名または本文が書かれている
  const hasDiary = !!(record.evening?.diary?.trim() || record.evening?.diaryTitle?.trim())
  if (!hasDiary) return false
  // 3. 自己投資90分完了（タイマーまたは手動入力）
  const timerOk  = record.investment?.timerDone === true
  const manualOk = (record.investment?.manualMinutes || 0) >= 90
  if (!timerOk && !manualOk) return false
  // 4. 価値提供1人以上：1人以上いてdone
  const vp = record.morning?.valuePeople || []
  if (!vp.some(p => p.done)) return false
  // 5. 夜のチェックリスト全達成（テンプレートに項目がある場合）
  const eveningTemplate = getChecklistTemplate('evening')
  if (eveningTemplate.length > 0) {
    const evChecks = record.evening?.checks || {}
    if (!eveningTemplate.every(c => evChecks[c.key] === true)) return false
  }
  return true
}

// 完璧な日の各条件チェック（表示用）
export function getPerfectDayStatus(record) {
  if (!record) return { checks: false, diary: false, invest: false, value: false, eveningChecks: false }
  const checks = isMorningChecksDone(record)
  const diary  = !!(record.evening?.diary?.trim() || record.evening?.diaryTitle?.trim())
  const invest = record.investment?.timerDone === true || (record.investment?.manualMinutes || 0) >= 90
  const value  = (record.morning?.valuePeople || []).some(p => p.done)
  const eveningTemplate = getChecklistTemplate('evening')
  const eveningChecks = eveningTemplate.length === 0 || eveningTemplate.every(c => (record.evening?.checks || {})[c.key] === true)
  return { checks, diary, invest, value, eveningChecks }
}

export function getPerfectCount() {
  const records = getAllRecords()
  return Object.values(records).filter(r => isPerfectDay(r)).length
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

/* ═══════════════════════════════════════════
   ACHIEVEMENT SYSTEM
═══════════════════════════════════════════ */
export const ACHIEVEMENT_DEFS = [
  { id:'first_day',   label:'はじめの一歩',   desc:'初めてルーティンを記録した',         icon:'🌱', badge:'ROOKIE',   color:'#84A98C', streakReq:0,  perfectReq:0,  gachaUnlock:3  },
  { id:'streak_3',    label:'3日の継続',       desc:'3日連続でルーティンを続けた',         icon:'🔥', badge:'3 DAYS',   color:'#E8813A', streakReq:3,  perfectReq:0,  gachaUnlock:5  },
  { id:'streak_7',    label:'一週間の戦士',    desc:'7日連続でルーティンを続けた',         icon:'⚡', badge:'1 WEEK',   color:'#6C63FF', streakReq:7,  perfectReq:0,  gachaUnlock:8  },
  { id:'streak_14',   label:'二週間の覚悟',    desc:'14日連続でルーティンを続けた',        icon:'💎', badge:'2 WEEKS',  color:'#2196F3', streakReq:14, perfectReq:0,  gachaUnlock:12 },
  { id:'streak_30',   label:'一ヶ月の本気',    desc:'30日連続でルーティンを続けた',        icon:'👑', badge:'30 DAYS',  color:'#F7D87C', streakReq:30, perfectReq:0,  gachaUnlock:18 },
  { id:'streak_60',   label:'二ヶ月の覚醒',    desc:'60日連続でルーティンを続けた',        icon:'🌟', badge:'60 DAYS',  color:'#E85D2A', streakReq:60, perfectReq:0,  gachaUnlock:25 },
  { id:'streak_100',  label:'100日の伝説',     desc:'100日連続でルーティンを続けた',       icon:'🏆', badge:'100 DAYS', color:'#FFD700', streakReq:100,perfectReq:0,  gachaUnlock:35 },
  { id:'perfect_1',   label:'完璧な一日',      desc:'1日100%達成を初めて達成した',         icon:'✨', badge:'PERFECT',  color:'#52B788', streakReq:0,  perfectReq:1,  gachaUnlock:3  },
  { id:'perfect_5',   label:'5回の完全燃焼',   desc:'100%達成を5回達成した',              icon:'🎯', badge:'× 5',      color:'#F06292', streakReq:0,  perfectReq:5,  gachaUnlock:6  },
  { id:'perfect_10',  label:'10回の完全制覇',  desc:'100%達成を10回達成した',             icon:'🌈', badge:'× 10',     color:'#AB47BC', streakReq:0,  perfectReq:10, gachaUnlock:10 },
]

// 実績解除に応じてガチャ候補を解放する追加リスト
export const UNLOCKABLE_ATTITUDES = [
  '静かな自信を持つ男','圧倒的な存在感','誰とでも5分で仲良くなれる人','場を支配する男',
  '絶対に諦めない人間','光を放つ存在','本質を見抜く人','選ばれ続ける存在',
  '自分の道を歩む者','全員から信頼される人','余裕の中に強さがある男','空気を変える人',
  '誰かの記憶に残る存在','逆境を力に変える人','静かに燃え続ける男','磁力を持つ人間',
  '感情をコントロールできる男','常に成長し続ける存在','器が大きい男','自然体で最強な人',
  '一流の雰囲気を纏う人','孤独を力にできる男','言葉に重みがある存在','動じない人間',
  '周りを幸せにする存在','時代を作る人間','深みのある男','圧倒的な主人公','伝説になる人間',
  '1%の違いを生み出す男','自分を超え続ける存在','誰も追いつけない速度で成長する人',
  '覚悟が違う男','本物の強さを持つ存在','世界を変える人間',
]

export function getAchievements() { return load('achievements') || [] }
export function saveAchievements(list) { save('achievements', list) }

export function getUnlockedAttitudeCount() {
  const unlocked = getAchievements()
  if (!unlocked.length) return 0
  const maxGacha = unlocked.reduce((m, id) => {
    const def = ACHIEVEMENT_DEFS.find(a => a.id === id)
    return def ? Math.max(m, def.gachaUnlock) : m
  }, 0)
  return maxGacha
}

export function getUnlockedAttitudes() {
  const count = getUnlockedAttitudeCount()
  return UNLOCKABLE_ATTITUDES.slice(0, count)
}

/* ═══════════════════════════════════════════
   PREMIUM GACHA TICKETS
═══════════════════════════════════════════ */
export function getGachaTickets() { return load('gachaTickets') || 0 }
export function addGachaTickets(n) { const t = getGachaTickets() + n; save('gachaTickets', t); return t }
export function useGachaTicket() { const t = getGachaTickets(); if (t < 1) return false; save('gachaTickets', t - 1); return true }

// チケット付与の重複防止（1日1回）
export function getTicketsAwardedToday() { return load(`ticketsAwarded_${getToday()}`) || {} }
export function wasTicketAwarded(reason) { return !!getTicketsAwardedToday()[reason] }
export function markTicketAwarded(reason) {
  const t = getTicketsAwardedToday(); t[reason] = true; save(`ticketsAwarded_${getToday()}`, t)
}

// 実績チェック → 新しく解除されたものを返す
export function checkAchievements() {
  const streak = getStreak()
  const records = getAllRecords()
  const perfectCount = Object.values(records).filter(r => calcDayProgress(r) >= 100).length
  const current = getAchievements()
  const newUnlocks = []

  for (const def of ACHIEVEMENT_DEFS) {
    if (current.includes(def.id)) continue
    let earned = false
    if (def.id === 'first_day' && Object.keys(records).length >= 1) earned = true
    if (def.streakReq > 0 && streak >= def.streakReq) earned = true
    if (def.perfectReq > 0 && perfectCount >= def.perfectReq) earned = true
    if (earned) newUnlocks.push(def.id)
  }

  if (newUnlocks.length) saveAchievements([...current, ...newUnlocks])
  return newUnlocks
}
