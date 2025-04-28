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


app.get('/players-scores', async (req, res) => {
  try {
    const result = await pool.query(`
      SELECT players.name AS player_name, games.title AS game_title, scores.score
      FROM players
      JOIN scores ON players.id = scores.player_id
      JOIN games ON games.id = scores.game_id
    `);
    res.json(result.rows);
  } catch (err) {
    console.error(err.message);
    res.status(500).send('Server error');
  }
});

app.get('/top-players', async (req, res) => {
  try {
    const result = await pool.query(`
      SELECT players.name AS player_name, SUM(scores.score) AS total_score
      FROM players
      JOIN scores ON players.id = scores.player_id
      GROUP BY players.name
      ORDER BY total_score DESC
      LIMIT 3
    `);
    res.json(result.rows);
  } catch (err) {
    console.error(err.message);
    res.status(500).send('Server error');
  }
});

const PORT = 3000;
// Start server
app.listen(PORT, () => {
  console.log(`Server running on port ${PORT}`);
});

