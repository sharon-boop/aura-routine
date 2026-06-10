import { useState, useEffect, useRef } from 'react'
import { getGachaTickets, useGachaTicket } from '../utils/storage'
import { PREMIUM_GACHA_POOL, addPremiumUnlocked, getEquipped, saveEquipped } from '../utils/rewards'
import { toast } from './Toast'
import confetti from 'canvas-confetti'

const SPRITE = (id) =>
  `https://raw.githubusercontent.com/PokeAPI/sprites/master/sprites/pokemon/other/home/${id}.png`

// ボールタイプ定義
const BALLS = [
  { id:'normal',  label:'モンスターボール', color:'#CC0000', color2:'#880000', mid:'#111', accent:'#fff',    rarity:'common',   weight:60 },
  { id:'great',   label:'スーパーボール',   color:'#1565C0', color2:'#0D47A1', mid:'#111', accent:'#FFD700', rarity:'uncommon', weight:25 },
  { id:'ultra',   label:'ハイパーボール',   color:'#E8A000', color2:'#5D2E00', mid:'#111', accent:'#fff',    rarity:'rare',     weight:12 },
  { id:'master',  label:'マスターボール',   color:'#6A1B9A', color2:'#38006B', mid:'#111', accent:'#FFD700', rarity:'ultra',    weight:3  },
]

function pickBall() {
  const total = BALLS.reduce((s, b) => s + b.weight, 0)
  let r = Math.random() * total
  for (const b of BALLS) { r -= b.weight; if (r <= 0) return b }
  return BALLS[0]
}

function pickReward(rarity) {
  const rarityOrder = ['common','uncommon','rare','ultra']
  const minIdx = rarityOrder.indexOf(rarity)
  const pool = PREMIUM_GACHA_POOL.filter(r => rarityOrder.indexOf(r.rarity) >= minIdx)
  if (!pool.length) return PREMIUM_GACHA_POOL[0]
  return pool[Math.floor(Math.random() * pool.length)]
}

/* ─── 3D ポケボール ─── */
function Pokeball3D({ ball, phase }) {
  const isOpening = phase === 'opening'
  return (
    <div className={`pb3d-scene phase-${phase}`}>
      <div
        className={`pb3d-ball phase-${phase}`}
        style={{
          '--ball-top': ball.color,
          '--ball-top2': ball.color2,
          '--ball-mid': ball.mid,
          '--ball-accent': ball.accent,
        }}
      >
        {/* 上半球 */}
        <div className={`pb3d-top${isOpening ? ' pb3d-top-open' : ''}`} />
        {/* ツヤ反射（上） */}
        <div className="pb3d-gloss" />
        {/* 中央ライン */}
        <div className="pb3d-seam">
          <div className="pb3d-btn">
            <div className="pb3d-btn-inner" />
          </div>
        </div>
        {/* 下半球 */}
        <div className="pb3d-bot" />
        {/* 底面の影 */}
        <div className="pb3d-inner-shadow" />
      </div>
      {/* 地面の影 */}
      <div className={`pb3d-shadow phase-${phase}`} />
    </div>
  )
}

/* ─── 報酬表示カード ─── */
function RewardCard({ reward }) {
  if (!reward) return null
  const typeLabel = { pokemon:'ポケモン', frame:'フレーム', acc:'アクセサリー', bg:'背景テーマ', title:'称号', effect:'エフェクト', stamp:'スタンプ' }
  const rarityColor = { common:'#84A98C', uncommon:'#4CAF50', rare:'#6C63FF', ultra:'#FFD700' }
  const rarityLabel = { common:'コモン', uncommon:'アンコモン', rare:'レア', ultra:'ウルトラレア' }
  const rarityGlow  = { common:'none', uncommon:'0 0 20px rgba(76,175,80,0.5)', rare:'0 0 30px rgba(108,99,255,0.6)', ultra:'0 0 40px rgba(255,215,0,0.8)' }
  return (
    <div className="pg-reward-card slide-up" style={{ boxShadow: rarityGlow[reward.rarity] }}>
      <div style={{ fontSize:10, fontWeight:900, letterSpacing:3, color: rarityColor[reward.rarity] || '#6C63FF', textTransform:'uppercase', marginBottom:8 }}>
        {rarityLabel[reward.rarity] || 'REWARD'} ✦ {typeLabel[reward.type] || reward.type}
      </div>
      {reward.type === 'pokemon' && reward.pokeId && (
        <img src={SPRITE(reward.pokeId)} alt={reward.name}
          style={{ width:120, height:120, objectFit:'contain', marginBottom:8, filter: reward.rarity === 'ultra' ? 'drop-shadow(0 0 12px gold)' : reward.rarity === 'rare' ? 'drop-shadow(0 0 8px #9b59b6)' : 'none' }} />
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
        <div style={{ fontSize:44, marginBottom:8 }}>✨</div>
      )}
      <div style={{ fontSize:18, fontWeight:900, letterSpacing:-0.5 }}>{reward.name || reward.label}</div>
    </div>
  )
}

/* ─── メインコンポーネント ─── */
export default function PremiumGacha({ onClose, asPage = false }) {
  const [tickets, setTickets] = useState(getGachaTickets)
  const [phase, setPhase]     = useState('idle')
  const [ball, setBall]       = useState(BALLS[0])
  const [reward, setReward]   = useState(null)
  const timers = useRef([])

  useEffect(() => () => timers.current.forEach(clearTimeout), [])
  const addTimer = (fn, ms) => { const id = setTimeout(fn, ms); timers.current.push(id) }

  const pull = () => {
    if (phase !== 'idle' || tickets < 1) return
    if (!useGachaTicket()) { toast('チケットが足りません'); return }
    setTickets(t => t - 1)

    const chosenBall   = pickBall()
    const chosenReward = pickReward(chosenBall.rarity)
    setBall(chosenBall)

    setPhase('dropping')
    addTimer(() => setPhase('shaking'), 900)
    addTimer(() => setPhase('opening'), 2200)
    addTimer(() => {
      setPhase('flash')
      setReward(chosenReward)
      addPremiumUnlocked(chosenReward.id)
    }, 2900)
    addTimer(() => {
      setPhase('reveal')
      if (chosenBall.rarity === 'ultra') {
        confetti({ particleCount:180, spread:100, origin:{y:0.4}, colors:['#FFD700','#9333EA','#E91E63','#fff'] })
      } else if (chosenBall.rarity === 'rare') {
        confetti({ particleCount:100, spread:80, origin:{y:0.5}, colors:['#6C63FF','#F2994A','#84A98C'] })
      } else {
        confetti({ particleCount:50, spread:60, origin:{y:0.6}, colors:['#3B82F6','#fff','#84A98C'] })
      }
      const rarityMsg = { common:'', uncommon:'✦ アンコモン！', rare:'✦✦ レア！', ultra:'✦✦✦ ウルトラレア！！' }
      toast(`${rarityMsg[chosenReward.rarity] || ''} ${chosenReward.name}`)
    }, 3200)
    addTimer(() => setPhase('done'), 3600)
  }

  const reset = () => {
    setPhase('idle'); setReward(null); setBall(BALLS[0])
    setTickets(getGachaTickets())
    timers.current.forEach(clearTimeout); timers.current = []
  }

  const inner = (
    <div className="pg-modal" style={asPage ? { borderRadius:'0', minHeight:'100vh', paddingBottom:80 } : {}}>
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
              <div key={b.id} className="pg-ball-mini" style={{
                background:`radial-gradient(circle at 35% 35%, color-mix(in srgb, ${b.color} 80%, #fff), ${b.color} 50%, ${b.color2})`,
                boxShadow:`0 4px 12px ${b.color}80`
              }} title={b.label} />
            ))}
            <div style={{ fontSize:11, color:'rgba(255,255,255,0.3)', marginTop:8, textAlign:'center', fontWeight:700 }}>
              4種類のボールからランダムに出現
            </div>
          </div>
        ) : phase === 'flash' ? (
          <div className="pg-flash" />
        ) : (
          <Pokeball3D ball={ball} phase={phase} />
        )}

        {(phase === 'reveal' || phase === 'done') && (
          <div style={{ marginTop:24 }}>
            <RewardCard reward={reward} />
          </div>
        )}
      </div>

      {/* ボタン */}
      <div className="pg-actions">
        {phase === 'idle' && (
          <button className="btn btn-main pg-pull-btn" onClick={pull} disabled={tickets < 1}>
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
        {phase !== 'idle' && phase !== 'done' && (
          <div style={{ fontSize:12, color:'rgba(255,255,255,0.4)', textAlign:'center', padding:'12px 0', fontWeight:700 }}>演出中…</div>
        )}
      </div>

      {/* エフェクト説明 */}
      {phase === 'idle' && (
        <div className="pg-hint">
          <div style={{ fontSize:11, fontWeight:700, color:'rgba(255,255,255,0.4)', marginBottom:6 }}>チケットの獲得方法</div>
          <div style={{ fontSize:11, color:'rgba(255,255,255,0.3)', lineHeight:1.8 }}>
            日記を書く +1 / 感情ログ +1 / 学びログ +1<br/>
            週次レビュー +3 / チャレンジ記録 +2
          </div>
          <div style={{ marginTop:10, fontSize:11, color:'rgba(255,255,255,0.25)', lineHeight:1.7 }}>
            ※ エフェクト・フレームなどはキャラクターカードに反映されます<br/>
            （ホーム画面のキャラクターカードで確認できます）
          </div>
        </div>
      )}
    </div>
  )

  if (asPage) {
    return (
      <div style={{ minHeight:'100vh', background:'linear-gradient(180deg,#1a1a2e 0%,#0f0c29 100%)' }}>
        {inner}
      </div>
    )
  }

  return <div className="pg-overlay">{inner}</div>
}
