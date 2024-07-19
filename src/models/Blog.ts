import mongoose, { Document, Schema } from "mongoose";
import "./User";
import "./Comment";


interface IBlog extends Document {
    title: string,
    content: string,
    description: string,
    image?: string,
    slug: string,
    likedBy: string[],
    keywords: string[],
    comments: object[],
    createdAt?: string,
    updatedAt?: string,
}

const BlogSchema: Schema<IBlog> = new Schema({
    title: {
        type: String,
        required: [true, 'Title is required'],
        trim: true
    },
    content: {
        type: String,
        required: [true, 'Content is required'],
    },
    description: {
        type: String,
        required: false,
    },
    image: {
        type: String,
    },
    slug: {
        type: String,
        required: [true, 'Slug is required'],
        unique: true,
        trim: true
    },
    likedBy: [
        {
            type: mongoose.Schema.Types.ObjectId,
            ref: 'User',
        }
    ],
    keywords: [
        {
            type: String,
        },
    ],
    comments: [
        {
            type: mongoose.Schema.Types.ObjectId,
            ref: 'Comment',
        },
    ]
}, { timestamps: true });

const BlogModel: mongoose.Model<IBlog> = mongoose.models.Blog || mongoose.model('Blog', BlogSchema);

export default BlogModel;
