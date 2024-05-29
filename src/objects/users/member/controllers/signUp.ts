import { Request, Response, NextFunction } from 'express';
import bcrypt from 'bcrypt';
import Member from '../models/member';
import { EMAIL_REGEX, PASSWORD_REGEX } from '../../constants/constants';
import jwt from "jsonwebtoken";

const signup = async (req: Request, res: Response, next: NextFunction) => {
    let { firstname, lastname, job,address,email, password } = req.body;

    try {
        if (!firstname) {
            return res.status(403).json({ "error": "Firstname field is empty" });
        }

        if (!lastname) {
            return res.status(403).json({ "error": "Lastname field is empty" });
        }

        if (firstname.length < 3) {
            return res.status(403).json({ "error": "Firstname must be at least 3 letters long" });
        }
    
        if (lastname.length < 3) {
            return res.status(403).json({ "error": "Lastname must be at least 3 letters long" });
        }
    
        if (!email.length) {
            return res.status(403).json({ "error": "Email field is empty !!" });
        }
    
        if (!address) {
            return res.status(403).json({ "error": "address field is empty !!" });
        }
    
        if (!EMAIL_REGEX.test(email)) {
            return res.status(403).json({ "error": "Email is invalid" });
        }
    
        if (!PASSWORD_REGEX.test(password)) {
            return res.status(403).json({ "error": "Password should be 6 to 20 characters long with a numeric, 1 lowercase and 1 uppercase letters" });
        }
    
        const hashed_password = await bcrypt.hash(password, 10);
    
        let member = new Member({
            firstname,
            lastname,
            job,
            address,
            email,
            hashed_password,
        });

        const savedMember = await member.save();

        if (process.env.MEMBER_SECRET_ACCESS_KEY) {
            const access_token = jwt.sign({ id: savedMember._id }, process.env.MEMBER_SECRET_ACCESS_KEY);

            return res.status(200).json({
                access_token,
                firstname,
                lastname,
                job,
                address,
                email,
            });
        }
    } catch (err: any) {
        if (err.name === 'MongoError' && err.code === 11000) {
            return res.status(400).json({ "error": 'Email already exists' });
        }
        if (err.name === 'ValidationError') {
            return res.status(400).json({ "error": err.message });
          }
          return res.status(500).json({ "error": err.message });
    }
};

export default signup;
