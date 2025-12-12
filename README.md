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
