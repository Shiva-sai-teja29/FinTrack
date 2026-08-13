# 💰 Fintrack

**Fintrack** is a full-stack personal finance management application designed to help users track, organize, and monitor their financial activities through a modern web application.

The application follows a **separated frontend and backend architecture**, with a React-based frontend communicating with a Spring Boot REST API. The backend provides secure authentication, financial-data management, scheduled background processing, health monitoring, and production-ready deployment support through Docker.

---

## 📌 Table of Contents

* [Overview](#-overview)
* [Key Features](#-key-features)
* [Architecture](#-architecture)
* [Technology Stack](#-technology-stack)
* [Backend](#-backend)
* [Frontend](#-frontend)
* [Authentication & Security](#-authentication--security)
* [Refresh Token Management](#-refresh-token-management)
* [Scheduled Jobs](#-scheduled-jobs)
* [Application Monitoring](#-application-monitoring)
* [Docker Deployment](#-docker-deployment)
* [Project Structure](#-project-structure)
* [Configuration](#-configuration)
* [Environment Variables](#-environment-variables)
* [Running the Application Locally](#-running-the-application-locally)
* [Building the Application](#-building-the-application)
* [API Overview](#-api-overview)
* [Production Deployment](#-production-deployment)
* [Versioning](#-versioning)
* [Security Considerations](#-security-considerations)
* [Future Improvements](#-future-improvements)
* [Author](#-author)

---

# 📖 Overview

Fintrack is built to provide a centralized platform for managing personal financial information.

The application separates responsibilities between the frontend and backend:

```text
┌──────────────────────────┐
│        React UI          │
│      Frontend App        │
└────────────┬─────────────┘
             │ REST API
             ▼
┌──────────────────────────┐
│      Spring Boot         │
│        Backend           │
│                          │
│  ┌────────────────────┐  │
│  │ Authentication     │  │
│  │ Business Logic     │  │
│  │ REST Controllers   │  │
│  │ Security           │  │
│  │ Scheduled Tasks    │  │
│  │ Actuator           │  │
│  └────────────────────┘  │
└────────────┬─────────────┘
             │
             ▼
┌──────────────────────────┐
│        Database          │
└──────────────────────────┘
```

The backend exposes RESTful APIs consumed by the React frontend.

The application is designed with production deployment in mind, including:

* Secure authentication
* JWT-based authorization
* Refresh-token support
* Expired-token cleanup
* Environment-based configuration
* Docker image creation
* Application health monitoring
* Backend containerization
* Independent frontend deployment

---

# 🚀 Key Features

## 🔐 Authentication

Fintrack provides secure user authentication using token-based security.

The authentication system supports:

* User registration
* User login
* JWT access tokens
* Refresh tokens
* Token expiration
* Token refresh
* Logout/token invalidation
* Protected API endpoints

---

## 👤 User Management

Users can securely access their Fintrack account after authentication.

The backend validates authentication information before allowing access to protected resources.

Authorization is handled through Spring Security.

---

## 💵 Financial Tracking

Fintrack is designed around managing financial activities such as:

* Income
* Expenses
* Financial categories
* Transaction information
* Financial records
* User-specific financial data

The architecture allows additional financial modules to be introduced without significantly changing the authentication or infrastructure layers.

---

## 📊 Financial Organization

Financial records can be organized into categories, making it easier for users to understand their spending and income patterns.

The frontend provides a user-friendly interface for interacting with these records.

---

## 🔄 Refresh Token Support

Access tokens are short-lived for security purposes.

When an access token expires, the application can use a valid refresh token to obtain a new access token instead of forcing the user to log in again.

The backend also maintains refresh-token information and removes expired tokens through a scheduled background process.

---

## 🧹 Automatic Expired Token Cleanup

Fintrack contains a scheduled backend task that periodically removes expired refresh tokens.

Example:

```java
@Scheduled(cron = "0 0 2 * * *")
@Transactional
public void deleteExpiredRefreshTokens() {
    LocalDateTime now = LocalDateTime.now(ZoneOffset.UTC);

    int deletedCount =
            refreshTokenRepository.deleteByExpiryDateBefore(now);

    logger.info("Deleted {} expired refresh tokens", deletedCount);
}
```

This prevents expired refresh-token records from accumulating indefinitely in the database.

---

# 🏗 Architecture

Fintrack follows a layered backend architecture.

```text
                    ┌────────────────────┐
                    │    React Frontend  │
                    └─────────┬──────────┘
                              │
                              │ HTTP / REST
                              ▼
                    ┌────────────────────┐
                    │    REST API Layer  │
                    │    Controllers     │
                    └─────────┬──────────┘
                              │
                              ▼
                    ┌────────────────────┐
                    │   Service Layer    │
                    │ Business Logic     │
                    └─────────┬──────────┘
                              │
                              ▼
                    ┌────────────────────┐
                    │ Repository Layer  │
                    │ Data Access       │
                    └─────────┬──────────┘
                              │
                              ▼
                    ┌────────────────────┐
                    │      Database      │
                    └────────────────────┘
```

Security is implemented as part of the request-processing pipeline.

```text
Client
   │
   ▼
HTTP Request
   │
   ▼
Security Filters
   │
   ├── Validate JWT
   │
   ├── Validate Authentication
   │
   └── Check Authorization
   │
   ▼
Controller
   │
   ▼
Service
   │
   ▼
Repository
   │
   ▼
Database
```

---

# 🛠 Technology Stack

## Backend

| Technology         | Purpose                               |
| ------------------ | ------------------------------------- |
| Java               | Backend programming language          |
| Spring Boot        | Backend framework                     |
| Spring Web         | REST API development                  |
| Spring Security    | Authentication and authorization      |
| JWT                | Stateless access-token authentication |
| Spring Data        | Database access                       |
| Maven/Gradle       | Dependency and build management       |
| Spring Actuator    | Application health and monitoring     |
| Jakarta Validation | Request validation                    |
| SLF4J / Logback    | Application logging                   |

## Frontend

| Technology            | Purpose               |
| --------------------- | --------------------- |
| React                 | Frontend UI           |
| TypeScript/JavaScript | Frontend development  |
| HTML5                 | Application structure |
| CSS                   | Styling               |
| REST APIs             | Backend communication |

## DevOps / Deployment

| Technology            | Purpose                      |
| --------------------- | ---------------------------- |
| Docker                | Backend containerization     |
| Docker Image          | Application packaging        |
| Netlify               | Frontend deployment          |
| Environment Variables | Secure configuration         |
| Spring Actuator       | Production health monitoring |

---

# ⚙️ Backend

The Fintrack backend is implemented using Spring Boot.

The backend is responsible for:

* REST API endpoints
* Authentication
* Authorization
* JWT generation and validation
* Refresh-token management
* Business logic
* Database operations
* Input validation
* Exception handling
* Scheduled background processing
* Health monitoring
* Logging

A typical request follows:

```text
HTTP Request
      ↓
Security Filter
      ↓
JWT Validation
      ↓
Controller
      ↓
Service
      ↓
Repository
      ↓
Database
      ↓
HTTP Response
```

This separation keeps the application maintainable and makes individual layers easier to test.

---

# 🎨 Frontend

The Fintrack frontend is implemented using React.

The frontend is responsible for:

* User authentication screens
* Login and registration
* Dashboard
* Financial-data management
* API communication
* Authentication state
* Error handling
* Loading states
* User interaction

The frontend communicates with the backend using REST APIs.

```text
React Application
       │
       ├── Authentication
       │
       ├── Dashboard
       │
       ├── Transactions
       │
       └── Other UI Modules
              │
              ▼
        REST API Client
              │
              ▼
        Spring Boot API
```

The frontend can be deployed independently from the backend.

---

# 🔐 Authentication & Security

Security is one of the core components of Fintrack.

The application uses JWT-based authentication.

## Authentication Flow

```text
User
 │
 │ Login
 ▼
Backend
 │
 │ Validate Credentials
 ▼
Authentication Service
 │
 │ Generate Tokens
 ├───────────────┐
 ▼               ▼
Access Token   Refresh Token
 │               │
 ▼               ▼
Client          Database
```

The access token is used when accessing protected APIs.

Example:

```http
Authorization: Bearer <access-token>
```

The backend validates the token before allowing access to protected resources.

---

# 🔄 Refresh Token Flow

Access tokens should have a limited lifetime.

When the access token expires:

```text
Frontend
   │
   │ Access token expired
   ▼
Refresh Token API
   │
   │ Send refresh token
   ▼
Backend
   │
   ├── Validate refresh token
   ├── Check expiration
   ├── Check token validity
   │
   ▼
Generate New Access Token
   │
   ▼
Frontend
```

This approach provides a balance between:

* Security
* User experience
* Token lifetime management

---

# 🚪 Logout

During logout, the application should invalidate the user's refresh-token session on the backend.

The frontend should also remove locally stored authentication information according to the application's token-storage strategy.

This prevents a previously issued refresh token from being reused after logout.

---

# ⏰ Scheduled Jobs

Fintrack uses Spring's scheduling capabilities for background maintenance operations.

One important scheduled task is expired refresh-token cleanup.

Current cleanup schedule:

```text
Every day at 02:00
```

Cron expression:

```text
0 0 2 * * *
```

The task:

1. Gets the current UTC time.
2. Finds expired refresh tokens.
3. Deletes expired records.
4. Logs the number of deleted records.

Using UTC for token expiration processing helps avoid timezone-related inconsistencies.

---

# ❤️ Application Monitoring

Fintrack uses **Spring Boot Actuator** for application health monitoring.

Actuator can expose operational endpoints such as:

```text
/actuator/health
/actuator/info
/actuator/metrics
```

The health endpoint can be used to verify whether the application and its important dependencies are operating correctly.

Example:

```http
GET /actuator/health
```

A healthy application can return a response similar to:

```json
{
  "status": "UP"
}
```

Actuator is particularly useful when Fintrack is running inside a Docker container or production environment.

---

# 🐳 Docker Deployment

The Fintrack backend is containerized using Docker.

Docker allows the backend to be packaged together with its runtime requirements.

Basic workflow:

```text
Source Code
    │
    ▼
Dockerfile
    │
    ▼
Docker Image
    │
    ▼
Docker Container
    │
    ▼
Running Fintrack Backend
```

## Build Docker Image

For example, for version `1.3`:

```bash
docker build -t fintrack-backend:1.3 .
```

## Run Container

```bash
docker run -d \
  --name fintrack-backend \
  -p 8080:8080 \
  fintrack-backend:1.3
```

For production, sensitive configuration should be supplied through environment variables rather than hard-coded into the image.

---

# 🏷️ Docker Versioning

Fintrack backend releases can be represented through Docker image tags.

Example:

```text
fintrack-backend:1.2
fintrack-backend:1.3
fintrack-backend:1.4
```

This provides a simple mechanism to:

* Identify releases
* Roll back versions
* Deploy a specific version
* Maintain multiple image versions

For example:

```bash
docker images
```

can be used to inspect available Fintrack images.

---

# 📁 Project Structure

A recommended repository structure is:

```text
Fintrack/
│
├── backend/
│   ├── src/
│   │   ├── main/
│   │   │   ├── java/
│   │   │   └── resources/
│   │   │
│   │   └── test/
│   │
│   ├── Dockerfile
│   ├── pom.xml
│   └── README.md
│
├── frontend/
│   ├── src/
│   ├── public/
│   ├── package.json
│   ├── package-lock.json
│   └── README.md
│
├── .gitignore
└── README.md
```

The exact structure may vary depending on how the frontend and backend are maintained in the repository.

---

# 🔧 Configuration

Fintrack uses environment-specific configuration.

Sensitive values should **not** be committed to Git.

Examples of configuration that should normally be externalized:

```text
Database URL
Database username
Database password
JWT secret
JWT expiration
Refresh-token configuration
OAuth credentials
CORS configuration
Application environment
```

Example environment variable:

```text
SECURITY_JWT_SECRET=<your-secret>
```

This is preferable to placing the actual secret directly inside:

```properties
security.jwt.secret=...
```

---

# 🔑 Environment Variables

A production deployment can use environment variables similar to:

```text
SPRING_PROFILES_ACTIVE=prod

DATABASE_URL=<database-url>
DATABASE_USERNAME=<database-username>
DATABASE_PASSWORD=<database-password>

SECURITY_JWT_SECRET=<strong-random-secret>

JWT_EXPIRATION=<expiration-value>
REFRESH_TOKEN_EXPIRATION=<expiration-value>

FRONTEND_URL=<frontend-url>
```

> The exact variable names should match the configuration used by the Fintrack backend.

Never commit real production credentials, JWT secrets, database passwords, API keys, or OAuth client secrets to Git.

---

# 💻 Running the Application Locally

## Prerequisites

Install:

* Java
* Maven or Gradle
* Node.js
* npm
* Git
* Docker (optional)

Verify installations:

```bash
java -version
```

```bash
mvn -version
```

```bash
node -v
```

```bash
npm -v
```

```bash
docker --version
```

---

## Clone Repository

```bash
git clone <repository-url>
```

```bash
cd Fintrack
```

---

# ▶️ Run Backend

Navigate to the backend:

```bash
cd backend
```

If Maven is used:

```bash
mvn spring-boot:run
```

Or build the application:

```bash
mvn clean package
```

Then run:

```bash
java -jar target/<application-name>.jar
```

If Gradle is used:

```bash
./gradlew bootRun
```

On Windows:

```bash
gradlew.bat bootRun
```

---

# ▶️ Run Frontend

Navigate to the frontend:

```bash
cd frontend
```

Install dependencies:

```bash
npm install
```

Start the development server using the project's configured npm script.

For a typical Vite application:

```bash
npm run dev
```

The frontend development server will normally provide a local URL such as:

```text
http://localhost:5173
```

The exact port depends on the frontend configuration.

---

# 🏗️ Building the Frontend

To create the production build:

```bash
npm run build
```

The generated production files are normally placed in:

```text
dist/
```

These files can then be deployed to a static hosting platform such as Netlify.

---

# 🌐 Frontend Deployment

The frontend can be deployed independently from the backend.

Typical deployment architecture:

```text
                    Internet
                       │
                       ▼
              ┌─────────────────┐
              │     Netlify     │
              │ React Frontend  │
              └────────┬────────┘
                       │
                       │ HTTPS / REST
                       ▼
              ┌─────────────────┐
              │ Backend Server  │
              │ Spring Boot     │
              │ Docker          │
              └────────┬────────┘
                       │
                       ▼
                   Database
```

Before deployment, make sure the frontend API base URL points to the deployed Fintrack backend instead of the local development URL.

---

# 🔌 API Overview

The backend exposes REST endpoints for authentication and financial-management operations.

A typical API organization can follow:

```text
/api/v1/auth/**
/api/v1/users/**
/api/v1/transactions/**
/api/v1/categories/**
```

Authentication endpoints generally include operations such as:

```text
POST /api/v1/auth/register
POST /api/v1/auth/login
POST /api/v1/auth/refresh
POST /api/v1/auth/logout
```

Protected endpoints require a valid JWT access token.

> The exact endpoint list should be kept synchronized with the controllers currently implemented in the repository.

---

# 🧪 Testing

The backend should be tested at multiple levels.

### Unit Testing

Tests individual classes and business logic in isolation.

Examples:

```text
Service tests
Repository tests
Security tests
Utility tests
```

### Integration Testing

Validates interactions between application components.

Examples:

```text
Controller → Service
Service → Repository
Application → Database
```

Run tests using:

```bash
mvn test
```

or:

```bash
./gradlew test
```

depending on the project's build system.

---

# 📋 Logging

Fintrack uses application logging to assist with:

* Debugging
* Monitoring
* Authentication troubleshooting
* Scheduled-job monitoring
* Production diagnostics
* Exception investigation

For example, the refresh-token cleanup process logs the number of deleted records.

Production logs should avoid exposing:

* Passwords
* JWT tokens
* Refresh tokens
* Database credentials
* API secrets
* Sensitive personal information

---

# 🛡️ Security Considerations

Fintrack follows several important security practices.

### JWT Secret

JWT secrets should be:

* Strong
* Random
* Stored outside source control
* Different between environments where appropriate

### Passwords

User passwords should never be stored as plain text.

They should be securely hashed using an appropriate password encoder.

### HTTPS

Production environments should use HTTPS to protect authentication credentials and API communication.

### Environment Variables

Sensitive configuration should be supplied through environment variables or a secure secrets-management system.

### Token Expiration

Access tokens should have a limited lifetime.

Refresh tokens should also have expiration and revocation handling.

### Database Security

Database credentials should not be committed to Git.

---

# 🔄 Deployment Workflow

A typical Fintrack deployment process is:

```text
Developer
   │
   ▼
Git Repository
   │
   ▼
Backend Build
   │
   ▼
Docker Image
   │
   ▼
Tag Release
   │
   ▼
Deploy Backend
   │
   ▼
Actuator Health Check
   │
   ▼
Backend Available
```

Frontend:

```text
React Source
     │
     ▼
npm install
     │
     ▼
npm run build
     │
     ▼
dist/
     │
     ▼
Netlify
     │
     ▼
Live Frontend
```

---

# 🏷️ Version History

Fintrack uses versioned Docker images for backend releases.

Example:

| Version | Description                 |
| ------- | --------------------------- |
| `1.2`   | Previous backend release    |
| `1.3`   | Current/new backend release |
| `1.4+`  | Future releases             |

A release should ideally contain:

* Application version
* Docker image tag
* Database changes
* API changes
* New features
* Bug fixes
* Deployment notes

---

# 📈 Future Improvements

Potential areas for future development include:

* Advanced financial dashboards
* Monthly and yearly spending reports
* Budget management
* Expense analytics
* Income analytics
* Charts and visualizations
* Export financial reports
* Notifications
* Advanced search and filtering
* Pagination and sorting
* Improved audit logging
* CI/CD automation
* Centralized monitoring
* Performance monitoring
* Automated database migrations
* Automated Docker image publishing

---

# 🤝 Development Guidelines

When contributing to Fintrack:

1. Create a feature branch.
2. Implement the required change.
3. Add/update tests.
4. Verify the application locally.
5. Build the backend.
6. Build the frontend.
7. Verify Docker deployment if backend infrastructure is affected.
8. Review logs and Actuator health.
9. Create a pull request.

Example:

```bash
git checkout -b feature/<feature-name>
```

```bash
git add .
```

```bash
git commit -m "Add <feature-name>"
```

```bash
git push origin feature/<feature-name>
```

---

# 🧭 Development Philosophy

Fintrack is designed around the following principles:

* **Security first**
* **Clean separation of responsibilities**
* **Maintainable backend architecture**
* **Reusable frontend components**
* **Environment-based configuration**
* **Production-ready deployment**
* **Observable application behavior**
* **Incremental versioned releases**

The goal is not only to build a working finance application, but also to maintain a codebase that can evolve as the application's functionality grows.

## ⭐ Project Status

**Fintrack is an actively developed full-stack financial tracking application.**

The project currently focuses on secure authentication, financial-data management, REST API architecture, Docker-based backend deployment, React frontend deployment, token lifecycle management.
