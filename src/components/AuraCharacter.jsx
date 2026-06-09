import { useState, useEffect } from 'react'
import { getAchievements } from '../utils/storage'

/* ─── キャラクター定義 ─── */
export const CHARACTERS = [
  {
    id: 'egg',
    minStreak: 0, maxStreak: 0,
    emoji: '🥚',
    name: 'たまご',
    title: '眠っている',
    desc: 'まだ眠っている。\n最初の一歩を踏み出そう。',
    effect: 'normal',
    color: '#9A9A9A',
    bg: '#F5F5F5',
  },
  {
    id: 'hiyoko',
    minStreak: 1, maxStreak: 2,
    emoji: '🐣',
    name: 'めざめ',
    title: '目覚めた',
    desc: '殻を破った。\n新しい自分が始まる。',
    effect: 'normal',
    color: '#E8813A',
    bg: '#FFF7EC',
  },
  {
    id: 'chick',
    minStreak: 3, maxStreak: 6,
    emoji: '🐥',
    name: 'ひよこ',
    title: '動き出した',
    desc: '3日続いた。\n金色の輝きが増してきた。',
    effect: 'gold',
    color: '#DAA520',
    bg: '#FFFBEC',
  },
  {
    id: 'bird',
    minStreak: 7, maxStreak: 13,
    emoji: '🐦',
    name: 'とり',
    title: '羽ばたいた',
    desc: '一週間の継続。\nシルバーの翼を手に入れた。',
    effect: 'silver',
    color: '#A0A0B0',
    bg: '#F5F5FA',
  },
  {
    id: 'eagle',
    minStreak: 14, maxStreak: 29,
    emoji: '🦅',
    name: 'わし',
    title: '高く飛んだ',
    desc: '二週間の覚悟。\n虹色のオーラを纏い始めた。',
    effect: 'rainbow',
    color: '#6C63FF',
    bg: '#F0F0FF',
  },
  {
    id: 'flame',
    minStreak: 30, maxStreak: 59,
    emoji: '🔥',
    name: 'ほのお',
    title: '燃え始めた',
    desc: '一ヶ月の本気。\n炎のオーラが爆発した。',
    effect: 'rainbow-sparkle',
    color: '#E85D2A',
    bg: '#FFF3EE',
  },
  {
    id: 'thunder',
    minStreak: 60, maxStreak: 99,
    emoji: '⚡',
    name: 'かみなり',
    title: '覚醒した',
    desc: '二ヶ月の継続。\n雷のオーラで世界を照らす。',
    effect: 'legendary',
    color: '#6C63FF',
    bg: '#F0F0FF',
  },
  {
    id: 'legend',
    minStreak: 100, maxStreak: Infinity,
    emoji: '👑',
    name: 'でんせつ',
    title: '伝説になった',
    desc: '100日の積み重ね。\nあなたはもう伝説だ。',
    effect: 'legendary',
    color: '#FFD700',
    bg: '#FFFBEC',
  },
]

function getCharacter(streak) {
  return CHARACTERS.slice().reverse().find(c => streak >= c.minStreak) || CHARACTERS[0]
}

function getNextCharacter(streak) {
  return CHARACTERS.find(c => c.minStreak > streak)
}

/* ─── エフェクト別テキストクラス ─── */
function EffectText({ text, effect, style = {} }) {
  if (effect === 'gold') {
    return <span className="aura-gold" style={style}>{text}</span>
  }
  if (effect === 'silver') {
    return <span className="aura-silver" style={style}>{text}</span>
  }
  if (effect === 'rainbow' || effect === 'rainbow-sparkle' || effect === 'legendary') {
    return <span className="aura-rainbow" style={style}>{text}</span>
  }
  return <span style={style}>{text}</span>
}

/* ─── スパークルパーティクル ─── */
function Sparkles() {
  const positions = [
    { top: '10%', left: '15%', delay: '0s',    size: 14 },
    { top: '20%', left: '80%', delay: '0.4s',  size: 10 },
    { top: '60%', left: '8%',  delay: '0.8s',  size: 12 },
    { top: '75%', left: '85%', delay: '0.2s',  size: 16 },
    { top: '40%', left: '92%', delay: '1.1s',  size: 9  },
    { top: '85%', left: '30%', delay: '0.6s',  size: 11 },
    { top: '5%',  left: '50%', delay: '1.4s',  size: 8  },
  ]
  return (
    <>
      {positions.map((p, i) => (
        <div key={i} className="sparkle-star" style={{
          position: 'absolute', top: p.top, left: p.left,
          fontSize: p.size, animationDelay: p.delay, pointerEvents: 'none',
        }}>✦</div>
      ))}
    </>
  )
}

/* ─── メインコンポーネント ─── */
export default function AuraCharacter({ streak }) {
  const [showDetail, setShowDetail] = useState(false)
  const char = getCharacter(streak)
  const next = getNextCharacter(streak)
  const achievements = getAchievements()
  const isLegendary = char.effect === 'legendary'
  const hasSparkle = char.effect === 'rainbow-sparkle' || isLegendary
  const perfectCount = parseInt(localStorage.getItem('perfectCount') || '0')

  return (
    <div className="sec" style={{ paddingTop: 0 }}>
      <div className="sec-title">MY AURA</div>
      <div
        className={`aura-char-card ${char.effect}`}
        style={{ background: char.bg, borderColor: char.color + '40', position: 'relative', overflow: 'hidden', cursor: 'pointer' }}
        onClick={() => setShowDetail(s => !s)}
      >
        {hasSparkle && <Sparkles />}

        {/* キャラクター本体 */}
        <div style={{ display: 'flex', alignItems: 'center', gap: 20, position: 'relative', zIndex: 1 }}>
          <div className={`aura-emoji-wrap ${char.effect}`}>
            <div className="aura-emoji">{char.emoji}</div>
          </div>
          <div style={{ flex: 1 }}>
            <div style={{ fontSize: 10, fontWeight: 700, letterSpacing: 2, textTransform: 'uppercase', color: char.color, marginBottom: 4 }}>
              {streak}日連続 · {char.title}
            </div>
            <EffectText
              text={char.name}
              effect={char.effect}
              style={{ fontSize: 26, fontWeight: 900, letterSpacing: -0.5, display: 'block', lineHeight: 1.1 }}
            />
            <div style={{ fontSize: 12, color: '#888', marginTop: 6, lineHeight: 1.5 }}>
              {char.desc.split('\n')[1]}
            </div>
          </div>
          <div style={{ fontSize: 20, color: char.color, opacity: 0.4 }}>{showDetail ? '▲' : '▼'}</div>
        </div>

        {/* 次のキャラまでのバー */}
        {next && (
          <div style={{ marginTop: 14, position: 'relative', zIndex: 1 }}>
            <div style={{ display: 'flex', justifyContent: 'space-between', fontSize: 10, fontWeight: 700, color: '#AAA', marginBottom: 5 }}>
              <span>次の進化まで</span>
              <span>あと{next.minStreak - streak}日</span>
            </div>
            <div style={{ background: 'rgba(0,0,0,0.07)', borderRadius: 99, height: 6, overflow: 'hidden' }}>
              <div style={{
                height: '100%', borderRadius: 99,
                width: `${((streak - char.minStreak) / (next.minStreak - char.minStreak)) * 100}%`,
                background: char.color,
                transition: 'width 1s ease',
              }} />
            </div>
            <div style={{ marginTop: 6, fontSize: 10, color: '#AAA', textAlign: 'right' }}>
              次：{next.emoji} {next.name}
            </div>
          </div>
        )}
        {!next && (
          <div style={{ marginTop: 12, textAlign: 'center', position: 'relative', zIndex: 1 }}>
            <EffectText text="— 伝説の域に達した —" effect={char.effect} style={{ fontSize: 12, fontWeight: 700 }} />
          </div>
        )}
      </div>

      {/* 詳細展開 */}
      {showDetail && (
        <div className="aura-detail-card" style={{ borderColor: char.color + '30' }}>
          <div style={{ fontSize: 11, fontWeight: 700, letterSpacing: 1.5, color: '#AAA', textTransform: 'uppercase', marginBottom: 14 }}>Character Gallery</div>
          <div style={{ display: 'flex', flexWrap: 'wrap', gap: 10 }}>
            {CHARACTERS.map(c => {
              const isUnlocked = streak >= c.minStreak
              const isCurrent = c.id === char.id
              return (
                <div key={c.id} style={{
                  flex: '1 1 calc(25% - 10px)', minWidth: 64,
                  padding: '10px 8px', borderRadius: 14,
                  background: isCurrent ? c.bg : isUnlocked ? '#F5F5F5' : '#EBEBEB',
                  border: `2px solid ${isCurrent ? c.color : isUnlocked ? '#DDD' : '#E5E5E5'}`,
                  textAlign: 'center', opacity: isUnlocked ? 1 : 0.4,
                  position: 'relative',
                }}>
                  <div style={{ fontSize: 26 }}>{isUnlocked ? c.emoji : '🔒'}</div>
                  <div style={{ fontSize: 9, fontWeight: 700, color: isUnlocked ? c.color : '#CCC', marginTop: 4, letterSpacing: 0.5 }}>
                    {isUnlocked ? c.name : `${c.minStreak}日〜`}
                  </div>
                  {isCurrent && <div style={{ position: 'absolute', top: -4, right: -4, fontSize: 10 }}>▶</div>}
                </div>
              )
            })}
          </div>

          {achievements.length > 0 && (
            <div style={{ marginTop: 18 }}>
              <div style={{ fontSize: 11, fontWeight: 700, letterSpacing: 1.5, color: '#AAA', textTransform: 'uppercase', marginBottom: 10 }}>Achievements</div>
              <div style={{ display: 'flex', flexWrap: 'wrap', gap: 8 }}>
                {achievements.map(id => {
                  const def = [
                    { id:'first_day', icon:'🌱', label:'はじめの一歩', color:'#84A98C' },
                    { id:'streak_3',  icon:'🔥', label:'3日',         color:'#E8813A' },
                    { id:'streak_7',  icon:'⚡', label:'1週間',       color:'#6C63FF' },
                    { id:'streak_14', icon:'💎', label:'2週間',       color:'#2196F3' },
                    { id:'streak_30', icon:'👑', label:'1ヶ月',       color:'#F7D87C' },
                    { id:'streak_60', icon:'🌟', label:'2ヶ月',       color:'#E85D2A' },
                    { id:'streak_100',icon:'🏆', label:'100日',       color:'#FFD700' },
                    { id:'perfect_1', icon:'✨', label:'完璧×1',      color:'#52B788' },
                    { id:'perfect_5', icon:'🎯', label:'完璧×5',      color:'#F06292' },
                    { id:'perfect_10',icon:'🌈', label:'完璧×10',     color:'#AB47BC' },
                  ].find(a => a.id === id)
                  if (!def) return null
                  return (
                    <div key={id} style={{
                      background: def.color + '20', border: `1px solid ${def.color}50`,
                      borderRadius: 10, padding: '6px 12px', fontSize: 12, fontWeight: 700,
                      color: def.color, display: 'flex', alignItems: 'center', gap: 6,
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
