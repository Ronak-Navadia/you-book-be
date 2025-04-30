import mongoose from 'mongoose';
import BookModel from '../models/book.model.js';
import UserLibraryModel from '../models/userLibrary.model.js';

export const addToLibrary = async (req, res) => {
  try {
    const book = await BookModel.findById(req.params.bookId);

    if (!book) {
      return res.status(404).json({ code: 0, message: 'book not found' });
    }

    const userLibrary = await UserLibraryModel.findOne({
      addedBy: req.user.id,
      bookId: req.params.bookId,
    });

    if (userLibrary) {
      return res.status(400).json({ code: 0, message: 'Book already exist in library' });
    }

    console.log('ronak');
    console.log({ addedBy: req.user.id });
    console.log({ bookId: req.params.bookId });

    await UserLibraryModel.create({
      addedBy: req.user.id,
      bookId: req.params.bookId,
    });

    return res.status(200).json({ code: 1, message: 'added to library successfully' });
  } catch (error) {
    console.error(error);
    res.status(500).json({ code: 0, message: error.message });
  }
};

export const getLibrary = async (req, res) => {
  console.log(req.user.id);
  try {
    let userLibrary = await UserLibraryModel.aggregate([
      { $match: { addedBy: new mongoose.Types.ObjectId(req.user.id) } },
      {
        $lookup: {
          from: 'users',
          localField: 'addedBy',
          foreignField: '_id',
          as: 'addedBy',
        },
      },
      {
        $unwind: '$addedBy',
      },
      {
        $lookup: {
          from: 'books',
          localField: 'bookId',
          foreignField: '_id',
          as: 'bookDetails',
        },
      },
      {
        $unwind: '$bookDetails',
      },
      {
        $lookup: {
          from: 'users',
          localField: 'bookDetails.ownerId',
          foreignField: '_id',
          as: 'ownerDetails',
        },
      },
      {
        $unwind: {
          path: '$ownerDetails',
          preserveNullAndEmptyArrays: true,
        },
      },
      {
        $addFields: {
          'bookDetails.ownerDetails': '$ownerDetails',
        },
      },
      {
        $project: {
          'addedBy.__v': 0,
          bookId: 0,
          'bookDetails.__v': 0,
          ownerDetails: 0,
          'bookDetails.ownerDetails.__v': 0,
          'bookDetails.ownerId': 0,
          __v: 0,
        },
      },
    ]);

    return res.status(200).json({
      code: 1,
      message: 'get library successfully',
      data: userLibrary,
    });
  } catch (error) {
    console.error(error);
    res.status(500).json({ code: 0, message: error.message });
  }
};

export const removeFromLibrary = async (req, res) => {
  try {
    const book = await BookModel.findById(req.params.bookId);

    if (!book) {
      return res.status(404).json({ code: 0, message: 'book not found' });
    }

    await UserLibraryModel.deleteOne({
      addedBy: req.user.id,
      bookId: req.params.bookId,
    });

    return res.status(200).json({
      code: 1,
      message: 'remove from library successfully',
    });
  } catch (error) {
    console.error(error);
    res.status(500).json({ code: 0, message: error.message });
  }
};
