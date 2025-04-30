import express from 'express';
import {
  addToLibrary,
  getLibrary,
  removeFromLibrary,
} from '../controllers/userLibrary.controller.js';

const router = express.Router();

router.post('/:bookId', addToLibrary);
router.get('/', getLibrary);
router.delete('/:bookId', removeFromLibrary);

export default router;
