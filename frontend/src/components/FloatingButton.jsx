import Icon from './Icons'

export default function FloatingButton({ onClick }) {
  return (
    <button type="button" className="fab" aria-label="Create task" title="Create task" onClick={onClick}>
      <Icon name="plus" />
    </button>
  )
}
