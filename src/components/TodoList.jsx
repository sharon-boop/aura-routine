import { useState, useEffect } from 'react'
import { getTodos, saveTodos } from '../utils/storage'
import { toast } from './Toast'

const PRIORITIES = ['高', '中', '低']
const CATEGORIES = ['大学', 'バイト', '旅行', '美容', 'TOEIC', '就活', 'SNS', 'その他']
const P_BADGE = { '高': 'b-danger', '中': 'b-orange', '低': 'b-sage' }
const EMPTY = { text: '', priority: '中', category: 'その他', deadline: '', todayFlag: false }

export default function TodoList() {
  const [todos, setTodos] = useState([])
  const [form, setForm] = useState(EMPTY)
  const [editId, setEditId] = useState(null)
  const [showAdd, setShowAdd] = useState(false)
  const [filterToday, setFilterToday] = useState(false)
  const [showDone, setShowDone] = useState(false)

  useEffect(() => { setTodos(getTodos()) }, [])

  const persist = (list) => { setTodos(list); saveTodos(list) }
  const set = (k, v) => setForm(f => ({ ...f, [k]: v }))

  const handleSave = () => {
    if (!form.text.trim()) { toast('内容を入力してください'); return }
    if (editId) { persist(todos.map(t => t.id === editId ? { ...t, ...form } : t)); toast('更新しました') }
    else { persist([{ ...form, id: Date.now(), done: false }, ...todos]); toast('追加しました') }
    setForm(EMPTY); setEditId(null); setShowAdd(false)
  }

  const toggleDone = (id) => {
    const updated = todos.map(t => t.id === id ? { ...t, done: !t.done } : t)
    persist(updated)
    if (!todos.find(t => t.id === id).done) toast('完了 ✓')
  }

  const del = (id) => { persist(todos.filter(t => t.id !== id)); toast('削除しました') }

  const filtered = todos.filter(t => !filterToday || t.todayFlag)
  const active = filtered.filter(t => !t.done)
  const done = filtered.filter(t => t.done)

  return (
    <div className="slide-up" style={{ paddingBottom: '40px' }}>
      <div className="ph">
        <div style={{ display:'flex',justifyContent:'space-between',alignItems:'flex-start' }}>
          <div>
            <div className="ph-eyebrow">Invest — ToDo</div>
            <div className="ph-title">ToDoリスト</div>
            <div className="ph-sub">未完了 {active.length}件</div>
          </div>
          <button className="btn btn-sm btn-main" style={{ marginTop:8,width:'auto' }} onClick={() => { setForm(EMPTY); setEditId(null); setShowAdd(true) }}>
            + 追加
          </button>
        </div>
      </div>

      {showAdd && (
        <div className="sec">
          <div className="card static">
            <div style={{ fontWeight:900,fontSize:13,letterSpacing:0.5,marginBottom:14 }}>
              {editId ? 'ToDoを編集' : '新しいToDo'}
            </div>
            <div className="f">
              <label className="fl">内容</label>
              <input value={form.text} onChange={e => set('text', e.target.value)} placeholder="何をする？" autoFocus />
            </div>
            <div className="f">
              <label className="fl">優先度</label>
              <div className="pills">
                {PRIORITIES.map(p => <button key={p} className={`pill ${form.priority === p ? 'on' : ''}`} onClick={() => set('priority', p)}>{p}</button>)}
              </div>
            </div>
            <div className="f">
              <label className="fl">カテゴリ</label>
              <div className="pills">
                {CATEGORIES.map(c => <button key={c} className={`pill ${form.category === c ? 'on' : ''}`} onClick={() => set('category', c)}>{c}</button>)}
              </div>
            </div>
            <div className="f">
              <label className="fl">期限</label>
              <input type="date" value={form.deadline} onChange={e => set('deadline', e.target.value)} />
            </div>
            <div className="ck-item" onClick={() => set('todayFlag', !form.todayFlag)}>
              <div className={`ck-box ${form.todayFlag ? 'on' : ''}`} />
              <span className="ck-label">今日やる</span>
            </div>
            <div style={{ display:'flex',gap:8,marginTop:14 }}>
              <button className="btn btn-main" onClick={handleSave}>{editId ? '更新する' : '追加する'}</button>
              <button className="btn btn-ghost" onClick={() => { setShowAdd(false); setEditId(null); setForm(EMPTY) }}>キャンセル</button>
            </div>
          </div>
        </div>
      )}

      <div style={{ padding:'0 24px 16px',display:'flex',gap:8 }}>
        <button className={`pill ${filterToday ? 'on' : ''}`} onClick={() => setFilterToday(f => !f)}>今日だけ</button>
        <button className={`pill ${showDone ? 'on' : ''}`} onClick={() => setShowDone(f => !f)}>完了済み表示</button>
      </div>

      <div className="sec" style={{ paddingTop:0 }}>
        {active.length === 0 && !showAdd && (
          <div style={{ textAlign:'center',padding:'48px 24px' }}>
            <div style={{ fontSize:36,marginBottom:12 }}>📋</div>
            <div style={{ fontWeight:900,fontSize:16,marginBottom:6 }}>未完了のToDoはありません</div>
            <div style={{ fontSize:13,color:'var(--muted)' }}>新しいToDoを追加しよう</div>
          </div>
        )}
        {active.map(item => (
          <div key={item.id} className="card" style={{ display:'flex',gap:14,alignItems:'flex-start',marginBottom:10,borderLeft:`3px solid ${item.priority==='高'?'var(--danger)':item.priority==='中'?'var(--orange)':'var(--green)'}` }}>
            <div style={{ paddingTop:2,cursor:'pointer',flexShrink:0 }} onClick={() => toggleDone(item.id)}>
              <div className="ck-box" />
            </div>
            <div style={{ flex:1 }}>
              <div style={{ fontWeight:700,fontSize:15,letterSpacing:-0.2,marginBottom:6 }}>{item.text}</div>
              <div style={{ display:'flex',gap:6,flexWrap:'wrap' }}>
                <span className={`badge ${P_BADGE[item.priority]}`}>{item.priority}</span>
                <span className="badge b-navy">{item.category}</span>
                {item.todayFlag && <span className="badge b-orange">今日</span>}
                {item.deadline && <span className="badge" style={{ background:'#F0EDE7',color:'var(--muted)' }}>{item.deadline}</span>}
              </div>
            </div>
            <div style={{ display:'flex',flexDirection:'column',gap:6,flexShrink:0 }}>
              <button className="btn btn-sm btn-outline" onClick={() => { setForm({ text:item.text,priority:item.priority,category:item.category,deadline:item.deadline||'',todayFlag:item.todayFlag||false }); setEditId(item.id); setShowAdd(true) }}>編集</button>
              <button className="btn btn-sm btn-danger" onClick={() => del(item.id)}>削除</button>
            </div>
          </div>
        ))}

        {showDone && done.length > 0 && (
          <>
            <div style={{ height:1,background:'#EDE9E0',margin:'16px 0' }} />
            <div className="sec-title">完了済み</div>
            {done.map(item => (
              <div key={item.id} className="card" style={{ display:'flex',gap:14,alignItems:'flex-start',marginBottom:10,opacity:0.6 }}>
                <div style={{ paddingTop:2,cursor:'pointer',flexShrink:0 }} onClick={() => toggleDone(item.id)}>
                  <div className="ck-box on" />
                </div>
                <div style={{ flex:1 }}>
                  <div style={{ fontWeight:700,fontSize:15,textDecoration:'line-through',color:'#BBB' }}>{item.text}</div>
                  <div style={{ display:'flex',gap:6,marginTop:4 }}>
                    <span className={`badge ${P_BADGE[item.priority]}`}>{item.category}</span>
                  </div>
                </div>
                <button className="btn btn-sm btn-danger" onClick={() => del(item.id)}>削除</button>
              </div>
            ))}
          </>
        )}
      </div>
    </div>
  )
}
