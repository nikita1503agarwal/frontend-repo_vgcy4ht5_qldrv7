import { useState } from 'react'
import Uploader from './components/Uploader'
import Generators from './components/Generators'
import DoubtsAndPlan from './components/DoubtsAndPlan'

function App() {
  const [resource, setResource] = useState(null)

  return (
    <div className="min-h-screen bg-gradient-to-br from-slate-900 via-slate-800 to-slate-900">
      <div className="absolute inset-0 bg-[radial-gradient(circle_at_50%_50%,rgba(59,130,246,0.05),transparent_50%)]"></div>

      <div className="relative min-h-screen p-8">
        <header className="max-w-6xl mx-auto mb-10">
          <div className="flex items-center gap-3">
            <img src="/flame-icon.svg" alt="Flames" className="w-10 h-10" />
            <div>
              <h1 className="text-3xl font-bold text-white tracking-tight">Student Productivity Studio</h1>
              <p className="text-blue-200">Turn lectures, PDFs and screenshots into summaries, exam notes, flashcards and schedules.</p>
            </div>
          </div>
        </header>

        <main className="max-w-6xl mx-auto grid lg:grid-cols-3 gap-6">
          <section className="lg:col-span-1">
            <Uploader onTextReady={setResource} />
            {resource && (
              <div className="mt-3 p-3 rounded bg-slate-800/60 border border-slate-700 text-slate-300 text-sm">
                <p>Resource saved. You can now paste text below or use generators directly.</p>
              </div>
            )}
          </section>
          <section className="lg:col-span-2">
            <Generators />
          </section>
        </main>

        <section className="max-w-6xl mx-auto mt-8">
          <DoubtsAndPlan />
        </section>

        <footer className="max-w-6xl mx-auto mt-10 text-center text-blue-300/60 text-sm">
          No manual typing needed — just upload and generate.
        </footer>
      </div>
    </div>
  )
}

export default App
