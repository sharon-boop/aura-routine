import { useState } from 'react'
import { getTikTokMemos, saveTikTokMemo, deleteTikTokMemo } from '../utils/storage'
import { toast } from './Toast'

const STATUSES = [
  { id:'all',      label:'すべて',    color:'#666' },
  { id:'idea',     label:'💡アイデア', color:'#9C27B0' },
  { id:'draft',    label:'📝準備中',   color:'#2196F3' },
  { id:'filmed',   label:'🎬撮影済み', color:'#FF9800' },
  { id:'posted',   label:'✅投稿済み', color:'#4CAF50' },
]

const GENRES = ['ライフハック','習慣','人間観察','モチベ','日常','面白い話','学び','恋愛','ビジネス','自由']

const EMPTY_MEMO = { title:'', hook:'', script:'', bgm:'', genre:'', status:'idea', note:'' }

function StatusBadge({ status, mini }) {
  const s = STATUSES.find(s => s.id === status) || STATUSES[1]
  return (
    <span style={{
      display:'inline-block', padding: mini ? '2px 7px' : '4px 10px',
      borderRadius:20, fontSize: mini ? 10 : 11, fontWeight:800,
      background: s.color + '18', color: s.color,
      border:`1px solid ${s.color}33`
    }}>{s.label}</span>
  )
}

function MemoCard({ memo, onEdit, onDelete }) {
  const [expanded, setExpanded] = useState(false)
  return (
    <div style={{
      background:'#fff', borderRadius:16, marginBottom:12,
      boxShadow:'0 2px 12px rgba(0,0,0,0.07)',
      border:'1px solid #F0EDE7', overflow:'hidden',
    }}>
      {/* Header */}
      <div onClick={() => setExpanded(e => !e)}
        style={{ padding:'14px 16px', cursor:'pointer', display:'flex', justifyContent:'space-between', alignItems:'flex-start' }}>
        <div style={{ flex:1 }}>
          <div style={{ display:'flex', alignItems:'center', gap:8, marginBottom:5 }}>
            <StatusBadge status={memo.status} mini />
            {memo.genre && (
              <span style={{ fontSize:10, color:'var(--muted)', background:'#F5F2ED', padding:'2px 7px', borderRadius:10, fontWeight:600 }}>#{memo.genre}</span>
            )}
          </div>
          <div style={{ fontSize:15, fontWeight:800, color:'#111', lineHeight:1.3 }}>
            {memo.title || '（タイトルなし）'}
          </div>
          {memo.hook && (
            <div style={{ fontSize:12, color:'var(--muted)', marginTop:5, fontWeight:600, lineHeight:1.4 }}>
              🪝 {memo.hook.substring(0, 50)}{memo.hook.length > 50 ? '...' : ''}
            </div>
          )}
        </div>
        <span style={{ color:'var(--muted)', fontSize:14, marginLeft:8, flexShrink:0 }}>{expanded ? '▲' : '▼'}</span>
      </div>

      {/* Expanded */}
      {expanded && (
        <div style={{ borderTop:'1px solid #F5F2ED', padding:'12px 16px', display:'flex', flexDirection:'column', gap:10 }}>
          {memo.hook && (
            <div>
              <div style={{ fontSize:10, fontWeight:800, color:'#E91E63', letterSpacing:'0.1em', marginBottom:4 }}>🪝 フック（最初の3秒）</div>
              <div style={{ fontSize:13, color:'#333', lineHeight:1.6, background:'#FFF5F8', padding:'8px 12px', borderRadius:8, borderLeft:'3px solid #E91E63' }}>{memo.hook}</div>
            </div>
          )}
          {memo.script && (
            <div>
              <div style={{ fontSize:10, fontWeight:800, color:'var(--muted)', letterSpacing:'0.1em', marginBottom:4 }}>📄 台本</div>
              <div style={{ fontSize:13, color:'#444', lineHeight:1.7, whiteSpace:'pre-wrap', background:'#FAFAFA', padding:'10px 12px', borderRadius:8 }}>{memo.script}</div>
            </div>
          )}
          {memo.bgm && (
            <div style={{ fontSize:12, color:'var(--muted)', fontWeight:600 }}>🎵 BGM: {memo.bgm}</div>
          )}
          {memo.note && (
            <div style={{ fontSize:12, color:'var(--muted)', background:'#FFFDE7', padding:'8px 12px', borderRadius:8 }}>📌 {memo.note}</div>
          )}
          <div style={{ display:'flex', gap:8, paddingTop:4 }}>
            <button onClick={() => onEdit(memo)}
              style={{ flex:1, padding:'10px', borderRadius:10, background:'var(--main)', color:'#fff', border:'none', fontSize:13, fontWeight:800, cursor:'pointer', fontFamily:'var(--font)' }}>
              編集
            </button>
            <button onClick={() => onDelete(memo.id)}
              style={{ padding:'10px 16px', borderRadius:10, background:'#FFF5F5', color:'#F44336', border:'1px solid #FFCDD2', fontSize:13, fontWeight:800, cursor:'pointer', fontFamily:'var(--font)' }}>
              削除
            </button>
          </div>
        </div>
      )}
    </div>
  )
}

function MemoEditor({ memo, onSave, onCancel }) {
  const [form, setForm] = useState({ ...EMPTY_MEMO, ...memo })
  const set = (k, v) => setForm(f => ({ ...f, [k]: v }))

  return (
    <div style={{ position:'fixed', inset:0, background:'rgba(0,0,0,0.6)', zIndex:1000, display:'flex', alignItems:'flex-end', justifyContent:'center' }}>
      <div style={{ background:'#fff', borderRadius:'24px 24px 0 0', width:'100%', maxWidth:540, maxHeight:'90vh', overflowY:'auto', padding:'24px 20px 40px' }}>
        <div style={{ display:'flex', justifyContent:'space-between', alignItems:'center', marginBottom:20 }}>
          <div style={{ fontSize:17, fontWeight:900 }}>{form.id ? '台本を編集' : '台本を追加'}</div>
          <button onClick={onCancel} style={{ background:'none', border:'none', fontSize:20, cursor:'pointer', color:'var(--muted)' }}>×</button>
        </div>

        {/* Status */}
        <div style={{ marginBottom:16 }}>
          <label style={{ fontSize:11, fontWeight:800, color:'var(--muted)', letterSpacing:'0.1em', display:'block', marginBottom:6 }}>ステータス</label>
          <div style={{ display:'flex', gap:6, flexWrap:'wrap' }}>
            {STATUSES.filter(s => s.id !== 'all').map(s => (
              <button key={s.id} onClick={() => set('status', s.id)}
                style={{ padding:'6px 12px', borderRadius:20, fontSize:11, fontWeight:800, cursor:'pointer', fontFamily:'var(--font)',
                  background: form.status === s.id ? s.color : s.color + '15',
                  color: form.status === s.id ? '#fff' : s.color,
                  border: `1.5px solid ${s.color}`,
                }}>
                {s.label}
              </button>
            ))}
          </div>
        </div>

        {/* Title */}
        <div style={{ marginBottom:14 }}>
          <label style={{ fontSize:11, fontWeight:800, color:'var(--muted)', letterSpacing:'0.1em', display:'block', marginBottom:5 }}>タイトル</label>
          <input value={form.title} onChange={e => set('title', e.target.value)} placeholder="動画のタイトル"
            style={{ width:'100%', padding:'11px 14px', borderRadius:10, border:'1.5px solid var(--border)', fontFamily:'var(--font)', fontSize:14, outline:'none', boxSizing:'border-box' }} />
        </div>

        {/* Hook */}
        <div style={{ marginBottom:14 }}>
          <label style={{ fontSize:11, fontWeight:800, color:'#E91E63', letterSpacing:'0.1em', display:'block', marginBottom:5 }}>🪝 フック（最初の3秒）</label>
          <textarea value={form.hook} onChange={e => set('hook', e.target.value)}
            placeholder="例：「これ知らないと人生損するやつ」「なんでこうなるか分かる？」"
            rows={2} style={{ width:'100%', padding:'11px 14px', borderRadius:10, border:'1.5px solid #E91E6333', fontFamily:'var(--font)', fontSize:13, outline:'none', resize:'vertical', boxSizing:'border-box', background:'#FFF5F8' }} />
        </div>

        {/* Script */}
        <div style={{ marginBottom:14 }}>
          <label style={{ fontSize:11, fontWeight:800, color:'var(--muted)', letterSpacing:'0.1em', display:'block', marginBottom:5 }}>📄 台本本文</label>
          <textarea value={form.script} onChange={e => set('script', e.target.value)}
            placeholder="台本を自由に書こう。セリフ・構成・展開など"
            rows={6} style={{ width:'100%', padding:'11px 14px', borderRadius:10, border:'1.5px solid var(--border)', fontFamily:'var(--font)', fontSize:13, outline:'none', resize:'vertical', boxSizing:'border-box' }} />
        </div>

        {/* Genre + BGM */}
        <div style={{ display:'flex', gap:10, marginBottom:14 }}>
          <div style={{ flex:1 }}>
            <label style={{ fontSize:11, fontWeight:800, color:'var(--muted)', letterSpacing:'0.1em', display:'block', marginBottom:5 }}>ジャンル</label>
            <div style={{ display:'flex', gap:4, flexWrap:'wrap' }}>
              {GENRES.map(g => (
                <button key={g} onClick={() => set('genre', form.genre === g ? '' : g)}
                  style={{ padding:'4px 9px', borderRadius:12, fontSize:10, fontWeight:700, cursor:'pointer', fontFamily:'var(--font)',
                    background: form.genre === g ? 'var(--main)' : '#F5F2ED',
                    color: form.genre === g ? '#fff' : 'var(--muted)',
                    border:'none',
                  }}>
                  {g}
                </button>
              ))}
            </div>
          </div>
        </div>

        <div style={{ marginBottom:14 }}>
          <label style={{ fontSize:11, fontWeight:800, color:'var(--muted)', letterSpacing:'0.1em', display:'block', marginBottom:5 }}>🎵 BGM・音楽メモ</label>
          <input value={form.bgm} onChange={e => set('bgm', e.target.value)} placeholder="使いたいBGM名など"
            style={{ width:'100%', padding:'11px 14px', borderRadius:10, border:'1.5px solid var(--border)', fontFamily:'var(--font)', fontSize:13, outline:'none', boxSizing:'border-box' }} />
        </div>

        <div style={{ marginBottom:20 }}>
          <label style={{ fontSize:11, fontWeight:800, color:'var(--muted)', letterSpacing:'0.1em', display:'block', marginBottom:5 }}>📌 メモ・アイデア</label>
          <textarea value={form.note} onChange={e => set('note', e.target.value)}
            placeholder="撮影のポイント・改善案・気づきなど"
            rows={2} style={{ width:'100%', padding:'11px 14px', borderRadius:10, border:'1.5px solid var(--border)', fontFamily:'var(--font)', fontSize:13, outline:'none', resize:'vertical', boxSizing:'border-box' }} />
        </div>

        <button onClick={() => onSave(form)}
          style={{ width:'100%', padding:'14px', background:'#111', color:'#fff', border:'none', borderRadius:14, fontSize:15, fontWeight:900, cursor:'pointer', fontFamily:'var(--font)' }}>
          保存する
        </button>
      </div>
    </div>
  )
}

export default function TikTokMemo() {
  const [memos, setMemos] = useState(getTikTokMemos)
  const [filter, setFilter] = useState('all')
  const [editing, setEditing] = useState(null)
  const [showEditor, setShowEditor] = useState(false)

  const refresh = () => setMemos(getTikTokMemos())

  const handleSave = (form) => {
    saveTikTokMemo(form)
    refresh()
    setShowEditor(false)
    setEditing(null)
    toast(form.id ? '台本を更新しました' : '台本を追加しました 📝')
  }

  const handleDelete = (id) => {
    if (!confirm('この台本を削除しますか？')) return
    deleteTikTokMemo(id)
    refresh()
    toast('削除しました')
  }

  const handleEdit = (memo) => { setEditing(memo); setShowEditor(true) }
  const handleNew = () => { setEditing(null); setShowEditor(true) }

  const filtered = filter === 'all' ? memos : memos.filter(m => m.status === filter)

  return (
    <div className="slide-up" style={{ paddingBottom:80 }}>
      <div className="ph" style={{ background:'linear-gradient(135deg, #111 0%, #333 100%)' }}>
        <div className="ph-eyebrow" style={{ color:'rgba(255,255,255,0.6)' }}>TikTok Script</div>
        <div className="ph-title" style={{ color:'#fff' }}>台本メモ</div>
        <div className="ph-sub" style={{ color:'rgba(255,255,255,0.7)' }}>
          フックを磨け。最初の3秒が全てだ。
        </div>
      </div>

      {/* Status filter */}
      <div className="sec">
        <div style={{ display:'flex', gap:6, overflowX:'auto', paddingBottom:4 }}>
          {STATUSES.map(s => (
            <button key={s.id} onClick={() => setFilter(s.id)}
              style={{ flexShrink:0, padding:'7px 14px', borderRadius:20, fontSize:11, fontWeight:800, cursor:'pointer', fontFamily:'var(--font)',
                background: filter === s.id ? s.color : '#F5F2ED',
                color: filter === s.id ? '#fff' : 'var(--muted)',
                border:'none', transition:'all 0.2s',
              }}>
              {s.label}
              <span style={{ marginLeft:4, opacity:0.8 }}>
                {s.id === 'all' ? memos.length : memos.filter(m => m.status === s.id).length}
              </span>
            </button>
          ))}
        </div>
      </div>

      {/* Memo list */}
      <div className="sec">
        {filtered.length === 0 ? (
          <div style={{ textAlign:'center', padding:'40px 0', color:'var(--muted)' }}>
            <div style={{ fontSize:40, marginBottom:12 }}>🎬</div>
            <div style={{ fontWeight:700, marginBottom:6 }}>台本がまだありません</div>
            <div style={{ fontSize:12 }}>下の＋ボタンから追加しよう</div>
          </div>
        ) : (
          filtered.map(memo => (
            <MemoCard key={memo.id} memo={memo} onEdit={handleEdit} onDelete={handleDelete} />
          ))
        )}
      </div>

      {/* Insight */}
      <div className="sec">
        <div style={{ background:'linear-gradient(135deg,#1a1a2e,#16213e)', borderRadius:16, padding:'16px 18px', color:'#fff' }}>
          <div style={{ fontSize:11, fontWeight:800, letterSpacing:'0.12em', color:'rgba(255,255,255,0.5)', marginBottom:8 }}>💡 フック研究メモ</div>
          <div style={{ fontSize:13, color:'rgba(255,255,255,0.85)', lineHeight:1.7 }}>
            「なんでこのTikTok伸びてるんやろ」って感覚、大事にして。<br />
            人の心理・流行・違和感を拾って面白くする力があなたの武器。
          </div>
        </div>
      </div>

      {/* Add button */}
      <button onClick={handleNew}
        style={{ position:'fixed', bottom:80, right:20, width:56, height:56, borderRadius:28,
          background:'linear-gradient(135deg,#111,#333)', color:'#fff', border:'none',
          fontSize:28, cursor:'pointer', boxShadow:'0 4px 20px rgba(0,0,0,0.4)',
          display:'flex', alignItems:'center', justifyContent:'center', zIndex:100 }}>
        +
      </button>

      {showEditor && (
        <MemoEditor
          memo={editing || EMPTY_MEMO}
          onSave={handleSave}
          onCancel={() => { setShowEditor(false); setEditing(null) }}
        />
      )}
    </div>
  )
}
