# Executar o EduTrack com Docker

## Pré-requisitos

- Docker Engine;
- Docker Compose v2 (`docker compose`).

## Iniciar a API e o PostgreSQL

Na raiz do repositório, crie seu arquivo local de configuração sem sobrescrever um `.env` que já exista:

```bash
cp .env.example .env
```

Edite `.env` e substitua `JWT_SECRET` por um segredo aleatório. Por exemplo, gere um com `openssl rand -base64 32`. Se alterar `POSTGRES_PASSWORD`, use apenas letras, números e `-._~`, pois a senha também é inserida na URL de conexão do Prisma. As credenciais de banco de exemplo servem apenas para desenvolvimento local.

Inicie os serviços:

```bash
docker compose up --build
```

O Compose aguarda o PostgreSQL ficar saudável. Em seguida, o container da API aplica as migrations com `prisma migrate deploy` e inicia o servidor. A API fica disponível em `http://localhost:3000`; a documentação Swagger UI, em `http://localhost:3000/docs`.

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

As variáveis usadas pelo Compose vêm de `.env`. `API_PORT` e `DB_PORT` permitem trocar as portas expostas no host. A API e o PostgreSQL ficam acessíveis apenas pelo loopback (`127.0.0.1`); a API acessa o banco pela rede privada do Compose usando o nome de serviço `db`.

O `.env` é ignorado pelo Git e pelo Docker build. Não use os valores de exemplo em ambientes compartilhados ou de produção.
