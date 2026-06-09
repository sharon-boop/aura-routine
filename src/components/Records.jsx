import { useState, useEffect } from 'react'
import { getAllRecords, getSummaries, getFunnyStories, getTodos, getStreak, calcDayProgress, formatDate, getToday } from '../utils/storage'

function DayModal({ date, record, onClose }) {
  const ev = record.evening || {}
  const vp = record.morning?.valuePeople || []
  return (
    <div className="modal-overlay" onClick={onClose}>
      <div className="modal-sheet" onClick={e => e.stopPropagation()}>
        <div className="modal-handle" />
        <div style={{ fontWeight:900,fontSize:18,marginBottom:16,letterSpacing:-0.5 }}>{formatDate(date)}</div>

        {ev.diary && (
          <div style={{ background:'var(--ink)',borderRadius:12,padding:18,marginBottom:14 }}>
            <div style={{ fontSize:10,fontWeight:900,letterSpacing:2,color:'rgba(255,255,255,0.35)',textTransform:'uppercase',marginBottom:6 }}>Diary</div>
            <div style={{ fontSize:15,color:'white',lineHeight:1.6 }}>{ev.diary}</div>
          </div>
        )}

        {record.morning?.arikata && (
          <div style={{ marginBottom:12 }}>
            <div style={{ fontSize:10,color:'var(--muted)',fontWeight:900,letterSpacing:2,textTransform:'uppercase',marginBottom:4 }}>Identity</div>
            <div style={{ fontWeight:700,fontSize:16 }}>{record.morning.arikata}</div>
          </div>
        )}

        {vp.filter(p => p.name).length > 0 && (
          <div style={{ marginBottom:12 }}>
            <div style={{ fontSize:10,color:'var(--muted)',fontWeight:900,letterSpacing:2,textTransform:'uppercase',marginBottom:6 }}>Value</div>
            {vp.filter(p => p.name).map((p, i) => (
              <div key={i} style={{ fontSize:14,display:'flex',gap:10,marginBottom:4 }}>
                <span style={{ fontWeight:900 }}>{p.done ? '✓' : '○'}</span>
                <span>{p.name}</span>
                {p.valueType && <span style={{ color:'var(--muted)' }}>{p.valueType}</span>}
              </div>
            ))}
          </div>
        )}

        {ev.satisfaction > 0 && (
          <div>
            <div style={{ fontSize:10,color:'var(--muted)',fontWeight:900,letterSpacing:2,textTransform:'uppercase',marginBottom:4 }}>Satisfaction</div>
            <div style={{ fontSize:18 }}>{'★'.repeat(ev.satisfaction)}{'☆'.repeat(5 - ev.satisfaction)}</div>
          </div>
        )}

        <button className="btn btn-main" style={{ marginTop:24 }} onClick={onClose}>閉じる</button>
      </div>
    </div>
  )
}

function Calendar({ records, onSelect }) {
  const now = new Date()
  const [year, setYear] = useState(now.getFullYear())
  const [month, setMonth] = useState(now.getMonth())

  const today = getToday()
  const firstDay = new Date(year, month, 1).getDay()
  const days = new Date(year, month + 1, 0).getDate()
  const cells = [...Array(firstDay).fill(null), ...Array.from({ length: days }, (_, i) => i + 1)]
  const ds = (d) => `${year}-${String(month + 1).padStart(2, '0')}-${String(d).padStart(2, '0')}`

  const prevMonth = () => { if (month === 0) { setMonth(11); setYear(y => y - 1) } else setMonth(m => m - 1) }
  const nextMonth = () => { if (month === 11) { setMonth(0); setYear(y => y + 1) } else setMonth(m => m + 1) }

  return (
    <div>
      <div style={{ display:'flex',justifyContent:'space-between',alignItems:'center',marginBottom:14 }}>
        <button className="btn btn-sm btn-ghost" style={{ width:'auto' }} onClick={prevMonth}>←</button>
        <div style={{ fontWeight:900,fontSize:14 }}>{year}年{month + 1}月</div>
        <button className="btn btn-sm btn-ghost" style={{ width:'auto' }} onClick={nextMonth}>→</button>
      </div>
      <div className="cal-hdr">
        {['日', '月', '火', '水', '木', '金', '土'].map(d => <div key={d} className="cal-day-label">{d}</div>)}
      </div>
      <div className="cal-grid">
        {cells.map((d, i) => {
          if (!d) return <div key={i} className="cal-cell empty" />
          const key = ds(d)
          const rec = records[key]
          const pct = rec ? calcDayProgress(rec) : 0
          const cls = !rec ? 'no-rec' : pct >= 80 ? 'full-rec' : 'has-rec'
          return (
            <div key={i} className={`cal-cell ${cls} ${key === today ? 'is-today' : ''}`} onClick={() => rec && onSelect(key, rec)}>
              <span>{d}</span>
              {rec && <div className="cal-dot" />}
            </div>
          )
        })}
      </div>
    </div>
  )
}

export default function Records() {
  const [records, setRecords] = useState({})
  const [summaries, setSummaries] = useState([])
  const [stories, setStories] = useState([])
  const [todos, setTodos] = useState([])
  const [streak, setStreak] = useState(0)
  const [sel, setSel] = useState(null)

  useEffect(() => {
    setRecords(getAllRecords())
    setSummaries(getSummaries())
    setStories(getFunnyStories())
    setTodos(getTodos())
    setStreak(getStreak())
  }, [])

  const totalMins = Object.values(records).reduce((a, r) => a + Math.floor((r.investment?.timerSeconds || 0) / 60), 0)
  const totalVP = Object.values(records).reduce((a, r) => a + (r.morning?.valuePeople || []).filter(p => p.done).length, 0)

  const stats = [
    { icon: '🔥', val: `${streak}日`, label: '連続達成' },
    { icon: '💫', val: `${totalVP}人`, label: '価値提供' },
    { icon: '⚡', val: `${Math.floor(totalMins / 60)}h${totalMins % 60}m`, label: '自己投資' },
    { icon: '📚', val: `${summaries.length}`, label: '要約作品' },
    { icon: '🎤', val: `${stories.length}回`, label: '話の練習' },
    { icon: '✓', val: `${todos.filter(t => t.done).length}件`, label: 'ToDo完了' },
  ]

  const diaries = Object.entries(records)
    .sort((a, b) => b[0].localeCompare(a[0]))
    .filter(([, r]) => r.evening?.diary)
    .slice(0, 20)

  return (
    <div className="slide-up" style={{ paddingBottom: 'calc(var(--nav-h) + 24px)' }}>
      <div className="ph">
        <div className="ph-eyebrow">Log — Calendar</div>
        <div className="ph-title">積み上げた記録</div>
        <div className="ph-sub">{Object.keys(records).length}日間の軌跡</div>
      </div>

      <div className="sec">
        <div className="sec-title">累計実績</div>
        <div className="stat-grid">
          {stats.map(s => (
            <div key={s.label} className="stat-card">
              <div className="stat-icon">{s.icon}</div>
              <div className="stat-val">{s.val}</div>
              <div className="stat-lbl">{s.label}</div>
            </div>
          ))}
        </div>
      </div>

      <div className="sec">
        <div className="sec-title">達成カレンダー</div>
        <div className="card static">
          <Calendar records={records} onSelect={(d, r) => setSel({ d, r })} />
          <div style={{ display:'flex',gap:16,marginTop:14,fontSize:11,color:'var(--muted)',fontWeight:700 }}>
            <span>■ 記録あり</span>
            <span style={{ color:'var(--main)' }}>■ 高達成（80%+）</span>
          </div>
        </div>
      </div>

      {diaries.length > 0 && (
        <div className="sec">
          <div className="sec-title">Past Diaries</div>
          {diaries.map(([date, rec]) => (
            <div key={date} className="card" style={{ marginBottom:12 }} onClick={() => setSel({ d: date, r: rec })}>
              <div style={{ fontSize:10,color:'var(--muted)',fontWeight:900,letterSpacing:1.5,textTransform:'uppercase',marginBottom:8 }}>
                {formatDate(date)}
              </div>
              <div style={{ fontSize:14,lineHeight:1.7,color:'#555' }}>{rec.evening.diary}</div>
              {rec.morning?.arikata && (
                <div style={{ marginTop:8,fontSize:11,color:'var(--muted)',fontWeight:700,letterSpacing:0.5 }}>
                  IDENTITY: {rec.morning.arikata}
                </div>
              )}
            </div>
          ))}
        </div>
      )}

      {sel && <DayModal date={sel.d} record={sel.r} onClose={() => setSel(null)} />}
    </div>
  )
}
