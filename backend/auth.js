const express = require('express');
const myDBConnection = require('./db'); // Ensure the path to your DB connection file is correct
const router = express.Router();

// Signup route for donors
router.post('/donor/signup', async (req, res) => {
    const { hotel_id, hotel_name, hotel_email, phone, password } = req.body;

    try {
        const db = await myDBConnection();  // Get the connection instance

        // Check if hotel_email already exists
        const [results] = await db.execute('SELECT * FROM donors WHERE hotel_email = ?', [hotel_email]);

        if (results.length > 0) {
            return res.status(400).json({ message: 'Email already in use' });
        }

        // Insert new donor into the database
        await db.execute(
            'INSERT INTO donors (hotel_id, hotel_name, hotel_email, phone, password) VALUES (?, ?, ?, ?, ?)',
            [hotel_id, hotel_name, hotel_email, phone, password]
        );

        res.status(201).json({ message: 'Hotel registered successfully' });

    } catch (error) {
        console.error('Detailed Database error:', error);  // Log the full error for debugging
        res.status(500).json({ error: 'Database error', details: error.message });
    }
});

// Login route for donors
router.post('/donor/login', async (req, res) => {
    const { hotel_email, password } = req.body;

    try {
        const db = await myDBConnection(); // Get the connection instance

        // Check if the hotel exists
        const [results] = await db.execute('SELECT * FROM donors WHERE hotel_email = ?', [hotel_email]);

        if (results.length === 0) {
            return res.status(400).json({ message: 'Invalid email or password' });
        }

        const hotel = results[0];

        // Simple password comparison (direct matching - not recommended for production)
        if (password !== hotel.password) {
            return res.status(400).json({ message: 'Invalid email or password' });
        }

        // Respond with success if login is valid
        res.status(200).json({
            message: 'Login successful',
            hotel: {
                hotel_id: hotel.hotel_id,
                hotel_name: hotel.hotel_name,
                hotel_email: hotel.hotel_email,
                phone: hotel.phone
            }
        });

    } catch (error) {
        console.error('Detailed Database error:', error);
        res.status(500).json({ error: 'Database error', details: error.message });
    }
});

router.post('/org/signup', async (req, res) => {
    const { organization_id, organization_name, organization_email, organization_phone, organization_password } = req.body;

    try {
        const db = await myDBConnection();  // Get the connection instance

        // Check if organization_email already exists
        const [results] = await db.execute('SELECT * FROM receivers WHERE organization_email = ?', [organization_email]);

        if (results.length > 0) {
            return res.status(400).json({ message: 'Email already in use' });
        }

        // Insert new receiver (organization) into the database
        await db.execute(
            'INSERT INTO receivers (organization_id, organization_name, organization_email, organization_phone, organization_password) VALUES (?, ?, ?, ?, ?)',
            [organization_id, organization_name, organization_email, organization_phone, organization_password]
        );

        res.status(201).json({ message: 'Organization registered successfully' });

    } catch (error) {
        console.error('Detailed Database error:', error);  // Log the full error for debugging
        res.status(500).json({ error: 'Database error', details: error.message });
    }
});

// Login route for receivers (organizations)
router.post('/org/login', async (req, res) => {
    const { organization_email, organization_password } = req.body;

    try {
        const db = await myDBConnection(); // Get the connection instance

        // Check if the organization exists
        const [results] = await db.execute('SELECT * FROM receivers WHERE organization_email = ?', [organization_email]);

        if (results.length === 0) {
            return res.status(400).json({ message: 'Invalid email or password' });
        }

        const organization = results[0];

        // Simple password comparison (direct matching - not recommended for production)
        if (organization_password !== organization.organization_password) {
            return res.status(400).json({ message: 'Invalid email or password' });
        }

        // Respond with success if login is valid
        res.status(200).json({
            message: 'Login successful',
            organization: {
                organization_id: organization.organization_id,
                organization_name: organization.organization_name,
                organization_email: organization.organization_email,
                organization_phone: organization.organization_phone
            }
        });

    } catch (error) {
        console.error('Detailed Database error:', error);
        res.status(500).json({ error: 'Database error', details: error.message });
    }
});

module.exports = router;
