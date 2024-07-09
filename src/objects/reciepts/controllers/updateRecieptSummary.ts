import { Response, NextFunction } from 'express';
import { AuthenticatedRequest } from '../../middlewares/authenticatedRequest';
import Receipt from '../models/reciept';
import formatDateToDDMMYYYY from '../utils/formatDateToDDMMYYYY';
import isValidDate from '../utils/isValidDate';

const updateRecieptSummary = async (req: AuthenticatedRequest, res: Response, next: NextFunction) => {
  try {
    const {
      _id,
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
      vendorAddress,
      reciept_object_url,
    } = req.body;
    
    const receipt = await Receipt.findById(_id); 

    if (!receipt) {
      return res.status(404).json({ message: 'Receipt not found' });
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

    receipt.shopName = shopName;
    receipt.category = category;
    receipt.amountPaid = amountPaid;
    receipt.discount = discount;
    receipt.invoice_reciept_date = formattedDate;
    receipt.tax = tax;
    receipt.total = total;
    receipt.vendor_name = vendor_name;
    receipt.vendor_phone = vendor_phone;
    receipt.vendor_url = vendor_url;
    receipt.lineItems = lineItems;
    receipt.vendorAddress = vendorAddress;
    receipt.reciept_object_url = reciept_object_url;
    const updatedReceipt = await receipt.save();
    return res.status(200).json({ message: 'Receipt summary updated successfully', receipt: updatedReceipt });
  } catch (error:any) {
    return res.status(400).json({ message: error.message || 'An error occurred while updating receipt summary' });
  }
};

export default updateRecieptSummary;
