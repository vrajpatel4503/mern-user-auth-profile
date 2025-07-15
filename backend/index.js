import app from "./app.js";
import dotenv from "dotenv";
import { dbConnection } from "./db/dbConnect.js";

// configure dotenv
dotenv.config();

// database function
dbConnection();

const port = process.env.PORT || 8000;
app.listen(port, () => {
  console.log(`Server is running on ${port}`);
});
