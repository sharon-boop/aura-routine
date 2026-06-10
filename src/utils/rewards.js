/* ═══════════════════════════════════════════════════════════
   REWARD SYSTEM — 5日ごとに必ず何か解放
   streak: 連続日数  perfect: 100%達成回数
═══════════════════════════════════════════════════════════ */

const S = (id) => `https://raw.githubusercontent.com/PokeAPI/sprites/master/sprites/pokemon/other/home/${id}.png`

/* ─── ポケモン ─── */
export const POKEMON_REWARDS = [
  { id:'pichu',     pokeId:172, name:'ピチュー',    streakReq:0,   desc:'最初の仲間' },
  { id:'pikachu',   pokeId:25,  name:'ピカチュウ',  streakReq:3,   desc:'3日継続で解放' },
  { id:'raichu',    pokeId:26,  name:'ライチュウ',  streakReq:5,   desc:'5日継続で解放' },
  { id:'eevee',     pokeId:133, name:'イーブイ',    streakReq:7,   desc:'7日継続で解放' },
  { id:'vaporeon',  pokeId:134, name:'シャワーズ',  streakReq:10,  desc:'10日継続で解放' },
  { id:'jolteon',   pokeId:135, name:'サンダース',  streakReq:14,  desc:'2週間継続で解放' },
  { id:'flareon',   pokeId:136, name:'ブースター',  streakReq:15,  desc:'15日継続で解放' },
  { id:'espeon',    pokeId:196, name:'エーフィ',    streakReq:20,  desc:'20日継続で解放' },
  { id:'umbreon',   pokeId:197, name:'ブラッキー',  streakReq:25,  desc:'25日継続で解放' },
  { id:'glaceon',   pokeId:471, name:'グレイシア',  streakReq:30,  desc:'1ヶ月継続で解放' },
  { id:'leafeon',   pokeId:470, name:'リーフィア',  streakReq:35,  desc:'35日継続で解放' },
  { id:'sylveon',   pokeId:700, name:'ニンフィア',  streakReq:40,  desc:'40日継続で解放' },
  { id:'gengar',    pokeId:94,  name:'ゲンガー',    streakReq:45,  desc:'45日継続で解放' },
  { id:'lucario',   pokeId:448, name:'ルカリオ',    streakReq:50,  desc:'50日継続で解放' },
  { id:'gardevoir', pokeId:282, name:'サーナイト',  streakReq:55,  desc:'55日継続で解放' },
  { id:'mewtwo',    pokeId:150, name:'ミュウツー',  streakReq:60,  desc:'60日継続で解放' },
  { id:'charizard', pokeId:6,   name:'リザードン',  streakReq:65,  desc:'65日継続で解放' },
  { id:'rayquaza',  pokeId:384, name:'レックウザ',  streakReq:70,  desc:'70日継続で解放' },
  { id:'giratina',  pokeId:487, name:'ギラティナ',  streakReq:80,  desc:'80日継続で解放' },
  { id:'dialga',    pokeId:483, name:'ディアルガ',  streakReq:90,  desc:'90日継続で解放' },
  { id:'arceus',    pokeId:493, name:'アルセウス',  streakReq:100, desc:'100日継続で解放' },
  { id:'mew',       pokeId:151, name:'ミュウ',      streakReq:0,   perfectReq:1,  desc:'完璧1日達成で解放' },
  { id:'celebi',    pokeId:251, name:'セレビィ',    streakReq:0,   perfectReq:5,  desc:'完璧5日達成で解放' },
  { id:'jirachi',   pokeId:385, name:'ジラーチ',    streakReq:0,   perfectReq:10, desc:'完璧10日達成で解放' },
]

/* ─── フレーム ─── */
export const FRAME_REWARDS = [
  { id:'none',          label:'デフォルト',       streakReq:0,   cssClass:'frame-none',       preview:'#E8E2D8' },
  { id:'gold',          label:'ゴールド',          streakReq:3,   cssClass:'frame-gold',        preview:'#FFD700' },
  { id:'silver',        label:'シルバー',          streakReq:5,   cssClass:'frame-silver',      preview:'#C0C0C0' },
  { id:'neon-blue',     label:'ネオンブルー',      streakReq:7,   cssClass:'frame-neon-blue',   preview:'#4D96FF' },
  { id:'sunset',        label:'サンセット',        streakReq:10,  cssClass:'frame-sunset',      preview:'#FF6B6B' },
  { id:'mint',          label:'ミント',            streakReq:12,  cssClass:'frame-mint',        preview:'#6BCB77' },
  { id:'fire',          label:'炎',                streakReq:15,  cssClass:'frame-fire',        preview:'#E85D2A' },
  { id:'ice',           label:'アイス',            streakReq:20,  cssClass:'frame-ice',         preview:'#A1C4FD' },
  { id:'thunder',       label:'サンダー',          streakReq:25,  cssClass:'frame-thunder',     preview:'#FFD93D' },
  { id:'rainbow',       label:'レインボー',        streakReq:30,  cssClass:'frame-rainbow',     preview:'rainbow', isAnimated:true },
  { id:'rose-gold',     label:'ローズゴールド',    streakReq:35,  cssClass:'frame-rose-gold',   preview:'#E8A0A0' },
  { id:'galaxy',        label:'ギャラクシー',      streakReq:40,  cssClass:'frame-galaxy',      preview:'#302B63' },
  { id:'diamond',       label:'ダイヤ',            streakReq:45,  cssClass:'frame-diamond',     preview:'#B9F2FF', isAnimated:true },
  { id:'aurora',        label:'オーロラ',          streakReq:50,  cssClass:'frame-aurora',      preview:'aurora',  isAnimated:true },
  { id:'lava',          label:'マグマ',            streakReq:55,  cssClass:'frame-lava',        preview:'#FF4500', isAnimated:true },
  { id:'ocean',         label:'オーシャン',        streakReq:60,  cssClass:'frame-ocean',       preview:'#006994', isAnimated:true },
  { id:'holographic',   label:'ホログラフィック',  streakReq:70,  cssClass:'frame-holo',        preview:'holo',    isAnimated:true },
  { id:'nebula',        label:'ネビュラ',          streakReq:80,  cssClass:'frame-nebula',      preview:'nebula',  isAnimated:true },
  { id:'legendary',     label:'レジェンダリー',    streakReq:90,  cssClass:'frame-legendary',   preview:'#FFD700', isAnimated:true },
  { id:'godlike',       label:'神',                streakReq:100, cssClass:'frame-godlike',     preview:'god',     isAnimated:true },
]

/* ─── アクセサリー ─── */
export const ACCESSORY_REWARDS = [
  { id:'none',       label:'なし',         emoji:'',   streakReq:0,   pos:{} },
  { id:'crown',      label:'王冠',         emoji:'👑', streakReq:3,   pos:{top:'-16px',left:'50%',transform:'translateX(-50%)'} },
  { id:'lightning',  label:'雷',           emoji:'⚡', streakReq:5,   pos:{top:'-10px',right:'-12px'} },
  { id:'fire',       label:'炎',           emoji:'🔥', streakReq:7,   pos:{bottom:'-10px',right:'-10px'} },
  { id:'star',       label:'スター',       emoji:'🌟', streakReq:10,  pos:{top:'-10px',right:'-10px'} },
  { id:'ribbon',     label:'リボン',       emoji:'🎀', streakReq:12,  pos:{bottom:'-10px',left:'-8px'} },
  { id:'diamond',    label:'ダイヤ',       emoji:'💎', streakReq:15,  pos:{top:'-10px',left:'-8px'} },
  { id:'shield',     label:'シールド',     emoji:'🛡️', streakReq:20,  pos:{bottom:'-10px',left:'-10px'} },
  { id:'sword',      label:'ソード',       emoji:'⚔️', streakReq:25,  pos:{top:'-8px',right:'-8px'} },
  { id:'trophy',     label:'トロフィー',   emoji:'🏆', streakReq:30,  pos:{bottom:'-10px',right:'-8px'} },
  { id:'gem',        label:'ジェム',       emoji:'💠', streakReq:35,  pos:{top:'-10px',left:'50%',transform:'translateX(-50%)'} },
  { id:'wings',      label:'翼',           emoji:'🪽', streakReq:40,  pos:{bottom:'-12px',left:'50%',transform:'translateX(-50%)'} },
  { id:'infinity',   label:'∞',           emoji:'♾️', streakReq:50,  pos:{top:'-8px',left:'-10px'} },
  { id:'dragon',     label:'ドラゴン',     emoji:'🐉', streakReq:60,  pos:{top:'-12px',right:'-12px'} },
  { id:'universe',   label:'宇宙',         emoji:'🌌', streakReq:100, pos:{bottom:'-12px',right:'-12px'} },
]

/* ─── 背景テーマ ─── */
export const BG_REWARDS = [
  { id:'cream',     label:'クリーム',     bg:'#FAFAF7',                                          streakReq:0   },
  { id:'dark',      label:'ダーク',       bg:'#1A1A2E',                                          streakReq:3   },
  { id:'sunset',    label:'サンセット',   bg:'linear-gradient(135deg,#FF9A9E,#FECFEF)',          streakReq:5   },
  { id:'ocean',     label:'オーシャン',   bg:'linear-gradient(135deg,#A1C4FD,#C2E9FB)',          streakReq:7   },
  { id:'forest',    label:'フォレスト',   bg:'linear-gradient(135deg,#D4FC79,#96E6A1)',          streakReq:10  },
  { id:'sakura',    label:'サクラ',       bg:'linear-gradient(135deg,#FFCCE7,#FFA8D9)',          streakReq:12  },
  { id:'lemon',     label:'レモン',       bg:'linear-gradient(135deg,#FFF176,#FFD54F)',          streakReq:15  },
  { id:'midnight',  label:'ミッドナイト', bg:'linear-gradient(135deg,#0F2027,#203A43,#2C5364)',  streakReq:20  },
  { id:'aurora',    label:'オーロラ',     bg:'linear-gradient(135deg,#00C9FF,#92FE9D)',          streakReq:25  },
  { id:'volcano',   label:'ボルカノ',     bg:'linear-gradient(135deg,#FF416C,#FF4B2B)',          streakReq:30  },
  { id:'galaxy',    label:'ギャラクシー', bg:'linear-gradient(135deg,#0F0C29,#302B63,#24243E)',  streakReq:40  },
  { id:'hologram',  label:'ホログラム',   bg:'linear-gradient(135deg,#f6d365,#fda085)',          streakReq:50  },
  { id:'nebula',    label:'ネビュラ',     bg:'linear-gradient(135deg,#4776E6,#8E54E9)',          streakReq:60  },
  { id:'legendary', label:'伝説',         bg:'linear-gradient(135deg,#f6d365,#fda085,#f093fb)', streakReq:100 },
]

/* ─── 称号 ─── */
export const TITLE_REWARDS = [
  { id:'beginner',   label:'新人',         streakReq:0,   perfectReq:0,  color:'#9A9A9A' },
  { id:'starter',    label:'始動者',       streakReq:1,   perfectReq:0,  color:'#84A98C' },
  { id:'day3',       label:'3日の戦士',    streakReq:3,   perfectReq:0,  color:'#E8813A' },
  { id:'day5',       label:'5日の継続者',  streakReq:5,   perfectReq:0,  color:'#DAA520' },
  { id:'day7',       label:'一週間の挑戦者',streakReq:7,  perfectReq:0,  color:'#6C63FF' },
  { id:'day10',      label:'10日の覚悟',   streakReq:10,  perfectReq:0,  color:'#2196F3' },
  { id:'day14',      label:'二週間の証',   streakReq:14,  perfectReq:0,  color:'#00BCD4' },
  { id:'day20',      label:'習慣の守護者', streakReq:20,  perfectReq:0,  color:'#009688' },
  { id:'day25',      label:'四半期の強者', streakReq:25,  perfectReq:0,  color:'#4CAF50' },
  { id:'day30',      label:'一ヶ月の本気', streakReq:30,  perfectReq:0,  color:'#FFD700' },
  { id:'day40',      label:'40日の鋼鉄',   streakReq:40,  perfectReq:0,  color:'#FF9800' },
  { id:'day50',      label:'50日の伝説',   streakReq:50,  perfectReq:0,  color:'#FF5722' },
  { id:'day60',      label:'二ヶ月の覚醒', streakReq:60,  perfectReq:0,  color:'#9C27B0' },
  { id:'day70',      label:'継続の神',     streakReq:70,  perfectReq:0,  color:'#E91E63' },
  { id:'day80',      label:'80日の不屈',   streakReq:80,  perfectReq:0,  color:'#F44336' },
  { id:'day90',      label:'90日の鬼神',   streakReq:90,  perfectReq:0,  color:'#E85D2A' },
  { id:'day100',     label:'百日の伝説',   streakReq:100, perfectReq:0,  color:'#FFD700', rainbow:true },
  { id:'perfect1',   label:'完璧主義者',   streakReq:0,   perfectReq:1,  color:'#52B788' },
  { id:'perfect5',   label:'完璧の使徒',   streakReq:0,   perfectReq:5,  color:'#F06292' },
  { id:'perfect10',  label:'完全燃焼',     streakReq:0,   perfectReq:10, color:'#AB47BC', rainbow:true },
]

/* ─── エフェクト ─── */
export const EFFECT_REWARDS = [
  { id:'none',      label:'なし',           streakReq:0,   cssClass:'effect-none' },
  { id:'pulse',     label:'パルス',         streakReq:5,   cssClass:'effect-pulse' },
  { id:'gold-glow', label:'ゴールドグロー', streakReq:10,  cssClass:'effect-gold-glow' },
  { id:'silver',    label:'シルバーシマー', streakReq:15,  cssClass:'effect-silver' },
  { id:'fire-aura', label:'炎オーラ',       streakReq:20,  cssClass:'effect-fire-aura' },
  { id:'ice-aura',  label:'アイスオーラ',   streakReq:25,  cssClass:'effect-ice-aura' },
  { id:'rainbow',   label:'レインボー',     streakReq:30,  cssClass:'effect-rainbow' },
  { id:'sparkle',   label:'キラキラ',       streakReq:40,  cssClass:'effect-sparkle' },
  { id:'lightning', label:'雷エフェクト',   streakReq:50,  cssClass:'effect-lightning' },
  { id:'legendary', label:'レジェンダリー', streakReq:100, cssClass:'effect-legendary' },
]

/* ─── 全報酬リスト（タイムライン用）─── */
export function getAllRewardsAtStreak(s) {
  const rewards = []
  POKEMON_REWARDS   .filter(r => (r.streakReq||0) === s && !r.perfectReq).forEach(r => rewards.push({type:'pokemon',  ...r}))
  FRAME_REWARDS     .filter(r => r.streakReq === s).forEach(r => rewards.push({type:'frame',    ...r}))
  ACCESSORY_REWARDS .filter(r => r.streakReq === s && !r.perfectReq).forEach(r => rewards.push({type:'acc',      ...r}))
  BG_REWARDS        .filter(r => r.streakReq === s).forEach(r => rewards.push({type:'bg',       ...r}))
  TITLE_REWARDS     .filter(r => r.streakReq === s && !r.perfectReq).forEach(r => rewards.push({type:'title',    ...r}))
  EFFECT_REWARDS    .filter(r => r.streakReq === s).forEach(r => rewards.push({type:'effect',   ...r}))
  return rewards
}

export function isUnlocked(item, streak, perfect = 0) {
  const sOk = (item.streakReq || 0) <= streak
  const pOk = !item.perfectReq || item.perfectReq <= perfect
  return sOk && pOk
}

const EQ_KEY = 'auraEquipped2'
export function getEquipped() {
  try { return JSON.parse(localStorage.getItem(EQ_KEY)) || {} } catch { return {} }
}
export function saveEquipped(data) {
  localStorage.setItem(EQ_KEY, JSON.stringify(data))
}
