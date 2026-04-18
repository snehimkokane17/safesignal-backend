const express = require('express');
const { createClient } = require('@supabase/supabase-js');
require('dotenv').config();

const router = express.Router();
const supabase = createClient(
  process.env.SUPABASE_URL,
  process.env.SUPABASE_SERVICE_KEY
);

// TRIGGER SOS
router.post('/trigger', async (req, res) => {
  const { user_id, lat, lng } = req.body;
  try {
    // 1. Save SOS alert to database
    const { data, error } = await supabase
      .from('sos_alerts')
      .insert([{ user_id, lat, lng, status: 'active' }])
      .select();
    if (error) return res.status(400).json({ error: error.message });

    // 2. Get user's emergency contacts
    const { data: contacts } = await supabase
      .from('contacts')
      .select('*')
      .eq('user_id', user_id);

    // 3. Return success with contacts notified
    res.json({
      message: 'SOS triggered successfully',
      alert: data[0],
      contacts_notified: contacts?.length || 0
    });
  } catch (err) {
    res.status(500).json({ error: err.message });
  }
});

// GET all SOS alerts for a user
router.get('/:user_id', async (req, res) => {
  const { user_id } = req.params;
  const { data, error } = await supabase
    .from('sos_alerts')
    .select('*')
    .eq('user_id', user_id)
    .order('created_at', { ascending: false });
  if (error) return res.status(400).json({ error: error.message });
  res.json(data);
});

module.exports = router;