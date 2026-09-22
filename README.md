# Todolist — React + Fastify + MySQL

Sistema web completo de lista de tarefas (*todolist*) full stack, com interface em **React (Vite)**, API em **Node.js (Fastify)** e banco de dados **MySQL**. Projeto avaliativo da disciplina de Programação Web.

## Funcionalidades

- Criar tarefa com título e data limite (prazo opcional);
- Listar tarefas pendentes e concluídas;
- Buscar tarefas pelo nome em tempo real;
- Filtrar por todas / pendentes / concluídas;
- Marcar tarefa como concluída ou reabri-la;
- Editar o título e o prazo de uma tarefa;
- Excluir tarefas;
- Painel com totais, pendentes e concluídas;
- Destaque visual para prazos vencidos (atrasadas).

## Regras de negócio

- O título é obrigatório e deve ter, no mínimo, **3 caracteres** (máximo 255);
- A data limite é **opcional**, mas não pode ser **anterior a hoje**;
- As validações são aplicadas no **backend** (fonte da verdade) e no **frontend** (para melhor experiência);
- Tarefas sem prazo aparecem por último na listagem.

## Tecnologias utilizadas

| Camada    | Tecnologia        |
|-----------|-------------------|
| Frontend  | React, Vite       |
| Backend   | Node.js, Fastify  |
| Banco     | MySQL             |
| Cliente SQL | mysql2 (pool de conexões) |

## Pré-requisitos

- Node.js 20+
- MySQL (ex.: XAMPP, WAMP ou instalado separadamente)
- VS Code (recomendado) com a extensão **REST Client** para testar a API

## Como executar

### 1. Banco de dados

Subindo o MySQL, execute o script `backend/schema.sql` para criar o banco e a tabela:

```sql
mysql -u root -p < schema.sql
```

O backend também cria a tabela automaticamente ao iniciar (caso ainda não exista).

### 2. Backend

```bash
cd backend
npm install
npm run dev
```

A API sobe em `http://localhost:3333`.

Configure as variáveis de ambiente caso necessário (crie/ajuste o arquivo `backend/.env`):

```env
PORT=3333
DB_HOST=localhost
DB_PORT=3306
DB_USER=root
DB_PASSWORD=
DB_NAME=todolist
CORS_ORIGIN=http://localhost:5173
```

### 3. Frontend

```bash
cd frontend
npm install
npm run dev
```

A interface sobe em `http://localhost:5173`.

## Endpoints da API

| Método | Rota                 | Descrição                              |
|--------|----------------------|----------------------------------------|
| GET    | `/health`            | Verifica se a API está no ar           |
| GET    | `/api/tasks`         | Lista tarefas (`?search=`, `?status=`) |
| POST   | `/api/tasks`         | Cria uma tarefa (`{ title, dueDate? }`)|
| PATCH  | `/api/tasks/:id`     | Atualiza parcialmente (`{ completed? , title?, dueDate? }`) |
| DELETE | `/api/tasks/:id`     | Exclui uma tarefa                      |

### Exemplos

**Criar tarefa**

```http
POST http://localhost:3333/api/tasks
Content-Type: application/json

{
  "title": "Estudar Fastify",
  "dueDate": "2026-09-20"
}
```

**Marcar como concluída**

```http
PATCH http://localhost:3333/api/tasks/1
Content-Type: application/json

{
  "completed": true
}
```

**Excluir tarefa**

```http
DELETE http://localhost:3333/api/tasks/1
```

## Estrutura de pastas

```
todolist/
├── backend/
│   ├── .env
│   ├── rotas.http
│   ├── schema.sql
│   └── src/
│       ├── db.js
│       ├── server.js
│       └── routes/
│           └── tasks.js
├── frontend/
│   ├── index.html
│   └── src/
│       ├── main.js
│       └── style.css
└── README.md
```