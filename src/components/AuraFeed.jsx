import { useState } from 'react'
import { getAuraFeed, getAuraProfile, getAuraLevel, AURA_LEVELS } from '../utils/storage'

function timeAgo(ts) {
  const diff = Date.now() - ts
  const m = Math.floor(diff / 60000)
  const h = Math.floor(diff / 3600000)
  const d = Math.floor(diff / 86400000)
  if (m < 2) return 'たった今'
  if (m < 60) return `${m}分前`
  if (h < 24) return `${h}時間前`
  if (d < 7) return `${d}日前`
  const dt = new Date(ts)
  return `${dt.getMonth()+1}/${dt.getDate()}`
}

const ICON_MAP = {
  morning_complete: '🌅',
  evening_complete: '🌙',
  streak_milestone: '🔥',
  level_up:         '⬆',
  comeback:         '⚡',
  perfect_day:      '✦',
}

const SOURCE_LABELS = {
  morning_complete: '朝ルーティン',
  evening_complete: '夜の振り返り',
  streak_milestone: '連続記録',
  level_up:         'レベルアップ',
  comeback:         '復活',
  perfect_day:      '完璧な日',
}

function FeedItem({ entry }) {
  const icon = ICON_MAP[entry.type] || '◆'
  const src = SOURCE_LABELS[entry.type] || 'AURA'

  return (
    <div style={{
      display: 'flex', gap: 12, padding: '14px 0',
      borderBottom: '1px solid rgba(255,255,255,0.05)',
    }}>
      <div style={{
        width: 36, height: 36, borderRadius: 18, flexShrink: 0,
        background: 'rgba(255,255,255,0.06)',
        display: 'flex', alignItems: 'center', justifyContent: 'center',
        fontSize: 16,
      }}>
        {icon}
      </div>
      <div style={{ flex: 1 }}>
        <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'baseline', marginBottom: 3 }}>
          <div style={{ fontSize: 9, fontWeight: 800, letterSpacing: '0.16em', color: 'rgba(255,255,255,0.35)' }}>
            {src}
          </div>
          <div style={{ fontSize: 9, color: 'rgba(255,255,255,0.2)', fontWeight: 600 }}>
            {timeAgo(entry.ts)}
          </div>
        </div>
        <div style={{ fontSize: 14, color: 'rgba(255,255,255,0.85)', fontWeight: 600, lineHeight: 1.5, marginBottom: entry.sub ? 4 : 0 }}>
          {entry.message}
        </div>
        {entry.sub && (
          <div style={{ fontSize: 12, color: 'rgba(255,255,255,0.45)', lineHeight: 1.6, fontStyle: 'italic' }}>
            {entry.sub}
          </div>
        )}
      </div>
    </div>
  )
}

export default function AuraFeed() {
  const feed = getAuraFeed()
  const profile = getAuraProfile()
  const level = getAuraLevel(profile.xp)
  const nextLv = AURA_LEVELS.find(l => l.lv === level.lv + 1)
  const xpInLevel = profile.xp - level.min
  const xpNeeded = nextLv ? nextLv.min - level.min : 1
  const pct = nextLv ? Math.min(100, (xpInLevel / xpNeeded) * 100) : 100

  return (
    <div style={{
      background: 'linear-gradient(180deg,#08101f 0%,#0f1a30 100%)',
      borderRadius: 20,
      border: '1px solid rgba(255,255,255,0.07)',
      overflow: 'hidden',
      marginBottom: 20,
    }}>
      {/* Header */}
      <div style={{ padding: '18px 20px 12px', borderBottom: '1px solid rgba(255,255,255,0.06)' }}>
        <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginBottom: 12 }}>
          <div>
            <div style={{ fontSize: 9, fontWeight: 800, letterSpacing: '0.22em', color: 'rgba(255,255,255,0.3)', marginBottom: 3 }}>
              AURA FEED
            </div>
            <div style={{ fontSize: 16, fontWeight: 800, color: '#fff', letterSpacing: '-0.02em' }}>
              あなたの記録
            </div>
          </div>
          <div style={{ textAlign: 'right' }}>
            <div style={{ fontSize: 10, fontWeight: 800, color: level.color, letterSpacing: '0.1em' }}>
              Lv.{level.lv} {level.label}
            </div>
            <div style={{ fontSize: 9, color: 'rgba(255,255,255,0.3)', marginTop: 2 }}>
              {profile.xp} XP
            </div>
          </div>
        </div>

        {/* XP bar */}
        <div>
          <div style={{ height: 3, background: 'rgba(255,255,255,0.07)', borderRadius: 3, overflow: 'hidden' }}>
            <div style={{ height: '100%', background: level.color, width: `${pct}%`, borderRadius: 3, transition: 'width 1s' }} />
          </div>
          {nextLv && (
            <div style={{ fontSize: 9, color: 'rgba(255,255,255,0.2)', marginTop: 4, textAlign: 'right' }}>
              次のレベルまで {xpNeeded - xpInLevel} XP
            </div>
          )}
        </div>
      </div>

      {/* Feed list */}
      <div style={{ padding: '0 20px' }}>
        {feed.length === 0 ? (
          <div style={{ padding: '32px 0', textAlign: 'center' }}>
            <div style={{ fontSize: 28, marginBottom: 10 }}>◇</div>
            <div style={{ fontSize: 13, color: 'rgba(255,255,255,0.3)', lineHeight: 1.7 }}>
              朝か夜のルーティンを保存すると<br />ここに記録が積み上がっていく。
            </div>
          </div>
        ) : (
          feed.slice(0, 12).map(e => <FeedItem key={e.id} entry={e} />)
        )}
      </div>
    </div>
  )
}
