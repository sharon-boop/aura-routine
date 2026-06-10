import { useState, useEffect, useRef } from 'react'
import { getTodayRecord, updateTodayRecord, getAllRecords, formatDate } from '../utils/storage'
import { toast } from './Toast'
import confetti from 'canvas-confetti'

const THEMES = ['TOEIC', '基本情報', 'IT', 'SNS', '読書', '美容', 'お金', 'その他']
const TOEIC_SUBS = ['単語', '文法', 'Part1', 'Part2', 'Part3', 'Part4', 'Part5', 'Part6', 'Part7', 'リスニング復習', '音読', 'シャドーイング']
const TOTAL = 90 * 60

function pad(n) { return String(n).padStart(2, '0') }
function fmtTime(sec) { return `${pad(Math.floor(sec / 60))}:${pad(sec % 60)}` }

function Stars({ value, onChange }) {
  return (
    <div className="stars">
      {[1, 2, 3, 4, 5].map(n => (
        <button key={n} className="star" onClick={() => onChange(n)}>{n <= value ? '★' : '☆'}</button>
      ))}
    </div>
  )
}

/* ─── 投資カレンダー ─── */
function InvestCalendar() {
  const [open, setOpen] = useState(false)
  const [records, setRecords] = useState([])

  useEffect(() => {
    if (!open) return
    const all = getAllRecords()
    const list = Object.entries(all)
      .filter(([, r]) => r.investment && (r.investment.timerDone || r.investment.manualMinutes > 0 || r.investment.theme))
      .map(([date, r]) => ({ date, inv: r.investment }))
      .sort((a, b) => b.date.localeCompare(a.date))
    setRecords(list)
  }, [open])

  if (!open) {
    return (
      <div className="sec">
        <button
          className="btn btn-outline"
          style={{ width: '100%' }}
          onClick={() => setOpen(true)}
        >
          📅 投資記録を見る
        </button>
      </div>
    )
  }

  const totalMins = records.reduce((sum, { inv }) => {
    if (inv.timerDone) return sum + 90
    return sum + (inv.manualMinutes || Math.round((inv.timerSeconds || 0) / 60))
  }, 0)

  return (
    <div className="sec">
      <div style={{ display: 'flex', alignItems: 'center', justifyContent: 'space-between', marginBottom: 12 }}>
        <div className="sec-title" style={{ marginBottom: 0 }}>📅 投資記録</div>
        <button
          onClick={() => setOpen(false)}
          style={{ background: 'none', border: 'none', fontSize: 13, color: 'var(--muted)', cursor: 'pointer', fontFamily: 'var(--font)', fontWeight: 700 }}
        >
          閉じる ↑
        </button>
      </div>

      {/* 累計サマリー */}
      <div style={{ display: 'flex', gap: 12, marginBottom: 16 }}>
        <div className="card static" style={{ flex: 1, textAlign: 'center', padding: '14px 8px' }}>
          <div style={{ fontSize: 22, fontWeight: 900, color: 'var(--main)' }}>{records.length}</div>
          <div style={{ fontSize: 11, color: 'var(--muted)', fontWeight: 700, marginTop: 2 }}>記録日数</div>
        </div>
        <div className="card static" style={{ flex: 1, textAlign: 'center', padding: '14px 8px' }}>
          <div style={{ fontSize: 22, fontWeight: 900, color: 'var(--orange)' }}>{totalMins}</div>
          <div style={{ fontSize: 11, color: 'var(--muted)', fontWeight: 700, marginTop: 2 }}>累計分</div>
        </div>
        <div className="card static" style={{ flex: 1, textAlign: 'center', padding: '14px 8px' }}>
          <div style={{ fontSize: 22, fontWeight: 900, color: 'var(--purple)' }}>{Math.floor(totalMins / 60)}h</div>
          <div style={{ fontSize: 11, color: 'var(--muted)', fontWeight: 700, marginTop: 2 }}>累計時間</div>
        </div>
      </div>

      {records.length === 0 ? (
        <div className="card static" style={{ textAlign: 'center', padding: '24px', color: 'var(--muted)', fontSize: 13 }}>
          まだ記録がありません
        </div>
      ) : (
        <div style={{ display: 'flex', flexDirection: 'column', gap: 10 }}>
          {records.map(({ date, inv }) => {
            const mins = inv.timerDone ? 90
              : inv.manualMinutes > 0 ? inv.manualMinutes
              : Math.round((inv.timerSeconds || 0) / 60)
            const pct = Math.min(Math.round((mins / 90) * 100), 100)
            const done = inv.timerDone || inv.manualMinutes >= 90
            return (
              <div key={date} className="card static" style={{ padding: '14px 16px' }}>
                <div style={{ display: 'flex', alignItems: 'center', justifyContent: 'space-between', marginBottom: 8 }}>
                  <div style={{ fontSize: 12, fontWeight: 800, color: 'var(--main)' }}>
                    {formatDate(date)}
                  </div>
                  <div style={{ display: 'flex', alignItems: 'center', gap: 6 }}>
                    {done && <span style={{ fontSize: 10, fontWeight: 900, color: 'var(--success)', letterSpacing: 0.5 }}>✓ 達成</span>}
                    <span style={{ fontSize: 13, fontWeight: 900, color: done ? 'var(--success)' : 'var(--orange)' }}>
                      {mins}分
                    </span>
                  </div>
                </div>
                {/* 進捗バー */}
                <div style={{ height: 4, background: '#F0EDE7', borderRadius: 4, marginBottom: 8, overflow: 'hidden' }}>
                  <div style={{
                    height: '100%', width: `${pct}%`,
                    background: done ? 'var(--success)' : 'var(--orange)',
                    borderRadius: 4,
                  }} />
                </div>
                <div style={{ display: 'flex', gap: 8, flexWrap: 'wrap' }}>
                  {inv.theme && (
                    <span style={{ fontSize: 11, background: 'var(--cream)', borderRadius: 20, padding: '3px 10px', fontWeight: 700, color: 'var(--ink2)' }}>
                      {inv.theme}{inv.toeicSub ? ` / ${inv.toeicSub}` : ''}
                    </span>
                  )}
                  {inv.focus && (
                    <span style={{ fontSize: 11, color: 'var(--muted)', fontWeight: 700 }}>
                      集中度 {'★'.repeat(inv.focus)}{'☆'.repeat(5 - inv.focus)}
                    </span>
                  )}
                </div>
                {inv.done && (
                  <div style={{ fontSize: 12, color: 'var(--ink2)', marginTop: 6, lineHeight: 1.5 }}>
                    {inv.done}
                  </div>
                )}
              </div>
            )
          })}
        </div>
      )}
    </div>
  )
}

/* ─── メインコンポーネント ─── */
export default function Investment() {
  const [data, setData] = useState(null)
  const [running, setRunning] = useState(false)
  const [elapsed, setElapsed] = useState(0)
  const [manualInput, setManualInput] = useState('')
  const ivRef = useRef(null)

  useEffect(() => {
    const r = getTodayRecord()
    setData(r)
    setElapsed(r.investment?.timerSeconds || 0)
    setManualInput(r.investment?.manualMinutes > 0 ? String(r.investment.manualMinutes) : '')
  }, [])

  useEffect(() => {
    if (running) {
      ivRef.current = setInterval(() => {
        setElapsed(e => {
          const next = e + 1
          if (next >= TOTAL) {
            clearInterval(ivRef.current); setRunning(false)
            handleDone()
            return TOTAL
          }
          return next
        })
      }, 1000)
    } else { clearInterval(ivRef.current) }
    return () => clearInterval(ivRef.current)
  }, [running])

  const handleDone = () => {
    setInv({ timerSeconds: TOTAL, timerDone: true })
    toast('今日の90分は、未来の自分への投資')
    setTimeout(() => confetti({ particleCount: 80, spread: 70, origin: { y: 0.6 }, colors: ['#2F4858', '#F2994A', '#6C63FF'] }), 300)
  }

  const setInv = (partial) => {
    updateTodayRecord({ investment: { ...data.investment, ...partial } })
    setData(prev => ({ ...prev, investment: { ...prev.investment, ...partial } }))
  }

  const handleManualSave = () => {
    const mins = parseInt(manualInput)
    if (!mins || mins <= 0) return
    setInv({ manualMinutes: mins })
    toast(`${mins}分の投資を記録した ✓`)
    if (mins >= 90) {
      setTimeout(() => confetti({ particleCount: 60, spread: 60, origin: { y: 0.6 }, colors: ['#2F4858', '#F2994A', '#6C63FF'] }), 200)
    }
  }

  if (!data) return null

  const inv = data.investment || {}
  const pct = Math.min((elapsed / TOTAL) * 100, 100)
  const remaining = TOTAL - elapsed
  const C = 2 * Math.PI * 70
  const dash = C - (pct / 100) * C
  const manualMins = inv.manualMinutes || 0
  const isDone = inv.timerDone || manualMins >= 90

  return (
    <div className="slide-up" style={{ paddingBottom: '40px' }}>
      <div className="ph">
        <div className="ph-eyebrow">Invest — 90min</div>
        <div className="ph-title">今日の自己投資</div>
        <div className="ph-sub">今日の90分が未来を変える</div>
      </div>

      {/* ── タイマー ── */}
      <div className="sec">
        <div className="card static" style={{ textAlign:'center',padding:'32px 20px' }}>
          <div style={{ position:'relative',display:'inline-block' }}>
            <svg width="180" height="180" viewBox="0 0 180 180">
              <circle cx="90" cy="90" r="70" fill="none" stroke="#F0EDE7" strokeWidth="8" />
              <circle cx="90" cy="90" r="70" fill="none"
                stroke={isDone ? 'var(--success)' : 'var(--main)'}
                strokeWidth="8"
                strokeDasharray={C}
                strokeDashoffset={dash}
                strokeLinecap="round"
                transform="rotate(-90 90 90)"
                style={{ transition: 'stroke-dashoffset 0.5s ease' }}
              />
            </svg>
            <div style={{ position:'absolute',top:'50%',left:'50%',transform:'translate(-50%,-50%)',textAlign:'center' }}>
              <div style={{ fontSize:28,fontWeight:900,letterSpacing:-1,lineHeight:1 }}>{fmtTime(running ? remaining : TOTAL - elapsed)}</div>
              <div style={{ fontSize:11,color:'var(--muted)',fontWeight:700,letterSpacing:1,marginTop:3 }}>{Math.round(pct)}% DONE</div>
            </div>
          </div>

          {isDone ? (
            <div style={{ marginTop:16,fontSize:13,fontWeight:900,color:'var(--success)',letterSpacing:0.5 }}>
              今日の自己投資 達成 ✓
            </div>
          ) : (
            <div style={{ display:'flex',gap:10,marginTop:24,justifyContent:'center' }}>
              {!running ? (
                <button className="btn btn-main" style={{ width:120 }} onClick={() => setRunning(true)}>▶ START</button>
              ) : (
                <button className="btn btn-outline" style={{ width:120 }} onClick={() => { setRunning(false); setInv({ timerSeconds: elapsed }) }}>⏸ PAUSE</button>
              )}
              <button className="btn btn-sm btn-ghost" style={{ width:'auto' }} onClick={() => { setRunning(false); setElapsed(0); setInv({ timerSeconds: 0, timerDone: false }) }}>RESET</button>
            </div>
          )}
        </div>
      </div>

      {/* ── 手動記録 ── */}
      <div className="sec">
        <div className="sec-title">手動で時間を記録する</div>
        <div className="card static">
          <div style={{ fontSize:12,color:'var(--muted)',marginBottom:12,lineHeight:1.6 }}>
            タイマー以外で投資した時間（読書・勉強など）を分単位で入力できます。
          </div>
          <div style={{ display:'flex',alignItems:'center',gap:10 }}>
            <input
              type="number"
              min="1"
              max="480"
              value={manualInput}
              onChange={e => setManualInput(e.target.value)}
              placeholder="分を入力（例：60）"
              style={{
                flex:1, padding:'12px 14px', borderRadius:10,
                border:'1.5px solid var(--border)', background:'var(--card)',
                fontSize:16, fontFamily:'var(--font)', fontWeight:700,
                color:'var(--ink)', outline:'none',
              }}
            />
            <span style={{ fontSize:13,fontWeight:700,color:'var(--muted)',flexShrink:0 }}>分</span>
            <button
              className="btn btn-main"
              style={{ width:80,flexShrink:0 }}
              onClick={handleManualSave}
            >
              記録
            </button>
          </div>
          {manualMins > 0 && (
            <div style={{ marginTop:10,fontSize:12,fontWeight:700,color:'var(--success)' }}>
              ✓ {manualMins}分 記録済み{manualMins >= 90 ? ' — 90分達成！' : ` — あと${90 - manualMins}分で達成`}
            </div>
          )}
        </div>
      </div>

      {/* ── テーマ・内容 ── */}
      <div className="sec">
        <div className="sec-title">今日の自己投資テーマ</div>
        <div className="card static">
          <div className="f">
            <label className="fl">テーマ</label>
            <div className="pills">
              {THEMES.map(t => <button key={t} className={`pill ${inv.theme === t ? 'on' : ''}`} onClick={() => setInv({ theme: t })}>{t}</button>)}
            </div>
          </div>
          {inv.theme === 'TOEIC' && (
            <div className="f">
              <label className="fl">TOEIC の項目</label>
              <div className="pills">
                {TOEIC_SUBS.map(t => <button key={t} className={`pill ${inv.toeicSub === t ? 'on' : ''}`} onClick={() => setInv({ toeicSub: t })}>{t}</button>)}
              </div>
            </div>
          )}
          <div className="f">
            <label className="fl">今日やること</label>
            <textarea value={inv.plan || ''} onChange={e => setInv({ plan: e.target.value })} placeholder="今日の具体的な目標" rows={2} />
          </div>
          <div className="f">
            <label className="fl">実際にやったこと</label>
            <textarea value={inv.done || ''} onChange={e => setInv({ done: e.target.value })} placeholder="終わったら記録" rows={2} />
          </div>
          <div className="f">
            <label className="fl">集中度</label>
            <Stars value={inv.focus || 3} onChange={v => setInv({ focus: v })} />
          </div>
          <div className="f">
            <label className="fl">学んだこと</label>
            <textarea value={inv.learned || ''} onChange={e => setInv({ learned: e.target.value })} placeholder="今日の発見" rows={2} />
          </div>
          <div className="f" style={{ marginBottom:0 }}>
            <label className="fl">明日やること</label>
            <textarea value={inv.tomorrow || ''} onChange={e => setInv({ tomorrow: e.target.value })} placeholder="継続のために" rows={2} />
          </div>
        </div>
      </div>

      <div className="sec">
        <button className="btn btn-main" onClick={() => toast('積み上げた。今日の自分に誇りを。')}>
          記録を保存する
        </button>
      </div>

      {/* ── 投資カレンダー ── */}
      <InvestCalendar />
    </div>
  )
}
