import 'dotenv/config';
import express from 'express';
import connectDB from './config/db.js';

//connect database
connectDB()

// initialize app using express
const app = express();

// Middleware to parse JSON
app.use(express.json());

const PORT = process.env.BACKEND_PORT || 5000;

app.listen(PORT, () => {
    console.log(`You Book backend server magic happens at http://localhost:${PORT}`);
});
