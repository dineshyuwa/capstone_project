import { ObjectCannedACL, PutObjectCommand } from "@aws-sdk/client-s3";
import { s3Client } from "../../aws/s3Client";
import { ExtractTextService } from "../../aws/textExtract";
import generateUniqueFilename from "../utils/generateUniqueFileName";
import { Request, Response, NextFunction } from 'express';
import * as fs from "fs";
import * as path from "path";
import { IVendorAddress } from "../models/vendorAddress";
import { summary_keys } from "../constants/constant";


const extractTextService = new ExtractTextService();
const BUCKET_NAME = process.env.BUCKET_NAME || 'capstone-project-witwizards';
const REGION = process.env.REGION;

const uploadImage = async (req: Request, res: Response, next: NextFunction) => {
    try {

        if (!req.file) {
            return res.status(400).send("No file uploaded.");
        }
    
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
                    } else if (summary_keys.includes(key)) {
                        summary[key] = item.value;
                    }
                }
            }

            const lineItems = invoiceData.lineItems.map((item: any) => {
                return {
                    ITEM: item.ITEM || null,
                    PRICE: item.PRICE || null,
                    QUANTITY: item.QUANTITY || null,
                    UNIT_PRICE: item.UNIT_PRICE || null,
                    EXPENSE_ROW: item.EXPENSE_ROW || null,
                }
            });

            res.status(200).json({...summary,url,address,lineItems});
        } catch (err) {
            console.error('Error extracting details from:', err);
        }
    } catch (err) {
        console.error("Error uploading image", err);
    }
};

export default uploadImage;