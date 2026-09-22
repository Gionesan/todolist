import { pool } from '../db.js';

const TASK_FIELDS = 'id, title, completed, due_date, created_at';

export default async function tasksRoutes(app) {
  // Listar tarefas, com busca por título e filtro de status opcionais.
  app.get('/api/tasks', async (request, reply) => {
    const search = request.query.search || '';
    const status = request.query.status || 'all';

    let sql = `SELECT ${TASK_FIELDS} FROM tasks WHERE title LIKE ?`;
    const params = [`%${search}%`];

    if (status === 'pending') {
      sql += ' AND completed = 0';
    } else if (status === 'completed') {
      sql += ' AND completed = 1';
    }

    // Sem prazo por último; com prazo, das mais próximas para as mais distantes.
    sql += ' ORDER BY due_date IS NULL, due_date ASC, created_at DESC';

    const [rows] = await pool.query(sql, params);

    const [[totals]] = await pool.query(
      'SELECT COUNT(*) AS total, COALESCE(SUM(completed = 1), 0) AS completed FROM tasks'
    );

    return reply.send({
      tasks: rows,
      total: totals.total,
      completed: Number(totals.completed) || 0
    });
  });

  // Criar uma nova tarefa.
  app.post('/api/tasks', async (request, reply) => {
    const { title, dueDate } = request.body || {};

    if (!title || !title.trim()) {
      return reply.status(400).send({ message: 'O nome da tarefa é obrigatório.' });
    }

    const [result] = await pool.query(
      'INSERT INTO tasks (title, completed, due_date) VALUES (?, 0, ?)',
      [title.trim(), dueDate || null]
    );

    const [[task]] = await pool.query(
      `SELECT ${TASK_FIELDS} FROM tasks WHERE id = ?`,
      [result.insertId]
    );

    return reply.status(201).send(task);
  });

  // Atualizar uma tarefa parcialmente (ex.: marcar como concluída ou editar).
  app.patch('/api/tasks/:id', async (request, reply) => {
    const { id } = request.params;
    const { completed, title, dueDate } = request.body || {};

    const [[existing]] = await pool.query('SELECT id FROM tasks WHERE id = ?', [id]);

    if (!existing) {
      return reply.status(404).send({ message: 'Tarefa não encontrada.' });
    }

    const fields = [];
    const values = [];

    if (typeof completed === 'boolean') {
      fields.push('completed = ?');
      values.push(completed ? 1 : 0);
    }

    if (typeof title === 'string' && title.trim()) {
      fields.push('title = ?');
      values.push(title.trim());
    }

    if (dueDate !== undefined) {
      fields.push('due_date = ?');
      values.push(dueDate || null);
    }

    if (fields.length === 0) {
      return reply.status(400).send({ message: 'Nada para atualizar.' });
    }

    values.push(id);
    await pool.query(`UPDATE tasks SET ${fields.join(', ')} WHERE id = ?`, values);

    const [[task]] = await pool.query(
      `SELECT ${TASK_FIELDS} FROM tasks WHERE id = ?`,
      [id]
    );

    return reply.send(task);
  });

  // Excluir uma tarefa.
  app.delete('/api/tasks/:id', async (request, reply) => {
    const { id } = request.params;

    const [result] = await pool.query('DELETE FROM tasks WHERE id = ?', [id]);

    if (result.affectedRows === 0) {
      return reply.status(404).send({ message: 'Tarefa não encontrada.' });
    }

    return reply.status(204).send();
  });
}