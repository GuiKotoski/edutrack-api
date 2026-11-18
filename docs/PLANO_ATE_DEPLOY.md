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

> **Sprint atual: 11.5 — Segurança**

### Sprint 8 — Zod e tratamento de erros ✅ Concluída

**Objetivo:** validar os dados recebidos pela API e padronizar o tratamento de erros.

**Escopo:**

- validar e-mail, senha, nomes, idade e disciplina;
- validar os dados de professores, alunos e associações;
- centralizar o tratamento de erros.

### Sprint 8.5 — Factories de dados de teste ✅ Concluída

**Objetivo:** automatizar a geração de dados para testes.

**Implementação atual:** factories síncronas com identificadores únicos de `node:crypto`.

### Sprint 9 — Testes completos ✅ Concluída

**Cobertura:** autenticação, professores, alunos, relacionamentos, validação e erros.

**Objetivo:** cobrir os fluxos principais e os cenários de erro. Meta inicial: pelo menos 80% de cobertura. A suíte alcançou 95,94% de statements e 96,31% de linhas.

### Sprint 10 — Swagger/OpenAPI ✅ Concluída

Documentar os endpoints, parâmetros, respostas e exemplos de uso da API. A especificação está em `docs/openapi.json`, disponível em `/openapi.json`, com Swagger UI em `/docs`.

### Sprint 11 — Docker ✅ Concluída

Containerizar a aplicação e documentar como executá-la localmente com seus serviços necessários. As instruções estão em `docs/DOCKER.md`; Docker Compose inicia a API e PostgreSQL.

### Sprint 11.5 — Segurança 🔄 Em andamento

**Objetivo:** proteger os dados acadêmicos e preparar a aplicação para um deploy seguro. Não publicar o EduTrack com dados reais até concluir e validar este escopo.

**Estado:** controles de ownership, autenticação e rate limit implementados; migration aplicada e 38 testes passaram no ambiente local. A imagem de runtime da API separa o CLI do Prisma e reportou zero vulnerabilidades no build. A auditoria completa ainda aponta uma cadeia alta `prisma@6 → @prisma/config → deepmerge-ts` (contada em 3 entradas) e 19 moderadas na árvore de desenvolvimento. A tarefa de migration continua contendo o CLI vulnerável, mas roda isolada, sem porta pública e apenas com código revisado. A sprint continua aberta até validar os controles operacionais na hospedagem.

#### Risco residual aceito para desenvolvimento

O alerta [GHSA-ggr8-5vv4-36mx](https://github.com/advisories/GHSA-ggr8-5vv4-36mx) descreve esgotamento de pilha ao mesclar objetos cíclicos recursivos. Esse requisito não pode ser produzido por um corpo JSON HTTP comum; o caminho afetado é a configuração processada pelo CLI do Prisma. Como o Prisma 7 não é compatível com a aplicação neste momento, mantemos o Prisma 6 e aceitamos temporariamente esse risco somente em desenvolvimento, testes e migrations controladas a partir do repositório revisado.

**Controles compensatórios:** o CLI não está na imagem que serve requisições; a imagem de runtime foi auditada sem vulnerabilidades; a tarefa de migration não expõe portas e acessa o banco pela rede privada do Compose. Não usar a imagem de migration como serviço público nem processar configuração Prisma não revisada. Reavaliar este risco antes de qualquer deploy com dados reais ou quando houver correção compatível com Prisma 6.

**Responsável pela revisão:** mantenedor do projeto. **Prazo:** antes da Sprint 12 — Deploy.

**Escopo:**

- vincular usuários aos professores ou instituições e aplicar autorização em todas as operações de leitura, criação, atualização e remoção;
- cobrir com testes que uma conta não acessa nem altera os dados de outra;
- exigir HTTPS, guardar `JWT_SECRET` e credenciais do banco no gerenciador de segredos da hospedagem, configurar expiração dos JWTs e manter o banco sem acesso público;
- limitar tentativas de login e cadastro e revisar as vulnerabilidades das dependências antes da publicação;
- configurar backups criptografados e restritos, e testar a restauração;
- definir quais dados de alunos são necessários, quem pode acessá-los e por quanto tempo serão mantidos; preparar logs de auditoria sem senhas, tokens ou dados pessoais desnecessários e um procedimento para incidentes.

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
