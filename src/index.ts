import express from 'express';
import mongoose from 'mongoose';
import 'dotenv/config';
import cors from 'cors';


import MemberRoutes from './objects/users/member/routes/memberRoutes';

const server = express();

server.use(express.json());
server.use(cors());


server.use('/member', MemberRoutes);

if (process.env.DB_LOCATION) {
  mongoose.connect(process.env.DB_LOCATION, {
      autoIndex: true
  }).catch((error) => {
      throw new Error("Error connecting to MongoDB");
  })
} else {
  throw new Error("MongoDB connection string not present");
}

server.listen(process.env.PORT, () => {
  console.log("listening on port -> " + process.env.PORT);
})