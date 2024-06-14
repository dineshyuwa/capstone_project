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
      ADDRESS,
      STREET,
      CITY,
      STATE,
      ZIP_CODE,
      ADDRESS_BLOCK,
      VENDOR_ADDRESS,
      reciept_object_url,
    } = req.body;

    const userId = req.userId; 

    const receiptData = {
      shopName,
      amountPaid,
      discount,
      invoice_reciept_date: new Date(invoice_reciept_date),
      tax,
      total,
      vendor_name,
      vendor_phone,
      vendor_url,
      lineItems,
      vendorAddress: {
        ADDRESS,
        STREET,
        CITY,
        STATE,
        ZIP_CODE,
        ADDRESS_BLOCK,
        VENDOR_ADDRESS,
      },
      created_by: userId,
      reciept_object_url,
    };

    if (!receiptData.total || !receiptData.shopName || !receiptData.created_by || !receiptData.reciept_object_url) {
      return res.status(201).json({ message: 'Please fill the required fields' });
    }

    const receiptSummary = new Receipt(receiptData);

    await receiptSummary.save();

    return res.status(201).json({ message: 'Receipt summary saved successfully', receiptSummary });
  } catch (error) {
    next(error);
  }
};

export default saveRecieptSummary;
