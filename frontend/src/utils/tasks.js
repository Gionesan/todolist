// Data de hoje no formato YYYY-MM-DD (horário local).
export function todayISO() {
  const now = new Date()
  const month = String(now.getMonth() + 1).padStart(2, '0')
  const day = String(now.getDate()).padStart(2, '0')
  return `${now.getFullYear()}-${month}-${day}`
}

// Ex.: "Sunday, Oct 11" para o cabeçalho.
export function formatToday() {
  return new Date().toLocaleDateString('en-US', {
    weekday: 'long',
    month: 'short',
    day: 'numeric'
  })
}

// A API do MySQL devolve `completed` como 0/1; normaliza para boolean.
export function isCompleted(task) {
  return Boolean(Number(task.completed))
}

// Tarefa pendente com data limite já vencida.
export function isOverdue(task) {
  if (isCompleted(task) || !task.due_date) return false
  return task.due_date < todayISO()
}

const MONTHS = ['Jan', 'Feb', 'Mar', 'Apr', 'May', 'Jun', 'Jul', 'Aug', 'Sep', 'Oct', 'Nov', 'Dec']

// Quebra 'YYYY-MM-DD' em { day: '08', month: 'Oct' } para a linha do tempo.
export function dayMonth(iso) {
  const [, month, day] = iso.split('-').map(Number)
  return { day: String(day).padStart(2, '0'), month: MONTHS[month - 1] }
}

// Converte 'YYYY-MM-DD' em 'DD/MM/YYYY'.
export function formatDate(iso) {
  if (!iso) return ''
  const [year, month, day] = iso.split('-')
  return `${day}/${month}/${year}`
}

// Mais próximas primeiro; tarefas sem prazo ficam por último.
export function sortTasks(tasks) {
  return [...tasks].sort((a, b) => {
    if (a.due_date && b.due_date) return a.due_date.localeCompare(b.due_date)
    if (a.due_date) return -1
    if (b.due_date) return 1
    return 0
  })
}
