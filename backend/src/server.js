import express from "express";
import cors from "cors";
import { PrismaClient } from "@prisma/client";
import { generateSchedule } from "./scheduler.js";

const app = express();
const prisma = new PrismaClient();
app.use(cors());
app.use(express.json());

app.get("/api/health", (_,res)=>res.json({status:"ok"}));

app.get("/api/master-data", async (_,res)=>{
  const [divisions,subjects,faculty,rooms,availability] = await Promise.all([
    prisma.division.findMany({include:{subjects:true}}),
    prisma.subject.findMany({include:{faculty:true,divisions:true}}),
    prisma.faculty.findMany(),
    prisma.room.findMany(),
    prisma.facultyAvailability.findMany()
  ]);
  res.json({divisions,subjects,faculty,rooms,availability});
});

app.post("/api/generate", async (req,res)=>{
  try {
    const [divisions,subjects,rooms,availability] = await Promise.all([
      prisma.division.findMany({include:{subjects:true}}),
      prisma.subject.findMany({include:{faculty:true,divisions:true}}),
      prisma.room.findMany(),
      prisma.facultyAvailability.findMany()
    ]);
    const result = generateSchedule({divisions,subjects,rooms,availability});
    if (!result.success)
      return res.status(422).json({
        message:"No valid timetable could be generated under the current hard constraints.",
        diagnostics:result.diagnostics.slice(-10)
      });

    await prisma.timetable.deleteMany();
    await prisma.timetable.createMany({data:result.schedule});
    res.json({message:"Timetable generated successfully",count:result.schedule.length});
  } catch (e) {
    res.status(500).json({message:e.message});
  }
});

app.get("/api/timetable", async (_,res)=>{
  const data = await prisma.timetable.findMany({
    include:{division:true,subject:true,faculty:true,room:true},
    orderBy:[{day:"asc"},{period:"asc"}]
  });
  res.json(data);
});

app.delete("/api/timetable", async (_,res)=>{
  await prisma.timetable.deleteMany();
  res.json({message:"Timetable cleared"});
});

app.post("/api/divisions", async (req,res)=>res.json(await prisma.division.create({data:req.body})));
app.post("/api/faculty", async (req,res)=>res.json(await prisma.faculty.create({data:req.body})));
app.post("/api/rooms", async (req,res)=>res.json(await prisma.room.create({data:req.body})));
app.post("/api/subjects", async (req,res)=>res.json(await prisma.subject.create({data:req.body})));

app.listen(process.env.PORT || 5000, ()=>console.log("API running on port 5000"));