const express = require('express');
const bcrypt = require('bcryptjs');
const jwt = require('jsonwebtoken');
const { createClient } = require('@supabase/supabase-js');
require('dotenv').config();

const router = express.Router();
const supabase = createClient(
  process.env.SUPABASE_URL,
  process.env.SUPABASE_SERVICE_KEY
);

// REGISTER
router.post('/register', async (req, res) => {
  const { name, phone, password } = req.body;
  try {
    const hashedPassword = await bcrypt.hash(password, 10);
    const { data, error } = await supabase
      .from('users')
      .insert([{ name, phone, password: hashedPassword }])
      .select();
    if (error) return res.status(400).json({ error: error.message });
    const token = jwt.sign({ id: data[0].id }, process.env.JWT_SECRET);
    res.json({ token, user: { id: data[0].id, name, phone } });
  } catch (err) {
    res.status(500).json({ error: err.message });
  }
});

// LOGIN
router.post('/login', async (req, res) => {
  const { phone, password } = req.body;
  try {
    const { data, error } = await supabase
      .from('users')
      .select('*')
      .eq('phone', phone)
      .single();
    if (error || !data) return res.status(400).json({ error: 'User not found' });
    const match = await bcrypt.compare(password, data.password);
    if (!match) return res.status(400).json({ error: 'Wrong password' });
    const token = jwt.sign({ id: data.id }, process.env.JWT_SECRET);
    res.json({ token, user: { id: data.id, name: data.name, phone: data.phone } });
  } catch (err) {
    res.status(500).json({ error: err.message });
  }
});

module.exports = router;