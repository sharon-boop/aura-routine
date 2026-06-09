import { useState, useEffect } from 'react'
import Home from './components/Home'
import Morning from './components/Morning'
import Afternoon from './components/Afternoon'
import ValueProvision from './components/ValueProvision'
import Evening from './components/Evening'
import Summary from './components/Summary'
import FunnyStory from './components/FunnyStory'
import Investment from './components/Investment'
import TodoList from './components/TodoList'
import Records from './components/Records'
import WeeklyMonthly from './components/WeeklyMonthly'
import Settings from './components/Settings'
import { Toast, useToast } from './components/Toast'
import { initSampleData, getStreak, getSettings } from './utils/storage'

const NAV = [
  { id:'home',    icon:'⌂', label:'Home' },
  { id:'routine', icon:'◎', label:'Routine' },
  { id:'world',   icon:'◈', label:'World' },
  { id:'invest',  icon:'▷', label:'Invest' },
  { id:'log',     icon:'▦', label:'Log' },
]

const ROUTINE_TABS  = [{ id:'morning', label:'朝' }, { id:'afternoon', label:'昼' }, { id:'value', label:'価値提供' }, { id:'evening', label:'夜' }]
const WORLD_TABS    = [{ id:'summary', label:'要約' }, { id:'funny', label:'話術' }]
const INVEST_TABS   = [{ id:'investment', label:'90分投資' }, { id:'todo', label:'ToDo' }]
const LOG_TABS      = [{ id:'records', label:'カレンダー' }, { id:'challenge', label:'チャレンジ' }]

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

function Sidebar({ nav, setNav, streak }) {
  return (
    <aside className="sidebar-nav">
      <div className="sb-brand">
        <div className="sb-appname">1% AURA<br />ROUTINE</div>
        <div className="sb-sub">1日3人の人生を1%良くする</div>
      </div>
      {NAV.map(item => (
        <button key={item.id} className={`sb-item ${nav === item.id ? 'active' : ''}`} onClick={() => setNav(item.id)}>
          <span className="sb-icon">{item.icon}</span>
          {item.label}
        </button>
      ))}
      <div className="sb-footer">
        <div className="sb-streak">
          <span>🔥</span>
          <div><strong>{streak}</strong> 日連続</div>
        </div>
      </div>
    </aside>
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

export default function App() {
  const [nav, setNav] = useState('home')
  const [showSettings, setShowSettings] = useState(false)
  const [routineTab,  setRoutineTab]  = useState('morning')
  const [worldTab,    setWorldTab]    = useState('summary')
  const [investTab,   setInvestTab]   = useState('investment')
  const [logTab,      setLogTab]      = useState('records')
  const [streak, setStreak] = useState(0)
  const { msg, show } = useToast()

  useEffect(() => {
    initSampleData()
    setStreak(getStreak())
    // Apply saved theme
    const s = getSettings()
    if (s.theme && s.theme !== 'cream-street') {
      document.documentElement.setAttribute('data-theme', s.theme)
    }
  }, [])

  const handleNavigate = (section, sub) => {
    setShowSettings(false)
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
    if (showSettings) return <Settings onBack={() => setShowSettings(false)} />
    if (nav === 'home') return <Home onNavigate={handleNavigate} onSettings={() => setShowSettings(true)} />

    if (nav === 'routine') {
      if (routineTab === 'morning')   return <Morning />
      if (routineTab === 'afternoon') return <Afternoon />
      if (routineTab === 'value')     return <ValueProvision />
      if (routineTab === 'evening')   return <Evening />
    }
    if (nav === 'world') {
      if (worldTab === 'summary') return <Summary />
      if (worldTab === 'funny')   return <FunnyStory />
    }
    if (nav === 'invest') {
      if (investTab === 'investment') return <Investment />
      if (investTab === 'todo')       return <TodoList />
    }
    if (nav === 'log') {
      if (logTab === 'records')   return <Records />
      if (logTab === 'challenge') return <WeeklyMonthly />
    }
  }

  return (
    <div className="app-shell">
      <Sidebar nav={showSettings ? 'settings' : nav} setNav={(n) => { setShowSettings(false); setNav(n) }} streak={streak} />

      <div className="main-area">
        <div className="page-content slide-up" key={`${nav}-${routineTab}-${worldTab}-${investTab}-${logTab}-${showSettings}`}>
          {!showSettings && nav !== 'home' && renderSubNav()}
          {renderPage()}
        </div>
      </div>

      <BottomNav nav={nav} setNav={(n) => { setShowSettings(false); setNav(n) }} />
      <Toast msg={msg} show={show} />
    </div>
  )
}
