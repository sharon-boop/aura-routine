import { useState, useEffect } from 'react'
import {
  getToday, getEveningDate, getRecord, updateRecord,
  getDailyQuote, getChecklistTemplate, saveChecklistTemplate, migrateEveningChecklist,
  getGachaTickets, addGachaTickets, wasTicketAwarded, markTicketAwarded,
  addPartnerExp, getPartner,
  addAuraXp, addFeedEntry, generateApprovalMessage,
  getTodos, saveTodos,
} from '../utils/storage'
import { toast } from './Toast'
import confetti from 'canvas-confetti'
import ApprovalCard from './ApprovalCard'

/* ─── スコアピッカー ─── */
const SCORE_CRITERIA = [
  { min:90, label:'90点', desc:'学びを行動に移せた', color:'#00C851' },
  { min:80, label:'80点', desc:'会話で相手理解を意識できた', color:'#4CAF50' },
  { min:70, label:'70点', desc:'感情メモ＋読書＋3行要約できた', color:'#F2994A' },
  { min:60, label:'60点', desc:'感情メモ＋10分読書だけできた', color:'#FF9800' },
  { min:0,  label:'〜59点', desc:'0点の日を減らすことが大事', color:'#9E9E9E' },
]
function getScoreColor(s) {
  if (s >= 90) return '#00C851'
  if (s >= 80) return '#4CAF50'
  if (s >= 70) return '#F2994A'
  if (s >= 60) return '#FF9800'
  return '#9E9E9E'
}

function ScoreInput({ value, onChange }) {
  const [showGuide, setShowGuide] = useState(false)
  const color = getScoreColor(value)
  const presets = [60, 70, 80, 90, 100]
  return (
    <div>
      <div style={{ display:'flex', alignItems:'center', gap:16, marginBottom:14 }}>
        <div style={{ textAlign:'center', minWidth:80 }}>
          <div style={{ fontSize:48, fontWeight:900, color, lineHeight:1, letterSpacing:-2, transition:'color 0.3s' }}>{value}</div>
          <div style={{ fontSize:10, fontWeight:700, color:'var(--muted)', letterSpacing:1 }}>SCORE</div>
        </div>
        <div style={{ flex:1 }}>
          <input type="range" min={0} max={100} step={1} value={value}
            onChange={e => onChange(Number(e.target.value))} style={{ width:'100%', accentColor: color }} />
          <div style={{ display:'flex', gap:6, flexWrap:'wrap', marginTop:8 }}>
            {presets.map(p => (
              <button key={p} onClick={() => onChange(p)} style={{
                padding:'5px 12px', borderRadius:20, border:`1.5px solid ${getScoreColor(p)}`,
                background: value===p ? getScoreColor(p) : 'transparent',
                color: value===p ? '#fff' : getScoreColor(p),
                fontSize:12, fontWeight:800, cursor:'pointer', fontFamily:'var(--font)', transition:'all 0.2s',
              }}>{p}</button>
            ))}
          </div>
        </div>
      </div>
      <button onClick={() => setShowGuide(s=>!s)} style={{ background:'none', border:'none', fontSize:11, color:'var(--muted)', cursor:'pointer', fontFamily:'var(--font)', fontWeight:700, padding:0 }}>
        {showGuide ? '▲ 基準を隠す' : '▼ 点数の基準を見る'}
      </button>
      {showGuide && (
        <div style={{ marginTop:10, display:'flex', flexDirection:'column', gap:6 }}>
          {SCORE_CRITERIA.map(c => (
            <div key={c.min} style={{ display:'flex', alignItems:'center', gap:10, padding:'8px 12px', borderRadius:10, background:`${c.color}12`, border:`1px solid ${c.color}30` }}>
              <div style={{ width:40, fontSize:11, fontWeight:900, color:c.color, flexShrink:0 }}>{c.label}</div>
              <div style={{ fontSize:12, color:'var(--ink2)' }}>{c.desc}</div>
            </div>
          ))}
        </div>
      )}
    </div>
  )
}

/* ─── 日付ピッカー ─── */
function DatePicker({ selectedDate, onChange }) {
  const DOW = ['日','月','火','水','木','金','土']
  const today = getToday()
  const dates = []
  for (let i = 6; i >= 0; i--) {
    const d = new Date()
    d.setDate(d.getDate() - i)
    const str = `${d.getFullYear()}-${String(d.getMonth()+1).padStart(2,'0')}-${String(d.getDate()).padStart(2,'0')}`
    dates.push({ str, month: d.getMonth()+1, day: d.getDate(), dow: DOW[d.getDay()], isToday: str === today })
  }
  return (
    <div>
      <div style={{ fontSize:11, fontWeight:700, color:'var(--muted)', letterSpacing:'0.06em', marginBottom:8 }}>日付を選択（過去7日間）</div>
      <div style={{ display:'flex', gap:6, overflowX:'auto', paddingBottom:4 }}>
        {dates.map(({ str, month, day, dow, isToday }) => {
          const isSelected = str === selectedDate
          return (
            <button key={str} onClick={() => onChange(str)}
              style={{
                flexShrink:0, padding:'8px 10px', borderRadius:12, textAlign:'center',
                border: `1.5px solid ${isSelected ? 'var(--main)' : 'var(--border)'}`,
                background: isSelected ? 'var(--main)' : isToday ? 'var(--cream)' : '#fff',
                color: isSelected ? '#fff' : 'var(--ink)',
                fontSize:11, fontWeight:700, cursor:'pointer', fontFamily:'var(--font)',
                transition:'all 0.2s', minWidth:48,
              }}>
              <div style={{ fontSize:9, marginBottom:2, opacity:0.8 }}>{month}/{day}</div>
              <div style={{ fontSize:13 }}>{dow}</div>
              {isToday && <div style={{ fontSize:8, marginTop:2, opacity:0.7 }}>今日</div>}
            </button>
          )
        })}
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
      <input value={val} onChange={e => setVal(e.target.value)}
        onKeyDown={e => e.key==='Enter' && val.trim() && (onAdd(val.trim()), setVal(''), setOpen(false))}
        placeholder="新しいチェック項目" autoFocus
        style={{ flex:1, padding:'11px 14px', borderRadius:'var(--r-sm)', border:'1.5px solid var(--border)', background:'#FDFBF8', fontFamily:'var(--font)', fontSize:14, outline:'none' }} />
      <button className="btn btn-sm btn-main" style={{ width:'auto' }}
        onClick={() => { if (val.trim()) { onAdd(val.trim()); setVal(''); setOpen(false) } }}>追加</button>
      <button className="btn btn-sm btn-ghost" style={{ width:'auto' }}
        onClick={() => { setOpen(false); setVal('') }}>×</button>
    </div>
  )
}

/* ─── SortableChecklist ─── */
function SortableChecklist({ items, checkState, onToggle, onAdd, onRemove, onMove }) {
  return (
    <div className="card static">
      {items.length === 0 && (
        <div style={{ fontSize:13, color:'var(--muted)', padding:'8px 0', marginBottom:8 }}>
          チェック項目を追加してください
        </div>
      )}
      {items.map((c, idx) => (
        <div key={c.key} style={{ display:'flex', alignItems:'center', gap:4, borderBottom: idx < items.length-1 ? '1px solid #F5F2ED' : 'none' }}>
          <div style={{ display:'flex', flexDirection:'column', gap:1 }}>
            <button onClick={() => onMove(idx, -1)} disabled={idx===0}
              style={{ background:'none', border:'none', fontSize:9, cursor:idx===0?'default':'pointer', color:idx===0?'#DDD':'var(--muted)', padding:'1px 3px', lineHeight:1 }}>▲</button>
            <button onClick={() => onMove(idx, 1)} disabled={idx===items.length-1}
              style={{ background:'none', border:'none', fontSize:9, cursor:idx===items.length-1?'default':'pointer', color:idx===items.length-1?'#DDD':'var(--muted)', padding:'1px 3px', lineHeight:1 }}>▼</button>
          </div>
          <div className="ck-item" style={{ flex:1, borderBottom:'none' }} onClick={() => onToggle(c.key)}>
            <div className={`ck-box ${checkState[c.key] ? 'on' : ''}`} />
            <span className={`ck-label ${checkState[c.key] ? 'done' : ''}`}>{c.label}</span>
          </div>
          <button className="ck-del" onClick={e => { e.stopPropagation(); onRemove(c.key) }}>×</button>
        </div>
      ))}
      {onAdd && <AddItemInput onAdd={onAdd} />}
    </div>
  )
}

/* ─── EQ感情ログ ─── */
function EqSection({ ev, setEv }) {
  const [open, setOpen] = useState(false)
  return (
    <div style={{ marginTop:16 }}>
      <div onClick={() => setOpen(o=>!o)}
        style={{ display:'flex', alignItems:'center', justifyContent:'space-between', cursor:'pointer', padding:'8px 0', borderTop:'1px solid #F5F2ED' }}>
        <div style={{ fontSize:13, fontWeight:800, color:'var(--purple)' }}>EQ 感情ログ</div>
        <span style={{ fontSize:11, color:'var(--muted)', fontWeight:700 }}>{open?'▲':'▼'}</span>
      </div>
      {open && (
        <div style={{ display:'flex', flexDirection:'column', gap:12, marginTop:8 }}>
          <div style={{ fontSize:11, color:'var(--muted)', lineHeight:1.6, padding:'8px 12px', background:'var(--cream)', borderRadius:8 }}>
            💡 感情に名前をつけることで、EQが高まります。
          </div>
          {[
            { key:'eqEmotion', label:'今日の感情',  ph:'例：焦り・安心・前向き・悲しい' },
            { key:'eqReason',  label:'その理由',    ph:'なぜその感情になったか？' },
            { key:'eqNeed',    label:'本当の欲求',  ph:'本当は何がほしかった？安心？認められたい？' },
            { key:'eqAction',  label:'次の行動',    ph:'この感情をふまえて、明日どうする？' },
          ].map(f => (
            <div className="f" key={f.key} style={{ marginBottom:0 }}>
              <label className="fl">{f.label}</label>
              <textarea value={ev[f.key]||''} onChange={e=>setEv({[f.key]:e.target.value})} placeholder={f.ph} rows={2} />
            </div>
          ))}
        </div>
      )}
    </div>
  )
}

/* ─── IQ学びログ ─── */
function IqSection({ ev, setEv }) {
  const [open, setOpen] = useState(false)
  return (
    <div style={{ marginTop:4 }}>
      <div onClick={() => setOpen(o=>!o)}
        style={{ display:'flex', alignItems:'center', justifyContent:'space-between', cursor:'pointer', padding:'8px 0', borderTop:'1px solid #F5F2ED' }}>
        <div style={{ fontSize:13, fontWeight:800, color:'var(--orange)' }}>IQ 学びログ</div>
        <span style={{ fontSize:11, color:'var(--muted)', fontWeight:700 }}>{open?'▲':'▼'}</span>
      </div>
      {open && (
        <div style={{ display:'flex', flexDirection:'column', gap:12, marginTop:8 }}>
          <div style={{ fontSize:11, color:'var(--muted)', lineHeight:1.6, padding:'8px 12px', background:'var(--cream)', borderRadius:8 }}>
            💡 読んだ内容を3行でまとめると、読解力・論理力・説明力が上がります。
          </div>
          <div className="f" style={{ marginBottom:0 }}>
            <label className="fl">今日学んだこと</label>
            <textarea value={ev.learnedToday||''} onChange={e=>setEv({learnedToday:e.target.value})} placeholder="今日の発見・気づきを書こう" rows={2} />
          </div>
          <div className="f" style={{ marginBottom:0 }}>
            <label className="fl">3行要約</label>
            <textarea value={ev.iqSummary||''} onChange={e=>setEv({iqSummary:e.target.value})}
              placeholder={`① 何についての話か\n② 一番大事な主張は？\n③ 自分にどう活かせるか`} rows={4} />
          </div>
        </div>
      )}
    </div>
  )
}

/* ─── 人との接し方振り返り ─── */
function AttitudeReview({ arikata, ev, setEv }) {
  const result = ev.arikataOX
  const set = (val) => setEv({ arikataOX: val })

  return (
    <div style={{ background:'linear-gradient(135deg,#0d1225,#1a2040)', borderRadius:16, padding:'18px 20px', border:'1px solid rgba(255,255,255,0.08)' }}>
      {arikata && (
        <div style={{ marginBottom:14 }}>
          <div style={{ fontSize:9, fontWeight:800, letterSpacing:'0.18em', color:'rgba(255,255,255,0.35)', marginBottom:4 }}>今朝の在り方</div>
          <div style={{ fontSize:17, fontWeight:900, color:'#fff' }}>「{arikata}」</div>
        </div>
      )}
      <div style={{ fontSize:12, fontWeight:700, color:'rgba(255,255,255,0.6)', marginBottom:12 }}>できましたか？</div>
      <div style={{ display:'flex', gap:12 }}>
        <button onClick={() => set('○')} style={{
          flex:1, padding:'16px 0', borderRadius:16, fontSize:32, fontWeight:900,
          border: result === '○' ? '3px solid #00C851' : '2px solid rgba(255,255,255,0.15)',
          background: result === '○' ? 'rgba(0,200,81,0.2)' : 'rgba(255,255,255,0.05)',
          color: result === '○' ? '#00C851' : 'rgba(255,255,255,0.5)',
          cursor:'pointer', transition:'all 0.2s', fontFamily:'var(--font)',
        }}>○</button>
        <button onClick={() => set('△')} style={{
          flex:1, padding:'16px 0', borderRadius:16, fontSize:32, fontWeight:900,
          border: result === '△' ? '3px solid #F2994A' : '2px solid rgba(255,255,255,0.15)',
          background: result === '△' ? 'rgba(242,153,74,0.2)' : 'rgba(255,255,255,0.05)',
          color: result === '△' ? '#F2994A' : 'rgba(255,255,255,0.5)',
          cursor:'pointer', transition:'all 0.2s', fontFamily:'var(--font)',
        }}>△</button>
        <button onClick={() => set('×')} style={{
          flex:1, padding:'16px 0', borderRadius:16, fontSize:32, fontWeight:900,
          border: result === '×' ? '3px solid #FF5252' : '2px solid rgba(255,255,255,0.15)',
          background: result === '×' ? 'rgba(255,82,82,0.2)' : 'rgba(255,255,255,0.05)',
          color: result === '×' ? '#FF5252' : 'rgba(255,255,255,0.5)',
          cursor:'pointer', transition:'all 0.2s', fontFamily:'var(--font)',
        }}>×</button>
      </div>
      {result && (
        <div style={{ marginTop:12, fontSize:12, color:'rgba(255,255,255,0.5)', textAlign:'center' }}>
          {result === '○' ? '✨ よかった！その調子' : result === '△' ? '半分できた。それで十分' : '× でも大丈夫。気づいたことが大事'}
        </div>
      )}
      {/* 一言メモ */}
      <textarea
        value={ev.arikataNote || ''}
        onChange={e => setEv({ arikataNote: e.target.value })}
        placeholder="一言メモ（任意）どんな場面で？"
        rows={2}
        style={{ width:'100%', marginTop:12, padding:'10px 12px', borderRadius:10, border:'1px solid rgba(255,255,255,0.12)', background:'rgba(255,255,255,0.06)', color:'#fff', fontFamily:'var(--font)', fontSize:13, outline:'none', resize:'none', boxSizing:'border-box' }}
      />
    </div>
  )
}

/* ─── ToDo振り返り ─── */
function EveningTodoReview({ selectedDate }) {
  const [todos, setTodos] = useState(() => getTodos())
  const today = getToday()

  const todayItems = todos.filter(t => t.todayFlag || t.date === today || t.date === selectedDate)
  const undone = todayItems.filter(t => !t.done)
  const done = todayItems.filter(t => t.done)

  const toggle = (id) => {
    const updated = todos.map(t => t.id === id ? { ...t, done: !t.done } : t)
    saveTodos(updated); setTodos(updated)
  }

  if (todayItems.length === 0) return (
    <div style={{ padding:'14px 18px', background:'#F9F7F4', borderRadius:14, fontSize:13, color:'var(--muted)', textAlign:'center' }}>
      今日のToDoがまだありません
    </div>
  )

  return (
    <div style={{ background:'#fff', borderRadius:16, padding:'16px 18px', border:'1.5px solid var(--border)' }}>
      {done.length > 0 && (
        <div style={{ marginBottom: undone.length > 0 ? 12 : 0 }}>
          <div style={{ fontSize:10, fontWeight:800, color:'var(--success)', letterSpacing:1, marginBottom:8 }}>✓ 完了 ({done.length}件)</div>
          {done.map(item => (
            <div key={item.id} onClick={() => toggle(item.id)}
              style={{ display:'flex', alignItems:'center', gap:10, padding:'7px 0', cursor:'pointer', opacity:0.6 }}>
              <div className="ck-box on" style={{ width:20, height:20, borderRadius:5, flexShrink:0 }} />
              <span style={{ fontSize:13, textDecoration:'line-through', color:'var(--muted)' }}>{item.text}</span>
            </div>
          ))}
        </div>
      )}
      {undone.length > 0 && (
        <div>
          <div style={{ fontSize:10, fontWeight:800, color:'var(--orange)', letterSpacing:1, marginBottom:8 }}>● 未完了 ({undone.length}件)</div>
          {undone.map(item => (
            <div key={item.id} onClick={() => toggle(item.id)}
              style={{ display:'flex', alignItems:'center', gap:10, padding:'7px 0', cursor:'pointer', borderBottom:'1px solid #F5F2ED' }}>
              <div className="ck-box" style={{ width:20, height:20, borderRadius:5, flexShrink:0 }} />
              <span style={{ fontSize:13, fontWeight:600, flex:1 }}>{item.text}</span>
              <span style={{ fontSize:10, color:'var(--muted)' }}>タップで完了</span>
            </div>
          ))}
        </div>
      )}
    </div>
  )
}

/* ─── 振り返りフィールド ─── */
const EV_FIELDS = [
  { key:'roughAction',     label:'今日、雑だった対応',         ph:'責めなくていい。ただ気づく。' },
  { key:'tomorrowImprove', label:'明日、一つだけ改善すること', ph:'具体的に一つだけ' },
]

export default function Evening() {
  const [selectedDate, setSelectedDate] = useState(() => getEveningDate())
  const [data, setData]       = useState(null)
  const [evChecks, setEvChecks]   = useState([])
  const [afChecks, setAfChecks]   = useState([])
  const [saved, setSaved]     = useState(false)
  const [ticketMsg, setTicketMsg] = useState('')
  const [approvalData, setApprovalData] = useState(null)
  const quote = getDailyQuote()

  useEffect(() => {
    migrateEveningChecklist()
    setEvChecks(getChecklistTemplate('evening'))
    setAfChecks(getChecklistTemplate('afternoon'))
  }, [])

  useEffect(() => {
    setData(getRecord(selectedDate))
  }, [selectedDate])

  const setEv = (partial) => {
    const updated = updateRecord(selectedDate, { evening: { ...(data?.evening || {}), ...partial } })
    setData(updated)
  }

  // ── 夜のルーティンチェック ──
  const toggleEvCheck = (key) => {
    const checks = { ...(data.evening?.checks || {}), [key]: !data.evening?.checks?.[key] }
    setEv({ checks })
    if (!data.evening?.checks?.[key]) toast('✓')
  }
  const addEvItem = (label) => {
    const key = `ec_${Date.now()}`
    const next = [...evChecks, { key, label }]
    setEvChecks(next); saveChecklistTemplate('evening', next)
    setEv({ checks: { ...(data.evening?.checks || {}), [key]: false } })
    toast('追加しました')
  }
  const removeEvItem = (key) => {
    const next = evChecks.filter(c => c.key !== key)
    setEvChecks(next); saveChecklistTemplate('evening', next)
    const checks = { ...(data.evening?.checks || {}) }; delete checks[key]
    setEv({ checks })
  }
  const moveEvItem = (idx, dir) => {
    const next = [...evChecks]
    const target = idx + dir
    if (target < 0 || target >= next.length) return
    ;[next[idx], next[target]] = [next[target], next[idx]]
    setEvChecks(next); saveChecklistTemplate('evening', next)
  }

  // ── 振り返り用昼チェック ──
  const toggleAfCheck = (key) => {
    const afReviewChecks = { ...(data.evening?.afReviewChecks || {}), [key]: !data.evening?.afReviewChecks?.[key] }
    setEv({ afReviewChecks })
    if (!data.evening?.afReviewChecks?.[key]) toast('✓')
  }
  const addAfItem = (label) => {
    const key = `af_${Date.now()}`
    const next = [...afChecks, { key, label }]
    setAfChecks(next); saveChecklistTemplate('afternoon', next)
    setEv({ afReviewChecks: { ...(data.evening?.afReviewChecks || {}), [key]: false } })
    toast('追加しました')
  }
  const removeAfItem = (key) => {
    const next = afChecks.filter(c => c.key !== key)
    setAfChecks(next); saveChecklistTemplate('afternoon', next)
    const afReviewChecks = { ...(data.evening?.afReviewChecks || {}) }; delete afReviewChecks[key]
    setEv({ afReviewChecks })
  }
  const moveAfItem = (idx, dir) => {
    const next = [...afChecks]
    const target = idx + dir
    if (target < 0 || target >= next.length) return
    ;[next[idx], next[target]] = [next[target], next[idx]]
    setAfChecks(next); saveChecklistTemplate('afternoon', next)
  }

  const handleSave = () => {
    updateRecord(selectedDate, { evening: data.evening })

    // パートナーにEXP付与（当日分のみ）
    if (selectedDate === getToday() || selectedDate === getEveningDate()) {
      if (getPartner()) addPartnerExp(25)
    }

    // チケット：当日分のみ1枚（深夜は前日扱いの selectedDate を使用）
    const ticketKey = `evening_save_${selectedDate}`
    if (!wasTicketAwarded(ticketKey)) {
      addGachaTickets(1)
      markTicketAwarded(ticketKey)
      const total = getGachaTickets()
      setTicketMsg(`🎟️ 夜の記録完了！ +1チケット（合計 ${total}枚）`)
      setTimeout(() => setTicketMsg(''), 5000)
    }

    // AURA XP & Feed (当日分のみ)
    if (selectedDate === getToday() || selectedDate === getEveningDate()) {
      const xpResult = addAuraXp(15)
      const msg = generateApprovalMessage('evening')
      addFeedEntry({ type: 'evening_complete', message: '今日を振り返り、記録した', sub: msg.identity })
      if (xpResult.levelUp) {
        addFeedEntry({ type: 'level_up', message: `Lv.${xpResult.level.lv} ${xpResult.level.label} に到達した` })
      }
      setApprovalData({ msg, xpResult })
    }

    setSaved(true)
    toast('今日も少し、人と自分を前に進めた 🌙')
    setTimeout(() => confetti({ particleCount:55, spread:55, origin:{y:0.7}, colors:['#2F4858','#F2994A','#6C63FF','#84A98C'] }), 300)
    setTimeout(() => setSaved(false), 4000)
  }

  if (!data) return null
  const ev = data.evening || {}
  const score = ev.score || 0
  const evCheckState  = ev.checks || {}
  const afCheckState  = ev.afReviewChecks || {}
  const evCheckDone   = evChecks.filter(c => evCheckState[c.key]).length
  const afCheckDone   = afChecks.filter(c => afCheckState[c.key]).length

  const todayDate = getToday()
  const isPastDate = selectedDate !== todayDate && selectedDate !== getEveningDate()
  const ticketKey = `evening_save_${selectedDate}`
  const alreadyAwarded = wasTicketAwarded(ticketKey)

  return (
    <div className="slide-up" style={{ paddingBottom:'40px' }}>
      {approvalData && (
        <ApprovalCard
          msg={approvalData.msg}
          xpResult={approvalData.xpResult}
          onClose={() => setApprovalData(null)}
        />
      )}
      <div className="ph">
        <div className="ph-eyebrow">🌙 Evening</div>
        <div className="ph-title">今日を成長に変える</div>
      </div>

      {/* 日付ピッカー */}
      <div className="sec">
        <DatePicker selectedDate={selectedDate} onChange={date => { setSelectedDate(date); setSaved(false); setTicketMsg('') }} />
        {isPastDate && (
          <div style={{ marginTop:8, padding:'8px 14px', borderRadius:10, background:'#FFF3CD', border:'1px solid #F0C040', fontSize:12, color:'#856404', fontWeight:600 }}>
            📅 過去の記録を編集しています（{selectedDate}）
          </div>
        )}
      </div>

      {/* 今日のスコア */}
      <div className="sec">
        <div className="sec-title">今日のスコア</div>
        <div className="card static">
          <ScoreInput value={score} onChange={v => setEv({ score: v })} />
        </div>
      </div>

      {/* ToDo振り返り */}
      <div className="sec">
        <div className="sec-title">今日のToDo</div>
        <EveningTodoReview selectedDate={selectedDate} />
      </div>

      {/* 人との接し方の振り返り */}
      <div className="sec">
        <div className="sec-title">人との接し方の振り返り</div>
        <AttitudeReview arikata={data.morning?.arikata} ev={ev} setEv={setEv} />
      </div>

      {/* 一言振り返り */}
      <div className="sec">
        <div className="sec-title">一言振り返り</div>
        <div className="card static">
          {EV_FIELDS.map((f, i) => (
            <div className="f" key={f.key} style={{ marginBottom: i < EV_FIELDS.length-1 ? 16 : 0 }}>
              <label className="fl">{f.label}</label>
              <textarea value={ev[f.key]||''} onChange={e=>setEv({[f.key]:e.target.value})} placeholder={f.ph} rows={2} />
            </div>
          ))}
        </div>
      </div>

      {/* 日記 */}
      <div className="sec">
        <div className="sec-title" style={{ display:'flex', alignItems:'center', gap:8 }}>
          日記
          {!alreadyAwarded && (
            <span style={{ fontSize:10, fontWeight:800, background:'linear-gradient(135deg,#6C63FF,#F2994A)', color:'#fff', borderRadius:20, padding:'2px 8px', letterSpacing:0.5 }}>
              🎟️ 保存で+1チケット
            </span>
          )}
        </div>
        <div className="diary-card">
          <div className="diary-date-line">
            {new Date(selectedDate + 'T12:00:00').toLocaleDateString('ja-JP',{year:'numeric',month:'long',day:'numeric',weekday:'long'})}
          </div>
          <div className="diary-title-wrap">
            <input className="diary-title-input" value={ev.diaryTitle||''}
              onChange={e=>setEv({diaryTitle:e.target.value})} placeholder="題名（任意）" maxLength={60} />
          </div>
          <div className="diary-divider" />
          <textarea className="diary-body" value={ev.diary||''}
            onChange={e=>setEv({diary:e.target.value})}
            placeholder={`今日あったことを自由に書こう。\n\n何を感じた？何を学んだ？\n明日の自分へのメッセージでもいい。`}
            rows={10} />
          <div className="diary-count">{(ev.diary||'').length} 文字</div>
        </div>
      </div>

      {/* 夜のルーティン */}
      <div className="sec">
        <div className="sec-title" style={{ display:'flex', justifyContent:'space-between', alignItems:'center' }}>
          <span>夜のルーティン</span>
          {evChecks.length > 0 && (
            <span style={{ fontSize:11, color:'var(--muted)', fontWeight:600 }}>{evCheckDone}/{evChecks.length}</span>
          )}
        </div>
        <SortableChecklist
          items={evChecks}
          checkState={evCheckState}
          onToggle={toggleEvCheck}
          onAdd={addEvItem}
          onRemove={removeEvItem}
          onMove={moveEvItem}
        />
      </div>

      {ticketMsg && (
        <div className="sec">
          <div style={{ background:'linear-gradient(135deg,#6C63FF,#F2994A)', color:'#fff', borderRadius:14, padding:'14px 20px', textAlign:'center', fontWeight:800, fontSize:14 }}>
            {ticketMsg}
          </div>
        </div>
      )}

      <div className="sec">
        {saved ? (
          <div style={{ textAlign:'center', padding:'28px 0' }}>
            <div style={{ fontSize:10, fontWeight:700, letterSpacing:3, textTransform:'uppercase', color:'var(--muted)', marginBottom:10 }}>Saved ✓</div>
            <div style={{ fontSize:19, fontWeight:900, color:'var(--main)', letterSpacing:-0.5 }}>今日も少し、人と自分を前に進めた</div>
            <div style={{ fontSize:13, color:'var(--muted)', marginTop:6 }}>おつかれさま 🌙</div>
          </div>
        ) : (
          <button className="btn btn-main" onClick={handleSave}>今日を保存する</button>
        )}
      </div>
    </div>
  )
}
