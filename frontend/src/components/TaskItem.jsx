import { formatDate, isCompleted, isOverdue } from '../utils/tasks'

export default function TaskItem({ task, onToggle, onEdit, onDelete }) {
  const done = isCompleted(task)
  const overdue = isOverdue(task)

  return (
    <li className={`task${done ? ' done' : ''}`}>
      <label className="checkbox">
        <input
          type="checkbox"
          checked={done}
          onChange={() => onToggle(task)}
          aria-label={`Marcar "${task.title}" como concluída`}
        />
        <span className="checkbox-mark" aria-hidden="true" />
      </label>

      <div className="task-main">
        <p className={`task-title${overdue ? ' overdue' : ''}`}>{task.title}</p>

        <div className="task-meta">
          {task.due_date ? (
            <span className="task-due">Vence em {formatDate(task.due_date)}</span>
          ) : (
            <span className="task-due">Sem prazo</span>
          )}

          {overdue && <span className="badge-overdue">Em atraso</span>}
        </div>
      </div>

      <div className="task-actions">
        <button
          type="button"
          className="icon-btn"
          aria-label={`Editar tarefa "${task.title}"`}
          title="Editar"
          onClick={() => onEdit(task)}
        >
          <svg viewBox="0 0 24 24" aria-hidden="true">
            <path d="M4 20h4l10-10-4-4L4 16v4z" />
            <path d="M13.5 6.5l4 4" />
          </svg>
        </button>

        <button
          type="button"
          className="icon-btn danger"
          aria-label={`Excluir tarefa "${task.title}"`}
          title="Excluir"
          onClick={() => onDelete(task)}
        >
          <svg viewBox="0 0 24 24" aria-hidden="true">
            <path d="M4 7h16" />
            <path d="M9 7V5h6v2" />
            <path d="M6 7l1 13h10l1-13" />
            <path d="M10 11v6M14 11v6" />
          </svg>
        </button>
      </div>
    </li>
  )
}
