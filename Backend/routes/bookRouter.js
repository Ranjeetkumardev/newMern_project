import express from "express";
import Book from "../models/Book.js";

const book_router = express.Router();

// retriving the all books
book_router.get("/api/book", async (req, res) => {
  try {
    const books = await Book.find();
    res.status(200).send(books);
  } catch (error) {
    console.error(error);
    res.status(500).send({ message: "Internal server error" });
  }
});

// creating the book
book_router.post("/api/book", async (req, res) => {
  const { title, author, ISBN, published_at, copies } = req.body;
  try {
    const newBook = new Book({
      title,
      author,
      ISBN,
      published_at,
      copies,
    });
    await newBook.save();
    res.status(201).send({ message: "Book added successfully", book: newBook });
  } catch (error) {
    console.error(error);
    res.status(500).send({ message: "Internal server error" });
  }
});

//  updating the book
book_router.put("/api/books/:id", async (req, res) => {
  const { title, author, ISBN, published_at, copies } = req.body;
  const bookId = req.params.id;
  try {
    const updatedBook = await Book.findByIdAndUpdate(
      bookId,
      { title, author, ISBN, published_at, copies },
      { new: true }
    );
    if (!updatedBook) {
      return res.status(404).send({ message: "Book not found" });
    }
    res
      .status(200)
      .send({ message: "Book updated successfully", book: updatedBook });
  } catch (error) {
    console.error(error);
    res.status(500).send({ message: "Internal server error" });
  }
});

// deleting the book
book_router.delete("/api/books/:id", async (req, res) => {
  const bookId = req.params.id;
  try {
    const deletedBook = await Book.findByIdAndDelete(bookId);
    if (!deletedBook) {
      return res.status(404).send({ message: "Book not found" });
    }
    res
      .status(200)
      .send({ message: "Book deleted successfully", book: deletedBook });
  } catch (error) {
    console.error(error);
    res.status(500).send({ message: "Internal server error" });
  }
});

export default book_router;
