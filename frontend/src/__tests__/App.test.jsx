import { afterEach, beforeEach, describe, expect, it, vi } from 'vitest'
import { cleanup, fireEvent, render, screen, waitFor, within } from '@testing-library/react'
import App from '../App'

const API = 'http://localhost:3333/api/tasks'

function jsonResponse(data, ok = true, status = 200) {
  return { ok, status, json: () => Promise.resolve(data) }
}

function mockApi({ tasks = [], total = tasks.length, completed = 0 } = {}) {
  const calls = []

  global.fetch = vi.fn((url, options = {}) => {
    const method = options.method || 'GET'
    calls.push({
      url: String(url),
      method,
      body: options.body ? JSON.parse(options.body) : undefined
    })

    if (method === 'GET') return Promise.resolve(jsonResponse({ tasks, total, completed }))
    if (method === 'POST') return Promise.resolve(jsonResponse({ id: 99 }, true, 201))
    if (method === 'PATCH') return Promise.resolve(jsonResponse({ id: 1 }))
    if (method === 'DELETE') return Promise.resolve(jsonResponse(null, true, 204))
    return Promise.resolve(jsonResponse({}, false, 404))
  })

  return calls
}

const tasks = [
  { id: 1, title: 'Pagar aluguel', completed: 0, due_date: '2030-01-10' },
  { id: 2, title: 'Regar plantas', completed: 1, due_date: null },
  { id: 3, title: 'Enviar relatório', completed: 0, due_date: '2020-05-01' }
]

beforeEach(() => {
  vi.restoreAllMocks()
})

afterEach(() => {
  cleanup()
  vi.restoreAllMocks()
})

describe('Todolist frontend', () => {
  it('mostra os contadores de total e concluídas e o anel de progresso', async () => {
    mockApi({ tasks, total: 3, completed: 1 })
    render(<App />)

    await screen.findByText('Pagar aluguel')

    expect(screen.getByText('3').closest('span')).toHaveTextContent('total')
    expect(screen.getByText('1').closest('span')).toHaveTextContent('completed')

    const ring = screen.getByRole('progressbar')
    expect(ring).toHaveAttribute('aria-valuenow', '33')
    expect(ring).toHaveTextContent('33%')
  })

  it('mostra o estado vazio quando não há tarefas', async () => {
    mockApi({ tasks: [] })
    render(<App />)

    expect(await screen.findByText('You have no pending tasks.')).toBeInTheDocument()
  })

  it('destaca tarefas atrasadas com o selo "Em atraso"', async () => {
    mockApi({ tasks, total: 3, completed: 1 })
    render(<App />)

    const overdueTitle = await screen.findByText('Enviar relatório')
    const item = overdueTitle.closest('li')
    expect(item).toHaveClass('task--overdue')
    expect(within(item).getByText('Em atraso')).toBeInTheDocument()

    expect(screen.getByText('Pagar aluguel').closest('li')).not.toHaveClass('task--overdue')
    expect(screen.queryByText('Em atraso')).toHaveTextContent('Em atraso')
    expect(screen.getAllByText('Em atraso')).toHaveLength(1)
  })

  it('ordena as tarefas pela data mais próxima, sem prazo por último', async () => {
    mockApi({ tasks, total: 3, completed: 1 })
    render(<App />)

    await screen.findByText('Pagar aluguel')

    const titulos = screen
      .getAllByRole('listitem')
      .map((item) => item.querySelector('.task__title').textContent)

    expect(titulos).toEqual(['Enviar relatório', 'Pagar aluguel', 'Regar plantas'])
  })

  it('abre o modal "Create Task" pelo botão flutuante e envia a nova tarefa', async () => {
    const calls = mockApi({ tasks: [] })
    render(<App />)

    await screen.findByText('You have no pending tasks.')

    fireEvent.click(screen.getByRole('button', { name: 'Create task' }))
    const dialog = screen.getByRole('dialog')
    expect(dialog).toBeInTheDocument()
    expect(screen.getByRole('heading', { name: 'Create Task' })).toBeInTheDocument()

    fireEvent.change(within(dialog).getByLabelText('Title'), { target: { value: 'Nova tarefa' } })
    fireEvent.change(within(dialog).getByLabelText(/Due date/), { target: { value: '2030-06-01' } })
    fireEvent.click(within(dialog).getByRole('button', { name: 'Create task' }))

    await waitFor(() => {
      const post = calls.find((call) => call.method === 'POST')
      expect(post).toBeTruthy()
      expect(post.body).toEqual({ title: 'Nova tarefa', dueDate: '2030-06-01' })
    })
  })

  it('valida o título antes de criar a tarefa', async () => {
    const calls = mockApi({ tasks: [] })
    render(<App />)

    await screen.findByText('You have no pending tasks.')
    fireEvent.click(screen.getByRole('button', { name: 'Create task' }))
    const dialog = screen.getByRole('dialog')

    fireEvent.change(within(dialog).getByLabelText('Title'), { target: { value: 'ab' } })
    fireEvent.click(within(dialog).getByRole('button', { name: 'Create task' }))

    expect(await screen.findByText(/pelo menos 3 caracteres/)).toBeInTheDocument()
    expect(calls.find((call) => call.method === 'POST')).toBeUndefined()
  })

  it('abre o modal "Edit Task" com o lápis e salva a edição', async () => {
    const calls = mockApi({ tasks, total: 3, completed: 1 })
    render(<App />)

    const titulo = await screen.findByText('Pagar aluguel')
    const item = titulo.closest('li')

    fireEvent.click(within(item).getByRole('button', { name: 'Edit task' }))
    expect(screen.getByRole('heading', { name: 'Edit Task' })).toBeInTheDocument()

    const titleField = screen.getByLabelText('Title')
    expect(titleField).toHaveValue('Pagar aluguel')

    fireEvent.change(titleField, { target: { value: 'Pagar aluguel e luz' } })
    fireEvent.click(screen.getByRole('button', { name: 'Save changes' }))

    await waitFor(() => {
      const patch = calls.find((call) => call.method === 'PATCH')
      expect(patch).toBeTruthy()
      expect(patch.body).toEqual({ title: 'Pagar aluguel e luz', dueDate: '2030-01-10' })
    })
  })

  it('marca e desmarca uma tarefa como concluída', async () => {
    const calls = mockApi({ tasks, total: 3, completed: 1 })
    render(<App />)

    const titulo = await screen.findByText('Pagar aluguel')
    const checkbox = within(titulo.closest('li')).getByRole('checkbox')

    fireEvent.click(checkbox)

    await waitFor(() => {
      const patch = calls.find((call) => call.method === 'PATCH')
      expect(patch).toBeTruthy()
      expect(patch.body).toEqual({ completed: true })
    })
  })

  it('exclui uma tarefa confirmando no navegador', async () => {
    vi.spyOn(window, 'confirm').mockReturnValue(true)
    const calls = mockApi({ tasks, total: 3, completed: 1 })
    render(<App />)

    const titulo = await screen.findByText('Regar plantas')
    const item = titulo.closest('li')

    fireEvent.click(within(item).getByRole('button', { name: 'Delete task' }))

    await waitFor(() => {
      const del = calls.find((call) => call.method === 'DELETE')
      expect(del).toBeTruthy()
      expect(del.url).toBe('http://localhost:3333/api/tasks/2')
    })
  })

  it('busca tarefas com debounce', async () => {
    const calls = mockApi({ tasks, total: 3, completed: 1 })
    render(<App />)

    await screen.findByText('Pagar aluguel')

    fireEvent.change(screen.getByRole('searchbox'), { target: { value: 'relatorio' } })

    await waitFor(
      () => {
        const search = calls.find((call) => call.url.includes('search=relatorio'))
        expect(search).toBeTruthy()
      },
      { timeout: 1000 }
    )
  })
})
