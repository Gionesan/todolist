# Todolist — React + Fastify + MySQL

Projeto de lista de tarefas (Programação Web). A **interface** é feita em React com Vite, a **API** em Node.js com Fastify e os dados ficam no **MySQL**.

## O que você vai precisar

- **Node.js 20 ou superior** — confira com `node -v`
- **MySQL** — no Windows, a forma mais simples é o **XAMPP** (https://www.apachefriends.org)
- Os arquivos do projeto (este repositório)

## Como rodar o projeto (passo a passo)

> Os comandos abaixo são para **Windows (PowerShell)**. Em Linux/macOS, troque `C:\xampp\mysql\bin\mysql.exe` por `mysql` (se estiver no PATH).

### Passo 1 — Ligar o MySQL

1. Abra o **XAMPP Control Panel**.
2. Clique em **Start** no serviço **MySQL**.
3. (Se quiser usar o phpMyAdmin, clique também em **Start** no **Apache**.)

### Passo 2 — Criar o banco de dados

Escolha **uma** das opções:

**Opção A — phpMyAdmin (mais fácil):**
1. Abra `http://localhost/phpmyadmin`.
2. Clique na aba **Importar** → **Escolher arquivo** → selecione o arquivo `backend/schema.sql` → **Executar**.

**Opção B — pelo terminal:**
```powershell
cd backend
Get-Content .\schema.sql | & "C:\xampp\mysql\bin\mysql.exe" -u root
```

Isso cria o banco `todolist` e a tabela `tasks`.

### Passo 3 — Rodar o backend (API)

Abra um terminal **na pasta do projeto** e rode:
```bash
cd backend
npm install
npm run dev
```

Deve aparecer:
```
API do Todolist rodando em http://localhost:3333
```

Deixe **este terminal aberto**. Para testar, abra no navegador: `http://localhost:3333/health` → deve aparecer `{"status":"ok"}`.

### Configuração do banco (só se precisar)

Se a senha/usuário do seu MySQL forem diferentes, crie o arquivo `backend/.env` copiando o exemplo:

```powershell
cd backend
Copy-Item .env.example .env
```

O conteúdo fica assim:
```env
PORT=3333
DB_HOST=localhost
DB_PORT=3306
DB_USER=root
DB_PASSWORD=
DB_NAME=todolist
CORS_ORIGIN=http://localhost:5173
```

> No XAMPP o usuário `root` normalmente **não tem senha**, por isso `DB_PASSWORD=` fica vazio.

### Passo 4 — Rodar o frontend (interface)

Abra **outro terminal** (deixe o backend rodando) e execute:
```bash
cd frontend
npm install
npm run dev
```

Vai aparecer algo como:
```
Local:   http://localhost:5173/
```

### Passo 5 — Abrir e testar no navegador

Abra **http://localhost:5173** no navegador. Depois:

1. Clique no botão **"+"** (canto inferior direito) para criar uma tarefa. Digite o nome (mínimo 3 letras) e, se quiser, uma data. Clique em **Create task**.
2. Marque o **círculo** à esquerda de uma tarefa para concluí-la (o anel do topo avança).
3. Passe o mouse sobre a tarefa para ver o **lápis** (editar) e a **lixeira** (excluir).
4. Digite na barra **"Search tasks"** para filtrar em tempo real.
5. Crie uma tarefa com data no passado para ver o **título em vermelho** e o selo **"Em atraso"**.
6. Exclua todas as tarefas para ver o estado vazio **"You have no pending tasks."**.

## Funcionalidades

- Listagem de tarefas em linha do tempo, com contadores e anel de progresso;
- Busca de tarefas em tempo real;
- Criar tarefas via modal (**Create Task**), com data limite opcional;
- Editar tarefas via modal (**Edit Task**);
- Marcar/desmarcar como concluída;
- Excluir tarefas;
- Tarefas pendentes com data vencida ficam com o título em vermelho e o selo **"Em atraso"**;
- Ordenação pelas datas mais próximas (sem prazo por último);
- Botão flutuante **"+"**.

## Endpoints da API

| Método | Rota             | Descrição                                                   |
|--------|------------------|-------------------------------------------------------------|
| GET    | `/health`        | Verifica se a API está no ar                                |
| GET    | `/api/tasks`     | Lista tarefas (`?search=`, `?status=`)                      |
| POST   | `/api/tasks`     | Cria uma tarefa (`{ title, dueDate? }`)                     |
| PATCH  | `/api/tasks/:id` | Atualiza parcialmente (`{ completed?, title?, dueDate? }`)  |
| DELETE | `/api/tasks/:id` | Exclui uma tarefa                                           |

Os exemplos de requisições estão no arquivo `backend/rotas.http` (pode ser usado com a extensão **REST Client** do VS Code).

## Se algo não funcionar

| Problema | Solução |
|----------|---------|
| `connect ECONNREFUSED` no backend | O MySQL não está ligado → volte ao Passo 1 |
| `Unknown database 'todolist'` | O banco não foi criado → refaça o Passo 2 |
| O front diz "Não foi possível falar com o servidor." | O backend não está rodando → refaça o Passo 3 |
| Erro de CORS no navegador | Confira `CORS_ORIGIN=http://localhost:5173` no `backend/.env` |
| `EADDRINUSE` (porta em uso) | Feche o outro programa que usa a porta 3333 ou 5173 |
