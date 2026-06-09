import { useState } from 'react'
import { getAchievements } from '../utils/storage'

const SPRITE = (id) => `https://raw.githubusercontent.com/PokeAPI/sprites/master/sprites/pokemon/other/official-artwork/${id}.png`

export const CHARACTERS = [
  {
    id: 'togepi',    pokeId: 175,
    name: 'タマゴ',  title: '眠っている',
    minStreak: 0,   maxStreak: 0,
    desc: 'まだ眠っている。最初の一歩を踏み出そう。',
    effect: 'normal', color: '#9A9A9A', bg: '#F5F5F5',
  },
  {
    id: 'pichu',     pokeId: 172,
    name: 'ピチュー', title: '目覚めた',
    minStreak: 1,   maxStreak: 2,
    desc: '殻を破った。新しい自分が始まる。',
    effect: 'normal', color: '#E8C52A', bg: '#FFFBEC',
  },
  {
    id: 'pikachu',   pokeId: 25,
    name: 'ピカチュウ', title: '動き出した',
    minStreak: 3,   maxStreak: 6,
    desc: '3日続いた。黄金の電撃が宿り始めた。',
    effect: 'gold', color: '#DAA520', bg: '#FFFBEC',
  },
  {
    id: 'raichu',    pokeId: 26,
    name: 'ライチュウ', title: '力を蓄えた',
    minStreak: 7,   maxStreak: 13,
    desc: '一週間の継続。シルバーのオーラを纏った。',
    effect: 'silver', color: '#A0A0B8', bg: '#F5F5FA',
  },
  {
    id: 'eevee',     pokeId: 133,
    name: 'イーブイ', title: '可能性が開いた',
    minStreak: 14,  maxStreak: 29,
    desc: '二週間の覚悟。無限の可能性が虹色に輝く。',
    effect: 'rainbow', color: '#6C63FF', bg: '#F0F0FF',
  },
  {
    id: 'flareon',   pokeId: 136,
    name: 'ブースター', title: '炎が爆発した',
    minStreak: 30,  maxStreak: 59,
    desc: '一ヶ月の本気。魂の炎が溢れ出した。',
    effect: 'rainbow-sparkle', color: '#E85D2A', bg: '#FFF3EE',
  },
  {
    id: 'mewtwo',    pokeId: 150,
    name: 'ミュウツー', title: '覚醒した',
    minStreak: 60,  maxStreak: 99,
    desc: '二ヶ月の継続。伝説の域に足を踏み入れた。',
    effect: 'legendary', color: '#9C27B0', bg: '#F5F0FF',
  },
  {
    id: 'arceus',    pokeId: 493,
    name: 'アルセウス', title: '伝説になった',
    minStreak: 100, maxStreak: Infinity,
    desc: '100日の積み重ね。あなたはもう神の領域だ。',
    effect: 'legendary', color: '#FFD700', bg: '#FFFBEC',
  },
]

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
    {top:'4%',left:'52%',delay:'1.5s',size:8},
  ]
  return <>
    {pts.map((p,i) => (
      <div key={i} className="sparkle-star" style={{position:'absolute',top:p.top,left:p.left,fontSize:p.size,animationDelay:p.delay,pointerEvents:'none',zIndex:0}}>✦</div>
    ))}
  </>
}

export default function AuraCharacter({ streak }) {
  const [showDetail, setShowDetail] = useState(false)
  const char = getCharacter(streak)
  const next = getNextCharacter(streak)
  const achievements = getAchievements()
  const hasSparkle = ['rainbow-sparkle','legendary'].includes(char.effect)

  const progressPct = next
    ? Math.round(((streak - char.minStreak) / (next.minStreak - char.minStreak)) * 100)
    : 100

  return (
    <div className="sec" style={{ paddingTop: 0 }}>
      <div className="sec-title">MY AURA</div>

      <div
        className={`aura-char-card ${char.effect}`}
        style={{ background: char.bg, borderColor: char.color + '50', position:'relative', overflow:'hidden', cursor:'pointer' }}
        onClick={() => setShowDetail(s => !s)}
      >
        {hasSparkle && <Sparkles />}

        <div style={{ display:'flex', alignItems:'center', gap:16, position:'relative', zIndex:1 }}>
          {/* ポケモン画像 */}
          <div className={`aura-poke-wrap ${char.effect}`}>
            <img
              src={SPRITE(char.pokeId)}
              alt={char.name}
              className="aura-poke-img"
              loading="lazy"
            />
          </div>

          <div style={{ flex:1, minWidth:0 }}>
            <div style={{ fontSize:10, fontWeight:700, letterSpacing:2, textTransform:'uppercase', color:char.color, marginBottom:3 }}>
              {streak}日連続 · {char.title}
            </div>
            <EffectText
              text={char.name}
              effect={char.effect}
              style={{ fontSize:24, fontWeight:900, letterSpacing:-0.5, display:'block', lineHeight:1.1 }}
            />
            <div style={{ fontSize:12, color:'#888', marginTop:5, lineHeight:1.5 }}>{char.desc.split('。')[1] || ''}</div>
          </div>

          <div style={{ fontSize:18, color:char.color, opacity:0.5, flexShrink:0 }}>{showDetail ? '▲' : '▼'}</div>
        </div>

        {/* 進化バー */}
        {next && (
          <div style={{ marginTop:14, position:'relative', zIndex:1 }}>
            <div style={{ display:'flex', justifyContent:'space-between', fontSize:10, fontWeight:700, color:'#AAA', marginBottom:5 }}>
              <span>次の進化まで</span>
              <span>あと {next.minStreak - streak}日 → {next.name}</span>
            </div>
            <div style={{ background:'rgba(0,0,0,0.08)', borderRadius:99, height:7, overflow:'hidden' }}>
              <div style={{ height:'100%', borderRadius:99, width:`${progressPct}%`, background:char.color, transition:'width 1s ease' }} />
            </div>
          </div>
        )}
        {!next && (
          <div style={{ marginTop:10, textAlign:'center', position:'relative', zIndex:1 }}>
            <EffectText text="— 神の領域に達した —" effect={char.effect} style={{ fontSize:12, fontWeight:700 }} />
          </div>
        )}
      </div>

      {/* ギャラリー展開 */}
      {showDetail && (
        <div className="aura-detail-card" style={{ borderColor: char.color + '30' }}>
          <div style={{ fontSize:11, fontWeight:700, letterSpacing:1.5, color:'#AAA', textTransform:'uppercase', marginBottom:14 }}>Evolution Gallery</div>
          <div style={{ display:'grid', gridTemplateColumns:'repeat(4, 1fr)', gap:10 }}>
            {CHARACTERS.map(c => {
              const unlocked = streak >= c.minStreak
              const current  = c.id === char.id
              return (
                <div key={c.id} style={{
                  padding:'10px 6px', borderRadius:14, textAlign:'center',
                  background: current ? c.bg : unlocked ? '#F8F8F8' : '#F0F0F0',
                  border:`2px solid ${current ? c.color : unlocked ? '#E0E0E0' : '#EBEBEB'}`,
                  opacity: unlocked ? 1 : 0.45,
                  position:'relative',
                }}>
                  {unlocked
                    ? <img src={SPRITE(c.pokeId)} alt={c.name} style={{ width:44, height:44, objectFit:'contain' }} loading="lazy" />
                    : <div style={{ width:44, height:44, margin:'0 auto', display:'flex', alignItems:'center', justifyContent:'center', fontSize:22 }}>🔒</div>
                  }
                  <div style={{ fontSize:9, fontWeight:700, color: unlocked ? c.color : '#CCC', marginTop:4 }}>
                    {unlocked ? c.name : `${c.minStreak}日〜`}
                  </div>
                  {current && <div style={{ position:'absolute', top:-5, right:-5, fontSize:12, background:c.color, color:'#fff', borderRadius:'50%', width:18, height:18, display:'flex', alignItems:'center', justifyContent:'center' }}>▶</div>}
                </div>
              )
            })}
          </div>

          {achievements.length > 0 && (
            <div style={{ marginTop:18 }}>
              <div style={{ fontSize:11, fontWeight:700, letterSpacing:1.5, color:'#AAA', textTransform:'uppercase', marginBottom:10 }}>Achievements</div>
              <div style={{ display:'flex', flexWrap:'wrap', gap:8 }}>
                {achievements.map(id => {
                  const DEFS = {
                    first_day: {icon:'🌱',label:'はじめの一歩',color:'#84A98C'},
                    streak_3:  {icon:'🔥',label:'3日',color:'#E8813A'},
                    streak_7:  {icon:'⚡',label:'1週間',color:'#6C63FF'},
                    streak_14: {icon:'💎',label:'2週間',color:'#2196F3'},
                    streak_30: {icon:'👑',label:'1ヶ月',color:'#DAA520'},
                    streak_60: {icon:'🌟',label:'2ヶ月',color:'#E85D2A'},
                    streak_100:{icon:'🏆',label:'100日',color:'#FFD700'},
                    perfect_1: {icon:'✨',label:'完璧×1',color:'#52B788'},
                    perfect_5: {icon:'🎯',label:'完璧×5',color:'#F06292'},
                    perfect_10:{icon:'🌈',label:'完璧×10',color:'#AB47BC'},
                  }
                  const def = DEFS[id]
                  if (!def) return null
                  return (
                    <div key={id} style={{
                      background:def.color+'20', border:`1px solid ${def.color}50`,
                      borderRadius:10, padding:'6px 12px', fontSize:12, fontWeight:700,
                      color:def.color, display:'flex', alignItems:'center', gap:5,
                    }}>
                      {def.icon} {def.label}
                    </div>
                  )
                })}
              </div>
            </div>
          )}
        </div>
      )}
    </div>
  )
}
