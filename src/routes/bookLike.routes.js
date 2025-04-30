import express from 'express';
import { addBookLike } from '../controllers/bookLike.controller.js';

const router = express.Router();

router.post('/:bookId', addBookLike);

export default router;
