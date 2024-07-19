import mongoose, { Document, Schema } from "mongoose";
import "./User";


interface IComment extends Document {
    content: string,
    user: mongoose.Types.ObjectId,
    createdAt?: string,
    updatedAt?: string,
}

const CommentSchema: Schema<IComment> = new Schema(
    {
        content: {
            type: String,
            required: [true, 'Content is required'],
        },
        user: {
            type: mongoose.Schema.Types.ObjectId,
            ref: 'User',
        },
    }, { timestamps: true })

const CommentModel: mongoose.Model<IComment> = mongoose.models.Comment || mongoose.model('Comment', CommentSchema);

export default CommentModel;