/* ═══════════════════════════════════════════════════════════════
   REWARD TIMELINE — 全体で5日に1回ペース
   ─────────────────────────────────────────────────────────────
   ポケモン  : 約20日ごと（レアリティ高め）
   その他    : 5日ごとに1つ、間を埋める
   全報酬数  : 約22個（streak） + 3個（perfect専用）
   各dayに最大1つ（かぶりなし）
═══════════════════════════════════════════════════════════════ */

/* ─────────────────────────────────────────────
   TIMELINE（唯一の真実）
   type: pokemon / frame / acc / bg / title / effect
───────────────────────────────────────────── */
export const TIMELINE = [
  // ── 序盤：勢いをつける（2〜3日ごと）
  { day:0,   type:'pokemon', id:'pichu'     },  // スタート
  { day:1,   type:'title',   id:'starter'   },  // 1日目で早速称号
  { day:3,   type:'acc',     id:'crown'     },  // 3日で王冠
  { day:5,   type:'frame',   id:'gold'      },  // 5日でゴールドフレーム

  // ── 中盤前半：5日ごと
  { day:10,  type:'bg',      id:'dark'      },
  { day:15,  type:'pokemon', id:'pikachu'   },  // ★ ポケモン #2
  { day:20,  type:'effect',  id:'pulse'     },
  { day:25,  type:'frame',   id:'silver'    },
  { day:30,  type:'acc',     id:'fire'      },
  { day:35,  type:'pokemon', id:'vaporeon'  },  // ★ ポケモン #3
  { day:40,  type:'title',   id:'iron'      },
  { day:45,  type:'bg',      id:'ocean'     },

  // ── 中盤後半
  { day:50,  type:'pokemon', id:'lucario'   },  // ★ ポケモン #4
  { day:55,  type:'frame',   id:'rainbow'   },
  { day:60,  type:'effect',  id:'sparkle'   },
  { day:65,  type:'acc',     id:'trophy'    },
  { day:70,  type:'pokemon', id:'mewtwo'    },  // ★ ポケモン #5
  { day:75,  type:'title',   id:'god'       },
  { day:80,  type:'bg',      id:'galaxy'    },

  // ── 終盤
  { day:85,  type:'frame',   id:'legendary' },
  { day:90,  type:'effect',  id:'lightning' },
  { day:95,  type:'acc',     id:'universe'  },
  { day:100, type:'pokemon', id:'arceus'    },  // ★ ポケモン #6（最終）

  // ── perfect専用（streakとは別枠）
  { day:0,   type:'pokemon', id:'mew',      perfectReq:1  },
  { day:0,   type:'pokemon', id:'celebi',   perfectReq:5  },
  { day:0,   type:'title',   id:'perfect1', perfectReq:1  },
  { day:0,   type:'title',   id:'perfect10',perfectReq:10, rainbow:true },
]

/* ─── 全アイテム定義 ─── */

export const POKEMON_DEF = {
  pichu:    { pokeId:172, name:'ピチュー'   },
  pikachu:  { pokeId:25,  name:'ピカチュウ' },
  vaporeon: { pokeId:134, name:'シャワーズ' },
  lucario:  { pokeId:448, name:'ルカリオ'   },
  mewtwo:   { pokeId:150, name:'ミュウツー' },
  arceus:   { pokeId:493, name:'アルセウス' },
  mew:      { pokeId:151, name:'ミュウ'     },
  celebi:   { pokeId:251, name:'セレビィ'   },
}

export const FRAME_DEF = {
  none:      { label:'デフォルト',      cssClass:'frame-none'     },
  gold:      { label:'ゴールド',        cssClass:'frame-gold'     },
  silver:    { label:'シルバー',        cssClass:'frame-silver'   },
  rainbow:   { label:'レインボー',      cssClass:'frame-rainbow'  },
  legendary: { label:'レジェンダリー',  cssClass:'frame-legendary'},
}

export const ACC_DEF = {
  none:     { label:'なし',       emoji:'',   pos:{} },
  crown:    { label:'王冠',       emoji:'👑', pos:{top:'-16px',left:'50%',transform:'translateX(-50%)'} },
  fire:     { label:'炎',         emoji:'🔥', pos:{bottom:'-10px',right:'-10px'} },
  trophy:   { label:'トロフィー', emoji:'🏆', pos:{bottom:'-10px',right:'-8px'} },
  universe: { label:'宇宙',       emoji:'🌌', pos:{bottom:'-12px',right:'-12px'} },
}

export const BG_DEF = {
  cream:  { label:'クリーム',     bg:'#FAFAF7' },
  dark:   { label:'ダーク',       bg:'#1A1A2E' },
  ocean:  { label:'オーシャン',   bg:'linear-gradient(135deg,#A1C4FD,#C2E9FB)' },
  galaxy: { label:'ギャラクシー', bg:'linear-gradient(135deg,#0F0C29,#302B63,#24243E)' },
}

export const TITLE_DEF = {
  beginner: { label:'新人',        color:'#9A9A9A' },
  starter:  { label:'始動者',      color:'#84A98C' },
  iron:     { label:'習慣の鉄人',  color:'#FF9800' },
  god:      { label:'継続の神',    color:'#E91E63' },
  perfect1: { label:'完璧主義者',  color:'#52B788' },
  perfect10:{ label:'完全燃焼',    color:'#AB47BC', rainbow:true },
}

export const EFFECT_DEF = {
  none:      { label:'なし',           cssClass:'effect-none'      },
  pulse:     { label:'パルス',         cssClass:'effect-pulse'     },
  sparkle:   { label:'キラキラ',       cssClass:'effect-sparkle'   },
  lightning: { label:'雷エフェクト',   cssClass:'effect-lightning' },
  legendary: { label:'レジェンダリー', cssClass:'effect-legendary' },
}

/* ─── 派生：各カテゴリのフラットリスト（コレクション表示用）─── */

function makeList(type, defMap) {
  // 「none/cream/beginner」などデフォルト項目（day:0 で未登録）を先頭に
  const fromTimeline = TIMELINE
    .filter(r => r.type === type)
    .map(r => ({ ...r, ...(defMap[r.id] || {}), streakReq: r.perfectReq ? 0 : r.day }))
  // 既にdefaultが含まれていない場合に追加
  const defaultIds = { pokemon:'pichu', frame:'none', acc:'none', bg:'cream', title:'beginner', effect:'none' }
  const defId = defaultIds[type]
  if (defId && defMap[defId] && !fromTimeline.find(r => r.id === defId)) {
    fromTimeline.unshift({ type, id:defId, streakReq:0, day:0, ...defMap[defId] })
  }
  return fromTimeline
}

export const POKEMON_REWARDS   = makeList('pokemon', POKEMON_DEF)
export const FRAME_REWARDS     = makeList('frame',   FRAME_DEF)
export const ACCESSORY_REWARDS = makeList('acc',     ACC_DEF)
export const BG_REWARDS        = makeList('bg',      BG_DEF)
export const TITLE_REWARDS     = makeList('title',   TITLE_DEF)
export const EFFECT_REWARDS    = makeList('effect',  EFFECT_DEF)

/* ─── ユーティリティ ─── */

/** その日数ちょうどに解放される報酬リスト */
export function getAllRewardsAtStreak(s) {
  return TIMELINE
    .filter(r => r.day === s && !r.perfectReq)
    .map(r => {
      const defMap = { pokemon:POKEMON_DEF, frame:FRAME_DEF, acc:ACC_DEF, bg:BG_DEF, title:TITLE_DEF, effect:EFFECT_DEF }
      return { ...r, ...(defMap[r.type]?.[r.id] || {}) }
    })
}

/** アイテムが解放済みかどうか */
export function isUnlocked(item, streak, perfect = 0) {
  const req = item.streakReq ?? item.day ?? 0
  const sOk = req <= streak
  const pOk = !item.perfectReq || item.perfectReq <= perfect
  return sOk && pOk
}

/** 装備の保存・読み込み */
const EQ_KEY = 'auraEquipped2'
export function getEquipped() {
  try { return JSON.parse(localStorage.getItem(EQ_KEY)) || {} } catch { return {} }
}
export function saveEquipped(data) {
  localStorage.setItem(EQ_KEY, JSON.stringify(data))
}
