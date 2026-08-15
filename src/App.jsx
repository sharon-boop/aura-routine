import { useState, useEffect } from 'react'
import Home from './components/Home'
import Morning from './components/Morning'
import Afternoon from './components/Afternoon'
import Evening from './components/Evening'
import Summary from './components/Summary'
import FunnyStory from './components/FunnyStory'
import Investment from './components/Investment'
import TodoList from './components/TodoList'
import Records from './components/Records'
import WeeklyReview from './components/WeeklyReview'
import Settings from './components/Settings'
import PremiumGacha from './components/PremiumGacha'
import TikTokMemo from './components/TikTokMemo'
import PokemonPartner from './components/PokemonPartner'
import { Toast, useToast } from './components/Toast'
import { initSampleData, getStreak, getSettings, checkAchievements, ACHIEVEMENT_DEFS, checkMilestoneRewards } from './utils/storage'

const NAV = [
  { id:'home',    icon:'⌂', label:'Home' },
  { id:'routine', icon:'◎', label:'Routine' },
  { id:'world',   icon:'◈', label:'World' },
  { id:'invest',  icon:'▷', label:'Invest' },
  { id:'log',     icon:'▦', label:'Log' },
]

const ROUTINE_TABS  = [{ id:'morning', label:'☀️ 朝' }, { id:'evening', label:'🌙 夜' }]
const WORLD_TABS    = [{ id:'summary', label:'要約' }, { id:'funny', label:'話術' }, { id:'tiktok', label:'台本📱' }]
const INVEST_TABS   = [{ id:'investment', label:'90分投資' }, { id:'todo', label:'ToDo' }]
const LOG_TABS      = [{ id:'records', label:'カレンダー' }, { id:'weekly', label:'週次レビュー' }]

function SubNav({ tabs, active, onChange }) {
  return (
    <div className="sub-nav">
      {tabs.map(t => (
        <button key={t.id} className={`sub-tab ${active === t.id ? 'active' : ''}`} onClick={() => onChange(t.id)}>
          {t.label}
        </button>
      ))}
    </div>
  )
}

function Sidebar({ nav, setNav, streak, open, onClose }) {
  return (
    <>
      {open && <div className="sidebar-backdrop" onClick={onClose} />}
      <aside className={`sidebar-nav${open ? ' sidebar-open' : ''}`}>
        <div className="sb-brand">
          <div className="sb-appname">1% AURA<br />ROUTINE</div>
          <div className="sb-sub">1日3人の人生を1%良くする</div>
        </div>
        {NAV.map(item => (
          <button key={item.id} className={`sb-item ${nav === item.id ? 'active' : ''}`} onClick={() => { setNav(item.id); onClose(); }}>
            <span className="sb-icon">{item.icon}</span>
            {item.label}
          </button>
        ))}
        <div className="sb-divider" />
        <button className={`sb-item ${nav === 'gacha' ? 'active' : ''}`} onClick={() => { setNav('gacha'); onClose(); }}>
          <span className="sb-icon">🎰</span>
          プレミアムガチャ
        </button>
        <button className={`sb-item ${nav === 'partner' ? 'active' : ''}`} onClick={() => { setNav('partner'); onClose(); }}>
          <span className="sb-icon">🥚</span>
          ポケモン育成
        </button>
        <button className={`sb-item ${nav === 'settings' ? 'active' : ''}`} onClick={() => { setNav('settings'); onClose(); }}>
          <span className="sb-icon">⚙</span>
          設定
        </button>
        <div className="sb-footer">
          <div className="sb-streak">
            <span>🔥</span>
            <div><strong>{streak}</strong> 日連続</div>
          </div>
        </div>
      </aside>
    </>
  )
}

function BottomNav({ nav, setNav }) {
  return (
    <nav className="bottom-nav">
      {NAV.map(item => (
        <button key={item.id} className={`nav-item ${nav === item.id ? 'active' : ''}`} onClick={() => setNav(item.id)}>
          <span className="nav-icon">{item.icon}</span>
          <span className="nav-label">{item.label}</span>
        </button>
      ))}
    </nav>
  )
}

function AchievementToast({ ids, onClose }) {
  const [idx, setIdx] = useState(0)
  if (!ids.length) return null
  const def = ACHIEVEMENT_DEFS.find(a => a.id === ids[idx])
  if (!def) return null
  const next = () => { if (idx + 1 < ids.length) setIdx(i => i + 1); else onClose() }
  return (
    <div style={{ position:'fixed',inset:0,background:'rgba(0,0,0,0.75)',zIndex:9999,display:'flex',alignItems:'center',justifyContent:'center',padding:24 }}>
      <div style={{ background:'#fff',borderRadius:28,padding:'40px 32px',maxWidth:340,width:'100%',textAlign:'center',boxShadow:'0 24px 60px rgba(0,0,0,0.3)' }}>
        <div style={{ fontSize:64,marginBottom:12 }}>{def.icon}</div>
        <div style={{ fontSize:11,fontWeight:900,letterSpacing:3,textTransform:'uppercase',color:def.color,marginBottom:8 }}>Achievement Unlocked</div>
        <div style={{ fontSize:24,fontWeight:900,letterSpacing:-0.5,marginBottom:8 }}>{def.label}</div>
        <div style={{ display:'inline-block',background:def.color,color:'#fff',fontWeight:900,fontSize:13,letterSpacing:2,padding:'5px 18px',borderRadius:50,marginBottom:16 }}>{def.badge}</div>
        <div style={{ fontSize:14,color:'#666',lineHeight:1.6,marginBottom:8 }}>{def.desc}</div>
        {def.gachaUnlock > 0 && (
          <div style={{ background:'#F7F1E8',borderRadius:14,padding:'12px 16px',marginBottom:24,fontSize:13,fontWeight:700,color:'#E85D2A' }}>
            🎰 ガチャの在り方が {def.gachaUnlock} 種類に解放！
          </div>
        )}
        <button onClick={next} style={{ width:'100%',padding:'14px',background:'#151515',color:'#fff',border:'none',borderRadius:14,fontSize:15,fontWeight:700,cursor:'pointer',fontFamily:'inherit' }}>
          {idx + 1 < ids.length ? `次へ (${idx+1}/${ids.length})` : '閉じる'}
        </button>
      </div>
    </div>
  )
}

export default function App() {
  const [nav, setNav] = useState('home')
  const [sidebarOpen, setSidebarOpen] = useState(false)
  const [newAchievements, setNewAchievements] = useState([])
  const [routineTab,  setRoutineTab]  = useState('morning')
  const [worldTab,    setWorldTab]    = useState('summary')
  const [investTab,   setInvestTab]   = useState('investment')
  const [logTab,      setLogTab]      = useState('records')
  const [streak, setStreak] = useState(0)
  const { msg, show } = useToast()

  useEffect(() => {
    initSampleData()
    setStreak(getStreak())
    const s = getSettings()
    if (s.theme && s.theme !== 'cream-street') {
      document.documentElement.setAttribute('data-theme', s.theme)
    }
    const unlocked = checkAchievements()
    if (unlocked.length) setNewAchievements(unlocked)
    // マイルストーンチケット確認
    const milestones = checkMilestoneRewards()
    if (milestones.length) {
      milestones.forEach((m, i) => setTimeout(() => show(m.msg), i * 3500))
    }
  }, [])

  const handleNavigate = (section, sub) => {
    setNav(section)
    if (sub) {
      if (section === 'routine') setRoutineTab(sub)
      if (section === 'world')   setWorldTab(sub)
      if (section === 'invest')  setInvestTab(sub)
      if (section === 'log')     setLogTab(sub)
    }
  }

  const renderSubNav = () => {
    if (nav === 'routine') return <SubNav tabs={ROUTINE_TABS} active={routineTab} onChange={setRoutineTab} />
    if (nav === 'world')   return <SubNav tabs={WORLD_TABS}   active={worldTab}   onChange={setWorldTab} />
    if (nav === 'invest')  return <SubNav tabs={INVEST_TABS}  active={investTab}  onChange={setInvestTab} />
    if (nav === 'log')     return <SubNav tabs={LOG_TABS}      active={logTab}     onChange={setLogTab} />
    return null
  }

  const renderPage = () => {
    if (nav === 'settings') return <Settings onBack={() => setNav('home')} />
    if (nav === 'gacha')    return <PremiumGacha asPage onClose={() => setNav('home')} />
    if (nav === 'partner')  return <PokemonPartner />
    if (nav === 'home') return <Home onNavigate={handleNavigate} onSettings={() => setNav('settings')} />

    if (nav === 'routine') {
      if (routineTab === 'morning') return <Morning />
      if (routineTab === 'evening') return <Evening />
    }
    if (nav === 'world') {
      if (worldTab === 'summary') return <Summary />
      if (worldTab === 'funny')   return <FunnyStory />
      if (worldTab === 'tiktok')  return <TikTokMemo />
    }
    if (nav === 'invest') {
      if (investTab === 'investment') return <Investment />
      if (investTab === 'todo')       return <TodoList />
    }
    if (nav === 'log') {
      if (logTab === 'records') return <Records />
      if (logTab === 'weekly')  return <WeeklyReview />
    }
  }

  return (
    <div className="app-shell">
      <Sidebar
        nav={nav}
        setNav={setNav}
        streak={streak}
        open={sidebarOpen}
        onClose={() => setSidebarOpen(false)}
      />

      {/* Mobile top header bar */}
      <div className="mobile-topbar">
        <button className="hamburger-btn" onClick={() => setSidebarOpen(s => !s)}>
          <span /><span /><span />
        </button>
        <div className="mobile-topbar-title">1% AURA ROUTINE</div>
        <div className="mobile-topbar-spacer" />
      </div>

      <div className="main-area">
        <div className="page-content slide-up" key={`${nav}-${routineTab}-${worldTab}-${investTab}-${logTab}`}>
          {nav !== 'home' && nav !== 'settings' && nav !== 'gacha' && renderSubNav()}
          {renderPage()}
        </div>
      </div>

      <Toast msg={msg} show={show} />
      {newAchievements.length > 0 && <AchievementToast ids={newAchievements} onClose={() => setNewAchievements([])} />}
    </div>
  )
}
