import mongoose, { Document } from 'mongoose';

export interface IAddress extends Document {
    streetAddress: string;
    city: string;
    state: string;
    country: string;
    postalCode: string;
    apartmentNumber?: string;
}

const addressSchema = new mongoose.Schema<IAddress>(
    {
        streetAddress: {
            type: String,
            required: true,
        },
        city: {
            type: String,
            required: true,
        },
        state: {
            type: String,
            required: true,
        },
        postalCode: {
            type: String,
            required: true,
        },
        apartmentNumber: {
            type: String,
        },
        country: {
            type: String,
            required: true,
        },
    },
    { timestamps: true }
);

const Address = mongoose.model<IAddress>('Address', addressSchema);

export default Address;
