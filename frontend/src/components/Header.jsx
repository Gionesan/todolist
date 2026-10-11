import { formatToday } from '../utils/tasks'

export default function Header({ total, completed }) {
  const pct = total > 0 ? Math.round((completed / total) * 100) : 0

  return (
    <header className="head">
      <div>
        <p className="date">{formatToday()}</p>
        <h1>My tasks</h1>
        <p className="counts">
          <span>
            <strong>{total}</strong> total
          </span>
          <span>
            <strong>{completed}</strong> completed
          </span>
        </p>
      </div>

      <div
        className="ring"
        role="progressbar"
        aria-label="Completed tasks"
        aria-valuemin="0"
        aria-valuemax="100"
        aria-valuenow={pct}
        style={{ '--pct': pct }}
      >
        <span>{pct}%</span>
      </div>
    </header>
  )
}
