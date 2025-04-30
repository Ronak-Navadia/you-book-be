import BookModel from '../models/book.model.js';
import BookLikeModel from '../models/bookLike.model.js';

export const addBookLike = async (req, res) => {
  try {
    const bookLikeExist = await BookLikeModel.findOne({
      likedBy: req.user.id,
      bookId: req.params.bookId,
    });

    if (bookLikeExist) {
      await BookLikeModel.deleteOne({
        likedBy: req.user.id,
        bookId: req.params.bookId,
      });
      return res.status(200).json({ code: 1, message: 'Book unliked successfully' });
    }

    const book = await BookModel.findById(req.params.bookId);

    if (!book) {
      return res.status(404).json({ code: 0, message: 'book not found' });
    }

    await BookLikeModel.create({
      likedBy: req.user.id,
      bookId: req.params.bookId,
    });

    return res.status(200).json({ code: 1, message: 'Book Liked successfully' });
  } catch (error) {
    console.error(error);
    res.status(500).json({ code: 0, message: error.message });
  }
};
