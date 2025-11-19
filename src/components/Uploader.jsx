import { useState } from 'react'
import { apiPost } from './api'

export default function Uploader({ onTextReady }) {
  const [loading, setLoading] = useState(false)
  const [error, setError] = useState('')

  const handleFile = async (e) => {
    const file = e.target.files?.[0]
    if (!file) return
    setLoading(true)
    setError('')
    try {
      const form = new FormData()
      form.append('file', file)
      form.append('title', file.name)
      const res = await apiPost('/api/resources/upload', form, true)
      // If we didn't OCR, user can paste text next. For PDFs, backend extracts text.
      onTextReady({ info: res, text: null })
    } catch (err) {
      setError(err.message)
    } finally {
      setLoading(false)
    }
  }

  const handlePaste = async (e) => {
    e.preventDefault()
    const text = e.clipboardData.getData('text')
    if (!text) return
    setLoading(true)
    setError('')
    try {
      const res = await apiPost('/api/resources/text', { title: 'Pasted Text', text })
      onTextReady({ info: res, text })
    } catch (err) {
      setError(err.message)
    } finally {
      setLoading(false)
    }
  }

  return (
    <div className="p-4 bg-slate-800/60 border border-slate-700 rounded-xl">
      <p className="text-slate-200 mb-3">Upload PDF/screenshots or paste text</p>
      <div className="flex items-center gap-3">
        <label className="bg-blue-600 hover:bg-blue-500 text-white px-4 py-2 rounded cursor-pointer">
          <input type="file" className="hidden" onChange={handleFile} accept=".pdf,.png,.jpg,.jpeg" />
          Choose File
        </label>
        <button
          onClick={() => navigator.clipboard.readText().then(t => onTextReady({ info: null, text: t }))}
          className="px-4 py-2 rounded bg-slate-700 hover:bg-slate-600 text-white"
        >
          Use Clipboard
        </button>
      </div>
      <div
        onPaste={handlePaste}
        className="mt-3 p-3 bg-slate-900/60 rounded border border-slate-700 text-slate-400 text-sm"
        contentEditable
        suppressContentEditableWarning
        placeholder="Paste text here"
        style={{ minHeight: 80 }}
      />
      {loading && <p className="text-blue-300 mt-2">Processing...</p>}
      {error && <p className="text-red-400 mt-2">{error}</p>}
    </div>
  )
}
