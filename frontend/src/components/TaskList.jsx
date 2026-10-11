import Icon from './Icons'
import TaskItem from './TaskItem'

export default function TaskList({ tasks, onToggle, onEdit, onDelete }) {
  if (tasks.length === 0) {
    return (
      <div className="empty" id="empty-state">
        <span className="empty__mark">
          <Icon name="check" />
        </span>
        <p>You have no pending tasks.</p>
      </div>
    )
  }

  return (
    <ul className="tasks" id="task-list">
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
