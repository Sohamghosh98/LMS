import express from 'express';
import Book from '../models/Books.js';
import authenticateToken from '../middleware/authToken.js';

const router = express.Router();


// Get all books
router.get('/', async (req, res) => {
  try {
    const books = await Book.find();
    res.json(books);
  } catch (error) {
    res.status(500).json({ message: error.message });
  }
});

// Get borrowed books by user
router.get('/borrowed/:userId', authenticateToken, async (req, res) => {
  try {
    const books = await Book.find({ borrowedBy: req.params.userId });
    res.json(books);
  } catch (error) {
    res.status(500).json({ message: error.message });
  }
});

// Borrow a book
router.post('/borrow', authenticateToken, async (req, res) => {
  try {
    const { bookId, userId } = req.body;
    const book = await Book.findById(bookId);

    if (!book) {
      return res.status(404).json({ message: 'Book not found' });
    }

    if (book.quantity <= 0) {
      return res.status(400).json({ message: 'Book not available' });
    }

    book.quantity -= 1;
    book.borrowedBy = userId;
    book.borrowedDate = new Date();
    book.returnDate = new Date(new Date().setDate(new Date().getDate() + 14)); // 2 weeks from now

    await book.save();
    res.status(200).json({ message: 'Book borrowed successfully', book });
  } catch (error) {
    res.status(500).json({ message: error.message });
  }
});

// Return a book
router.post('/return', authenticateToken, async (req, res) => {
  try {
    const { bookId } = req.body;
    const book = await Book.findById(bookId);

    if (!book) {
      return res.status(404).json({ message: 'Book not found' });
    }

    book.quantity += 1;
    book.borrowedBy = null;
    book.borrowedDate = null;
    book.returnDate = null;

    await book.save();
    res.status(200).json({ message: 'Book returned successfully', book });
  } catch (error) {
    res.status(500).json({ message: error.message });
  }
});

export default router;