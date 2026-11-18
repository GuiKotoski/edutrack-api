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

**Estado:** ownership e autenticação estão implementados nas rotas de professores e alunos. O rate limit foi ajustado para contabilizar todas as solicitações de cadastro e login, incluindo as bem-sucedidas; cadastro exige senha com pelo menos 12 caracteres e o padrão de expiração do JWT é 15 minutos. No Compose, HTTPS é exigido por padrão, enquanto `.env.example` mantém a opção HTTP explícita para desenvolvimento local. A suíte de testes já havia passado antes destes ajustes; ela ainda precisa ser executada novamente para validar esta revisão.

A auditoria executada em 2026-11-18 encontrou zero vulnerabilidades no lockfile isolado da imagem runtime. A auditoria do lockfile completo apontou 3 entradas altas ligadas à cadeia `prisma@6 → @prisma/config → deepmerge-ts` e 19 moderadas, concentradas nas dependências de desenvolvimento. A tarefa de migration contém o CLI e deve continuar isolada, sem porta pública, com execução controlada. Repetir a auditoria antes de cada publicação.

A Sprint 11.5 permanece aberta até a hospedagem validar HTTPS, armazenamento de segredos, banco privado, rate limit compartilhado se houver múltiplas instâncias, backups criptografados e restauração. Também faltam decisões documentadas sobre minimização, acesso e retenção dos dados de alunos, logs de auditoria e resposta a incidentes. Não usar dados reais até esses itens serem concluídos.

#### Risco residual aceito para desenvolvimento

O alerta [GHSA-ggr8-5vv4-36mx](https://github.com/advisories/GHSA-ggr8-5vv4-36mx) descreve esgotamento de pilha ao mesclar objetos cíclicos recursivos. Esse requisito não pode ser produzido por um corpo JSON HTTP comum; o caminho afetado é a configuração processada pelo CLI do Prisma. Como o Prisma 7 não é compatível com a aplicação neste momento, mantemos o Prisma 6 e aceitamos temporariamente esse risco somente em desenvolvimento, testes e migrations controladas a partir do repositório revisado.

**Controles compensatórios:** o CLI não está na imagem que serve requisições; a imagem de runtime foi auditada sem vulnerabilidades; a tarefa de migration não expõe portas e acessa o banco pela rede privada do Compose. Não usar a imagem de migration como serviço público nem processar configuração Prisma não revisada. Reavaliar este risco antes de qualquer deploy com dados reais ou quando houver correção compatível com Prisma 6.

**Responsável pela revisão:** mantenedor do projeto. **Prazo:** antes de disponibilizar o serviço com dados reais. A Sprint 12 pode preparar a infraestrutura e validar o deploy sem dados reais enquanto esses controles são concluídos.

**Escopo:**

- vincular usuários aos professores ou instituições e aplicar autorização em todas as operações de leitura, criação, atualização e remoção;
- cobrir com testes que uma conta não acessa nem altera os dados de outra;
- exigir HTTPS, guardar `JWT_SECRET` e credenciais do banco no gerenciador de segredos da hospedagem, configurar expiração dos JWTs e manter o banco sem acesso público;
- limitar tentativas de login e cadastro e revisar as vulnerabilidades das dependências antes da publicação;
- configurar backups criptografados e restritos, e testar a restauração;
- definir quais dados de alunos são necessários, quem pode acessá-los e por quanto tempo serão mantidos; preparar logs de auditoria sem senhas, tokens ou dados pessoais desnecessários e um procedimento para incidentes.

### Sprint 12 — Deploy 🔄 Em andamento

Preparar um deploy de staging para portfólio, usando apenas dados fictícios, e validar a API e o banco hospedados. A configuração inicial será para Railway Free, sem tratar esse plano como adequado a dados reais ou disponibilidade de produção.

**Plataforma escolhida para staging:** Railway Free. O plano concede US$ 1 mensal em uso e interrompe os serviços ao consumir o limite; workloads podem dormir. O PostgreSQL gratuito tem volume de 0,5 GB. Use somente dados fictícios e não dependa desse ambiente como armazenamento permanente nem como backup testado.

Configure o health check e o comando de migration pré-deploy nas opções do serviço Railway. O CLI do Prisma é obtido apenas no contêiner isolado dessa etapa; a imagem que atende requisições não o inclui. O schema e as migrations ficam disponíveis na imagem para a execução controlada. O Railway está migrando sua configuração versionada para IaC TypeScript; nesta primeira configuração, os comandos ficam no painel.

**Critérios de saída:** deploy HTTPS acessível, conexão da API ao PostgreSQL por rede privada, migrations aplicadas, endpoints básicos validados com dados fictícios, segredos configurados no painel e limite de instâncias em uma para manter o rate limit em processo eficaz. Antes de uso comercial: escolher plano com retenção e backups, testar restauração e concluir os itens operacionais da Sprint 11.5.

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
