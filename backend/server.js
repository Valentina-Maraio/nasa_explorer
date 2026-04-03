const express = require('express');
const cors = require('cors');
require('dotenv').config();

const app = express();
const PORT = process.env.PORT || 3001;

app.use(cors());
app.use(express.json());

// Routes
app.get('/api/apod', async (req, res) => {
    try {
        const axios = require('axios');
        const date = req.query.date || new Date().toISOString().split('T')[0];
        const response = await axios.get(`https://api.nasa.gov/planetary/apod?api_key=${process.env.NASA_API_KEY}&date=${date}`);
        res.json(response.data);
    } catch (error) {
        res.status(500).json({ error: 'Failed to fetch APOD' });
    }
});

app.get('/api/mars/manifest', async (req, res) => {
    try {
        const axios = require('axios');
        const rover = req.query.rover || 'curiosity';
        const response = await axios.get(
            `https://api.nasa.gov/mars-photos/api/v1/manifests/${rover}?api_key=${process.env.NASA_API_KEY}`
        );
        const manifest = response.data.photo_manifest;

        // Get sols with photos
        const sols = manifest.photos.map(p => p.sol);
        const maxSol = manifest.max_sol;
        const maxDate = manifest.max_date;

        res.json({
            rover: manifest.name,
            status: manifest.status,
            sols: sols,
            maxSol: maxSol,
            maxDate: maxDate,
            totalPhotos: manifest.total_photos
        });
    } catch (error) {
        res.status(500).json({ error: 'Failed to fetch Mars rover manifest' });
    }
});

app.get('/api/mars/photos', async (req, res) => {
    try {
        const axios = require('axios');
        const { rover = 'curiosity', camera, sol, earth_date } = req.query;
        let url = `https://api.nasa.gov/mars-photos/api/v1/rovers/${rover}/photos?api_key=${process.env.NASA_API_KEY}`;

        // Default to a known sol if neither sol nor earth_date provided
        if (!sol && !earth_date) {
            url += '&sol=1000';
        } else {
            if (sol) url += `&sol=${sol}`;
            if (earth_date) url += `&earth_date=${earth_date}`;
        }

        if (camera) url += `&camera=${camera}`;

        const response = await axios.get(url);
        res.json(response.data);
    } catch (error) {
        console.error('Mars photos error:', error.message);
        res.status(500).json({ error: 'Failed to fetch Mars photos', details: error.message });
    }
});

app.get('/api/images/search', async (req, res) => {
    try {
        const axios = require('axios');
        const q = req.query.q || 'moon';
        const response = await axios.get(`https://images-api.nasa.gov/search?q=${q}`);
        res.json(response.data);
    } catch (error) {
        res.status(500).json({ error: 'Failed to search images' });
    }
});

app.get('/api/images/asset', async (req, res) => {
    try {
        const axios = require('axios');
        const nasa_id = req.query.nasa_id;

        if (!nasa_id) {
            return res.status(400).json({ error: 'Missing nasa_id parameter' });
        }

        const response = await axios.get(`https://images-api.nasa.gov/asset/${nasa_id}`);
        res.json(response.data);
    } catch (error) {
        res.status(500).json({ error: 'Failed to fetch asset data', details: error.message });
    }
});

app.get('/api/images/metadata', async (req, res) => {
    try {
        const axios = require('axios');
        const nasa_id = req.query.nasa_id;

        if (!nasa_id) {
            return res.status(400).json({ error: 'Missing nasa_id parameter' });
        }

        const response = await axios.get(`https://images-api.nasa.gov/metadata/${nasa_id}`);
        res.json(response.data);
    } catch (error) {
        res.status(500).json({ error: 'Failed to fetch metadata', details: error.message });
    }
});

app.listen(PORT, () => {
    console.log(`Server running on port ${PORT}`);
});