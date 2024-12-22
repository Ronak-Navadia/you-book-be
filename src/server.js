import app from './app.js';
import 'dotenv/config';

const PORT = process.env.BACKEND_PORT || 5000;

app.listen(PORT, () => {
    console.log(`You Book backend server magic happens at http://localhost:${PORT}`);
});
