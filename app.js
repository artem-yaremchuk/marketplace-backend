import express from "express";
import morgan from "morgan";
import cors from "cors";
import mongoose from "mongoose";
import dotenv from "dotenv";

dotenv.config();

const app = express();

mongoose
    .connect(process.env.MONGO_URL)
    .then(() => {
        console.log("Database connection successfull")
    })
    .catch((err) => {
        console.log(err);
        process.exit(1);
    })

app.use(morgan("tiny"));
app.use(cors());
app.use(express.json());

app.use(express.static("public"));

app.set('view engine', 'pug');
app.set('views', 'views');

app.use((_, res) => {
    res.status(404).json({ message: "Route not found" });
});

app.use((err, req, res, next) => {
    res.status(err.status ?? 500).json({
        message: err.message ?? "Internal server error",
    });
});

const port = process.env.PORT;

app.listen(port, () => {
    console.log(`Server is running. Use our API on port: ${port}`);
});

export default app;