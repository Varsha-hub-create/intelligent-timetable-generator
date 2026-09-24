import { PrismaClient } from "@prisma/client";
const prisma = new PrismaClient();

async function main() {
  await prisma.timetable.deleteMany();
  await prisma.facultyAvailability.deleteMany();
  await prisma.divisionSubject.deleteMany();
  await prisma.subject.deleteMany();
  await prisma.faculty.deleteMany();
  await prisma.room.deleteMany();
  await prisma.division.deleteMany();

  const divisions = await Promise.all([
    prisma.division.create({data:{name:"CSE-A",year:3,studentCount:55}}),
    prisma.division.create({data:{name:"CSE-B",year:3,studentCount:48}}),
    prisma.division.create({data:{name:"IT-A",year:2,studentCount:52}})
  ]);

  const faculty = await Promise.all([
    prisma.faculty.create({data:{name:"Dr. Arun",email:"arun@college.edu"}}),
    prisma.faculty.create({data:{name:"Ms. Priya",email:"priya@college.edu"}}),
    prisma.faculty.create({data:{name:"Mr. Karthik",email:"karthik@college.edu"}}),
    prisma.faculty.create({data:{name:"Dr. Meena",email:"meena@college.edu"}})
  ]);

  const rooms = await Promise.all([
    prisma.room.create({data:{name:"A-101",capacity:70,type:"CLASSROOM"}}),
    prisma.room.create({data:{name:"A-102",capacity:60,type:"CLASSROOM"}}),
    prisma.room.create({data:{name:"CS-LAB-1",capacity:60,type:"LAB"}}),
    prisma.room.create({data:{name:"IT-LAB-1",capacity:55,type:"LAB"}})
  ]);

  const subjects = await Promise.all([
    prisma.subject.create({data:{code:"CS301",name:"Data Structures",weeklyPeriods:4,facultyId:faculty[0].id,roomType:"CLASSROOM"}}),
    prisma.subject.create({data:{code:"CS302",name:"Database Systems",weeklyPeriods:3,facultyId:faculty[1].id,roomType:"CLASSROOM"}}),
    prisma.subject.create({data:{code:"CS303",name:"Operating Systems",weeklyPeriods:3,facultyId:faculty[2].id,roomType:"CLASSROOM"}}),
    prisma.subject.create({data:{code:"CS304",name:"DS Lab",weeklyPeriods:2,facultyId:faculty[0].id,roomType:"LAB"}}),
    prisma.subject.create({data:{code:"IT201",name:"Web Technology",weeklyPeriods:4,facultyId:faculty[3].id,roomType:"CLASSROOM"}})
  ]);

  for (const d of divisions) {
    for (const s of subjects) {
      if (s.code !== "IT201" || d.name === "IT-A")
        await prisma.divisionSubject.create({data:{divisionId:d.id,subjectId:s.id}});
    }
  }

  for (const f of faculty) {
    for (let day=1; day<=5; day++)
      for (let period=1; period<=7; period++)
        await prisma.facultyAvailability.create({data:{facultyId:f.id,day,period,available:true}});
  }
  console.log("Seed completed");
}
main().finally(()=>prisma.$disconnect());