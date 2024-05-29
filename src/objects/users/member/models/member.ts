import mongoose, { Document } from 'mongoose';
import Address,{ IAddress } from '../../../address/models/address';

export interface IMember extends Document {
  firstname: string;
  lastname: string;
  job: string;
  address:IAddress;
  login_id?:string;
  email: string;
  hashed_password: string;
  user_role: 'customer';
}

const memeberSchema = new mongoose.Schema<IMember>(
  {
    firstname: {
      type: String,
      required: true,
    },
    lastname: {
      type: String,
      required: true,
    },
    job: {
      type: String,
      required: true,
    },
    address: {
      type: Object,
      ref: 'Address',
      required: true,
    },
    email: {
      type: String,
      required: true,
      unique: true,
    },
    hashed_password: {
      type: String,
      required: true,
    },
    user_role: {
      type: String,
      default:'customer',
      required: true,
    }, 
  },
  { timestamps: true }
);

memeberSchema.virtual('creator', {
  ref: 'Address', 
  localField: 'address',
  foreignField: '_id',
  justOne: true,
});

const Members = mongoose.model<IMember>('Member', memeberSchema);

export default Members;
