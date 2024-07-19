import mongoose, { Schema, Document } from "mongoose";
import bcrypt from 'bcryptjs';

export interface IUser extends Document {
    username: string,
    email: string,
    password: string,
    isAdmin: boolean,
    createdAt?: string,
    updatedAt?: string,
}

const UserSchema: Schema<IUser> = new Schema({
    username: {
        type: String,
        required: [true, 'Username is required'],
        trim: true,
        unique: true
    },
    email: {
        type: String,
        required: [true, 'Email is required'],
        unique: true,
        match: [/.+\@.+\..+/, 'Please fill a valid email address']
    },
    password: {
        type: String,
        required: [true, 'Password is required']
    },
    isAdmin: {
        type: Boolean,
        default: false
    },
}, { timestamps: true });

UserSchema.pre('save', async function (next) {
    if (this.isModified('password')) {
        const salt = await bcrypt.genSalt(10)
        this.password = await bcrypt.hash(this.password, salt);
    }
})

const UserModel: mongoose.Model<IUser> = mongoose.models.User || mongoose.model('User', UserSchema);

export default UserModel;
