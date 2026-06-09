import { useState, useEffect, useRef } from 'react'
import { getTodayRecord, updateTodayRecord } from '../utils/storage'
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

export default function Investment() {
  const [data, setData] = useState(null)
  const [running, setRunning] = useState(false)
  const [elapsed, setElapsed] = useState(0)
  const ivRef = useRef(null)

  useEffect(() => {
    const r = getTodayRecord()
    setData(r)
    setElapsed(r.investment?.timerSeconds || 0)
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

  if (!data) return null

  const inv = data.investment || {}
  const pct = Math.min((elapsed / TOTAL) * 100, 100)
  const remaining = TOTAL - elapsed
  const C = 2 * Math.PI * 70
  const dash = C - (pct / 100) * C

  return (
    <div className="slide-up" style={{ paddingBottom: '40px' }}>
      <div className="ph">
        <div className="ph-eyebrow">Invest — 90min</div>
        <div className="ph-title">今日の自己投資</div>
        <div className="ph-sub">今日の90分が未来を変える</div>
      </div>

      <div className="sec">
        <div className="card static" style={{ textAlign:'center',padding:'32px 20px' }}>
          <div style={{ position:'relative',display:'inline-block' }}>
            <svg width="180" height="180" viewBox="0 0 180 180">
              <circle cx="90" cy="90" r="70" fill="none" stroke="#F0EDE7" strokeWidth="8" />
              <circle cx="90" cy="90" r="70" fill="none"
                stroke={inv.timerDone ? 'var(--success)' : 'var(--main)'}
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

          {inv.timerDone ? (
            <div style={{ marginTop:16,fontSize:13,fontWeight:900,color:'var(--success)',letterSpacing:0.5 }}>
              今日の90分は、未来の自分への投資 ✓
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
    </div>
  )
}
