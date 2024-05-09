import express from "express"
import Book from "../models/Book.js";
import User from "../models/User.js";


const check_router = express.Router()


check_router.post("/api/checkout", async (req, res) => {
  const { userId, bookId } = req.body;
  try {
    const user = await User.findById(userId);
    if (!user) {
      return res.status(404).send({ message: "User not found" });
    }
    const book = await Book.findById(bookId);
    if (!book) {
      return res.status(404).send({ message: "Book not found" });
    }

    // Check available copies of the book
    if (book.copies <= 0) {
      return res
        .status(400)
        .send({ message: " there is No book copies available " });
      }
      
    book.copies--;
    await book.save();

    res.status(200).send({ message: "Book checked out successfully", book });
  } catch (error) {
    console.error(error);
    res.status(500).send({ message: "Internal server error" });
  }
});

export default check_router;