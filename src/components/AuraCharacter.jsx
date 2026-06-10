import { useState, useEffect, useRef } from 'react'
import {
  POKEMON_REWARDS, FRAME_REWARDS, ACCESSORY_REWARDS,
  BG_REWARDS, TITLE_REWARDS, EFFECT_REWARDS,
  getAllRewardsAtStreak, isUnlocked,
  getEquipped, saveEquipped,
} from '../utils/rewards'

const SPRITE = (id) => `https://raw.githubusercontent.com/PokeAPI/sprites/master/sprites/pokemon/other/home/${id}.png`

/* ─── Sparkle Particles ─── */
function Sparkles({ count = 6 }) {
  const stars = useRef(
    Array.from({ length: count }).map(() => ({
      left: `${10 + Math.random() * 80}%`,
      top:  `${10 + Math.random() * 80}%`,
      delay: `${(Math.random() * 1.8).toFixed(1)}s`,
      size: `${8 + Math.floor(Math.random() * 8)}px`,
    }))
  )
  return (
    <div className="sparkle-container" aria-hidden>
      {stars.current.map((s, i) => (
        <span key={i} className="sparkle-star" style={{
          left: s.left, top: s.top,
          animationDelay: s.delay, fontSize: s.size,
        }}>✦</span>
      ))}
    </div>
  )
}

/* ─── Reward Unlock Toast ─── */
export function RewardToast({ rewards, onClose }) {
  const [idx, setIdx] = useState(0)
  if (!rewards || rewards.length === 0) return null
  const r = rewards[idx]
  const typeLabel = {
    pokemon:'ポケモン', frame:'フレーム', acc:'アクセサリー',
    bg:'背景テーマ', title:'称号', effect:'エフェクト'
  }
  return (
    <div className="reward-toast-overlay" onClick={e => e.stopPropagation()}>
      <div className="reward-toast-card slide-up">
        <div className="reward-toast-badge">🎁 REWARD UNLOCKED</div>
        <div className="reward-toast-type">{typeLabel[r.type] || r.type}</div>
        <div className="reward-toast-name">{r.label || r.name}</div>
        {r.type === 'pokemon' && r.pokeId && (
          <img src={SPRITE(r.pokeId)} alt={r.name} className="reward-toast-poke" />
        )}
        {r.type === 'title' && (
          <div className="reward-toast-title-preview" style={{ color: r.color }}>{r.label}</div>
        )}
        <div className="reward-toast-desc">{r.desc || `${r.streakReq || r.perfectReq}日継続で解放`}</div>
        <div style={{ display:'flex', gap:10, marginTop:18 }}>
          {idx < rewards.length - 1
            ? <button className="btn btn-main" onClick={() => setIdx(i => i + 1)}>
                次の報酬 ({idx + 2}/{rewards.length})
              </button>
            : <button className="btn btn-main" onClick={onClose}>コレクションを見る ✨</button>
          }
        </div>
        <div style={{ fontSize:11, color:'var(--muted)', marginTop:10 }}>{idx + 1} / {rewards.length} 件</div>
      </div>
    </div>
  )
}

/* ─── Upcoming Rewards Preview（内容は???で隠す）─── */
function NextRewards({ streak }) {
  const upcoming = []
  for (let s = streak + 1; s <= streak + 20 && upcoming.length < 4; s++) {
    if (getAllRewardsAtStreak(s).length > 0) {
      upcoming.push({ daysLeft: s - streak, day: s })
    }
  }
  if (upcoming.length === 0) return null
  return (
    <div className="next-rewards-wrap">
      <div className="next-rewards-title">🔒 次の報酬まで</div>
      <div className="next-rewards-list">
        {upcoming.map((r, i) => (
          <div key={i} className="next-reward-item">
            <span className="next-reward-days">あと {r.daysLeft}日</span>
            <span className="next-reward-name next-reward-mystery">???</span>
          </div>
        ))}
      </div>
    </div>
  )
}

/* ─── Collection Item Card ─── */
function CollItem({ item, equipped, unlocked, type, onEquip }) {
  const isEq = equipped[type] === item.id

  // ロック中は内容を隠す（ミステリーロック）
  if (!unlocked) {
    const reqLabel = item.perfectReq
      ? `完璧${item.perfectReq}回`
      : item.streakReq === 0 ? '初期' : `${item.streakReq}日`
    return (
      <div className="coll-item coll-item-locked">
        <div className="coll-mystery-icon">🔒</div>
        <div className="coll-item-name" style={{ color:'#bbb' }}>???</div>
        <div className="coll-item-lock">{reqLabel}</div>
      </div>
    )
  }

  return (
    <div
      className={`coll-item ${isEq ? 'coll-item-equipped' : ''}`}
      onClick={() => onEquip(type, item.id)}
    >
      {type === 'pokemon' && (
        <img src={SPRITE(item.pokeId)} alt={item.name} className="coll-poke-img" />
      )}
      {type === 'frame' && (
        <div className={`coll-frame-preview ${item.cssClass}`} />
      )}
      {type === 'acc' && (
        <div className="coll-acc-emoji">{item.emoji || '—'}</div>
      )}
      {type === 'bg' && (
        <div className="coll-bg-preview" style={{ background: item.bg }} />
      )}
      {type === 'title' && (
        <div className="coll-title-label"
          style={{ color: item.color, fontWeight:800, fontSize:11 }}>
          {item.label}
        </div>
      )}
      {type === 'effect' && (
        <div className={`coll-effect-demo ${item.cssClass}`}>✦</div>
      )}
      <div className="coll-item-name">{item.name || item.label}</div>
      {isEq && <div className="coll-item-check">✓</div>}
    </div>
  )
}

/* ═══════════════════════════════════════════
   MAIN COMPONENT
═══════════════════════════════════════════ */
export default function AuraCharacter({ streak = 0, perfect = 0 }) {
  const [equipped, setEquipped] = useState(() => {
    const e = getEquipped()
    return {
      pokemon: e.pokemon || 'pichu',
      frame:   e.frame   || 'none',
      acc:     e.acc     || 'none',
      bg:      e.bg      || 'cream',
      title:   e.title   || 'beginner',
      effect:  e.effect  || 'none',
    }
  })
  const [tab, setTab]             = useState('home')
  const [collCat, setCollCat]     = useState('pokemon')
  const [newRewards, setNewRewards] = useState([])
  const [showToast, setShowToast]   = useState(false)
  const prevStreakRef = useRef(streak)

  /* Detect new streak unlocks */
  useEffect(() => {
    const prev = prevStreakRef.current
    if (streak > prev) {
      const unlocked = []
      for (let s = prev + 1; s <= streak; s++) {
        getAllRewardsAtStreak(s).forEach(r => unlocked.push(r))
      }
      if (unlocked.length > 0) { setNewRewards(unlocked); setShowToast(true) }
      prevStreakRef.current = streak
    }
  }, [streak])

  /* Detect perfect unlocks */
  useEffect(() => {
    const prev = parseInt(localStorage.getItem('_prevPerfect') || '0')
    if (perfect > prev) {
      const unlocked = []
      POKEMON_REWARDS.filter(r => r.perfectReq && r.perfectReq <= perfect && r.perfectReq > prev)
        .forEach(r => unlocked.push({ type:'pokemon', ...r }))
      TITLE_REWARDS.filter(r => r.perfectReq && r.perfectReq <= perfect && r.perfectReq > prev)
        .forEach(r => unlocked.push({ type:'title', ...r }))
      if (unlocked.length > 0) { setNewRewards(u => [...u, ...unlocked]); setShowToast(true) }
      localStorage.setItem('_prevPerfect', String(perfect))
    }
  }, [perfect])

  const equip = (type, id) => {
    const next = { ...equipped, [type]: id }
    setEquipped(next)
    saveEquipped(next)
  }

  const closeToast = () => { setShowToast(false); setNewRewards([]); setTab('collection') }

  /* Resolve active items */
  const poke   = POKEMON_REWARDS.find(p => p.id === equipped.pokemon) || POKEMON_REWARDS[0]
  const frame  = FRAME_REWARDS.find(f => f.id === equipped.frame)     || FRAME_REWARDS[0]
  const acc    = ACCESSORY_REWARDS.find(a => a.id === equipped.acc)   || ACCESSORY_REWARDS[0]
  const bg     = BG_REWARDS.find(b => b.id === equipped.bg)           || BG_REWARDS[0]
  const title  = TITLE_REWARDS.find(t => t.id === equipped.title)     || TITLE_REWARDS[0]
  const effect = EFFECT_REWARDS.find(e => e.id === equipped.effect)   || EFFECT_REWARDS[0]

  /* Total unlocked count */
  const totalUnlocked = [
    ...POKEMON_REWARDS, ...FRAME_REWARDS, ...ACCESSORY_REWARDS,
    ...BG_REWARDS, ...TITLE_REWARDS, ...EFFECT_REWARDS,
  ].filter(r => isUnlocked(r, streak, perfect)).length

  const totalItems = POKEMON_REWARDS.length + FRAME_REWARDS.length + ACCESSORY_REWARDS.length +
    BG_REWARDS.length + TITLE_REWARDS.length + EFFECT_REWARDS.length

  const unlockedCounts = {
    pokemon: POKEMON_REWARDS.filter(r => isUnlocked(r, streak, perfect)).length,
    frame:   FRAME_REWARDS.filter(r => isUnlocked(r, streak, perfect)).length,
    acc:     ACCESSORY_REWARDS.filter(r => isUnlocked(r, streak, perfect)).length,
    bg:      BG_REWARDS.filter(r => isUnlocked(r, streak, perfect)).length,
    title:   TITLE_REWARDS.filter(r => isUnlocked(r, streak, perfect)).length,
    effect:  EFFECT_REWARDS.filter(r => isUnlocked(r, streak, perfect)).length,
  }

  const CATS = [
    { id:'pokemon', label:`ポケモン (${unlockedCounts.pokemon})` },
    { id:'frame',   label:`フレーム (${unlockedCounts.frame})` },
    { id:'acc',     label:`アクセサリー (${unlockedCounts.acc})` },
    { id:'bg',      label:`背景 (${unlockedCounts.bg})` },
    { id:'title',   label:`称号 (${unlockedCounts.title})` },
    { id:'effect',  label:`エフェクト (${unlockedCounts.effect})` },
  ]

  const showSparkles = ['effect-sparkle','effect-legendary','effect-rainbow','effect-lightning'].includes(effect.cssClass)

  return (
    <div className="aura-char-outer">
      {/* Tab bar */}
      <div className="aura-char-tabs">
        <button className={`aura-char-tab ${tab === 'home' ? 'active' : ''}`} onClick={() => setTab('home')}>
          キャラ
        </button>
        <button className={`aura-char-tab ${tab === 'collection' ? 'active' : ''}`} onClick={() => setTab('collection')}>
          コレクション {totalUnlocked}/{totalItems}
        </button>
      </div>

      {/* ─── HOME TAB ─── */}
      {tab === 'home' && (
        <div className="aura-char-home">
          <div
            className={`aura-char-card ${frame.cssClass} ${effect.cssClass}`}
            style={{ background: bg.bg }}
          >
            {showSparkles && <Sparkles count={8} />}
            {acc.emoji && (
              <span className="char-accessory" style={acc.pos || { top:'-14px', right:'-8px' }}>
                {acc.emoji}
              </span>
            )}
            <div className="aura-poke-wrap">
              <img src={SPRITE(poke.pokeId)} alt={poke.name} className="aura-poke-img" />
            </div>
            <div className="aura-poke-name">{poke.name}</div>
            {title.id !== 'beginner' && (
              <div
                className={`aura-poke-title ${title.rainbow ? 'aura-rainbow' : ''}`}
                style={{ color: title.rainbow ? undefined : title.color }}
              >
                {title.label}
              </div>
            )}
          </div>

          {/* Stats */}
          <div className="aura-stats-row">
            <div className="aura-stat">
              <div className="aura-stat-val aura-gold">{streak}</div>
              <div className="aura-stat-lbl">連続日数</div>
            </div>
            <div className="aura-stat">
              <div className="aura-stat-val" style={{ color:'var(--success)' }}>{perfect}</div>
              <div className="aura-stat-lbl">完璧な日</div>
            </div>
            <div className="aura-stat">
              <div className="aura-stat-val" style={{ color:'var(--purple)' }}>{totalUnlocked}</div>
              <div className="aura-stat-lbl">解放済み</div>
            </div>
          </div>

          <NextRewards streak={streak} />
        </div>
      )}

      {/* ─── COLLECTION TAB ─── */}
      {tab === 'collection' && (
        <div className="aura-collection">
          {/* Category tabs */}
          <div className="coll-cats">
            {CATS.map(c => (
              <button
                key={c.id}
                className={`coll-cat-btn ${collCat === c.id ? 'active' : ''}`}
                onClick={() => setCollCat(c.id)}
              >
                {c.label}
              </button>
            ))}
          </div>

          <div className="coll-grid">
            {collCat === 'pokemon' && POKEMON_REWARDS.map(item => (
              <CollItem key={item.id} item={item} equipped={equipped} type="pokemon"
                unlocked={isUnlocked(item, streak, perfect)} onEquip={equip} />
            ))}
            {collCat === 'frame' && FRAME_REWARDS.map(item => (
              <CollItem key={item.id} item={item} equipped={equipped} type="frame"
                unlocked={isUnlocked(item, streak, perfect)} onEquip={equip} />
            ))}
            {collCat === 'acc' && ACCESSORY_REWARDS.map(item => (
              <CollItem key={item.id} item={item} equipped={equipped} type="acc"
                unlocked={isUnlocked(item, streak, perfect)} onEquip={equip} />
            ))}
            {collCat === 'bg' && BG_REWARDS.map(item => (
              <CollItem key={item.id} item={item} equipped={equipped} type="bg"
                unlocked={isUnlocked(item, streak, perfect)} onEquip={equip} />
            ))}
            {collCat === 'title' && TITLE_REWARDS.map(item => (
              <CollItem key={item.id} item={item} equipped={equipped} type="title"
                unlocked={isUnlocked(item, streak, perfect)} onEquip={equip} />
            ))}
            {collCat === 'effect' && EFFECT_REWARDS.map(item => (
              <CollItem key={item.id} item={item} equipped={equipped} type="effect"
                unlocked={isUnlocked(item, streak, perfect)} onEquip={equip} />
            ))}
          </div>
        </div>
      )}

      {/* Reward toast */}
      {showToast && newRewards.length > 0 && (
        <RewardToast rewards={newRewards} onClose={closeToast} />
      )}
    </div>
  )
}
