import { useState, useEffect, useRef } from 'react'
import {
  getTodayRecord, updateTodayRecord, calcDayProgress, getStreak, getPerfectCount,
  getPerfectDayStatus, getGachaTickets,
  formatDate, getToday, getQuotes, getDailyQuote, saveQuotes,
  getAttitudeOptions, RARE_ATTITUDES, getTodos, saveTodos, addTodo,
} from '../utils/storage'
import { toast } from './Toast'
import confetti from 'canvas-confetti'
import AuraCharacter from './AuraCharacter'
import PremiumGacha from './PremiumGacha'

/* ─── Quote Banner ─── */
function QuoteBanner() {
  const [quotes] = useState(getQuotes)
  const [idx, setIdx] = useState(() => {
    const stored = localStorage.getItem('quoteIdx')
    return stored ? parseInt(stored) : Math.floor((Date.now() / 86400000)) % (getQuotes().length || 1)
  })
  const [fav, setFav] = useState(false)

  const q = quotes[idx] || quotes[0]

  const refresh = () => {
    const next = (idx + 1) % quotes.length
    setIdx(next)
    localStorage.setItem('quoteIdx', next)
  }

  const toggleFav = () => {
    const updated = quotes.map((q2, i) => i === idx ? { ...q2, fav: !q2.fav } : q2)
    saveQuotes(updated)
    setFav(!fav)
    toast(fav ? 'お気に入りを解除しました' : '⭐ お気に入りに追加しました')
  }

  if (!q) return null

  return (
    <div className="quote-banner" style={{ position: 'relative' }}>
      <div style={{ fontSize: 12, fontWeight: 700, color: 'var(--orange)', letterSpacing: 1, marginBottom: 6, textTransform: 'uppercase' }}>
        Today's Words
      </div>
      <div className="quote-text">「{q.text}」</div>
      <div className="quote-author">— {q.author}</div>
      <div style={{ position: 'absolute', top: 14, right: 14, display: 'flex', gap: 6 }}>
        <button className="quote-refresh" onClick={toggleFav} title="お気に入り">
          {q.fav ? '⭐' : '☆'}
        </button>
        <button className="quote-refresh" onClick={refresh} title="次の名言">
          ↻
        </button>
      </div>
    </div>
  )
}

/* ─── Attitude Gacha ─── */
function ArikataGacha({ value, onChange }) {
  const [options] = useState(getAttitudeOptions)
  const [display, setDisplay] = useState(value || '')
  const [spinning, setSpinning] = useState(false)
  const [isRare, setIsRare] = useState(false)
  const [showEdit, setShowEdit] = useState(false)
  const [customInput, setCustomInput] = useState('')
  const ivRef = useRef(null)

  useEffect(() => { if (value) setDisplay(value) }, [value])

  const gacha = () => {
    if (spinning) return
    setSpinning(true); setIsRare(false)
    let count = 0
    const total = 22
    ivRef.current = setInterval(() => {
      const all = [...options, ...RARE_ATTITUDES]
      setDisplay(all[Math.floor(Math.random() * all.length)])
      count++
      if (count >= total) {
        clearInterval(ivRef.current)
        const rare = Math.random() < 0.15
        const pool = rare ? RARE_ATTITUDES : options
        const result = pool[Math.floor(Math.random() * pool.length)]
        setDisplay(result); setIsRare(rare)
        onChange(result); setSpinning(false)
        if (rare) {
          toast('✨ レア！特別な在り方が出た')
          confetti({ particleCount: 40, spread: 60, origin: { y: 0.6 }, colors: ['#F2994A', '#6C63FF', '#84A98C'] })
        } else {
          toast(`今日の在り方：${result}`)
        }
      }
    }, 75)
  }

  const handleCustomSet = () => {
    if (!customInput.trim()) return
    onChange(customInput.trim())
    setDisplay(customInput.trim())
    setCustomInput('')
    setShowEdit(false)
    toast('今日の在り方、決まった。')
  }

  return (
    <div className={`gacha-card ${isRare ? 'rare glow-anim' : ''}`}>
      {isRare && <div className="rare-shimmer" />}
      <div className="gacha-eyebrow">Today's Identity</div>
      <div className={`gacha-display ${spinning ? 'spin' : ''}`}>
        {display || '— 在り方を決めよう —'}
      </div>
      {isRare && <div className="gacha-rare-badge">✨ RARE</div>}

      <div className="gacha-actions">
        <button className="gacha-btn primary" onClick={gacha} disabled={spinning}>
          {spinning ? '...' : '🎲 ガチャ'}
        </button>
        <button className="gacha-btn" onClick={() => setShowEdit(s => !s)}>
          自分で書く
        </button>
      </div>

      {showEdit && (
        <div style={{ marginTop: 12, display: 'flex', gap: 8, position: 'relative', zIndex: 1 }}>
          <input
            value={customInput}
            onChange={e => setCustomInput(e.target.value)}
            onKeyDown={e => e.key === 'Enter' && handleCustomSet()}
            placeholder="今日の在り方を自分で書く"
            style={{
              flex: 1, padding: '11px 14px', borderRadius: 50,
              border: '1.5px solid rgba(255,255,255,0.2)',
              background: 'rgba(255,255,255,0.1)', color: '#fff',
              fontFamily: 'var(--font)', fontSize: 14, outline: 'none',
            }}
            autoFocus
          />
          <button
            onClick={handleCustomSet}
            style={{
              padding: '11px 16px', borderRadius: 50, border: 'none',
              background: 'var(--orange)', color: '#fff',
              fontFamily: 'var(--font)', fontSize: 13, fontWeight: 700,
              cursor: 'pointer',
            }}
          >
            決定
          </button>
        </div>
      )}
    </div>
  )
}

/* ─── Progress Ring ─── */
function ProgressRing({ pct }) {
  const r = 34, c = 2 * Math.PI * r
  const dash = c - (pct / 100) * c
  return (
    <div className="progress-ring-wrap">
      <svg width="80" height="80" viewBox="0 0 80 80">
        <circle cx="40" cy="40" r={r} fill="none" stroke="#EDE9E0" strokeWidth="6" />
        <circle
          cx="40" cy="40" r={r} fill="none"
          stroke={pct >= 100 ? 'var(--success)' : 'var(--orange)'}
          strokeWidth="6"
          strokeDasharray={c}
          strokeDashoffset={dash}
          strokeLinecap="round"
          transform="rotate(-90 40 40)"
          style={{ transition: 'stroke-dashoffset 0.7s cubic-bezier(.34,1.56,.64,1)' }}
        />
      </svg>
      <div className="progress-ring-label">
        <div className="progress-ring-pct">{pct}%</div>
        <div className="progress-ring-sub">TODAY</div>
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

/* ─── Routine Cards ─── */
function RoutineCards({ record, onNavigate }) {
  const mChecks = record?.morning?.checks || {}
  const mDone = Object.values(mChecks).filter(Boolean).length
  const mTotal = Object.keys(mChecks).length || 10

  const aChecks = record?.afternoon?.checks || {}
  const aDone = Object.values(aChecks).filter(Boolean).length
  const aTotal = Object.keys(aChecks).length || 11

  const vp = record?.morning?.valuePeople || []
  const vpDone = vp.filter(p => p.done).length

  const evDone = !!(record?.evening?.diary)
  const invDone = record?.investment?.timerDone

  const cards = [
    { icon:'☀️', name:'今日の準備', done: mDone, total: mTotal, color:'var(--orange)', nav:'morning' },
    { icon:'🌤', name:'人と向き合う', done: aDone, total: aTotal, color:'var(--green)', nav:'afternoon' },
    { icon:'💫', name:'価値を渡す', done: vpDone, total: 3, color:'var(--purple)', nav:'value' },
    { icon:'⚡', name:'90分投資', done: invDone ? 1 : 0, total: 1, color:'var(--orange)', nav:'investment' },
    { icon:'🌙', name:'今日を振り返る', done: evDone ? 1 : 0, total: 1, color:'var(--main)', nav:'evening' },
  ]

  return (
    <div className="rt-grid">
      {cards.map(c => (
        <div key={c.nav} className="rt-card" onClick={() => onNavigate(c.nav === 'morning' || c.nav === 'afternoon' || c.nav === 'value' || c.nav === 'evening' ? 'routine' : 'invest', c.nav)}>
          <div className="rt-icon">{c.icon}</div>
          <div className="rt-name">{c.name}</div>
          {c.total > 1 ? (
            <>
              <div className="rt-stat">{c.done}<span>/{c.total}</span></div>
              <div className="rt-bar">
                <div className="rt-bar-fill" style={{ width: `${(c.done / c.total) * 100}%`, background: c.color }} />
              </div>
            </>
          ) : (
            <div className="rt-done-icon" style={{ background: c.done ? c.color : '#EDE9E0', color: c.done ? '#fff' : '#CCC' }}>
              {c.done ? '✓' : '○'}
            </div>
          )}
        </div>
      ))}
    </div>
  )
}

/* ─── MAIN HOME ─── */
export default function Home({ onNavigate, onSettings }) {
  const [record, setRecord] = useState(null)
  const [progress, setProgress] = useState(0)
  const [streak, setStreak] = useState(0)
  const [perfect, setPerfect] = useState(0)
  const [perfectStatus, setPerfectStatus] = useState(null)
  const [tickets, setTickets] = useState(0)
  const [showGacha, setShowGacha] = useState(false)

  useEffect(() => {
    const r = getTodayRecord()
    setRecord(r)
    setProgress(calcDayProgress(r))
    setStreak(getStreak())
    setPerfect(getPerfectCount())
    setPerfectStatus(getPerfectDayStatus(r))
    setTickets(getGachaTickets())
  }, [])

  const setArikata = (val) => {
    const updated = updateTodayRecord({ morning: { ...record?.morning, arikata: val } })
    setRecord(updated)
    setProgress(calcDayProgress(updated))
  }

  const vp = record?.morning?.valuePeople || []
  const vpDone = vp.filter(p => p.done).length

  return (
    <div className="slide-up" style={{ paddingBottom: '40px' }}>
      {/* ─── Header ─── */}
      <div className="home-header-bar">
        <div className="home-date-block">
          <div className="home-date">{formatDate(getToday())}</div>
          <div className="home-appname">1% AURA ROUTINE</div>
          {streak > 0 && (
            <div className="home-streak">🔥 {streak}日連続</div>
          )}
        </div>
        <div style={{ display: 'flex', flexDirection: 'column', alignItems: 'flex-end', gap: 8 }}>
          <ProgressRing pct={progress} />
          <button
            onClick={onSettings}
            style={{ background: 'none', border: '1.5px solid var(--border)', borderRadius: 50, padding: '5px 12px', fontSize: 11, fontWeight: 700, color: 'var(--muted)', cursor: 'pointer', fontFamily: 'var(--font)' }}
          >
            ⚙ 設定
          </button>
        </div>
      </div>

      {/* ─── 今日の決意 ─── */}
      {(record?.morning?.arikata || record?.morning?.wordTheme || record?.morning?.rule) && (
        <div className="sec" style={{ paddingTop: 0 }}>
          <div className="sec-title">今日の自分</div>
          <div className="today-self-card" onClick={() => onNavigate('routine', 'morning')} style={{ cursor: 'pointer' }}>
            {record.morning.arikata && (
              <div className="today-self-row">
                <span className="today-self-key">在り方</span>
                <span className="today-self-val">{record.morning.arikata}</span>
              </div>
            )}
            {record.morning.wordTheme && (
              <div className="today-self-row">
                <span className="today-self-key">言葉</span>
                <span className="today-self-val">{record.morning.wordTheme}</span>
              </div>
            )}
            {record.morning.rule && (
              <div className="today-self-row">
                <span className="today-self-key">誓い</span>
                <span className="today-self-val">{record.morning.rule}</span>
              </div>
            )}
          </div>
        </div>
      )}

      {/* ─── MY AURA キャラクター ─── */}
      <AuraCharacter streak={streak} perfect={perfect} />

      {/* ─── Quote ─── */}
      <div className="sec">
        <QuoteBanner />
      </div>

      {/* ─── Attitude Gacha ─── */}
      <div className="sec" style={{ paddingTop: 0 }}>
        <ArikataGacha
          value={record?.morning?.arikata}
          onChange={setArikata}
        />
      </div>

      {/* ─── TODAY'S TODO ─── */}
      <div className="sec" style={{ paddingTop: 0 }}>
        <div className="sec-title">まずこれだけやろう</div>
        <HomeTodo />
      </div>

      {/* ─── Routine Progress ─── */}
      <div className="sec">
        <div className="sec-title">今日の歩み</div>
        <RoutineCards record={record} onNavigate={onNavigate} />
      </div>

      {/* ─── 完璧な日 インジケーター ─── */}
      {perfectStatus && (
        <div className="sec" style={{ paddingTop:0 }}>
          <div className="sec-title">今日の完璧チェック</div>
          <div className="card static" style={{ padding:'14px 16px' }}>
            {[
              { key:'checks',       label:'☀️ 朝の儀式（全チェック完了）' },
              { key:'eveningChecks',label:'🌙 夜のチェックリスト（全完了）' },
              { key:'invest',       label:'⚡ 自己投資90分' },
              { key:'value',        label:'💫 価値提供1人以上' },
            ].map(({ key, label }) => (
              <div key={key} style={{ display:'flex', alignItems:'center', gap:10, padding:'7px 0', borderBottom:'1px solid #F5F2ED' }}>
                <div style={{
                  width:22, height:22, borderRadius:6, flexShrink:0,
                  background: perfectStatus[key] ? 'var(--success)' : '#F0EDE7',
                  display:'flex', alignItems:'center', justifyContent:'center',
                  fontSize:11, fontWeight:900,
                  color: perfectStatus[key] ? '#fff' : '#CCC',
                }}>
                  {perfectStatus[key] ? '✓' : '○'}
                </div>
                <span style={{ fontSize:13, fontWeight:600, color: perfectStatus[key] ? 'var(--ink)' : 'var(--muted)' }}>
                  {label}
                </span>
              </div>
            ))}
            <div style={{ paddingTop:10, textAlign:'center' }}>
              {['checks','eveningChecks','invest','value'].every(k => perfectStatus[k])
                ? <div style={{ fontSize:13, fontWeight:900, color:'var(--success)' }}>🌟 完璧な日 達成！</div>
                : <div style={{ fontSize:12, color:'var(--muted)' }}>
                    あと {4 - ['checks','eveningChecks','invest','value'].filter(k => perfectStatus[k]).length} 項目で完璧な日
                  </div>
              }
            </div>
          </div>
        </div>
      )}

      {/* ─── 価値提供 ─── */}
      <div className="sec">
        <div className="sec-title">今日は誰を少し前向きにする？</div>
        <div className="card static" style={{ padding: '16px 20px' }}>
          {vp.map((p, i) => (
            <div
              key={i}
              onClick={() => onNavigate('routine', 'value')}
              style={{
                display: 'flex', alignItems: 'center', gap: 12,
                padding: '11px 0', borderBottom: i < 2 ? '1px solid #F5F2ED' : 'none',
                cursor: 'pointer',
              }}
            >
              <div style={{
                width: 28, height: 28, borderRadius: 8, flexShrink: 0,
                background: p.done ? 'var(--main)' : '#F0EDE7',
                display: 'flex', alignItems: 'center', justifyContent: 'center',
                fontSize: 11, fontWeight: 900, color: p.done ? '#fff' : '#CCC',
              }}>
                {p.done ? '✓' : i + 1}
              </div>
              <div style={{ flex: 1 }}>
                <div style={{ fontSize: 14, fontWeight: p.name ? 700 : 400, color: p.name ? 'var(--ink)' : '#CCC' }}>
                  {p.name || `${i + 1}人目（まだ未設定）`}
                </div>
                {p.valueType && <div style={{ fontSize: 11, color: 'var(--muted)', marginTop: 1 }}>{p.valueType}</div>}
              </div>
            </div>
          ))}
          <div style={{ paddingTop: 12, textAlign: 'right' }}>
            <button
              onClick={() => onNavigate('routine', 'value')}
              style={{ fontSize: 12, fontWeight: 700, color: 'var(--main)', background: 'none', border: 'none', cursor: 'pointer', fontFamily: 'var(--font)' }}
            >
              記録する →
            </button>
          </div>
        </div>
      </div>

      {/* ─── プレミアムガチャ ─── */}
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

      {/* ─── 夜の日記への導線 ─── */}
      <div className="sec">
        <div
          className="card card-cream static"
          style={{ padding: '20px 22px', cursor: 'pointer' }}
          onClick={() => onNavigate('routine', 'evening')}
        >
          <div style={{ fontSize: 11, fontWeight: 700, letterSpacing: 1.5, color: 'var(--muted)', textTransform: 'uppercase', marginBottom: 6 }}>Evening</div>
          <div style={{ fontSize: 16, fontWeight: 900, color: 'var(--ink)', letterSpacing: -0.3 }}>
            {record?.evening?.diary ? '今日の日記を見る →' : '今日を一言で振り返ろう →'}
          </div>
          {record?.evening?.diary && (
            <div style={{ marginTop: 8, fontSize: 13, color: 'var(--ink2)', lineHeight: 1.6 }}>
              {record.evening.diary}
            </div>
          )}
        </div>
      </div>
    </div>
  )
}
