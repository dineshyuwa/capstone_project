import { Response, NextFunction } from 'express';
import { AuthenticatedRequest } from '../../middlewares/authenticatedRequest';
import Receipt from '../models/reciept';

const deleteRecieptSummary = async (req: AuthenticatedRequest, res: Response, next: NextFunction) => {
    const {
        _id,
      } = req.body;
      
    try {
        const deletedReceipt = await Receipt.findByIdAndDelete(_id);
        
        if (!deletedReceipt) {
            return res.status(404).json({ message: 'Receipt not found' });
        }
        return res.status(200).json({ message: 'Receipt deleted successfully' });
    } catch (error:any) {
        return res.status(400).json({ message: error.message || 'An error occurred while deleting the receipt summary' });
    }
};

export default deleteRecieptSummary;
