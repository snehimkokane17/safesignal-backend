const express = require('express');
const { createClient } = require('@supabase/supabase-js');
require('dotenv').config();

const router = express.Router();
const supabase = createClient(
  process.env.SUPABASE_URL,
  process.env.SUPABASE_SERVICE_KEY
);

// SUBMIT a new incident
router.post('/', async (req, res) => {
  const { user_id, type, title, description, severity, lat, lng } = req.body;
  const { data, error } = await supabase
    .from('incidents')
    .insert([{ user_id, type, title, description, severity, lat, lng }])
    .select();
  if (error) return res.status(400).json({ error: error.message });
  res.json(data[0]);
});

// GET all recent incidents
router.get('/', async (req, res) => {
  const { data, error } = await supabase
    .from('incidents')
    .select('*')
    .order('created_at', { ascending: false })
    .limit(20);
  if (error) return res.status(400).json({ error: error.message });
  res.json(data);
});

module.exports = router;