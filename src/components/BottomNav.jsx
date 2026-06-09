export default function BottomNav({ active, onChange }) {
  const items = [
    { id: 'home', icon: '🏠', label: 'Home' },
    { id: 'routine', icon: '☀️', label: 'Routine' },
    { id: 'world', icon: '🌏', label: 'World' },
    { id: 'invest', icon: '⚡', label: 'Invest' },
    { id: 'log', icon: '📅', label: 'Log' },
  ]

  return (
    <nav className="bottom-nav">
      {items.map(item => (
        <button
          key={item.id}
          className={`nav-item ${active === item.id ? 'active' : ''}`}
          onClick={() => onChange(item.id)}
        >
          <span className="nav-icon">{item.icon}</span>
          <span className="nav-label">{item.label}</span>
        </button>
      ))}
    </nav>
  )
}
