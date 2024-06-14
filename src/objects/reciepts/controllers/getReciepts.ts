import { Response, NextFunction } from 'express';
import { AuthenticatedRequest } from '../../middlewares/authenticatedRequest';
import Receipt from '../models/reciept';

const getReciepts = async (req: AuthenticatedRequest, res: Response, next: NextFunction) => {
    try {
        const memberId = req.userId;

        if (!memberId) {
            return res.status(404).send("userId not found");
        }
        const recieptsFound = await Receipt.find({ created_by: memberId });
        return res.status(200).send({recieptsFound});
        
    } catch (e) {
        return res.status(401).send({message:`Error in fetching reciepts ${e}` });
    }
};

export default getReciepts;
