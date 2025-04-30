import express from 'express';
import {
  addBook,
  getIndividualBook,
  getMyBooks,
  getOthersBooks,
} from '../controllers/book.controller.js';
import upload from '../config/multerConfig.js';

const router = express.Router();

//add book
router.post(
  '/',
  upload.fields([
    { name: 'bookPdf', maxCount: 1 },
    { name: 'bookFrontCover', maxCount: 1 },
    { name: 'bookBackCover', maxCount: 1 },
  ]),
  addBook
);

router.get('/me', getMyBooks);

router.get('/other', getOthersBooks);

router.get('/:bookId', getIndividualBook);

//Tell to kartik
// 1. Add Book
// - we will not include (get a professional to edit and design the book cover and interior)
//Kartik- Is this book made for kids (make No by default selected)
//kartik - Age restriction (No do not restrict my book default selected)
//kartik - publish now (public default selected)
//kartik - schedule ( not include for now - keep disabled)

export default router;
