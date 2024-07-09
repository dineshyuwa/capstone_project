import { Response, NextFunction } from 'express';
import { AuthenticatedRequest } from '../../middlewares/authenticatedRequest';
import Receipt from '../models/reciept';
import { categories } from '../constants/constant';
import isValidDate from '../utils/isValidDate';

const saveRecieptSummary = async (req: AuthenticatedRequest, res: Response, next: NextFunction) => {
  try {
    const {
      shopName,
      category,
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

    if (!Object.values(categories).includes(category)) {
      return res.status(400).json({ message: 'Invalid category provided' });
    }


    let formattedDate;
try {
  const [day, month, year] = invoice_reciept_date.split('/');

  const dateFormatRegex = /^\d{2}\/\d{2}\/\d{4}$/;
  if (!dateFormatRegex.test(invoice_reciept_date)) {
    throw new Error('Invalid date format');
  }

  if (!isValidDate(day, month, year)) {
    throw new Error('Invalid date values');
  }

  formattedDate = `${day}/${month}/${year}`;
} catch (error) {
  return res.status(400).json({ message: 'Invalid invoice_reciept_date format. Please provide a valid date in DD/MM/YYYY format.' });
}
    const receiptData = {
      shopName,
      category,
      amountPaid,
      discount,
      invoice_reciept_date: formattedDate,
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

    if (!receiptData.total || !receiptData.shopName || !receiptData.category || !receiptData.created_by || !receiptData.reciept_object_url) {
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
