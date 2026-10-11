import { useCallback, useEffect, useState } from 'react'
import { createTask, deleteTask, listTasks, updateTask } from './api/tasks'
import { isCompleted, sortTasks } from './utils/tasks'
import Header from './components/Header'
import SearchBar from './components/SearchBar'
import TaskList from './components/TaskList'
import TaskModal from './components/TaskModal'
import FloatingButton from './components/FloatingButton'

const SEARCH_DEBOUNCE_MS = 300

export default function App() {
  const [tasks, setTasks] = useState([])
  const [counters, setCounters] = useState({ total: 0, completed: 0 })
  const [search, setSearch] = useState('')
  const [debouncedSearch, setDebouncedSearch] = useState('')
  const [loading, setLoading] = useState(true)
  const [error, setError] = useState('')
  const [modal, setModal] = useState(null)

  // Busca em tempo real com debounce para não sobrecarregar a API.
  useEffect(() => {
    const timer = setTimeout(() => setDebouncedSearch(search.trim()), SEARCH_DEBOUNCE_MS)
    return () => clearTimeout(timer)
  }, [search])

  const load = useCallback(async () => {
    setLoading(true)
    setError('')

    try {
      const data = await listTasks({ search: debouncedSearch })
      setTasks(sortTasks(data.tasks || []))
      setCounters({ total: data.total || 0, completed: data.completed || 0 })
    } catch (err) {
      setError(err.message)
      setTasks([])
      setCounters({ total: 0, completed: 0 })
    } finally {
      setLoading(false)
    }
  }, [debouncedSearch])

  useEffect(() => {
    load()
  }, [load])

  async function handleToggle(task) {
    try {
      await updateTask(task.id, { completed: !isCompleted(task) })
      await load()
    } catch (err) {
      setError(err.message)
    }
  }

  async function handleDelete(task) {
    if (!window.confirm(`Excluir a tarefa "${task.title}"?`)) return

    try {
      await deleteTask(task.id)
      await load()
    } catch (err) {
      setError(err.message)
    }
  }

  async function handleSubmit(values) {
    if (modal && modal.mode === 'edit') {
      await updateTask(modal.task.id, values)
    } else {
      await createTask(values)
    }

    setModal(null)
    await load()
  }

  return (
    <main className="app">
      <Header total={counters.total} completed={counters.completed} />

      <SearchBar value={search} onChange={setSearch} />

      {error && (
        <p className="alert" role="alert">
          {error}
        </p>
      )}

      {!loading && (
        <TaskList
          tasks={tasks}
          onToggle={handleToggle}
          onEdit={(task) => setModal({ mode: 'edit', task })}
          onDelete={handleDelete}
        />
      )}

      <FloatingButton onClick={() => setModal({ mode: 'create' })} />

      {modal && (
        <TaskModal
          mode={modal.mode}
          task={modal.task}
          onClose={() => setModal(null)}
          onSubmit={handleSubmit}
        />
      )}
    </main>
  )
}
