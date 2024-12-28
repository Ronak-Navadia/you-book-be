import express from 'express';
import 'dotenv/config';
import swaggerUi from 'swagger-ui-express';

import connectDB from './config/db.js';
import userRoutes from './routes/userRoutes.js';
import swaggerSpecs from './config/swaggerConfig.js';

// Connect database
connectDB()

// Initialize app using express
const app = express();

// Middleware to parse JSON
app.use(express.json());

// Swagger UI setup
app.use('/api-docs', swaggerUi.serve, swaggerUi.setup(swaggerSpecs));

// User routes
app.use('/api/users', userRoutes);

// Misc routes
app.get('/', (req, res) => {
    res.status(200).json({ message: "API is working!" });
});

const PORT = process.env.BACKEND_PORT || 5000;

app.listen(PORT, () => {
    console.log(`You Book backend server magic happens at ${process.env.BACKEND_URL}`);
});
