import { useState } from 'react'
import { apiPost } from './api'

export default function Generators() {
  const [input, setInput] = useState('')
  const [summary, setSummary] = useState(null)
  const [notes, setNotes] = useState([])
  const [cards, setCards] = useState([])
  const [tasks, setTasks] = useState([])
  const [loading, setLoading] = useState(false)

  const run = async (endpoint, body, setter) => {
    setLoading(true)
    try {
      const res = await apiPost(endpoint, body)
      setter(res)
    } catch (e) {
      console.error(e)
    } finally {
      setLoading(false)
    }
  }

  return (
    <div className="space-y-4">
      <textarea
        value={input}
        onChange={(e) => setInput(e.target.value)}
        placeholder="Paste lecture text or notes..."
        className="w-full h-36 p-3 rounded bg-slate-900/60 border border-slate-700 text-slate-100"
      />
      <div className="flex flex-wrap gap-2">
        <button className="px-3 py-2 bg-blue-600 text-white rounded" onClick={() => run('/api/summarize', { text: input }, (r)=> setSummary(r))}>Summarize</button>
        <button className="px-3 py-2 bg-emerald-600 text-white rounded" onClick={() => run('/api/notes', { text: input }, (r)=> setNotes(r.bullets||[]))}>Exam Notes</button>
        <button className="px-3 py-2 bg-indigo-600 text-white rounded" onClick={() => run('/api/flashcards', { text: input, count: 8 }, (r)=> setCards(r.cards||[]))}>Flashcards</button>
        <button className="px-3 py-2 bg-amber-600 text-white rounded" onClick={() => run('/api/tasks/extract', { text: input }, (r)=> setTasks(r.tasks||[]))}>Extract Tasks</button>
      </div>

      {loading && <p className="text-blue-300">Working...</p>}

      {summary && (
        <div className="p-4 bg-slate-800/60 border border-slate-700 rounded">
          <h3 className="text-white font-semibold mb-2">Summary</h3>
          <p className="text-slate-200 mb-2">{summary.content}</p>
          <ul className="list-disc list-inside text-slate-300">
            {summary.key_points?.map((k,i)=> <li key={i}>{k}</li>)}
          </ul>
        </div>
      )}

      {notes?.length>0 && (
        <div className="p-4 bg-slate-800/60 border border-slate-700 rounded">
          <h3 className="text-white font-semibold mb-2">Exam-focused Notes</h3>
          <ul className="list-disc list-inside text-slate-300 space-y-1">
            {notes.map((n,i)=> <li key={i}>{n}</li>)}
          </ul>
        </div>
      )}

      {cards?.length>0 && (
        <div className="p-4 bg-slate-800/60 border border-slate-700 rounded">
          <h3 className="text-white font-semibold mb-2">Flashcards</h3>
          <div className="grid md:grid-cols-2 gap-3">
            {cards.map((c,i)=> (
              <div key={i} className="p-3 rounded bg-slate-900/60 border border-slate-700">
                <p className="text-slate-100 font-medium">Q: {c.question}</p>
                <p className="text-slate-300 mt-1">A: {c.answer}</p>
              </div>
            ))}
          </div>
        </div>
      )}

      {tasks?.length>0 && (
        <div className="p-4 bg-slate-800/60 border border-slate-700 rounded">
          <h3 className="text-white font-semibold mb-2">Extracted Tasks</h3>
          <ul className="space-y-1">
            {tasks.map((t,i)=> (
              <li key={i} className="text-slate-200 flex items-center gap-2">
                <span className="inline-block w-2 h-2 rounded-full bg-amber-400" />
                <span>{t.title}</span>
                {t.due_date && <span className="text-slate-400 text-sm">(due {new Date(t.due_date).toLocaleString()})</span>}
              </li>
            ))}
          </ul>
        </div>
      )}
    </div>
  )
}
