import express from "express";
import cookieParser from "cookie-parser";
import cors from "cors";

const app = express();

// Middleware
const corsOptions = {
  origin: "http://localhost:5173", // Allow only frontend URL
  credentials: true, // Allow credentials (cookies)
};

app.use(cors(corsOptions));
app.use(express.json());
app.use(cookieParser());
app.use(express.urlencoded({ extended: true }));

// -------------------------------- Routes ---------------------------------

// Routes import
import userRoutes from "./routes/user.routes.js";

// Routes declaration
app.use("/api/v1/user", userRoutes);

export default app;

// export default :- we can give custom name in export default

// export :- we can give custom name unless you use 'as'
