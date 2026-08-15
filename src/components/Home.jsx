import { useState, useEffect } from 'react'
import {
  getTodayRecord, getStreak, getPerfectCount,
  getGachaTickets,
  formatDate, getToday, getTodos, saveTodos, addTodo,
  getTotalDays, getMonthlyGoals, saveMonthlyGoals,
} from '../utils/storage'
import { toast } from './Toast'
import AuraCharacter from './AuraCharacter'
import PremiumGacha from './PremiumGacha'

/* ─── 成功者のマインド７箇条 ─── */
const MIND_7 = [
  { n:1, icon:'🎯', title:'自己責任',    body:'全ての結果は、自分が選んだ行動の積み重ね。環境のせいにしない。' },
  { n:2, icon:'⏳', title:'長期思考',    body:'今日の1%が3年後を決める。焦らず積み上げる人が勝つ。' },
  { n:3, icon:'💬', title:'アウトプット', body:'学んだことを話し、書き、行動に変える。それだけで人と差がつく。' },
  { n:4, icon:'🤝', title:'与える力',    body:'先に与える人に、人とお金は集まる。見返りを求めない与え方。' },
  { n:5, icon:'💪', title:'健康が基盤',  body:'睡眠・食事・運動。整った体が、最高のパフォーマンスを生む。' },
  { n:6, icon:'🧘', title:'感情制御',    body:'感情ではなく意図で動く。怒りの前に3秒だけ止まれ。' },
  { n:7, icon:'🔥', title:'継続の力',    body:'才能は継続に勝てない。60点でいいから、毎日続けることが奇跡を起こす。' },
]

function MindSet7() {
  const [open, setOpen] = useState(null)

  return (
    <div style={{ margin:'0 20px 24px' }}>
      <div style={{ fontSize:11, fontWeight:900, letterSpacing:'0.18em', color:'var(--orange)', textTransform:'uppercase', marginBottom:12 }}>
        ✦ 成功者のマインド７箇条
      </div>
      <div style={{ display:'flex', flexDirection:'column', gap:8 }}>
        {MIND_7.map(m => (
          <div key={m.n}
            onClick={() => setOpen(open === m.n ? null : m.n)}
            style={{
              background: open === m.n ? 'linear-gradient(135deg,#0d1225,#1a2040)' : '#fff',
              borderRadius: 14,
              border: open === m.n ? '1.5px solid rgba(255,150,50,0.3)' : '1.5px solid var(--border)',
              padding: open === m.n ? '14px 16px 16px' : '13px 16px',
              cursor: 'pointer',
              transition: 'all 0.25s',
              boxShadow: open === m.n ? '0 4px 20px rgba(0,0,0,0.15)' : 'none',
            }}>
            <div style={{ display:'flex', alignItems:'center', gap:12 }}>
              <div style={{
                width:36, height:36, borderRadius:10, flexShrink:0,
                background: open === m.n ? 'rgba(242,153,74,0.2)' : 'var(--cream)',
                display:'flex', alignItems:'center', justifyContent:'center', fontSize:18,
              }}>{m.icon}</div>
              <div style={{ flex:1 }}>
                <div style={{ fontSize:9, fontWeight:800, letterSpacing:2, color: open === m.n ? 'rgba(255,255,255,0.4)' : 'var(--muted)', marginBottom:2 }}>
                  0{m.n}
                </div>
                <div style={{ fontSize:15, fontWeight:900, color: open === m.n ? '#fff' : 'var(--ink)', letterSpacing:-0.3 }}>
                  {m.title}
                </div>
              </div>
              <span style={{ fontSize:11, color: open === m.n ? 'rgba(255,255,255,0.3)' : 'var(--muted)', fontWeight:700 }}>
                {open === m.n ? '▲' : '▼'}
              </span>
            </div>
            {open === m.n && (
              <div style={{ marginTop:12, fontSize:13, color:'rgba(255,255,255,0.75)', lineHeight:1.7, borderTop:'1px solid rgba(255,255,255,0.08)', paddingTop:12 }}>
                {m.body}
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

      {/* 成功者のマインド７箇条 */}
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
