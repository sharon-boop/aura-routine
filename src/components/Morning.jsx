import { useState, useEffect, useRef } from 'react'
import {
  getTodayRecord, updateTodayRecord,
  getChecklistTemplate, saveChecklistTemplate,
  getAttitudeOptions, RARE_ATTITUDES,
  getWordThemeOptions, getMustKeepOptions,
  getFavorites, saveFavorites,
  getUnlockedAttitudes,
  incrementGachaCount,
  getGachaTickets, addGachaTickets, wasTicketAwarded, markTicketAwarded,
  getWeeklySleepTotal, getWeekKey,
  addPartnerExp, getPartner,
} from '../utils/storage'
import { toast } from './Toast'
import confetti from 'canvas-confetti'

/* ─── 睡眠時間入力 ─── */
function SleepInput({ value, onChange }) {
  const hours = value || 0
  const weekTotal = getWeeklySleepTotal()
  const pct = Math.min(100, (weekTotal / 49) * 100)
  const achieved = weekTotal >= 49

  const quickVals = [5, 6, 7, 8, 9]

  return (
    <div style={{
      background: 'linear-gradient(135deg, #00BCD4 0%, #0097A7 100%)',
      borderRadius: 18, padding: '18px 20px', color: '#fff',
      boxShadow: '0 4px 16px rgba(0,188,212,0.3)',
    }}>
      <div style={{ display:'flex', alignItems:'center', justifyContent:'space-between', marginBottom:14 }}>
        <div>
          <div style={{ fontSize:10, fontWeight:800, letterSpacing:'0.15em', opacity:0.85, marginBottom:3 }}>😴 LAST NIGHT SLEEP</div>
          <div style={{ fontSize:11, opacity:0.75 }}>昨夜の睡眠時間</div>
        </div>
        <div style={{ textAlign:'center' }}>
          <div style={{ fontSize:42, fontWeight:900, lineHeight:1, letterSpacing:-2 }}>{hours.toFixed(1)}</div>
          <div style={{ fontSize:11, opacity:0.8, fontWeight:700 }}>時間</div>
        </div>
      </div>

      {/* スライダー */}
      <input type="range" min={0} max={12} step={0.5} value={hours}
        onChange={e => onChange(Number(e.target.value))}
        style={{ width:'100%', accentColor:'#fff', marginBottom:12 }} />

      {/* クイックボタン */}
      <div style={{ display:'flex', gap:8, marginBottom:16 }}>
        {quickVals.map(v => (
          <button key={v} onClick={() => onChange(v)} style={{
            flex:1, padding:'7px 0', borderRadius:10,
            background: hours === v ? 'rgba(255,255,255,0.35)' : 'rgba(255,255,255,0.15)',
            border: hours === v ? '1.5px solid #fff' : '1.5px solid rgba(255,255,255,0.3)',
            color:'#fff', fontSize:12, fontWeight:800, cursor:'pointer', fontFamily:'var(--font)',
            transition:'all 0.2s',
          }}>{v}h</button>
        ))}
      </div>

      {/* 週の合計 */}
      <div style={{ background:'rgba(0,0,0,0.15)', borderRadius:10, padding:'10px 14px' }}>
        <div style={{ display:'flex', justifyContent:'space-between', alignItems:'center', marginBottom:6 }}>
          <div style={{ fontSize:11, fontWeight:700, opacity:0.9 }}>📊 今週の睡眠合計</div>
          <div style={{ fontSize:13, fontWeight:900 }}>
            {weekTotal.toFixed(1)} <span style={{ fontSize:10, opacity:0.8 }}>/ 49時間</span>
          </div>
        </div>
        <div style={{ height:6, background:'rgba(255,255,255,0.2)', borderRadius:3, overflow:'hidden' }}>
          <div style={{ height:'100%', width:`${pct}%`, background: achieved ? '#FFD700' : '#fff', borderRadius:3, transition:'width 0.5s' }} />
        </div>
        {achieved && (
          <div style={{ marginTop:8, fontSize:11, fontWeight:800, color:'#FFD700', textAlign:'center' }}>
            🎉 49時間達成！保存すると +2チケット🎟️
          </div>
        )}
        {!achieved && (
          <div style={{ marginTop:6, fontSize:10, opacity:0.75, textAlign:'right' }}>
            あと {(49 - weekTotal).toFixed(1)}時間で達成
          </div>
        )}
      </div>
    </div>
  )
}

const MOODS = ['🔥', '😌', '😆', '😢', '😳', '😐']

/* ─── ChipSelector ─────────────────────────── */
function ChipSelector({ options, value, onChange, favKey, maxVisible = 12 }) {
  const [favs, setFavs] = useState(() => getFavorites(favKey))
  const [expanded, setExpanded] = useState(false)

  const sorted = [...new Set([...favs.filter(f => options.includes(f)), ...options])]
  const visible = expanded ? sorted : sorted.slice(0, maxVisible)
  const hasMore = sorted.length > maxVisible

  const toggleFav = (e, item) => {
    e.stopPropagation()
    const next = favs.includes(item) ? favs.filter(f => f !== item) : [...favs, item]
    setFavs(next)
    saveFavorites(favKey, next)
  }

  return (
    <div>
      <div className="chip-grid">
        {visible.map(opt => (
          <button
            key={opt}
            className={`chip ${value === opt ? 'selected' : ''} ${favs.includes(opt) && value !== opt ? 'favorited' : ''}`}
            onClick={() => onChange(opt)}
          >
            {opt}
            <span className="chip-star" onClick={e => toggleFav(e, opt)}>
              {favs.includes(opt) ? '★' : '☆'}
            </span>
          </button>
        ))}
      </div>
      {hasMore && (
        <button className="chip-more-btn" onClick={() => setExpanded(e => !e)}>
          {expanded ? '閉じる ↑' : `＋ ${sorted.length - maxVisible}件 もっと見る`}
        </button>
      )}
    </div>
  )
}

/* ─── AttitudeSection（完全ランダムガチャ）─── */
function AttitudeSection({ value, onChange }) {
  const [options]   = useState(getAttitudeOptions)
  const [spinning, setSpinning] = useState(false)
  const [display, setDisplay]   = useState(value || '')
  const [isRare, setIsRare]     = useState(false)
  const ivRef = useRef(null)

  useEffect(() => { setDisplay(value || '') }, [value])
  useEffect(() => () => clearInterval(ivRef.current), [])

  const spin = () => {
    if (spinning) return
    const unlocked = getUnlockedAttitudes()
    const normalPool = [...options, ...unlocked]
    const all = [...normalPool, ...RARE_ATTITUDES]
    const rare = Math.random() < 0.15
    const pool = rare ? RARE_ATTITUDES : normalPool
    const finalResult = pool[Math.floor(Math.random() * pool.length)]
    incrementGachaCount()
    setIsRare(rare); setSpinning(true)
    let count = 0
    ivRef.current = setInterval(() => {
      setDisplay(all[Math.floor(Math.random() * all.length)])
      count++
      if (count >= 16) {
        clearInterval(ivRef.current)
        setDisplay(finalResult)
        setSpinning(false)
        onChange(finalResult)
        if (rare) {
          confetti({ particleCount: 100, spread: 80, origin: { y: 0.5 }, colors: ['#FFD700','#FF6B35','#6C63FF'] })
          toast('✦ RARE IN — 特別な在り方が出た！')
        } else {
          toast(`今日の在り方：「${finalResult}」`)
        }
      }
    }, 70)
  }

  const hasValue = display && display.length > 1

  return (
    <div className="attitude-section">
      <div className="att-header">
        <div className="att-eyebrow">TODAY'S IDENTITY</div>
        <div className={`att-display ${spinning ? 'att-spinning' : ''} ${isRare && !spinning ? 'att-rare' : ''} ${!hasValue ? 'att-placeholder' : ''}`}>
          {hasValue ? display : '在り方を決めよう'}
        </div>
        {isRare && !spinning && <div className="att-rare-badge">RARE ✦</div>}
      </div>
      <div className="att-content" style={{ paddingBottom: 4 }}>
        <button
          className={`gacha-roll-btn ${spinning ? 'rolling' : ''}`}
          onClick={spin}
          disabled={spinning}
        >
          {spinning ? '抽選中…' : hasValue ? '🎲 もう一度ガチャ' : '🎲 ガチャを引く'}
        </button>
      </div>
    </div>
  )
}

/* ─── OptionSection (言葉テーマ / 守ること) ── */
function OptionSection({ eyebrow, placeholder, value, onChange, options, favKey }) {
  const displayVal = value?.trim()

  const pickRandom = () => {
    if (!options.length) return
    const pick = options[Math.floor(Math.random() * options.length)]
    onChange(pick)
    toast(`🎲 「${pick}」`)
  }

  return (
    <div className="card static">
      <div style={{ display:'flex', alignItems:'center', justifyContent:'space-between', marginBottom:4 }}>
        <div className="option-eyebrow" style={{ marginBottom:0 }}>{eyebrow}</div>
        <button
          onClick={pickRandom}
          style={{ background:'var(--main)', border:'none', borderRadius:20, padding:'4px 10px', fontSize:10, fontWeight:800, color:'#fff', cursor:'pointer', letterSpacing:0.5, fontFamily:'var(--font)' }}
        >🎲 ランダム</button>
      </div>
      <div className={`option-selected ${!displayVal ? 'placeholder' : ''}`}>
        {displayVal || placeholder}
      </div>
      <ChipSelector
        options={options}
        value={value}
        onChange={onChange}
        favKey={favKey}
        maxVisible={12}
      />
      <div className="f" style={{ marginTop: 16, marginBottom: 0 }}>
        <label className="fl">または自分で書く</label>
        <input
          value={value || ''}
          onChange={e => onChange(e.target.value)}
          placeholder={placeholder}
        />
      </div>
    </div>
  )
}

/* ─── AddItemInput ────────────────────────── */
function AddItemInput({ onAdd }) {
  const [open, setOpen] = useState(false)
  const [val, setVal] = useState('')
  if (!open) return (
    <button className="add-item-btn" onClick={() => setOpen(true)}>＋ 項目を追加する</button>
  )
  return (
    <div style={{ display: 'flex', gap: 8, marginTop: 8 }}>
      <input
        value={val}
        onChange={e => setVal(e.target.value)}
        onKeyDown={e => e.key === 'Enter' && val.trim() && (onAdd(val.trim()), setVal(''), setOpen(false))}
        placeholder="新しいチェック項目"
        autoFocus
        style={{ flex: 1, padding: '11px 14px', borderRadius: 'var(--r-sm)', border: '1.5px solid var(--border)', background: '#FDFBF8', fontFamily: 'var(--font)', fontSize: 14, outline: 'none' }}
      />
      <button className="btn btn-sm btn-main" style={{ width: 'auto' }}
        onClick={() => { if (val.trim()) { onAdd(val.trim()); setVal(''); setOpen(false) } }}>追加</button>
      <button className="btn btn-sm btn-ghost" style={{ width: 'auto' }}
        onClick={() => { setOpen(false); setVal('') }}>×</button>
    </div>
  )
}

/* ─── Main Component ─────────────────────── */
export default function Morning() {
  const [data, setData]     = useState(null)
  const [checks, setChecks] = useState([])
  const [anim, setAnim]     = useState({})
  const [wordThemeOpts]     = useState(getWordThemeOptions)
  const [mustKeepOpts]      = useState(getMustKeepOptions)
  const [saved, setSaved]   = useState(false)

  useEffect(() => {
    setData(getTodayRecord())
    setChecks(getChecklistTemplate('morning'))
  }, [])

  const setMorning = (partial) => {
    const updated = updateTodayRecord({ morning: { ...data.morning, ...partial } })
    setData(updated)
  }

  const toggleCheck = (key) => {
    const next = { ...data.morning.checks, [key]: !data.morning.checks[key] }
    setAnim(a => ({ ...a, [key]: true }))
    setTimeout(() => setAnim(a => ({ ...a, [key]: false })), 250)
    if (!data.morning.checks[key]) toast('✓')
    setMorning({ checks: next })
  }

  const addItem = (label) => {
    const key = `mc_${Date.now()}`
    const next = [...checks, { key, label }]
    setChecks(next); saveChecklistTemplate('morning', next)
    setMorning({ checks: { ...data.morning.checks, [key]: false } })
    toast('追加しました')
  }

  const removeItem = (key) => {
    const next = checks.filter(c => c.key !== key)
    setChecks(next); saveChecklistTemplate('morning', next)
    const nc = { ...data.morning.checks }; delete nc[key]
    setMorning({ checks: nc })
  }

  const moveItem = (idx, dir) => {
    const next = [...checks]
    const target = idx + dir
    if (target < 0 || target >= next.length) return
    ;[next[idx], next[target]] = [next[target], next[idx]]
    setChecks(next); saveChecklistTemplate('morning', next)
  }

  const handleSave = () => {
    // パートナーにEXP付与
    if (getPartner()) addPartnerExp(25)
    // 週間睡眠チェック
    const weekKey = getWeekKey()
    const sleepTicketKey = `sleep_ticket_${weekKey}`
    if (!wasTicketAwarded(sleepTicketKey)) {
      const total = getWeeklySleepTotal()
      if (total >= 49) {
        addGachaTickets(2)
        markTicketAwarded(sleepTicketKey)
        const totalTickets = getGachaTickets()
        setTimeout(() => {
          confetti({ particleCount:80, spread:70, origin:{y:0.6}, colors:['#00BCD4','#FFD700','#fff'] })
          toast(`😴 週間睡眠 ${total.toFixed(1)}時間達成！ +2チケット🎟️（合計 ${totalTickets}枚）`)
        }, 500)
      }
    }
    setSaved(true)
    toast('今日の雰囲気は、自分で作れる。')
    setTimeout(() => setSaved(false), 3500)
  }

  if (!data) return null

  const dc = data.morning?.checks || {}
  const done = checks.filter(c => dc[c.key]).length

  return (
    <div className="slide-up" style={{ paddingBottom: '40px' }}>

      {/* ── Header ── */}
      <div className="ph">
        <div className="ph-eyebrow">Routine — Morning</div>
        <div className="ph-title">今日の自分を作る</div>
        <div className="ph-sub">「気分で生きるんじゃなく、今日の自分を先に決める。」</div>
        <div style={{ marginTop: 22, display: 'flex', alignItems: 'center', gap: 14 }}>
          <div style={{ fontSize: 11, fontWeight: 600, color: 'var(--muted)', letterSpacing: '0.08em', minWidth: 64 }}>
            {done}/{checks.length} 完了
          </div>
          <div className="pb-wrap" style={{ flex: 1, height: 2 }}>
            <div className="pb-fill" style={{ width: `${checks.length ? (done / checks.length) * 100 : 0}%`, background: 'var(--main)', height: '100%' }} />
          </div>
        </div>
      </div>

      {/* ── 在り方 ── */}
      <div className="sec">
        <div className="sec-title">今日の在り方</div>
        <AttitudeSection
          value={data.morning?.arikata}
          onChange={val => setMorning({ arikata: val })}
        />
      </div>

      {/* ── 言葉テーマ ── */}
      <div className="sec">
        <div className="sec-title">言葉テーマ</div>
        <OptionSection
          eyebrow="TODAY'S WORD THEME"
          placeholder="今日、意識する言葉の使い方"
          value={data.morning?.wordTheme}
          onChange={val => setMorning({ wordTheme: val })}
          options={wordThemeOpts}
          favKey="favoriteWordThemes"
        />
      </div>

      {/* ── 守ること ── */}
      <div className="sec">
        <div className="sec-title">今日の誓い</div>
        <OptionSection
          eyebrow="TODAY'S RULE"
          placeholder="今日、絶対に守ること"
          value={data.morning?.rule}
          onChange={val => setMorning({ rule: val })}
          options={mustKeepOpts}
          favKey="favoriteMustKeeps"
        />
      </div>

      {/* ── 気分 ── */}
      <div className="sec">
        <div className="sec-title">今朝の気分</div>
        <div className="card static">
          <div style={{ display: 'flex', gap: 10 }}>
            {MOODS.map(m => (
              <button key={m}
                onClick={() => { updateTodayRecord({ mood: m }); setData(d => ({ ...d, mood: m })); toast(`${m}`) }}
                style={{
                  width: 46, height: 46, borderRadius: 12,
                  border: `2px solid ${data.mood === m ? 'var(--main)' : 'var(--border)'}`,
                  background: data.mood === m ? 'var(--main)' : '#fff',
                  fontSize: 22, cursor: 'pointer',
                  display: 'flex', alignItems: 'center', justifyContent: 'center',
                  transition: 'all 0.2s',
                  transform: data.mood === m ? 'scale(1.1)' : 'scale(1)',
                }}>
                {m}
              </button>
            ))}
          </div>
        </div>
      </div>

      {/* ── 睡眠時間 ── */}
      <div className="sec">
        <div className="sec-title">昨夜の睡眠</div>
        <SleepInput
          value={data.morning?.sleepHours}
          onChange={v => setMorning({ sleepHours: v })}
        />
      </div>

      {/* ── チェックリスト ── */}
      <div className="sec">
        <div className="sec-title">朝の儀式</div>
        <div className="card static">
          {checks.map((c, idx) => (
            <div key={c.key} style={{ display:'flex', alignItems:'center', gap:4, borderBottom: idx < checks.length-1 ? '1px solid #F5F2ED' : 'none' }}>
              <div style={{ display:'flex', flexDirection:'column', gap:1 }}>
                <button onClick={e=>{e.stopPropagation();moveItem(idx,-1)}} disabled={idx===0}
                  style={{ background:'none', border:'none', fontSize:9, cursor:idx===0?'default':'pointer', color:idx===0?'#DDD':'var(--muted)', padding:'1px 3px', lineHeight:1 }}>▲</button>
                <button onClick={e=>{e.stopPropagation();moveItem(idx,1)}} disabled={idx===checks.length-1}
                  style={{ background:'none', border:'none', fontSize:9, cursor:idx===checks.length-1?'default':'pointer', color:idx===checks.length-1?'#DDD':'var(--muted)', padding:'1px 3px', lineHeight:1 }}>▼</button>
              </div>
              <div className="ck-item" style={{ flex:1, borderBottom:'none' }} onClick={() => toggleCheck(c.key)}>
                <div className={`ck-box ${dc[c.key] ? 'on' : ''} ${anim[c.key] ? 'ck-pop' : ''}`} />
                <span className={`ck-label ${dc[c.key] ? 'done' : ''}`}>{c.label}</span>
              </div>
              <button className="ck-del" onClick={e=>{e.stopPropagation();removeItem(c.key)}}>×</button>
            </div>
          ))}
          <AddItemInput onAdd={addItem} />
        </div>
      </div>

      {/* ── 価値を渡す3人 ── */}
      <div className="sec">
        <div className="sec-title">今日、価値を渡す3人</div>
        {(data.morning?.valuePeople || []).map((p, i) => (
          <div key={i} className="pcard">
            <div className="pnum">PERSON {i + 1}</div>
            <div className="f" style={{ marginBottom: 0 }}>
              <label className="fl">名前</label>
              <input
                value={p.name}
                onChange={e => {
                  const vp = [...data.morning.valuePeople]
                  vp[i] = { ...vp[i], name: e.target.value }
                  setMorning({ valuePeople: vp })
                }}
                placeholder={`${i + 1}人目の名前`}
              />
            </div>
          </div>
        ))}
      </div>

      {/* ── 保存 ── */}
      <div className="sec">
        {saved ? (
          <div style={{ textAlign: 'center', padding: '28px 0' }}>
            <div style={{ fontSize: 10, fontWeight: 600, letterSpacing: '0.2em', color: 'var(--muted)', textTransform: 'uppercase', marginBottom: 12 }}>Saved ✓</div>
            <div style={{ fontSize: 22, fontWeight: 800, letterSpacing: '-0.02em', color: 'var(--ink)', lineHeight: 1.3 }}>今日の雰囲気は、<br />自分で作れる。</div>
          </div>
        ) : (
          <button className="btn btn-main" onClick={handleSave}>
            今日の自分をセットする
          </button>
        )}
      </div>
    </div>
  )
}
