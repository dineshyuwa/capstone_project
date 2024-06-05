import { ObjectCannedACL, PutObjectCommand } from "@aws-sdk/client-s3";
import { s3Client } from "../../aws/s3Client";
import { ExtractTextService } from "../../aws/textExtract";
import generateUniqueFilename from "../utils/generateUniqueFileName";
import { Request, Response, NextFunction } from 'express';
import * as fs from "fs";
import * as path from "path";
import { IVendorAddress } from "../models/vendorAddress";
import Reciepts from "../models/reciept";


const extractTextService = new ExtractTextService();
const BUCKET_NAME = process.env.BUCKET_NAME || 'capstone-project-witwizards';
const REGION = process.env.REGION;

interface AuthenticatedRequest extends Request {
    userId?: string;
  }

const uploadImage = async (req: AuthenticatedRequest, res: Response, next: NextFunction) => {
    try {

        if (!req.file) {
            return res.status(400).send("No file uploaded.");
        }

        const customerId = req.userId;
    
        const filePath = path.resolve(req.file.path);
        const originalFilename = req.file.originalname;
        const uniqueFilename = generateUniqueFilename(originalFilename);

        const fileStream = fs.createReadStream(filePath);

        const uploadParams = {
            ACL: ObjectCannedACL.public_read,
            Bucket: BUCKET_NAME,
            Key: uniqueFilename,
            Body: fileStream,
        };

        const command = new PutObjectCommand(uploadParams);

        await s3Client.send(command);

        const url = `https://${BUCKET_NAME}.s3.${REGION}.amazonaws.com/${uniqueFilename}`;

        fs.unlinkSync(filePath);

        try {
            const invoiceData = await extractTextService.getInvoiceContent(
                BUCKET_NAME,
                uniqueFilename
            );

            if (!invoiceData.summary) {
                res.status(401).json({ error: "Not enough data" });
            }

            const address: any = {};
            const summary: any = {}

            for (const key in invoiceData.summary) {
                if (invoiceData.summary.hasOwnProperty(key)) {
                    const item = invoiceData.summary[key];
                    if (key === "ADDRESS" || key === "STREET" || key === "CITY" || key === "STATE" || key === "ZIP_CODE" || key === "ADDRESS_BLOCK" || key === "VENDOR_ADDRESS") {
                        address[key as keyof IVendorAddress] = item.value;
                    } else {
                        summary[key] = item.value
                    }
                }
            }

            if (!invoiceData.summary.NAME || !invoiceData.summary.VENDOR_NAME || !invoiceData.summary.TOTAL) {
                res.status(401).json({ error: "Not enough data" });
            }

            const lineItems = invoiceData.lineItems.map((item: any) => {
                return {
                    ITEM: item.ITEM || null,
                    PRICE: item.PRICE || null,
                    QUANTITY: item.QUANTITY || null,
                    UNIT_PRICE: item.UNIT_PRICE || null,
                    EXPENSE_ROW: item.EXPENSE_ROW || null,
                }
            })


            let reciept = new Reciepts({
                shopName: summary.NAME || null,
                amountPaid: summary.AMOUNT_PAID || null,
                discount: summary.DISCOUNT || null,
                invoice_reciept_date: summary.INVOICE_RECEIPT_DATE || null,
                tax: summary.TAX || null,
                total: summary.TOTAL || null,
                vendor_name: summary.VENDOR_NAME || null,
                vendor_phone:summary.VENDOR_PHONE || null,
                vendor_url: summary.VENDOR_URL || null,
                vendorAddress: address,
                lineItems: lineItems,
                created_by: customerId,
                reciept_object_url:url,
            });

            await reciept.save();

            res.status(200).json({invoiceData});
        } catch (err) {
            console.error('Error extracting details from:', err);
        }
    } catch (err) {
        console.error("Error uploading image", err);
    }
};

export default uploadImage;