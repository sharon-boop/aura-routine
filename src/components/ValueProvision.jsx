import { useState, useEffect } from 'react'
import { getTodayRecord, updateTodayRecord } from '../utils/storage'
import { toast } from './Toast'

const VALUE_TYPES = ['褒める', '聞く', '助ける', '整理する', '笑わせる', '背中を押す', '感謝する', '守る', '情報を渡す']

export default function ValueProvision() {
  const [data, setData] = useState(null)

  useEffect(() => { setData(getTodayRecord()) }, [])

  const setPerson = (i, partial) => {
    const vp = [...(data.morning?.valuePeople || [])]
    vp[i] = { ...vp[i], ...partial }
    updateTodayRecord({ morning: { ...data.morning, valuePeople: vp } })
    setData(prev => ({ ...prev, morning: { ...prev.morning, valuePeople: vp } }))
  }

  const toggleDone = (i) => {
    const vp = [...(data.morning?.valuePeople || [])]
    vp[i] = { ...vp[i], done: !vp[i].done }
    updateTodayRecord({ morning: { ...data.morning, valuePeople: vp } })
    setData(prev => ({ ...prev, morning: { ...prev.morning, valuePeople: vp } }))
    if (vp[i].done) toast('価値を渡した。それで十分。')
  }

  if (!data) return null

  const vp = data.morning?.valuePeople || []
  const doneCnt = vp.filter(p => p.done).length

  return (
    <div className="slide-up" style={{ paddingBottom: 'calc(var(--nav-h) + 24px)' }}>
      <div className="ph">
        <div className="ph-eyebrow">Routine — Value</div>
        <div className="ph-title">今日の価値提供</div>
        <div className="ph-sub">{doneCnt}/3 人に届けた {doneCnt === 3 && <span style={{ fontWeight:900,color:'var(--success)' }}>Complete ✓</span>}</div>
      </div>

      <div className="sec">
        <div style={{ padding:'14px 18px',background:'var(--ink)',borderRadius:'var(--r-sm)',marginBottom:20,fontSize:12,color:'rgba(255,255,255,0.6)',fontWeight:700,letterSpacing:0.5 }}>
          価値は渡すだけ。返ってくるかは相手の自由。
        </div>

        {vp.map((p, i) => (
          <div key={i} className="pcard" style={{ borderLeft: p.done ? '3px solid var(--success)' : '3px solid transparent', transition: 'border-color 0.3s' }}>
            <div style={{ display:'flex',justifyContent:'space-between',alignItems:'center',marginBottom:14 }}>
              <div className="pnum">PERSON {i + 1}</div>
              <button className={`btn btn-sm ${p.done ? 'btn-outline' : 'btn-outline'}`}
                style={{ background: p.done ? 'var(--success)' : '', color: p.done ? '#fff' : '', borderColor: p.done ? 'var(--success)' : '' }}
                onClick={() => toggleDone(i)}>
                {p.done ? '✓ Complete' : 'Mark Done'}
              </button>
            </div>

            <div className="f">
              <label className="fl">名前</label>
              <input value={p.name} onChange={e => setPerson(i, { name: e.target.value })} placeholder={`${i + 1}人目の名前`} />
            </div>

            <div className="f">
              <label className="fl">渡す価値</label>
              <div className="pills">
                {VALUE_TYPES.map(t => (
                  <button key={t} className={`pill ${p.valueType === t ? 'on' : ''}`} onClick={() => setPerson(i, { valueType: t })}>{t}</button>
                ))}
              </div>
            </div>

            <div className="f" style={{ marginBottom:0 }}>
              <label className="fl">実際にしたこと</label>
              <textarea value={p.action||''} onChange={e => setPerson(i, { action: e.target.value })} placeholder="どんな価値を渡したか" rows={2} />
            </div>
          </div>
        ))}

        {doneCnt === 3 && (
          <div style={{ textAlign:'center',padding:'28px 0' }}>
            <div style={{ fontSize:13,fontWeight:900,letterSpacing:1,textTransform:'uppercase',color:'var(--success)' }}>
              今日も少し人を良くした
            </div>
          </div>
        )}
      </div>
    </div>
  )
}
