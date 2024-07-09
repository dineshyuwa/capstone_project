import mongoose, { Document, Schema, Types } from 'mongoose';
import {ILineItem} from './lineItem';
import { IVendorAddress } from './vendorAddress';
import { categories } from '../constants/constant';

export interface IReciept extends Document {
    shopName: string;
    category: string;
    amountPaid?: string;
    discount?: string;
    invoice_reciept_date?: string;
    tax?: string;
    total: string;
    vendor_name?: string;
    vendor_phone?: string;
    vendor_url?: string;
    lineItems: Array<ILineItem>;
    vendorAddress?: IVendorAddress;
    created_by: Types.ObjectId;
    reciept_object_url: string;
}

const recieptSchema = new mongoose.Schema<IReciept>(
    {
        shopName: {
            type: String,
            required:true,
        },
        category: {
            type: String,
            enum: categories,
            required: true,
        },
        amountPaid: {
            type: String,
        },
        discount: {
            type: String,
        },
        invoice_reciept_date: {
            type: String,
        },
        tax: {
            type: String,
        },
        total: {
            type: String,
            required: true,
        },
        vendor_name: {
            type: String,
        },
        vendor_phone: {
            type: String,
        },
        vendor_url: {
            type: String,
        },
        lineItems: {
            type: [Object],
            required: true,
        },
        vendorAddress: {
            type: Object,
        },
        created_by: {
            type: Schema.Types.ObjectId,
            required: true,
            ref: 'Member'
        },
        reciept_object_url: {
            type: String,
            required: true,
        }
    },
    { timestamps: true }
);

const Reciepts = mongoose.model<IReciept>('Reciept', recieptSchema);

export default Reciepts;
