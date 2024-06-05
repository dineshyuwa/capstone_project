import mongoose, { Document } from 'mongoose';

export interface ILineItem extends Document {
    ITEM: string;
    PRICE: string;
    QUANTITY: string;
    UNIT_PRICE: string;
    EXPENSE_ROW: string;
}

const LineItemSchema = new mongoose.Schema<ILineItem>(
    {
        ITEM: {
            type: String,
        },
        PRICE: {
            type: String,
        },
        QUANTITY: {
            type: String,
        },
        UNIT_PRICE: {
            type: String,
        },
        EXPENSE_ROW: {
            type: String,
        },
    },
    { timestamps: true }
);

const LineItems = mongoose.model<ILineItem>('LineItem', LineItemSchema);

export default LineItems;

export { LineItemSchema };