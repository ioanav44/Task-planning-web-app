/*
 * Entry point pentru server
 * Configureaza Express si porneste serverul
 */

const express = require('express');
const cors = require('cors');
require('dotenv').config();  // incarca variabilele din .env

// importam rutele
const authRoutes = require('./routes/auth');
const userRoutes = require('./routes/users');
const taskRoutes = require('./routes/tasks');

const app = express();

// middleware-uri
app.use(cors());           // permite request-uri din frontend (alt port)
app.use(express.json());   // parseaza body-ul JSON

// montam rutele pe prefixuri
app.use('/api/auth', authRoutes);
app.use('/api/users', userRoutes);
app.use('/api/tasks', taskRoutes);

// endpoint pt verificare ca serverul merge
app.get('/api/health', (req, res) => {
  res.json({ status: 'OK', message: 'Server is running' });
});

// pornim serverul pe portul din .env sau 3000 default
const PORT = process.env.PORT || 3000;
app.listen(PORT, () => {
  console.log(`🚀 Server running on http://localhost:${PORT}`);
});
