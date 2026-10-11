export default function FloatingButton({ onClick }) {
  return (
    <button type="button" className="fab" aria-label="Criar tarefa" title="Criar tarefa" onClick={onClick}>
      <svg viewBox="0 0 24 24" aria-hidden="true">
        <line x1="12" y1="5" x2="12" y2="19" />
        <line x1="5" y1="12" x2="19" y2="12" />
      </svg>
    </button>
  )
}
