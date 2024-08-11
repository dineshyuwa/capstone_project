import express from 'express';
import mongoose from 'mongoose';
import 'dotenv/config';
import cors from 'cors';

import MemberRoutes from './objects/users/member/routes/memberRoutes';
import RecieptRoutes from './objects/reciepts/routes/recieptRoutes';
import TestRedisRoutes from './objects/redisTest/routes/testRedisRoutes';

const server = express();

server.use(express.json());
server.use(cors());


server.use('/member', MemberRoutes);

server.use('/reciept', RecieptRoutes);

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

server.use('/test_redis', TestRedisRoutes);

server.listen(5001, () => {
  console.log("listening on port -> " + 5001);
});
