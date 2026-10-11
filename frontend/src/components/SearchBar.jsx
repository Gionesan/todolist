import Icon from './Icons'

export default function SearchBar({ value, onChange }) {
  return (
    <label className="search">
      <Icon name="search" />
      <input
        type="search"
        placeholder="Search tasks"
        autoComplete="off"
        aria-label="Search tasks"
        value={value}
        onChange={(event) => onChange(event.target.value)}
      />
    </label>
  )
}
