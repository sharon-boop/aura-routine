import { useState, useEffect } from 'react'
import {
  getAllRecords, getWeekKey, getWeeklyReview, saveWeeklyReview,
} from '../utils/storage'
import { toast } from './Toast'

function pad(n) { return String(n).padStart(2,'0') }

function toDateStr(d) {
  return `${d.getFullYear()}-${pad(d.getMonth()+1)}-${pad(d.getDate())}`
}

// 週の月曜〜日曜の日付配列を返す
function getWeekDates(weekOffset = 0) {
  const today = new Date(); today.setHours(0,0,0,0)
  const dow = (today.getDay() + 6) % 7
  const monday = new Date(today); monday.setDate(today.getDate() - dow + weekOffset * 7)
  return Array.from({ length: 7 }, (_, i) => {
    const d = new Date(monday); d.setDate(monday.getDate() + i); return d
  })
}

function getScoreColor(s) {
  if (s >= 90) return '#00C851'
  if (s >= 80) return '#4CAF50'
  if (s >= 70) return '#F2994A'
  if (s >= 60) return '#FF9800'
  return '#9E9E9E'
}

export default function WeeklyReview() {
  const [weekOffset, setWeekOffset] = useState(0)
  const [review, setReview] = useState(null)
  const [stats, setStats] = useState(null)
  const [newPlan, setNewPlan] = useState('')

  useEffect(() => {
    const dates   = getWeekDates(weekOffset)
    const weekKey = getWeekKey(dates[0])
    const allRec  = getAllRecords()

    // 週のデータ集計
    const weekRecords = dates.map(d => allRec[toDateStr(d)]).filter(Boolean)
    const activeDays  = weekRecords.filter(r => r.evening?.diary || r.evening?.eqEmotion || r.evening?.score > 0).length
    const scores      = weekRecords.map(r => r.evening?.score || 0).filter(s => s > 0)
    const avgScore    = scores.length ? Math.round(scores.reduce((a,b)=>a+b,0) / scores.length) : 0

    // 感情頻度（EQログ）
    const emotionMap = {}
    weekRecords.forEach(r => {
      const em = r.evening?.eqEmotion?.trim()
      if (em) em.split(/[・、,\s]+/).forEach(e => { if(e) emotionMap[e] = (emotionMap[e]||0)+1 })
    })
    const topEmotions = Object.entries(emotionMap).sort((a,b)=>b[1]-a[1]).slice(0,5).map(([e])=>e)

    // テーマ頻度（IQログ / 投資テーマ）
    const themeMap = {}
    weekRecords.forEach(r => {
      const t = r.investment?.theme
      if (t) themeMap[t] = (themeMap[t]||0)+1
    })
    const topThemes = Object.entries(themeMap).sort((a,b)=>b[1]-a[1]).slice(0,5).map(([t])=>t)

    // 日別スコア（バー表示用）
    const dailyScores = dates.map(d => {
      const r = allRec[toDateStr(d)]
      return { date: d, score: r?.evening?.score || 0, has: !!r }
    })

    setStats({ activeDays, avgScore, topEmotions, topThemes, dailyScores })
    setReview(getWeeklyReview(weekKey))
  }, [weekOffset])

  if (!review || !stats) return null

  const dates = getWeekDates(weekOffset)
  const weekKey = getWeekKey(dates[0])
  const weekLabel = `${dates[0].getMonth()+1}/${dates[0].getDate()}（月）〜${dates[6].getMonth()+1}/${dates[6].getDate()}（日）`
  const DAY_JP = ['月','火','水','木','金','土','日']

  const setReviewField = (field, val) => {
    const next = { ...review, [field]: val }
    setReview(next)
    saveWeeklyReview(weekKey, next)
  }

  const setPlans = (plans) => setReviewField('plans', plans)

  const addPlan = () => {
    if (!newPlan.trim()) return
    const plans = [...(review.plans || []).filter(p=>p.trim()), newPlan.trim()]
    setPlans(plans); setNewPlan('')
    toast('来週の方針を追加しました')
  }

  const removePlan = (i) => {
    const plans = (review.plans||[]).filter((_,idx)=>idx!==i)
    setPlans(plans)
  }

  return (
    <div className="slide-up" style={{ paddingBottom:'40px' }}>
      <div className="ph">
        <div className="ph-eyebrow">Weekly Review</div>
        <div className="ph-title">週次レビュー</div>
        <div className="ph-sub">今週を振り返り、来週の自分を決める</div>
      </div>

      {/* 週ナビ */}
      <div className="sec">
        <div style={{ display:'flex', alignItems:'center', justifyContent:'space-between' }}>
          <button onClick={() => setWeekOffset(o=>o-1)} style={{ background:'none', border:'1.5px solid var(--border)', borderRadius:8, width:36, height:36, cursor:'pointer', fontSize:16, display:'flex', alignItems:'center', justifyContent:'center' }}>‹</button>
          <div style={{ textAlign:'center' }}>
            <div style={{ fontSize:12, fontWeight:800, color:'var(--main)' }}>{weekLabel}</div>
            {weekOffset === 0 && <div style={{ fontSize:10, color:'var(--orange)', fontWeight:700, marginTop:2 }}>今週</div>}
          </div>
          <button onClick={() => setWeekOffset(o=>o+1)} disabled={weekOffset>=0} style={{ background:'none', border:'1.5px solid var(--border)', borderRadius:8, width:36, height:36, fontSize:16, display:'flex', alignItems:'center', justifyContent:'center', opacity:weekOffset>=0?0.25:1, cursor:weekOffset>=0?'default':'pointer' }}>›</button>
        </div>
      </div>

      {/* 達成日数 + 平均スコア */}
      <div className="sec">
        <div style={{ display:'flex', gap:12 }}>
          <div className="card static" style={{ flex:1, textAlign:'center', padding:'20px 12px' }}>
            <div style={{ fontSize:32, fontWeight:900, color:'var(--main)', letterSpacing:-1 }}>
              {stats.activeDays}<span style={{ fontSize:14, fontWeight:700, color:'var(--muted)' }}>/7日</span>
            </div>
            <div style={{ fontSize:11, fontWeight:700, color:'var(--muted)', marginTop:4 }}>今週の記録日数</div>
          </div>
          <div className="card static" style={{ flex:1, textAlign:'center', padding:'20px 12px' }}>
            <div style={{ fontSize:32, fontWeight:900, color: getScoreColor(stats.avgScore), letterSpacing:-1 }}>
              {stats.avgScore > 0 ? stats.avgScore : '—'}<span style={{ fontSize:14, fontWeight:700, color:'var(--muted)' }}>点</span>
            </div>
            <div style={{ fontSize:11, fontWeight:700, color:'var(--muted)', marginTop:4 }}>平均スコア</div>
          </div>
        </div>
      </div>

      {/* 日別スコアバー */}
      <div className="sec">
        <div className="sec-title">日別スコア</div>
        <div className="card static" style={{ padding:'16px 16px 12px' }}>
          <div style={{ display:'flex', alignItems:'flex-end', gap:4, height:80 }}>
            {stats.dailyScores.map((d, i) => {
              const h = d.score > 0 ? Math.max((d.score/100)*70, 6) : 0
              const color = getScoreColor(d.score)
              const isToday = weekOffset===0 && i === (new Date().getDay()+6)%7
              return (
                <div key={i} style={{ flex:1, display:'flex', flexDirection:'column', alignItems:'center', gap:2 }}>
                  {d.score > 0 && <div style={{ fontSize:8, fontWeight:800, color, whiteSpace:'nowrap' }}>{d.score}</div>}
                  <div style={{ width:'80%', height:h, background: d.score>0 ? color : '#EDE8DF', borderRadius:'3px 3px 1px 1px', transition:'height 0.4s' }} />
                  <div style={{ fontSize:9, fontWeight: isToday?800:600, color: isToday?'var(--orange)':'#AAA' }}>{DAY_JP[i]}</div>
                </div>
              )
            })}
          </div>
        </div>
      </div>

      {/* 感情・テーマ */}
      <div className="sec">
        <div style={{ display:'flex', gap:12 }}>
          <div className="card static" style={{ flex:1, padding:'14px' }}>
            <div style={{ fontSize:11, fontWeight:900, color:'var(--purple)', letterSpacing:1, marginBottom:8 }}>EQ 感情</div>
            {stats.topEmotions.length > 0 ? (
              <div style={{ display:'flex', flexWrap:'wrap', gap:6 }}>
                {stats.topEmotions.map(e => (
                  <span key={e} style={{ fontSize:12, padding:'3px 10px', borderRadius:20, background:'rgba(108,99,255,0.1)', color:'var(--purple)', fontWeight:700 }}>{e}</span>
                ))}
              </div>
            ) : <div style={{ fontSize:12, color:'var(--muted)' }}>記録なし</div>}
          </div>
          <div className="card static" style={{ flex:1, padding:'14px' }}>
            <div style={{ fontSize:11, fontWeight:900, color:'var(--orange)', letterSpacing:1, marginBottom:8 }}>IQ テーマ</div>
            {stats.topThemes.length > 0 ? (
              <div style={{ display:'flex', flexWrap:'wrap', gap:6 }}>
                {stats.topThemes.map(t => (
                  <span key={t} style={{ fontSize:12, padding:'3px 10px', borderRadius:20, background:'rgba(242,153,74,0.1)', color:'var(--orange)', fontWeight:700 }}>{t}</span>
                ))}
              </div>
            ) : <div style={{ fontSize:12, color:'var(--muted)' }}>記録なし</div>}
          </div>
        </div>
      </div>

      {/* 今週の自分 */}
      <div className="sec">
        <div className="sec-title">今週の自分</div>
        <div className="card static">
          <textarea
            value={review.note||''}
            onChange={e => setReviewField('note', e.target.value)}
            placeholder='「完璧を求めすぎず、続ける感覚が出てきた」など'
            rows={3}
            style={{ fontSize:15, fontWeight:600, lineHeight:1.7 }}
          />
        </div>
      </div>

      {/* 来週の方針 */}
      <div className="sec">
        <div className="sec-title">来週の方針</div>
        <div className="card static">
          <div style={{ display:'flex', flexDirection:'column', gap:8, marginBottom:12 }}>
            {(review.plans||[]).filter(p=>p.trim()).map((plan, i) => (
              <div key={i} style={{ display:'flex', alignItems:'center', gap:10, padding:'10px 14px', background:'var(--cream)', borderRadius:10 }}>
                <div style={{ width:20, height:20, borderRadius:5, background:'var(--main)', display:'flex', alignItems:'center', justifyContent:'center', flexShrink:0 }}>
                  <span style={{ fontSize:10, color:'#fff', fontWeight:900 }}>{i+1}</span>
                </div>
                <span style={{ flex:1, fontSize:14, fontWeight:600 }}>{plan}</span>
                <button onClick={() => removePlan(i)} style={{ background:'none', border:'none', fontSize:13, color:'var(--muted)', cursor:'pointer', padding:'2px 6px' }}>×</button>
              </div>
            ))}
          </div>
          <div style={{ display:'flex', gap:8 }}>
            <input
              value={newPlan}
              onChange={e => setNewPlan(e.target.value)}
              onKeyDown={e => e.key==='Enter' && addPlan()}
              placeholder="来週やること・意識すること"
              style={{ flex:1, padding:'11px 14px', borderRadius:10, border:'1.5px solid var(--border)', background:'var(--card)', fontSize:14, fontFamily:'var(--font)', outline:'none' }}
            />
            <button className="btn btn-main" style={{ width:60, padding:'11px 0', flexShrink:0 }} onClick={addPlan}>追加</button>
          </div>
        </div>
      </div>

      {/* 保存確認 */}
      <div className="sec">
        <button className="btn btn-main" onClick={() => { saveWeeklyReview(weekKey, review); toast('週次レビューを保存しました ✓') }}>
          週次レビューを保存する
        </button>
      </div>
    </div>
  )
}
