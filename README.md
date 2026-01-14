# Task Planning Web App

Proiect pentru Tehnologii Web — Echipa **404found**

O aplicatie web pentru gestionarea task-urilor intr-o echipa de IT Support.

## Echipa

- Selea Rares Mihail
- Voicu Ioana Delia  
- Ciobanu Matei Daniel

## Descriere

Aplicatia permite:
- Crearea si alocarea task-urilor de catre manageri
- Vizualizarea si completarea task-urilor de catre specialisti
- Urmarirea starii fiecarui task (OPEN, PENDING, COMPLETED, CLOSED)

## Tehnologii folosite

- **Backend**: Node.js, Express, Prisma ORM
- **Baza de date**: PostgreSQL
- **Frontend**: React + Vite (in lucru)

## Cum rulez proiectul?

### Ce trebuie instalat inainte

- Node.js (https://nodejs.org)
- PostgreSQL (https://postgresql.org)

### Pasii de setup

1. Cloneaza repo-ul
```
git clone https://github.com/Rares21m/Task-planning-web-app.git
cd Task-planning-web-app
```

2. Intra in folderul server si instaleaza dependentele
```
cd server
npm install
```

3. Creeaza baza de date in PostgreSQL
```
psql -U postgres
CREATE DATABASE taskdb;
\q
```

4. Configureaza fisierul .env
```
cp .env.example .env
```
Apoi editeaza `.env` si pune parola ta de la PostgreSQL.

5. Ruleaza migrarile
```
npx prisma migrate dev
npx prisma generate
```

6. Porneste serverul
```
npm run dev
```

Serverul porneste pe http://localhost:3000

## Testare API cu Postman

Pentru a testa endpoint-urile, folosim Postman (sau orice alt client HTTP).

### 1. Health Check (verifici daca serverul merge)

- **GET** `http://localhost:3000/api/health`
- Raspuns: `{"status":"OK","message":"Server is running"}`

### 2. Register (creezi un user)

- **POST** `http://localhost:3000/api/auth/register`
- Headers: `Content-Type: application/json`
- Body (raw JSON):
```json
{
  "email": "manager@test.com",
  "password": "parola123",
  "name": "Test Manager",
  "role": "IT_MANAGER"
}
```

### 3. Login (te autentifici)

- **POST** `http://localhost:3000/api/auth/login`
- Body:
```json
{
  "email": "manager@test.com",
  "password": "parola123"
}
```
- Primesti un token JWT pe care il folosesti pentru celelalte request-uri

### 4. Creare Task (cu token)

- **POST** `http://localhost:3000/api/tasks`
- Headers:
  - `Content-Type: application/json`
  - `Authorization: Bearer TOKEN_TAU_AICI`
- Body:
```json
{
  "title": "Configurare laptop",
  "description": "Setup Windows pentru angajat nou",
  "priority": "HIGH"
}
```

### 5. Vezi toate task-urile

- **GET** `http://localhost:3000/api/tasks`
- Headers: `Authorization: Bearer TOKEN_TAU_AICI`

## Endpoint-uri API

### Auth
- `POST /api/auth/register` - inregistrare
- `POST /api/auth/login` - login
- `GET /api/auth/me` - user curent

### Users (doar admin)
- `GET /api/users` - toti userii
- `GET /api/users/specialists` - lista specialisti
- `POST /api/users` - creare user
- `PUT /api/users/:id` - editare
- `DELETE /api/users/:id` - stergere

### Tasks
- `GET /api/tasks` - toate task-urile
- `POST /api/tasks` - creare task
- `PUT /api/tasks/:id` - editare
- `DELETE /api/tasks/:id` - stergere
- `PATCH /api/tasks/:id/assign` - alocare la specialist
- `PATCH /api/tasks/:id/complete` - marcare completat
- `PATCH /api/tasks/:id/close` - inchidere task

## Roluri

- **ADMINISTRATOR** - gestioneaza userii
- **IT_MANAGER** - creeaza si aloca task-uri
- **IT_SPECIALIST** - rezolva task-urile alocate

## Flux task-uri

```
OPEN -> PENDING -> COMPLETED -> CLOSED
```

- OPEN = creat, neasignat
- PENDING = asignat unui specialist
- COMPLETED = finalizat de specialist
- CLOSED = validat de manager
# Task Planning Web App

Proiect pentru Tehnologii Web — Echipa **404found**

O aplicatie web pentru gestionarea task-urilor intr-o echipa de IT Support.

## Echipa

- Selea Rares Mihail
- Voicu Ioana Delia  
- Ciobanu Matei Daniel

## Descriere

Aplicatia permite:
- Crearea si alocarea task-urilor de catre manageri
- Vizualizarea si completarea task-urilor de catre specialisti
- Urmarirea starii fiecarui task (OPEN, PENDING, COMPLETED, CLOSED)
- Gestionarea utilizatorilor de catre administrator

## Tehnologii folosite

### Backend
- **Node.js** - runtime JavaScript
- **Express.js** - framework web
- **Prisma ORM** - interactiunea cu baza de date
- **PostgreSQL** - baza de date
- **JWT** - autentificare

### Frontend
- **React** - biblioteca UI
- **Vite** - build tool
- **React Router** - navigare SPA
- **Tailwind CSS** - stilizare
- **Axios** - HTTP requests
- **Lucide React** - iconite

## Arhitectura

Aplicatia are 3 parti principale:

1. **Frontend** (React) - ruleaza in browser pe portul 5173
2. **Backend** (Express) - API-ul care ruleaza pe portul 3000
3. **Baza de date** (PostgreSQL) - stocheaza datele

Frontend-ul face request-uri HTTP catre backend, iar backend-ul comunica cu baza de date prin Prisma.

## Instalare

### Cerinte
- Node.js (https://nodejs.org)
- PostgreSQL (https://postgresql.org)

### Pasii de setup

1. **Cloneaza repo-ul**
```bash
git clone https://github.com/Rares21m/Task-planning-web-app.git
cd Task-planning-web-app
```

2. **Setup Backend**
```bash
cd server
npm install
```

3. **Creeaza baza de date in PostgreSQL**
```sql
CREATE DATABASE taskdb;
```

4. **Configureaza fisierul .env**
```bash
cp .env.example .env
```
Editeaza `.env` si pune parola ta de la PostgreSQL.

5. **Ruleaza migrarile**
```bash
npx prisma migrate dev
npx prisma generate
```

6. **Porneste serverul backend**
```bash
npm run dev
```
Serverul porneste pe http://localhost:3000

7. **Setup Frontend** (intr-un terminal nou)
```bash
cd client
npm install
npm run dev
```
Frontend-ul porneste pe http://localhost:5173

## Roluri si Permisiuni

| Rol | Permisiuni |
|-----|-----------|
| **ADMINISTRATOR** | Gestioneaza toti utilizatorii (creare, editare, stergere) |
| **IT_MANAGER** | Creeaza task-uri, aloca task-uri, inchide task-uri, vede istoricul echipei |
| **IT_SPECIALIST** | Vede task-urile alocate lui, marcheaza task-urile ca finalizate |

## Flux Task-uri

Un task trece prin urmatoarele stari:

1. **OPEN** - task-ul a fost creat de manager, dar nu e asignat nimanui
2. **PENDING** - managerul a alocat task-ul unui specialist, care lucreaza la el
3. **COMPLETED** - specialistul a terminat si a marcat task-ul ca finalizat
4. **CLOSED** - managerul a verificat si a inchis task-ul

## Endpoint-uri API

### Auth
- `POST /api/auth/register` - inregistrare utilizator
- `POST /api/auth/login` - autentificare
- `GET /api/auth/me` - utilizator curent

### Users (doar admin)
- `GET /api/users` - lista utilizatori
- `GET /api/users/specialists` - lista specialisti
- `POST /api/users` - creare utilizator
- `PUT /api/users/:id` - editare utilizator
- `DELETE /api/users/:id` - stergere utilizator

### Tasks
- `GET /api/tasks` - lista task-uri
- `GET /api/tasks/:id` - detalii task
- `POST /api/tasks` - creare task (manager)
- `PUT /api/tasks/:id` - editare task (manager)
- `DELETE /api/tasks/:id` - stergere task (manager)
- `PATCH /api/tasks/:id/assign` - alocare task (manager)
- `PATCH /api/tasks/:id/complete` - finalizare task (specialist)
- `PATCH /api/tasks/:id/close` - inchidere task (manager)
- `GET /api/tasks/history/:userId` - istoric task-uri utilizator (manager)

## Structura Proiectului

Proiectul e impartit in 2 foldere principale:

**server/** - contine tot codul pentru backend:
- `src/controllers/` - logica pentru fiecare endpoint
- `src/routes/` - definirea rutelor API
- `src/middleware/` - autentificare si verificare roluri
- `prisma/schema.prisma` - schema bazei de date

**client/** - contine tot codul pentru frontend:
- `src/pages/` - paginile aplicatiei (Login, Dashboard, Tasks, etc.)
- `src/components/` - componente reutilizabile (Layout, etc.)
- `src/context/` - AuthContext pentru gestionarea autentificarii
- `src/services/api.js` - functiile pentru request-uri HTTP

## Pagini Aplicatie

| Pagina | Descriere |
|--------|-----------|
| `/login` | Autentificare utilizator |
| `/register` | Inregistrare cont nou |
| `/dashboard` | Statistici si task-uri recente |
| `/tasks` | Lista completa task-uri cu filtrare si cautare |
| `/users` | Gestionare utilizatori (doar admin) |
| `/team` | Echipa si istoric task-uri (doar manager) |

## Testare API cu Postman

### 1. Health Check
- **GET** `http://localhost:3000/api/health`
- Raspuns: `{"status":"OK","message":"Server is running"}`

### 2. Register
- **POST** `http://localhost:3000/api/auth/register`
- Body:
```json
{
  "email": "manager@test.com",
  "password": "parola123",
  "name": "Test Manager",
  "role": "IT_MANAGER"
}
```

### 3. Login
- **POST** `http://localhost:3000/api/auth/login`
- Body:
```json
{
  "email": "manager@test.com",
  "password": "parola123"
}
```
- Primesti un token JWT pentru celelalte request-uri

### 4. Creare Task (cu token)
- **POST** `http://localhost:3000/api/tasks`
- Headers: `Authorization: Bearer TOKEN_TAU`
- Body:
```json
{
  "title": "Configurare laptop",
  "description": "Setup Windows pentru angajat nou",
  "priority": "HIGH"
}
```

## Conturi de Test

| Email | Parola | Rol |
|-------|--------|-----|
| admin@test.com | parola123 | Administrator |
| manager.test@test.com | parola123 | IT Manager |
| specialist.test@test.com | parola123 | IT Specialist |

## Baza de Date

### Tabelul User
- `id` - UUID
- `email` - unic
- `password` - hash bcrypt
- `name` - nume utilizator
- `role` - ADMINISTRATOR / IT_MANAGER / IT_SPECIALIST
- `managerId` - referinta catre manager (optional)

### Tabelul Task
- `id` - UUID
- `title` - titlu task
- `description` - descriere
- `status` - OPEN / PENDING / COMPLETED / CLOSED
- `priority` - LOW / MEDIUM / HIGH
- `createdById` - utilizatorul care a creat
- `assignedToId` - utilizatorul asignat

