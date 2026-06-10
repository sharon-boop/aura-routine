import { useState, useEffect, useRef } from 'react'
import { getGachaTickets, useGachaTicket } from '../utils/storage'
import { PREMIUM_GACHA_POOL, addPremiumUnlocked, getEquipped, saveEquipped } from '../utils/rewards'
import { toast } from './Toast'
import confetti from 'canvas-confetti'

const SPRITE = (id) =>
  `https://raw.githubusercontent.com/PokeAPI/sprites/master/sprites/pokemon/other/home/${id}.png`

// ボールタイプ定義
const BALLS = [
  { id:'normal',  label:'モンスターボール', color:'#EF4444', color2:'#B91C1C', accent:'#fff', rarity:'common',   weight:60 },
  { id:'great',   label:'スーパーボール',   color:'#3B82F6', color2:'#1D4ED8', accent:'#FFD700', rarity:'uncommon', weight:25 },
  { id:'ultra',   label:'ハイパーボール',   color:'#EAB308', color2:'#78350F', accent:'#fff', rarity:'rare',     weight:12 },
  { id:'master',  label:'マスターボール',   color:'#9333EA', color2:'#581C87', accent:'#FFD700', rarity:'ultra',    weight:3  },
]

function pickBall() {
  const total = BALLS.reduce((s, b) => s + b.weight, 0)
  let r = Math.random() * total
  for (const b of BALLS) { r -= b.weight; if (r <= 0) return b }
  return BALLS[0]
}

function pickReward(rarity) {
  // レアリティ以上のプールから選ぶ（マスターボールはultraプールから）
  const rarityOrder = ['common','uncommon','rare','ultra']
  const minIdx = rarityOrder.indexOf(rarity)
  const pool = PREMIUM_GACHA_POOL.filter(r => rarityOrder.indexOf(r.rarity) >= minIdx)
  if (!pool.length) return PREMIUM_GACHA_POOL[0]
  return pool[Math.floor(Math.random() * pool.length)]
}

/* ─── ボールSVG ─── */
function BallVisual({ ball, phase }) {
  // phase: idle | dropping | shaking | opening | done
  const topClass = phase === 'opening' ? 'ball-top-open' : ''
  const botClass = phase === 'opening' ? 'ball-bot-open' : ''
  return (
    <div className={`pg-ball-wrap phase-${phase}`}>
      <div className="pg-ball-container">
        <div className={`pg-ball-top ${topClass}`} style={{ background: `linear-gradient(180deg, ${ball.color} 60%, ${ball.color2} 100%)` }}>
          <div className="pg-ball-btn" style={{ background: ball.accent }} />
        </div>
        <div className="pg-ball-seam" />
        <div className={`pg-ball-bot ${botClass}`} style={{ background: '#f5f5f5' }} />
      </div>
    </div>
  )
}

/* ─── 報酬表示カード ─── */
function RewardCard({ reward }) {
  if (!reward) return null
  const typeLabel = { pokemon:'ポケモン', frame:'フレーム', acc:'アクセサリー', bg:'背景テーマ', title:'称号', effect:'エフェクト', stamp:'スタンプ' }
  const rarityColor = { common:'#84A98C', uncommon:'#4CAF50', rare:'#6C63FF', ultra:'#FFD700' }
  const rarityLabel = { common:'コモン', uncommon:'アンコモン', rare:'レア', ultra:'ウルトラレア' }
  return (
    <div className="pg-reward-card slide-up">
      <div style={{ fontSize:10, fontWeight:900, letterSpacing:3, color: rarityColor[reward.rarity] || '#6C63FF', textTransform:'uppercase', marginBottom:8 }}>
        {rarityLabel[reward.rarity] || 'REWARD'} ✦ {typeLabel[reward.type] || reward.type}
      </div>
      {reward.type === 'pokemon' && reward.pokeId && (
        <img src={SPRITE(reward.pokeId)} alt={reward.name} style={{ width:110, height:110, objectFit:'contain', marginBottom:8 }} />
      )}
      {reward.type === 'stamp' && (
        <div style={{ width:80, height:80, borderRadius:16, background:reward.stampBg, display:'flex', alignItems:'center', justifyContent:'center', fontSize:40, marginBottom:8 }}>
          {reward.emoji}
        </div>
      )}
      {reward.type === 'title' && (
        <div style={{ fontSize:28, fontWeight:900, color: reward.color || '#6C63FF', marginBottom:8 }}>{reward.label}</div>
      )}
      {(reward.type === 'frame' || reward.type === 'bg' || reward.type === 'effect' || reward.type === 'acc') && (
        <div style={{ fontSize:40, marginBottom:8 }}>✨</div>
      )}
      <div style={{ fontSize:18, fontWeight:900, letterSpacing:-0.5 }}>{reward.name || reward.label}</div>
    </div>
  )
}

/* ─── メインコンポーネント ─── */
export default function PremiumGacha({ onClose }) {
  const [tickets, setTickets] = useState(getGachaTickets)
  const [phase, setPhase]     = useState('idle') // idle|dropping|shaking|opening|flash|reveal|done
  const [ball, setBall]       = useState(BALLS[0])
  const [reward, setReward]   = useState(null)
  const timers = useRef([])

  useEffect(() => () => timers.current.forEach(clearTimeout), [])

  const addTimer = (fn, ms) => { const id = setTimeout(fn, ms); timers.current.push(id) }

  const pull = () => {
    if (phase !== 'idle' || tickets < 1) return
    if (!useGachaTicket()) { toast('チケットが足りません'); return }
    setTickets(t => t - 1)

    const chosenBall = pickBall()
    const chosenReward = pickReward(chosenBall.rarity)
    setBall(chosenBall)

    setPhase('dropping')
    addTimer(() => setPhase('shaking'), 700)
    addTimer(() => setPhase('opening'), 1800)
    addTimer(() => {
      setPhase('flash')
      setReward(chosenReward)
      addPremiumUnlocked(chosenReward.id)
    }, 2600)
    addTimer(() => {
      setPhase('reveal')
      if (chosenBall.rarity === 'ultra') {
        confetti({ particleCount:150, spread:80, origin:{y:0.5}, colors:['#FFD700','#9333EA','#3B82F6','#fff'] })
      } else if (chosenBall.rarity === 'rare') {
        confetti({ particleCount:80, spread:70, origin:{y:0.5}, colors:['#6C63FF','#F2994A','#84A98C'] })
      } else {
        confetti({ particleCount:40, spread:60, origin:{y:0.6}, colors:['#3B82F6','#fff'] })
      }
      const rarityMsg = { common:'', uncommon:'✦ アンコモン！', rare:'✦✦ レア！', ultra:'✦✦✦ ウルトラレア！！！' }
      toast(`${rarityMsg[chosenReward.rarity] || ''} ${chosenReward.name}`)
    }, 3000)
    addTimer(() => setPhase('done'), 3300)
  }

  const reset = () => {
    setPhase('idle')
    setReward(null)
    setBall(BALLS[0])
    setTickets(getGachaTickets())
    timers.current.forEach(clearTimeout)
    timers.current = []
  }

  return (
    <div className="pg-overlay">
      <div className="pg-modal">
        {/* ヘッダー */}
        <div className="pg-header">
          <div>
            <div style={{ fontSize:10, fontWeight:900, letterSpacing:3, textTransform:'uppercase', color:'rgba(255,255,255,0.5)', marginBottom:4 }}>PREMIUM GACHA</div>
            <div style={{ fontSize:22, fontWeight:900, letterSpacing:-1, color:'#fff' }}>プレミアムガチャ</div>
          </div>
          <button onClick={onClose} style={{ background:'rgba(255,255,255,0.1)', border:'none', borderRadius:50, width:36, height:36, cursor:'pointer', color:'#fff', fontSize:18, display:'flex', alignItems:'center', justifyContent:'center' }}>×</button>
        </div>

        {/* チケット数表示 */}
        <div className="pg-tickets">
          <span className="pg-ticket-icon">🎟️</span>
          <span className="pg-ticket-count">{tickets}</span>
          <span className="pg-ticket-label">チケット</span>
        </div>

        {/* ボール演出エリア */}
        <div className="pg-stage">
          {(phase === 'idle' || phase === 'done') ? (
            <div className="pg-ball-idle">
              {BALLS.map(b => (
                <div key={b.id} className="pg-ball-mini" style={{ background:`linear-gradient(135deg,${b.color},${b.color2})` }} title={b.label} />
              ))}
            </div>
          ) : phase === 'flash' ? (
            <div className="pg-flash" />
          ) : (
            <BallVisual ball={ball} phase={phase} />
          )}

          {phase === 'reveal' || phase === 'done' ? (
            <div style={{ marginTop:24 }}>
              <RewardCard reward={reward} />
            </div>
          ) : null}
        </div>

        {/* ボタン */}
        <div className="pg-actions">
          {(phase === 'idle') && (
            <button
              className="btn btn-main pg-pull-btn"
              onClick={pull}
              disabled={tickets < 1}
            >
              {tickets < 1 ? 'チケット不足' : '🎰 ガチャを引く（チケット×1）'}
            </button>
          )}
          {phase === 'done' && (
            <div style={{ display:'flex', gap:10, width:'100%' }}>
              <button className="btn btn-main" onClick={reset} disabled={tickets < 1} style={{ flex:1 }}>
                {tickets < 1 ? 'チケット不足' : 'もう一度'}
              </button>
              <button className="btn btn-ghost" onClick={onClose} style={{ flex:1 }}>閉じる</button>
            </div>
          )}
          {(phase !== 'idle' && phase !== 'done') && (
            <div style={{ fontSize:12, color:'rgba(255,255,255,0.4)', textAlign:'center', padding:'12px 0', fontWeight:700 }}>演出中…</div>
          )}
        </div>

        {/* チケット獲得方法 */}
        {phase === 'idle' && (
          <div className="pg-hint">
            <div style={{ fontSize:11, fontWeight:700, color:'rgba(255,255,255,0.4)', marginBottom:6 }}>チケットの獲得方法</div>
            <div style={{ fontSize:11, color:'rgba(255,255,255,0.3)', lineHeight:1.8 }}>
              日記を書く +1 / 感情ログ +1 / 学びログ +1<br/>
              週次レビュー +3 / チャレンジ記録 +2
            </div>
          </div>
        )}
      </div>
    </div>
  )
}
