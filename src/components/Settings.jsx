import { useState, useEffect } from 'react'
import {
  getSettings, saveSettings, saveTheme,
  getAttitudeOptions, saveAttitudeOptions, DEFAULT_ATTITUDES, RARE_ATTITUDES,
  getQuotes, saveQuotes, DEFAULT_QUOTES,
  getChecklistTemplate, saveChecklistTemplate, DEFAULT_CHECKLISTS,
  getLogIdeas, saveLogIdeas, DEFAULT_WEEKLY_IDEAS, DEFAULT_MONTHLY_IDEAS,
  getWordThemeOptions, saveWordThemeOptions, DEFAULT_WORD_THEMES,
  getMustKeepOptions, saveMustKeepOptions, DEFAULT_MUST_KEEPS,
} from '../utils/storage'
import { toast } from './Toast'

/* ─── Theme Picker ─── */
const THEMES = [
  { id: 'cream-street', name: 'Cream Street', desc: '明るいクリーム×青緑', swatches: ['#F7F1E8', '#2F4858', '#F2994A'] },
  { id: 'city-cool',    name: 'City Cool',    desc: '白×グレー×ネイビー', swatches: ['#F5F5F5', '#1A1A2E', '#6C63FF'] },
  { id: 'warm-orange',  name: 'Warm Orange',  desc: 'クリーム×オレンジ',  swatches: ['#FFF7EC', '#B85C1A', '#E8813A'] },
  { id: 'soft-green',   name: 'Soft Green',   desc: '白×くすみグリーン', swatches: ['#F0F7F0', '#2D5A3D', '#84A98C'] },
  { id: 'minimal-black',name: 'Minimal Black',desc: '白×黒×アクセント', swatches: ['#FAFAFA', '#111111', '#F2994A'] },
]

function ThemeSection() {
  const [current, setCurrent] = useState(() => getSettings().theme || 'cream-street')

  const select = (id) => {
    setCurrent(id)
    saveTheme(id)
    document.documentElement.setAttribute('data-theme', id === 'cream-street' ? '' : id)
    toast('テーマを変更しました')
  }

  return (
    <div>
      <div className="sec-title">テーマカラー</div>
      <div className="theme-grid">
        {THEMES.map(t => (
          <div
            key={t.id}
            className={`theme-option ${current === t.id ? 'selected' : ''}`}
            onClick={() => select(t.id)}
          >
            <div className="theme-swatch">
              {t.swatches.map((c, i) => (
                <div key={i} className="theme-dot" style={{ background: c }} />
              ))}
            </div>
            <div className="theme-name">{t.name}</div>
            <div className="theme-desc">{t.desc}</div>
          </div>
        ))}
      </div>
    </div>
  )
}

/* ─── Editable List ─── */
function EditableList({ items, setItems, placeholder = '新しい項目', addLabel = '+ 追加', onDefault }) {
  const [input, setInput] = useState('')
  const [editIdx, setEditIdx] = useState(null)
  const [editVal, setEditVal] = useState('')

  const handleAdd = () => {
    if (!input.trim()) return
    setItems([...items, input.trim()])
    setInput('')
    toast('追加しました')
  }

  const handleDelete = (i) => {
    setItems(items.filter((_, idx) => idx !== i))
    toast('削除しました')
  }

  const handleEditSave = (i) => {
    if (!editVal.trim()) return
    setItems(items.map((v, idx) => idx === i ? editVal.trim() : v))
    setEditIdx(null)
    toast('変更しました')
  }

  return (
    <div>
      {items.map((item, i) => (
        <div key={i} className="edit-list-item">
          {editIdx === i ? (
            <>
              <input
                value={editVal}
                onChange={e => setEditVal(e.target.value)}
                onKeyDown={e => e.key === 'Enter' && handleEditSave(i)}
                style={{ flex: 1, padding: '8px 12px', borderRadius: 50, border: '1.5px solid var(--main)', fontFamily: 'var(--font)', fontSize: 14, outline: 'none' }}
                autoFocus
              />
              <button className="btn btn-sm btn-main" onClick={() => handleEditSave(i)} style={{ width: 'auto' }}>保存</button>
              <button className="btn btn-sm btn-ghost" onClick={() => setEditIdx(null)} style={{ width: 'auto' }}>×</button>
            </>
          ) : (
            <>
              <div className="edit-list-text">{item}</div>
              <button className="btn btn-xs btn-ghost" onClick={() => { setEditIdx(i); setEditVal(item) }} style={{ width: 'auto' }}>編集</button>
              <button className="btn btn-xs btn-danger" onClick={() => handleDelete(i)} style={{ width: 'auto' }}>削除</button>
            </>
          )}
        </div>
      ))}

      <div style={{ display: 'flex', gap: 8, marginTop: 12 }}>
        <input
          value={input}
          onChange={e => setInput(e.target.value)}
          onKeyDown={e => e.key === 'Enter' && handleAdd()}
          placeholder={placeholder}
          style={{ flex: 1, padding: '11px 16px', borderRadius: 50, border: '1.5px solid #E8E4DC', background: '#FDFBF8', fontFamily: 'var(--font)', fontSize: 14, outline: 'none' }}
        />
        <button className="btn btn-main btn-sm" onClick={handleAdd} style={{ width: 'auto' }}>{addLabel}</button>
      </div>

      {onDefault && (
        <button
          onClick={onDefault}
          style={{ marginTop: 10, width: '100%', padding: '10px', fontSize: 12, fontWeight: 700, color: 'var(--muted)', background: 'none', border: '1.5px dashed #DDD', borderRadius: 50, cursor: 'pointer', fontFamily: 'var(--font)' }}
        >
          初期状態に戻す
        </button>
      )}
    </div>
  )
}

/* ─── Attitude Section ─── */
function AttitudeSection() {
  const [items, setItems] = useState(getAttitudeOptions)

  const persist = (list) => { setItems(list); saveAttitudeOptions(list) }

  return (
    <div>
      <div className="sec-title">在り方の候補</div>
      <div className="card static">
        <div style={{ fontSize: 12, color: 'var(--muted)', marginBottom: 14, lineHeight: 1.6 }}>
          ガチャで選ばれる「在り方」の候補一覧です。自由に追加・編集・削除できます。
        </div>
        <EditableList
          items={items}
          setItems={persist}
          placeholder="新しい在り方を入力"
          onDefault={() => { persist([...DEFAULT_ATTITUDES]); toast('初期状態に戻しました') }}
        />
      </div>
      <div className="card static" style={{ marginTop: 8 }}>
        <div style={{ fontSize: 11, fontWeight: 700, color: 'var(--orange)', letterSpacing: 1, marginBottom: 8, textTransform: 'uppercase' }}>✨ レア（15%の確率で出現）</div>
        {RARE_ATTITUDES.map((r, i) => (
          <div key={i} style={{ fontSize: 13, padding: '6px 0', borderBottom: i < RARE_ATTITUDES.length - 1 ? '1px solid #F5F2ED' : 'none', color: 'var(--ink2)' }}>
            {r}
          </div>
        ))}
      </div>
    </div>
  )
}

/* ─── Quote Section ─── */
function QuoteSection() {
  const [quotes, setQuotes] = useState(getQuotes)
  const [input, setInput] = useState('')
  const [inputAuthor, setInputAuthor] = useState('')
  const [editId, setEditId] = useState(null)

  const persist = (list) => { setQuotes(list); saveQuotes(list) }

  const handleAdd = () => {
    if (!input.trim()) return
    const next = [...quotes, { id: Date.now(), text: input.trim(), author: inputAuthor.trim() || '名言風', fav: false }]
    persist(next)
    setInput(''); setInputAuthor('')
    toast('名言を追加しました')
  }

  const handleDelete = (id) => { persist(quotes.filter(q => q.id !== id)); toast('削除しました') }
  const toggleFav = (id) => persist(quotes.map(q => q.id === id ? { ...q, fav: !q.fav } : q))

  return (
    <div>
      <div className="sec-title">名言の管理</div>
      {quotes.map(q => (
        <div key={q.id} style={{ background: '#fff', border: '1px solid var(--border)', borderRadius: 'var(--r-sm)', padding: '14px 16px', marginBottom: 8 }}>
          <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'flex-start', gap: 10 }}>
            <div style={{ flex: 1 }}>
              <div style={{ fontSize: 14, fontWeight: 600, lineHeight: 1.6 }}>「{q.text}」</div>
              <div style={{ fontSize: 11, color: 'var(--muted)', marginTop: 3 }}>— {q.author}</div>
            </div>
            <div style={{ display: 'flex', gap: 6, flexShrink: 0 }}>
              <button className="btn btn-xs btn-ghost" onClick={() => toggleFav(q.id)} style={{ width: 'auto' }}>{q.fav ? '⭐' : '☆'}</button>
              <button className="btn btn-xs btn-danger" onClick={() => handleDelete(q.id)} style={{ width: 'auto' }}>削除</button>
            </div>
          </div>
        </div>
      ))}

      <div className="card static" style={{ marginTop: 8 }}>
        <div style={{ fontWeight: 700, fontSize: 13, marginBottom: 12 }}>名言を追加する</div>
        <div className="f">
          <label className="fl">言葉</label>
          <input value={input} onChange={e => setInput(e.target.value)} placeholder="言葉を入力" />
        </div>
        <div className="f">
          <label className="fl">出典・著者</label>
          <input value={inputAuthor} onChange={e => setInputAuthor(e.target.value)} placeholder="例：イチロー / 名言風" />
        </div>
        <button className="btn btn-main" onClick={handleAdd}>追加する</button>
      </div>

      <button
        onClick={() => { persist([...DEFAULT_QUOTES]); toast('初期状態に戻しました') }}
        style={{ marginTop: 8, width: '100%', padding: '12px', fontSize: 12, fontWeight: 700, color: 'var(--muted)', background: 'none', border: '1.5px dashed #DDD', borderRadius: 50, cursor: 'pointer', fontFamily: 'var(--font)' }}
      >
        初期状態に戻す
      </button>
    </div>
  )
}

/* ─── Checklist Editor ─── */
function ChecklistEditor({ category, label }) {
  const [items, setItems] = useState(() => getChecklistTemplate(category))
  const [input, setInput] = useState('')

  const persist = (list) => {
    setItems(list)
    saveChecklistTemplate(category, list)
  }

  const add = () => {
    if (!input.trim()) return
    const key = `custom_${Date.now()}`
    persist([...items, { key, label: input.trim() }])
    setInput('')
    toast('項目を追加しました')
  }

  const remove = (key) => {
    persist(items.filter(i => i.key !== key))
    toast('削除しました')
  }

  const rename = (key, newLabel) => {
    persist(items.map(i => i.key === key ? { ...i, label: newLabel } : i))
  }

  return (
    <div style={{ marginBottom: 20 }}>
      <div style={{ fontSize: 13, fontWeight: 700, color: 'var(--ink)', marginBottom: 10 }}>{label}</div>
      <div className="card static">
        {items.map((item, i) => (
          <CheckItem key={item.key} item={item} onRename={rename} onRemove={remove} isLast={i === items.length - 1} />
        ))}
        <div style={{ display: 'flex', gap: 8, marginTop: items.length ? 10 : 0 }}>
          <input
            value={input} onChange={e => setInput(e.target.value)}
            onKeyDown={e => e.key === 'Enter' && add()}
            placeholder="新しい項目を追加"
            style={{ flex: 1, padding: '10px 14px', borderRadius: 50, border: '1.5px solid #E8E4DC', background: '#FDFBF8', fontFamily: 'var(--font)', fontSize: 13, outline: 'none' }}
          />
          <button className="btn btn-sm btn-main" onClick={add} style={{ width: 'auto' }}>追加</button>
        </div>
        <button
          onClick={() => { persist(DEFAULT_CHECKLISTS[category] || []); toast('初期状態に戻しました') }}
          style={{ marginTop: 8, width: '100%', padding: '9px', fontSize: 11, fontWeight: 700, color: 'var(--muted)', background: 'none', border: '1.5px dashed #DDD', borderRadius: 50, cursor: 'pointer', fontFamily: 'var(--font)' }}
        >
          初期状態に戻す
        </button>
      </div>
    </div>
  )
}

function CheckItem({ item, onRename, onRemove, isLast }) {
  const [editing, setEditing] = useState(false)
  const [val, setVal] = useState(item.label)

  const save = () => {
    if (val.trim()) onRename(item.key, val.trim())
    setEditing(false)
  }

  return (
    <div className="edit-list-item" style={{ borderBottom: isLast ? 'none' : '1px solid #F5F2ED' }}>
      {editing ? (
        <>
          <input
            value={val} onChange={e => setVal(e.target.value)}
            onKeyDown={e => e.key === 'Enter' && save()}
            style={{ flex: 1, padding: '7px 12px', borderRadius: 50, border: '1.5px solid var(--main)', fontFamily: 'var(--font)', fontSize: 13, outline: 'none' }}
            autoFocus
          />
          <button className="btn btn-xs btn-main" onClick={save} style={{ width: 'auto' }}>保存</button>
          <button className="btn btn-xs btn-ghost" onClick={() => setEditing(false)} style={{ width: 'auto' }}>×</button>
        </>
      ) : (
        <>
          <div className="edit-list-text">{item.label}</div>
          <button className="btn btn-xs btn-ghost" onClick={() => setEditing(true)} style={{ width: 'auto' }}>編集</button>
          <button className="btn btn-xs btn-danger" onClick={() => onRemove(item.key)} style={{ width: 'auto' }}>削除</button>
        </>
      )}
    </div>
  )
}

/* ─── Log Ideas Section ─── */
function LogIdeasSection() {
  const [weeklyItems, setWeekly] = useState(() => getLogIdeas('weekly', DEFAULT_WEEKLY_IDEAS))
  const [monthlyItems, setMonthly] = useState(() => getLogIdeas('monthly', DEFAULT_MONTHLY_IDEAS))

  const persistW = (list) => { setWeekly(list); saveLogIdeas('weekly', list) }
  const persistM = (list) => { setMonthly(list); saveLogIdeas('monthly', list) }

  return (
    <div>
      <div style={{ fontWeight: 700, marginBottom: 12, fontSize: 13 }}>週1チャレンジの候補</div>
      <div className="card static" style={{ marginBottom: 16 }}>
        <EditableList
          items={weeklyItems}
          setItems={persistW}
          placeholder="週1チャレンジを追加"
          onDefault={() => { persistW([...DEFAULT_WEEKLY_IDEAS]); toast('初期状態に戻しました') }}
        />
      </div>

      <div style={{ fontWeight: 700, marginBottom: 12, fontSize: 13 }}>月1チャレンジの候補</div>
      <div className="card static">
        <EditableList
          items={monthlyItems}
          setItems={persistM}
          placeholder="月1チャレンジを追加"
          onDefault={() => { persistM([...DEFAULT_MONTHLY_IDEAS]); toast('初期状態に戻しました') }}
        />
      </div>
    </div>
  )
}

/* ─── Word Theme Section ─── */
function WordThemeSection() {
  const [items, setItems] = useState(getWordThemeOptions)
  const persist = (list) => { setItems(list); saveWordThemeOptions(list) }
  return (
    <div>
      <div className="sec-title">言葉テーマの候補</div>
      <div className="card static">
        <div style={{ fontSize: 12, color: 'var(--muted)', marginBottom: 14, lineHeight: 1.6 }}>
          Morningで選べる「言葉テーマ」の候補です。自由に追加・編集・削除できます。
        </div>
        <EditableList
          items={items}
          setItems={persist}
          placeholder="新しい言葉テーマを入力"
          onDefault={() => { persist([...DEFAULT_WORD_THEMES]); toast('初期状態に戻しました') }}
        />
      </div>
    </div>
  )
}

/* ─── Must Keep Section ─── */
function MustKeepSection() {
  const [items, setItems] = useState(getMustKeepOptions)
  const persist = (list) => { setItems(list); saveMustKeepOptions(list) }
  return (
    <div>
      <div className="sec-title">「絶対に守ること」の候補</div>
      <div className="card static">
        <div style={{ fontSize: 12, color: 'var(--muted)', marginBottom: 14, lineHeight: 1.6 }}>
          Morningで選べる「今日の誓い」の候補です。自由に追加・編集・削除できます。
        </div>
        <EditableList
          items={items}
          setItems={persist}
          placeholder="新しい項目を入力"
          onDefault={() => { persist([...DEFAULT_MUST_KEEPS]); toast('初期状態に戻しました') }}
        />
      </div>
    </div>
  )
}

/* ─── MAIN SETTINGS ─── */
const TABS = [
  { id: 'theme',     label: 'テーマ' },
  { id: 'attitudes', label: '在り方' },
  { id: 'wordtheme', label: '言葉' },
  { id: 'mustkeep',  label: '誓い' },
  { id: 'quotes',    label: '名言' },
  { id: 'checklist', label: 'チェック' },
  { id: 'logideas',  label: 'アイデア' },
]

export default function Settings({ onBack }) {
  const [tab, setTab] = useState('theme')

  return (
    <div className="slide-up" style={{ paddingBottom: 'calc(var(--nav-h) + 24px)' }}>
      <div className="ph">
        <div className="flex-between">
          <div>
            <div className="ph-eyebrow">Settings</div>
            <div className="ph-title">設定</div>
            <div className="ph-sub">自分仕様にカスタマイズする</div>
          </div>
          <button className="btn btn-sm btn-ghost" onClick={onBack} style={{ width: 'auto' }}>← 戻る</button>
        </div>
      </div>

      <div className="sub-nav">
        {TABS.map(t => (
          <button key={t.id} className={`sub-tab ${tab === t.id ? 'active' : ''}`} onClick={() => setTab(t.id)}>
            {t.label}
          </button>
        ))}
      </div>

      <div className="sec" style={{ paddingTop: 20 }}>
        {tab === 'theme'     && <ThemeSection />}
        {tab === 'attitudes' && <AttitudeSection />}
        {tab === 'wordtheme' && <WordThemeSection />}
        {tab === 'mustkeep'  && <MustKeepSection />}
        {tab === 'quotes'    && <QuoteSection />}
        {tab === 'checklist' && (
          <div>
            <ChecklistEditor category="morning"   label="☀️ 朝のチェックリスト" />
            <ChecklistEditor category="afternoon" label="🌤 昼のチェックリスト" />
          </div>
        )}
        {tab === 'logideas'  && <LogIdeasSection />}
      </div>
    </div>
  )
}
