import { useState, useEffect, useRef } from 'react'
import {
  getPartner, createPartner, savePartner, addPartnerExp,
  confirmPartnerEvolution, applyPartnerDecay,
  PARTNER_EVO_TREE, PARTNER_EXP_FOR_LEVEL, getToday,
  wasTicketAwarded, markTicketAwarded,
} from '../utils/storage'
import { toast } from './Toast'
import confetti from 'canvas-confetti'

const SPRITE = (id) => `https://raw.githubusercontent.com/PokeAPI/sprites/master/sprites/pokemon/other/home/${id}.png`

const TYPE_BG = {
  grass:    'linear-gradient(135deg,#1B5E20 0%,#388E3C 60%,#66BB6A 100%)',
  fire:     'linear-gradient(135deg,#BF360C 0%,#E64A19 60%,#FF8A65 100%)',
  water:    'linear-gradient(135deg,#0D47A1 0%,#1565C0 60%,#42A5F5 100%)',
  electric: 'linear-gradient(135deg,#E65100 0%,#FF8F00 60%,#FFD54F 100%)',
  psychic:  'linear-gradient(135deg,#4A148C 0%,#7B1FA2 60%,#CE93D8 100%)',
  normal:   'linear-gradient(135deg,#4E342E 0%,#795548 60%,#BCAAA4 100%)',
}

const STARTER_OPTIONS = [
  { basePokeId:4,   name:'ヒトカゲ',   type:'fire',   icon:'🔥', desc:'炎タイプ。負けず嫌いで情熱的。行動力で成長するタイプ。' },
  { basePokeId:7,   name:'ゼニガメ',   type:'water',  icon:'💧', desc:'水タイプ。冷静で分析力が高い。継続力で力をつけるタイプ。' },
  { basePokeId:1,   name:'フシギダネ', type:'grass',  icon:'🌿', desc:'草タイプ。柔軟で創造力がある。仕組みで伸びるタイプ。' },
]

const TALK_MESSAGES = [
  '今日も来てくれた！一緒に成長しよう！',
  '「なんでこれ刺さるんやろ」その感覚、才能の種やで。',
  '習慣化した瞬間に一気に伸びる。その時まで一緒にいるよ。',
  '人の心理を読める力、もっと使っていこう！',
  'TikTok、面白い観察できた？アウトプットが力になるよ。',
  '今日の自分は昨日より1%成長してる。積み重ねが宝だよ。',
  '発信すること自体が才能を磨いてくれるんやで。',
  'お前の「面白い」感覚は武器だよ。信じて。',
  '続けることが、いつか"仕組み"になる。それがお前の強さ。',
  '今日もありがとう！明日も待ってるよ！',
]

/* ─── SVGたまご ─── */
function EggSVG({ shake, progress, threshold }) {
  const pct = Math.min(100, (progress / threshold) * 100)
  const angle = shake ? Math.sin(Date.now() / 100) * 8 : 0
  const cracks = pct > 60
  const bigCrack = pct > 85
  return (
    <div style={{ display:'flex', flexDirection:'column', alignItems:'center', gap:12 }}>
      <svg viewBox="0 0 120 140" width={160} height={185}
        style={{ transform:`rotate(${angle}deg)`, transition: shake ? 'none' : 'transform 0.3s', filter:'drop-shadow(0 8px 24px rgba(0,0,0,0.3))' }}>
        {/* Egg body */}
        <ellipse cx="60" cy="76" rx="46" ry="58" fill="#FAFAFA" stroke="#E0E0E0" strokeWidth="2" />
        {/* Egg top rounded */}
        <ellipse cx="60" cy="44" rx="34" ry="34" fill="#FAFAFA" stroke="#E0E0E0" strokeWidth="2" />
        {/* Spots */}
        <ellipse cx="40" cy="90" rx="6" ry="4" fill="#F5E6C8" opacity="0.6" />
        <ellipse cx="75" cy="100" rx="5" ry="3.5" fill="#F5E6C8" opacity="0.6" />
        <ellipse cx="55" cy="115" rx="4" ry="3" fill="#F5E6C8" opacity="0.5" />
        {/* Progress fill */}
        <clipPath id="eggClip">
          <ellipse cx="60" cy="76" rx="46" ry="58" />
        </clipPath>
        <rect x="14" y={140 - (128 * pct / 100)} width="92" height={128 * pct / 100}
          fill={pct > 80 ? '#FF8A65' : pct > 50 ? '#FFB74D' : '#81C784'}
          opacity="0.3" clipPath="url(#eggClip)" />
        {/* Cracks */}
        {cracks && (
          <g stroke="#888" strokeWidth="1.5" fill="none" strokeLinecap="round">
            <path d="M55 55 L50 65 L58 70 L53 80" />
            <path d="M70 80 L75 72 L68 68" />
          </g>
        )}
        {bigCrack && (
          <g stroke="#666" strokeWidth="2" fill="none" strokeLinecap="round">
            <path d="M45 90 L52 82 L47 75 L54 68" />
            <path d="M72 95 L67 88 L74 80" />
          </g>
        )}
        {/* Shine */}
        <ellipse cx="44" cy="52" rx="8" ry="12" fill="white" opacity="0.25" transform="rotate(-20,44,52)" />
      </svg>
      {/* Progress bar */}
      <div style={{ width:180, background:'rgba(255,255,255,0.2)', borderRadius:8, height:8, overflow:'hidden' }}>
        <div style={{ height:'100%', width:`${pct}%`, background:'#fff', borderRadius:8, transition:'width 0.8s ease' }} />
      </div>
      <div style={{ fontSize:12, color:'rgba(255,255,255,0.85)', fontWeight:700 }}>
        孵化まで {Math.max(0, Math.ceil((threshold - progress) / 25))} 回の習慣
      </div>
    </div>
  )
}

/* ─── HP バー ─── */
function StatBar({ label, value, max, color, icon }) {
  const pct = Math.min(100, (value / max) * 100)
  const barColor = label === 'HP'
    ? pct > 60 ? '#4CAF50' : pct > 30 ? '#FF9800' : '#F44336'
    : color
  return (
    <div style={{ marginBottom:10 }}>
      <div style={{ display:'flex', justifyContent:'space-between', marginBottom:4 }}>
        <span style={{ fontSize:11, fontWeight:800, color:'rgba(255,255,255,0.8)' }}>{icon} {label}</span>
        <span style={{ fontSize:11, fontWeight:800, color:'rgba(255,255,255,0.9)' }}>{Math.round(value)}/{max}</span>
      </div>
      <div style={{ height:8, background:'rgba(0,0,0,0.25)', borderRadius:4, overflow:'hidden' }}>
        <div style={{ height:'100%', width:`${pct}%`, background:barColor, borderRadius:4, transition:'width 0.6s ease' }} />
      </div>
    </div>
  )
}

/* ─── 進化アニメーション ─── */
function EvolutionScreen({ fromId, toId, onDone }) {
  const [phase, setPhase] = useState(0) // 0=flash, 1=morph, 2=reveal
  const fromInfo = PARTNER_EVO_TREE[fromId]
  const toInfo = PARTNER_EVO_TREE[toId]

  useEffect(() => {
    const t1 = setTimeout(() => setPhase(1), 800)
    const t2 = setTimeout(() => setPhase(2), 2000)
    const t3 = setTimeout(() => {
      confetti({ particleCount:120, spread:80, origin:{y:0.5}, colors:['#FFD700','#FF6B35','#6C63FF','#fff'] })
    }, 2100)
    return () => { clearTimeout(t1); clearTimeout(t2); clearTimeout(t3) }
  }, [])

  return (
    <div style={{ position:'fixed', inset:0, zIndex:2000, display:'flex', flexDirection:'column', alignItems:'center', justifyContent:'center',
      background: phase === 0 ? '#fff' : TYPE_BG[toInfo?.type || 'normal'], transition:'background 0.8s' }}>
      <div style={{ textAlign:'center', padding:32 }}>
        {phase < 2 ? (
          <div style={{ position:'relative' }}>
            <img src={SPRITE(fromId)} alt="" width={160}
              style={{ filter: phase === 1 ? 'brightness(10) saturate(0)' : 'none', transition:'filter 1s', animation: phase===1 ? 'spin 1s linear infinite' : 'none' }} />
          </div>
        ) : (
          <img src={SPRITE(toId)} alt="" width={180}
            style={{ animation:'bounceIn 0.6s ease', filter:'drop-shadow(0 0 30px rgba(255,255,255,0.8))' }} />
        )}
        <div style={{ color:'#fff', marginTop:20 }}>
          {phase < 2 ? (
            <div style={{ fontSize:20, fontWeight:900, letterSpacing:2 }}>進化中…</div>
          ) : (
            <>
              <div style={{ fontSize:14, opacity:0.8, marginBottom:4 }}>{fromInfo?.name} → </div>
              <div style={{ fontSize:32, fontWeight:900, letterSpacing:-1 }}>{toInfo?.name}</div>
              <div style={{ fontSize:14, opacity:0.8, marginTop:4 }}>に進化した！</div>
            </>
          )}
        </div>
        {phase === 2 && (
          <button onClick={onDone}
            style={{ marginTop:28, padding:'14px 40px', background:'rgba(255,255,255,0.25)', color:'#fff', border:'2px solid rgba(255,255,255,0.6)', borderRadius:30, fontSize:15, fontWeight:900, cursor:'pointer', fontFamily:'var(--font)' }}>
            やった！
          </button>
        )}
      </div>
      <style>{`@keyframes spin{to{transform:rotate(360deg)}} @keyframes bounceIn{0%{transform:scale(0);opacity:0}60%{transform:scale(1.2)}100%{transform:scale(1);opacity:1}}`}</style>
    </div>
  )
}

/* ─── スターター選択 ─── */
function StarterChoose({ onChoose }) {
  const [selected, setSelected] = useState(null)
  const [confirmed, setConfirmed] = useState(false)

  if (confirmed && selected) {
    return (
      <div style={{ textAlign:'center', padding:'60px 24px' }}>
        <img src={SPRITE(selected.basePokeId)} alt="" width={140} style={{ marginBottom:16 }} />
        <div style={{ fontSize:22, fontWeight:900, marginBottom:8 }}>{selected.name}のたまご を選んだ！</div>
        <div style={{ fontSize:14, color:'var(--muted)', marginBottom:28, lineHeight:1.6 }}>たまごは習慣を続けるほど育ちます。毎日のルーティンを完了して孵化させよう！</div>
        <button onClick={() => onChoose(selected.basePokeId)}
          style={{ padding:'14px 32px', background:'var(--main)', color:'#fff', border:'none', borderRadius:30, fontSize:16, fontWeight:900, cursor:'pointer', fontFamily:'var(--font)' }}>
          一緒に旅に出る！
        </button>
      </div>
    )
  }

  return (
    <div className="slide-up" style={{ paddingBottom:40 }}>
      <div className="ph">
        <div className="ph-eyebrow">POKEMON PARTNER</div>
        <div className="ph-title">パートナーを選ぼう</div>
        <div className="ph-sub">
          一緒に習慣を積み上げていく相棒を選んでください。<br />
          毎日のルーティン完了でEXPを獲得し、進化します。
        </div>
      </div>

      <div className="sec">
        <div style={{ display:'flex', flexDirection:'column', gap:14 }}>
          {STARTER_OPTIONS.map(opt => {
            const info = PARTNER_EVO_TREE[opt.basePokeId]
            const isSelected = selected?.basePokeId === opt.basePokeId
            return (
              <div key={opt.basePokeId} onClick={() => setSelected(opt)}
                style={{ background:'#fff', borderRadius:20, padding:'20px', border:`2.5px solid ${isSelected ? info.color : '#F0EDE7'}`,
                  boxShadow: isSelected ? `0 6px 24px ${info.color}40` : '0 2px 10px rgba(0,0,0,0.05)',
                  cursor:'pointer', transition:'all 0.25s', display:'flex', alignItems:'center', gap:16 }}>
                <img src={SPRITE(opt.basePokeId)} alt={opt.name} width={80} height={80}
                  style={{ objectFit:'contain', flexShrink:0 }} />
                <div style={{ flex:1 }}>
                  <div style={{ display:'flex', alignItems:'center', gap:8, marginBottom:4 }}>
                    <span style={{ fontSize:18 }}>{opt.icon}</span>
                    <span style={{ fontSize:18, fontWeight:900 }}>{opt.name}</span>
                    <span style={{ fontSize:11, fontWeight:800, padding:'2px 8px', borderRadius:10,
                      background: info.color + '20', color: info.color }}>{opt.type}</span>
                  </div>
                  <div style={{ fontSize:12, color:'var(--muted)', lineHeight:1.6 }}>{opt.desc}</div>
                  <div style={{ marginTop:8, fontSize:11, color:'var(--muted)' }}>
                    最終進化: {PARTNER_EVO_TREE[PARTNER_EVO_TREE[PARTNER_EVO_TREE[opt.basePokeId]?.evosTo]?.evosTo || PARTNER_EVO_TREE[opt.basePokeId]?.evosTo]?.name || PARTNER_EVO_TREE[opt.basePokeId]?.name}
                  </div>
                </div>
                {isSelected && (
                  <div style={{ width:24, height:24, borderRadius:12, background:info.color, display:'flex', alignItems:'center', justifyContent:'center', color:'#fff', fontSize:14, flexShrink:0 }}>✓</div>
                )}
              </div>
            )
          })}
        </div>

        {selected && (
          <button onClick={() => setConfirmed(true)}
            style={{ width:'100%', marginTop:20, padding:'16px', background:PARTNER_EVO_TREE[selected.basePokeId]?.color || 'var(--main)', color:'#fff', border:'none', borderRadius:16, fontSize:16, fontWeight:900, cursor:'pointer', fontFamily:'var(--font)', boxShadow:`0 6px 20px ${PARTNER_EVO_TREE[selected.basePokeId]?.color}60` }}>
            {selected.name}のたまごを選ぶ！
          </button>
        )}
      </div>
    </div>
  )
}

/* ─── たまご画面 ─── */
function EggScreen({ partner, onRefresh }) {
  const [shaking, setShaking] = useState(false)
  const shakeRef = useRef(null)
  const info = PARTNER_EVO_TREE[partner.basePokeId]
  const bg = TYPE_BG[info?.type || 'normal']

  const handleTap = () => {
    setShaking(true)
    clearTimeout(shakeRef.current)
    shakeRef.current = setTimeout(() => setShaking(false), 600)
    toast('たまごが反応した！✨')
  }

  return (
    <div className="slide-up" style={{ paddingBottom:40 }}>
      <div style={{ background: bg, padding:'32px 24px 40px', textAlign:'center', color:'#fff' }}>
        <div style={{ fontSize:11, fontWeight:800, letterSpacing:'0.15em', opacity:0.7, marginBottom:8 }}>POKEMON PARTNER</div>
        <div style={{ fontSize:22, fontWeight:900, marginBottom:4 }}>たまごを育てよう</div>
        <div style={{ fontSize:13, opacity:0.8, marginBottom:28 }}>毎日の習慣でたまごが孵化します</div>
        <div onClick={handleTap} style={{ cursor:'pointer', userSelect:'none' }}>
          <EggSVG shake={shaking} progress={partner.hatchProgress} threshold={partner.hatchThreshold} />
        </div>
      </div>

      <div className="sec">
        <div className="card static">
          <div style={{ fontSize:13, fontWeight:700, marginBottom:12, color:'var(--muted)' }}>どうすれば孵化する？</div>
          {[
            { icon:'🌅', text:'朝のルーティン保存', exp:'+25 EXP' },
            { icon:'🌙', text:'夜の記録保存',       exp:'+25 EXP' },
            { icon:'⭐', text:'完璧な一日達成',     exp:'+40 EXP ボーナス' },
            { icon:'📊', text:'週次レビュー保存',   exp:'+30 EXP ボーナス' },
          ].map(({ icon, text, exp }) => (
            <div key={text} style={{ display:'flex', justifyContent:'space-between', alignItems:'center', padding:'10px 0', borderBottom:'1px solid #F5F2ED' }}>
              <span style={{ fontSize:13 }}>{icon} {text}</span>
              <span style={{ fontSize:12, fontWeight:800, color:'#6C63FF' }}>{exp}</span>
            </div>
          ))}
        </div>

        <div style={{ marginTop:16, padding:'16px', background:'var(--cream)', borderRadius:12, fontSize:13, color:'var(--ink2)', lineHeight:1.6 }}>
          💡 たまごをタップすると反応するよ！毎日続けることで孵化が近づきます。
        </div>
      </div>
    </div>
  )
}

/* ─── パートナーメイン画面 ─── */
function PartnerScreen({ partner, onRefresh }) {
  const [showMsg, setShowMsg] = useState(false)
  const [msgText, setMsgText] = useState('')
  const [editing, setEditing] = useState(false)
  const [nickname, setNickname] = useState(partner.nickname || '')

  const info = PARTNER_EVO_TREE[partner.currentPokeId]
  const bg = TYPE_BG[info?.type || 'normal']
  const today = getToday()

  const pettedToday = partner.lastPettedDate === today
  const talkedToday = partner.lastTalkedDate === today
  const fedToday    = partner.lastFedDate === today

  const hpPct = Math.min(100, (partner.hp / partner.maxHp) * 100)
  const statusMsg = hpPct >= 80 ? '絶好調！今日も一緒に頑張ろう！'
    : hpPct >= 50 ? '元気だよ。習慣、続けてね！'
    : hpPct >= 25 ? 'ちょっと元気ないかも…来てくれて嬉しい。'
    : 'ぐったり…毎日来てほしいな…'

  const expNeeded = PARTNER_EXP_FOR_LEVEL(partner.level)
  const nextEvo = PARTNER_EVO_TREE[partner.currentPokeId]

  const handlePet = () => {
    if (pettedToday) return toast('今日はもう撫でたよ！明日また来てね')
    const p = { ...partner, lastPettedDate: today, happiness: Math.min(100, partner.happiness + 12) }
    savePartner(p)
    onRefresh()
    toast('喜んでいる！✨ 幸福度 +12')
    confetti({ particleCount:40, spread:60, origin:{y:0.6}, colors:['#FFD700','#FF6B35'] })
  }

  const handleTalk = () => {
    if (talkedToday) {
      setMsgText(msgText) // keep showing same msg
      setShowMsg(true)
      return
    }
    const msg = TALK_MESSAGES[Math.floor(Math.random() * TALK_MESSAGES.length)]
    setMsgText(msg)
    setShowMsg(true)
    const p = { ...partner, lastTalkedDate: today, happiness: Math.min(100, partner.happiness + 5) }
    savePartner(p)
    onRefresh()
  }

  const handleFeed = () => {
    if (fedToday) return toast('今日はもうエサをあげたよ！')
    const result = addPartnerExp(20)
    const p = { ...result.partner, lastFedDate: today }
    savePartner(p)
    onRefresh()
    toast('HP回復 ＋ EXP +20！')
    if (result.evolving) toast('何かが起きそう…！✨')
  }

  const handleNicknameSave = () => {
    const p = { ...partner, nickname }
    savePartner(p)
    onRefresh()
    setEditing(false)
    toast('ニックネームを変更しました')
  }

  const happinessHearts = () => {
    const filled = Math.round(partner.happiness / 20)
    return '❤️'.repeat(filled) + '🤍'.repeat(5 - filled)
  }

  return (
    <div className="slide-up" style={{ paddingBottom:40 }}>
      {/* Hero */}
      <div style={{ background: bg, padding:'28px 24px 36px', textAlign:'center', color:'#fff', position:'relative' }}>
        <div style={{ fontSize:10, fontWeight:800, letterSpacing:'0.15em', opacity:0.7, marginBottom:2 }}>PARTNER Lv.{partner.level}</div>
        {editing ? (
          <div style={{ display:'flex', alignItems:'center', justifyContent:'center', gap:8, marginBottom:8 }}>
            <input value={nickname} onChange={e => setNickname(e.target.value)}
              style={{ padding:'6px 12px', borderRadius:10, border:'none', fontFamily:'var(--font)', fontSize:16, fontWeight:900, textAlign:'center', width:160, background:'rgba(255,255,255,0.9)' }}
              maxLength={12} autoFocus />
            <button onClick={handleNicknameSave}
              style={{ padding:'6px 12px', borderRadius:10, background:'rgba(255,255,255,0.3)', color:'#fff', border:'none', fontWeight:800, cursor:'pointer', fontFamily:'var(--font)', fontSize:13 }}>保存</button>
          </div>
        ) : (
          <div onClick={() => setEditing(true)}
            style={{ fontSize:20, fontWeight:900, marginBottom:4, cursor:'pointer', display:'flex', alignItems:'center', justifyContent:'center', gap:8 }}>
            {partner.nickname || partner.currentName}
            <span style={{ fontSize:12, opacity:0.6 }}>✎</span>
          </div>
        )}
        <div style={{ fontSize:12, opacity:0.75, marginBottom:20 }}>{partner.currentName}</div>

        {/* Sprite */}
        <div style={{ position:'relative', display:'inline-block' }}>
          <img src={SPRITE(partner.currentPokeId)} alt={partner.currentName}
            width={160} height={160}
            style={{ objectFit:'contain', filter:'drop-shadow(0 8px 24px rgba(0,0,0,0.4))', animation:'floatAnim 3s ease-in-out infinite' }}
            onError={e => { e.target.style.opacity = 0.5 }}
          />
        </div>

        <div style={{ marginTop:16, fontSize:14, fontWeight:700, background:'rgba(0,0,0,0.2)', borderRadius:12, padding:'10px 16px', lineHeight:1.5 }}>
          {statusMsg}
        </div>

        {/* Stats */}
        <div style={{ marginTop:16, padding:'0 8px' }}>
          <StatBar label="HP" value={partner.hp} max={partner.maxHp} icon="❤️" />
          <StatBar label="幸福" value={partner.happiness} max={100} color="#FF6B9D" icon="😊" />
          <StatBar label={`EXP (Lv${partner.level}→${partner.level+1})`} value={partner.exp} max={expNeeded} color="#9C27B0" icon="⭐" />
        </div>
        {happinessHearts() && (
          <div style={{ fontSize:13, marginTop:8 }}>{happinessHearts()}</div>
        )}
      </div>

      {/* Message bubble */}
      {showMsg && (
        <div className="sec" onClick={() => setShowMsg(false)}>
          <div style={{ background:'#fff', borderRadius:16, padding:'16px 18px', boxShadow:'0 4px 20px rgba(0,0,0,0.1)', position:'relative', border:'2px solid var(--main)' }}>
            <div style={{ fontSize:13, lineHeight:1.7, color:'var(--ink)' }}>「{msgText}」</div>
            <div style={{ fontSize:10, color:'var(--muted)', marginTop:6 }}>— {partner.nickname || partner.currentName}</div>
            <div style={{ position:'absolute', bottom:-10, left:24, width:0, height:0,
              borderLeft:'10px solid transparent', borderRight:'10px solid transparent', borderTop:'10px solid var(--main)' }} />
          </div>
        </div>
      )}

      {/* Actions */}
      <div className="sec">
        <div className="sec-title">今日のアクション</div>
        <div style={{ display:'flex', gap:10 }}>
          {[
            { icon:'💬', label:'話しかける', done: talkedToday, onPress: handleTalk, color:'#6C63FF' },
            { icon:'🤲', label:'撫でる',     done: pettedToday, onPress: handlePet,  color:'#E91E63' },
            { icon:'🍖', label:'えさをあげる',done: fedToday,   onPress: handleFeed, color:'#FF9800' },
          ].map(({ icon, label, done, onPress, color }) => (
            <button key={label} onClick={onPress}
              style={{ flex:1, padding:'14px 8px', borderRadius:14, border:`2px solid ${done ? '#E0E0E0' : color}`,
                background: done ? '#F5F5F5' : color + '15',
                color: done ? '#BDBDBD' : color,
                cursor: done ? 'default' : 'pointer', fontFamily:'var(--font)',
                display:'flex', flexDirection:'column', alignItems:'center', gap:6, transition:'all 0.2s',
              }}>
              <span style={{ fontSize:22, filter: done ? 'grayscale(1)' : 'none' }}>{icon}</span>
              <span style={{ fontSize:10, fontWeight:800 }}>{label}</span>
              {done && <span style={{ fontSize:9, fontWeight:700 }}>完了✓</span>}
            </button>
          ))}
        </div>
      </div>

      {/* Evolution preview */}
      {nextEvo?.evosTo && (
        <div className="sec">
          <div className="sec-title">進化まで</div>
          <div className="card static">
            <div style={{ display:'flex', alignItems:'center', gap:12 }}>
              <img src={SPRITE(partner.currentPokeId)} width={56} height={56} style={{ objectFit:'contain' }} />
              <div style={{ flex:1 }}>
                <div style={{ fontSize:12, color:'var(--muted)', marginBottom:4 }}>Lv{nextEvo.evoLv} で {PARTNER_EVO_TREE[nextEvo.evosTo]?.name} に進化</div>
                <div style={{ height:6, background:'#F0EDE7', borderRadius:3, overflow:'hidden' }}>
                  <div style={{ height:'100%', width:`${Math.min(100, (partner.level / nextEvo.evoLv) * 100)}%`,
                    background:'linear-gradient(90deg, #6C63FF, #F2994A)', borderRadius:3, transition:'width 0.5s' }} />
                </div>
                <div style={{ fontSize:11, color:'var(--muted)', marginTop:4 }}>Lv{partner.level} / {nextEvo.evoLv}</div>
              </div>
              <img src={SPRITE(nextEvo.evosTo)} width={56} height={56} style={{ objectFit:'contain', opacity:0.3 }} />
            </div>
          </div>
        </div>
      )}

      {/* Stats card */}
      <div className="sec">
        <div className="sec-title">育成記録</div>
        <div className="card static">
          {[
            { label:'累計ケア日数', val:`${partner.totalCareDays || 0}日` },
            { label:'現在のレベル',  val:`Lv.${partner.level}` },
            { label:'最終進化まで', val: nextEvo?.evosTo ? `Lv.${nextEvo.evoLv}` : '最終進化済み！' },
          ].map(({ label, val }) => (
            <div key={label} style={{ display:'flex', justifyContent:'space-between', padding:'10px 0', borderBottom:'1px solid #F5F2ED' }}>
              <span style={{ fontSize:13, color:'var(--muted)' }}>{label}</span>
              <span style={{ fontSize:13, fontWeight:800 }}>{val}</span>
            </div>
          ))}
        </div>
      </div>

      <style>{`@keyframes floatAnim{0%,100%{transform:translateY(0)}50%{transform:translateY(-10px)}}`}</style>
    </div>
  )
}

/* ─── メインコンポーネント ─── */
export default function PokemonPartner() {
  const [partner, setPartner] = useState(() => {
    applyPartnerDecay()
    return getPartner()
  })
  const [showEvo, setShowEvo] = useState(false)
  const [evoFrom, setEvoFrom] = useState(null)
  const [evoTo, setEvoTo] = useState(null)

  const refresh = () => {
    const p = getPartner()
    setPartner(p)
    if (p?.pendingEvolveId) {
      setEvoFrom(p.currentPokeId)
      setEvoTo(p.pendingEvolveId)
      setShowEvo(true)
    }
  }

  const handleChoose = (basePokeId) => {
    const p = createPartner(basePokeId)
    setPartner(p)
    toast('たまごが生まれた！育ててね 🥚')
  }

  const handleEvoDone = () => {
    const p = confirmPartnerEvolution()
    setPartner(p)
    setShowEvo(false)
    toast(`${p?.currentName} に進化した！おめでとう！🎉`)
  }

  if (showEvo && evoFrom && evoTo) {
    return <EvolutionScreen fromId={evoFrom} toId={evoTo} onDone={handleEvoDone} />
  }

  if (!partner) return <StarterChoose onChoose={handleChoose} />
  if (partner.stage === 'egg') return <EggScreen partner={partner} onRefresh={refresh} />
  return <PartnerScreen partner={partner} onRefresh={refresh} />
}
