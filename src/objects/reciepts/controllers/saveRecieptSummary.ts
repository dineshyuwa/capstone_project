import { Response, NextFunction } from 'express';
import { AuthenticatedRequest } from '../../middlewares/authenticatedRequest';
import Receipt from '../models/reciept';

const saveRecieptSummary = async (req: AuthenticatedRequest, res: Response, next: NextFunction) => {
  try {
    const {
      shopName,
      amountPaid,
      discount,
      invoice_reciept_date,
      tax,
      total,
      vendor_name,
      vendor_phone,
      vendor_url,
      lineItems,
      address,
      reciept_object_url,
    } = req.body;

    const userId = req.userId;

    let parsedDate;
    try {
      const [day, month, year] = invoice_reciept_date.split('/');
      parsedDate = new Date(`${year}-${month}-${day}`);
      if (isNaN(parsedDate.getTime())) {
        throw new Error('Invalid date format');
      }
    } catch (error) {
      return res.status(400).json({ message: 'Invalid invoice_reciept_date format. Please provide a valid date in DD/MM/YYYY format.' });
    }

    const receiptData = {
      shopName,
      amountPaid,
      discount,
      invoice_reciept_date: parsedDate,
      tax,
      total,
      vendor_name,
      vendor_phone,
      vendor_url,
      lineItems,
      vendorAddress:address,
      created_by: userId,
      reciept_object_url,
    };

    if (!receiptData.total || !receiptData.shopName || !receiptData.created_by || !receiptData.reciept_object_url) {
      return res.status(401).json({ message: 'Please fill the required fields' });
    }

    const receiptSummary = new Receipt(receiptData);

    await receiptSummary.save();

    return res.status(200).json({ message: 'Receipt summary saved successfully', receiptSummary });
  } catch (error:any) {
    return res.status(400).json({ message: error.message || 'An error occurred while saving receipt summary' });
  }
};

export default saveRecieptSummary;
