import { useState, useEffect, useRef } from 'react'
import {
  getTodayRecord, updateTodayRecord,
  getChecklistTemplate, saveChecklistTemplate,
  getAttitudeOptions, RARE_ATTITUDES,
  getWordThemeOptions, getMustKeepOptions,
  getFavorites, saveFavorites,
  getUnlockedAttitudes,
} from '../utils/storage'
import { toast } from './Toast'
import confetti from 'canvas-confetti'

const MOODS = ['🔥', '😌', '😆', '😢', '😳', '😐']

/* ─── ChipSelector ─────────────────────────── */
function ChipSelector({ options, value, onChange, favKey, maxVisible = 12 }) {
  const [favs, setFavs] = useState(() => getFavorites(favKey))
  const [expanded, setExpanded] = useState(false)

  const sorted = [...new Set([...favs.filter(f => options.includes(f)), ...options])]
  const visible = expanded ? sorted : sorted.slice(0, maxVisible)
  const hasMore = sorted.length > maxVisible

  const toggleFav = (e, item) => {
    e.stopPropagation()
    const next = favs.includes(item) ? favs.filter(f => f !== item) : [...favs, item]
    setFavs(next)
    saveFavorites(favKey, next)
  }

  return (
    <div>
      <div className="chip-grid">
        {visible.map(opt => (
          <button
            key={opt}
            className={`chip ${value === opt ? 'selected' : ''} ${favs.includes(opt) && value !== opt ? 'favorited' : ''}`}
            onClick={() => onChange(opt)}
          >
            {opt}
            <span className="chip-star" onClick={e => toggleFav(e, opt)}>
              {favs.includes(opt) ? '★' : '☆'}
            </span>
          </button>
        ))}
      </div>
      {hasMore && (
        <button className="chip-more-btn" onClick={() => setExpanded(e => !e)}>
          {expanded ? '閉じる ↑' : `＋ ${sorted.length - maxVisible}件 もっと見る`}
        </button>
      )}
    </div>
  )
}

/* ─── AttitudeSection ──────────────────────── */
const MODES = ['候補', 'ガチャ', '自由記入']

function AttitudeSection({ value, onChange }) {
  const [mode, setMode] = useState('候補')
  const [options] = useState(getAttitudeOptions)
  const [display, setDisplay] = useState(value || '')
  const [spinning, setSpinning] = useState(false)
  const [isRare, setIsRare] = useState(false)
  const [customVal, setCustomVal] = useState('')
  const ivRef = useRef(null)

  useEffect(() => { setDisplay(value || '') }, [value])
  useEffect(() => () => clearInterval(ivRef.current), [])

  const spin = () => {
    if (spinning) return
    setSpinning(true); setIsRare(false)
    let count = 0
    const unlocked = getUnlockedAttitudes()
    const normalPool = [...options, ...unlocked]
    const all = [...normalPool, ...RARE_ATTITUDES]
    ivRef.current = setInterval(() => {
      setDisplay(all[Math.floor(Math.random() * all.length)])
      count++
      if (count >= 20) {
        clearInterval(ivRef.current)
        const rare = Math.random() < 0.15
        const pool = rare ? RARE_ATTITUDES : normalPool
        const result = pool[Math.floor(Math.random() * pool.length)]
        setDisplay(result); setIsRare(rare); setSpinning(false)
        onChange(result)
        if (rare) {
          toast('✦ RARE — 特別な在り方')
          setTimeout(() => confetti({
            particleCount: 55, spread: 65, origin: { y: 0.6 },
            colors: ['#E85D2A', '#F7D87C', '#A7B7A5'], scalar: 0.85,
          }), 100)
        } else {
          toast(`「${result}」`)
        }
      }
    }, 72)
  }

  const handleCustom = () => {
    if (!customVal.trim()) return
    onChange(customVal.trim()); setDisplay(customVal.trim())
    toast('今日の雰囲気は、自分で作れる。')
    setCustomVal('')
  }

  const selectChip = (val) => { onChange(val); setDisplay(val); toast(`「${val}」`) }
  const hasValue = display && display.length > 1

  return (
    <div className="attitude-section">
      <div className="att-header">
        <div className="att-eyebrow">TODAY'S IDENTITY</div>
        <div className={`att-display ${spinning ? 'att-spinning' : ''} ${isRare ? 'att-rare' : ''} ${!hasValue ? 'att-placeholder' : ''}`}>
          {hasValue ? display : '在り方を決めよう'}
        </div>
        {isRare && !spinning && <div className="att-rare-badge">RARE ✦</div>}
      </div>

      <div className="att-mode-tabs">
        {MODES.map(m => (
          <button key={m} className={`att-mode-tab ${mode === m ? 'active' : ''}`} onClick={() => setMode(m)}>
            {m}
          </button>
        ))}
      </div>

      <div className="att-content">
        {mode === '候補' && (
          <ChipSelector
            options={options}
            value={value}
            onChange={selectChip}
            favKey="favoriteAttitudes"
            maxVisible={14}
          />
        )}

        {mode === 'ガチャ' && (
          <div className="gacha-area">
            <div className="gacha-desc">
              {options.length + RARE_ATTITUDES.length}個の候補からランダム選出。<br />
              15% の確率でレア在り方が登場します。
            </div>
            <button
              className={`gacha-roll-btn ${spinning ? 'rolling' : ''}`}
              onClick={spin}
              disabled={spinning}
            >
              {spinning ? '———' : '— ROLL —'}
            </button>
          </div>
        )}

        {mode === '自由記入' && (
          <div className="f">
            <label className="fl" style={{ color: 'rgba(255,255,255,0.35)' }}>今日の在り方を自分で書く</label>
            <input
              value={customVal}
              onChange={e => setCustomVal(e.target.value)}
              onKeyDown={e => e.key === 'Enter' && handleCustom()}
              placeholder="例：余裕のある男でいる"
              autoFocus
            />
            <button className="btn btn-main" style={{ marginTop: 10 }} onClick={handleCustom}>
              決定する
            </button>
          </div>
        )}
      </div>
    </div>
  )
}

/* ─── OptionSection (言葉テーマ / 守ること) ── */
function OptionSection({ eyebrow, placeholder, value, onChange, options, favKey }) {
  const displayVal = value?.trim()
  return (
    <div className="card static">
      <div className="option-eyebrow">{eyebrow}</div>
      <div className={`option-selected ${!displayVal ? 'placeholder' : ''}`}>
        {displayVal || placeholder}
      </div>
      <ChipSelector
        options={options}
        value={value}
        onChange={onChange}
        favKey={favKey}
        maxVisible={12}
      />
      <div className="f" style={{ marginTop: 16, marginBottom: 0 }}>
        <label className="fl">または自分で書く</label>
        <input
          value={value || ''}
          onChange={e => onChange(e.target.value)}
          placeholder={placeholder}
        />
      </div>
    </div>
  )
}

/* ─── AddItemInput ────────────────────────── */
function AddItemInput({ onAdd }) {
  const [open, setOpen] = useState(false)
  const [val, setVal] = useState('')
  if (!open) return (
    <button className="add-item-btn" onClick={() => setOpen(true)}>＋ 項目を追加する</button>
  )
  return (
    <div style={{ display: 'flex', gap: 8, marginTop: 8 }}>
      <input
        value={val}
        onChange={e => setVal(e.target.value)}
        onKeyDown={e => e.key === 'Enter' && val.trim() && (onAdd(val.trim()), setVal(''), setOpen(false))}
        placeholder="新しいチェック項目"
        autoFocus
        style={{ flex: 1, padding: '11px 14px', borderRadius: 'var(--r-sm)', border: '1.5px solid var(--border)', background: '#FDFBF8', fontFamily: 'var(--font)', fontSize: 14, outline: 'none' }}
      />
      <button className="btn btn-sm btn-main" style={{ width: 'auto' }}
        onClick={() => { if (val.trim()) { onAdd(val.trim()); setVal(''); setOpen(false) } }}>追加</button>
      <button className="btn btn-sm btn-ghost" style={{ width: 'auto' }}
        onClick={() => { setOpen(false); setVal('') }}>×</button>
    </div>
  )
}

/* ─── Main Component ─────────────────────── */
export default function Morning() {
  const [data, setData]     = useState(null)
  const [checks, setChecks] = useState([])
  const [anim, setAnim]     = useState({})
  const [wordThemeOpts]     = useState(getWordThemeOptions)
  const [mustKeepOpts]      = useState(getMustKeepOptions)
  const [saved, setSaved]   = useState(false)

  useEffect(() => {
    setData(getTodayRecord())
    setChecks(getChecklistTemplate('morning'))
  }, [])

  const setMorning = (partial) => {
    const updated = updateTodayRecord({ morning: { ...data.morning, ...partial } })
    setData(updated)
  }

  const toggleCheck = (key) => {
    const next = { ...data.morning.checks, [key]: !data.morning.checks[key] }
    setAnim(a => ({ ...a, [key]: true }))
    setTimeout(() => setAnim(a => ({ ...a, [key]: false })), 250)
    if (!data.morning.checks[key]) toast('✓')
    setMorning({ checks: next })
  }

  const addItem = (label) => {
    const key = `mc_${Date.now()}`
    const next = [...checks, { key, label }]
    setChecks(next); saveChecklistTemplate('morning', next)
    setMorning({ checks: { ...data.morning.checks, [key]: false } })
    toast('追加しました')
  }

  const removeItem = (key) => {
    const next = checks.filter(c => c.key !== key)
    setChecks(next); saveChecklistTemplate('morning', next)
    const nc = { ...data.morning.checks }; delete nc[key]
    setMorning({ checks: nc })
  }

  const handleSave = () => {
    setSaved(true)
    toast('今日の雰囲気は、自分で作れる。')
    setTimeout(() => setSaved(false), 3500)
  }

  if (!data) return null

  const dc = data.morning?.checks || {}
  const done = checks.filter(c => dc[c.key]).length

  return (
    <div className="slide-up" style={{ paddingBottom: '40px' }}>

      {/* ── Header ── */}
      <div className="ph">
        <div className="ph-eyebrow">Routine — Morning</div>
        <div className="ph-title">今日の自分を作る</div>
        <div className="ph-sub">「気分で生きるんじゃなく、今日の自分を先に決める。」</div>
        <div style={{ marginTop: 22, display: 'flex', alignItems: 'center', gap: 14 }}>
          <div style={{ fontSize: 11, fontWeight: 600, color: 'var(--muted)', letterSpacing: '0.08em', minWidth: 64 }}>
            {done}/{checks.length} 完了
          </div>
          <div className="pb-wrap" style={{ flex: 1, height: 2 }}>
            <div className="pb-fill" style={{ width: `${checks.length ? (done / checks.length) * 100 : 0}%`, background: 'var(--main)', height: '100%' }} />
          </div>
        </div>
      </div>

      {/* ── 在り方 ── */}
      <div className="sec">
        <div className="sec-title">今日の在り方</div>
        <AttitudeSection
          value={data.morning?.arikata}
          onChange={val => setMorning({ arikata: val })}
        />
      </div>

      {/* ── 言葉テーマ ── */}
      <div className="sec">
        <div className="sec-title">言葉テーマ</div>
        <OptionSection
          eyebrow="TODAY'S WORD THEME"
          placeholder="今日、意識する言葉の使い方"
          value={data.morning?.wordTheme}
          onChange={val => setMorning({ wordTheme: val })}
          options={wordThemeOpts}
          favKey="favoriteWordThemes"
        />
      </div>

      {/* ── 守ること ── */}
      <div className="sec">
        <div className="sec-title">今日の誓い</div>
        <OptionSection
          eyebrow="TODAY'S RULE"
          placeholder="今日、絶対に守ること"
          value={data.morning?.rule}
          onChange={val => setMorning({ rule: val })}
          options={mustKeepOpts}
          favKey="favoriteMustKeeps"
        />
      </div>

      {/* ── 気分 ── */}
      <div className="sec">
        <div className="sec-title">今朝の気分</div>
        <div className="card static">
          <div style={{ display: 'flex', gap: 10 }}>
            {MOODS.map(m => (
              <button key={m}
                onClick={() => { updateTodayRecord({ mood: m }); setData(d => ({ ...d, mood: m })); toast(`${m}`) }}
                style={{
                  width: 46, height: 46, borderRadius: 12,
                  border: `2px solid ${data.mood === m ? 'var(--main)' : 'var(--border)'}`,
                  background: data.mood === m ? 'var(--main)' : '#fff',
                  fontSize: 22, cursor: 'pointer',
                  display: 'flex', alignItems: 'center', justifyContent: 'center',
                  transition: 'all 0.2s',
                  transform: data.mood === m ? 'scale(1.1)' : 'scale(1)',
                }}>
                {m}
              </button>
            ))}
          </div>
        </div>
      </div>

      {/* ── チェックリスト ── */}
      <div className="sec">
        <div className="sec-title">朝の儀式</div>
        <div className="card static">
          {checks.map(c => {
            const isCustom = c.key.startsWith('mc_')
            return (
              <div key={c.key} className="ck-item" onClick={() => toggleCheck(c.key)}>
                <div className={`ck-box ${dc[c.key] ? 'on' : ''} ${anim[c.key] ? 'ck-pop' : ''}`} />
                <span className={`ck-label ${dc[c.key] ? 'done' : ''}`}>{c.label}</span>
                {isCustom && (
                  <button className="ck-del" onClick={e => { e.stopPropagation(); removeItem(c.key) }}>×</button>
                )}
              </div>
            )
          })}
          <AddItemInput onAdd={addItem} />
        </div>
      </div>

      {/* ── 価値を渡す3人 ── */}
      <div className="sec">
        <div className="sec-title">今日、価値を渡す3人</div>
        {(data.morning?.valuePeople || []).map((p, i) => (
          <div key={i} className="pcard">
            <div className="pnum">PERSON {i + 1}</div>
            <div className="f" style={{ marginBottom: 0 }}>
              <label className="fl">名前</label>
              <input
                value={p.name}
                onChange={e => {
                  const vp = [...data.morning.valuePeople]
                  vp[i] = { ...vp[i], name: e.target.value }
                  setMorning({ valuePeople: vp })
                }}
                placeholder={`${i + 1}人目の名前`}
              />
            </div>
          </div>
        ))}
      </div>

      {/* ── 保存 ── */}
      <div className="sec">
        {saved ? (
          <div style={{ textAlign: 'center', padding: '28px 0' }}>
            <div style={{ fontSize: 10, fontWeight: 600, letterSpacing: '0.2em', color: 'var(--muted)', textTransform: 'uppercase', marginBottom: 12 }}>Saved ✓</div>
            <div style={{ fontSize: 22, fontWeight: 800, letterSpacing: '-0.02em', color: 'var(--ink)', lineHeight: 1.3 }}>今日の雰囲気は、<br />自分で作れる。</div>
          </div>
        ) : (
          <button className="btn btn-main" onClick={handleSave}>
            今日の自分をセットする
          </button>
        )}
      </div>
    </div>
  )
}
