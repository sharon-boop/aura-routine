import { useState } from 'react'
import { getAchievements } from '../utils/storage'

/* ─── Pokemon HOME 3Dスプライト ─── */
const SPRITE_3D = (id) =>
  `https://raw.githubusercontent.com/PokeAPI/sprites/master/sprites/pokemon/other/home/${id}.png`

/* ─── キャラクター定義 ─── */
export const CHARACTERS = [
  { id:'togepi',   pokeId:175, name:'タマゴ',    title:'眠っている',    minStreak:0,   maxStreak:0,   effect:'normal',          color:'#9A9A9A' },
  { id:'pichu',    pokeId:172, name:'ピチュー',   title:'目覚めた',      minStreak:1,   maxStreak:2,   effect:'normal',          color:'#E8C52A' },
  { id:'pikachu',  pokeId:25,  name:'ピカチュウ', title:'動き出した',    minStreak:3,   maxStreak:6,   effect:'gold',            color:'#DAA520' },
  { id:'raichu',   pokeId:26,  name:'ライチュウ', title:'力を蓄えた',    minStreak:7,   maxStreak:13,  effect:'silver',          color:'#A0A0B8' },
  { id:'eevee',    pokeId:133, name:'イーブイ',   title:'可能性が開いた', minStreak:14,  maxStreak:29,  effect:'rainbow',         color:'#6C63FF' },
  { id:'flareon',  pokeId:136, name:'ブースター', title:'炎が爆発した',  minStreak:30,  maxStreak:59,  effect:'rainbow-sparkle', color:'#E85D2A' },
  { id:'mewtwo',   pokeId:150, name:'ミュウツー', title:'覚醒した',      minStreak:60,  maxStreak:99,  effect:'legendary',       color:'#9C27B0' },
  { id:'arceus',   pokeId:493, name:'アルセウス', title:'伝説になった',  minStreak:100, maxStreak:Infinity, effect:'legendary',  color:'#FFD700' },
]

/* ─── フレームスタイル ─── */
const FRAMES = [
  { id:'none',    label:'なし',     style:{border:'1.5px solid #E8E2D8'},                         unlockAt:0  },
  { id:'gold',    label:'ゴールド', style:{border:'3px solid #FFD700',boxShadow:'0 0 16px #FFD70050'}, unlockAt:3  },
  { id:'silver',  label:'シルバー', style:{border:'3px solid #C0C0C0',boxShadow:'0 0 14px #C0C0C050'}, unlockAt:7  },
  { id:'neon',    label:'ネオン',   style:{border:'2px solid #6C63FF',boxShadow:'0 0 20px #6C63FF60,0 0 40px #6C63FF20'}, unlockAt:14 },
  { id:'fire',    label:'炎',       style:{border:'3px solid #E85D2A',boxShadow:'0 0 20px #E85D2A60'}, unlockAt:30 },
  { id:'rainbow', label:'虹',       style:{border:'3px solid transparent',backgroundClip:'padding-box', outline:'3px solid transparent'}, unlockAt:60, isRainbow:true },
]

/* ─── アクセサリー ─── */
const ACCESSORIES = [
  { id:'none',     label:'なし',       emoji:'',   pos:{top:'-8px',right:'-8px'},   unlockAt:0  },
  { id:'crown',    label:'王冠',       emoji:'👑', pos:{top:'-14px',left:'50%',transform:'translateX(-50%)'}, unlockAt:3  },
  { id:'lightning',label:'雷',         emoji:'⚡', pos:{top:'-8px',right:'-10px'},  unlockAt:7  },
  { id:'fire',     label:'炎',         emoji:'🔥', pos:{bottom:'-10px',right:'-8px'}, unlockAt:14 },
  { id:'star',     label:'スター',     emoji:'🌟', pos:{top:'-10px',right:'-10px'}, unlockAt:30 },
  { id:'diamond',  label:'ダイヤ',     emoji:'💎', pos:{top:'-10px',left:'-8px'},   unlockAt:60 },
  { id:'trophy',   label:'トロフィー', emoji:'🏆', pos:{bottom:'-10px',left:'-8px'}, unlockAt:100 },
]

/* ─── 背景テーマ ─── */
const BG_THEMES = [
  { id:'default',  label:'デフォルト', bg:'#FAFAF7',       unlockAt:0  },
  { id:'dark',     label:'ダーク',     bg:'#1A1A2E',       unlockAt:3  },
  { id:'sunset',   label:'サンセット', bg:'linear-gradient(135deg,#FF9A9E,#FECFEF)', unlockAt:7  },
  { id:'ocean',    label:'オーシャン', bg:'linear-gradient(135deg,#A1C4FD,#C2E9FB)', unlockAt:14 },
  { id:'forest',   label:'フォレスト', bg:'linear-gradient(135deg,#D4FC79,#96E6A1)', unlockAt:30 },
  { id:'galaxy',   label:'ギャラクシー',bg:'linear-gradient(135deg,#0F0C29,#302B63,#24243E)', unlockAt:60 },
  { id:'legendary',label:'伝説',       bg:'linear-gradient(135deg,#f6d365,#fda085,#f093fb)', unlockAt:100 },
]

const STORAGE_KEY = 'auraCustomize'
function loadCustomize() {
  try { return JSON.parse(localStorage.getItem(STORAGE_KEY)) || {} } catch { return {} }
}
function saveCustomize(data) {
  localStorage.setItem(STORAGE_KEY, JSON.stringify(data))
}

function getCharacter(streak) {
  return [...CHARACTERS].reverse().find(c => streak >= c.minStreak) || CHARACTERS[0]
}
function getNextCharacter(streak) {
  return CHARACTERS.find(c => c.minStreak > streak)
}

function EffectText({ text, effect, style = {} }) {
  if (effect === 'gold')   return <span className="aura-gold" style={style}>{text}</span>
  if (effect === 'silver') return <span className="aura-silver" style={style}>{text}</span>
  if (['rainbow','rainbow-sparkle','legendary'].includes(effect))
    return <span className="aura-rainbow" style={style}>{text}</span>
  return <span style={style}>{text}</span>
}

function Sparkles() {
  const pts = [
    {top:'8%',left:'12%',delay:'0s',size:13},
    {top:'18%',left:'78%',delay:'0.5s',size:10},
    {top:'65%',left:'6%',delay:'0.9s',size:12},
    {top:'72%',left:'84%',delay:'0.3s',size:15},
    {top:'38%',left:'90%',delay:'1.2s',size:9},
    {top:'82%',left:'28%',delay:'0.7s',size:11},
  ]
  return <>
    {pts.map((p,i) => (
      <div key={i} className="sparkle-star" style={{position:'absolute',top:p.top,left:p.left,fontSize:p.size,animationDelay:p.delay,pointerEvents:'none',zIndex:0}}>✦</div>
    ))}
  </>
}

/* ─── 着せ替えパネル ─── */
function CustomizePanel({ streak, current, onSave, onClose }) {
  const [frame, setFrame]  = useState(current.frame  || 'none')
  const [acc, setAcc]      = useState(current.acc    || 'none')
  const [bg, setBg]        = useState(current.bg     || 'default')

  const Section = ({ title, items, selected, onSelect, type }) => (
    <div style={{ marginBottom:20 }}>
      <div style={{ fontSize:11,fontWeight:700,letterSpacing:1.5,textTransform:'uppercase',color:'#AAA',marginBottom:10 }}>{title}</div>
      <div style={{ display:'flex',flexWrap:'wrap',gap:8 }}>
        {items.map(item => {
          const unlocked = streak >= item.unlockAt
          const active   = selected === item.id
          return (
            <button key={item.id} disabled={!unlocked} onClick={() => unlocked && onSelect(item.id)}
              style={{
                padding:'8px 14px', borderRadius:10, fontSize:13, fontWeight:700,
                border: active ? '2px solid #151515' : '1.5px solid #E0E0E0',
                background: active ? '#151515' : unlocked ? '#fff' : '#F5F5F5',
                color: active ? '#fff' : unlocked ? '#333' : '#CCC',
                cursor: unlocked ? 'pointer' : 'not-allowed',
                fontFamily:'inherit', display:'flex', alignItems:'center', gap:5,
              }}>
              {item.emoji && <span>{item.emoji}</span>}
              {item.label}
              {!unlocked && <span style={{fontSize:10}}>🔒{item.unlockAt}日</span>}
            </button>
          )
        })}
      </div>
    </div>
  )

  return (
    <div className="modal-overlay" onClick={onClose}>
      <div className="modal-sheet" onClick={e => e.stopPropagation()}>
        <div className="modal-handle" />
        <div style={{ fontWeight:900,fontSize:18,marginBottom:20,letterSpacing:-0.5 }}>着せ替え</div>

        <Section title="フレーム"       items={FRAMES}      selected={frame} onSelect={setFrame} />
        <Section title="アクセサリー"   items={ACCESSORIES} selected={acc}   onSelect={setAcc}   />
        <Section title="背景テーマ"     items={BG_THEMES}   selected={bg}    onSelect={setBg}    />

        <button
          onClick={() => { saveCustomize({frame,acc,bg}); onSave({frame,acc,bg}) }}
          style={{ width:'100%',padding:'14px',background:'#151515',color:'#fff',border:'none',borderRadius:14,fontSize:15,fontWeight:700,cursor:'pointer',fontFamily:'inherit' }}
        >
          保存
        </button>
      </div>
    </div>
  )
}

/* ─── メイン ─── */
export default function AuraCharacter({ streak }) {
  const [showDetail,    setShowDetail]    = useState(false)
  const [showCustomize, setShowCustomize] = useState(false)
  const [customize,     setCustomize]     = useState(loadCustomize)

  const char = getCharacter(streak)
  const next = getNextCharacter(streak)
  const achievements = getAchievements()
  const hasSparkle = ['rainbow-sparkle','legendary'].includes(char.effect)

  const progressPct = next
    ? Math.round(((streak - char.minStreak) / (next.minStreak - char.minStreak)) * 100)
    : 100

  const frameStyle = FRAMES.find(f => f.id === (customize.frame || 'none'))
  const accDef     = ACCESSORIES.find(a => a.id === (customize.acc || 'none'))
  const bgDef      = BG_THEMES.find(b => b.id === (customize.bg || 'default'))

  const cardBg = bgDef?.bg || '#FAFAF7'
  const isDark = ['dark','galaxy'].includes(customize.bg)

  return (
    <div className="sec" style={{ paddingTop:0 }}>
      <div className="sec-title">MY AURA</div>

      <div
        className={`aura-char-card ${char.effect} ${frameStyle?.isRainbow ? 'rainbow-border' : ''}`}
        style={{
          background: cardBg,
          ...(frameStyle?.style || {}),
          position:'relative', overflow:'hidden', cursor:'pointer',
        }}
        onClick={() => setShowDetail(s => !s)}
      >
        {hasSparkle && <Sparkles />}

        <div style={{ display:'flex', alignItems:'center', gap:16, position:'relative', zIndex:1 }}>
          {/* ポケモン3D画像 */}
          <div className={`aura-poke-wrap ${char.effect}`} style={{ position:'relative' }}>
            <img
              src={SPRITE_3D(char.pokeId)}
              alt={char.name}
              className="aura-poke-img"
              loading="lazy"
            />
            {accDef && accDef.emoji && (
              <div style={{ position:'absolute', fontSize:22, lineHeight:1, ...accDef.pos }}>
                {accDef.emoji}
              </div>
            )}
          </div>

          <div style={{ flex:1, minWidth:0 }}>
            <div style={{ fontSize:10, fontWeight:700, letterSpacing:2, textTransform:'uppercase', color: isDark ? 'rgba(255,255,255,0.5)' : char.color, marginBottom:3 }}>
              {streak}日連続 · {char.title}
            </div>
            <EffectText
              text={char.name}
              effect={char.effect}
              style={{ fontSize:24, fontWeight:900, letterSpacing:-0.5, display:'block', lineHeight:1.1, color: isDark ? '#fff' : undefined }}
            />
            <div style={{ fontSize:12, color: isDark ? 'rgba(255,255,255,0.45)' : '#888', marginTop:5, lineHeight:1.5 }}>
              {next ? `あと${next.minStreak - streak}日で ${next.name} に進化` : '神の領域に達した'}
            </div>
          </div>

          <button
            onClick={e => { e.stopPropagation(); setShowCustomize(true) }}
            style={{
              padding:'6px 12px', borderRadius:8, fontSize:11, fontWeight:700,
              border:`1.5px solid ${isDark ? 'rgba(255,255,255,0.2)' : '#E0E0E0'}`,
              background: isDark ? 'rgba(255,255,255,0.08)' : '#fff',
              color: isDark ? '#fff' : '#555',
              cursor:'pointer', fontFamily:'inherit', flexShrink:0,
            }}
          >
            着替え
          </button>
        </div>

        {/* 進化バー */}
        {next && (
          <div style={{ marginTop:14, position:'relative', zIndex:1 }}>
            <div style={{ background:'rgba(0,0,0,0.08)', borderRadius:99, height:6, overflow:'hidden' }}>
              <div style={{ height:'100%', borderRadius:99, width:`${progressPct}%`, background:char.color, transition:'width 1s ease' }} />
            </div>
          </div>
        )}
      </div>

      {/* ギャラリー */}
      {showDetail && (
        <div className="aura-detail-card" style={{ animation:'slideDown 0.2s ease' }}>
          <div style={{ fontSize:11, fontWeight:700, letterSpacing:1.5, color:'#AAA', textTransform:'uppercase', marginBottom:14 }}>Evolution Gallery</div>
          <div style={{ display:'grid', gridTemplateColumns:'repeat(4,1fr)', gap:10 }}>
            {CHARACTERS.map(c => {
              const unlocked = streak >= c.minStreak
              const current  = c.id === char.id
              return (
                <div key={c.id} style={{
                  padding:'10px 6px', borderRadius:14, textAlign:'center',
                  background: current ? '#F7F1E8' : unlocked ? '#F8F8F8' : '#F0F0F0',
                  border:`2px solid ${current ? c.color : unlocked ? '#E0E0E0' : '#EBEBEB'}`,
                  opacity: unlocked ? 1 : 0.45, position:'relative',
                }}>
                  {unlocked
                    ? <img src={SPRITE_3D(c.pokeId)} alt={c.name} style={{ width:44,height:44,objectFit:'contain' }} loading="lazy" />
                    : <div style={{ width:44,height:44,margin:'0 auto',display:'flex',alignItems:'center',justifyContent:'center',fontSize:22 }}>🔒</div>
                  }
                  <div style={{ fontSize:9, fontWeight:700, color: unlocked ? c.color : '#CCC', marginTop:4 }}>
                    {unlocked ? c.name : `${c.minStreak}日〜`}
                  </div>
                  {current && <div style={{ position:'absolute',top:-5,right:-5,fontSize:12,background:c.color,color:'#fff',borderRadius:'50%',width:18,height:18,display:'flex',alignItems:'center',justifyContent:'center' }}>▶</div>}
                </div>
              )
            })}
          </div>

          {achievements.length > 0 && (
            <div style={{ marginTop:18 }}>
              <div style={{ fontSize:11, fontWeight:700, letterSpacing:1.5, color:'#AAA', textTransform:'uppercase', marginBottom:10 }}>Achievements</div>
              <div style={{ display:'flex', flexWrap:'wrap', gap:8 }}>
                {achievements.map(id => {
                  const MAP = {
                    first_day:{icon:'🌱',label:'はじめの一歩',color:'#84A98C'},
                    streak_3: {icon:'🔥',label:'3日',color:'#E8813A'},
                    streak_7: {icon:'⚡',label:'1週間',color:'#6C63FF'},
                    streak_14:{icon:'💎',label:'2週間',color:'#2196F3'},
                    streak_30:{icon:'👑',label:'1ヶ月',color:'#DAA520'},
                    streak_60:{icon:'🌟',label:'2ヶ月',color:'#E85D2A'},
                    streak_100:{icon:'🏆',label:'100日',color:'#FFD700'},
                    perfect_1:{icon:'✨',label:'完璧×1',color:'#52B788'},
                    perfect_5:{icon:'🎯',label:'完璧×5',color:'#F06292'},
                    perfect_10:{icon:'🌈',label:'完璧×10',color:'#AB47BC'},
                  }
                  const def = MAP[id]; if (!def) return null
                  return (
                    <div key={id} style={{ background:def.color+'20', border:`1px solid ${def.color}50`, borderRadius:10, padding:'6px 12px', fontSize:12, fontWeight:700, color:def.color, display:'flex', alignItems:'center', gap:5 }}>
                      {def.icon} {def.label}
                    </div>
                  )
                })}
              </div>
            </div>
          )}

          <button onClick={() => setShowDetail(false)} style={{ width:'100%',marginTop:16,padding:'12px',background:'#F5F5F5',border:'none',borderRadius:12,fontSize:14,fontWeight:700,cursor:'pointer',fontFamily:'inherit' }}>
            閉じる
          </button>
        </div>
      )}

      {showCustomize && (
        <CustomizePanel
          streak={streak}
          current={customize}
          onSave={(data) => { setCustomize(data); setShowCustomize(false) }}
          onClose={() => setShowCustomize(false)}
        />
      )}
    </div>
  )
}
