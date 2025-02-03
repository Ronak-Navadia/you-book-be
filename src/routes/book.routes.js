import express from "express";
import Book from "../schemas/book.schema.js";

const router = express.Router();

//add book
router.post("/", (req, res) => {
    return res.json("book added successfully");
});

// get all books other than my which are public
router.get("/", (req, res) => {
    return res.json("book added successfully");
});

//book apis
// post - /books - add a book
// get - /books - get all books other than my
// get - /books/:bookId - get specific book

//library apis
// post - /libraries - add to library - bookId in body
// get - /libraries - get all library book of particular user
// delete - /libraries/:id - remove from library
export default router;
