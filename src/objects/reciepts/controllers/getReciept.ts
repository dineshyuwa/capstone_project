import { Response, NextFunction } from 'express';
import { AuthenticatedRequest } from '../../middlewares/authenticatedRequest';
import Receipt from '../models/reciept';

const getReciept = async (req: AuthenticatedRequest, res: Response, next: NextFunction) => {
    try {
        const memberId = req.userId;

        if (!memberId) {
            return res.status(400).send("Non authenticated request");
        }

        const receiptId = req.params.id;
        const receipt = await Receipt.findById(receiptId); 


        if (receipt?.created_by) {
            if (receipt.created_by.toString() !== memberId) {
                return res.status(400).send("Non authenticated reciept call");
            }
        }

        if (!receipt) return res.status(404).send('Receipt not found.');
    
        return res.status(201).send(receipt);
    } catch (e) {
        return res.status(401).send({message:`Error in fetching reciept ${e}` });
    }
};

export default getReciept;
