# MediFlow – Patient Admission Management System

[![Build & Test](https://github.com/shivarajrathod08/mediflow-patient-admission-management/actions/workflows/ci.yml/badge.svg)](https://github.com/shivarajrathod08/mediflow-patient-admission-management/actions/workflows/ci.yml)
[![Java](https://img.shields.io/badge/Java-17%2B-ED8B00?logo=openjdk&logoColor=white)](https://www.oracle.com/java/)
[![Spring Boot](https://img.shields.io/badge/Spring_Boot-3.3.5-6DB33F?logo=springboot&logoColor=white)](https://spring.io/projects/spring-boot)
[![PostgreSQL](https://img.shields.io/badge/PostgreSQL-Neon_Cloud-4169E1?logo=postgresql&logoColor=white)](https://neon.tech/)
[![React](https://img.shields.io/badge/React-19.3.1-61DAFB?logo=react&logoColor=black)](https://react.dev/)
[![TypeScript](https://img.shields.io/badge/TypeScript-7.0.2-3178C6?logo=typescript&logoColor=white)](https://www.typescriptlang.org/)
[![Tailwind CSS](https://img.shields.io/badge/Tailwind_CSS-4.3.5-06B6D4?logo=tailwindcss&logoColor=white)](https://tailwindcss.com/)
[![Vite](https://img.shields.io/badge/Vite-8.3.6-646CFF?logo=vite&logoColor=white)](https://vitejs.dev/)

> **A production-ready, full-stack Hospital Patient Admission Management System** engineered for reliability, relational integrity, and rapid operational workflows across hospital wards and clinical departments.

---

## 1. Project Overview & Problem Statement

Modern healthcare facilities handle hundreds of daily patient transitions between emergency wards, specialized clinical departments, and attending physicians. Many hospitals still struggle with:
- **Disjointed Admission Workflows:** Reliance on error-prone paper charts or fragmented spreadsheets leading to bed-allocation conflicts and physician mismatches.
- **Data Integrity Failures:** Admitting patients without strict departmental validation, assigning doctors outside their clinical specialty, or recording invalid demographic data.
- **Lack of Real-Time Visibility:** Delayed visibility into active bed capacities, daily admission spikes, and departmental load distributions.

**MediFlow** addresses these operational bottlenecks by providing an enterprise-grade hospital administration dashboard backed by **Spring Boot 3**, **PostgreSQL (Neon Serverless)**, and **React 19 with Tailwind CSS**. It enforces strict domain-level business constraints (such as dynamic doctor-department linkage, non-negative capacity validation, and idempotent discharge workflows) while maintaining sub-100ms API response times.

---

## 2. Live Application & Repository

| Service | Environment | URL | Status |
|---|---|---|---|
| **Web Application** | Production (Render) | [https://mediflow-frontend-suue.onrender.com](https://mediflow-frontend-suue.onrender.com) | Active |
| **REST API Server** | Production (Render) | [https://mediflow-patient-admission-management.onrender.com](https://mediflow-patient-admission-management.onrender.com) | Active |
| **API Health Check** | Production (Render) | [https://mediflow-patient-admission-management.onrender.com/api/health](https://mediflow-patient-admission-management.onrender.com/api/health) | Active |
| **Database** | Production (Neon) | `ep-****.us-east-2.aws.neon.tech/mediflow` | Active |
| **Source Code** | GitHub | [https://github.com/shivarajrathod08/mediflow-patient-admission-management](https://github.com/shivarajrathod08/mediflow-patient-admission-management) | Public |

---

## 3. Key Features

- **Real-Time Clinical Dashboard:**
  - Dynamic KPI cards computing Total Admissions, Currently Admitted, Discharged Patients, and Today's Admissions directly from database aggregates.
  - Live Ward Occupancy meters tracking capacity limits across wards (e.g., Cardiology, ICU, Orthopedics).
  - Departmental distribution breakdown and quick-access recent admissions stream.
- **Enterprise Patient Registry:**
  - 10-column clinical data grid with pagination, sortable fields, and instant full-text name search.
  - Multi-parameter filtering by **Ward**, **Clinical Department**, **Attending Doctor**, and **Admission Status** (`ADMITTED` / `DISCHARGED`).
- **Validated Admission Modal:**
  - Automated unique patient identification code generation (`PAT-XXXX`).
  - Context-aware Doctor dropdown that dynamically queries and populates only physicians credentialed in the selected department.
  - Comprehensive boundary validation (Age `0–120`, Name Unicode regex, non-future admission dates).
- **Patient Record Lifecycle:**
  - Detailed patient demographic and clinical overview modal.
  - Edit patient information with full data consistency checks.
  - Idempotent one-click patient discharge with HTTP 409 conflict protection against duplicate discharges.
  - Permanent record deletion protected by an explicit two-step confirmation modal.
- **Robust Error Handling & Feedback:**
  - Uniform REST envelope format (`ApiResponse<T>`) for consistent frontend consumption.
  - Global exception handling translating database constraint violations and validation failures into human-readable field errors.
  - Transient toast notifications providing immediate UI feedback on network operations.

---

## 4. Application Screenshots

All screenshots below represent the genuine, operational MediFlow user interface captured during execution:

| Feature / Screen | Preview |
|---|---|
| **Executive Clinical Dashboard**<br>Real-time metrics, ward capacity meters, and recent admissions. | ![Executive Dashboard](docs/screenshots/dashboard.png) |
| **Patient Management Registry**<br>Multi-filter data grid with live search, status chips, and pagination. | ![Patient Registry](docs/screenshots/patient-management.png) |
| **Validated Admission Modal**<br>Field-level validation rules with dynamic physician filtering. | ![Admission Modal](docs/screenshots/add-patient.png) |
| **Patient Demographic & Clinical Details**<br>Complete record overview with quick discharge action. | ![Patient Details](docs/screenshots/patient-details.png) |
| **Edit Patient Interface**<br>Pre-populated form fields with relational integrity enforcement. | ![Edit Patient](docs/screenshots/edit-patient.png) |
| **Two-Step Deletion Confirmation**<br>Safety dialog preventing accidental deletion of records. | ![Delete Confirmation](docs/screenshots/delete-confirmation.png) |
| **Mobile-Optimized Dashboard**<br>Responsive viewport (390px) with touch-friendly navigation. | ![Mobile Dashboard](docs/screenshots/mobile-dashboard.png) |
| **Mobile Patient Registry**<br>Card and horizontal scroll views optimized for mobile browsers. | ![Mobile Patients](docs/screenshots/mobile-patients.png) |

---

## 5. Technology Stack

### Frontend Architecture
- **Framework:** React 19 (`19.3.1`)
- **Build Tool:** Vite 8 (`8.3.6`)
- **Language:** TypeScript (`~7.0.2`)
- **Styling Engine:** Tailwind CSS v4 (`@tailwindcss/postcss 4.3.5`)
- **Icons:** Lucide React (`1.79.0`)
- **HTTP Client:** Axios (`1.21.1`) with configured timeout interceptors
- **Testing:** Vitest (`5.1.1`) with `@testing-library/react` and JSDOM

### Backend Architecture
- **Language & Runtime:** Java 17+ (LTS runtime, compatible with Java 23)
- **Framework:** Spring Boot 3 (`3.3.5`)
- **Web Layer:** Spring Web MVC (`@RestController`, Content Negotiation)
- **Persistence:** Spring Data JPA with Hibernate ORM (`6.5.3`)
- **Database Driver:** PostgreSQL JDBC Driver (`org.postgresql:postgresql`)
- **Migration Engine:** Flyway Core (`org.flywaydb:flyway-core` + `flyway-database-postgresql`)
- **Validation:** Jakarta Bean Validation 3.0 (`jakarta.validation-api` + Hibernate Validator)
- **Monitoring & Metrics:** Spring Boot Actuator (`/actuator/health`, `/actuator/metrics`)
- **Build Tool:** Apache Maven (`3.9.x`)
- **Testing:** JUnit 5, Mockito, Spring Boot Test

### Database & Infrastructure
- **Database Engine:** PostgreSQL 18.x compatible
- **Cloud Database:** Neon Serverless PostgreSQL (AWS `us-east-2`)
- **Backend Hosting:** Render Web Service (Dockerized OpenJDK runtime)
- **Frontend Hosting:** Render Static Site / Vercel
- **CI/CD:** GitHub Actions (automated unit tests and build validation)

---

## 6. System Architecture

```mermaid
flowchart TD
    subgraph Client ["Client Presentation Tier (Browser)"]
        UI["React 19 Single Page Application"]
        Router["Vite Dev / Static Asset Server"]
        Axios["Axios HTTP Client (BaseURL Configured)"]
        UI --> Axios
    end

    subgraph CDN ["Edge & Network Routing"]
        RenderFront["Render Frontend Host"]
        CORS["CORS Policy Validation (Allowed-Origins)"]
        RenderFront --> CORS
    end

    subgraph Server ["Application Tier (Spring Boot 3 Web Service)"]
        CORS --> Dispatcher["Spring DispatcherServlet"]
        
        subgraph Controllers ["REST Controller Layer"]
            PC["PatientController (/api/patients)"]
            DC["DashboardController (/api/dashboard)"]
            RC["ReferenceDataController (/api)"]
            HC["HealthController (/api/health)"]
        end
        
        Dispatcher --> Controllers

        subgraph ServiceLayer ["Domain & Business Logic Layer"]
            PS["PatientServiceImpl"]
            DS["DashboardServiceImpl"]
            RDS["ReferenceDataServiceImpl"]
            Spec["PatientSpecification (Type-Safe Search)"]
        end

        Controllers --> ServiceLayer
        PS --> Spec

        subgraph Validation ["Validation & Error Handling"]
            GV["Jakarta Bean Validator (@Valid)"]
            GEH["GlobalExceptionHandler (@ControllerAdvice)"]
        end

        Controllers -.-> GV
        Controllers -.-> GEH

        subgraph Repositories ["Spring Data JPA Repositories"]
            PR["PatientRepository"]
            WR["WardRepository"]
            DeptR["DepartmentRepository"]
            DocR["DoctorRepository"]
        end

        ServiceLayer --> Repositories
    end

    subgraph DB ["Data Tier (PostgreSQL / Neon Cloud)"]
        Hibernate["Hibernate 6 ORM Engine"]
        Flyway["Flyway Migration Engine (V1, V2)"]
        NeonDB[("Neon Managed PostgreSQL 18")]
        
        Repositories --> Hibernate
        Hibernate --> NeonDB
        Flyway --> NeonDB
    end

    Axios --> RenderFront
```

---

## 7. Application Workflow

The application coordinates data between the user, application services, and database through structured transactional workflows:

```mermaid
sequenceDiagram
    autonumber
    actor Staff as Hospital Staff
    participant UI as React Frontend
    participant API as Spring Boot API
    participant DB as Neon PostgreSQL

    Note over Staff,DB: 1. Dashboard Initialization
    Staff->>UI: Navigate to MediFlow Dashboard
    par Fetch Metrics
        UI->>API: GET /api/dashboard/summary
        API->>DB: Execute COUNT, STATUS queries & Ward occupancy
        DB-->>API: Metric aggregates
        API-->>UI: 200 OK (DashboardSummaryDto)
    and Fetch Reference Data
        UI->>API: GET /api/departments & /api/wards
        API->>DB: SELECT * FROM departments, wards
        DB-->>API: Department & Ward lists
        API-->>UI: 200 OK
    end
    UI-->>Staff: Render Statistics, Occupancy Gauges & Recent Admissions

    Note over Staff,DB: 2. Dynamic Patient Admission
    Staff->>UI: Click "Add Patient" & Select Department (e.g. Cardiology)
    UI->>API: GET /api/doctors?departmentId=1
    API->>DB: SELECT * FROM doctors WHERE department_id = 1
    DB-->>API: Doctors list
    API-->>UI: 200 OK (Filtered Doctor list)
    Staff->>UI: Fill demographic data & Submit Form
    UI->>API: POST /api/patients (JSON Payload)
    API->>API: Validate Bean constraints & Doctor-Department match
    alt Validation Failure
        API-->>UI: 400 Bad Request (Field error messages)
        UI-->>Staff: Display inline validation errors
    else Valid Data
        API->>DB: INSERT INTO patients VALUES (...)
        DB-->>API: Created record with ID & Timestamp
        API-->>UI: 201 Created (PatientResponseDto)
        UI-->>Staff: Show success toast & Refresh patient table
    end

    Note over Staff,DB: 3. Patient Discharge Workflow
    Staff->>UI: Click "Discharge" for Patient ID 10
    UI->>API: PATCH /api/patients/10/discharge
    API->>DB: SELECT status FROM patients WHERE id = 10
    alt Already Discharged
        API-->>UI: 409 Conflict ("Patient is already discharged")
        UI-->>Staff: Display warning toast
    else Currently Admitted
        API->>DB: UPDATE patients SET status = 'DISCHARGED' WHERE id = 10
        DB-->>API: Updated record
        API-->>UI: 200 OK (Updated PatientResponseDto)
        UI-->>Staff: Update status badge to DISCHARGED
    end
```

---

## 8. Project Folder Structure

```
mediflow/
├── .github/
│   └── workflows/
│       └── ci.yml                 # GitHub Actions CI build & test pipeline
├── backend/
│   ├── .env.example               # Backend environment variable template
│   ├── Dockerfile                 # Multi-stage production container build
│   ├── pom.xml                    # Maven build file with Spring Boot 3.3.5
│   └── src/
│       ├── main/
│       │   ├── java/com/mediflow/
│       │   │   ├── MediflowApplication.java
│       │   │   ├── config/        # WebMvc & CORS configuration
│       │   │   ├── controller/    # REST API endpoints
│       │   │   ├── dto/           # Request/response records & data contracts
│       │   │   ├── entity/        # JPA Entities (Patient, Ward, Department, Doctor)
│       │   │   ├── exception/     # GlobalExceptionHandler & custom exceptions
│       │   │   ├── repository/    # Spring Data JPA repositories
│       │   │   ├── service/       # Business logic implementations
│       │   │   └── specification/ # Type-safe JPA Criteria queries
│       │   └── resources/
│       │       ├── application.yml
│       │       └── db/migration/  # Flyway SQL migrations (V1 schema, V2 seed)
│       └── test/
│           ├── java/com/mediflow/ # JUnit 5 service & validation unit tests
│           └── resources/
│               └── application-test.yml
├── docs/
│   └── screenshots/               # Verified UI application screenshots
├── frontend/
│   ├── .env.example               # Frontend environment variable template
│   ├── package.json               # React 19, Vite, Tailwind v4, Axios
│   ├── tsconfig.json              # TypeScript configuration
│   ├── vite.config.ts             # Vite build & Vitest test configuration
│   └── src/
│       ├── App.tsx                # Primary application layout router
│       ├── main.tsx               # DOM entry point
│       ├── components/            # Modals, Tables, StatCards, Badges
│       ├── pages/                 # DashboardPage, PatientsPage
│       ├── services/api.ts        # Axios client & typed service endpoints
│       ├── test/                  # Vitest UI component integration tests
│       └── types/                 # TypeScript interfaces and DTO definitions
├── docker-compose.yml             # Local multi-container development environment
├── render.yaml                    # Infrastructure as Code specification for Render
├── .gitignore                     # Git ignore rules protecting secrets & build outputs
└── README.md                      # Comprehensive technical documentation
```

---

## 9. Database Design & Entity Relationships

The schema is normalized to 3NF and strictly preserves referential integrity with foreign key restrictions.

```mermaid
erDiagram
    DEPARTMENTS ||--o{ DOCTORS : "employs"
    DEPARTMENTS ||--o{ PATIENTS : "assigns"
    WARDS ||--o{ PATIENTS : "accommodates"
    DOCTORS ||--o{ PATIENTS : "treats"

    DEPARTMENTS {
        bigserial id PK
        varchar(100) name UK "NOT NULL"
        varchar(20) code "NOT NULL"
        timestamptz created_at
    }

    WARDS {
        bigserial id PK
        varchar(100) name UK "NOT NULL"
        varchar(20) code "NOT NULL"
        integer capacity "NOT NULL, DEFAULT 30"
        timestamptz created_at
    }

    DOCTORS {
        bigserial id PK
        varchar(100) name "NOT NULL"
        bigint department_id FK "NOT NULL"
        varchar(100) specialization
        timestamptz created_at
    }

    PATIENTS {
        bigserial id PK
        varchar(30) patient_code UK "NOT NULL"
        varchar(150) name "NOT NULL"
        integer age "CHECK (age >= 0 AND age <= 120)"
        varchar(20) gender "NOT NULL"
        bigint ward_id FK "NOT NULL"
        bigint department_id FK "NOT NULL"
        bigint doctor_id FK "NOT NULL"
        date admission_date "NOT NULL"
        varchar(20) status "DEFAULT 'ADMITTED'"
        varchar(255) diagnosis
        timestamptz created_at
        timestamptz updated_at
    }
```

### Table Specifications & Indexing Strategy

1. **`departments`**: Clinical operational units (e.g., Cardiology, Intensive Care). Unique index on `name`.
2. **`wards`**: Physical facility units with predefined capacity counts. Unique index on `name`.
3. **`doctors`**: Licensed medical practitioners assigned to departments. Foreign key `department_id` references `departments(id)` with `ON DELETE RESTRICT`. Indexed on `department_id`.
4. **`patients`**: Admission records. Enforces:
   - Unique patient code (`PAT-XXXX`).
   - Foreign key restraints against `wards`, `departments`, and `doctors` with `ON DELETE RESTRICT` (preventing orphan records).
   - Database check constraint `CHECK (age >= 0 AND age <= 120)`.
   - Functional index `idx_patients_name` on `LOWER(name)` for fast case-insensitive search.
   - B-Tree indexes on `status`, `admission_date`, `ward_id`, `department_id`, and `doctor_id` for multi-filter query acceleration.

---

## 10. REST API Documentation

All responses are wrapped in a standard JSON envelope:

```json
{
  "success": true,
  "message": "Operation description",
  "data": { ... },
  "errors": null,
  "timestamp": "2026-11-25T20:25:00Z"
}
```

### Patient Management Endpoints

| Method | Endpoint | Query Parameters | Description | Status Codes |
|---|---|---|---|---|
| `GET` | `/api/patients` | `search` (string)<br>`wardId` (long)<br>`departmentId` (long)<br>`doctorId` (long)<br>`status` (`ADMITTED` \| `DISCHARGED`)<br>`page` (int, default `0`)<br>`size` (int, default `10`)<br>`sort` (string, default `admissionDate,desc`) | Retrieve paginated and filtered patient records | `200 OK` |
| `GET` | `/api/patients/{id}` | None | Fetch single patient details by primary key | `200 OK`<br>`404 Not Found` |
| `POST` | `/api/patients` | None | Create and admit a new patient record | `201 Created`<br>`400 Bad Request` |
| `PUT` | `/api/patients/{id}` | None | Update an existing patient record | `200 OK`<br>`400 Bad Request`<br>`404 Not Found` |
| `DELETE`| `/api/patients/{id}` | None | Permanently delete a patient record | `200 OK`<br>`404 Not Found` |
| `PATCH` | `/api/patients/{id}/discharge` | None | Idempotent transition of patient status to `DISCHARGED` | `200 OK`<br>`404 Not Found`<br>`409 Conflict` |

#### Create Patient Request Payload (`POST /api/patients`)
```json
{
  "name": "Sarah Connor",
  "age": 34,
  "gender": "Female",
  "wardId": 1,
  "departmentId": 1,
  "doctorId": 1,
  "admissionDate": "2026-11-25",
  "diagnosis": "Severe Angina"
}
```

### Dashboard & Analytics Endpoints

| Method | Endpoint | Description | Status Codes |
|---|---|---|---|
| `GET` | `/api/dashboard/summary` | Returns real-time KPI metrics (`totalPatients`, `admittedPatients`, `dischargedPatients`, `admissionsToday`), ward occupancies, department distribution, and recent admissions. | `200 OK` |

### Reference Data & Health Endpoints

| Method | Endpoint | Query Parameters | Description | Status Codes |
|---|---|---|---|---|
| `GET` | `/api/departments` | None | List all hospital departments | `200 OK` |
| `GET` | `/api/wards` | None | List all wards with capacity metrics | `200 OK` |
| `GET` | `/api/doctors` | `departmentId` (optional) | List doctors, optionally filtered by department | `200 OK` |
| `GET` | `/api/health` | None | Service liveness health check | `200 OK` |
| `GET` | `/actuator/health` | None | Spring Boot Actuator deep health check | `200 OK` |

---

## 11. Input Validation & Error Handling

MediFlow implements rigorous multi-tier validation across the presentation, application, and persistence layers:

### Validation Rules Matrix

| Field | Rule / Annotation | Constraint Details | Error Response |
|---|---|---|---|
| `name` | `@NotBlank`, `@Size(min=2, max=100)`, `@Pattern` | Must contain 2–100 characters; letters, spaces, hyphens, and periods only. | `"Patient name must contain only letters, spaces, hyphens, or periods"` |
| `age` | `@NotNull`, `@Min(0)`, `@Max(120)` | Valid integer between 0 and 120. | `"Age must be between 0 and 120"` |
| `gender` | `@NotBlank`, `@Pattern` | Allowed values: `Male`, `Female`, `Other`. | `"Gender must be Male, Female, or Other"` |
| `wardId` | `@NotNull` | Must exist in `wards` table. | `"Ward ID is required"` / `404 Not Found` |
| `departmentId`| `@NotNull` | Must exist in `departments` table. | `"Department ID is required"` / `404 Not Found` |
| `doctorId` | `@NotNull` | Must exist in `doctors` table and **belong to the selected department**. | `"Selected doctor does not belong to the chosen department"` |
| `admissionDate`| `@NotNull`, `@PastOrPresent` | ISO Date `YYYY-MM-DD` on or before current date. | `"Admission date cannot be in the future"` |
| `diagnosis` | `@Size(max=255)` | Optional description up to 255 characters. | `"Diagnosis cannot exceed 255 characters"` |

### Error Response Format (`400 Bad Request`)
```json
{
  "success": false,
  "message": "Validation failed",
  "data": null,
  "errors": {
    "name": "Patient name must contain only letters, spaces, hyphens, or periods",
    "age": "Age must be between 0 and 120"
  },
  "timestamp": "2026-11-25T20:25:00Z"
}
```

---

## 12. Local Installation & Setup Instructions

### Prerequisites
- **Java:** JDK 17 or higher (`java -version`)
- **Node.js:** Node 20.x or higher (`node -v`)
- **Package Manager:** npm 10.x or higher (`npm -v`)
- **Maven:** 3.8+ (or use the packaged Maven wrapper/IDE tool)
- **Database:** Local PostgreSQL 15+ instance or a cloud Neon PostgreSQL connection string

### Step 1: Clone Repository
```bash
git clone https://github.com/shivarajrathod08/mediflow-patient-admission-management.git
cd mediflow-patient-admission-management
```

### Step 2: Database Configuration
Create a local PostgreSQL database named `mediflow`:
```sql
CREATE DATABASE mediflow;
```

---

## 13. Environment Variable Configuration

Templates are provided in the repository. Create local `.env` files from the provided `.env.example` templates:

### Backend Configuration (`backend/.env` or system environment)
```bash
# Server Port
PORT=8080

# PostgreSQL Connection (Local or Neon)
DATABASE_URL=jdbc:postgresql://localhost:5432/mediflow
DB_USERNAME=postgres
DB_PASSWORD=your_secure_password

# Allowed CORS Origins (Comma-separated)
FRONTEND_URL=http://localhost:5173,http://localhost:3000
```

> **For Neon Cloud Database:** Set `DATABASE_URL=jdbc:postgresql://ep-example.us-east-2.aws.neon.tech/mediflow?sslmode=require`.

### Frontend Configuration (`frontend/.env`)
```bash
# Backend REST API endpoint (with /api suffix)
VITE_API_BASE_URL=http://localhost:8080/api
```

---

## 14. Execution Commands

### Running Backend (Spring Boot)

#### On Windows (PowerShell):
```powershell
cd backend
$env:DATABASE_URL="jdbc:postgresql://localhost:5432/mediflow"
$env:DB_USERNAME="postgres"
$env:DB_PASSWORD="your_password"
$env:FRONTEND_URL="http://localhost:5173"
mvn spring-boot:run
```

#### On Linux / macOS:
```bash
cd backend
export DATABASE_URL="jdbc:postgresql://localhost:5432/mediflow"
export DB_USERNAME="postgres"
export DB_PASSWORD="your_password"
export FRONTEND_URL="http://localhost:5173"
mvn spring-boot:run
```

The backend server starts on `http://localhost:8080`. Verify health:
```bash
curl http://localhost:8080/api/health
```

### Running Frontend (React + Vite)
```bash
cd frontend
npm install
npm run dev
```

The frontend application starts on `http://localhost:5173`.

### Running with Docker Compose
To run the full stack (PostgreSQL, Spring Boot backend, and React frontend) with a single command:
```bash
docker-compose up --build
```
Access the application at `http://localhost:3000`.

---

## 15. Database Migration Instructions

MediFlow uses **Flyway** for database versioning. Migrations execute automatically on application startup.

### Migration Files
1. `V1__init_schema.sql`: Creates `departments`, `wards`, `doctors`, and `patients` tables with foreign keys and indexes.
2. `V2__seed_reference_data.sql`: Seeds reference departments, wards, doctors, and initial realistic patient demo records.

### Manual Migration Verification
To check migration status using Maven:
```bash
cd backend
mvn flyway:info -Dflyway.url="jdbc:postgresql://localhost:5432/mediflow" -Dflyway.user="postgres" -Dflyway.password="your_password"
```

To repair migration history if a script was modified during development:
```bash
mvn flyway:repair
```

---

## 16. Deployment Architecture

MediFlow is deployed using a decoupled, production-grade cloud architecture:

```
┌──────────────────────────────────────┐
│       React 19 + Vite Frontend       │
│  https://mediflow-frontend-suue...   │
│             (Render Static)          │
└──────────────────┬───────────────────┘
                   │
                   │ HTTPS API Requests (Axios)
                   │ VITE_API_BASE_URL
                   ▼
┌──────────────────────────────────────┐
│      Spring Boot 3 REST Backend      │
│  https://mediflow-patient-admis...   │
│          (Render Web Service)        │
└──────────────────┬───────────────────┘
                   │
                   │ JDBC SSL Connection
                   │ DATABASE_URL (?sslmode=require)
                   ▼
┌──────────────────────────────────────┐
│       Neon Serverless PostgreSQL     │
│       ep-****.us-east-2.aws.neon.tech│
│            (Managed Cloud DB)        │
└──────────────────────────────────────┘
```

### Deployment Configuration Steps

#### 1. Neon PostgreSQL Setup
1. Create a serverless project on [Neon](https://neon.tech).
2. Obtain the connection string: `postgresql://user:password@ep-name.us-east-2.aws.neon.tech/mediflow?sslmode=require`.
3. Spring Boot converts this into:
   - `DATABASE_URL`: `jdbc:postgresql://ep-name.us-east-2.aws.neon.tech/mediflow?sslmode=require`
   - `DB_USERNAME`: `user`
   - `DB_PASSWORD`: `password`

#### 2. Backend Deployment on Render
1. Create a **Web Service** linked to the GitHub repository with **Root Directory** set to `backend`.
2. Select **Docker** or **Java** runtime (Build command: `mvn clean package -DskipTests`, Start command: `java -jar target/mediflow-backend-0.0.1-SNAPSHOT.jar`).
3. Configure Environment Variables in Render Dashboard:
   - `PORT`: `8080`
   - `DATABASE_URL`: `jdbc:postgresql://<neon-host>/mediflow?sslmode=require`
   - `DB_USERNAME`: `<neon-user>`
   - `DB_PASSWORD`: `<neon-password>`
   - `FRONTEND_URL`: `https://mediflow-frontend-suue.onrender.com`
4. Set Health Check path: `/api/health`.

#### 3. Frontend Deployment on Render
1. Create a **Static Site** linked to the GitHub repository with **Root Directory** set to `frontend`.
2. Build command: `npm install && npm run build`.
3. Publish directory: `dist`.
4. Configure Environment Variable:
   - `VITE_API_BASE_URL`: `https://mediflow-patient-admission-management.onrender.com/api`
5. Configure rewrite rule for Single Page Application routing:
   - Source: `/*`
   - Destination: `/index.html`

---

## 17. Testing Instructions

Both the frontend and backend include automated test suites verified in the CI pipeline:

### Backend Unit & Integration Tests (JUnit 5 + Mockito)
Tests cover:
- `PatientServiceTest`: Create, update, delete, getById, discharge, and doctor-department cross-validation.
- `PatientValidationTest`: Jakarta Bean Validation edge cases on age limits, name regex, and mandatory fields.

Run backend tests:
```bash
cd backend
mvn clean test
```

### Frontend Component & Integration Tests (Vitest + React Testing Library)
Tests cover:
- Metric card calculation rendering.
- Patient management table data display.
- Add patient modal opening and form interaction.
- Patient status filtering logic.
- Patient discharge state mutation.

Run frontend tests:
```bash
cd frontend
npm test
```

Run frontend production build verification:
```bash
npm run build
```

---

## 18. Future Improvements

While MediFlow currently delivers an end-to-end, production-grade management system, planned enhancements for future iterations include:
- **Role-Based Access Control (RBAC):** Implementing Spring Security with JWT authentication distinguishing roles (`DOCTOR`, `NURSE`, `ADMIN`).
- **Electronic Health Record (EHR) Export:** PDF and CSV discharge summary generation.
- **WebSocket Push Notifications:** Real-time push updates notifying ward staff immediately when an ICU or emergency bed is assigned.
- **Audit Logging:** An automated audit trail tracking every patient record modification with actor timestamps.
- **Bed Management Matrix:** Interactive visual SVG floor plan mapping beds within each ward.

---

## 19. Author & Project Information

**Author:** Rathlavath Shivaraj  
**GitHub:** [@shivarajrathod08](https://github.com/shivarajrathod08)  
**LinkedIn:** [rathavathshivaraj](https://www.linkedin.com/in/rathlavathshivaraj/)  
**Evaluation:** DScribe Software Engineer Intern Evaluation Project  

---
*Developed with modern software craftsmanship, clean architecture, and rigorous validation standards.*
