import { useState, useEffect, useRef } from 'react'

const TOAST_STREAK_KEY  = 'rewardLastStreak'
const TOAST_PERFECT_KEY = 'rewardLastPerfect'
import {
  POKEMON_REWARDS, FRAME_REWARDS, ACCESSORY_REWARDS,
  BG_REWARDS, TITLE_REWARDS, EFFECT_REWARDS, STAMP_REWARDS,
  PERFECT_POKEMON, TIMELINE,
  PERFECT_DAY_REWARDS, PREMIUM_GACHA_POOL, getPremiumUnlocked,
  isUnlocked, getAllRewardsAtDay,
  getEquipped, saveEquipped,
  SECRET_REWARDS, checkSecretUnlocks, getSecretUnlocked,
} from '../utils/rewards'
import { getSecretCounts } from '../utils/storage'

const SPRITE = (id) =>
  `https://raw.githubusercontent.com/PokeAPI/sprites/master/sprites/pokemon/other/home/${id}.png`

/* ─── Sparkle Particles ─── */
function Sparkles({ count = 6 }) {
  const stars = useRef(
    Array.from({ length: count }).map(() => ({
      left:`${10 + Math.random() * 80}%`,
      top: `${10 + Math.random() * 80}%`,
      delay:`${(Math.random() * 1.8).toFixed(1)}s`,
      size:`${8 + Math.floor(Math.random() * 8)}px`,
    }))
  )
  return (
    <div className="sparkle-container" aria-hidden>
      {stars.current.map((s,i) => (
        <span key={i} className="sparkle-star"
          style={{left:s.left,top:s.top,animationDelay:s.delay,fontSize:s.size}}>✦</span>
      ))}
    </div>
  )
}

/* ─── Reward Unlock Toast ─── */
export function RewardToast({ rewards, onClose }) {
  const [idx, setIdx] = useState(0)
  if (!rewards?.length) return null
  const r = rewards[idx]
  const typeLabel = {
    pokemon:'ポケモン', frame:'フレーム', acc:'アクセサリー',
    bg:'背景テーマ', title:'称号', effect:'エフェクト', stamp:'スタンプ'
  }
  const isSecret = r.secret === true
  return (
    <div className="reward-toast-overlay">
      <div className={`reward-toast-card slide-up ${isSecret ? 'reward-toast-secret' : ''}`}>
        <div className="reward-toast-badge">{isSecret ? '🔮 SECRET UNLOCKED' : '🎁 REWARD UNLOCKED'}</div>
        <div className="reward-toast-type">{typeLabel[r.type] || r.type}</div>
        <div className="reward-toast-name">{r.label || r.name}</div>
        {r.type === 'pokemon' && r.pokeId && (
          <img src={SPRITE(r.pokeId)} alt={r.name} className="reward-toast-poke" />
        )}
        {r.type === 'stamp' && r.emoji && (
          <div className="reward-toast-stamp" style={{background:r.stampBg}}>{r.emoji}</div>
        )}
        {r.type === 'title' && (
          <div className="reward-toast-title-preview" style={{color:r.color}}>{r.label}</div>
        )}
        <div style={{display:'flex',gap:10,marginTop:18}}>
          {idx < rewards.length - 1
            ? <button className="btn btn-main" onClick={() => setIdx(i=>i+1)}>
                次の報酬 ({idx+2}/{rewards.length})
              </button>
            : <button className="btn btn-main" onClick={onClose}>コレクションを見る ✨</button>
          }
        </div>
        <div style={{fontSize:11,color:'var(--muted)',marginTop:10}}>{idx+1} / {rewards.length} 件</div>
      </div>
    </div>
  )
}

/* ─── Next Rewards (mystery) ─── */
function NextRewards({ streak }) {
  const upcoming = []
  for (let d = streak + 1; d <= streak + 15 && upcoming.length < 5; d++) {
    if (getAllRewardsAtDay(d).length > 0) upcoming.push({ daysLeft: d - streak })
  }
  if (!upcoming.length) return null
  return (
    <div className="next-rewards-wrap">
      <div className="next-rewards-title">🔒 次の報酬まで</div>
      <div className="next-rewards-list">
        {upcoming.map((r,i) => (
          <div key={i} className="next-reward-item">
            <span className="next-reward-days">あと {r.daysLeft}日</span>
            <span className="next-reward-name next-reward-mystery">???</span>
          </div>
        ))}
      </div>
    </div>
  )
}

/* ─── Collection Item (mystery or revealed) ─── */
function CollItem({ item, equipped, unlocked, onEquip }) {
  const type = item.type
  const isEq  = equipped[type] === item.id

  if (!unlocked) {
    const reqLabel = item.perfectReq
      ? `完璧${item.perfectReq}回` : item.day === 0 ? '初期' : `${item.day}日`
    return (
      <div className="coll-item coll-item-locked">
        <div className="coll-mystery-icon">🔒</div>
        <div className="coll-item-name" style={{color:'#bbb'}}>???</div>
        <div className="coll-item-lock">{reqLabel}</div>
      </div>
    )
  }

  return (
    <div className={`coll-item ${isEq ? 'coll-item-equipped' : ''}`}
      onClick={() => onEquip(type, item.id)}>
      {type === 'pokemon' && (
        <img src={SPRITE(item.pokeId)} alt={item.name} className="coll-poke-img" />
      )}
      {type === 'frame' && (
        <div className={`coll-frame-preview ${item.cssClass || ''}`}
          style={item.style || {}} />
      )}
      {type === 'acc' && (
        <div className="coll-acc-emoji">{item.emoji || '—'}</div>
      )}
      {type === 'bg' && (
        <div className="coll-bg-preview" style={{background:item.bg}} />
      )}
      {type === 'title' && (
        <div className="coll-title-label"
          style={{color:item.color, fontWeight:800, fontSize:11}}>
          {item.label}
        </div>
      )}
      {type === 'effect' && (
        <div className={`coll-effect-demo ${item.cssClass || ''}`}>✦</div>
      )}
      {type === 'stamp' && (
        <div className="coll-stamp-preview" style={{background:item.stampBg}}>
          {item.emoji}
        </div>
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
      stamp:   e.stamp   || 'none',
    }
  })
  const [tab, setTab]       = useState('home')
  const [collCat, setCollCat] = useState('pokemon')
  const [newRewards, setNewRewards] = useState([])
  const [showToast, setShowToast]   = useState(false)
  const prevStreakRef = useRef(streak)
  const prevPerfectRef = useRef(perfect)

  // Detect new streak unlocks — 1日1回のみ表示
  useEffect(() => {
    const lastShown = parseInt(localStorage.getItem(TOAST_STREAK_KEY) || '0')
    if (streak > lastShown) {
      const unlocked = []
      for (let d = lastShown + 1; d <= streak; d++) getAllRewardsAtDay(d).forEach(r => unlocked.push(r))
      if (unlocked.length) {
        setNewRewards(unlocked)
        setShowToast(true)
      }
      localStorage.setItem(TOAST_STREAK_KEY, String(streak))
      prevStreakRef.current = streak
    }
  }, [streak])

  // Detect perfect unlocks — localStorage基準（ページ再読み込みで再表示しない）
  useEffect(() => {
    const lastShown = parseInt(localStorage.getItem(TOAST_PERFECT_KEY) || '0')
    if (perfect > lastShown) {
      const unlocked = []
      PERFECT_POKEMON.filter(r => r.perfectReq <= perfect && r.perfectReq > lastShown)
        .forEach(r => unlocked.push(r))
      TITLE_REWARDS.filter(r => r.perfectReq && r.perfectReq <= perfect && r.perfectReq > lastShown)
        .forEach(r => unlocked.push(r))
      // PERFECT_DAY_REWARDS (50 items)
      PERFECT_DAY_REWARDS.filter(r => r.perfectCount <= perfect && r.perfectCount > lastShown)
        .forEach(r => unlocked.push(r))
      if (unlocked.length) { setNewRewards(u => [...u, ...unlocked]); setShowToast(true) }
      localStorage.setItem(TOAST_PERFECT_KEY, String(perfect))
      prevPerfectRef.current = perfect
    }
  }, [perfect])

  // シークレット報酬チェック（マウント時）
  useEffect(() => {
    const counts = getSecretCounts()
    const secrets = checkSecretUnlocks(counts)
    if (secrets.length) {
      setNewRewards(u => [...u, ...secrets])
      setShowToast(true)
    }
  }, [])

  const equip = (type, id) => {
    const next = { ...equipped, [type]: id }
    setEquipped(next); saveEquipped(next)
  }
  const closeToast = () => { setShowToast(false); setNewRewards([]); setTab('collection') }

  // Resolve active items（デフォルト値はリストにないためフォールバックで補完）
  const pdPoke    = PERFECT_DAY_REWARDS.filter(r => r.type === 'pokemon')
  const pgPoke    = PREMIUM_GACHA_POOL.filter(r  => r.type === 'pokemon')
  const allPoke   = [...POKEMON_REWARDS, ...PERFECT_POKEMON, ...pdPoke, ...pgPoke]
  const pdFrames  = PERFECT_DAY_REWARDS.filter(r => r.type === 'frame')
  const pgFrames  = PREMIUM_GACHA_POOL.filter(r  => r.type === 'frame')
  const pdAccs    = PERFECT_DAY_REWARDS.filter(r => r.type === 'acc')
  const pgAccs    = PREMIUM_GACHA_POOL.filter(r  => r.type === 'acc')
  const pdBgs     = PERFECT_DAY_REWARDS.filter(r => r.type === 'bg')
  const pgBgs     = PREMIUM_GACHA_POOL.filter(r  => r.type === 'bg')
  const pdTitles  = PERFECT_DAY_REWARDS.filter(r => r.type === 'title')
  const pgTitles  = PREMIUM_GACHA_POOL.filter(r  => r.type === 'title')
  const pdEffects = PERFECT_DAY_REWARDS.filter(r => r.type === 'effect')
  const pgEffects = PREMIUM_GACHA_POOL.filter(r  => r.type === 'effect')
  const pdStamps  = PERFECT_DAY_REWARDS.filter(r => r.type === 'stamp')
  const pgStamps  = PREMIUM_GACHA_POOL.filter(r  => r.type === 'stamp')
  const poke   = allPoke.find(p => p.id === equipped.pokemon) || POKEMON_REWARDS[0]
  const frame  = FRAME_REWARDS.find(f => f.id === equipped.frame)
    || { id:'none', label:'デフォルト', type:'frame', style:{ border:'2px solid #E8E2D8' } }
  const acc    = ACCESSORY_REWARDS.find(a => a.id === equipped.acc)
    || { id:'none', label:'なし', type:'acc', emoji:'', pos:{} }
  const bg     = BG_REWARDS.find(b => b.id === equipped.bg)
    || { id:'cream', label:'クリーム', type:'bg', bg:'#FAFAF7' }
  const title  = TITLE_REWARDS.find(t => t.id === equipped.title)
    || { id:'beginner', label:'新人', type:'title', color:'#9A9A9A' }
  const effect = EFFECT_REWARDS.find(e => e.id === equipped.effect)
    || { id:'none', label:'なし', type:'effect', cssClass:'effect-none' }
  const stamp  = STAMP_REWARDS.find(s => s.id === equipped.stamp)
    || { id:'none', label:'なし', type:'stamp', emoji:'', stampBg:'transparent' }

  const allFrames  = [...FRAME_REWARDS,  ...pdFrames,  ...pgFrames]
  const allAccs    = [...ACCESSORY_REWARDS, ...pdAccs, ...pgAccs]
  const allBgs     = [...BG_REWARDS,     ...pdBgs,     ...pgBgs]
  const allTitles  = [...TITLE_REWARDS,  ...pdTitles,  ...pgTitles]
  const allEffects = [...EFFECT_REWARDS, ...pdEffects, ...pgEffects]
  const allStamps  = [...STAMP_REWARDS,  ...pdStamps,  ...pgStamps]

  // Unlock counts
  const unlockedPoke   = allPoke.filter(r => isUnlocked(r, streak, perfect)).length
  const unlockedFrame  = allFrames.filter(r => isUnlocked(r, streak, perfect)).length
  const unlockedAcc    = allAccs.filter(r => isUnlocked(r, streak, perfect)).length
  const unlockedBg     = allBgs.filter(r => isUnlocked(r, streak, perfect)).length
  const unlockedTitle  = allTitles.filter(r => isUnlocked(r, streak, perfect)).length
  const unlockedEffect = allEffects.filter(r => isUnlocked(r, streak, perfect)).length
  const unlockedStamp  = allStamps.filter(r => isUnlocked(r, streak, perfect)).length
  const totalUnlocked  = unlockedPoke + unlockedFrame + unlockedAcc + unlockedBg + unlockedTitle + unlockedEffect + unlockedStamp

  const CATS = [
    { id:'pokemon', label:`ポケモン (${unlockedPoke})`, items:allPoke },
    { id:'frame',   label:`フレーム (${unlockedFrame})`, items:allFrames },
    { id:'acc',     label:`アクセサリー (${unlockedAcc})`, items:allAccs },
    { id:'bg',      label:`背景 (${unlockedBg})`, items:allBgs },
    { id:'title',   label:`称号 (${unlockedTitle})`, items:allTitles },
    { id:'effect',  label:`エフェクト (${unlockedEffect})`, items:allEffects },
    { id:'stamp',   label:`スタンプ (${unlockedStamp})`, items:allStamps },
  ]

  const showSparkles = ['effect-sparkle','effect-legendary','effect-rainbow','effect-lightning'].includes(effect.cssClass)
  const frameStyle = frame.style || {}
  const frameClass = frame.cssClass || ''

  return (
    <div className="aura-char-outer">
      {/* Tab bar */}
      <div className="aura-char-tabs">
        <button className={`aura-char-tab ${tab==='home'?'active':''}`} onClick={()=>setTab('home')}>
          キャラ
        </button>
        <button className={`aura-char-tab ${tab==='collection'?'active':''}`} onClick={()=>setTab('collection')}>
          コレクション {totalUnlocked}
        </button>
      </div>

      {/* ── HOME TAB ── */}
      {tab === 'home' && (
        <div className="aura-char-home">
          <div
            className={`aura-char-card ${frameClass} ${effect.cssClass}`}
            style={{ background: bg.bg, ...frameStyle }}
          >
            {showSparkles && <Sparkles count={8} />}
            {acc.emoji && (
              <span className="char-accessory" style={acc.pos}>{acc.emoji}</span>
            )}
            {stamp.emoji && (
              <span className="char-stamp" style={{background:stamp.stampBg}}>{stamp.emoji}</span>
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

          <div className="aura-stats-row">
            <div className="aura-stat">
              <div className="aura-stat-val aura-gold">{streak}</div>
              <div className="aura-stat-lbl">連続日数</div>
            </div>
            <div className="aura-stat">
              <div className="aura-stat-val" style={{color:'var(--success)'}}>{perfect}</div>
              <div className="aura-stat-lbl">完璧な日</div>
            </div>
            <div className="aura-stat">
              <div className="aura-stat-val" style={{color:'var(--purple)'}}>{totalUnlocked}</div>
              <div className="aura-stat-lbl">解放済み</div>
            </div>
          </div>

          <NextRewards streak={streak} />
        </div>
      )}

      {/* ── COLLECTION TAB ── */}
      {tab === 'collection' && (
        <div className="aura-collection">
          <div className="coll-cats">
            {CATS.map(c => (
              <button key={c.id}
                className={`coll-cat-btn ${collCat===c.id?'active':''}`}
                onClick={()=>setCollCat(c.id)}>
                {c.label}
              </button>
            ))}
          </div>
          <div className="coll-grid">
            {CATS.find(c=>c.id===collCat)?.items.map(item => (
              <CollItem key={item.id} item={item} equipped={equipped}
                unlocked={isUnlocked(item, streak, perfect)}
                onEquip={equip} />
            ))}
          </div>
        </div>
      )}

      {showToast && newRewards.length > 0 && (
        <RewardToast rewards={newRewards} onClose={closeToast} />
      )}
    </div>
  )
}
