import mongoose from 'mongoose';

const userLibrarySchema = new mongoose.Schema(
  {
    addedBy: {
      type: mongoose.Schema.Types.ObjectId,
      ref: 'User',
      required: true,
      index: true,
    },
    bookId: {
      type: mongoose.Schema.Types.ObjectId,
      ref: 'Book',
      required: true,
      index: true,
    },
  },
  {
    timestamps: {
      createdAt: true,
      updatedAt: false,
    },
  }
);

userLibrarySchema.set('toJSON', {
  transform: (doc, ret) => {
    ret.id = ret._id;
    delete ret.__v;
    delete ret._id;
    return ret;
  },
});

userLibrarySchema.set('toObject', {
  transform: (doc, ret) => {
    ret.id = ret._id;
    delete ret.__v;
    delete ret._id;
    return ret;
  },
});

// Prevent duplicate book saves for the same user
userLibrarySchema.index({ addedBy: 1, bookId: 1 }, { unique: true });

const UserLibraryModel = mongoose.model('UserLibrary', userLibrarySchema);

export default UserLibraryModel;
