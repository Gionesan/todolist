import TaskItem from './TaskItem'

export default function TaskList({ tasks, loading, onToggle, onEdit, onDelete }) {
  if (loading) {
    return (
      <p className="state" role="status">
        Carregando tarefas...
      </p>
    )
  }

  if (tasks.length === 0) {
    return <p className="state empty">You have no pending tasks.</p>
  }

  return (
    <ul className="task-list">
      {tasks.map((task) => (
        <TaskItem
          key={task.id}
          task={task}
          onToggle={onToggle}
          onEdit={onEdit}
          onDelete={onDelete}
        />
      ))}
    </ul>
  )
}
