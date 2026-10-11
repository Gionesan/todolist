const BASE_URL = (import.meta.env.VITE_API_URL || 'http://localhost:3333').replace(/\/$/, '')
const API_URL = `${BASE_URL}/api/tasks`

async function handleResponse(response) {
  if (!response.ok) {
    let message = 'Não foi possível falar com o servidor.'
    try {
      const data = await response.json()
      if (data && data.message) message = data.message
    } catch {
      // resposta sem corpo JSON: mantém a mensagem padrão
    }
    throw new Error(message)
  }

  if (response.status === 204) return null
  return response.json()
}

export async function listTasks({ search = '', status = 'all' } = {}) {
  const params = new URLSearchParams()
  if (status && status !== 'all') params.set('status', status)
  if (search) params.set('search', search)

  const query = params.toString()
  const response = await fetch(query ? `${API_URL}?${query}` : API_URL)
  return handleResponse(response)
}

export function createTask({ title, dueDate }) {
  return fetch(API_URL, {
    method: 'POST',
    headers: { 'Content-Type': 'application/json' },
    body: JSON.stringify({ title, dueDate: dueDate || null })
  }).then(handleResponse)
}

export function updateTask(id, changes) {
  const body = { ...changes }
  if ('dueDate' in body) body.dueDate = body.dueDate || null

  return fetch(`${API_URL}/${id}`, {
    method: 'PATCH',
    headers: { 'Content-Type': 'application/json' },
    body: JSON.stringify(body)
  }).then(handleResponse)
}

export function deleteTask(id) {
  return fetch(`${API_URL}/${id}`, { method: 'DELETE' }).then(handleResponse)
}
