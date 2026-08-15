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
  weekly: [
    { key:'wk_review',   label:'今週の記録を振り返った' },
    { key:'wk_score',    label:'平均スコアを確認した' },
    { key:'wk_emotion',  label:'今週の感情パターンに気づいた' },
    { key:'wk_learn',    label:'今週の学びを3行でまとめた' },
    { key:'wk_proud',    label:'自分を褒める場面が1つあった' },
    { key:'wk_improve',  label:'来週の改善点を1つ決めた' },
    { key:'wk_plan',     label:'来週の方針を書いた' },
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

/**
 * 夜チェックリストマイグレーション（昼11項目は今日の振り返りへ移動のため無効化）
 */
export function migrateEveningChecklist() {
  // 昼11項目は「今日の振り返り」チェックリストに移動したため、夜チェックへの追加は行わない
  // 既存ユーザーが夜チェックに昼の項目を持っている場合はそのまま保持する
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

// 累計ログイン日数（連続でなくてよい）
export function getTotalDays() {
  return Object.keys(getAllRecords()).length
}

/* ─── 月の目標（複数リスト形式） ─── */
function _currentMonth() {
  const d = new Date()
  return `${d.getFullYear()}-${String(d.getMonth()+1).padStart(2,'0')}`
}
// 後方互換: 旧 string 形式を配列に変換
export function getMonthlyGoals() {
  const store = load('monthlyGoalsV2') || {}
  const month = _currentMonth()
  if (store[month]) return store[month]
  // 旧データ移行
  const old = (load('monthlyGoals') || {})[month]
  if (old) return [{ id: 1, text: old, done: false }]
  return []
}
export function saveMonthlyGoals(list) {
  const store = load('monthlyGoalsV2') || {}
  store[_currentMonth()] = list
  save('monthlyGoalsV2', store)
}

// 深夜（4時前）は前日として扱う（夜更かし対応）
export function getEveningDate() {
  const now = new Date()
  if (now.getHours() < 4) {
    const d = new Date(now)
    d.setDate(d.getDate() - 1)
    return `${d.getFullYear()}-${String(d.getMonth()+1).padStart(2,'0')}-${String(d.getDate()).padStart(2,'0')}`
  }
  return getToday()
}

// 特定日のレコードを取得
export function getRecord(date) {
  const records = load('dailyRecords') || {}
  return records[date] || createEmptyDayRecord(date)
}

// 特定日のレコードを更新
export function updateRecord(date, partial) {
  const records = load('dailyRecords') || {}
  if (!records[date]) records[date] = createEmptyDayRecord(date)
  // evening など object はマージ
  const next = { ...records[date], updatedAt: Date.now() }
  for (const k of Object.keys(partial)) {
    if (partial[k] && typeof partial[k] === 'object' && !Array.isArray(partial[k])) {
      next[k] = { ...(records[date][k] || {}), ...partial[k] }
    } else {
      next[k] = partial[k]
    }
  }
  records[date] = next
  save('dailyRecords', records)
  return records[date]
}

// 週の睡眠時間合計（月〜日）
export function getWeeklySleepTotal() {
  const today = new Date(); today.setHours(0,0,0,0)
  const dow = (today.getDay() + 6) % 7
  const monday = new Date(today); monday.setDate(today.getDate() - dow)
  const records = load('dailyRecords') || {}
  let total = 0
  for (let i = 0; i < 7; i++) {
    const d = new Date(monday); d.setDate(monday.getDate() + i)
    const key = `${d.getFullYear()}-${String(d.getMonth()+1).padStart(2,'0')}-${String(d.getDate()).padStart(2,'0')}`
    const rec = records[key]
    if (rec?.morning?.sleepHours) total += Number(rec.morning.sleepHours)
  }
  return total
}

/* ═══════════════════════════════════════════
   TIKTOK MEMOS
═══════════════════════════════════════════ */
export function getTikTokMemos() { return load('tiktokMemos') || [] }
export function saveTikTokMemo(item) {
  const list = getTikTokMemos()
  if (item.id) {
    const idx = list.findIndex(m => m.id === item.id)
    if (idx >= 0) list[idx] = { ...item, updatedAt: Date.now() }
    else list.unshift({ ...item, updatedAt: Date.now() })
  } else {
    list.unshift({ ...item, id: Date.now(), createdAt: getToday(), updatedAt: Date.now() })
  }
  save('tiktokMemos', list)
}
export function deleteTikTokMemo(id) { save('tiktokMemos', getTikTokMemos().filter(m => m.id !== id)) }

/* ═══════════════════════════════════════════
   POKEMON PARTNER (育成)
═══════════════════════════════════════════ */
export const PARTNER_EVO_TREE = {
  // カントー御三家
  1:  { name:'フシギダネ', type:'grass',    color:'#4CAF50', evoLv:16, evosTo:2   },
  2:  { name:'フシギソウ', type:'grass',    color:'#388E3C', evoLv:32, evosTo:3   },
  3:  { name:'フシギバナ', type:'grass',    color:'#2E7D32'                         },
  4:  { name:'ヒトカゲ',   type:'fire',     color:'#FF5722', evoLv:16, evosTo:5   },
  5:  { name:'リザード',   type:'fire',     color:'#E64A19', evoLv:36, evosTo:6   },
  6:  { name:'リザードン', type:'fire',     color:'#BF360C'                         },
  7:  { name:'ゼニガメ',   type:'water',    color:'#2196F3', evoLv:16, evosTo:8   },
  8:  { name:'カメール',   type:'water',    color:'#1565C0', evoLv:36, evosTo:9   },
  9:  { name:'カメックス', type:'water',    color:'#0D47A1'                         },
  // カントー人気
  25: { name:'ピカチュウ', type:'electric', color:'#FFC107', evoLv:30, evosTo:26  },
  26: { name:'ライチュウ', type:'electric', color:'#FF8F00'                         },
  63: { name:'ケーシィ',   type:'psychic',  color:'#CE93D8', evoLv:16, evosTo:64  },
  64: { name:'ユンゲラー', type:'psychic',  color:'#BA68C8', evoLv:36, evosTo:65  },
  65: { name:'フーディン', type:'psychic',  color:'#9C27B0'                         },
  92: { name:'ゴース',     type:'ghost',    color:'#7E57C2', evoLv:25, evosTo:93  },
  93: { name:'ゴースト',   type:'ghost',    color:'#5E35B1', evoLv:36, evosTo:94  },
  94: { name:'ゲンガー',   type:'ghost',    color:'#4527A0'                         },
  147:{ name:'ミニリュウ', type:'dragon',   color:'#42A5F5', evoLv:30, evosTo:148 },
  148:{ name:'ハクリュー', type:'dragon',   color:'#1E88E5', evoLv:55, evosTo:149 },
  149:{ name:'カイリュー', type:'dragon',   color:'#1565C0'                         },
  // イーブイ進化系
  133:{ name:'イーブイ',   type:'normal',   color:'#8D6E63', evoLv:25, evosTo:196 },
  134:{ name:'シャワーズ', type:'water',    color:'#42A5F5'                         },
  135:{ name:'サンダース', type:'electric', color:'#FDD835'                         },
  136:{ name:'ブースター', type:'fire',     color:'#EF6C00'                         },
  196:{ name:'エーフィ',   type:'psychic',  color:'#9C27B0'                         },
  197:{ name:'ブラッキー', type:'dark',     color:'#212121'                         },
  470:{ name:'リーフィア', type:'grass',    color:'#43A047'                         },
  471:{ name:'グレイシア', type:'ice',      color:'#80DEEA'                         },
  700:{ name:'ニンフィア', type:'fairy',    color:'#F48FB1'                         },
  // ジョウト御三家
  152:{ name:'チコリータ', type:'grass',    color:'#66BB6A', evoLv:16, evosTo:153 },
  153:{ name:'ベイリーフ', type:'grass',    color:'#43A047', evoLv:32, evosTo:154 },
  154:{ name:'メガニウム', type:'grass',    color:'#2E7D32'                         },
  155:{ name:'ヒノアラシ', type:'fire',     color:'#FF7043', evoLv:14, evosTo:156 },
  156:{ name:'マグマラシ', type:'fire',     color:'#F4511E', evoLv:36, evosTo:157 },
  157:{ name:'バクフーン', type:'fire',     color:'#BF360C'                         },
  158:{ name:'ワニノコ',   type:'water',    color:'#26C6DA', evoLv:18, evosTo:159 },
  159:{ name:'アリゲイツ', type:'water',    color:'#00ACC1', evoLv:30, evosTo:160 },
  160:{ name:'オーダイル', type:'water',    color:'#00838F'                         },
  // ジョウト人気
  246:{ name:'ヨーギラス', type:'rock',     color:'#78909C', evoLv:30, evosTo:247 },
  247:{ name:'サナギラス', type:'rock',     color:'#546E7A', evoLv:55, evosTo:248 },
  248:{ name:'バンギラス', type:'dark',     color:'#37474F'                         },
  // ホウエン御三家
  252:{ name:'キモリ',     type:'grass',    color:'#4CAF50', evoLv:16, evosTo:253 },
  253:{ name:'ジュプトル', type:'grass',    color:'#388E3C', evoLv:36, evosTo:254 },
  254:{ name:'ジュカイン', type:'grass',    color:'#1B5E20'                         },
  255:{ name:'アチャモ',   type:'fire',     color:'#FF8A65', evoLv:16, evosTo:256 },
  256:{ name:'ワカシャモ', type:'fire',     color:'#FF5722', evoLv:36, evosTo:257 },
  257:{ name:'バシャーモ', type:'fire',     color:'#E64A19'                         },
  258:{ name:'ミズゴロウ', type:'water',    color:'#64B5F6', evoLv:16, evosTo:259 },
  259:{ name:'ヌマクロー', type:'water',    color:'#1976D2', evoLv:36, evosTo:260 },
  260:{ name:'ラグラージ', type:'water',    color:'#0D47A1'                         },
  // ホウエン人気
  280:{ name:'ラルトス',   type:'psychic',  color:'#F8BBD9', evoLv:20, evosTo:281 },
  281:{ name:'キルリア',   type:'psychic',  color:'#F48FB1', evoLv:30, evosTo:282 },
  282:{ name:'サーナイト', type:'psychic',  color:'#E91E63'                         },
  // シンオウ人気
  443:{ name:'フカマル',   type:'dragon',   color:'#64B5F6', evoLv:24, evosTo:444 },
  444:{ name:'ガバイト',   type:'dragon',   color:'#42A5F5', evoLv:48, evosTo:445 },
  445:{ name:'ガブリアス', type:'dragon',   color:'#1565C0'                         },
  447:{ name:'リオル',     type:'fighting', color:'#42A5F5', evoLv:20, evosTo:448 },
  448:{ name:'ルカリオ',   type:'fighting', color:'#1A237E'                         },
  // パルデア御三家
  906:{ name:'ニャオハ',   type:'grass',    color:'#66BB6A', evoLv:16, evosTo:907 },
  907:{ name:'ニャローテ', type:'grass',    color:'#43A047', evoLv:36, evosTo:908 },
  908:{ name:'マスカーニャ',type:'grass',   color:'#1B5E20'                         },
  909:{ name:'ホゲータ',   type:'fire',     color:'#FF8A65', evoLv:16, evosTo:910 },
  910:{ name:'アチゲータ', type:'fire',     color:'#FF5722', evoLv:36, evosTo:911 },
  911:{ name:'ラウドボーン',type:'fire',    color:'#BF360C'                         },
  912:{ name:'クワッス',   type:'water',    color:'#64B5F6', evoLv:16, evosTo:913 },
  913:{ name:'ウェルカモ', type:'water',    color:'#1976D2', evoLv:36, evosTo:914 },
  914:{ name:'ウェーニバル',type:'water',   color:'#0D47A1'                         },
}

export const PARTNER_EXP_FOR_LEVEL = (lv) => lv * 12 + 25

export function getPartner() { return load('pokemonPartner') }

export function createPartner(basePokeId) {
  const info = PARTNER_EVO_TREE[basePokeId]
  const data = {
    stage: 'egg',
    basePokeId,
    currentPokeId: basePokeId,
    currentName: info?.name || '???',
    level: 0, exp: 0,
    hp: 80, maxHp: 80,
    happiness: 40,
    hatchProgress: 0, hatchThreshold: 120,
    lastCaredDate: null,
    lastPettedDate: null,
    lastTalkedDate: null,
    lastFedDate: null,
    totalCareDays: 0,
    pendingEvolveId: null,
    nickname: '',
    createdAt: getToday(),
  }
  save('pokemonPartner', data)
  return data
}

export function savePartner(data) { save('pokemonPartner', data) }

export function addPartnerExp(amount) {
  const partner = getPartner()
  if (!partner) return null
  const today = getToday()
  const p = { ...partner }

  if (p.stage === 'egg') {
    p.hatchProgress = (p.hatchProgress || 0) + amount
    if (p.hatchProgress >= p.hatchThreshold) {
      p.stage = 'alive'; p.level = 1; p.exp = 0
      p.hp = p.maxHp = 80
    }
    p.lastCaredDate = today
    save('pokemonPartner', p)
    return { partner: p, hatched: p.stage === 'alive', leveledUp: false, evolving: false }
  }

  const isNewDay = p.lastCaredDate !== today
  if (isNewDay) { p.totalCareDays = (p.totalCareDays || 0) + 1; p.lastCaredDate = today }
  p.hp = Math.min(p.maxHp, (p.hp || 80) + 8)
  p.happiness = Math.min(100, (p.happiness || 50) + 3)
  p.exp = (p.exp || 0) + amount

  let leveledUp = false
  while (true) {
    const needed = PARTNER_EXP_FOR_LEVEL(p.level)
    if (p.exp < needed) break
    p.exp -= needed; p.level++
    p.maxHp = 80 + p.level * 5; p.hp = p.maxHp
    p.happiness = Math.min(100, p.happiness + 8)
    leveledUp = true
    const evoData = PARTNER_EVO_TREE[p.currentPokeId]
    if (evoData?.evosTo && p.level >= evoData.evoLv && !p.pendingEvolveId) {
      p.pendingEvolveId = evoData.evosTo
    }
  }
  save('pokemonPartner', p)
  return { partner: p, hatched: false, leveledUp, evolving: !!p.pendingEvolveId }
}

export function confirmPartnerEvolution() {
  const p = getPartner()
  if (!p?.pendingEvolveId) return null
  const newId = p.pendingEvolveId
  const info = PARTNER_EVO_TREE[newId]
  p.currentPokeId = newId
  p.currentName = info?.name || p.currentName
  p.pendingEvolveId = null
  save('pokemonPartner', p)
  return p
}

export function applyPartnerDecay() {
  const p = getPartner()
  if (!p || p.stage === 'egg' || !p.lastCaredDate) return
  const today = getToday()
  if (p.lastCaredDate === today) return
  const diff = Math.floor((new Date(today + 'T00:00:00') - new Date(p.lastCaredDate + 'T00:00:00')) / 86400000)
  if (diff >= 1) {
    p.hp = Math.max(0, p.hp - diff * 12)
    p.happiness = Math.max(0, p.happiness - diff * 4)
    save('pokemonPartner', p)
  }
}

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

/**
 * 週次レビューリマインダー通知
 * 日曜日（または設定で土曜日）に1回だけ表示する
 * フラグキー: weeklyReminderShown_YYYY-WNN
 */
export function shouldShowWeeklyReminder() {
  const today = new Date()
  const dow = today.getDay() // 0=日, 6=土
  if (dow !== 0) return false  // 日曜日のみ
  const weekKey = getWeekKey(today)
  const flagKey = `weeklyReminderShown_${weekKey}`
  return !load(flagKey)
}

export function markWeeklyReminderShown() {
  const weekKey = getWeekKey(new Date())
  save(`weeklyReminderShown_${weekKey}`, true)
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
 *   2. 夜のチェックリスト全て完了（日記・感情ログ等を含む）
 *   3. 自己投資90分タイマー完了
 *   4. 価値提供1人以上完了
 */
// 朝の儀式完了判定：現在のテンプレート項目が全てチェック済みかどうか
function isMorningChecksDone(record) {
  const template = getChecklistTemplate('morning')
  if (template.length === 0) return false
  const checks = record.morning?.checks || {}
  return template.every(c => checks[c.key] === true)
}

// 夜のチェックリスト完了判定
function isEveningChecksDone(record) {
  const template = getChecklistTemplate('evening')
  if (template.length === 0) return false
  const checks = record.evening?.checks || {}
  return template.every(c => checks[c.key] === true)
}

export function isPerfectDay(record) {
  if (!record) return false
  // 1. 朝の儀式：現在のテンプレート全項目チェック済み
  if (!isMorningChecksDone(record)) return false
  // 2. 夜のチェックリスト全完了
  if (!isEveningChecksDone(record)) return false
  // 3. 自己投資90分完了（タイマーまたは手動入力）
  const timerOk  = record.investment?.timerDone === true
  const manualOk = (record.investment?.manualMinutes || 0) >= 90
  if (!timerOk && !manualOk) return false
  // 4. 価値提供1人以上：1人以上いてdone
  const vp = record.morning?.valuePeople || []
  if (!vp.some(p => p.done)) return false
  return true
}

// 完璧な日の各条件チェック（表示用）
export function getPerfectDayStatus(record) {
  if (!record) return { checks: false, eveningChecks: false, invest: false, value: false }
  const checks       = isMorningChecksDone(record)
  const eveningChecks = isEveningChecksDone(record)
  const invest       = record.investment?.timerDone === true || (record.investment?.manualMinutes || 0) >= 90
  const value        = (record.morning?.valuePeople || []).some(p => p.done)
  // 後方互換のため diary フィールドも残す
  const diary = !!(record.evening?.diary?.trim() || record.evening?.diaryTitle?.trim())
  return { checks, eveningChecks, invest, value, diary }
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
  // 初回ログイン時にプレミアムガチャチケット5枚付与
  if (!load('firstLoginDone')) {
    const current = load('gachaTickets') || 0
    save('gachaTickets', current + 5)
    save('firstLoginDone', true)
  }
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

/* ═══════════════════════════════════════════
   AURA XP & LEVEL SYSTEM
═══════════════════════════════════════════ */
export function getAuraProfile() {
  return load('auraProfile') || { xp: 0, level: 1, totalDays: 0, createdAt: Date.now() }
}
export function saveAuraProfile(p) { save('auraProfile', p) }

export const AURA_LEVELS = [
  { lv: 1, label: 'ルーキー',      min: 0,    color: '#9E9E9E', next: 100  },
  { lv: 2, label: 'ライジング',    min: 100,  color: '#64B5F6', next: 300  },
  { lv: 3, label: 'ソリッド',     min: 300,  color: '#66BB6A', next: 700  },
  { lv: 4, label: 'エクスパート', min: 700,  color: '#FFA726', next: 1400 },
  { lv: 5, label: 'マスター',     min: 1400, color: '#AB47BC', next: 2500 },
  { lv: 6, label: 'レジェンド',   min: 2500, color: '#FFD700', next: null },
]

export function getAuraLevel(xp) {
  let lv = AURA_LEVELS[0]
  for (const l of AURA_LEVELS) { if (xp >= l.min) lv = l; else break }
  return lv
}

export function addAuraXp(amount) {
  const p = getAuraProfile()
  const prevLevel = getAuraLevel(p.xp)
  p.xp = (p.xp || 0) + amount
  const newLevel = getAuraLevel(p.xp)
  saveAuraProfile(p)
  if (newLevel.lv > prevLevel.lv) return { levelUp: true, level: newLevel }
  return { levelUp: false }
}

/* ═══════════════════════════════════════════
   AURA FEED (self-only timeline)
═══════════════════════════════════════════ */
export function getAuraFeed() { return load('auraFeed') || [] }

export function addFeedEntry(entry) {
  const feed = getAuraFeed()
  feed.unshift({ ...entry, id: Date.now(), ts: Date.now() })
  if (feed.length > 60) feed.length = 60
  save('auraFeed', feed)
}

/* ═══════════════════════════════════════════
   COMEBACK & FAILURE RECOVERY
═══════════════════════════════════════════ */
export function checkNeedsComeback() {
  const records = load('dailyRecords') || {}
  const allKeys = Object.keys(records).sort()
  if (allKeys.length === 0) return false
  const today = getToday()
  const d = new Date(); d.setDate(d.getDate() - 1)
  const yesterday = `${d.getFullYear()}-${String(d.getMonth()+1).padStart(2,'0')}-${String(d.getDate()).padStart(2,'0')}`
  const hasYesterday = !!(records[yesterday]?.morning?.savedAt || records[yesterday]?.evening?.savedAt)
  const lastKey = allKeys[allKeys.length - 1]
  const hasHistory = lastKey < today
  return !hasYesterday && hasHistory
}

const COMEBACK_MSGS = [
  { title: '戻ってきたね。', sub: '離れていた時間も、あなたの一部だ。また始まった。それで十分。' },
  { title: 'ここに戻ることが、強さだ。', sub: '完璧にやり続けた人より、何度も立ち上がった人の方が本当にすごい。' },
  { title: '休憩は失敗じゃない。', sub: 'リセットして戻れる人間は、そう多くない。あなたはそういう人間だ。' },
  { title: '昨日は昨日のこと。', sub: '今日の積み上げが、また未来を変えていく。今この瞬間、再起動した。' },
  { title: '60点でいい。続けることが全てだ。', sub: '完璧を求めすぎると、続かない。戻ってきただけで今日は合格点だ。' },
]
export function getComebackMessage() {
  return COMEBACK_MSGS[Math.floor(Math.random() * COMEBACK_MSGS.length)]
}

/* ═══════════════════════════════════════════
   APPROVAL ENGINE
═══════════════════════════════════════════ */
const APPROVAL_POOL = {
  morning: [
    {
      observe: '今日も朝のルーティンをやり切った。',
      meaning: 'それは、感情に流されずに行動した証拠だ。',
      identity: 'あなたは「気分に頼らず、行動で自分を作る人間」だ。',
      next: '今日1つ、意識してゆっくり話してみよう。',
    },
    {
      observe: '記録した。チェックした。保存した。',
      meaning: '小さいけど、それが現実を変える唯一の方法だ。',
      identity: 'あなたには「毎日少しずつ着実に進む力」がある。',
      next: '今日出会う1人に、本当に興味を持って話しかけてみよう。',
    },
    {
      observe: '朝の習慣を積み上げた。',
      meaning: 'これが、あなたの一日の土台になっている。',
      identity: 'あなたは「自分の機嫌を自分で整えられる人間」になっている。',
      next: '今日の観察テーマを1つ決めてみよう。',
    },
    {
      observe: '今日もここに来た。それだけで十分だ。',
      meaning: '来なかった人との差は、今日もまた広がった。',
      identity: 'あなたは「続けることを選んでいる人間」だ。',
      next: '今日誰かを、理由なく1回褒めてみよう。',
    },
    {
      observe: '朝の自分を整えた。',
      meaning: '「自分の状態を管理できる人」は少ない。あなたはその一人だ。',
      identity: 'あなたは「発想と観察で伸びていく人間」だ。',
      next: '今日1つ、人間観察してみよう。',
    },
  ],
  evening: [
    {
      observe: '今日を振り返り、記録した。',
      meaning: '気づきを言語化できる人間は、成長が速い。',
      identity: 'あなたは「自分の人生を観察する力を持つ人間」だ。',
      next: '今日の気づきを明日1つ試してみよう。',
    },
    {
      observe: '一日の終わりに自分と向き合った。',
      meaning: '多くの人が流してしまう時間を、あなたは資産に変えている。',
      identity: 'あなたは「感情ではなく、洞察で動ける人間」になっている。',
      next: '今日の自分に、一言ねぎらいを。それだけでいい。',
    },
    {
      observe: '今日の記録が完成した。',
      meaning: '何かが変わらなかった日も、記録した日は0ではない。',
      identity: 'あなたは「60点でも前に進む人間」だ。それは本物の強さ。',
      next: '明日の朝、少しだけ早く起きてみよう。',
    },
    {
      observe: '夜の振り返りをやりきった。',
      meaning: 'この習慣が、あなたの判断の精度を上げていく。',
      identity: 'あなたは「人間観察と自己観察で成長し続ける人間」だ。',
      next: '今日誰かを観察して気づいたことを1行書いておこう。',
    },
    {
      observe: '今日も日記を書いた。',
      meaning: '自分の感情と向き合える人間は、ブレにくい。',
      identity: 'あなたは「自分の内側をちゃんと知っている人間」だ。',
      next: '明日、誰かの話を最後まで遮らずに聞いてみよう。',
    },
  ],
}

export function generateApprovalMessage(type) {
  const pool = APPROVAL_POOL[type] || APPROVAL_POOL.morning
  return pool[Math.floor(Math.random() * pool.length)]
}

/* ═══════════════════════════════════════════
   MILESTONE TICKET REWARDS
═══════════════════════════════════════════ */
const STREAK_MILESTONES = [
  { key: 'ms_streak_10',  streakReq: 10,  tickets: 5,  msg: '🎉 10日連続達成！+5チケット🎟️ おめでとう！' },
  { key: 'ms_streak_20',  streakReq: 20,  tickets: 5,  msg: '🔥 20日連続！+5チケット🎟️ 本物の継続力だ。' },
  { key: 'ms_streak_30',  streakReq: 30,  tickets: 10, msg: '⭐ 30日連続！+10チケット🎟️ 1ヶ月の本気、すごい。' },
  { key: 'ms_streak_50',  streakReq: 50,  tickets: 10, msg: '💎 50日連続！+10チケット🎟️ 習慣が血肉になってきた。' },
  { key: 'ms_streak_100', streakReq: 100, tickets: 20, msg: '👑 100日連続！+20チケット🎟️ 伝説の領域だ。' },
]

export function checkMilestoneRewards() {
  const streak = getStreak()
  const newRewards = []
  for (const m of STREAK_MILESTONES) {
    if (streak >= m.streakReq && !load(m.key)) {
      addGachaTickets(m.tickets)
      save(m.key, true)
      newRewards.push(m)
    }
  }
  return newRewards
}

/* ═══════════════════════════════════════════
   人との接し方 — 編集可能リスト
═══════════════════════════════════════════ */
const DEFAULT_CONTACT_MINDSET = [
  '相手の話を最後まで聞く',
  '相手の立場で考える',
  '感謝を言葉にする',
  '自分から笑顔で接する',
  '批判より理解を選ぶ',
]
export function getContactMindset() { return load('contactMindset') || DEFAULT_CONTACT_MINDSET }
export function saveContactMindset(list) { save('contactMindset', list) }

/* ═══════════════════════════════════════════
   成功者マインド — 編集可能リスト
═══════════════════════════════════════════ */
const DEFAULT_SUCCESS_MINDSET = [
  { id:1, icon:'🎯', title:'自己責任',    body:'全ての結果は、自分が選んだ行動の積み重ね。環境のせいにしない。' },
  { id:2, icon:'⏳', title:'長期思考',    body:'今日の1%が3年後を決める。焦らず積み上げる人が勝つ。' },
  { id:3, icon:'💬', title:'アウトプット', body:'学んだことを話し、書き、行動に変える。それだけで人と差がつく。' },
  { id:4, icon:'🤝', title:'与える力',    body:'先に与える人に、人とお金は集まる。見返りを求めない与え方。' },
  { id:5, icon:'💪', title:'健康が基盤',  body:'睡眠・食事・運動。整った体が、最高のパフォーマンスを生む。' },
  { id:6, icon:'🧘', title:'感情制御',    body:'感情ではなく意図で動く。怒りの前に3秒だけ止まれ。' },
  { id:7, icon:'🔥', title:'継続の力',    body:'才能は継続に勝てない。60点でいいから、毎日続けることが奇跡を起こす。' },
]
export function getSuccessMindset() { return load('successMindset') || DEFAULT_SUCCESS_MINDSET }
export function saveSuccessMindset(list) { save('successMindset', list) }
