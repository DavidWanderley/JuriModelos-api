# JuriModelos ⚖️

O **JuriModelos** é uma ferramenta jurídica.

## 🚀 Funcionalidades

- **CRUD de Modelos:** Criação, edição, listagem e exclusão de modelos jurídicos.
- **Motor de Substituição (Replace):** Identifica tags como `{{nome_cliente}}` no texto e as substitui por dados reais.
- **Formulários Dinâmicos:** (Em desenvolvimento) Geração automática de inputs baseada nas variáveis do modelo.
- **Persistência:** Integração com banco de dados PostgreSQL (via Neon) utilizando Sequelize.

## 🛠️ Tecnologias Utilizadas

### Back-end
- [Node.js](https://nodejs.org/)
- [Express](https://expressjs.com/)
- [Sequelize (ORM)](https://sequelize.org/)
- [PostgreSQL](https://www.postgresql.org/)

### Front-end
- [React](https://reactjs.org/)
- [Axios](https://axios-http.com/)

## 📋 Estrutura da API (Endpoints)

| Método | Rota | Descrição |
| :--- | :--- | :--- |
| `GET` | `/api/modelos` | Lista todos os modelos (ordenados por criação). |
| `GET` | `/api/modelos/:id` | Busca detalhes de um modelo específico. |
| `POST` | `/api/modelos` | Cadastra um novo modelo. |
| `PUT` | `/api/modelos/:id` | Atualiza um modelo existente. |
| `DELETE` | `/api/modelos/:id` | Remove um modelo do sistema. |
| `POST` | `/api/modelos/:id/generate` | Gera o texto final substituindo as variáveis `{{ }}`. |

## 🔧 Como Rodar o Projeto

1. **Clone os repositórios:**
   ```bash
   git clone [https://github.com/DavidWanderley/JuriModelos-api](https://github.com/DavidWanderley/JuriModelos-api)
   git clone [https://github.com/DavidWanderley/JuriModelos-app](https://github.com/DavidWanderley/JuriModelos-app)