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
      SELECT players.name, games.title, scores.score
      FROM scores
      INNER JOIN players ON scores.player_id = players.id
      INNER JOIN games ON scores.game_id = games.id
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
      SELECT players.name, SUM(scores.score) AS total_score
      FROM scores
      INNER JOIN players ON scores.player_id = players.id
      GROUP BY (players.name)
      ORDER BY total_score DESC
      LIMIT 3
    `);
    res.json(result.rows);
  } catch (err) {
    console.error(err.message);
    res.status(500).send('Server error');
  }
});

app.get('/inactive-players', async (req, res) => {
  try {
    const result = await pool.query(`
      SELECT players.name 
      FROM players
      LEFT JOIN scores ON players.id = scores.player_id
      WHERE scores.id IS NULL
    `);
    res.json(result.rows);
  } catch (err) {
    console.error(err.message);
    res.status(500).send('Server error');
  }
});

app.get('/popular-genres', async (req, res) => {
  try {
    const result = await pool.query(`
      SELECT games.genre, COUNT(*)
      FROM scores
      INNER JOIN games ON scores.game_id = games.id
      GROUP BY games.genre
    `);
    res.json(result.rows);
  } catch (err) {
    console.error(err.message);
    res.status(500).send('Server error');
  }
});

app.get('/recent-players', async (req, res) => {
  try {
    const result = await pool.query(`
      SELECT name, join_date
      FROM players
      WHERE join_date >= CURRENT_DATE - INTERVAL '30 days'
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

