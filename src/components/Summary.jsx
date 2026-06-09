import { useState, useEffect } from 'react'
import { getSummaries, saveSummary, deleteSummary } from '../utils/storage'
import { toast } from './Toast'

const TYPES = ['アニメ', '映画', 'YouTube', '本', '音楽', 'その他']
const EMPTY = { type: 'アニメ', title: '', summary: '', movingScene: '', whyMoved: '', learned: '', myLife: '', howToTell: '', depth: '' }
const FORM_FIELDS = [
  { key: 'summary',     label: '3行要約',                       ph: '3行でまとめると？', rows: 3 },
  { key: 'movingScene', label: '一番心が動いた場面',            ph: '',                  rows: 2 },
  { key: 'whyMoved',    label: 'なぜ心が動いたか',              ph: '',                  rows: 2 },
  { key: 'learned',     label: '登場人物・話し手から学んだこと', ph: '',                 rows: 2 },
  { key: 'myLife',      label: '自分の人生に置き換えると？',    ph: '',                  rows: 2 },
  { key: 'howToTell',   label: '友達に話すならどう話す？',      ph: '言語化して話せるようにする', rows: 2 },
  { key: 'depth',       label: '今日の自分の世界が深まったこと', ph: '',                 rows: 2 },
]

export default function Summary() {
  const [list, setList] = useState([])
  const [editing, setEditing] = useState(null)
  const [form, setForm] = useState(EMPTY)
  const [showForm, setShowForm] = useState(false)

  useEffect(() => { setList(getSummaries()) }, [])

  const refresh = () => setList(getSummaries())
  const set = (k, v) => setForm(f => ({ ...f, [k]: v }))

  const handleSave = () => {
    if (!form.title.trim()) { toast('タイトルを入力してください'); return }
    saveSummary(editing ? { ...form, id: editing } : form)
    refresh(); setShowForm(false)
    toast('自分の世界が1%深まった')
  }

  const handleDelete = (id) => { deleteSummary(id); refresh(); toast('削除しました') }

  if (showForm) return (
    <div className="slide-up" style={{ paddingBottom: '40px' }}>
      <div className="ph">
        <div style={{ display:'flex',justifyContent:'space-between',alignItems:'flex-start' }}>
          <div>
            <div className="ph-eyebrow">World — Summary</div>
            <div className="ph-title">要約を書く</div>
          </div>
          <button className="btn btn-sm btn-outline" style={{ marginTop:8,width:'auto' }} onClick={() => setShowForm(false)}>← 戻る</button>
        </div>
      </div>
      <div className="sec">
        <div className="card static">
          <div className="f">
            <label className="fl">種類</label>
            <div className="pills">
              {TYPES.map(t => <button key={t} className={`pill ${form.type === t ? 'on' : ''}`} onClick={() => set('type', t)}>{t}</button>)}
            </div>
          </div>
          <div className="f">
            <label className="fl">タイトル</label>
            <input value={form.title} onChange={e => set('title', e.target.value)} placeholder="作品名・動画タイトル" />
          </div>
          {FORM_FIELDS.map((f, i, arr) => (
            <div className="f" key={f.key} style={{ marginBottom: i < arr.length - 1 ? 18 : 0 }}>
              <label className="fl">{f.label}</label>
              <textarea value={form[f.key]} onChange={e => set(f.key, e.target.value)} placeholder={f.ph} rows={f.rows} />
            </div>
          ))}
        </div>
        <button className="btn btn-main" style={{ marginTop:12 }} onClick={handleSave}>保存する</button>
      </div>
    </div>
  )

  return (
    <div className="slide-up" style={{ paddingBottom: '40px' }}>
      <div className="ph">
        <div style={{ display:'flex',justifyContent:'space-between',alignItems:'flex-start' }}>
          <div>
            <div className="ph-eyebrow">World — Summary</div>
            <div className="ph-title">自分の世界を深める</div>
            <div className="ph-sub">{list.length}作品 要約済み</div>
          </div>
          <button className="btn btn-sm btn-main" style={{ marginTop:8,width:'auto' }} onClick={() => { setForm(EMPTY); setEditing(null); setShowForm(true) }}>+ 追加</button>
        </div>
      </div>

      <div className="sec">
        {list.length === 0 && (
          <div style={{ textAlign:'center',padding:'48px 24px' }}>
            <div style={{ fontSize:40,marginBottom:12 }}>📖</div>
            <div style={{ fontWeight:900,fontSize:16,marginBottom:6 }}>まだ要約がない</div>
            <div style={{ fontSize:13,color:'var(--muted)',lineHeight:1.7 }}>アニメ・映画・YouTube・本を要約して<br />自分の世界を深めよう</div>
          </div>
        )}
        {list.map(item => (
          <div key={item.id} className="card" style={{ marginBottom:12 }}>
            <div style={{ display:'flex',justifyContent:'space-between',marginBottom:8 }}>
              <div style={{ display:'flex',gap:8,alignItems:'center' }}>
                <span className="badge b-purple">{item.type}</span>
                {item.date && <span style={{ fontSize:10,color:'var(--muted)' }}>{item.date}</span>}
              </div>
              <div style={{ display:'flex',gap:8 }}>
                <button className="btn btn-sm btn-outline" onClick={() => { setForm(item); setEditing(item.id); setShowForm(true) }}>編集</button>
                <button className="btn btn-sm btn-danger" onClick={() => handleDelete(item.id)}>削除</button>
              </div>
            </div>
            <div style={{ fontWeight:900,fontSize:16,marginBottom:8,letterSpacing:-0.3 }}>{item.title}</div>
            {item.summary && <div style={{ fontSize:14,color:'#555',lineHeight:1.7 }}>{item.summary}</div>}
            {item.movingScene && (
              <div style={{ marginTop:12,padding:'10px 14px',background:'rgba(108,99,255,0.06)',borderRadius:8,fontSize:13 }}>
                <span style={{ fontWeight:700,color:'var(--purple)' }}>心が動いた：</span>{item.movingScene}
              </div>
            )}
            {item.myLife && (
              <div style={{ marginTop:8,fontSize:13,color:'#666' }}>
                <span style={{ fontWeight:700 }}>自分の人生に置き換えると：</span>{item.myLife}
              </div>
            )}
          </div>
        ))}
      </div>
    </div>
  )
}
