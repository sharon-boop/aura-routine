import { useState, useEffect } from 'react'
import { getTodayRecord, updateTodayRecord, getChecklistTemplate, saveChecklistTemplate } from '../utils/storage'
import { toast } from './Toast'

function AddItemInput({ onAdd }) {
  const [open, setOpen] = useState(false)
  const [val, setVal] = useState('')
  if (!open) return (
    <button onClick={() => setOpen(true)}
      style={{ width:'100%',padding:'11px',border:'1.5px dashed #DDD9D1',borderRadius:50,background:'none',color:'var(--muted)',fontSize:12,fontWeight:700,cursor:'pointer',fontFamily:'var(--font)',marginTop:8 }}>
      + 項目を追加する
    </button>
  )
  return (
    <div style={{ display:'flex',gap:8,marginTop:8 }}>
      <input value={val} onChange={e=>setVal(e.target.value)} onKeyDown={e=>e.key==='Enter'&&val.trim()&&(onAdd(val.trim()),setVal(''),setOpen(false))} placeholder="新しい項目" autoFocus
        style={{ flex:1,padding:'11px 14px',borderRadius:50,border:'1.5px solid #E8E4DC',background:'#FDFBF8',fontFamily:'var(--font)',fontSize:14,outline:'none' }} />
      <button className="btn btn-sm btn-main" onClick={()=>{if(val.trim()){onAdd(val.trim());setVal('');setOpen(false)}}} style={{width:'auto'}}>追加</button>
      <button className="btn btn-sm btn-ghost" onClick={()=>{setOpen(false);setVal('')}} style={{width:'auto'}}>×</button>
    </div>
  )
}

const MEMO_FIELDS = [
  { key:'praised',      label:'今日、褒めた人と内容',            ph:'例：田中くんのプレゼン構成がわかりやすいと伝えた' },
  { key:'improvedScene',label:'今日、場を良くした行動',          ph:'例：話が止まった時に明るい話題を振った' },
  { key:'noticedbg',    label:'今日、気づいた相手の背景',        ph:'例：佐藤さんが最近元気ない。就活かも' },
  { key:'weakPerson',   label:'今日、立場の弱い人にできたこと',  ph:'例：会話に入れていない後輩に話しかけた' },
  { key:'selfCare',     label:'今日、自分の機嫌を取るためにしたこと', ph:'例：深呼吸した / 好きな音楽を聴いた' },
]

export default function Afternoon() {
  const [data, setData] = useState(null)
  const [checks, setChecks] = useState([])
  const [anim, setAnim] = useState({})

  useEffect(() => {
    setData(getTodayRecord())
    setChecks(getChecklistTemplate('afternoon'))
  }, [])

  const setAft = (partial) => {
    const updated = updateTodayRecord({ afternoon: { ...data.afternoon, ...partial } })
    setData(updated)
  }

  const toggleCheck = (key) => {
    const next = { ...data.afternoon.checks, [key]: !data.afternoon.checks[key] }
    setAnim(a => ({ ...a, [key]: true }))
    setTimeout(() => setAnim(a => ({ ...a, [key]: false })), 250)
    if (!data.afternoon.checks[key]) toast('意識できてる ✓')
    setAft({ checks: next })
  }

  const addItem = (label) => {
    const key = `ac_${Date.now()}`
    const next = [...checks, { key, label }]
    setChecks(next); saveChecklistTemplate('afternoon', next)
    setAft({ checks: { ...data.afternoon.checks, [key]: false } })
    toast('項目を追加しました')
  }

  const removeItem = (key) => {
    const next = checks.filter(c => c.key !== key)
    setChecks(next); saveChecklistTemplate('afternoon', next)
    const nc = { ...data.afternoon.checks }; delete nc[key]
    setAft({ checks: nc })
  }

  if (!data) return null

  const dc = data.afternoon?.checks || {}
  const done = checks.filter(c => dc[c.key]).length

  return (
    <div className="slide-up" style={{ paddingBottom: 'calc(var(--nav-h) + 24px)' }}>
      <div className="ph">
        <div className="ph-eyebrow">Routine — Afternoon</div>
        <div className="ph-title">人と向き合う</div>
        <div className="ph-sub" style={{ display:'flex',alignItems:'center',gap:12 }}>
          <span>まだ途中。でも進んでる — {done}/{checks.length}</span>
          <div style={{ flex:1,maxWidth:120,height:3,background:'#EDE9E0',borderRadius:99,overflow:'hidden' }}>
            <div style={{ height:'100%',background:'var(--green)',width:`${checks.length?(done/checks.length)*100:0}%`,transition:'width 0.5s' }} />
          </div>
        </div>
      </div>

      <div className="sec">
        <div className="sec-title">今日の人間関係チェック</div>
        <div className="card static">
          {checks.map(c => {
            const isCustom = c.key.startsWith('ac_')
            return (
              <div key={c.key} className="ck-item" onClick={() => toggleCheck(c.key)}>
                <div className={`ck-box ${dc[c.key] ? 'on' : ''} ${anim[c.key] ? 'ck-pop' : ''}`} />
                <span className={`ck-label ${dc[c.key] ? 'done' : ''}`}>{c.label}</span>
                {isCustom && <button className="ck-del" onClick={e=>{e.stopPropagation();removeItem(c.key)}}>×</button>}
              </div>
            )
          })}
          <AddItemInput onAdd={addItem} />
        </div>
      </div>

      <div className="sec">
        <div className="sec-title">今日の気づきメモ</div>
        <div className="card static">
          {MEMO_FIELDS.map((f, i) => (
            <div className="f" key={f.key} style={{ marginBottom: i < MEMO_FIELDS.length - 1 ? 16 : 0 }}>
              <label className="fl">{f.label}</label>
              <textarea value={data.afternoon?.[f.key]||''} onChange={e=>setAft({[f.key]:e.target.value})} placeholder={f.ph} rows={2} />
            </div>
          ))}
        </div>
      </div>

      <div className="sec">
        <button className="btn btn-main" onClick={() => toast('今日も少し、場を良くした 🌱')}>記録した</button>
      </div>
    </div>
  )
}
