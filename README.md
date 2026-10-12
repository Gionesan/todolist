# Todolist — React + Fastify + MySQL

Projeto de lista de tarefas desenvolvido para a disciplina de PW3 (Programação Web). A interface fica no React (Vite), a API no Node.js com Fastify e os dados são guardados no MySQL.

## Índice

- [Funcionalidades](#funcionalidades)
- [Regras de negócio](#regras-de-negócio)
- [Tecnologias utilizadas](#tecnologias-utilizadas)
- [Estrutura de pastas](#estrutura-de-pastas)
- [Pré-requisitos](#pré-requisitos)
- [Passo a passo para executar e testar](#passo-a-passo-para-executar-e-testar)
- [Testes automatizados](#testes-automatizados)
- [Checklist de teste manual](#checklist-de-teste-manual)
- [Endpoints da API](#endpoints-da-api)
- [Solução de problemas](#solução-de-problemas)

## Funcionalidades

- Listagem de tarefas em linha do tempo (timeline), com marcador de data em cada item;
- Cabeçalho com a data atual, contadores de **total** e **concluídas** e um **anel de progresso** (%);
- Busca de tarefas em tempo real (com debounce de 300 ms);
- Criação de tarefas via modal ("Create Task"), com data limite opcional;
- Edição de tarefas via modal ("Edit Task") — botão de lápis em cada item;
- Marcar/desmarcar tarefa como concluída (círculo com gradiente);
- Exclusão de tarefas (botões de editar/excluir aparecem ao passar o mouse);
- **Data limite e atraso**: tarefas com data de vencimento no passado e ainda pendentes ficam com o título em vermelho e exibem o selo "Em atraso";
- Ordenação automática: tarefas com data mais próxima aparecem primeiro (sem prazo por último);
- Estado vazio idêntico ao mockup ("You have no pending tasks.");
- Botão flutuante "+" no canto inferior direito.

## Regras de negócio

- O título é obrigatório e deve ter, no mínimo, **3 caracteres** (máximo 255);
- A data limite é **opcional**, mas não pode ser **anterior a hoje**;
- As validações valem tanto no frontend quanto no backend;
- Tarefas sem prazo aparecem por último na listagem.

## Tecnologias utilizadas

| Camada      | Tecnologia                     |
|-------------|--------------------------------|
| Frontend    | React, Vite                    |
| Testes      | Vitest, Testing Library, jsdom |
| Backend     | Node.js, Fastify               |
| Banco       | MySQL                          |
| Cliente SQL | mysql2 (pool de conexões)      |

## Estrutura de pastas

```
todolist/
├── backend/
│   ├── .env                # variáveis de ambiente (copiado de .env.example)
│   ├── .env.example        # exemplo de configuração do backend
│   ├── package.json
│   ├── rotas.http          # requisições de teste da API (VS Code REST Client)
│   ├── schema.sql          # cria o banco e a tabela
│   └── src/
│       ├── db.js           # pool de conexões MySQL
│       ├── server.js       # servidor Fastify
│       └── routes/
│           └── tasks.js    # rotas /api/tasks
├── frontend/
│   ├── index.html
│   ├── package.json
│   ├── vite.config.js
│   ├── vitest.setup.js
│   └── src/
│       ├── main.jsx
│       ├── App.jsx
│       ├── index.css
│       ├── api/
│       │   └── tasks.js    # chamadas HTTP para a API
│       ├── utils/
│       │   └── tasks.js    # datas, ordenação e regras
│       ├── components/
│       │   ├── FloatingButton.jsx
│       │   ├── Header.jsx
│       │   ├── Icons.jsx
│       │   ├── SearchBar.jsx
│       │   ├── TaskItem.jsx
│       │   ├── TaskList.jsx
│       │   └── TaskModal.jsx
│       └── __tests__/
│           └── App.test.jsx
└── README.md
```

## Pré-requisitos

- **Node.js 20+** (verifique com `node -v`)
- **MySQL** — a forma mais simples no Windows é o **XAMPP** (https://www.apachefriends.org)
- (Opcional) **VS Code** com a extensão **REST Client** para testar a API pelo arquivo `backend/rotas.http`

## Passo a passo para executar e testar

> Os comandos abaixo funcionam no **Windows (PowerShell)**. Em Linux/macOS, troque os caminhos do MySQL pelos do seu sistema (ex.: `mysql` direto no PATH).

### Passo 1 — Ligar o MySQL

- Abra o **XAMPP Control Panel** e clique em **Start** no serviço **MySQL**.
- (Alternativa por terminal: `C:\xampp\mysql\bin\mysqld.exe`.)

Para usar o **phpMyAdmin** (`http://localhost/phpmyadmin`) também é preciso clicar em **Start** no **Apache**. Se preferir testar sem o Apache, use a Opção B do próximo passo (pelo terminal).

### Passo 2 — Criar o banco de dados

O backend precisa que o banco `todolist` já exista. Escolha **uma** das opções:

**Opção A — phpMyAdmin (mais fácil):**
1. Abra `http://localhost/phpmyadmin`.
2. Aba **Importar** → **Escolher arquivo** → selecione `backend/schema.sql` → **Executar**.

**Opção B — terminal (PowerShell):**
```powershell
cd backend
Get-Content .\schema.sql | & "C:\xampp\mysql\bin\mysql.exe" -u root
```

**Opção C — terminal (Linux/macOS ou MySQL no PATH):**
```bash
cd backend
mysql -u root < schema.sql
```

O backend também cria a **tabela** automaticamente ao iniciar, caso ela não exista. O **banco** (`todolist`) precisa existir antes.

### Passo 3 — Rodar o backend (API)

Em um terminal:
```bash
cd backend
npm install
npm run dev
```

Você deve ver a mensagem:
```
API do Todolist rodando em http://localhost:3333
```

Teste rápido no navegador: `http://localhost:3333/health` deve retornar `{"status":"ok"}`.

Se necessário, crie o arquivo `backend/.env` copiando o exemplo (`backend/.env.example`):

```powershell
Copy-Item .\backend\.env.example .\backend\.env
```

Conteúdo de `backend/.env`:
```env
PORT=3333
DB_HOST=localhost
DB_PORT=3306
DB_USER=root
DB_PASSWORD=
DB_NAME=todolist
CORS_ORIGIN=http://localhost:5173
```

> Observação: no XAMPP o usuário `root` normalmente **não tem senha**, por isso `DB_PASSWORD=` fica vazio.

### Passo 4 — Rodar o frontend (interface)

Abra **outro terminal** (deixe o backend rodando) e execute:
```bash
cd frontend
npm install
npm run dev
```

Você verá algo como:
```
VITE v8.3.4  ready in ... ms
Local:   http://localhost:5173/
```

Abra **http://localhost:5173** no navegador.

> Por padrão o frontend conversa com `http://localhost:3333`. Para apontar para outra URL, crie `frontend/.env` com `VITE_API_URL=http://localhost:3333`.

## Testes automatizados

Com as dependências instaladas, rode no terminal:
```bash
cd frontend
npm test
```

Resultado esperado:
```
Test Files  1 passed (1)
     Tests  10 passed (10)
```

O que os testes cobrem:

1. Contadores (total/concluídas) e anel de progresso;
2. Estado vazio ("You have no pending tasks.");
3. Selo "Em atraso" apenas em tarefas vencidas e pendentes;
4. Ordenação pelas datas mais próximas (sem prazo por último);
5. Criação de tarefa via modal ("Create Task");
6. Validação do título antes de criar;
7. Edição via modal ("Edit Task") pelo botão de lápis;
8. Marcar/desmarcar como concluída;
9. Exclusão com confirmação;
10. Busca em tempo real com debounce.

Para rodar em modo "watch" (re-executa ao salvar arquivos):
```bash
npm run test:watch
```

Para gerar a versão de produção (opcional):
```bash
npm run build
```

## Checklist de teste manual

Com o backend e o frontend rodando, abra **http://localhost:5173** e verifique:

- **Cabeçalho**: mostra a data atual, os contadores de total/concluídas e o anel de progresso (%).
- **Criar**: clique no botão flutuante **"+"**, digite um título (mínimo 3 letras) e, se quiser, escolha uma data. Clique em **Create task** → a tarefa aparece na lista e o anel avança.
- **Validar título curto**: tente criar com menos de 3 letras → aparece "O título precisa ter pelo menos 3 caracteres." e nada é criado.
- **Validar data no passado**: escolha uma data anterior a hoje e salve → aparece "A data limite não pode ser anterior a hoje.".
- **Concluir**: clique no círculo à esquerda da tarefa → ele ganha o gradiente, o título fica riscado e o anel avança.
- **Desmarcar**: clique de novo no círculo → a tarefa volta a ficar pendente.
- **Editar**: passe o mouse na tarefa → surgem o **lápis** e a **lixeira**. Clique no lápis, altere o título/prazo e salve em **Save changes**.
- **Excluir**: clique na lixeira e confirme → a tarefa some da lista.
- **Em atraso**: tarefas pendentes com data no passado ficam com o **título em vermelho** e o selo **"Em atraso"**.
- **Busca com debounce**: digite na barra "Search tasks" → a lista filtra sozinha (com um pequeno atraso), sem apertar Enter.
- **Estado vazio**: exclua todas as tarefas → aparece "You have no pending tasks." com o ícone de check.

## Endpoints da API

| Método | Rota             | Descrição                                                   |
|--------|------------------|-------------------------------------------------------------|
| GET    | `/health`        | Verifica se a API está no ar                                |
| GET    | `/api/tasks`     | Lista tarefas (`?search=`, `?status=`)                      |
| POST   | `/api/tasks`     | Cria uma tarefa (`{ title, dueDate? }`)                     |
| PATCH  | `/api/tasks/:id` | Atualiza parcialmente (`{ completed?, title?, dueDate? }`)  |
| DELETE | `/api/tasks/:id` | Exclui uma tarefa                                           |

### Exemplos

**Criar tarefa**
```http
POST http://localhost:3333/api/tasks
Content-Type: application/json

{
  "title": "Estudar Fastify",
  "dueDate": "2026-12-20"
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

Os exemplos acima também estão no arquivo `backend/rotas.http`, que pode ser executado com a extensão **REST Client** do VS Code.

## Solução de problemas

| Sintoma | Causa provável | Solução |
|---------|----------------|---------|
| `Error: connect ECONNREFUSED` no backend | MySQL não está rodando | Inicie o MySQL no XAMPP (Passo 1) |
| `Unknown database 'todolist'` | O banco não foi criado | Execute o `backend/schema.sql` (Passo 2) |
| Frontend mostra "Não foi possível falar com o servidor." | Backend desligado ou porta errada | Rode o backend (Passo 3) e confira `http://localhost:3333/health` |
| Erro de CORS no navegador | `CORS_ORIGIN` diferente da URL do frontend | Ajuste `CORS_ORIGIN=http://localhost:5173` no `backend/.env` |
| `EADDRINUSE` (porta em uso) | Já existe algo na porta 3333/5173 | Feche o outro processo ou troque a porta |
