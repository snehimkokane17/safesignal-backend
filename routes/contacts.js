const express = require('express');
const { createClient } = require('@supabase/supabase-js');
require('dotenv').config();

const router = express.Router();
const supabase = createClient(
  process.env.SUPABASE_URL,
  process.env.SUPABASE_SERVICE_KEY
);

// GET all contacts for a user
router.get('/:user_id', async (req, res) => {
  const { user_id } = req.params;
  const { data, error } = await supabase
    .from('contacts')
    .select('*')
    .eq('user_id', user_id);
  if (error) return res.status(400).json({ error: error.message });
  res.json(data);
});

// ADD a new contact
router.post('/', async (req, res) => {
  const { user_id, name, phone, relation, is_primary } = req.body;
  const { data, error } = await supabase
    .from('contacts')
    .insert([{ user_id, name, phone, relation, is_primary }])
    .select();
  if (error) return res.status(400).json({ error: error.message });
  res.json(data[0]);
});

// DELETE a contact
router.delete('/:id', async (req, res) => {
  const { id } = req.params;
  const { error } = await supabase
    .from('contacts')
    .delete()
    .eq('id', id);
  if (error) return res.status(400).json({ error: error.message });
  res.json({ message: 'Contact deleted successfully' });
});

module.exports = router;