# VacationManager

Sistema para gestão de férias de colaboradores.

## Sobre o Projeto

O **VacationManager** como um sistema real de gestão de férias, pensando em resolver os problemas que empresas enfrentam no dia a dia: controle de quem está de férias, evitar conflitos de datas, e dar visibilidade para gestores e colaboradores.

O sistema foi construído do zero, desde o modelo de dados até a interface, com foco em usabilidade e regras de negócio bem definidas.

## O que o sistema faz

### Para Administradores
- Cadastro e gestão de usuários e colaboradores
- Visualização de todas as solicitações de férias da empresa
- Aprovação/rejeição de qualquer pedido
- Acesso aos logs de auditoria (quem fez o que e quando)
- Dashboard com métricas gerais

### Para Gestores
- Visualização dos colaboradores do seu time
- Aprovação/rejeição de férias do time
- Calendário integrado mostrando férias aprovadas
- Solicitação das próprias férias

### Para Colaboradores
- Solicitação de férias com seleção de datas
- Acompanhamento do status dos pedidos
- Visualização do saldo de dias disponíveis
- Calendário com férias da equipe

### Regras de Negócio Implementadas

O sistema impede automaticamente:
- **Sobreposição de férias** - não é possível aprovar férias que conflitem com outras já existentes
- **Auto-aprovação** - ninguém pode aprovar as próprias férias
- **Saldo negativo** - solicitações são validadas contra o saldo disponível
- **Edição de pedidos aprovados** - apenas pedidos pendentes podem ser alterados

## Stack Utilizada

### Backend
- **Java 17** com **Spring Boot 3.4**
- **Spring Security** com autenticação JWT
- **Spring Data JPA** para persistência
- **PostgreSQL** como banco de dados
- **Flyway** para migrations
- **Springdoc OpenAPI** para documentação da API

### Frontend
- **Next.js 16** com App Router
- **React 19** com TypeScript
- **TailwindCSS 4** para estilização
- **FullCalendar** para visualização de férias

## Como Rodar o Projeto

### Requisitos
- Docker e Docker Compose
- Java 17+
- Node.js 18+

### Passo a passo

**1. Clone e inicie o banco de dados:**
```bash
git clone <repository-url>
cd VacationManager
docker compose up -d
```

**2. Inicie o backend:**
```bash
cd backend
./mvnw spring-boot:run
```

**3. Em outro terminal, inicie o frontend:**
```bash
cd frontend
npm install
npm run dev
```

Pronto! Acesse http://localhost:3000 e faça login com um dos usuários de teste.

## Usuários para Teste

| Perfil | Email | Senha |
|--------|-------|-------|
| Admin | admin@lbc.local | Admin123! |
| Gestor | manager@lbc.local | Manager123! |
| Colaborador | collab@lbc.local | Collab123! |

## Documentação da API (Swagger)

A API possui documentação interativa completa. Com o backend rodando, acesse:

**http://localhost:8080/api/v1/swagger-ui.html**

Lá você encontra:
- Todos os endpoints organizados por categoria
- Schemas de request e response com exemplos
- Possibilidade de testar as chamadas diretamente
- Códigos de erro documentados

### Como testar pelo Swagger

1. Acesse o Swagger UI
2. Execute o endpoint `POST /auth/login` com as credenciais de teste
3. Copie o token retornado
4. Clique no botão **Authorize** (cadeado no topo)
5. Cole o token e clique em Authorize
6. Agora pode testar qualquer endpoint autenticado

## Testes Automatizados

O projeto inclui testes unitários para os principais serviços. Eles validam:

- Fluxo de login e cadastro
- Criação e aprovação de férias
- Validações de datas e saldo
- Regras de permissão
- Operações de CRUD

### Executando os testes

```bash
cd backend

# Rodar todos os testes
./mvnw test

# Rodar apenas testes dos services
./mvnw test -Dtest="*ServiceTest"

# Ver relatório detalhado
./mvnw test -Dsurefire.reportFormat=plain
```

Os testes usam JUnit 5 e Mockito, seguindo o padrão AAA (Arrange, Act, Assert) e boas práticas de isolamento.

## Estrutura do Projeto

```
VacationManager/
├── backend/
│   ├── src/main/java/.../
│   │   ├── controller/    # Endpoints REST
│   │   ├── service/       # Lógica de negócio
│   │   ├── repository/    # Acesso a dados
│   │   ├── entity/        # Modelos JPA
│   │   ├── dto/           # Objetos de transferência
│   │   ├── security/      # Autenticação JWT
│   │   └── exception/     # Tratamento de erros
│   └── src/test/java/...  # Testes unitários
├── frontend/
│   ├── app/               # Páginas (App Router)
│   ├── components/        # Componentes reutilizáveis
│   ├── contexts/          # Estado global (Auth, Theme)
│   └── lib/               # Utilitários e tipos
└── docker-compose.yml     # Banco PostgreSQL
```

## Endpoints Principais

### Autenticação
| Método | Endpoint | Descrição |
|--------|----------|-----------|
| POST | `/auth/login` | Login e obtenção do token |
| POST | `/auth/signup` | Cadastro de novo usuário |
| GET | `/auth/me` | Dados do usuário logado |
| PUT | `/auth/me/password` | Alterar senha |

### Férias
| Método | Endpoint | Descrição |
|--------|----------|-----------|
| GET | `/vacations` | Listar solicitações |
| POST | `/vacations` | Criar solicitação |
| POST | `/vacations/{id}/approve` | Aprovar (gestor/admin) |
| POST | `/vacations/{id}/reject` | Rejeitar (gestor/admin) |
| POST | `/vacations/{id}/cancel` | Cancelar (próprio) |

### Colaboradores
| Método | Endpoint | Descrição |
|--------|----------|-----------|
| GET | `/employees` | Listar colaboradores |
| POST | `/employees` | Criar (admin) |
| PUT | `/employees/{id}` | Atualizar (admin) |
| DELETE | `/employees/{id}` | Remover (admin) |

### Saldo e Auditoria
| Método | Endpoint | Descrição |
|--------|----------|-----------|
| GET | `/balances` | Saldos de férias |
| GET | `/audit-logs` | Logs de auditoria (admin) |

## Variáveis de Ambiente

O projeto funciona com valores padrão para desenvolvimento local. Para produção:

| Variável | Descrição |
|----------|-----------|
| `DB_HOST` | Host do PostgreSQL |
| `DB_PORT` | Porta do banco |
| `DB_NAME` | Nome do banco |
| `DB_USER` | Usuário |
| `DB_PASSWORD` | Senha |
| `JWT_SECRET` | Chave secreta (256+ bits) |
| `CORS_ALLOWED_ORIGINS` | Domínios permitidos |

## Arquitetura

O sistema segue uma arquitetura em camadas:

```
Frontend (Next.js) 
    ↓ HTTP/REST + JWT
Backend (Spring Boot)
    → Controllers (validação de entrada)
    → Services (regras de negócio)
    → Repositories (persistência)
    ↓
PostgreSQL
```

Cada camada tem responsabilidade bem definida, facilitando manutenção e testes.

## Decisões Técnicas

Algumas escolhas feitas durante o desenvolvimento:

- **JWT stateless** - simplifica escalabilidade, não precisa de sessão no servidor
- **Soft delete para colaboradores** - preserva histórico e integridade referencial
- **Flyway para migrations** - versionamento do schema de forma controlada
- **Validação em múltiplas camadas** - DTOs validam entrada, services validam regras
- **Logs de auditoria** - rastreabilidade de todas as ações importantes

## Próximos Passos

Se fosse continuar o desenvolvimento, priorizaria:

- Notificações por email quando férias são aprovadas/rejeitadas
- Relatórios em PDF com resumo de férias por período
- Integração com calendário externo (Google Calendar)
- Funcionalidade de delegação durante ausência

---

Desenvolvido por **Elton Santos** - Janeiro 2026
