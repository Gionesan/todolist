export default function Header({ total, completed }) {
  const pending = total - completed

  return (
    <header className="header">
      <div className="header-text">
        <h1>My Tasks</h1>
        <p className="subtitle">Organize o seu dia de um jeito simples.</p>
      </div>

      <dl className="counters">
        <div className="counter">
          <dd>{total}</dd>
          <dt>Total</dt>
        </div>
        <div className="counter">
          <dd>{pending}</dd>
          <dt>Pendentes</dt>
        </div>
        <div className="counter">
          <dd>{completed}</dd>
          <dt>Concluídas</dt>
        </div>
      </dl>
    </header>
  )
}
