import { useState, useEffect } from 'react'
import { getFunnyStories, saveFunnyStory, save, addGachaTickets, wasTicketAwarded, markTicketAwarded } from '../utils/storage'
import { toast } from './Toast'

const TARGETS = ['一人で練習', '友達', '家族', 'バイト先', '部活', 'その他']
const EMPTY = { event: '', normal: '', incident: '', emotion: '', analogy: '', ending: '', target: '一人で練習', result: '', nextTry: '' }
const STEPS = [
  { num: '①', label: '普通の状況',    key: 'normal',   ph: '最初はどんな状況だった？' },
  { num: '②', label: '違和感・事件',  key: 'incident', ph: 'そこで何が起きた？' },
  { num: '③', label: '自分の感情',    key: 'emotion',  ph: 'どんな気持ちになった？' },
  { num: '④', label: '例え・ツッコミ', key: 'analogy', ph: '何かに例えると？' },
  { num: '⑤', label: 'オチ',          key: 'ending',   ph: '最後どうなった？' },
]

export default function FunnyStory() {
  const [list, setList] = useState([])
  const [form, setForm] = useState(EMPTY)
  const [editing, setEditing] = useState(null)
  const [showForm, setShowForm] = useState(false)

  useEffect(() => { setList(getFunnyStories()) }, [])

  const refresh = () => setList(getFunnyStories())
  const set = (k, v) => setForm(f => ({ ...f, [k]: v }))

  const handleSave = () => {
    if (!form.event.trim()) { toast('出来事を入力してください'); return }
    saveFunnyStory(editing ? { ...form, id: editing } : form)
    refresh(); setShowForm(false)
    const key = `world_funny_${new Date().toISOString().slice(0,10)}`
    if (!wasTicketAwarded(key)) {
      addGachaTickets(1); markTicketAwarded(key)
      toast('話が面白い人になってる 🎟️ +1チケット')
    } else {
      toast('話が面白い人になってる')
    }
  }

  const del = (id) => {
    const updated = getFunnyStories().filter(s => s.id !== id)
    save('funnyStories', updated); refresh()
  }

  if (showForm) return (
    <div className="slide-up" style={{ paddingBottom: '40px' }}>
      <div className="ph">
        <div style={{ display:'flex',justifyContent:'space-between',alignItems:'flex-start' }}>
          <div>
            <div className="ph-eyebrow">World — Story</div>
            <div className="ph-title">話の練習</div>
          </div>
          <button className="btn btn-sm btn-outline" style={{ marginTop:8,width:'auto' }} onClick={() => setShowForm(false)}>← 戻る</button>
        </div>
      </div>
      <div className="sec">
        <div style={{ padding:'16px 18px',background:'var(--ink)',borderRadius:'var(--r-sm)',marginBottom:16 }}>
          <div style={{ fontSize:9,fontWeight:900,letterSpacing:2.5,color:'rgba(255,255,255,0.35)',textTransform:'uppercase',marginBottom:10 }}>Story Formula</div>
          <div style={{ display:'flex',gap:6,flexWrap:'wrap' }}>
            {STEPS.map(s => <span key={s.key} style={{ fontSize:11,color:'rgba(255,255,255,0.7)',fontWeight:700 }}>{s.num} {s.label}</span>)}
          </div>
          <div style={{ marginTop:10,fontSize:11,color:'rgba(255,255,255,0.3)',fontStyle:'italic' }}>
            「話が面白い人は、出来事ではなく見方が面白い」
          </div>
        </div>

        <div className="card static">
          <div className="f" style={{ marginBottom:0 }}>
            <label className="fl">今日あった出来事</label>
            <input value={form.event} onChange={e => set('event', e.target.value)} placeholder="一言で言うと？" />
          </div>
        </div>

        {STEPS.map(s => (
          <div key={s.key} style={{ display:'flex',gap:14,alignItems:'flex-start',marginTop:12 }}>
            <div style={{ width:32,height:32,borderRadius:10,background:'var(--main)',display:'flex',alignItems:'center',justifyContent:'center',fontSize:13,fontWeight:900,color:'#fff',flexShrink:0,marginTop:24 }}>{s.num}</div>
            <div className="f" style={{ flex:1 }}>
              <label className="fl">{s.label}</label>
              <textarea value={form[s.key]} onChange={e => set(s.key, e.target.value)} placeholder={s.ph} rows={2} />
            </div>
          </div>
        ))}

        <div className="card static" style={{ marginTop:12 }}>
          <div className="f">
            <label className="fl">実際に話した相手</label>
            <div className="pills">
              {TARGETS.map(t => <button key={t} className={`pill ${form.target === t ? 'on' : ''}`} onClick={() => set('target', t)}>{t}</button>)}
            </div>
          </div>
          <div className="f">
            <label className="fl">話してみた結果</label>
            <textarea value={form.result} onChange={e => set('result', e.target.value)} placeholder="反応はどうだった？" rows={2} />
          </div>
          <div className="f" style={{ marginBottom:0 }}>
            <label className="fl">次にもっと面白くするなら？</label>
            <textarea value={form.nextTry} onChange={e => set('nextTry', e.target.value)} placeholder="改善ポイントを一つ" rows={2} />
          </div>
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
            <div className="ph-eyebrow">World — Story</div>
            <div className="ph-title">話を面白くする</div>
            <div className="ph-sub">{list.length}回 練習済み</div>
          </div>
          <button className="btn btn-sm btn-main" style={{ marginTop:8,width:'auto' }} onClick={() => { setForm(EMPTY); setEditing(null); setShowForm(true) }}>+ 追加</button>
        </div>
      </div>

      <div className="sec">
        <div style={{ padding:'14px 18px',background:'var(--cream)',borderRadius:'var(--r-sm)',marginBottom:16,fontSize:13,fontStyle:'italic',color:'var(--ink)',lineHeight:1.6,borderLeft:'3px solid var(--orange)' }}>
          「話が面白い人は、出来事ではなく<strong>見方</strong>が面白い」
        </div>

        {list.length === 0 && (
          <div style={{ textAlign:'center',padding:'48px 24px' }}>
            <div style={{ fontSize:40,marginBottom:12 }}>🎤</div>
            <div style={{ fontWeight:900,fontSize:16,marginBottom:6 }}>話の練習を始めよう</div>
            <div style={{ fontSize:13,color:'var(--muted)',lineHeight:1.7 }}>今日あった出来事を型にはめて<br />面白く話す練習をしよう</div>
          </div>
        )}

        {list.map(item => (
          <div key={item.id} className="card" style={{ marginBottom:12 }}>
            <div style={{ display:'flex',justifyContent:'space-between',marginBottom:8 }}>
              <div style={{ display:'flex',gap:10,alignItems:'center' }}>
                <span style={{ fontSize:10,color:'var(--muted)' }}>{item.date}</span>
                <span className="badge b-navy">{item.target}</span>
              </div>
              <div style={{ display:'flex',gap:8 }}>
                <button className="btn btn-sm btn-outline" onClick={() => { setForm(item); setEditing(item.id); setShowForm(true) }}>編集</button>
                <button className="btn btn-sm btn-danger" onClick={() => del(item.id)}>削除</button>
              </div>
            </div>
            <div style={{ fontWeight:900,fontSize:15,marginBottom:6,letterSpacing:-0.3 }}>{item.event}</div>
            {item.ending && <div style={{ fontSize:13,color:'var(--muted)' }}>オチ：{item.ending}</div>}
            {item.result && (
              <div style={{ marginTop:8,fontSize:13,padding:'8px 12px',background:'var(--cream)',borderRadius:8 }}>
                結果：{item.result}
              </div>
            )}
          </div>
        ))}
      </div>
    </div>
  )
}
