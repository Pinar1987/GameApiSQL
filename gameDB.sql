CREATE TABLE players (
id SERIAL PRIMARY KEY,
name VARCHAR(100),
join_date DATE
);

CREATE TABLE games (
id SERIAL PRIMARY KEY,
title VARCHAR(100),
genre VARCHAR(50)
);

CREATE TABLE scores (
id SERIAL PRIMARY KEY,
player_id INTEGER,
game_id INTEGER,
score INTEGER,
date_played DATE,
FOREIGN KEY (player_id) REFERENCES players(id),
FOREIGN KEY (game_id) REFERENCES games(id)
);

INSERT INTO players (name,join_date) VALUES
('Pinar', CURRENT_DATE - INTERVAL '10 days'),
('Burak', CURRENT_DATE - INTERVAL '40 days'),
('Melek', CURRENT_DATE - INTERVAL '5 days'),
('Murat', CURRENT_DATE - INTERVAL '100 days');

INSERT INTO games (title, genre) VALUES
('Space Invaders', 'Arcade'),
('Fantasy Quest', 'RPG'),
('Car Frenzy', 'Racing'),
('Zombie Attack', 'Action')

INSERT INTO scores (player_id, game_id, score, date_played) VALUES
(1, 1, 1200, CURRENT_DATE - INTERVAL '1 day'),
(1, 2, 850, CURRENT_DATE - INTERVAL '3 days'),
(2, 1, 1500, CURRENT_DATE - INTERVAL '10 days'),
(2, 3, 900, CURRENT_DATE - INTERVAL '15 days'),
(3, 1, 300, CURRENT_DATE - INTERVAL '2 days'),
(3, 2, 1200, CURRENT_DATE - INTERVAL '1 day'),
(3, 2, 1300, CURRENT_DATE),
(1, 2, 750, CURRENT_DATE - INTERVAL '5 days')

SELECT players.name, games.title, scores.score
FROM scores
INNER JOIN players ON scores.player_id = players.id
INNER JOIN games ON scores.game_id = games.id

SELECT players.name, SUM(scores.score) AS total_score
FROM scores
INNER JOIN players ON scores.player_id = players.id
GROUP BY (players.name)
ORDER BY total_score DESC
LIMIT 3

SELECT players.name 
FROM players
LEFT JOIN scores ON players.id = scores.player_id
WHERE scores.id IS NULL

SELECT games.genre, COUNT(*)
FROM scores
INNER JOIN games ON scores.game_id = games.id
GROUP BY games.genre

SELECT name, join_date
FROM players
WHERE join_date >= CURRENT_DATE - INTERVAL '30 days'

