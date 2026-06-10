import { useState, useEffect, useRef } from 'react'
import { getTodayRecord, updateTodayRecord, getAllRecords, formatDate } from '../utils/storage'
import { toast } from './Toast'
import confetti from 'canvas-confetti'

const THEMES = ['TOEIC', '基本情報', 'IT', 'SNS', '読書', '美容', 'お金', 'その他']
const TOEIC_SUBS = ['単語', '文法', 'Part1', 'Part2', 'Part3', 'Part4', 'Part5', 'Part6', 'Part7', 'リスニング復習', '音読', 'シャドーイング']
const TOTAL = 90 * 60

// テーマカラー
const THEME_COLORS = {
  'TOEIC':  '#EF4444', '基本情報':'#F59E0B', 'IT':  '#10B981',
  'SNS':    '#6C63FF', '読書':    '#F2994A', '美容':'#EC4899',
  'お金':   '#14B8A6', 'その他':  '#94A3B8',
}
const DEFAULT_COLOR = '#2F4858'
const DAY_JP = ['日','月','火','水','木','金','土']

function pad(n) { return String(n).padStart(2, '0') }
function fmtTime(sec) { return `${pad(Math.floor(sec / 60))}:${pad(sec % 60)}` }

// 記録から投資分数を取得
function getInvMins(inv) {
  if (!inv) return 0
  if (inv.timerDone) return 90
  if (inv.manualMinutes > 0) return inv.manualMinutes
  return Math.round((inv.timerSeconds || 0) / 60)
}

// YYYY-MM-DD を Date に
function parseDate(str) {
  return new Date(str + 'T00:00:00')
}
// Date を YYYY-MM-DD に
function toDateStr(d) {
  return `${d.getFullYear()}-${pad(d.getMonth()+1)}-${pad(d.getDate())}`
}

// 分 → "X時間Y分" 表示
function fmtMins(m) {
  if (m <= 0) return '0分'
  const h = Math.floor(m / 60), min = m % 60
  if (h === 0) return `${min}分`
  if (min === 0) return `${h}時間`
  return `${h}時間${min}分`
}

function Stars({ value, onChange }) {
  return (
    <div className="stars">
      {[1,2,3,4,5].map(n => (
        <button key={n} className="star" onClick={() => onChange(n)}>{n<=value?'★':'☆'}</button>
      ))}
    </div>
  )
}

/* ─── キレイな上限値を計算 ─── */
function niceMax(raw) {
  if (raw <= 0) return 90
  const steps = [30,60,90,120,150,180,240,300,360,420,480,600]
  return steps.find(s => s >= raw) || Math.ceil(raw / 60) * 60
}
function niceGridLines(maxVal) {
  // 30分刻みか60分刻みかを判断
  const step = maxVal <= 120 ? 30 : maxVal <= 300 ? 60 : 120
  const lines = []
  for (let v = step; v <= maxVal; v += step) lines.push(v)
  return lines
}

/* ═══════════════════════════════════════════
   投資グラフ
═══════════════════════════════════════════ */
function InvestChart() {
  const [mode, setMode]     = useState('day')
  const [offset, setOffset] = useState(0)
  const [allRec, setAllRec] = useState({})

  useEffect(() => { setAllRec(getAllRecords()) }, [])

  const today = new Date(); today.setHours(0,0,0,0)

  function getDayBars() {
    const base = new Date(today)
    base.setDate(base.getDate() + offset * 7)
    const dow = base.getDay()
    const monday = new Date(base)
    monday.setDate(monday.getDate() - ((dow+6)%7))
    const bars = Array.from({ length: 7 }, (_, i) => {
      const d = new Date(monday); d.setDate(d.getDate() + i)
      const key = toDateStr(d)
      const inv = allRec[key]?.investment
      return { label:`${d.getMonth()+1}/${d.getDate()}`, sub: DAY_JP[d.getDay()], mins: getInvMins(inv), theme: inv?.theme||null, key }
    })
    const s = bars[0].key, e = bars[6].key
    return { bars, title:`${s.slice(0,4)}年${parseInt(s.slice(5,7))}月${parseInt(s.slice(8,10))}日〜${parseInt(e.slice(8,10))}日` }
  }

  function getWeekBars() {
    const base = new Date(today.getFullYear(), today.getMonth() + offset, 1)
    const year = base.getFullYear(), month = base.getMonth()
    const daysInMonth = new Date(year, month+1, 0).getDate()
    const bars = []
    for (let wStart = 1; wStart <= daysInMonth; wStart += 7) {
      const wEnd = Math.min(wStart+6, daysInMonth)
      let mins = 0
      for (let d = wStart; d <= wEnd; d++) mins += getInvMins(allRec[`${year}-${pad(month+1)}-${pad(d)}`]?.investment)
      bars.push({ label:`${wStart}〜${wEnd}日`, sub:`${month+1}月`, mins, theme:null, key:`${year}-${pad(month+1)}-${pad(wStart)}` })
    }
    return { bars, title:`${year}年${month+1}月` }
  }

  function getMonthBars() {
    const year = today.getFullYear() + offset
    const bars = Array.from({ length: 12 }, (_, m) => {
      const daysInMonth = new Date(year, m+1, 0).getDate()
      let mins = 0
      for (let d = 1; d <= daysInMonth; d++) mins += getInvMins(allRec[`${year}-${pad(m+1)}-${pad(d)}`]?.investment)
      return { label:`${m+1}月`, sub:'', mins, theme:null, key:`${year}-${pad(m+1)}-01` }
    })
    return { bars, title:`${year}年` }
  }

  const { bars, title } = mode==='day' ? getDayBars() : mode==='week' ? getWeekBars() : getMonthBars()

  const rawMax    = Math.max(...bars.map(b => b.mins), 1)
  const maxVal    = niceMax(rawMax)
  const gridLines = niceGridLines(maxVal)
  const totalMins = bars.reduce((s, b) => s + b.mins, 0)
  const activeDays = bars.filter(b => b.mins > 0).length
  const CHART_H = 180

  return (
    <div className="sec">
      <div className="sec-title">投資グラフ</div>
      <div className="card static" style={{ padding:'16px 0 8px' }}>

        {/* タブ */}
        <div style={{ display:'flex', margin:'0 16px 14px', background:'#F0EDE7', borderRadius:10, padding:3 }}>
          {[['day','日'],['week','週'],['month','月']].map(([v,l]) => (
            <button key={v} onClick={() => { setMode(v); setOffset(0) }} style={{
              flex:1, padding:'8px 0', border:'none', borderRadius:8,
              background: mode===v ? '#fff' : 'transparent',
              fontFamily:'var(--font)', fontSize:13, fontWeight:700,
              color: mode===v ? 'var(--main)' : 'var(--muted)',
              boxShadow: mode===v ? '0 1px 4px rgba(0,0,0,0.1)' : 'none',
              cursor:'pointer', transition:'all 0.2s',
            }}>{l}</button>
          ))}
        </div>

        {/* ナビゲーション */}
        <div style={{ display:'flex', alignItems:'center', justifyContent:'space-between', padding:'0 16px 16px' }}>
          <button onClick={() => setOffset(o => o-1)} style={{ background:'none', border:'1.5px solid var(--border)', borderRadius:8, width:34, height:34, cursor:'pointer', fontSize:16, display:'flex', alignItems:'center', justifyContent:'center', flexShrink:0 }}>‹</button>
          <div style={{ fontSize:13, fontWeight:800, color:'var(--ink2)', textAlign:'center' }}>{title}</div>
          <button onClick={() => setOffset(o => o+1)} disabled={offset>=0} style={{ background:'none', border:'1.5px solid var(--border)', borderRadius:8, width:34, height:34, fontSize:16, display:'flex', alignItems:'center', justifyContent:'center', flexShrink:0, opacity:offset>=0?0.25:1, cursor:offset>=0?'default':'pointer' }}>›</button>
        </div>

        {/* グラフ本体 — 左にY軸ラベル, 右に棒グラフ */}
        <div style={{ display:'flex', paddingLeft:4, paddingRight:16 }}>

          {/* Y軸ラベル */}
          <div style={{ position:'relative', width:42, flexShrink:0, height: CHART_H + 36 }}>
            {gridLines.map(v => (
              <div key={v} style={{
                position:'absolute',
                bottom: `${(v / maxVal) * CHART_H}px`,
                right:4,
                fontSize:9, fontWeight:700, color:'#BBAA99',
                whiteSpace:'nowrap', lineHeight:1,
              }}>{fmtMins(v)}</div>
            ))}
          </div>

          {/* 棒グラフエリア */}
          <div style={{ flex:1, position:'relative', height: CHART_H + 36 }}>
            {/* グリッドライン */}
            {gridLines.map(v => (
              <div key={v} style={{
                position:'absolute',
                bottom: `${(v / maxVal) * CHART_H}px`,
                left:0, right:0,
                borderTop: v === 90 ? '1.5px dashed #F2994A' : '1px solid #EDE8DF',
                zIndex:0,
              }} />
            ))}
            {/* 90分ラベル */}
            {maxVal >= 90 && (
              <div style={{
                position:'absolute',
                bottom: `${(90 / maxVal) * CHART_H + 3}px`,
                right:0, fontSize:8, color:'#F2994A', fontWeight:800,
              }}>90分</div>
            )}
            {/* 棒グラフ群 */}
            <div style={{ display:'flex', alignItems:'flex-end', height: CHART_H, position:'relative', zIndex:1 }}>
              {bars.map(b => {
                const barH = b.mins > 0 ? Math.max((b.mins / maxVal) * CHART_H, 4) : 0
                const color = THEME_COLORS[b.theme] || DEFAULT_COLOR
                const isToday = b.key === toDateStr(today)
                return (
                  <div key={b.key} style={{ flex:1, display:'flex', flexDirection:'column', alignItems:'center', gap:0 }}>
                    {/* 棒上の時間ラベル */}
                    <div style={{ fontSize:8, fontWeight:800, color: b.mins>0 ? color : 'transparent', marginBottom:2, whiteSpace:'nowrap' }}>
                      {fmtMins(b.mins)}
                    </div>
                    {/* 棒 */}
                    <div style={{
                      width:'70%', height: barH,
                      background: b.mins>0 ? color : '#EDE8DF',
                      borderRadius:'4px 4px 2px 2px',
                      opacity: isToday ? 1 : 0.8,
                      boxShadow: isToday && b.mins>0 ? `0 2px 8px ${color}55` : 'none',
                      transition:'height 0.4s ease',
                    }} />
                  </div>
                )
              })}
            </div>
            {/* X軸ラベル */}
            <div style={{ display:'flex', height:36, borderTop:'1px solid #EDE8DF', marginTop:0 }}>
              {bars.map(b => {
                const isToday = b.key === toDateStr(today)
                return (
                  <div key={b.key} style={{ flex:1, display:'flex', flexDirection:'column', alignItems:'center', justifyContent:'center', gap:1 }}>
                    <div style={{ fontSize:10, fontWeight: isToday?800:600, color: isToday?'var(--orange)':'#888' }}>{b.label}</div>
                    {b.sub && <div style={{ fontSize:9, color: isToday?'var(--orange)':'#BBB', fontWeight:600 }}>{b.sub}</div>}
                  </div>
                )
              })}
            </div>
          </div>
        </div>

        {/* 期間サマリー */}
        <div style={{ display:'flex', gap:0, padding:'12px 16px 6px', borderTop:'1px solid #F0EDE7', marginTop:4 }}>
          {[
            { val: fmtMins(totalMins), lbl:'合計', color:'var(--main)' },
            { val: `${activeDays}日`, lbl:'投資した日', color:'var(--orange)' },
            { val: activeDays>0 ? fmtMins(Math.round(totalMins/activeDays)) : '—', lbl:'平均/日', color:'var(--purple)' },
          ].map(({ val, lbl, color }) => (
            <div key={lbl} style={{ flex:1, textAlign:'center' }}>
              <div style={{ fontSize:18, fontWeight:900, color }}>{val}</div>
              <div style={{ fontSize:10, color:'var(--muted)', fontWeight:700, marginTop:1 }}>{lbl}</div>
            </div>
          ))}
        </div>

        {/* テーマ凡例 */}
        <div style={{ display:'flex', flexWrap:'wrap', gap:'4px 10px', padding:'8px 16px 4px' }}>
          {THEMES.map(t => (
            <div key={t} style={{ display:'flex', alignItems:'center', gap:4 }}>
              <div style={{ width:8, height:8, borderRadius:2, background:THEME_COLORS[t] }} />
              <span style={{ fontSize:10, color:'var(--muted)', fontWeight:700 }}>{t}</span>
            </div>
          ))}
        </div>
      </div>
    </div>
  )
}

/* ─── 投資カレンダー（リスト形式） ─── */
function InvestHistory() {
  const [open, setOpen] = useState(false)
  const [records, setRecords] = useState([])

  useEffect(() => {
    if (!open) return
    const all = getAllRecords()
    const list = Object.entries(all)
      .filter(([, r]) => r.investment && getInvMins(r.investment) > 0)
      .map(([date, r]) => ({ date, inv: r.investment }))
      .sort((a, b) => b.date.localeCompare(a.date))
    setRecords(list)
  }, [open])

  if (!open) {
    return (
      <div className="sec">
        <button className="btn btn-outline" style={{ width:'100%' }} onClick={() => setOpen(true)}>
          📋 詳細記録を見る
        </button>
      </div>
    )
  }

  return (
    <div className="sec">
      <div style={{ display:'flex', alignItems:'center', justifyContent:'space-between', marginBottom:12 }}>
        <div className="sec-title" style={{ marginBottom:0 }}>📋 詳細記録</div>
        <button onClick={() => setOpen(false)} style={{ background:'none', border:'none', fontSize:13, color:'var(--muted)', cursor:'pointer', fontFamily:'var(--font)', fontWeight:700 }}>
          閉じる ↑
        </button>
      </div>
      {records.length === 0 ? (
        <div className="card static" style={{ textAlign:'center', padding:'24px', color:'var(--muted)', fontSize:13 }}>まだ記録がありません</div>
      ) : (
        <div style={{ display:'flex', flexDirection:'column', gap:10 }}>
          {records.map(({ date, inv }) => {
            const mins = getInvMins(inv)
            const done = inv.timerDone || inv.manualMinutes >= 90
            const color = THEME_COLORS[inv.theme] || DEFAULT_COLOR
            return (
              <div key={date} className="card static" style={{ padding:'14px 16px', borderLeft:`3px solid ${color}` }}>
                <div style={{ display:'flex', alignItems:'center', justifyContent:'space-between', marginBottom:6 }}>
                  <div style={{ fontSize:12, fontWeight:800, color:'var(--main)' }}>{formatDate(date)}</div>
                  <div style={{ display:'flex', alignItems:'center', gap:6 }}>
                    {done && <span style={{ fontSize:10, fontWeight:900, color:'var(--success)' }}>✓ 達成</span>}
                    <span style={{ fontSize:13, fontWeight:900, color: done ? 'var(--success)' : color }}>{fmtMins(mins)}</span>
                  </div>
                </div>
                <div style={{ height:3, background:'#F0EDE7', borderRadius:4, marginBottom:8, overflow:'hidden' }}>
                  <div style={{ height:'100%', width:`${Math.min((mins/90)*100,100)}%`, background:color, borderRadius:4 }} />
                </div>
                <div style={{ display:'flex', gap:8, flexWrap:'wrap', alignItems:'center' }}>
                  {inv.theme && (
                    <span style={{ fontSize:11, background:`${color}18`, borderRadius:20, padding:'2px 10px', fontWeight:700, color }}>
                      {inv.theme}{inv.toeicSub ? ` / ${inv.toeicSub}` : ''}
                    </span>
                  )}
                  {inv.focus && (
                    <span style={{ fontSize:11, color:'var(--muted)', fontWeight:700 }}>
                      集中{'★'.repeat(inv.focus)}{'☆'.repeat(5-inv.focus)}
                    </span>
                  )}
                </div>
                {inv.done && <div style={{ fontSize:12, color:'var(--ink2)', marginTop:6, lineHeight:1.5 }}>{inv.done}</div>}
              </div>
            )
          })}
        </div>
      )}
    </div>
  )
}

/* ═══════════════════════════════════════════
   メインコンポーネント
═══════════════════════════════════════════ */
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
            handleDone(); return TOTAL
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
    setTimeout(() => confetti({ particleCount: 80, spread: 70, origin: { y: 0.6 }, colors: ['#2F4858','#F2994A','#6C63FF'] }), 300)
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
      setTimeout(() => confetti({ particleCount: 60, spread: 60, origin: { y: 0.6 }, colors: ['#2F4858','#F2994A','#6C63FF'] }), 200)
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
    <div className="slide-up" style={{ paddingBottom:'40px' }}>
      <div className="ph">
        <div className="ph-eyebrow">Invest — 90min</div>
        <div className="ph-title">今日の自己投資</div>
        <div className="ph-sub">今日の90分が未来を変える</div>
      </div>

      {/* ── タイマー ── */}
      <div className="sec">
        <div className="card static" style={{ textAlign:'center', padding:'32px 20px' }}>
          <div style={{ position:'relative', display:'inline-block' }}>
            <svg width="180" height="180" viewBox="0 0 180 180">
              <circle cx="90" cy="90" r="70" fill="none" stroke="#F0EDE7" strokeWidth="8" />
              <circle cx="90" cy="90" r="70" fill="none"
                stroke={isDone ? 'var(--success)' : 'var(--main)'}
                strokeWidth="8" strokeDasharray={C} strokeDashoffset={dash}
                strokeLinecap="round" transform="rotate(-90 90 90)"
                style={{ transition:'stroke-dashoffset 0.5s ease' }}
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
                <button className="btn btn-outline" style={{ width:120 }} onClick={() => { setRunning(false); setInv({ timerSeconds:elapsed }) }}>⏸ PAUSE</button>
              )}
              <button className="btn btn-sm btn-ghost" style={{ width:'auto' }} onClick={() => { setRunning(false); setElapsed(0); setInv({ timerSeconds:0, timerDone:false }) }}>RESET</button>
            </div>
          )}
        </div>
      </div>

      {/* ── 手動記録 ── */}
      <div className="sec">
        <div className="sec-title">手動で時間を記録する</div>
        <div className="card static">
          <div style={{ fontSize:12,color:'var(--muted)',marginBottom:12,lineHeight:1.6 }}>
            タイマー以外で投資した時間を分単位で入力できます。
          </div>
          <div style={{ display:'flex',alignItems:'center',gap:10 }}>
            <input
              type="number" min="1" max="480"
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
            <button className="btn btn-main" style={{ width:80,flexShrink:0 }} onClick={handleManualSave}>記録</button>
          </div>
          {manualMins > 0 && (
            <div style={{ marginTop:10,fontSize:12,fontWeight:700,color:'var(--success)' }}>
              ✓ {manualMins}分 記録済み{manualMins >= 90 ? ' — 90分達成！' : ` — あと${90-manualMins}分で達成`}
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
              {THEMES.map(t => <button key={t} className={`pill ${inv.theme===t?'on':''}`} onClick={() => setInv({ theme:t })}>{t}</button>)}
            </div>
          </div>
          {inv.theme === 'TOEIC' && (
            <div className="f">
              <label className="fl">TOEIC の項目</label>
              <div className="pills">
                {TOEIC_SUBS.map(t => <button key={t} className={`pill ${inv.toeicSub===t?'on':''}`} onClick={() => setInv({ toeicSub:t })}>{t}</button>)}
              </div>
            </div>
          )}
          <div className="f">
            <label className="fl">今日やること</label>
            <textarea value={inv.plan||''} onChange={e => setInv({ plan:e.target.value })} placeholder="今日の具体的な目標" rows={2} />
          </div>
          <div className="f">
            <label className="fl">実際にやったこと</label>
            <textarea value={inv.done||''} onChange={e => setInv({ done:e.target.value })} placeholder="終わったら記録" rows={2} />
          </div>
          <div className="f">
            <label className="fl">集中度</label>
            <Stars value={inv.focus||3} onChange={v => setInv({ focus:v })} />
          </div>
          <div className="f">
            <label className="fl">学んだこと</label>
            <textarea value={inv.learned||''} onChange={e => setInv({ learned:e.target.value })} placeholder="今日の発見" rows={2} />
          </div>
          <div className="f" style={{ marginBottom:0 }}>
            <label className="fl">明日やること</label>
            <textarea value={inv.tomorrow||''} onChange={e => setInv({ tomorrow:e.target.value })} placeholder="継続のために" rows={2} />
          </div>
        </div>
      </div>

      <div className="sec">
        <button className="btn btn-main" onClick={() => toast('積み上げた。今日の自分に誇りを。')}>
          記録を保存する
        </button>
      </div>

      {/* ── 投資グラフ ── */}
      <InvestChart />

      {/* ── 詳細記録リスト ── */}
      <InvestHistory />
    </div>
  )
}
