import mongoose, { Document } from 'mongoose';

export interface IVendorAddress extends Document {
    ADDRESS?: string;
    STREET?: string;
    CITY?: string;
    STATE?: string;
    ZIP_CODE?: string;
    ADDRESS_BLOCK?: string;
    VENDOR_ADDRESS?: string;
}

const vendorAddressSchema = new mongoose.Schema<IVendorAddress>(
    {
        ADDRESS: {
            type: String,
        },
        STREET: {
            type: String,
        },
        CITY: {
            type: String,
        },
        STATE: {
            type: String,
        },
        ZIP_CODE: {
            type: String,
        },
        ADDRESS_BLOCK: {
            type: String,
        },
        VENDOR_ADDRESS: {
            type: String,
        },
    },
    { timestamps: true }
);

const VendorAddress = mongoose.model<IVendorAddress>('VendorAddress', vendorAddressSchema);

export type VendorAddressPlain = Omit<IVendorAddress, keyof Document>;

export default VendorAddress;
export { vendorAddressSchema };
