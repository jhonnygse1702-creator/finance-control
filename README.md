FinanceControl

Sistema de controle financeiro pessoal, com autenticação, cadastro de categorias, lançamento de transações (receitas e despesas) e um resumo financeiro mensal (dashboard).

Projeto desenvolvido como parte do meu portfólio, aplicando conceitos de back-end com Node.js/Express, persistência em banco de dados relacional (SQLite) e front-end em HTML, CSS e JavaScript puro (sem frameworks).

Funcionalidades

- **Autenticação** com login e proteção das rotas por token (JWT)
- **Categorias**: cadastro, edição, exclusão e pesquisa de categorias de receita/despesa
- **Transações**: cadastro, edição, exclusão e pesquisa por palavra-chave
- **Dashboard**: resumo financeiro (receitas, despesas e saldo) filtrado por mês
- Interface responsiva, adaptada para desktop e mobile

Tecnologias utilizadas

**Back-end**
- Node.js
- Express
- SQLite
- JWT (autenticação)

**Front-end**
- HTML5
- CSS3
- JavaScript (Vanilla)

 Estrutura do projeto

```
finance-control/
├── backend/
│   ├── server.js
│   └── src/
│       ├── app.js
│       ├── routes/
│       ├── controllers/
│       ├── models/
│       └── middlewares/
└── frontend/
    ├── index.html
    ├── css/
    │   └── style.css
    └── js/
        └── app.js
```

Como rodar o projeto localmente

 Pré-requisitos
- [Node.js](https://nodejs.org/) instalado (versão 18 ou superior recomendada)

Passo a passo

1. Clone o repositório:
```bash
git clone https://github.com/jhonnygse1702-creator/finance-control.git
cd finance-control
```

2. Instale as dependências:
```bash
npm install
```

3. Configure as variáveis de ambiente (crie um arquivo `.env` na raiz do `backend/`, se aplicável ao seu projeto):
```
PORT=3000
JWT_SECRET=sua_chave_secreta
```

4. Inicie o servidor:
```bash
cd backend
node server.js
```

5. Acesse no navegador:
```
http://localhost:3000
```

 Rotas da API

| Método | Rota | Descrição |
|--------|------|-----------|
| POST | `/api/auth/login` | Autentica o usuário e retorna um token |
| GET | `/api/auth/me` | Retorna os dados do usuário autenticado |
| GET | `/api/categories` | Lista as categorias |
| POST | `/api/categories` | Cadastra uma nova categoria |
| PUT | `/api/categories/:id` | Atualiza uma categoria |
| DELETE | `/api/categories/:id` | Remove uma categoria |
| GET | `/api/transactions` | Lista as transações |
| POST | `/api/transactions` | Cadastra uma nova transação |
| PUT | `/api/transactions/:id` | Atualiza uma transação |
| DELETE | `/api/transactions/:id` | Remove uma transação |
| GET | `/api/dashboard?month=YYYY-MM` | Retorna o resumo financeiro do mês |

 Autor

Desenvolvido por Jhonny.
