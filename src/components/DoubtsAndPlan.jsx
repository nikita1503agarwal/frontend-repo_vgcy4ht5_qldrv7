import { useState } from 'react'
import { apiPost } from './api'

export default function DoubtsAndPlan() {
  const [question, setQuestion] = useState('')
  const [context, setContext] = useState('')
  const [steps, setSteps] = useState([])
  const [finalAnswer, setFinalAnswer] = useState('')

  const [planTitle, setPlanTitle] = useState('Next 7 days plan')
  const [objectives, setObjectives] = useState('Review lectures\nPractice problems\nRevise key topics')
  const [days, setDays] = useState(7)
  const [plan, setPlan] = useState(null)

  const ask = async () => {
    const res = await apiPost('/api/doubts', { question, context })
    setSteps(res.steps)
    setFinalAnswer(res.final_answer)
  }

  const createPlan = async () => {
    const res = await apiPost('/api/plan', { title: planTitle, objectives: objectives.split('\n').filter(Boolean), days: Number(days) })
    setPlan(res)
  }

  return (
    <div className="space-y-6">
      <div className="p-4 bg-slate-800/60 border border-slate-700 rounded">
        <h3 className="text-white font-semibold mb-2">Explain a Doubt</h3>
        <input value={question} onChange={e=> setQuestion(e.target.value)} placeholder="Your question" className="w-full mb-2 p-2 rounded bg-slate-900/60 border border-slate-700 text-slate-100" />
        <textarea value={context} onChange={e=> setContext(e.target.value)} placeholder="Optional context" className="w-full h-20 p-2 rounded bg-slate-900/60 border border-slate-700 text-slate-100" />
        <button onClick={ask} className="mt-2 px-3 py-2 bg-purple-600 text-white rounded">Explain Step-by-step</button>
        {steps.length>0 && (
          <div className="mt-3 text-slate-200">
            <ol className="list-decimal list-inside space-y-1">
              {steps.map((s,i)=> <li key={i}>{s}</li>)}
            </ol>
            <p className="mt-2 text-slate-300">{finalAnswer}</p>
          </div>
        )}
      </div>

      <div className="p-4 bg-slate-800/60 border border-slate-700 rounded">
        <h3 className="text-white font-semibold mb-2">Personalized Study Plan</h3>
        <input value={planTitle} onChange={e=> setPlanTitle(e.target.value)} className="w-full mb-2 p-2 rounded bg-slate-900/60 border border-slate-700 text-slate-100" />
        <div className="grid md:grid-cols-2 gap-3">
          <textarea value={objectives} onChange={e=> setObjectives(e.target.value)} className="p-2 rounded bg-slate-900/60 border border-slate-700 text-slate-100" rows={6} />
          <div>
            <label className="text-slate-300 text-sm">Days</label>
            <input type="number" value={days} onChange={e=> setDays(e.target.value)} className="w-full p-2 rounded bg-slate-900/60 border border-slate-700 text-slate-100" />
            <button onClick={createPlan} className="mt-2 px-3 py-2 bg-emerald-600 text-white rounded">Create Plan</button>
          </div>
        </div>
        {plan && (
          <div className="mt-3 text-slate-200">
            <ul className="list-disc list-inside space-y-1">
              {plan.tasks.map((t,i)=> <li key={i}>{t.title} {t.due_date && <span className="text-slate-400">(by {new Date(t.due_date).toLocaleDateString()})</span>}</li>)}
            </ul>
          </div>
        )}
      </div>
    </div>
  )
}
