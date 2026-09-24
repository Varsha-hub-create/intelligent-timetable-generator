# API Reference

## GET /api/master-data
Returns divisions, subjects, faculty, rooms and availability.

## POST /api/generate
Generates a timetable.

Success:
```json
{"message":"Timetable generated successfully","count":48}
```

Impossible constraints:
```json
{
  "message":"No valid timetable could be generated under the current hard constraints.",
  "diagnostics":[...]
}
```

## GET /api/timetable
Returns generated sessions with division, subject, faculty and room details.

## DELETE /api/timetable
Clears the current timetable.

## POST /api/divisions
Creates a division.

## POST /api/faculty
Creates faculty.

## POST /api/rooms
Creates a room.

## POST /api/subjects
Creates a subject.
