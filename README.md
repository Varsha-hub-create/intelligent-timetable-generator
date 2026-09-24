<<<<<<< HEAD
# Intelligent Timetable Generator

A full-stack college timetable management and generation system for multiple divisions, subjects, faculty members, classrooms and periods.

## Features
- Manage divisions, subjects, faculty and rooms
- Configure weekly working days and periods
- Generate timetables automatically
- Hard constraints:
  - No faculty conflict
  - No division conflict
  - No classroom conflict
  - Room capacity validation
  - Room type/lab requirement validation
  - Faculty availability
  - Subject weekly occurrence requirements
  - Same-subject consecutive-period rules
- Detect and report impossible constraints
- View generated timetable by division, faculty and room
- Delete/regenerate timetable
- REST API + React frontend
- SQLite persistence through Prisma
- Seed data included

## Stack
Frontend: React, Vite, Axios, CSS
Backend: Node.js, Express, Prisma, SQLite
Algorithm: Constraint-aware backtracking scheduler

## Run

### Backend
```bash
cd backend
npm install
npx prisma generate
npx prisma migrate dev --name init
npm run seed
npm run dev
```

Backend: http://localhost:5000

### Frontend
```bash
cd frontend
npm install
npm run dev
```

Frontend: http://localhost:5173

## API
- GET /api/master-data
- POST /api/generate
- GET /api/timetable
- GET /api/timetable/division/:divisionId
- GET /api/timetable/faculty/:facultyId
- GET /api/timetable/room/:roomId
- DELETE /api/timetable
- POST /api/divisions
- POST /api/subjects
- POST /api/faculty
- POST /api/rooms

## Scheduling approach
The generator expands each subject into required weekly sessions and schedules the most constrained session first. It uses backtracking with forward checking. A candidate slot is accepted only when all hard constraints pass.

If no complete assignment exists, the API returns HTTP 422 with conflict diagnostics instead of producing an invalid timetable.
=======
# intelligent-timetable-generator
>>>>>>> 2de516323acbb7b49233ede921e09b20c61163bf
