import express from 'express';

// initialize app using express
const app = express();

// Middleware to parse JSON
app.use(express.json());

// Export the app
export default app;
