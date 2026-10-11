import Icon from './Icons'
import { dayMonth, isCompleted, isOverdue } from '../utils/tasks'

export default function TaskItem({ task, onToggle, onEdit, onDelete }) {
  const done = isCompleted(task)
  const overdue = isOverdue(task)
  const when = task.due_date ? dayMonth(task.due_date) : null

  const classes = ['task']
  if (done) classes.push('task--done')
  if (overdue) classes.push('task--overdue')

  return (
    <li className={classes.join(' ')}>
      {when ? (
        <time className="when" dateTime={task.due_date}>
          <b>{when.day}</b>
          {when.month}
        </time>
      ) : (
        <span className="when when--none">No date</span>
      )}

      <label className="check">
        <input
          type="checkbox"
          checked={done}
          onChange={() => onToggle(task)}
          aria-label={done ? 'Mark as pending' : 'Mark as completed'}
        />
        <span className="check__box">
          <Icon name="check" />
        </span>
      </label>

      <div className="task__body">
        <p className="task__title">{task.title}</p>
        {overdue && <span className="badge">Em atraso</span>}
      </div>

      <div className="task__actions">
        <button
          type="button"
          className="icon-btn"
          aria-label="Edit task"
          title="Edit"
          onClick={() => onEdit(task)}
        >
          <Icon name="edit" />
        </button>
        <button
          type="button"
          className="icon-btn icon-btn--danger"
          aria-label="Delete task"
          title="Delete"
          onClick={() => onDelete(task)}
        >
          <Icon name="trash" />
        </button>
      </div>
    </li>
  )
}
