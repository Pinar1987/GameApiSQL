import express from 'express';
import dotenv from 'dotenv';
import { Pool } from 'pg';

dotenv.config();


const app = express();

const pool = new Pool({
  user: process.env.DB_USER,
  host: process.env.DB_HOST,
  database: process.env.DB_DATABASE,
  password: process.env.DB_PASSWORD,
  port: process.env.DB_PORT,
});


app.use(express.json());
app.get('/', (req, res) => {
  res.send('Game Dashboard API is running!');
});


const PORT = 3000;
// Start server
app.listen(PORT, () => {
  console.log(`Server running on port ${PORT}`);
});

