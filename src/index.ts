import dotenv from 'dotenv';
import express from 'express';
import cors from 'cors';
import routes from './api/routes';

// Load environment variables
dotenv.config();

const app = express();
const port = process.env.PORT || 3000;

// Middleware
app.use(cors());
app.use(express.json());

// Routes
app.use('/api', routes);

// Health check endpoint
app.get('/health', (req: express.Request, res: express.Response) => {
  res.json({ status: 'healthy' });
});

// Start server
app.listen(port, () => {
  console.log(`Server running at http://localhost:${port}`);
});

export { app };
