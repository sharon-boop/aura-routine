import { useState, useEffect } from 'react'
import { getTodayRecord, updateTodayRecord, getDailyQuote } from '../utils/storage'
import { toast } from './Toast'
import confetti from 'canvas-confetti'

/* ─── スコアピッカー（0-100） ─── */
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
          <div style={{ fontSize:48, fontWeight:900, color, lineHeight:1, letterSpacing:-2, transition:'color 0.3s' }}>
            {value}
          </div>
          <div style={{ fontSize:10, fontWeight:700, color:'var(--muted)', letterSpacing:1 }}>SCORE</div>
        </div>
        <div style={{ flex:1 }}>
          <input
            type="range" min={0} max={100} step={1}
            value={value}
            onChange={e => onChange(Number(e.target.value))}
            style={{ width:'100%', accentColor: color }}
          />
          <div style={{ display:'flex', gap:6, flexWrap:'wrap', marginTop:8 }}>
            {presets.map(p => (
              <button key={p} onClick={() => onChange(p)}
                style={{
                  padding:'5px 12px', borderRadius:20, border:`1.5px solid ${getScoreColor(p)}`,
                  background: value===p ? getScoreColor(p) : 'transparent',
                  color: value===p ? '#fff' : getScoreColor(p),
                  fontSize:12, fontWeight:800, cursor:'pointer', fontFamily:'var(--font)',
                  transition:'all 0.2s',
                }}>
                {p}
              </button>
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
  const [eqOpen, setEqOpen] = useState(false)
  const [iqOpen, setIqOpen] = useState(false)
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
    setTimeout(() => confetti({ particleCount: 55, spread: 55, origin: { y: 0.7 }, colors: ['#2F4858','#F2994A','#6C63FF','#84A98C'] }), 300)
    setTimeout(() => setSaved(false), 4000)
  }

  if (!data) return null
  const ev = data.evening || {}
  const vp = data.morning?.valuePeople || []
  const score = ev.score || 0

  return (
    <div className="slide-up" style={{ paddingBottom:'40px' }}>
      <div className="ph">
        <div className="ph-eyebrow">Routine — Evening</div>
        <div className="ph-title">今日を成長に変える</div>
        <div className="ph-sub">一日を振り返り、明日の自分を決める</div>
      </div>

      {/* 今日の名言 */}
      <div className="sec">
        <div style={{ padding:'16px 18px', background:'var(--cream)', borderRadius:'var(--r-sm)', borderLeft:'3px solid var(--orange)', marginBottom:4 }}>
          <div style={{ fontSize:12, fontWeight:700, color:'var(--orange)', letterSpacing:1, marginBottom:5, textTransform:'uppercase' }}>Today's Words</div>
          <div style={{ fontSize:14, fontWeight:700, lineHeight:1.6 }}>「{quote.text}」</div>
          <div style={{ fontSize:11, color:'var(--muted)', marginTop:4 }}>— {quote.author}</div>
        </div>
      </div>

      {/* 価値提供まとめ */}
      {vp.filter(p=>p.name).length > 0 && (
        <div className="sec">
          <div className="sec-title">今日の価値提供</div>
          <div className="card static">
            {vp.map((p,i) => (
              <div key={i} style={{ display:'flex', alignItems:'center', gap:12, padding:'11px 0', borderBottom:i<2?'1px solid #F5F2ED':'none' }}>
                <div style={{ width:26, height:26, borderRadius:7, background:p.done?'var(--main)':'#F0EDE7', display:'flex', alignItems:'center', justifyContent:'center', fontSize:11, fontWeight:900, color:p.done?'#fff':'#CCC', flexShrink:0 }}>
                  {p.done?'✓':i+1}
                </div>
                <span style={{ fontSize:14, fontWeight:600 }}>{p.name||`${i+1}人目`}</span>
                {p.valueType && <span style={{ fontSize:11, color:'var(--muted)' }}>{p.valueType}</span>}
              </div>
            ))}
          </div>
        </div>
      )}

      {/* ── 今日のスコア ── */}
      <div className="sec">
        <div className="sec-title">今日のスコア</div>
        <div className="card static">
          <ScoreInput value={score} onChange={v => setEv({ score: v })} />
        </div>
      </div>

      {/* ── EQ ログ ── */}
      <div className="sec">
        <div
          onClick={() => setEqOpen(o=>!o)}
          style={{ display:'flex', alignItems:'center', justifyContent:'space-between', marginBottom: eqOpen ? 10 : 0, cursor:'pointer' }}
        >
          <div className="sec-title" style={{ marginBottom:0 }}>
            <span style={{ color:'var(--purple)' }}>EQ</span> 感情ログ
          </div>
          <span style={{ fontSize:12, color:'var(--muted)', fontWeight:700 }}>{eqOpen?'▲':'▼'}</span>
        </div>
        {eqOpen && (
          <div className="card static">
            <div style={{ fontSize:11, color:'var(--muted)', marginBottom:14, lineHeight:1.7, padding:'10px 12px', background:'var(--cream)', borderRadius:8 }}>
              💡 感情に名前をつけることで、EQが高まります。<br/>
              「なんかムカつく」→「今自分は焦っている。理由は〇〇。だから〇〇しよう」
            </div>
            {[
              { key:'eqEmotion', label:'今日の感情', ph:'例：焦り・安心・前向き・悲しい' },
              { key:'eqReason',  label:'その理由',    ph:'なぜその感情になったか？' },
              { key:'eqNeed',    label:'本当の欲求',  ph:'本当は何がほしかった？安心？認められたい？' },
              { key:'eqAction',  label:'次の行動',    ph:'この感情をふまえて、明日どうする？' },
            ].map((f,i,arr) => (
              <div className="f" key={f.key} style={{ marginBottom: i<arr.length-1?14:0 }}>
                <label className="fl">{f.label}</label>
                <textarea value={ev[f.key]||''} onChange={e=>setEv({[f.key]:e.target.value})} placeholder={f.ph} rows={2} />
              </div>
            ))}
          </div>
        )}
      </div>

      {/* ── IQ ログ ── */}
      <div className="sec">
        <div
          onClick={() => setIqOpen(o=>!o)}
          style={{ display:'flex', alignItems:'center', justifyContent:'space-between', marginBottom: iqOpen ? 10 : 0, cursor:'pointer' }}
        >
          <div className="sec-title" style={{ marginBottom:0 }}>
            <span style={{ color:'var(--orange)' }}>IQ</span> 学びログ
          </div>
          <span style={{ fontSize:12, color:'var(--muted)', fontWeight:700 }}>{iqOpen?'▲':'▼'}</span>
        </div>
        {iqOpen && (
          <div className="card static">
            <div style={{ fontSize:11, color:'var(--muted)', marginBottom:14, lineHeight:1.7, padding:'10px 12px', background:'var(--cream)', borderRadius:8 }}>
              💡 読んだ内容を3行でまとめると、読解力・論理力・説明力が上がります。
            </div>
            <div className="f">
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

      {/* ── 振り返りフィールド ── */}
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

      {/* ── 日記 ── */}
      <div className="sec">
        <div className="sec-title">今日の日記</div>
        <div className="diary-card">
          <div className="diary-date-line">
            {new Date().toLocaleDateString('ja-JP',{year:'numeric',month:'long',day:'numeric',weekday:'long'})}
          </div>
          <div className="diary-title-wrap">
            <input
              className="diary-title-input"
              value={ev.diaryTitle||''}
              onChange={e=>setEv({diaryTitle:e.target.value})}
              placeholder="題名（任意）"
              maxLength={60}
            />
          </div>
          <div className="diary-divider" />
          <textarea
            className="diary-body"
            value={ev.diary||''}
            onChange={e=>setEv({diary:e.target.value})}
            placeholder={`今日あったことを自由に書こう。\n\n何を感じた？何を学んだ？\n明日の自分へのメッセージでもいい。`}
            rows={10}
          />
          <div className="diary-count">{(ev.diary||'').length} 文字</div>
        </div>
      </div>

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
