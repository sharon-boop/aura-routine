import { useState, useEffect } from 'react'
import {
  getTodayRecord, getStreak, getPerfectCount,
  getGachaTickets,
  formatDate, getToday, getTodos, saveTodos, addTodo,
  getTotalDays, getMonthlyGoals, saveMonthlyGoals,
  getContactMindset, saveContactMindset,
  getSuccessMindset, saveSuccessMindset,
} from '../utils/storage'
import { toast } from './Toast'
import AuraCharacter from './AuraCharacter'
import PremiumGacha from './PremiumGacha'

/* ─── 人との接し方（編集可能）─── */
function ContactMindsetEditor() {
  const [items, setItems] = useState(() => getContactMindset())
  const [editIdx, setEditIdx] = useState(null)
  const [editVal, setEditVal] = useState('')
  const [addVal, setAddVal] = useState('')
  const [showAdd, setShowAdd] = useState(false)

  const persist = (list) => { setItems(list); saveContactMindset(list) }

  const startEdit = (i) => { setEditIdx(i); setEditVal(items[i]) }
  const commitEdit = () => {
    if (editVal.trim()) persist(items.map((it, i) => i === editIdx ? editVal.trim() : it))
    setEditIdx(null)
  }
  const deleteItem = (i) => persist(items.filter((_, idx) => idx !== i))
  const addItem = () => {
    if (!addVal.trim()) return
    persist([...items, addVal.trim()])
    setAddVal(''); setShowAdd(false)
  }

  return (
    <div style={{ margin:'0 20px 24px' }}>
      <div style={{ display:'flex', alignItems:'center', justifyContent:'space-between', marginBottom:12 }}>
        <div style={{ fontSize:11, fontWeight:900, letterSpacing:'0.18em', color:'#00BCD4', textTransform:'uppercase' }}>
          ✦ 人との接し方
        </div>
        <button onClick={() => setShowAdd(s=>!s)} style={{
          padding:'5px 12px', borderRadius:20, border:'1.5px solid #00BCD4',
          background:'rgba(0,188,212,0.1)', color:'#00BCD4',
          fontSize:11, fontWeight:800, cursor:'pointer', fontFamily:'var(--font)',
        }}>＋ 追加</button>
      </div>

      <div style={{ display:'flex', flexDirection:'column', gap:8 }}>
        {items.map((item, i) => (
          <div key={i} style={{
            background:'#fff', borderRadius:14,
            border:'1.5px solid var(--border)',
            padding:'12px 14px',
            display:'flex', alignItems:'center', gap:10,
          }}>
            <div style={{ width:28, height:28, borderRadius:8, background:'rgba(0,188,212,0.12)', display:'flex', alignItems:'center', justifyContent:'center', fontSize:13, fontWeight:900, color:'#00BCD4', flexShrink:0 }}>
              {i+1}
            </div>
            {editIdx === i ? (
              <>
                <input value={editVal} onChange={e=>setEditVal(e.target.value)}
                  onKeyDown={e=>e.key==='Enter'&&commitEdit()}
                  autoFocus
                  style={{ flex:1, padding:'6px 10px', borderRadius:8, border:'1.5px solid #00BCD4', fontFamily:'var(--font)', fontSize:14, outline:'none' }} />
                <button onClick={commitEdit} style={{ background:'#00BCD4', border:'none', borderRadius:8, padding:'6px 12px', color:'#fff', fontWeight:800, fontSize:12, cursor:'pointer', fontFamily:'var(--font)' }}>保存</button>
                <button onClick={()=>setEditIdx(null)} style={{ background:'none', border:'none', fontSize:16, cursor:'pointer', color:'var(--muted)' }}>×</button>
              </>
            ) : (
              <>
                <div style={{ flex:1, fontSize:14, fontWeight:700, color:'var(--ink)' }}>{item}</div>
                <button onClick={()=>startEdit(i)} style={{ background:'none', border:'none', fontSize:13, cursor:'pointer', color:'var(--muted)', padding:'2px 6px' }}>✏️</button>
                <button onClick={()=>deleteItem(i)} style={{ background:'none', border:'none', fontSize:13, cursor:'pointer', color:'#EF9A9A', padding:'2px 6px' }}>×</button>
              </>
            )}
          </div>
        ))}
      </div>

      {showAdd && (
        <div style={{ display:'flex', gap:8, marginTop:10 }}>
          <input value={addVal} onChange={e=>setAddVal(e.target.value)}
            onKeyDown={e=>e.key==='Enter'&&addItem()}
            placeholder="新しい接し方を入力" autoFocus
            style={{ flex:1, padding:'11px 14px', borderRadius:50, border:'1.5px solid #00BCD4', fontFamily:'var(--font)', fontSize:14, outline:'none' }} />
          <button onClick={addItem} style={{ padding:'11px 18px', borderRadius:50, border:'none', background:'#00BCD4', color:'#fff', fontWeight:900, fontSize:15, cursor:'pointer', fontFamily:'var(--font)' }}>+</button>
          <button onClick={()=>{setShowAdd(false);setAddVal('')}} style={{ padding:'11px 14px', borderRadius:50, border:'1.5px solid var(--border)', background:'none', color:'var(--muted)', fontWeight:700, cursor:'pointer', fontFamily:'var(--font)' }}>×</button>
        </div>
      )}
    </div>
  )
}

/* ─── 成功者のマインド（編集可能）─── */
function MindSet7() {
  const [items, setItems] = useState(() => getSuccessMindset())
  const [open, setOpen] = useState(null)
  const [editIdx, setEditIdx] = useState(null)
  const [editBuf, setEditBuf] = useState({})

  const persist = (list) => { setItems(list); saveSuccessMindset(list) }

  const startEdit = (e, i) => {
    e.stopPropagation()
    setEditIdx(i)
    setEditBuf({ ...items[i] })
    setOpen(i)
  }
  const commitEdit = (e) => {
    e.stopPropagation()
    if (editBuf.title?.trim()) persist(items.map((it, i) => i === editIdx ? { ...editBuf } : it))
    setEditIdx(null)
  }
  const addItem = () => {
    const newItem = { id: Date.now(), icon:'✨', title:'新しい箇条', body:'内容を編集してください' }
    const next = [...items, newItem]
    persist(next)
    setEditIdx(next.length - 1)
    setEditBuf(newItem)
    setOpen(next.length - 1)
  }
  const deleteItem = (e, i) => {
    e.stopPropagation()
    persist(items.filter((_, idx) => idx !== i))
    if (open === i) setOpen(null)
  }

  return (
    <div style={{ margin:'0 20px 24px' }}>
      <div style={{ display:'flex', alignItems:'center', justifyContent:'space-between', marginBottom:12 }}>
        <div style={{ fontSize:11, fontWeight:900, letterSpacing:'0.18em', color:'var(--orange)', textTransform:'uppercase' }}>
          ✦ 成功者のマインド
        </div>
        <button onClick={addItem} style={{
          padding:'5px 12px', borderRadius:20, border:'1.5px solid var(--orange)',
          background:'rgba(242,153,74,0.1)', color:'var(--orange)',
          fontSize:11, fontWeight:800, cursor:'pointer', fontFamily:'var(--font)',
        }}>＋ 追加</button>
      </div>

      <div style={{ display:'flex', flexDirection:'column', gap:8 }}>
        {items.map((m, i) => (
          <div key={m.id || i}
            onClick={() => editIdx !== i && setOpen(open === i ? null : i)}
            style={{
              background: open === i ? 'linear-gradient(135deg,#0d1225,#1a2040)' : '#fff',
              borderRadius:14,
              border: open === i ? '1.5px solid rgba(255,150,50,0.3)' : '1.5px solid var(--border)',
              padding: open === i ? '14px 16px 16px' : '13px 16px',
              cursor:'pointer', transition:'all 0.25s',
              boxShadow: open === i ? '0 4px 20px rgba(0,0,0,0.15)' : 'none',
            }}>
            <div style={{ display:'flex', alignItems:'center', gap:12 }}>
              <div style={{
                width:36, height:36, borderRadius:10, flexShrink:0,
                background: open === i ? 'rgba(242,153,74,0.2)' : 'var(--cream)',
                display:'flex', alignItems:'center', justifyContent:'center', fontSize:18,
              }}>{editIdx===i ? (
                <input value={editBuf.icon||''} onChange={e=>setEditBuf(b=>({...b,icon:e.target.value}))}
                  onClick={e=>e.stopPropagation()}
                  style={{ width:30, textAlign:'center', background:'none', border:'none', fontSize:18, outline:'none' }} maxLength={2} />
              ) : m.icon}</div>
              <div style={{ flex:1 }}>
                <div style={{ fontSize:9, fontWeight:800, letterSpacing:2, color: open===i ? 'rgba(255,255,255,0.4)' : 'var(--muted)', marginBottom:2 }}>
                  {String(i+1).padStart(2,'0')}
                </div>
                {editIdx===i ? (
                  <input value={editBuf.title||''} onChange={e=>setEditBuf(b=>({...b,title:e.target.value}))}
                    onClick={e=>e.stopPropagation()}
                    style={{ fontSize:15, fontWeight:900, background:'none', border:'none', borderBottom:'1.5px solid rgba(255,150,50,0.5)', color:'#fff', outline:'none', width:'100%', fontFamily:'var(--font)' }} />
                ) : (
                  <div style={{ fontSize:15, fontWeight:900, color: open===i ? '#fff' : 'var(--ink)', letterSpacing:-0.3 }}>{m.title}</div>
                )}
              </div>
              <button onClick={e=>startEdit(e,i)} style={{ background:'none', border:'none', fontSize:13, cursor:'pointer', color: open===i?'rgba(255,255,255,0.4)':'var(--muted)', padding:'2px 4px' }}>✏️</button>
              <button onClick={e=>deleteItem(e,i)} style={{ background:'none', border:'none', fontSize:13, cursor:'pointer', color: open===i?'rgba(255,100,100,0.6)':'#EF9A9A', padding:'2px 4px' }}>×</button>
            </div>
            {open === i && (
              <div style={{ marginTop:12, borderTop:'1px solid rgba(255,255,255,0.08)', paddingTop:12 }}>
                {editIdx===i ? (
                  <>
                    <textarea value={editBuf.body||''} onChange={e=>setEditBuf(b=>({...b,body:e.target.value}))}
                      onClick={e=>e.stopPropagation()}
                      rows={3}
                      style={{ width:'100%', padding:'8px 10px', borderRadius:8, border:'1px solid rgba(255,150,50,0.3)', background:'rgba(255,255,255,0.06)', color:'rgba(255,255,255,0.85)', fontFamily:'var(--font)', fontSize:13, outline:'none', resize:'none', boxSizing:'border-box', lineHeight:1.6 }} />
                    <button onClick={commitEdit}
                      style={{ marginTop:8, padding:'8px 20px', borderRadius:20, border:'none', background:'var(--orange)', color:'#fff', fontWeight:800, fontSize:13, cursor:'pointer', fontFamily:'var(--font)' }}>
                      保存
                    </button>
                  </>
                ) : (
                  <div style={{ fontSize:13, color:'rgba(255,255,255,0.75)', lineHeight:1.7 }}>{m.body}</div>
                )}
              </div>
            )}
          </div>
        ))}
      </div>
    </div>
  )
}


/* ─── Home Todo ─── */
function HomeTodo() {
  const [todos, setTodos] = useState([])
  const [input, setInput] = useState('')
  const [showAll, setShowAll] = useState(false)

  useEffect(() => { setTodos(getTodos()) }, [])

  const todayTodos = todos.filter(t => t.todayFlag || t.priority === 'high')
  const undone = todayTodos.filter(t => !t.done)
  const done = todayTodos.filter(t => t.done)

  const handleAdd = () => {
    if (!input.trim()) return
    const item = addTodo(input.trim(), { priority: 'mid', todayFlag: true })
    setTodos(getTodos())
    setInput('')
    toast('追加した！一歩ずつ ✓')
  }

  const toggle = (id) => {
    const updated = todos.map(t => t.id === id ? { ...t, done: !t.done } : t)
    saveTodos(updated); setTodos(updated)
    const item = todos.find(t => t.id === id)
    if (!item.done) toast('完了！その調子 ✓')
  }

  const displayList = showAll ? todayTodos : undone.slice(0, 4)

  return (
    <div className="todo-home-card">
      <div className="todo-home-header">
        <div>
          <div className="todo-home-title">今日の一歩</div>
          <div style={{ fontSize: 11, color: 'var(--muted)', marginTop: 2, fontWeight: 600 }}>
            {undone.length}件 残ってる
          </div>
        </div>
        {undone.length > 0 && (
          <div className="todo-home-count">{undone.length}</div>
        )}
      </div>

      <div className="todo-quick-add">
        <input
          className="todo-quick-input"
          value={input}
          onChange={e => setInput(e.target.value)}
          onKeyDown={e => e.key === 'Enter' && handleAdd()}
          placeholder="今日やることを1つだけ書こう"
        />
        <button className="todo-quick-add-btn" onClick={handleAdd}>+</button>
      </div>

      {displayList.length === 0 && undone.length === 0 && (
        <div style={{ textAlign: 'center', padding: '16px 0', color: 'var(--muted)', fontSize: 13 }}>
          今日のタスクは全部完了！いい感じ 🎉
        </div>
      )}

      {displayList.map(item => (
        <div key={item.id} className="todo-home-item" onClick={() => toggle(item.id)}>
          <div className={`ck-box ${item.done ? 'on' : ''}`} style={{ width: 22, height: 22, borderRadius: 6 }} />
          <div className={`todo-home-text ${item.done ? 'done-t' : ''}`}>{item.text}</div>
          <div className={`todo-priority-dot ${item.priority === 'high' ? 'pd-high' : item.priority === 'mid' ? 'pd-mid' : 'pd-low'}`} />
        </div>
      ))}

      {todayTodos.length > 4 && (
        <button
          onClick={() => setShowAll(s => !s)}
          style={{ width: '100%', padding: '10px 0', fontSize: 12, fontWeight: 700, color: 'var(--muted)', background: 'none', border: 'none', cursor: 'pointer', marginTop: 4, fontFamily: 'var(--font)' }}
        >
          {showAll ? '閉じる ↑' : `あと${undone.length - 4 > 0 ? undone.length - 4 : done.length}件 →`}
        </button>
      )}
    </div>
  )
}


/* ─── 月の目標（複数リスト） ─── */
function MonthlyGoal() {
  const [goals, setGoals] = useState(() => getMonthlyGoals())
  const [input, setInput] = useState('')
  const d = new Date()
  const monthLabel = `${d.getMonth()+1}月の目標`
  const doneAll = goals.length > 0 && goals.every(g => g.done)

  const persist = (list) => { setGoals(list); saveMonthlyGoals(list) }

  const addGoal = () => {
    const t = input.trim()
    if (!t) return
    persist([...goals, { id: Date.now(), text: t, done: false }])
    setInput('')
  }

  const toggleGoal = (id) =>
    persist(goals.map(g => g.id === id ? { ...g, done: !g.done } : g))

  const deleteGoal = (id) => persist(goals.filter(g => g.id !== id))

  return (
    <div style={{
      margin: '0 20px 24px',
      background: 'linear-gradient(135deg,#0d1225 0%,#1a2040 100%)',
      borderRadius: 20,
      padding: '20px 22px',
      border: '1px solid rgba(255,255,255,0.08)',
      boxShadow: '0 8px 32px rgba(0,0,0,0.18)',
    }}>
      <div style={{ display:'flex', alignItems:'center', justifyContent:'space-between', marginBottom:14 }}>
        <div style={{ fontSize:9, fontWeight:900, letterSpacing:'0.2em', color:'rgba(255,255,255,0.4)', textTransform:'uppercase' }}>
          {monthLabel}
        </div>
        {doneAll && (
          <div style={{ fontSize:11, fontWeight:900, color:'#FFD700', letterSpacing:1 }}>✦ 全達成！</div>
        )}
      </div>

      {/* 目標リスト */}
      {goals.length === 0 ? (
        <div style={{ fontSize:14, fontWeight:700, color:'rgba(255,255,255,0.3)', marginBottom:16 }}>
          今月の目標を追加しよう
        </div>
      ) : (
        <div style={{ marginBottom:14, display:'flex', flexDirection:'column', gap:8 }}>
          {goals.map(g => (
            <div key={g.id} style={{ display:'flex', alignItems:'center', gap:10 }}>
              <button
                onClick={() => toggleGoal(g.id)}
                style={{
                  width:22, height:22, borderRadius:6, flexShrink:0,
                  background: g.done ? 'var(--orange)' : 'rgba(255,255,255,0.08)',
                  border: `1.5px solid ${g.done ? 'var(--orange)' : 'rgba(255,255,255,0.2)'}`,
                  cursor:'pointer', display:'flex', alignItems:'center', justifyContent:'center',
                  fontSize:11, color:'#fff', fontWeight:900,
                }}
              >{g.done ? '✓' : ''}</button>
              <div style={{
                flex:1, fontSize:15, fontWeight:700, lineHeight:1.4,
                color: g.done ? 'rgba(255,255,255,0.4)' : '#fff',
                textDecoration: g.done ? 'line-through' : 'none',
              }}>
                {g.text}
              </div>
              <button
                onClick={() => deleteGoal(g.id)}
                style={{
                  background:'none', border:'none', cursor:'pointer',
                  fontSize:14, color:'rgba(255,255,255,0.25)', padding:'2px 4px',
                  flexShrink:0,
                }}
              >×</button>
            </div>
          ))}
        </div>
      )}

      {/* 追加フォーム */}
      <div style={{ display:'flex', gap:8 }}>
        <input
          value={input}
          onChange={e => setInput(e.target.value)}
          onKeyDown={e => e.key === 'Enter' && addGoal()}
          placeholder="目標を追加..."
          style={{
            flex:1, padding:'10px 14px', borderRadius:50,
            border:'1.5px solid rgba(255,255,255,0.12)',
            background:'rgba(255,255,255,0.06)', color:'#fff',
            fontFamily:'var(--font)', fontSize:13, outline:'none',
          }}
        />
        <button
          onClick={addGoal}
          style={{
            background:'var(--orange)', border:'none', borderRadius:50,
            padding:'10px 16px', fontSize:14, fontWeight:900,
            color:'#fff', cursor:'pointer', fontFamily:'var(--font)', flexShrink:0,
          }}
        >+</button>
      </div>
    </div>
  )
}

/* ─── MAIN HOME ─── */
export default function Home({ onNavigate, onSettings }) {
  const [record, setRecord] = useState(null)
  const [streak, setStreak] = useState(0)
  const [perfect, setPerfect] = useState(0)
  const [totalDays, setTotalDays] = useState(0)
  const [tickets, setTickets] = useState(0)
  const [showGacha, setShowGacha] = useState(false)

  useEffect(() => {
    const r = getTodayRecord()
    setRecord(r)
    setStreak(getStreak())
    setPerfect(getPerfectCount())
    setTotalDays(getTotalDays())
    setTickets(getGachaTickets())
  }, [])

  return (
    <div className="slide-up" style={{ paddingBottom:'40px' }}>
      {/* Header */}
      <div className="home-header-bar">
        <div className="home-date-block">
          <div className="home-date">{formatDate(getToday())}</div>
          <div className="home-appname">1% AURA ROUTINE</div>
          {streak > 0 && <div className="home-streak">🔥 {streak}日連続</div>}
        </div>
        <button
          onClick={onSettings}
          style={{ background:'none', border:'1.5px solid var(--border)', borderRadius:50, padding:'6px 14px', fontSize:11, fontWeight:700, color:'var(--muted)', cursor:'pointer', fontFamily:'var(--font)', alignSelf:'flex-start', marginTop:4 }}
        >⚙ 設定</button>
      </div>

      {/* 月の目標 */}
      <MonthlyGoal />

      {/* 今日のToDo */}
      <div className="sec" style={{ paddingTop:0 }}>
        <div className="sec-title">今日のToDo</div>
        <HomeTodo />
      </div>

      {/* 人との接し方 */}
      <ContactMindsetEditor />

      {/* 成功者のマインド */}
      <MindSet7 />

      {/* ポケモンマイページ（AuraCharacter） */}
      <AuraCharacter streak={streak} perfect={perfect} totalDays={totalDays} />

      {/* ガチャバナー */}
      {tickets > 0 && (
        <div className="sec" style={{ paddingTop:0 }}>
          <div className="pg-banner" onClick={() => setShowGacha(true)}>
            <div className="pg-banner-left">
              <div className="pg-banner-title">🎰 プレミアムガチャ</div>
              <div className="pg-banner-sub">チケット {tickets}枚 所持中</div>
            </div>
            <div className="pg-banner-badge">引く →</div>
          </div>
        </div>
      )}

      {showGacha && (
        <PremiumGacha onClose={() => { setShowGacha(false); setTickets(getGachaTickets()) }} />
      )}
    </div>
  )
}
