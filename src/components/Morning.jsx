import { useState, useEffect, useRef } from 'react'
import {
  getTodayRecord, updateTodayRecord,
  getChecklistTemplate, saveChecklistTemplate,
  getAttitudeOptions, RARE_ATTITUDES,
  getUnlockedAttitudes,
  incrementGachaCount,
  getGachaTickets, addGachaTickets, wasTicketAwarded, markTicketAwarded,
  getWeeklySleepTotal, getWeekKey,
  addPartnerExp, getPartner,
  addAuraXp, addFeedEntry, generateApprovalMessage, checkNeedsComeback, getComebackMessage,
  getTodos, saveTodos, addTodo, getToday,
  getContactMindset,
} from '../utils/storage'
import MindMovie from './MindMovie'
import { toast } from './Toast'
import confetti from 'canvas-confetti'
import ApprovalCard from './ApprovalCard'

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
      <input type="range" min={0} max={12} step={0.5} value={hours}
        onChange={e => onChange(Number(e.target.value))}
        style={{ width:'100%', accentColor:'#fff', marginBottom:12 }} />
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
        {achieved ? (
          <div style={{ marginTop:8, fontSize:11, fontWeight:800, color:'#FFD700', textAlign:'center' }}>
            🎉 49時間達成！保存すると +2チケット🎟️
          </div>
        ) : (
          <div style={{ marginTop:6, fontSize:10, opacity:0.75, textAlign:'right' }}>
            あと {(49 - weekTotal).toFixed(1)}時間で達成
          </div>
        )}
      </div>
    </div>
  )
}

const MOODS = ['🔥', '😌', '😆', '😢', '😳', '😐']

/* ─── 人との接し方（読み取り専用カード）─── */
function ContactMindsetDisplay() {
  const items = getContactMindset()
  return (
    <div style={{ display:'flex', flexDirection:'column', gap:8 }}>
      {items.map((item, i) => (
        <div key={i} style={{
          display:'flex', alignItems:'center', gap:12,
          background:'linear-gradient(135deg,#E0F7FA,#B2EBF2)',
          borderRadius:14, padding:'13px 16px',
          border:'1.5px solid rgba(0,188,212,0.2)',
        }}>
          <div style={{
            width:28, height:28, borderRadius:8, flexShrink:0,
            background:'rgba(0,188,212,0.25)',
            display:'flex', alignItems:'center', justifyContent:'center',
            fontSize:13, fontWeight:900, color:'#006064',
          }}>{i+1}</div>
          <div style={{ fontSize:15, fontWeight:700, color:'#004D40', lineHeight:1.4 }}>{item}</div>
        </div>
      ))}
    </div>
  )
}

/* ─── 在り方ガチャ（人との接し方）─── */
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
          toast('✦ RARE — 特別な在り方が出た！')
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
          {spinning ? '抽選中…' : hasValue ? '🎲 もう一度引く' : '🎲 ガチャを引く'}
        </button>
      </div>
    </div>
  )
}

/* ─── AddItemInput ─── */
function AddItemInput({ onAdd }) {
  const [open, setOpen] = useState(false)
  const [val, setVal] = useState('')
  if (!open) return (
    <button className="add-item-btn" onClick={() => setOpen(true)}>＋ 項目を追加する</button>
  )
  return (
    <div style={{ display:'flex', gap:8, marginTop:8 }}>
      <input
        value={val}
        onChange={e => setVal(e.target.value)}
        onKeyDown={e => e.key === 'Enter' && val.trim() && (onAdd(val.trim()), setVal(''), setOpen(false))}
        placeholder="新しいチェック項目"
        autoFocus
        style={{ flex:1, padding:'11px 14px', borderRadius:'var(--r-sm)', border:'1.5px solid var(--border)', background:'#FDFBF8', fontFamily:'var(--font)', fontSize:14, outline:'none' }}
      />
      <button className="btn btn-sm btn-main" style={{ width:'auto' }}
        onClick={() => { if (val.trim()) { onAdd(val.trim()); setVal(''); setOpen(false) } }}>追加</button>
      <button className="btn btn-sm btn-ghost" style={{ width:'auto' }}
        onClick={() => { setOpen(false); setVal('') }}>×</button>
    </div>
  )
}

/* ─── 今日のToDo（朝入力）─── */
function MorningTodo() {
  const [todos, setTodos] = useState(() => getTodos())
  const [input, setInput] = useState('')

  const today = getToday()
  const todayItems = todos.filter(t => t.todayFlag || t.date === today)
  const undone = todayItems.filter(t => !t.done)

  const handleAdd = () => {
    if (!input.trim()) return
    addTodo(input.trim(), { priority: 'mid', todayFlag: true })
    setTodos(getTodos())
    setInput('')
    toast('追加した ✓')
  }

  const toggle = (id) => {
    const updated = todos.map(t => t.id === id ? { ...t, done: !t.done } : t)
    saveTodos(updated); setTodos(updated)
  }

  return (
    <div style={{ background:'#fff', borderRadius:16, padding:'16px 18px', border:'1.5px solid var(--border)' }}>
      <div style={{ display:'flex', gap:8, marginBottom:14 }}>
        <input
          value={input}
          onChange={e => setInput(e.target.value)}
          onKeyDown={e => e.key === 'Enter' && handleAdd()}
          placeholder="今日やることを書こう"
          style={{ flex:1, padding:'11px 14px', borderRadius:50, border:'1.5px solid var(--border)', fontFamily:'var(--font)', fontSize:14, outline:'none', background:'#FDFBF8' }}
        />
        <button onClick={handleAdd} style={{
          padding:'11px 18px', borderRadius:50, border:'none',
          background:'var(--orange)', color:'#fff', fontWeight:900, fontSize:15,
          cursor:'pointer', fontFamily:'var(--font)', flexShrink:0,
        }}>+</button>
      </div>
      {undone.length === 0 && (
        <div style={{ textAlign:'center', fontSize:13, color:'var(--muted)', padding:'8px 0' }}>
          今日のタスクを追加しよう
        </div>
      )}
      {undone.map(item => (
        <div key={item.id} onClick={() => toggle(item.id)}
          style={{ display:'flex', alignItems:'center', gap:10, padding:'9px 0', borderBottom:'1px solid #F5F2ED', cursor:'pointer' }}>
          <div className={`ck-box ${item.done ? 'on' : ''}`} style={{ width:22, height:22, borderRadius:6 }} />
          <span style={{ fontSize:14, fontWeight:600, flex:1 }}>{item.text}</span>
        </div>
      ))}
    </div>
  )
}

/* ─── 前日残タスク確認 ─── */
function YesterdayTodos() {
  const [todos, setTodos] = useState(() => getTodos())
  const today = getToday()
  const yesterday = (() => {
    const d = new Date()
    d.setDate(d.getDate() - 1)
    return `${d.getFullYear()}-${String(d.getMonth()+1).padStart(2,'0')}-${String(d.getDate()).padStart(2,'0')}`
  })()

  const leftovers = todos.filter(t => !t.done && t.date === yesterday && t.date !== today)

  const carryOver = (id) => {
    const updated = todos.map(t => t.id === id ? { ...t, todayFlag: true, date: today } : t)
    saveTodos(updated); setTodos(updated)
    toast('今日に持ち越した')
  }

  const done = (id) => {
    const updated = todos.map(t => t.id === id ? { ...t, done: true } : t)
    saveTodos(updated); setTodos(updated)
    toast('完了 ✓')
  }

  if (leftovers.length === 0) return null

  return (
    <div style={{ background:'linear-gradient(135deg,#fff3e0,#ffe0b2)', borderRadius:16, padding:'16px 18px', border:'1.5px solid #FFD180' }}>
      <div style={{ fontSize:12, fontWeight:900, color:'#E65100', letterSpacing:1, marginBottom:10 }}>⚠ 前日の残タスク ({leftovers.length}件)</div>
      {leftovers.map(item => (
        <div key={item.id} style={{ display:'flex', alignItems:'center', gap:8, padding:'8px 0', borderBottom:'1px solid rgba(0,0,0,0.06)' }}>
          <span style={{ flex:1, fontSize:14, fontWeight:600, color:'#3E2723' }}>{item.text}</span>
          <button onClick={() => done(item.id)} style={{
            padding:'5px 12px', borderRadius:20, border:'none',
            background:'var(--success)', color:'#fff', fontSize:11, fontWeight:800,
            cursor:'pointer', fontFamily:'var(--font)', flexShrink:0,
          }}>完了</button>
          <button onClick={() => carryOver(item.id)} style={{
            padding:'5px 12px', borderRadius:20, border:'1.5px solid var(--orange)',
            background:'transparent', color:'var(--orange)', fontSize:11, fontWeight:800,
            cursor:'pointer', fontFamily:'var(--font)', flexShrink:0,
          }}>今日へ</button>
        </div>
      ))}
    </div>
  )
}

/* ─── Main Component ─── */
export default function Morning() {
  const [data, setData]     = useState(null)
  const [checks, setChecks] = useState([])
  const [anim, setAnim]     = useState({})
  const [saved, setSaved]   = useState(false)
  const [approvalData, setApprovalData] = useState(null)

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
    if (getPartner()) addPartnerExp(25)
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
    const xpResult = addAuraXp(15)
    const msg = generateApprovalMessage('morning')
    const isComeback = checkNeedsComeback()
    const comeback = isComeback ? getComebackMessage() : null
    addFeedEntry({ type:'morning_complete', message:'朝のルーティンを完了した', sub: msg.identity })
    if (xpResult.levelUp) {
      addFeedEntry({ type:'level_up', message:`Lv.${xpResult.level.lv} ${xpResult.level.label} に到達した` })
    }
    setSaved(true)
    setApprovalData({ msg, comeback, xpResult })
    setTimeout(() => setSaved(false), 3500)
  }

  if (!data) return null

  const dc = data.morning?.checks || {}
  const done = checks.filter(c => dc[c.key]).length

  return (
    <div className="slide-up" style={{ paddingBottom:'40px' }}>
      {approvalData && (
        <ApprovalCard
          msg={approvalData.msg}
          comeback={approvalData.comeback}
          xpResult={approvalData.xpResult}
          onClose={() => setApprovalData(null)}
        />
      )}

      {/* Header */}
      <div className="ph">
        <div className="ph-eyebrow">☀️ Morning</div>
        <div className="ph-title">今日の自分を作る</div>
        <div style={{ marginTop:16, display:'flex', alignItems:'center', gap:14 }}>
          <div style={{ fontSize:11, fontWeight:600, color:'var(--muted)', letterSpacing:'0.08em', minWidth:64 }}>
            {done}/{checks.length} 完了
          </div>
          <div className="pb-wrap" style={{ flex:1, height:2 }}>
            <div className="pb-fill" style={{ width:`${checks.length ? (done/checks.length)*100 : 0}%`, background:'var(--main)', height:'100%' }} />
          </div>
        </div>
      </div>

      {/* マインドムービー */}
      <div className="sec">
        <MindMovie />
      </div>

      {/* 睡眠時間 */}
      <div className="sec">
        <div className="sec-title">昨夜の睡眠</div>
        <SleepInput value={data.morning?.sleepHours} onChange={v => setMorning({ sleepHours: v })} />
      </div>

      {/* 人との接し方で意識すること（読み取り専用）*/}
      <div className="sec">
        <div className="sec-title">今日、人との接し方で意識すること</div>
        <ContactMindsetDisplay />
      </div>

      {/* 今日の在り方ガチャ */}
      <div className="sec">
        <div className="sec-title">今日の在り方</div>
        <AttitudeSection
          value={data.morning?.arikata}
          onChange={val => setMorning({ arikata: val })}
        />
      </div>

      {/* 今朝の気分 */}
      <div className="sec">
        <div className="sec-title">今朝の気分</div>
        <div className="card static">
          <div style={{ display:'flex', gap:10 }}>
            {MOODS.map(m => (
              <button key={m}
                onClick={() => { updateTodayRecord({ mood: m }); setData(d => ({ ...d, mood: m })); toast(`${m}`) }}
                style={{
                  width:46, height:46, borderRadius:12,
                  border:`2px solid ${data.mood === m ? 'var(--main)' : 'var(--border)'}`,
                  background: data.mood === m ? 'var(--main)' : '#fff',
                  fontSize:22, cursor:'pointer',
                  display:'flex', alignItems:'center', justifyContent:'center',
                  transition:'all 0.2s',
                  transform: data.mood === m ? 'scale(1.1)' : 'scale(1)',
                }}>
                {m}
              </button>
            ))}
          </div>
        </div>
      </div>

      {/* 朝のルーティン */}
      <div className="sec">
        <div className="sec-title">朝のルーティン</div>
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

      {/* 前日残タスク確認 */}
      <div className="sec">
        <div className="sec-title">前日の残タスク</div>
        <YesterdayTodos />
      </div>

      {/* 今日のToDo */}
      <div className="sec">
        <div className="sec-title">今日のToDo</div>
        <MorningTodo />
      </div>

      {/* 保存 */}
      <div className="sec">
        {saved ? (
          <div style={{ textAlign:'center', padding:'28px 0' }}>
            <div style={{ fontSize:10, fontWeight:600, letterSpacing:'0.2em', color:'var(--muted)', textTransform:'uppercase', marginBottom:12 }}>Saved ✓</div>
            <div style={{ fontSize:22, fontWeight:800, letterSpacing:'-0.02em', color:'var(--ink)', lineHeight:1.3 }}>今日の雰囲気は、<br />自分で作れる。</div>
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
