const express = require('express');
const router = express.Router();
const books = require('./booksdb');  // Import the books object

// Endpoint to serve all books
router.get('/books', (req, res) => {
  res.json(books);
});

// Endpoint to serve a book by ISBN
router.get('/books/:isbn', (req, res) => {
  const isbn = req.params.isbn;
  const book = books[isbn];
  if (book) {
    res.json(book);
  } else {
    res.status(404).json({ message: "Book not found" });
  }
});

module.exports = router;