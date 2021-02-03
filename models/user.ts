import * as mongoose from 'mongoose';

const schema = new mongoose.Schema({
    email: { type: String, required: true, unique: true },
    password: { type: String, required: true },
    name: { type: String },
    webpackConfig: { type: String },
    npmRun: { type: String },
    npmDRun: { type: String }
});

export interface IUser extends mongoose.Document {
    _id: any;
    email: string;
    password: string;
    name: string;
    webpackConfig: string;
    npmRun: string;
    npmDRun: string;
}

export default mongoose.model<IUser>('User', schema);
