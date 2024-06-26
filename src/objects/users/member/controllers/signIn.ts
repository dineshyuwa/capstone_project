import { Request, Response, NextFunction } from 'express';
import Member from '../models/member';
import bcrypt from 'bcrypt';
import jwt from 'jsonwebtoken';

interface LoginRequestBody {
  email: string;
  hashed_password: string;
}

interface MemberDocument {
  email: string;
  hashed_password: string;
  _id: string;
}

const jwtSecretKey = process.env.MEMBER_SECRET_ACCESS_KEY;
const accessTokenExpiry = '4h';

if (!jwtSecretKey) {
  console.error('JWT secret keys are not set in environment variables.');
  process.exit(1);
}

const login = async (req: Request, res: Response, next: NextFunction) => {
  try {

    const { email, hashed_password }: LoginRequestBody = req.body;

    const member = await Member.findOne({ email }) as MemberDocument | null;
    if (!member) {
      return res.status(401).json({ error: 'A user with this email could not be found' });
    }

    const isPasswordValid = await bcrypt.compare(hashed_password, member.hashed_password);
    if (!isPasswordValid) {
      return res.status(401).json({ error: 'Wrong password!' });
    }

    const accessToken = jwt.sign(
      { email: member.email, userId: member._id.toString() },
      jwtSecretKey,
      { expiresIn: accessTokenExpiry }
    );

    res.status(200).json({ accessToken, userId: member._id.toString(),msg:"Successfully LoggedIn" });
  } catch (err) {
    console.error(err);
    res.status(500).json({ error: 'Internal server error' });
  }
};

export default login;
