export const DAYS = [1,2,3,4,5];
export const PERIODS = [1,2,3,4,5,6,7];

function key(day, period, id) { return `${day}-${period}-${id}`; }

export function generateSchedule({ divisions, subjects, rooms, availability }) {
  const sessions = [];
  const diagnostics = [];

  for (const division of divisions) {
    for (const subject of subjects.filter(s => s.divisions.some(x => x.divisionId === division.id))) {
      for (let i=0; i<subject.weeklyPeriods; i++) {
        sessions.push({
          id: `${division.id}-${subject.id}-${i}`,
          division,
          subject,
          faculty: subject.faculty,
          occurrence: i
        });
      }
    }
  }

  // Most constrained first: labs, high student count, then higher occurrence count.
  sessions.sort((a,b) => {
    const score = s => (s.subject.roomType === "LAB" ? 1000 : 0) + s.division.studentCount * 2 + s.subject.weeklyPeriods;
    return score(b)-score(a);
  });

  const assigned = [];
  const usedDivision = new Set();
  const usedFaculty = new Set();
  const usedRoom = new Set();
  const byDivisionSubject = new Map();

  const facultyAvailability = new Set(
    availability.filter(a=>a.available).map(a=>key(a.day,a.period,a.facultyId))
  );

  function candidates(session) {
    const result = [];
    for (const day of DAYS) {
      for (const period of PERIODS) {
        if (!facultyAvailability.has(key(day,period,session.faculty.id))) continue;
        if (usedDivision.has(key(day,period,session.division.id))) continue;
        if (usedFaculty.has(key(day,period,session.faculty.id))) continue;

        const possibleRooms = rooms.filter(r =>
          r.capacity >= session.division.studentCount &&
          (session.subject.roomType === "ANY" || r.type === session.subject.roomType) &&
          !usedRoom.has(key(day,period,r.id))
        );
        for (const room of possibleRooms) result.push({day,period,room});
      }
    }
    return result;
  }

  function respectsSpacing(session, c) {
    const k = `${session.division.id}-${session.subject.id}`;
    const prior = byDivisionSubject.get(k) || [];
    // Avoid unnecessary back-to-back repetition unless the subject requires it.
    return prior.every(x => !(x.day === c.day && Math.abs(x.period-c.period) === 1));
  }

  function place(index) {
    if (index === sessions.length) return true;
    const session = sessions[index];
    let cs = candidates(session).filter(c=>respectsSpacing(session,c));

    if (!cs.length) {
      diagnostics.push({
        division: session.division.name,
        subject: session.subject.name,
        faculty: session.faculty.name,
        reason: "No feasible day/period/room combination remains."
      });
      return false;
    }

    for (const c of cs) {
      const record = {day:c.day,period:c.period,divisionId:session.division.id,subjectId:session.subject.id,facultyId:session.faculty.id,roomId:c.room.id,duration:session.subject.duration};
      assigned.push(record);
      usedDivision.add(key(c.day,c.period,session.division.id));
      usedFaculty.add(key(c.day,c.period,session.faculty.id));
      usedRoom.add(key(c.day,c.period,c.room.id));
      const k = `${session.division.id}-${session.subject.id}`;
      byDivisionSubject.set(k,[...(byDivisionSubject.get(k)||[]),c]);

      if (place(index+1)) return true;

      assigned.pop();
      usedDivision.delete(key(c.day,c.period,session.division.id));
      usedFaculty.delete(key(c.day,c.period,session.faculty.id));
      usedRoom.delete(key(c.day,c.period,c.room.id));
      const arr=byDivisionSubject.get(k)||[];
      arr.pop();
      byDivisionSubject.set(k,arr);
    }
    return false;
  }

  const success = place(0);
  return {success, schedule: assigned, diagnostics};
}