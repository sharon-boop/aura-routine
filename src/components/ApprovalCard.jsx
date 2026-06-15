import { useState, useEffect } from 'react'
import { AURA_LEVELS, getAuraLevel, getAuraProfile } from '../utils/storage'

const LABELS = ['観察', '意味づけ', '人格承認', '次の一言']
const LABEL_COLORS = ['#64B5F6', '#81C784', '#CE93D8', '#FFB74D']

export default function ApprovalCard({ msg, comeback, xpResult, onClose }) {
  const [step, setStep] = useState(0)
  const [showXp, setShowXp] = useState(false)
  const [visible, setVisible] = useState(false)

  const profile = getAuraProfile()
  const level = getAuraLevel(profile.xp)
  const nextLv = AURA_LEVELS.find(l => l.lv === level.lv + 1)
  const xpInLevel = profile.xp - level.min
  const xpNeeded = nextLv ? nextLv.min - level.min : 1
  const pct = nextLv ? Math.min(100, (xpInLevel / xpNeeded) * 100) : 100

  const items = msg ? [msg.observe, msg.meaning, msg.identity, msg.next] : []

  useEffect(() => {
    setTimeout(() => setVisible(true), 30)
    if (comeback) return
    const t = setTimeout(() => setShowXp(true), 2800)
    return () => clearTimeout(t)
  }, [comeback])

  const handleNext = () => {
    if (step < items.length - 1) { setStep(s => s + 1); return }
    setShowXp(true)
  }

  const handleClose = () => {
    setVisible(false)
    setTimeout(onClose, 280)
  }

  if (!msg) return null

  return (
    <div
      onClick={e => e.target === e.currentTarget && handleClose()}
      style={{
        position: 'fixed', inset: 0, zIndex: 9000,
        background: visible ? 'rgba(5,8,20,0.92)' : 'rgba(5,8,20,0)',
        transition: 'background 0.3s',
        display: 'flex', alignItems: 'center', justifyContent: 'center',
        padding: '0 20px',
      }}
    >
      <div style={{
        width: '100%', maxWidth: 420,
        background: 'linear-gradient(160deg,#0d1225 0%,#1a2040 100%)',
        borderRadius: 28, overflow: 'hidden',
        border: '1px solid rgba(255,255,255,0.08)',
        boxShadow: '0 24px 80px rgba(0,0,0,0.6)',
        transform: visible ? 'translateY(0) scale(1)' : 'translateY(40px) scale(0.96)',
        opacity: visible ? 1 : 0,
        transition: 'transform 0.35s cubic-bezier(0.2,1,0.3,1), opacity 0.35s',
      }}>

        {/* Header */}
        <div style={{ padding: '22px 24px 0', display: 'flex', justifyContent: 'space-between', alignItems: 'center' }}>
          <div style={{ fontSize: 9, fontWeight: 800, letterSpacing: '0.22em', color: 'rgba(255,255,255,0.35)' }}>
            AURA SYSTEM
          </div>
          <button onClick={handleClose} style={{ background: 'none', border: 'none', color: 'rgba(255,255,255,0.35)', fontSize: 18, cursor: 'pointer', lineHeight: 1 }}>×</button>
        </div>

        {/* Comeback banner */}
        {comeback && (
          <div style={{ margin: '16px 24px 0', background: 'rgba(255,215,0,0.08)', border: '1px solid rgba(255,215,0,0.2)', borderRadius: 14, padding: '14px 16px' }}>
            <div style={{ fontSize: 15, fontWeight: 800, color: '#FFD700', marginBottom: 4 }}>{comeback.title}</div>
            <div style={{ fontSize: 13, color: 'rgba(255,255,255,0.7)', lineHeight: 1.6 }}>{comeback.sub}</div>
          </div>
        )}

        {/* Cards */}
        <div style={{ padding: '20px 24px' }}>
          <div style={{
            background: 'rgba(255,255,255,0.04)',
            border: '1px solid rgba(255,255,255,0.06)',
            borderRadius: 18,
            overflow: 'hidden',
            minHeight: 140,
          }}>
            {items.map((text, i) => (
              <div key={i} style={{
                padding: '16px 18px',
                borderBottom: i < items.length - 1 ? '1px solid rgba(255,255,255,0.05)' : 'none',
                opacity: i <= step ? 1 : 0.15,
                transform: i <= step ? 'none' : 'translateY(6px)',
                transition: `opacity 0.5s ${i * 0.08}s, transform 0.5s ${i * 0.08}s`,
              }}>
                <div style={{ fontSize: 9, fontWeight: 800, letterSpacing: '0.18em', color: LABEL_COLORS[i], marginBottom: 6 }}>
                  {LABELS[i]}
                </div>
                <div style={{ fontSize: 14, color: 'rgba(255,255,255,0.88)', lineHeight: 1.65, fontWeight: i === 2 ? 700 : 400 }}>
                  {text}
                </div>
              </div>
            ))}
          </div>
        </div>

        {/* XP bar */}
        {showXp && (
          <div style={{ padding: '0 24px', animation: 'fadeUp 0.4s ease forwards' }}>
            <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginBottom: 6 }}>
              <div style={{ fontSize: 10, fontWeight: 800, letterSpacing: '0.16em', color: level.color }}>
                Lv.{level.lv} {level.label}
              </div>
              <div style={{ fontSize: 10, color: 'rgba(255,255,255,0.35)', fontWeight: 700 }}>
                {xpInLevel} / {nextLv ? xpNeeded : '∞'} XP
              </div>
            </div>
            <div style={{ height: 4, background: 'rgba(255,255,255,0.07)', borderRadius: 4, overflow: 'hidden', marginBottom: 6 }}>
              <div style={{
                height: '100%', background: level.color, borderRadius: 4,
                width: `${pct}%`, transition: 'width 0.8s cubic-bezier(0.2,1,0.3,1)',
              }} />
            </div>
            {xpResult?.levelUp && (
              <div style={{ textAlign: 'center', padding: '6px 0', fontSize: 13, fontWeight: 800, color: '#FFD700', letterSpacing: '0.08em' }}>
                ✦ LEVEL UP → {xpResult.level.label}
              </div>
            )}
          </div>
        )}

        {/* CTA */}
        <div style={{ padding: '16px 24px 28px' }}>
          {step < items.length - 1 ? (
            <button onClick={handleNext} style={{
              width: '100%', padding: '14px', borderRadius: 14,
              background: 'rgba(255,255,255,0.07)', border: '1px solid rgba(255,255,255,0.12)',
              color: 'rgba(255,255,255,0.8)', fontSize: 13, fontWeight: 700,
              cursor: 'pointer', fontFamily: 'inherit', letterSpacing: '0.06em',
            }}>
              次へ →
            </button>
          ) : (
            <button onClick={handleClose} style={{
              width: '100%', padding: '14px', borderRadius: 14,
              background: level.color, border: 'none',
              color: '#fff', fontSize: 14, fontWeight: 800,
              cursor: 'pointer', fontFamily: 'inherit', letterSpacing: '0.06em',
            }}>
              閉じる
            </button>
          )}
        </div>
      </div>

      <style>{`
        @keyframes fadeUp {
          from { opacity: 0; transform: translateY(10px); }
          to   { opacity: 1; transform: none; }
        }
      `}</style>
    </div>
  )
}
