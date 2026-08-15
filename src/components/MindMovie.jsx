import { useState, useEffect, useRef } from 'react'
import { saveVideoBlob, getVideoBlob, deleteVideoBlob } from '../utils/videoDB'

const VIDEO_KEY = 'mindMovie'

export default function MindMovie() {
  const [blobUrl, setBlobUrl] = useState(null)
  const [loading, setLoading] = useState(true)
  const [uploading, setUploading] = useState(false)
  const videoRef = useRef(null)
  const inputRef = useRef(null)

  useEffect(() => {
    let url
    getVideoBlob(VIDEO_KEY).then(blob => {
      if (blob) {
        url = URL.createObjectURL(blob)
        setBlobUrl(url)
      }
      setLoading(false)
    }).catch(() => setLoading(false))
    return () => { if (url) URL.revokeObjectURL(url) }
  }, [])

  const handleFile = async (e) => {
    const file = e.target.files?.[0]
    if (!file) return
    setUploading(true)
    try {
      await saveVideoBlob(VIDEO_KEY, file)
      if (blobUrl) URL.revokeObjectURL(blobUrl)
      const url = URL.createObjectURL(file)
      setBlobUrl(url)
    } finally {
      setUploading(false)
    }
  }

  const handleDelete = async () => {
    await deleteVideoBlob(VIDEO_KEY)
    if (blobUrl) URL.revokeObjectURL(blobUrl)
    setBlobUrl(null)
  }

  if (loading) return null

  return (
    <div style={{
      background: 'linear-gradient(135deg,#0d1225,#1a2040)',
      borderRadius: 20, overflow: 'hidden',
      border: '1px solid rgba(255,255,255,0.08)',
      marginBottom: 0,
    }}>
      {/* タイトルバー */}
      <div style={{ display:'flex', alignItems:'center', justifyContent:'space-between', padding:'14px 18px 10px' }}>
        <div>
          <div style={{ fontSize:9, fontWeight:900, letterSpacing:'0.2em', color:'rgba(255,255,255,0.4)', textTransform:'uppercase' }}>MIND MOVIE</div>
          <div style={{ fontSize:15, fontWeight:800, color:'#fff', marginTop:2 }}>マインドムービー</div>
        </div>
        <div style={{ display:'flex', gap:8 }}>
          <button
            onClick={() => inputRef.current?.click()}
            disabled={uploading}
            style={{
              padding:'7px 14px', borderRadius:20, border:'1.5px solid rgba(255,255,255,0.2)',
              background:'rgba(255,255,255,0.08)', color:'rgba(255,255,255,0.8)',
              fontSize:11, fontWeight:800, cursor:'pointer', fontFamily:'var(--font)',
            }}
          >
            {uploading ? '保存中…' : blobUrl ? '🔄 変更' : '📁 動画を選択'}
          </button>
          {blobUrl && (
            <button
              onClick={handleDelete}
              style={{
                padding:'7px 12px', borderRadius:20, border:'1.5px solid rgba(255,80,80,0.4)',
                background:'rgba(255,80,80,0.1)', color:'rgba(255,120,120,0.9)',
                fontSize:11, fontWeight:800, cursor:'pointer', fontFamily:'var(--font)',
              }}
            >削除</button>
          )}
        </div>
      </div>

      <input ref={inputRef} type="file" accept="video/*" onChange={handleFile} style={{ display:'none' }} />

      {blobUrl ? (
        <video
          ref={videoRef}
          src={blobUrl}
          controls
          playsInline
          style={{ width:'100%', display:'block', maxHeight:280, background:'#000', objectFit:'contain' }}
        />
      ) : (
        <div
          onClick={() => inputRef.current?.click()}
          style={{
            padding:'40px 20px', textAlign:'center', cursor:'pointer',
            borderTop:'1px solid rgba(255,255,255,0.06)',
          }}
        >
          <div style={{ fontSize:40, marginBottom:12 }}>🎬</div>
          <div style={{ fontSize:14, fontWeight:700, color:'rgba(255,255,255,0.5)', marginBottom:6 }}>
            マインドムービーをアップロード
          </div>
          <div style={{ fontSize:11, color:'rgba(255,255,255,0.3)', lineHeight:1.6 }}>
            タップして動画ファイルを選択<br />
            （MP4, MOV など）
          </div>
        </div>
      )}
    </div>
  )
}
