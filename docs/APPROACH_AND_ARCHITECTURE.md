# Approach and Architecture

## 1. Problem interpretation
The system must create weekly schedules for divisions while assigning a subject, its faculty member and a compatible classroom to every required period.

## 2. Hard constraints
An assignment is rejected when:
1. A division already has another class in the same day/period.
2. A faculty member already teaches another class in the same day/period.
3. A room is occupied in the same day/period.
4. Room capacity is lower than the division's student count.
5. A laboratory subject is assigned to a non-laboratory room.
6. Faculty is unavailable.
7. The weekly required period count cannot be satisfied.

## 3. Algorithm
The generator uses constraint-aware backtracking:
- Expand every subject into weekly session requirements.
- Sort sessions by constraint tightness.
- Generate feasible candidates.
- Assign one candidate.
- Continue recursively.
- If a later session becomes impossible, undo the assignment and try another candidate.
- If every branch fails, return diagnostics and do not persist a partial timetable.

This approach is deterministic and easy to extend with additional constraints.

## 4. Conflict reporting
The API returns HTTP 422 when no complete solution exists. Diagnostics identify the affected division, subject and faculty and explain that no feasible combination remains.

## 5. Architecture
React UI -> Express REST API -> Scheduler service -> Prisma ORM -> SQLite

## 6. Extension points
Future constraints can include:
- Lunch breaks
- Faculty maximum consecutive periods
- Preferred periods
- Room buildings/floors
- Locked classes
- Parallel lab batches
- Subject ordering constraints
- Soft constraints and scoring
- OR-Tools/CP-SAT for large-scale scheduling

## 7. Why partial schedules are not saved
A timetable is only useful when all hard constraints are satisfied. Therefore the generated schedule is written to the database only after the scheduler finds a complete solution.
