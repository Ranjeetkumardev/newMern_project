import mongoose from "mongoose";

// books: With fields id, title, author, isbn, published_at, copies.

const bookSchema = mongoose.Schema({
  title: {
    type: String,
    required: true,
  },
  author: {
    type: String,
    required: true,
    unique: true,
  },
  ISBN: {
    type: String,
    required: true,
  },
  published_at: {
    type: Date,
    required: true,
  },
  copies: {
    type: Number,
    required: true,
  },
});

export default mongoose.model("Book", bookSchema);
