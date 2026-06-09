import { useState, useEffect } from 'react'
import { getTodayRecord, updateTodayRecord, getDailyQuote } from '../utils/storage'
import { toast } from './Toast'
import confetti from 'canvas-confetti'

function Stars({ value, onChange }) {
  return (
    <div className="stars">
      {[1,2,3,4,5].map(n => (
        <button key={n} className="star" onClick={()=>onChange(n)}>{n<=value?'★':'☆'}</button>
      ))}
    </div>
  )
}

const EV_FIELDS = [
  { key:'arikataResult',  label:'今日の在り方はできたか',   ph:'正直に振り返ろう。できてなくてもOK。' },
  { key:'goodInteraction',label:'今日、良かった関わり',     ph:'誰と・どんな場面？' },
  { key:'eyeContact',     label:'目を見て話せた場面',       ph:'' },
  { key:'praised',        label:'今日褒めたこと',           ph:'誰を・どう褒めた？' },
  { key:'improvedScene',  label:'今日、場を良くできた行動', ph:'' },
  { key:'roughAction',    label:'今日、雑だった対応',       ph:'責めなくていい。ただ気づく。' },
  { key:'emotionBreak',   label:'感情が乱れた場面',         ph:'' },
  { key:'emotionBg',      label:'その背景・構造',           ph:'なぜ乱れたか？相手の背景は？' },
  { key:'bgView',         label:'人を背景で見られたか',     ph:'どんな場面で？' },
  { key:'tomorrowImprove',label:'明日、一つだけ改善すること', ph:'具体的に一つだけ' },
]

export default function Evening() {
  const [data, setData] = useState(null)
  const [saved, setSaved] = useState(false)
  const quote = getDailyQuote()

  useEffect(() => { setData(getTodayRecord()) }, [])

  const setEv = (partial) => {
    const updated = updateTodayRecord({ evening: { ...data.evening, ...partial } })
    setData(updated)
  }

  const handleSave = () => {
    updateTodayRecord({ evening: data.evening })
    setSaved(true)
    toast('今日も少し、人と自分を前に進めた 🌙')
    setTimeout(() => confetti({ particleCount: 55, spread: 55, origin: { y: 0.7 }, colors: ['#2F4858', '#F2994A', '#6C63FF', '#84A98C'] }), 300)
    setTimeout(() => setSaved(false), 4000)
  }

  if (!data) return null

  const ev = data.evening || {}
  const vp = data.morning?.valuePeople || []

  return (
    <div className="slide-up" style={{ paddingBottom: 'calc(var(--nav-h) + 24px)' }}>
      <div className="ph">
        <div className="ph-eyebrow">Routine — Evening</div>
        <div className="ph-title">今日を成長に変える</div>
        <div className="ph-sub">一日を振り返り、明日の自分を決める</div>
      </div>

      {/* 今日の名言 */}
      <div className="sec">
        <div style={{ padding:'16px 18px',background:'var(--cream)',borderRadius:'var(--r-sm)',borderLeft:'3px solid var(--orange)',marginBottom:4 }}>
          <div style={{ fontSize:12,fontWeight:700,color:'var(--orange)',letterSpacing:1,marginBottom:5,textTransform:'uppercase' }}>Today's Words</div>
          <div style={{ fontSize:14,fontWeight:700,lineHeight:1.6 }}>「{quote.text}」</div>
          <div style={{ fontSize:11,color:'var(--muted)',marginTop:4 }}>— {quote.author}</div>
        </div>
      </div>

      {/* 価値提供まとめ */}
      {vp.filter(p=>p.name).length > 0 && (
        <div className="sec">
          <div className="sec-title">今日の価値提供</div>
          <div className="card static">
            {vp.map((p,i) => (
              <div key={i} style={{ display:'flex',alignItems:'center',gap:12,padding:'11px 0',borderBottom:i<2?'1px solid #F5F2ED':'none' }}>
                <div style={{ width:26,height:26,borderRadius:7,background:p.done?'var(--main)':'#F0EDE7',display:'flex',alignItems:'center',justifyContent:'center',fontSize:11,fontWeight:900,color:p.done?'#fff':'#CCC',flexShrink:0 }}>
                  {p.done?'✓':i+1}
                </div>
                <span style={{ fontSize:14,fontWeight:600 }}>{p.name||`${i+1}人目`}</span>
                {p.valueType && <span style={{ fontSize:11,color:'var(--muted)' }}>{p.valueType}</span>}
              </div>
            ))}
          </div>
        </div>
      )}

      {/* 振り返りフィールド */}
      <div className="sec">
        <div className="sec-title">今日の振り返り</div>
        <div className="card static">
          {EV_FIELDS.slice(0,5).map((f,i,arr) => (
            <div className="f" key={f.key} style={{ marginBottom:i<arr.length-1?16:0 }}>
              <label className="fl">{f.label}</label>
              <textarea value={ev[f.key]||''} onChange={e=>setEv({[f.key]:e.target.value})} placeholder={f.ph} rows={2} />
            </div>
          ))}
        </div>
      </div>

      <div className="sec">
        <div className="sec-title">気づきと改善</div>
        <div className="card static">
          {EV_FIELDS.slice(5).map((f,i,arr) => (
            <div className="f" key={f.key} style={{ marginBottom:i<arr.length-1?16:0 }}>
              <label className="fl">{f.label}</label>
              <textarea value={ev[f.key]||''} onChange={e=>setEv({[f.key]:e.target.value})} placeholder={f.ph} rows={2} />
            </div>
          ))}
        </div>
      </div>

      <div className="sec">
        <div className="sec-title">今日の満足度</div>
        <div className="card static">
          <Stars value={ev.satisfaction||3} onChange={v=>setEv({satisfaction:v})} />
        </div>
      </div>

      <div className="sec">
        <div className="sec-title">今日の一言</div>
        <div className="card static">
          <textarea value={ev.diary||''} onChange={e=>setEv({diary:e.target.value})} placeholder="今日の自分を、一言で。" rows={4} style={{ fontSize:16,lineHeight:1.7 }} />
        </div>
      </div>

      <div className="sec">
        {saved ? (
          <div style={{ textAlign:'center',padding:'28px 0' }}>
            <div style={{ fontSize:10,fontWeight:700,letterSpacing:3,textTransform:'uppercase',color:'var(--muted)',marginBottom:10 }}>Saved ✓</div>
            <div style={{ fontSize:19,fontWeight:900,color:'var(--main)',letterSpacing:-0.5 }}>今日も少し、人と自分を前に進めた</div>
            <div style={{ fontSize:13,color:'var(--muted)',marginTop:6 }}>おつかれさま 🌙</div>
          </div>
        ) : (
          <button className="btn btn-main" onClick={handleSave}>今日を保存する</button>
        )}
      </div>
    </div>
  )
}
