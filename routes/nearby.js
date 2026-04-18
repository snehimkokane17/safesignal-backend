const express = require('express');
const axios = require('axios');

const router = express.Router();

router.get('/', async (req, res) => {
  const { lat, lng, type } = req.query;

  const typeMap = {
    hospital: 'amenity=hospital',
    police: 'amenity=police',
    fire_station: 'amenity=fire_station',
    pharmacy: 'amenity=pharmacy'
  };

  const filter = typeMap[type] || 'amenity=hospital';

  const query = `
    [out:json];
    node[${filter}](around:5000,${lat},${lng});
    out 10;
  `;

  try {
    const response = await axios.post(
      'https://overpass-api.de/api/interpreter',
      query,
      { headers: { 'Content-Type': 'text/plain' } }
    );

    const results = response.data.elements.map(place => ({
      id: place.id,
      name: place.tags?.name || 'Unknown',
      type: type,
      lat: place.lat,
      lng: place.lon,
      address: place.tags?.['addr:full'] || place.tags?.['addr:street'] || 'Address not available'
    }));

    res.json(results);
  } catch (err) {
    res.status(500).json({ error: err.message });
  }
});

module.exports = router;