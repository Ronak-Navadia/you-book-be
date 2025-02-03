import mongoose from "mongoose";

const bookSchema = new mongoose.Schema(
    {
        ownerId: {
            type: mongoose.Schema.Types.ObjectId,
            required: true,
            ref: "User",
        },
        bookPdfPath: {
            type: String,
            required: true,
        },
        bookFrontCoverPath: {
            type: String,
            required: true,
        },
        bookBackCoverPath: {
            type: String,
            required: true,
        },
        title: {
            type: String,
            required: true,
            trim: true,
        },
        description: {
            type: String,
            required: true,
        },
        isCommentVisible: {
            type: Boolean,
            required: true,
            default: true,
        },
        isForKids: {
            type: Boolean,
            required: true,
            default: false,
        },
        isRestricted: {
            type: Boolean,
            required: true,
            default: false,
        },
        publishAs: {
            type: String,
            enum: ["public", "private"],
            default: "public",
            required: true,
        },
        scheduleToPublishOn: {
            type: Date,
            default: null,
        },
    },
    {
        timestamps: true,
    }
);

// Export the model
const Book = mongoose.model("Book", bookSchema);

export default Book;
