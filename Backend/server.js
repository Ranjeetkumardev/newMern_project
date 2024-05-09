import express from "express";
import mongoose from "mongoose";
import cors from "cors";
import router from "./routes/userRouter.js";
import book_router from "./routes/bookRouter.js";
import check_router from "./routes/checkOutRuter.js";

const app = express();

app.use(express.json());

app.use(cors());

const port = process.env.PORT || 4000;

mongoose
  .connect("mongodb://localhost:27017/Machine_DB")
  .then(() => {
    app.listen(
      port,
      console.log(`"Database is connected and Listening at" ${port}`)
    );
  })
  .catch((err) => {
    console.log(err);
  });

app.use(router);
app.use(book_router);
app.use(check_router);
