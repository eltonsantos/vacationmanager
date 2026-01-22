# VacationManager

Sistema de Gestão de Férias - Full Stack Application

## Descrição

O **VacationManager** é uma aplicação full-stack para gestão de colaboradores e pedidos de férias, desenvolvida como desafio técnico. O sistema implementa controle de acesso por roles, validações de negócio rigorosas e bloqueio total de férias sobrepostas.

## Tecnologias

### Backend
- **Java 17**
- **Spring Boot 3.4.x**
- **Spring Security** + JWT
- **Spring Data JPA** (Hibernate)
- **Spring Validation**
- **PostgreSQL 15**
- **Flyway** (Migrações)
- **Springdoc OpenAPI** (Swagger)
- **Lombok**

### Frontend
- **Next.js 16** (App Router)
- **React 19**
- **TypeScript**
- **TailwindCSS 4**
- **FullCalendar**
- **Lucide React** (Ícones)
- **Headless UI**

## Arquitetura

```
┌─────────────────────────────────────────────────────────────────┐
│                         Frontend (Next.js)                       │
│  ┌─────────┐  ┌─────────────┐  ┌────────┐  ┌──────────────┐    │
│  │  Login  │  │  Dashboard  │  │ Férias │  │  Calendário  │    │
│  └─────────┘  └─────────────┘  └────────┘  └──────────────┘    │
└───────────────────────────┬─────────────────────────────────────┘
                            │ HTTP/REST + JWT
┌───────────────────────────▼─────────────────────────────────────┐
│                       Backend (Spring Boot)                      │
│  ┌──────────────────────────────────────────────────────────┐   │
│  │                    Security Filter (JWT)                  │   │
│  └──────────────────────────────────────────────────────────┘   │
│  ┌─────────┐  ┌────────────┐  ┌──────────┐  ┌────────────┐     │
│  │  Auth   │  │ Employees  │  │ Vacations│  │   Audit    │     │
│  │Controller│ │ Controller │  │Controller│  │ Controller │     │
│  └────┬────┘  └─────┬──────┘  └────┬─────┘  └─────┬──────┘     │
│       │             │              │              │             │
│  ┌────▼────┐  ┌─────▼──────┐  ┌────▼─────┐  ┌─────▼──────┐     │
│  │  Auth   │  │  Employee  │  │ Vacation │  │   Audit    │     │
│  │ Service │  │  Service   │  │ Service  │  │  Service   │     │
│  └────┬────┘  └─────┬──────┘  └────┬─────┘  └─────┬──────┘     │
│       │             │              │              │             │
│  ┌────▼─────────────▼──────────────▼──────────────▼─────┐      │
│  │                    JPA Repositories                   │      │
│  └───────────────────────────┬──────────────────────────┘      │
└──────────────────────────────┼──────────────────────────────────┘
                               │
┌──────────────────────────────▼──────────────────────────────────┐
│                        PostgreSQL Database                       │
│  ┌────────┐  ┌───────────┐  ┌─────────────────┐  ┌───────────┐ │
│  │ users  │  │ employees │  │vacation_requests│  │audit_logs │ │
│  └────────┘  └───────────┘  └─────────────────┘  └───────────┘ │
└─────────────────────────────────────────────────────────────────┘
```

## Pré-requisitos

- **Docker** e **Docker Compose**
- **Java 17+**
- **Maven 3.9+**
- **Node.js 18+**
- **npm 9+**

## Instalação e Execução

### 1. Clonar o Repositório

```bash
git clone <repository-url>
cd VacationManager
```

### 2. Iniciar o Banco de Dados

```bash
docker compose up -d
```

Aguarde alguns segundos para o PostgreSQL inicializar.

### 3. Iniciar o Backend

```bash
cd backend

# Linux/Mac
./mvnw spring-boot:run

# Windows
mvnw.cmd spring-boot:run
```

O backend estará disponível em:
- **API**: http://localhost:8080/api/v1
- **Swagger UI**: http://localhost:8080/api/v1/swagger-ui.html

### 4. Iniciar o Frontend

Em outro terminal:

```bash
cd frontend
npm install
npm run dev
```

O frontend estará disponível em:
- **Web**: http://localhost:3000

## Comandos Úteis

### Backend

```bash
# Rodar o projeto
cd backend
./mvnw spring-boot:run

# Rodar migrations manualmente
./mvnw flyway:migrate

# Limpar e recompilar
./mvnw clean compile

# Gerar JAR
./mvnw clean package -DskipTests

# Rodar testes
./mvnw test
```

### Frontend

```bash
cd frontend

# Desenvolvimento
npm run dev

# Build de produção
npm run build

# Iniciar em produção
npm start

# Lint
npm run lint
```

### Docker

```bash
# Iniciar banco
docker compose up -d

# Parar banco
docker compose down

# Parar e limpar volumes (apaga dados)
docker compose down -v

# Ver logs
docker compose logs -f
```

## Variáveis de Ambiente

### Backend

| Variável | Descrição | Padrão |
|----------|-----------|--------|
| `DB_HOST` | Host do PostgreSQL | `localhost` |
| `DB_PORT` | Porta do PostgreSQL | `5432` |
| `DB_NAME` | Nome do banco | `vacation_manager` |
| `DB_USER` | Usuário do banco | `postgres` |
| `DB_PASSWORD` | Senha do banco | `postgres` |
| `JWT_SECRET` | Chave secreta JWT | (gerado) |
| `CORS_ALLOWED_ORIGINS` | Origens permitidas | `http://localhost:3000` |

### Frontend

Criar arquivo `.env.local`:

```env
NEXT_PUBLIC_API_BASE_URL=http://localhost:8080/api/v1
```

## Usuários de Teste

| Role | Email | Senha |
|------|-------|-------|
| **Admin** | admin@lbc.local | Admin123! |
| **Manager** | manager@lbc.local | Manager123! |
| **Collaborator** | collab@lbc.local | Collab123! |

## Endpoints da API

### Autenticação
| Método | Endpoint | Descrição |
|--------|----------|-----------|
| POST | `/auth/login` | Login e obtenção do token JWT |
| GET | `/auth/me` | Dados do usuário autenticado |

### Colaboradores
| Método | Endpoint | Descrição | Roles |
|--------|----------|-----------|-------|
| GET | `/employees` | Listar colaboradores | Todos |
| GET | `/employees/{id}` | Obter colaborador | Todos |
| POST | `/employees` | Criar colaborador | Admin |
| PUT | `/employees/{id}` | Atualizar colaborador | Admin |
| DELETE | `/employees/{id}` | Remover colaborador (soft delete) | Admin |

### Férias
| Método | Endpoint | Descrição | Roles |
|--------|----------|-----------|-------|
| GET | `/vacations` | Listar pedidos de férias | Todos |
| GET | `/vacations/{id}` | Obter pedido | Todos |
| GET | `/vacations/calendar` | Férias para calendário | Todos |
| POST | `/vacations` | Criar pedido | Todos |
| PUT | `/vacations/{id}` | Atualizar pedido (apenas PENDING) | Próprio |
| POST | `/vacations/{id}/cancel` | Cancelar pedido | Próprio |
| POST | `/vacations/{id}/approve` | Aprovar pedido | Admin, Manager |
| POST | `/vacations/{id}/reject` | Rejeitar pedido | Admin, Manager |

### Saldos
| Método | Endpoint | Descrição |
|--------|----------|-----------|
| GET | `/balances?year=YYYY` | Listar saldos do ano |
| GET | `/balances/employee/{id}` | Saldo de colaborador específico |

### Auditoria
| Método | Endpoint | Descrição | Roles |
|--------|----------|-----------|-------|
| GET | `/audit-logs` | Listar logs de auditoria | Admin |
| GET | `/audit-logs/entity/{type}` | Filtrar por tipo de entidade | Admin |

## Regras de Negócio

### Roles e Permissões

- **Admin**: Acesso total a todas as funcionalidades
- **Manager**: Gerencia apenas colaboradores do seu time, pode aprovar/rejeitar férias do time
- **Collaborator**: Gerencia apenas seus próprios pedidos de férias

### Validação de Sobreposição de Férias

A regra crítica do sistema impede sobreposição de férias entre quaisquer colaboradores:

```
Conflito existe quando:
novoStart <= existenteEnd AND novoEnd >= existenteStart
```

- Datas são **inclusivas**
- Validação ocorre em: criação, edição e aprovação
- Apenas pedidos com status `PENDING` e `APPROVED` são considerados
- Pedidos `REJECTED` e `CANCELLED` não entram na validação

### Saldo Anual de Férias

- Cada colaborador tem direito a **22 dias** por ano
- Dias são descontados automaticamente ao aprovar férias
- Dias são restaurados ao cancelar férias aprovadas

## Estrutura do Projeto

```
VacationManager/
├── backend/
│   ├── src/main/java/com/eltonsantos/backend/
│   │   ├── config/          # Configurações Spring
│   │   ├── controller/      # Controllers REST
│   │   ├── dto/             # Data Transfer Objects
│   │   ├── entity/          # Entidades JPA
│   │   ├── enums/           # Enumerações
│   │   ├── exception/       # Exceções customizadas
│   │   ├── repository/      # Repositórios JPA
│   │   ├── security/        # Segurança JWT
│   │   └── service/         # Serviços de negócio
│   ├── src/main/resources/
│   │   ├── db/migration/    # Migrations Flyway
│   │   └── application.properties
│   └── pom.xml
├── frontend/
│   ├── app/                 # Next.js App Router
│   ├── components/          # Componentes React
│   ├── lib/                 # Utilitários e tipos
│   ├── contexts/            # Contextos React
│   └── package.json
├── docker-compose.yml
└── README.md
```

## Deploy

### Sugestões de Deploy

- **Frontend**: Vercel
- **Backend**: Render, Railway, ou AWS Elastic Beanstalk
- **Banco de Dados**: Supabase, Neon, ou AWS RDS

### Variáveis de Produção

Certifique-se de configurar:
- `JWT_SECRET` com uma chave segura de 256+ bits
- `CORS_ALLOWED_ORIGINS` com o domínio do frontend
- Conexão SSL com o banco de dados

## Desenvolvedor

**Elton Santos** - 2026

---

## Licença

Este projeto foi desenvolvido como desafio técnico.
