import { useState, useEffect } from 'react'
import { getWeeklyChallenges, saveWeeklyChallenge, getMonthlyChallenges, saveMonthlyChallenge, getLogIdeas, saveLogIdeas } from '../utils/storage'
import { toast } from './Toast'

const DEFAULT_WEEKLY = ['友達を誘ってご飯を企画する', '勉強会を作る', '後輩や友達の相談に乗る', '旅行や遊びを企画する', 'SNSで学びを発信する', '先輩・社会人に会う']
const DEFAULT_MONTHLY = ['一人旅', '高めの店で食事', '美術館', '映画館', '初対面の場に行く', '社会人に会う', 'プレゼンする', '服を研究して買う', '新しい場所に行く']

export default function WeeklyMonthly() {
  const [tab, setTab] = useState('weekly')
  const [weeklyList, setWeeklyList] = useState([])
  const [monthlyList, setMonthlyList] = useState([])
  const [weeklyIdeas, setWeeklyIdeas] = useState([])
  const [monthlyIdeas, setMonthlyIdeas] = useState([])
  const [wForm, setWForm] = useState({ challenge: '', date: '', people: '', result: '', learned: '' })
  const [mForm, setMForm] = useState({ challenge: '', reason: '', feeling: '', aura: '' })
  const [editW, setEditW] = useState(null)
  const [editM, setEditM] = useState(null)
  const [newIdea, setNewIdea] = useState('')

  useEffect(() => {
    setWeeklyList(getWeeklyChallenges())
    setMonthlyList(getMonthlyChallenges())
    setWeeklyIdeas(getLogIdeas('weekly', DEFAULT_WEEKLY))
    setMonthlyIdeas(getLogIdeas('monthly', DEFAULT_MONTHLY))
  }, [])

  const setW = (k, v) => setWForm(f => ({ ...f, [k]: v }))
  const setM = (k, v) => setMForm(f => ({ ...f, [k]: v }))

  const saveW = () => {
    if (!wForm.challenge) { toast('チャレンジを選んでください'); return }
    saveWeeklyChallenge(editW ? { ...wForm, id: editW } : wForm)
    setWeeklyList(getWeeklyChallenges())
    setWForm({ challenge: '', date: '', people: '', result: '', learned: '' })
    setEditW(null)
    toast('週1チャレンジを記録しました')
  }

  const saveM = () => {
    if (!mForm.challenge) { toast('チャレンジを選んでください'); return }
    saveMonthlyChallenge(editM ? { ...mForm, id: editM } : mForm)
    setMonthlyList(getMonthlyChallenges())
    setMForm({ challenge: '', reason: '', feeling: '', aura: '' })
    setEditM(null)
    toast('月1チャレンジを記録しました')
  }

  const addIdea = (isWeekly) => {
    if (!newIdea.trim()) return
    if (isWeekly) {
      const next = [...weeklyIdeas, newIdea.trim()]
      setWeeklyIdeas(next); saveLogIdeas('weekly', next)
    } else {
      const next = [...monthlyIdeas, newIdea.trim()]
      setMonthlyIdeas(next); saveLogIdeas('monthly', next)
    }
    setNewIdea('')
    toast('アイデアを追加しました')
  }

  const removeIdea = (isWeekly, idx) => {
    if (isWeekly) {
      const next = weeklyIdeas.filter((_, i) => i !== idx)
      setWeeklyIdeas(next); saveLogIdeas('weekly', next)
    } else {
      const next = monthlyIdeas.filter((_, i) => i !== idx)
      setMonthlyIdeas(next); saveLogIdeas('monthly', next)
    }
  }

  const ideas = tab === 'weekly' ? weeklyIdeas : monthlyIdeas

  return (
    <div className="slide-up" style={{ paddingBottom: 'calc(var(--nav-h) + 24px)' }}>
      <div className="ph">
        <div className="ph-eyebrow">Log — Challenge</div>
        <div className="ph-title">背伸びの経験</div>
        <div className="ph-sub">雰囲気と余裕を作るチャレンジ</div>
      </div>

      <div style={{ padding:'0 24px 4px',display:'flex',gap:8 }}>
        <button className={`pill ${tab === 'weekly' ? 'on' : ''}`} onClick={() => setTab('weekly')}>週1チャレンジ</button>
        <button className={`pill ${tab === 'monthly' ? 'on' : ''}`} onClick={() => setTab('monthly')}>月1チャレンジ</button>
      </div>

      {tab === 'monthly' && (
        <div className="sec" style={{ paddingTop:20 }}>
          <div style={{ padding:'14px 18px',background:'var(--ink)',borderRadius:'var(--r-sm)',marginBottom:20,fontSize:12,color:'rgba(255,255,255,0.55)',fontWeight:700 }}>
            背伸びの経験が、雰囲気と余裕を作る
          </div>
        </div>
      )}

      <div className="sec" style={{ paddingTop: tab === 'monthly' ? 0 : 20 }}>
        <div className="sec-title">{tab === 'weekly' ? '今週の主催チャレンジ' : '今月の背伸び経験'}</div>
        <div className="card static">
          <div className="f">
            <label className="fl">チャレンジを選ぶ</label>
            <div className="pills">
              {ideas.map((idea, i) => (
                <button key={i} className={`pill ${(tab==='weekly'?wForm:mForm).challenge === idea ? 'on' : ''}`}
                  onClick={() => tab==='weekly' ? setW('challenge', idea) : setM('challenge', idea)}>
                  {idea}
                </button>
              ))}
            </div>
          </div>

          {/* アイデア編集 */}
          <div style={{ marginTop:8,borderTop:'1px solid #F0EDE7',paddingTop:10 }}>
            <div style={{ fontSize:11,color:'var(--muted)',fontWeight:700,marginBottom:6 }}>アイデアを編集</div>
            <div style={{ display:'flex',flexWrap:'wrap',gap:6,marginBottom:8 }}>
              {ideas.map((idea, i) => (
                <div key={i} style={{ display:'flex',alignItems:'center',gap:4,background:'var(--cream)',borderRadius:20,padding:'4px 10px' }}>
                  <span style={{ fontSize:12 }}>{idea}</span>
                  <button onClick={() => removeIdea(tab==='weekly', i)} style={{ background:'none',border:'none',cursor:'pointer',fontSize:12,color:'var(--muted)',padding:'0 2px' }}>×</button>
                </div>
              ))}
            </div>
            <div style={{ display:'flex',gap:8 }}>
              <input value={newIdea} onChange={e=>setNewIdea(e.target.value)}
                onKeyDown={e=>e.key==='Enter'&&addIdea(tab==='weekly')}
                placeholder="新しいアイデアを追加"
                style={{ flex:1,padding:'9px 14px',borderRadius:50,border:'1.5px solid #E8E4DC',background:'#FDFBF8',fontFamily:'var(--font)',fontSize:13,outline:'none' }} />
              <button className="btn btn-sm btn-outline" style={{ width:'auto' }} onClick={() => addIdea(tab==='weekly')}>追加</button>
            </div>
          </div>
        </div>

        <div className="card static" style={{ marginTop:12 }}>
          {tab === 'weekly' ? (
            <>
              <div className="f"><label className="fl">実行日</label><input type="date" value={wForm.date} onChange={e => setW('date', e.target.value)} /></div>
              <div className="f"><label className="fl">誘った人</label><input value={wForm.people} onChange={e => setW('people', e.target.value)} placeholder="誰と？" /></div>
              <div className="f"><label className="fl">結果</label><textarea value={wForm.result} onChange={e => setW('result', e.target.value)} placeholder="どうなった？" rows={2} /></div>
              <div className="f" style={{ marginBottom:0 }}><label className="fl">学んだこと</label><textarea value={wForm.learned} onChange={e => setW('learned', e.target.value)} placeholder="" rows={2} /></div>
            </>
          ) : (
            <>
              <div className="f"><label className="fl">なぜそれを選んだか</label><textarea value={mForm.reason} onChange={e => setM('reason', e.target.value)} placeholder="" rows={2} /></div>
              <div className="f"><label className="fl">実行して感じたこと</label><textarea value={mForm.feeling} onChange={e => setM('feeling', e.target.value)} placeholder="" rows={2} /></div>
              <div className="f" style={{ marginBottom:0 }}><label className="fl">自分の雰囲気にどう影響したか</label><textarea value={mForm.aura} onChange={e => setM('aura', e.target.value)} placeholder="" rows={2} /></div>
            </>
          )}
        </div>
        <button className="btn btn-main" style={{ marginTop:4 }} onClick={tab==='weekly'?saveW:saveM}>記録する</button>

        {(tab==='weekly' ? weeklyList : monthlyList).length > 0 && (
          <>
            <div className="sec-title" style={{ marginTop:24 }}>過去の記録</div>
            {(tab==='weekly' ? weeklyList : monthlyList).map(item => (
              <div key={item.id} className="card" style={{ marginBottom:12 }}
                onClick={() => tab==='weekly' ? (setWForm(item), setEditW(item.id)) : (setMForm(item), setEditM(item.id))}>
                <div style={{ fontWeight:900,fontSize:15,marginBottom:4 }}>{item.challenge || '（未設定）'}</div>
                {item.date && <div style={{ fontSize:11,color:'var(--muted)',marginBottom:4 }}>{item.date}</div>}
                {(item.result || item.feeling) && <div style={{ fontSize:13,color:'#555' }}>{item.result || item.feeling}</div>}
                {(item.learned || item.aura) && (
                  <div style={{ marginTop:8,fontSize:12,color:'var(--muted)',padding:'6px 10px',background:'var(--cream)',borderRadius:8 }}>
                    {item.learned ? `学び：${item.learned}` : `雰囲気への影響：${item.aura}`}
                  </div>
                )}
              </div>
            ))}
          </>
        )}
      </div>
    </div>
  )
}
