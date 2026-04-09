const express = require('express');
const cors = require('cors');
require('dotenv').config();

// Initialize DB (creates tables on startup)
require('./db');

const app = express();
const port = process.env.PORT || 5000;

app.use(cors());
app.use(express.json());

// Routes
const authRoutes = require('./routes/auth');
const studentRoutes = require('./routes/students');
const companyRoutes = require('./routes/companies');
const opportunityRoutes = require('./routes/opportunities');
const aiRoutes = require('./routes/ai');
const matchingRoutes = require('./routes/matching');

app.use('/api/auth', authRoutes);
app.use('/api/students', studentRoutes);
app.use('/api/companies', companyRoutes);
app.use('/api/opportunities', opportunityRoutes);
app.use('/api/ai', aiRoutes);
app.use('/api/matching', matchingRoutes);

app.get('/', (req, res) => {
  res.json({ message: 'Education-to-Industry Bridge API', status: 'running' });
});

app.listen(port, () => {
  console.log(`🚀 Server running on http://localhost:${port}`);
});
