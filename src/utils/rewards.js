/* ═══════════════════════════════════════════════════════════════
   REWARD SYSTEM
   ルール:
   - 各日に最大1つの報酬（かぶりなし）
   - 5日ごとにポケモンが必ず解放（0,5,10,...,100日）
   - 他の報酬が間を埋める（毎日何かが近くにある）
   - perfectReq専用アイテムはstreakとは別枠
   - ロック中は内容を非表示（???）
═══════════════════════════════════════════════════════════════ */

/* ─── ポケモン（5日ごと・streakReqが全て異なる）─── */
export const POKEMON_REWARDS = [
  { id:'pichu',     pokeId:172, name:'ピチュー',    streakReq:0   },
  { id:'pikachu',   pokeId:25,  name:'ピカチュウ',  streakReq:5   },
  { id:'raichu',    pokeId:26,  name:'ライチュウ',  streakReq:10  },
  { id:'eevee',     pokeId:133, name:'イーブイ',    streakReq:15  },
  { id:'vaporeon',  pokeId:134, name:'シャワーズ',  streakReq:20  },
  { id:'jolteon',   pokeId:135, name:'サンダース',  streakReq:25  },
  { id:'flareon',   pokeId:136, name:'ブースター',  streakReq:30  },
  { id:'espeon',    pokeId:196, name:'エーフィ',    streakReq:35  },
  { id:'umbreon',   pokeId:197, name:'ブラッキー',  streakReq:40  },
  { id:'glaceon',   pokeId:471, name:'グレイシア',  streakReq:45  },
  { id:'leafeon',   pokeId:470, name:'リーフィア',  streakReq:50  },
  { id:'sylveon',   pokeId:700, name:'ニンフィア',  streakReq:55  },
  { id:'gengar',    pokeId:94,  name:'ゲンガー',    streakReq:60  },
  { id:'lucario',   pokeId:448, name:'ルカリオ',    streakReq:65  },
  { id:'gardevoir', pokeId:282, name:'サーナイト',  streakReq:70  },
  { id:'mewtwo',    pokeId:150, name:'ミュウツー',  streakReq:75  },
  { id:'charizard', pokeId:6,   name:'リザードン',  streakReq:80  },
  { id:'rayquaza',  pokeId:384, name:'レックウザ',  streakReq:85  },
  { id:'giratina',  pokeId:487, name:'ギラティナ',  streakReq:90  },
  { id:'dialga',    pokeId:483, name:'ディアルガ',  streakReq:95  },
  { id:'arceus',    pokeId:493, name:'アルセウス',  streakReq:100 },
  // 完璧日数専用（streakReqと重複しない）
  { id:'mew',       pokeId:151, name:'ミュウ',      streakReq:0,  perfectReq:1  },
  { id:'celebi',    pokeId:251, name:'セレビィ',    streakReq:0,  perfectReq:5  },
  { id:'jirachi',   pokeId:385, name:'ジラーチ',    streakReq:0,  perfectReq:10 },
]

/* ─── フレーム（日数全て異なる）─── */
export const FRAME_REWARDS = [
  { id:'none',        label:'デフォルト',      streakReq:0,  cssClass:'frame-none'       },
  { id:'gold',        label:'ゴールド',         streakReq:3,  cssClass:'frame-gold'       },
  { id:'silver',      label:'シルバー',         streakReq:8,  cssClass:'frame-silver'     },
  { id:'neon-blue',   label:'ネオンブルー',     streakReq:13, cssClass:'frame-neon-blue'  },
  { id:'sunset',      label:'サンセット',       streakReq:18, cssClass:'frame-sunset'     },
  { id:'mint',        label:'ミント',           streakReq:23, cssClass:'frame-mint'       },
  { id:'fire',        label:'炎',               streakReq:28, cssClass:'frame-fire'       },
  { id:'ice',         label:'アイス',           streakReq:33, cssClass:'frame-ice'        },
  { id:'thunder',     label:'サンダー',         streakReq:38, cssClass:'frame-thunder'    },
  { id:'rainbow',     label:'レインボー',       streakReq:43, cssClass:'frame-rainbow'    },
  { id:'rose-gold',   label:'ローズゴールド',   streakReq:48, cssClass:'frame-rose-gold'  },
  { id:'galaxy',      label:'ギャラクシー',     streakReq:53, cssClass:'frame-galaxy'     },
  { id:'diamond',     label:'ダイヤモンド',     streakReq:58, cssClass:'frame-diamond'    },
  { id:'aurora',      label:'オーロラ',         streakReq:63, cssClass:'frame-aurora'     },
  { id:'lava',        label:'マグマ',           streakReq:68, cssClass:'frame-lava'       },
  { id:'ocean',       label:'オーシャン',       streakReq:72, cssClass:'frame-ocean'      },
  { id:'holo',        label:'ホログラフィック', streakReq:76, cssClass:'frame-holo'       },
  { id:'nebula',      label:'ネビュラ',         streakReq:82, cssClass:'frame-nebula'     },
  { id:'legendary',   label:'レジェンダリー',   streakReq:86, cssClass:'frame-legendary'  },
  { id:'godlike',     label:'神',               streakReq:96, cssClass:'frame-godlike'    },
]

/* ─── アクセサリー（日数全て異なる）─── */
export const ACCESSORY_REWARDS = [
  { id:'none',      label:'なし',        emoji:'',   streakReq:0,  pos:{} },
  { id:'crown',     label:'王冠',        emoji:'👑', streakReq:4,  pos:{top:'-16px',left:'50%',transform:'translateX(-50%)'} },
  { id:'lightning', label:'雷',          emoji:'⚡', streakReq:9,  pos:{top:'-10px',right:'-12px'} },
  { id:'fire',      label:'炎',          emoji:'🔥', streakReq:14, pos:{bottom:'-10px',right:'-10px'} },
  { id:'star',      label:'スター',      emoji:'🌟', streakReq:21, pos:{top:'-10px',right:'-10px'} },
  { id:'ribbon',    label:'リボン',      emoji:'🎀', streakReq:29, pos:{bottom:'-10px',left:'-8px'} },
  { id:'diamond',   label:'ダイヤ',      emoji:'💎', streakReq:34, pos:{top:'-10px',left:'-8px'} },
  { id:'shield',    label:'シールド',    emoji:'🛡️', streakReq:41, pos:{bottom:'-10px',left:'-10px'} },
  { id:'sword',     label:'ソード',      emoji:'⚔️', streakReq:49, pos:{top:'-8px',right:'-8px'} },
  { id:'trophy',    label:'トロフィー',  emoji:'🏆', streakReq:54, pos:{bottom:'-10px',right:'-8px'} },
  { id:'gem',       label:'ジェム',      emoji:'💠', streakReq:61, pos:{top:'-10px',left:'50%',transform:'translateX(-50%)'} },
  { id:'wings',     label:'翼',          emoji:'🪽', streakReq:71, pos:{bottom:'-12px',left:'50%',transform:'translateX(-50%)'} },
  { id:'infinity',  label:'∞',          emoji:'♾️', streakReq:78, pos:{top:'-8px',left:'-10px'} },
  { id:'dragon',    label:'ドラゴン',    emoji:'🐉', streakReq:84, pos:{top:'-12px',right:'-12px'} },
  { id:'angel',     label:'エンジェル',  emoji:'😇', streakReq:88, pos:{top:'-14px',left:'50%',transform:'translateX(-50%)'} },
  { id:'universe',  label:'宇宙',        emoji:'🌌', streakReq:98, pos:{bottom:'-12px',right:'-12px'} },
]

/* ─── 背景テーマ（日数全て異なる）─── */
export const BG_REWARDS = [
  { id:'cream',     label:'クリーム',     bg:'#FAFAF7',                                             streakReq:0  },
  { id:'dark',      label:'ダーク',       bg:'#1A1A2E',                                             streakReq:2  },
  { id:'sunset',    label:'サンセット',   bg:'linear-gradient(135deg,#FF9A9E,#FECFEF)',             streakReq:7  },
  { id:'ocean',     label:'オーシャン',   bg:'linear-gradient(135deg,#A1C4FD,#C2E9FB)',             streakReq:12 },
  { id:'forest',    label:'フォレスト',   bg:'linear-gradient(135deg,#D4FC79,#96E6A1)',             streakReq:17 },
  { id:'sakura',    label:'サクラ',       bg:'linear-gradient(135deg,#FFCCE7,#FFA8D9)',             streakReq:22 },
  { id:'lemon',     label:'レモン',       bg:'linear-gradient(135deg,#FFF176,#FFD54F)',             streakReq:27 },
  { id:'midnight',  label:'ミッドナイト', bg:'linear-gradient(135deg,#0F2027,#203A43,#2C5364)',     streakReq:32 },
  { id:'aurora',    label:'オーロラ',     bg:'linear-gradient(135deg,#00C9FF,#92FE9D)',             streakReq:37 },
  { id:'volcano',   label:'ボルカノ',     bg:'linear-gradient(135deg,#FF416C,#FF4B2B)',             streakReq:42 },
  { id:'hologram',  label:'ホログラム',   bg:'linear-gradient(135deg,#f6d365,#fda085)',             streakReq:47 },
  { id:'galaxy',    label:'ギャラクシー', bg:'linear-gradient(135deg,#0F0C29,#302B63,#24243E)',     streakReq:52 },
  { id:'nebula',    label:'ネビュラ',     bg:'linear-gradient(135deg,#4776E6,#8E54E9)',             streakReq:57 },
  { id:'coral',     label:'コーラル',     bg:'linear-gradient(135deg,#FF7043,#FF8A65,#FFCCBC)',     streakReq:62 },
  { id:'northern',  label:'北の光',       bg:'linear-gradient(135deg,#006064,#00BCD4,#80DEEA)',     streakReq:67 },
  { id:'cosmic',    label:'コズミック',   bg:'linear-gradient(135deg,#1A0533,#6A0572,#C471ED)',     streakReq:74 },
  { id:'rainbow-bg',label:'レインボー',   bg:'linear-gradient(135deg,#FF0000,#FF7700,#FFFF00,#00CC00,#0066FF,#8800FF)', streakReq:79 },
  { id:'abyss',     label:'深淵',         bg:'linear-gradient(135deg,#000000,#0D0D0D,#1A0533)',     streakReq:89 },
  { id:'legendary', label:'伝説',         bg:'linear-gradient(135deg,#f6d365,#fda085,#f093fb)',     streakReq:99 },
]

/* ─── 称号（日数全て異なる）─── */
export const TITLE_REWARDS = [
  { id:'beginner',   label:'新人',          streakReq:0,  color:'#9A9A9A' },
  { id:'starter',    label:'始動者',        streakReq:1,  color:'#84A98C' },
  { id:'day11',      label:'10日の覚悟',    streakReq:11, color:'#2196F3' },
  { id:'day19',      label:'習慣の芽生え',  streakReq:19, color:'#009688' },
  { id:'day24',      label:'四半期の強者',  streakReq:24, color:'#4CAF50' },
  { id:'day31',      label:'一ヶ月の本気',  streakReq:31, color:'#FFD700' },
  { id:'day39',      label:'習慣の鉄人',    streakReq:39, color:'#FF9800' },
  { id:'day44',      label:'40日の鋼鉄',    streakReq:44, color:'#F44336' },
  { id:'day51',      label:'50日の伝説',    streakReq:51, color:'#FF5722' },
  { id:'day59',      label:'二ヶ月の夜明け',streakReq:59, color:'#9C27B0' },
  { id:'day64',      label:'継続の化身',    streakReq:64, color:'#673AB7' },
  { id:'day69',      label:'継続の神',      streakReq:69, color:'#E91E63' },
  { id:'day73',      label:'強者の証',      streakReq:73, color:'#E91E63' },
  { id:'day77',      label:'伝説への道',    streakReq:77, color:'#D32F2F' },
  { id:'day83',      label:'不屈の魂',      streakReq:83, color:'#BF360C' },
  { id:'day87',      label:'90日の鬼神',    streakReq:87, color:'#E85D2A' },
  { id:'day93',      label:'限界突破',      streakReq:93, color:'#FF6F00' },
  { id:'day97',      label:'百日への誓い',  streakReq:97, color:'#FFA000' },
  { id:'day100',     label:'百日の伝説',    streakReq:100,color:'#FFD700', rainbow:true },
  // 完璧日数専用
  { id:'perfect1',   label:'完璧主義者',    streakReq:0,  perfectReq:1,  color:'#52B788' },
  { id:'perfect5',   label:'完璧の使徒',    streakReq:0,  perfectReq:5,  color:'#F06292' },
  { id:'perfect10',  label:'完全燃焼',      streakReq:0,  perfectReq:10, color:'#AB47BC', rainbow:true },
]

/* ─── エフェクト（日数全て異なる）─── */
export const EFFECT_REWARDS = [
  { id:'none',      label:'なし',            streakReq:0,  cssClass:'effect-none'     },
  { id:'pulse',     label:'パルス',          streakReq:6,  cssClass:'effect-pulse'    },
  { id:'gold-glow', label:'ゴールドグロー',  streakReq:16, cssClass:'effect-gold-glow'},
  { id:'silver',    label:'シルバーシマー',  streakReq:26, cssClass:'effect-silver'   },
  { id:'fire-aura', label:'炎オーラ',        streakReq:36, cssClass:'effect-fire-aura'},
  { id:'ice-aura',  label:'アイスオーラ',    streakReq:46, cssClass:'effect-ice-aura' },
  { id:'rainbow',   label:'レインボー',      streakReq:56, cssClass:'effect-rainbow'  },
  { id:'sparkle',   label:'キラキラ',        streakReq:66, cssClass:'effect-sparkle'  },
  { id:'lightning', label:'雷エフェクト',    streakReq:81, cssClass:'effect-lightning'},
  { id:'legendary', label:'レジェンダリー',  streakReq:91, cssClass:'effect-legendary'},
]

/* ─── ユーティリティ ─── */

/** その日数ちょうどに解放されるものを返す（1日1件保証） */
export function getAllRewardsAtStreak(s) {
  const results = []
  POKEMON_REWARDS  .filter(r => r.streakReq === s && !r.perfectReq).forEach(r => results.push({ type:'pokemon', ...r }))
  FRAME_REWARDS    .filter(r => r.streakReq === s).forEach(r => results.push({ type:'frame',   ...r }))
  ACCESSORY_REWARDS.filter(r => r.streakReq === s && !r.perfectReq).forEach(r => results.push({ type:'acc',    ...r }))
  BG_REWARDS       .filter(r => r.streakReq === s).forEach(r => results.push({ type:'bg',      ...r }))
  TITLE_REWARDS    .filter(r => r.streakReq === s && !r.perfectReq).forEach(r => results.push({ type:'title',  ...r }))
  EFFECT_REWARDS   .filter(r => r.streakReq === s).forEach(r => results.push({ type:'effect',  ...r }))
  return results
}

/** アイテムが解放済みかどうか */
export function isUnlocked(item, streak, perfect = 0) {
  const sOk = (item.streakReq || 0) <= streak
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
