import { useState, useEffect } from 'react'
import { getWeeklyChallenges, saveWeeklyChallenge, getMonthlyChallenges, saveMonthlyChallenge, getLogIdeas, saveLogIdeas, addGachaTickets } from '../utils/storage'
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
    addGachaTickets(2)
    toast('週1チャレンジを記録しました ✓ +2チケット🎟️')
  }

  const saveM = () => {
    if (!mForm.challenge) { toast('チャレンジを選んでください'); return }
    saveMonthlyChallenge(editM ? { ...mForm, id: editM } : mForm)
    setMonthlyList(getMonthlyChallenges())
    setMForm({ challenge: '', reason: '', feeling: '', aura: '' })
    setEditM(null)
    toast('月1チャレンジを記録しました')
  }

  const ideas = tab === 'weekly' ? weeklyIdeas : monthlyIdeas

  return (
    <div className="slide-up" style={{ paddingBottom: '40px' }}>
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

          <div style={{ marginTop:8, padding:'8px 0 0', borderTop:'1px solid #F0EDE7' }}>
            <div style={{ fontSize:11, color:'var(--muted)', fontWeight:600 }}>
              アイデアの編集は <strong>設定</strong> タブから行えます
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
