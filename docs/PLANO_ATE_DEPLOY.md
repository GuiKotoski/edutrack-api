# EduTrack — visão geral e plano de evolução

## Visão geral

O **EduTrack** é uma plataforma de monitoramento acadêmico desenvolvida para facilitar o acompanhamento do desempenho dos alunos por professores e instituições de ensino.

O objetivo principal é centralizar informações acadêmicas em um único sistema, permitindo que professores acompanhem seus estudantes, registrem notas e monitorem a evolução escolar ao longo do tempo.

## Problema

Em muitas escolas, o acompanhamento do desempenho dos alunos ainda é realizado de forma fragmentada, com:

- planilhas isoladas;
- anotações manuais;
- sistemas complexos;
- informações dispersas.

Isso dificulta a visualização do progresso dos estudantes e torna mais lento o processo de identificação de dificuldades de aprendizagem.

## Solução

O EduTrack oferece uma plataforma simples e organizada para o gerenciamento acadêmico. Por meio do sistema, será possível:

- cadastrar professores e alunos;
- vincular alunos aos professores;
- registrar notas;
- acompanhar o desempenho acadêmico;
- gerar indicadores de evolução;
- consultar o histórico escolar.

Tudo será disponibilizado por uma API REST integrada a uma interface web moderna.

## Público-alvo

### Professores

Podem acompanhar o desempenho dos estudantes.

### Coordenação pedagógica

Pode visualizar indicadores gerais das turmas e identificar alunos com baixo rendimento.

### Instituições de ensino

Podem centralizar informações acadêmicas em uma única plataforma.

## Objetivos do sistema

### Objetivo geral

Facilitar o acompanhamento acadêmico dos alunos.

### Objetivos específicos

- reduzir o trabalho manual dos professores;
- organizar informações acadêmicas;
- melhorar a comunicação entre professores e coordenação;
- identificar alunos em situação de risco acadêmico;
- disponibilizar métricas e relatórios.

## Arquitetura atual

### Tecnologias

- Node.js
- Express
- PostgreSQL
- Prisma ORM
- JWT
- bcryptjs
- Jest
- Supertest

### Fluxo da aplicação

```text
Routes → Controllers → Services → Prisma → PostgreSQL
```

## Modelagem atual

### User

Responsável pela autenticação.

```text
User
├── id
├── name
├── email
├── password
└── createdAt
```

### Teacher

Representa o professor.

```text
Teacher
├── id
├── name
├── subject
└── createdAt
```

### Student

Representa o aluno.

```text
Student
├── id
├── name
├── age
├── teacherId
└── createdAt
```

### Relacionamento atual

```text
Teacher (1)
    │
    ▼
Student (N)
```

Um professor pode ter vários alunos, e cada aluno pertence a, no máximo, um professor.

## Funcionalidades implementadas

### Autenticação

- Cadastro: `POST /auth/register`
- Login: `POST /auth/login`
- Tecnologias: JWT e bcryptjs.

### Professores

CRUD completo:

- `GET /teachers`
- `GET /teachers/:id`
- `POST /teachers`
- `PUT /teachers/:id`
- `DELETE /teachers/:id`

### Alunos

CRUD completo:

- `GET /students`
- `GET /students/:id`
- `POST /students`
- `PUT /students/:id`
- `DELETE /students/:id`

### Relacionamento professor–aluno

- Buscar professor com seus alunos: `GET /teachers/:id`
- Listar alunos de um professor: `GET /teachers/:id/students`
- Cadastrar aluno para um professor: `POST /teachers/:id/students`

## Roadmap de sprints

> **Sprint atual: 8.5 — Faker e factories**

### Sprint 8 — Zod e tratamento de erros ✅ Concluída

**Objetivo:** validar os dados recebidos pela API e padronizar o tratamento de erros.

**Escopo:**

- validar e-mail, senha, nomes, idade e disciplina;
- validar os dados de professores, alunos e associações;
- centralizar o tratamento de erros.

### Sprint 8.5 — Faker e factories 🔄 Em andamento

**Objetivo:** automatizar a geração de dados para testes.

**Tecnologia:** `@faker-js/faker`.

### Sprint 9 — Testes completos ⏳ Planejada

**Cobertura prevista:** autenticação, professores, alunos e relacionamentos.

**Objetivo:** cobrir os fluxos principais e os cenários de erro. Meta inicial: pelo menos 80% de cobertura.

### Sprint 10 — Swagger/OpenAPI ⏳ Planejada

Documentar os endpoints, parâmetros, respostas e exemplos de uso da API.

### Sprint 11 — Docker ⏳ Planejada

Containerizar a aplicação e documentar como executá-la localmente com seus serviços necessários.

### Sprint 12 — Deploy ⏳ Planejada

Publicar a API e o banco de dados em uma plataforma de hospedagem.

**Plataformas em avaliação:**

- Render;
- Railway.

### Sprint 13 — Sistema de notas ⏳ Planejada

Adicionar uma entidade para registrar notas:

```text
Grade
├── id
├── value
├── studentId
├── subject
└── createdAt
```

**Funcionalidades previstas:**

- lançar e editar notas;
- consultar notas;
- calcular médias.

### Sprint 14 — Dashboard acadêmico ⏳ Planejada

Adicionar indicadores para acompanhar o desempenho acadêmico:

- média por aluno;
- média por turma;
- ranking acadêmico;
- desempenho geral.

## Visão do frontend

O frontend consumirá a API do EduTrack. Tecnologias sugeridas:

- React;
- Vite;
- React Router;
- Axios;
- Tailwind CSS.

### Fluxo do professor

```text
Login
  ↓
Dashboard
  ↓
Visualizar turmas
  ↓
Selecionar aluno
  ↓
Consultar notas
  ↓
Cadastrar ou atualizar notas
  ↓
Acompanhar evolução
```

### Telas previstas

- **Login:** autenticação do usuário.
- **Dashboard:** resumo dos indicadores acadêmicos.
- **Professores:** listagem e cadastro.
- **Alunos:** listagem e cadastro.
- **Perfil do aluno:** histórico completo do estudante.
- **Notas:** registro e consulta de avaliações.
- **Relatórios:** visualização do desempenho acadêmico.

## Objetivo final

Transformar o EduTrack em uma plataforma completa de acompanhamento acadêmico, permitindo que professores tenham uma visão clara do desempenho dos estudantes e tomem decisões pedagógicas com mais rapidez e com base em dados.
