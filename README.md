FinanceControl

Sistema de controle financeiro pessoal desenvolvido para gerenciamento de receitas, despesas e categorias financeiras.

O projeto está sendo desenvolvido com foco em boas práticas de desenvolvimento de APIs REST, organização em camadas, banco de dados relacional, versionamento com Git e documentação, servindo também como projeto de portfólio para demonstração de conhecimentos em desenvolvimento de sistemas.

 Sobre o projeto

O FinanceControl tem como objetivo permitir que usuários possam registrar e acompanhar suas movimentações financeiras de forma organizada.

A aplicação foi planejada utilizando uma arquitetura separada em responsabilidades, facilitando a manutenção, evolução e testes do sistema.

Entre as funcionalidades previstas estão:

Cadastro de categorias de receitas e despesas
Cadastro de transações financeiras
Controle de receitas e despesas
Consulta de movimentações
Filtros por período e categoria
Cálculo de saldo financeiro
Dashboard com informações financeiras
Autenticação de usuários
Controle de acesso
Validação de dados
Tratamento centralizado de erros
Testes automatizados
Documentação da API
 Tecnologias utilizadas
Backend
JavaScript
Node.js
Express
SQLite
better-sqlite3
JWT
bcrypt
dotenv
Desenvolvimento e testes
Insomnia
Jest
Supertest
Swagger / OpenAPI
PowerShell
Versionamento e infraestrutura
Git
GitHub
Docker
Docker Compose
Frontend
HTML5
CSS3
JavaScript
 Arquitetura do projeto

O backend utiliza uma organização baseada na separação de responsabilidades:

finance-control/
│
├── backend/
│   ├── src/
│   │   ├── config/
│   │   ├── controllers/
│   │   ├── database/
│   │   ├── middlewares/
│   │   ├── repositories/
│   │   ├── routes/
│   │   ├── services/
│   │   ├── utils/
│   │   └── app.js
│   │
│   ├── tests/
│   ├── .env
│   ├── .env.example
│   ├── .gitignore
│   ├── package.json
│   └── server.js
│
├── frontend/
│   ├── css/
│   ├── js/
│   └── index.html
│
├── database/
│   ├── financecontrol.db
│   ├── schema.sql
│   └── seed.sql
│
├── docs/
│   └── api.md
│
├── docker-compose.yml
├── README.md
└── .gitignore
Organização das camadas

Routes

Responsáveis por definir os endpoints disponíveis na API.

Controllers

Responsáveis por receber as requisições HTTP e retornar as respostas.

Services

Responsáveis pelas regras de negócio da aplicação.

Repositories

Responsáveis pela comunicação com o banco de dados.

Middlewares

Responsáveis por comportamentos intermediários da aplicação, como tratamento de erros e autenticação.

Database

Contém a configuração da conexão, estrutura das tabelas e dados iniciais.

 Banco de dados

O projeto utiliza SQLite como banco de dados.

A estrutura inicial possui entidades para:

Usuários
Categorias
Transações

Relacionamentos principais:

Users
  │
  └──< Transactions >── Categories

As transações possuem relacionamento com o usuário e com a categoria utilizada na movimentação financeira.

O banco local financecontrol.db não é versionado no Git, pois é um arquivo de desenvolvimento local.

A estrutura do banco pode ser recriada através dos arquivos:

database/schema.sql
database/seed.sql
 API

Atualmente, o projeto possui o módulo de Categorias implementado.

Categorias
Método	Endpoint	Descrição
GET	/api/categories	Lista todas as categorias
GET	/api/categories/:id	Consulta uma categoria
POST	/api/categories	Cria uma categoria
PUT	/api/categories/:id	Atualiza uma categoria
DELETE	/api/categories/:id	Exclui uma categoria
Exemplo

Criar uma categoria:

POST /api/categories
Content-Type: application/json
{
    "name": "Investimentos",
    "type": "expense"
}

Tipos disponíveis:

income
expense

Validação e tratamento de erros

A API possui validações básicas para impedir o cadastro de dados inválidos.

Exemplos:

Nome da categoria obrigatório
Tipo da categoria limitado a income ou expense
Retorno 400 para dados inválidos
Retorno 404 quando o recurso não é encontrado
Tratamento centralizado de erros através de middleware

Exemplo de resposta:

{
    "error": "Categoria não encontrada."
}

 Como executar o projeto
 
Pré-requisitos

Antes de executar o projeto, é necessário possuir instalado:

Node.js
npm
Git
1. Clonar o repositório
git clone https://github.com/jhonnygse1702-creator/finance-control.git
2. Acessar o backend
cd finance-control/backend
3. Instalar as dependências
npm install
4. Inicializar o banco
npm run db:init
5. Iniciar a API
npm start

A API ficará disponível em:

http://localhost:3000

Para verificar se o servidor está funcionando:

http://localhost:3000

Resposta esperada:

{
    "message": "FinanceControl API funcionando!"
}
 Testando a API

As requisições podem ser realizadas utilizando ferramentas como:

Insomnia
Postman
PowerShell
Curl

Exemplo utilizando PowerShell:

Invoke-RestMethod http://localhost:3000/api/categories

Para criar uma categoria:

Invoke-RestMethod `
    -Method Post `
    -Uri "http://localhost:3000/api/categories" `
    -ContentType "application/json" `
    -Body '{"name":"Investimentos","type":"expense"}'
 Scripts disponíveis

Dentro da pasta backend:

npm start

Inicia o servidor.

npm run dev

Inicia o servidor utilizando o modo de desenvolvimento do Node.js.

npm run db:init

Inicializa a estrutura do banco de dados e insere os dados iniciais.

npm test

Executa os testes automatizados.

 Roadmap

O projeto será desenvolvido de forma incremental.

 Etapa 1 — Estrutura inicial

Criar estrutura do projeto

Configurar Node.js

Configurar Express

Configurar Git

Criar repositório no GitHub

 Etapa 2 — Banco de dados

Configurar SQLite

Criar schema

Criar seed

Configurar conexão com banco

 Etapa 3 — Categorias

Listar categorias

Consultar categoria por ID

Criar categoria

Atualizar categoria

Excluir categoria

Validação de dados

Tratamento de erros

 Etapa 4 — Transações

Criar transação

Listar transações

Consultar transação por ID

Atualizar transação

Excluir transação

Validação das transações

 Etapa 5 — Controle financeiro

Cálculo de receitas

Cálculo de despesas

Cálculo do saldo

Resumo financeiro

Filtros por período

Filtros por categoria

 Etapa 6 — Frontend

Criar interface

Dashboard financeiro

Formulário de receitas

Formulário de despesas

Listagem de transações

Filtros

 Etapa 7 — Autenticação

Cadastro de usuários

Hash de senhas com bcrypt

Login

JWT

Middleware de autenticação

Controle de acesso por usuário

 Etapa 8 — Qualidade

Validações avançadas

Tratamento de erros

Testes unitários

Testes de integração

Jest

Supertest

 Etapa 9 — Documentação

Swagger / OpenAPI

Documentação dos endpoints

Exemplos de requisições

Documentação de instalação

 Etapa 10 — Deploy

Dockerfile

Docker Compose

Configuração de produção

Deploy da aplicação

Configuração de variáveis de ambiente

 Segurança

Informações sensíveis não devem ser armazenadas diretamente no código-fonte.

Arquivos como .env estão protegidos pelo .gitignore.

Exemplo:

.env
*.db
*.db-shm
*.db-wal

O projeto também prevê a utilização de:

bcrypt para armazenamento seguro de senhas
JWT para autenticação
variáveis de ambiente
validação de entradas
controle de acesso
 Objetivos de aprendizado

Este projeto também possui finalidade educacional e de desenvolvimento profissional.

Entre os principais conceitos praticados estão:

Desenvolvimento de APIs REST
Node.js
Express
JavaScript
Arquitetura em camadas
Repository Pattern
Regras de negócio
Banco de dados relacional
SQL
SQLite
HTTP e métodos REST
Status codes
Tratamento de erros
Git e GitHub
Testes automatizados
Autenticação
Documentação de APIs
Docker
 Autor

Jhonny Eugenio

Projeto desenvolvido para estudo, prática e construção de portfólio profissional na área de desenvolvimento de sistemas.

 Licença

Este projeto está em desenvolvimento e pode ser utilizado para fins de estudo e aprendizado.
