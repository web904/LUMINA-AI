
# Connecting Lumina to a Real MySQL Backend

To transition from this simulation to a live production database:

## 1. Setup MySQL Server
Install MySQL and run the provided `schema.sql` script to create the tables.

## 2. Create a Node.js Backend
Initialize a new Express project:
```bash
npm init -y
npm install express mysql2 cors dotenv
```

## 3. Basic Server Implementation (`server.js`)
```javascript
const express = require('express');
const mysql = require('mysql2');
const cors = require('cors');
require('dotenv').config();

const app = express();
app.use(cors());
app.use(express.json());

const db = mysql.createPool({
  host: process.env.DB_HOST,
  user: process.env.DB_USER,
  password: process.env.DB_PASSWORD,
  database: 'lumina_blog'
});

app.get('/posts', (req, res) => {
  db.query('SELECT * FROM posts ORDER BY created_at DESC', (err, results) => {
    if (err) return res.status(500).json(err);
    res.json(results);
  });
});

app.listen(3000, () => console.log('Backend running on port 3000'));
```

## 4. Update Frontend
In `services/apiService.ts`, change `API_BASE_URL` to `http://localhost:3000`.
