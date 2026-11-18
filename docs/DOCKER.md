# Executar o EduTrack com Docker

## Pré-requisitos

- Docker Engine;
- Docker Compose v2 (`docker compose`).

## Iniciar a API e o PostgreSQL

Na raiz do repositório, crie seu arquivo local de configuração sem sobrescrever um `.env` que já exista:

```bash
cp .env.example .env
```

Edite `.env` e substitua `JWT_SECRET` por um segredo aleatório. Por exemplo, gere um com `openssl rand -base64 32`. Se alterar `POSTGRES_PASSWORD`, use apenas letras, números e `-._~`, pois a senha também é inserida na URL de conexão do Prisma. As credenciais de banco de exemplo servem apenas para desenvolvimento local. O exemplo define `REQUIRE_HTTPS=false` para facilitar o uso local; não mantenha esse valor em produção.

Inicie os serviços:

```bash
docker compose up --build
```

O Compose aguarda o PostgreSQL ficar saudável e executa o serviço temporário `migrate` com `prisma migrate deploy`. Só depois da conclusão das migrations inicia a API, cuja imagem contém apenas dependências de runtime. Para o uso local descrito aqui, mantenha `REQUIRE_HTTPS=false`; a API fica disponível em `http://localhost:3001` e a documentação Swagger UI em `http://localhost:3001/docs`. Sem essa configuração, o padrão de produção exige HTTPS.

Para executar em segundo plano:

```bash
docker compose up --build -d
```

Ver logs:

```bash
docker compose logs -f api
```

Parar os containers, mantendo os dados do PostgreSQL:

```bash
docker compose down
```

Para apagar também os dados persistidos do banco de desenvolvimento:

```bash
docker compose down --volumes
```

## Configuração

As variáveis usadas pelo Compose vêm de `.env`. `API_PORT` e `DB_PORT` permitem trocar as portas expostas no host. Por padrão, a API fica disponível em `127.0.0.1:3001` e o PostgreSQL do Compose em `127.0.0.1:5433`, evitando conflito com serviços locais que já usem `3000` ou `5432`. A API acessa o banco pela rede privada do Compose usando o nome de serviço `db` e a porta interna `5432`.

O `.env` é ignorado pelo Git e pelo Docker build. Não use os valores de exemplo em ambientes compartilhados ou de produção.

`docker/package.runtime.json` e `docker/package.runtime-lock.json` listam somente as dependências da imagem da API, sem o CLI opcional do Prisma. Ao alterar dependências de runtime, atualize esses dois arquivos e valide a imagem com `docker compose build api`.

## Preparação para produção

- configure `JWT_SECRET` com pelo menos 32 caracteres aleatórios e guarde-o, junto das credenciais do banco, no gerenciador de segredos da hospedagem;
- configure `JWT_EXPIRES_IN` com uma duração curta adequada à aplicação (o padrão agora é `15m`);
- mantenha `REQUIRE_HTTPS=true` em produção e configure o proxy da hospedagem para encaminhar corretamente o protocolo HTTPS; o Compose também exige HTTPS por padrão;
- execute migrations como uma tarefa de implantação controlada; o CLI do Prisma fica na etapa de migration e não na imagem da API;
- mantenha o banco em rede privada e configure backups criptografados; teste periodicamente a restauração;
- o limite de 10 solicitações por IP a cada 15 minutos inclui tentativas de cadastro e login, inclusive as bem-sucedidas. Ele é local ao processo; mantenha uma única instância até configurar um armazenamento compartilhado de rate limit.

A migration de propriedade mantém registros antigos com `ownerId` vazio. Eles não aparecem nas rotas autenticadas; associe-os a uma conta por um processo administrativo controlado antes de voltar a utilizá-los.
