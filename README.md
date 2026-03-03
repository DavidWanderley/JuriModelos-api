# ⚖️ JuriModelos API (Backend)

O núcleo de processamento e persistência de dados do sistema JuriModelos. Esta API RESTful controla desde a autenticação de advogados até a automação de documentos.

## 🚀 Tecnologias e Ferramentas
* **Node.js & Express:** Ambiente de execução e framework para a construção da API.
* **Sequelize (ORM):** Gerenciamento de banco de dados SQL através de modelos JavaScript, facilitando migrações e consultas.
* **PostgreSQL (Neon.tech):** Banco de dados relacional hospedado na nuvem com foco em escalabilidade.
* **JWT (JSON Web Tokens):** Sistema de autenticação e autorização segura para rotas privadas.
* **Bcrypt.js:** Algoritmo de hashing para armazenamento seguro de senhas.
* **Multer:** Middleware para gerenciamento de uploads de arquivos (Referências em PDF).
* **Dotenv:** Gerenciamento de variáveis de ambiente para segurança de credenciais.

## ✨ Funcionalidades e Regras de Negócio
* **Autenticação Segura:** Login e Registro com geração de tokens de acesso expiráveis.
* **Sincronização de Banco (Sync/Alter):** Atualização dinâmica das colunas de clientes (CPF, RG, Endereço, etc.) sem perda de dados.
* **CRUD de Clientes:** API completa para criação, listagem e atualização de dados de qualificação. 
* **Gestão de Modelos Jurídicos:** Armazenamento de peças processuais com suporte a variáveis dinâmicas `{{...}}`.
* **Servidor de Arquivos Estáticos:** Rota configurada para servir documentos de referência em PDF e arquivos exportados.

## 📁 Estrutura do Projeto
```text
src/
├── config/             # Configurações de conexão (Banco de Dados)
├── controllers/        # Lógica de negócio (clienteController, modeloController)
├── middleware/         # Proteção de rotas (auth.js) e validações
├── models/             # Definição dos Schemas (Cliente, Modelo, Usuario)
├── routes/             # Endpoints da API segregados por módulo
├── uploads/            # Armazenamento de documentos físicos
└── server.js           # Ponto de entrada e inicialização do servidor.
```

## ⚙️ Instalação e Configuração

### 📁 Acesse a pasta do projeto
```bash
cd JuriModelos-api
```

### 📦 Instale as dependências
```bash
npm install
```

### 🔐 Configure o arquivo .env
```env
DATABASE_URL=sua_url_do_neon
JWT_SECRET=sua_chave_secreta
PORT=5000
```

### 🚀 Inicie o servidor
```bash
npm start
```

### ⚠️ Integração com Frontend

O Frontend (JuriModelos-web) espera que este servidor esteja ativo para realizar operações de login, busca de CEP e geração de documentos.

