require("dotenv").config();
const mongoose = require("mongoose");
const Place = require("../models/Place");
const Event = require("../models/Event");

(async ()=>{
  await mongoose.connect(process.env.MONGO_URI);
  await Place.deleteMany({});
  await Event.deleteMany({});
  await Place.insertMany([
    { name:"Café Central", description:"Especialidad", category:"cafeteria", tags:["wifi","pet-friendly"], location:{ type:"Point", coordinates:[-75.57,6.24] }, address:"Cra 10 #20-30", ratingAvg:4.6, ratingCount:35 },
    { name:"Parque Río", description:"Ribera", category:"parque", tags:["gratis"], location:{ type:"Point", coordinates:[-75.56,6.25] } }
  ]);
  await Event.insertMany([
    { title:"Yoga al amanecer", description:"Clase abierta", tags:["salud"], location:{ type:"Point", coordinates:[-75.56,6.24] }, address:"Parque Río", dateStart:new Date(Date.now()+86400000), dateEnd:new Date(Date.now()+90000000), capacity:30 }
  ]);
  console.log("Seed listo");
  process.exit(0);
})();
