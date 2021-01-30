import * as mongoose from 'mongoose';

const schema = new mongoose.Schema({
    email: { type: String, required: true, unique: true },
    password: { type: String, required: true },
    name: { type: String }
});

export interface IUser extends mongoose.Document {
    _id: any;
    email: string;
    password: string;
    name: string;
}

export default mongoose.model<IUser>('User', schema);
