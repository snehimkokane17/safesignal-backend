const express = require('express');
const cors = require('cors');
const { createClient } = require('@supabase/supabase-js');
require('dotenv').config();

const app = express();
app.use(cors({
  origin: ['https://safesignal-seven.vercel.app', 'https://jovial-tartufo-035314.netlify.app']
}));
app.use(express.json());
app.use('/api/auth', require('./routes/auth'));
app.use('/api/contacts',require('./routes/contacts'));
app.use('/api/incidents', require('./routes/incidents'));
app.use('/api/reports', require('./routes/incidents'));
app.use('/api/sos', require('./routes/sos'));
app.use('/api/nearby', require('./routes/nearby'));
app.use('/api/chat', require('./routes/chat'));

const supabase = createClient(
  process.env.SUPABASE_URL,
  process.env.SUPABASE_SERVICE_KEY
);

app.get('/', (req, res) => {
  res.json({ message: 'SafeSignal backend is running!' });
});

const PORT = process.env.PORT || 5000;
app.listen(PORT, () => console.log(`Server running on port ${PORT}`));