# ⚖️ JuriModelos API

Backend da plataforma **JuriModelos**, um sistema jurídico completo desenvolvido para auxiliar escritórios de advocacia na gestão de processos, clientes, documentos e controle de acesso de usuários.

> ⚠️ **Este repositório é apenas o backend.** Para utilizar todas as funcionalidades da plataforma, é necessário também rodar o repositório do frontend: [jurimodelos-app](https://github.com/seu-usuario/jurimodelos-app)

---

## 🚀 Tecnologias

| Tecnologia | Uso |
|---|---|
| Node.js + Express 5 | Ambiente de execução e framework da API |
| Sequelize 6 (ORM) | Mapeamento e sincronização com o banco de dados |
| PostgreSQL (Neon.tech) | Banco de dados relacional em nuvem |
| JWT (jsonwebtoken) | Autenticação e autorização via tokens |
| Bcrypt.js | Hash seguro de senhas |
| Multer | Upload de arquivos PDF |
| SendGrid API | Envio de e-mails transacionais |
| Winston | Logs estruturados |
| node-cron | Agendamento de tarefas (notificações) |
| html-to-docx | Geração de documentos Word |
| express-rate-limit | Proteção contra abuso de requisições |
| Dotenv | Gerenciamento de variáveis de ambiente |

---

## ✨ Funcionalidades

### 🔐 Autenticação
- Registro de novos usuários com validação de CPF e e-mail únicos
- Login com geração de token JWT (expiração de 1h)
- Renovação automática de token quando restam menos de 15 minutos (header `X-New-Token`)
- Recuperação de senha via e-mail com link tokenizado (válido por 1h)
- Redefinição de senha com invalidação automática do token

### 👥 Controle de Acesso (RBAC)
- Sistema de perfis (Roles): **admin**, **advogado**, **estagiário**
- 26 permissões granulares por recurso e ação (`clientes.create`, `modelos.delete`, etc.)
- Middleware de verificação de permissão por rota
- Admin pode alterar o perfil de qualquer usuário
- Admin pode ativar ou desativar usuários
- Admin pode atualizar as permissões de cada perfil em tempo real

### 👤 Gestão de Usuários (Admin)
- Listagem completa de usuários com seus perfis e permissões
- Atualização de dados e perfil de acesso
- Ativação e desativação de contas
- Exclusão de usuários

### 🗂️ Clientes
- CRUD completo de clientes com qualificação jurídica
- Campos: nome, CPF/CNPJ, RG, estado civil, profissão, nacionalidade, endereço completo
- Busca automática de endereço por CEP (integração com ViaCEP)
- Clientes vinculados ao usuário que os cadastrou

### 📋 Modelos (Processos)
- Armazenamento de peças processuais reais
- Campos: título, categoria, descrição, conteúdo, jurisdição, complexidade, base legal, tags, data/hora de audiência
- Upload de PDF de referência
- Filtros por categoria e complexidade

### ⚙️ Templates (Textos Pré-determinados)
- Textos jurídicos padrão com variáveis dinâmicas `{{nome}}`, `{{cpf}}`, etc.
- Separado dos modelos para não misturar processos reais com modelos prontos
- Campos: título, categoria, descrição, conteúdo, variáveis (JSON), tags, status ativo/inativo
- Base para geração automática de documentos

### 📄 Documentos Gerados
- Geração de documentos Word (.docx) a partir de templates
- Substituição automática de variáveis pelos dados do cliente
- Arquivamento no histórico digital vinculado ao usuário

### 📅 Eventos / Agenda
- Cadastro de eventos e audiências
- Notificações automáticas por e-mail via cron job

### 📊 Estatísticas
- Endpoint de dashboard com contagens de clientes, modelos, templates e documentos gerados

---

## 📁 Estrutura do Projeto

```
src/
├── config/             # Banco de dados, CORS, autenticação, logger
├── controllers/        # Lógica de negócio por módulo
├── middlewares/        # Auth JWT, permissões RBAC, rate limit, error handler
├── models/             # Schemas Sequelize (User, Role, Permission, Cliente, Modelo, Template, DocumentoGerado)
├── routes/             # Endpoints segregados por módulo
├── scripts/            # Scripts utilitários (reset, migração)
├── seeders/            # Dados iniciais de roles e permissões
├── services/           # E-mail (SendGrid), notificações (cron)
├── util/               # ApiResponse, httpStatus, messages
└── server.js           # Ponto de entrada
uploads/
├── gerados/            # Documentos Word gerados
└── *.pdf               # PDFs de referência dos modelos
```

---

## ⚙️ Instalação e Configuração

### Pré-requisitos
- Node.js 18+
- Conta no [Neon.tech](https://neon.tech) (PostgreSQL)
- Conta no [SendGrid](https://sendgrid.com) (e-mails)

### 1. Clone o repositório
```bash
git clone https://github.com/seu-usuario/jurimodelos-api.git
cd jurimodelos-api
```

### 2. Instale as dependências
```bash
npm install
```

### 3. Configure o arquivo `.env`
```env
DATABASE_URL=sua_url_do_neon
JWT_SECRET=sua_chave_secreta_jwt
PORT=5000
FRONTEND_URL=http://localhost:5173
SENDGRID_API_KEY=sua_chave_sendgrid
MAIL_USER=seu@email.com
NODE_ENV=development
```

### 4. Inicialize o banco de dados
```bash
# Cria os perfis (admin, advogado, estagiário) e as 26 permissões
npm run seed
```

### 5. Inicie o servidor
```bash
# Desenvolvimento
npm run dev

# Produção
npm start
```

---

## 🛠️ Scripts Disponíveis

| Comando | Descrição |
|---|---|
| `npm start` | Inicia o servidor em produção |
| `npm run dev` | Inicia com nodemon (hot reload) |
| `npm run seed` | Popula roles e permissões no banco |
| `npm run migrate` | Atualiza usuários existentes com perfil padrão |
| `npm run reset-rbac` | Reseta e recria as tabelas de controle de acesso |

---

## 🔌 Endpoints da API

| Método | Rota | Descrição | Auth |
|---|---|---|---|
| `GET` | `/health` | Status da API | ❌ |
| `POST` | `/api/auth/register` | Registro de usuário | ❌ |
| `POST` | `/api/auth/login` | Login | ❌ |
| `POST` | `/api/auth/forgot-password` | Solicitar recuperação de senha | ❌ |
| `POST` | `/api/auth/reset-password` | Redefinir senha | ❌ |
| `GET` | `/api/clientes` | Listar clientes | ✅ |
| `POST` | `/api/clientes` | Criar cliente | ✅ |
| `PUT` | `/api/clientes/:id` | Atualizar cliente | ✅ |
| `DELETE` | `/api/clientes/:id` | Deletar cliente | ✅ |
| `GET` | `/api/modelos` | Listar modelos | ✅ |
| `POST` | `/api/modelos` | Criar modelo | ✅ |
| `PUT` | `/api/modelos/:id` | Atualizar modelo | ✅ |
| `DELETE` | `/api/modelos/:id` | Deletar modelo | ✅ |
| `GET` | `/api/templates` | Listar templates | ✅ |
| `POST` | `/api/templates` | Criar template | ✅ |
| `PUT` | `/api/templates/:id` | Atualizar template | ✅ |
| `DELETE` | `/api/templates/:id` | Deletar template | ✅ |
| `GET` | `/api/documentos` | Listar documentos gerados | ✅ |
| `POST` | `/api/documentos` | Gerar documento | ✅ |
| `GET` | `/api/usuarios` | Listar usuários (admin) | ✅ |
| `GET` | `/api/usuarios/roles` | Listar perfis de acesso | ✅ |
| `GET` | `/api/usuarios/permissions` | Listar permissões | ✅ |
| `PUT` | `/api/usuarios/:id` | Atualizar dados do usuário | ✅ |
| `PUT` | `/api/usuarios/:id/role` | Alterar perfil do usuário (admin) | ✅ |
| `PUT` | `/api/usuarios/:id/toggle-status` | Ativar/desativar usuário (admin) | ✅ |
| `DELETE` | `/api/usuarios/:id` | Deletar usuário (admin) | ✅ |
| `PUT` | `/api/usuarios/roles/:roleId/permissions` | Atualizar permissões de um perfil (admin) | ✅ |
| `GET` | `/api/stats` | Estatísticas do dashboard | ✅ |
| `GET` | `/api/buscar-cep/:cep` | Busca de endereço por CEP | ✅ |
| `GET` | `/api/eventos` | Listar eventos da agenda | ✅ |
| `POST` | `/api/eventos` | Criar evento | ✅ |

---

## 🌐 Deploy

A API está configurada para deploy no **Render**.

Variáveis de ambiente necessárias no Render:
- `DATABASE_URL`
- `JWT_SECRET`
- `FRONTEND_URL` (URL do Vercel, ex: `https://juri-modelos-app.vercel.app`)
- `SENDGRID_API_KEY`
- `MAIL_USER`
- `NODE_ENV=production`

---

## 🔗 Repositório Frontend

Para utilizar todas as funcionalidades da plataforma, é necessário rodar o frontend em conjunto com esta API:

👉 [jurimodelos-app](https://github.com/seu-usuario/jurimodelos-app) — Interface React + Vite + TailwindCSS

---

## 📄 Licença

Uso interno -  David Wanderley. Todos os direitos reservados.
