import { useEffect, useRef, useState } from 'react'
import { todayISO } from '../utils/tasks'

export default function TaskModal({ mode, task, onClose, onSubmit }) {
  const isEdit = mode === 'edit'
  const [title, setTitle] = useState(task?.title || '')
  const [dueDate, setDueDate] = useState(task?.due_date || '')
  const [error, setError] = useState('')
  const [saving, setSaving] = useState(false)
  const inputRef = useRef(null)

  useEffect(() => {
    inputRef.current?.focus()
  }, [])

  useEffect(() => {
    function handleKey(event) {
      if (event.key === 'Escape') onClose()
    }
    document.addEventListener('keydown', handleKey)
    return () => document.removeEventListener('keydown', handleKey)
  }, [onClose])

  function validate() {
    const value = title.trim()
    if (!value) return 'O título da tarefa é obrigatório.'
    if (value.length < 3) return 'O título precisa ter pelo menos 3 caracteres.'
    if (value.length > 255) return 'O título não pode passar de 255 caracteres.'
    if (dueDate && dueDate < todayISO()) return 'A data limite não pode ser anterior a hoje.'
    return ''
  }

  async function handleSubmit(event) {
    event.preventDefault()

    const message = validate()
    if (message) {
      setError(message)
      return
    }

    setSaving(true)
    try {
      await onSubmit({ title: title.trim(), dueDate: dueDate || null })
    } catch (err) {
      setError(err.message)
      setSaving(false)
    }
  }

  const titleId = isEdit ? 'edit-task-title' : 'create-task-title'

  return (
    <div className="modal is-open" role="dialog" aria-modal="true" aria-labelledby={titleId}>
      <a
        className="modal__backdrop"
        href="#"
        aria-label="Close"
        onClick={(event) => {
          event.preventDefault()
          onClose()
        }}
      />

      <form className="modal__panel" onSubmit={handleSubmit}>
        <h2 id={titleId}>{isEdit ? 'Edit Task' : 'Create Task'}</h2>

        <label className="field">
          <span>Title</span>
          <input
            ref={inputRef}
            type="text"
            name="title"
            maxLength={255}
            placeholder="What needs to be done?"
            value={title}
            onChange={(event) => setTitle(event.target.value)}
          />
        </label>

        <label className="field">
          <span>
            Due date <small>Optional</small>
          </span>
          <input
            type="date"
            name="due"
            min={todayISO()}
            value={dueDate}
            onChange={(event) => setDueDate(event.target.value)}
          />
        </label>

        {error && (
          <p className="form-error" role="alert">
            {error}
          </p>
        )}

        <div className="modal__foot">
          <button type="button" className="btn btn--ghost" onClick={onClose}>
            Cancel
          </button>
          <button className="btn btn--primary" type="submit" disabled={saving}>
            {saving ? 'Saving...' : isEdit ? 'Save changes' : 'Create task'}
          </button>
        </div>
      </form>
    </div>
  )
}
