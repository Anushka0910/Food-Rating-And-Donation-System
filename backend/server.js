const express = require('express');
const cors = require('cors');
const bodyParser = require('body-parser');
const myDBConnection = require('./db'); // Database connection
const authRoutes = require('./auth'); // Authentication routes

// Initialize Express app
const app = express();
const port = 5000;

// Middleware
app.use(cors());
app.use(bodyParser.json());

// Donations Router
const donationRoutes = express.Router();

// Get all donations
donationRoutes.get('/', async (req, res) => {
  let connection;
  try {
    connection = await myDBConnection();
    const [rows] = await connection.execute('SELECT * FROM donations');
    res.json(rows);
  } catch (err) {
    console.error('Error fetching donations:', err);
    res.status(500).json({ error: 'Error fetching donations' });
  } finally {
    if (connection) connection.end();
  }
});

// Add a new donation
donationRoutes.post('/add', async (req, res) => {
  const { hotelName, foodName, foodQuantity } = req.body;
  if (!hotelName || !foodName || !foodQuantity) {
    return res.status(400).json({ error: 'All fields are required' });
  }

  let connection;
  try {
    connection = await myDBConnection();
    await connection.execute(
      'INSERT INTO donations (hotel_name, food_name, food_quantity) VALUES (?, ?, ?)',
      [hotelName, foodName, foodQuantity]
    );
    res.json({ message: 'Donation added successfully' });
  } catch (err) {
    console.error('Error adding donation:', err);
    res.status(500).json({ error: `Error adding donation: ${err.message}` });
  } finally {
    if (connection) connection.end();
  }
});

// Delete a donation
donationRoutes.delete('/delete/:id', async (req, res) => {
  const { id } = req.params;

  let connection;
  try {
    connection = await myDBConnection();
    const [rows] = await connection.execute('SELECT * FROM donations WHERE id = ?', [id]);

    if (rows.length === 0) {
      return res.status(404).json({ error: 'Donation not found' });
    }

    await connection.execute('DELETE FROM donations WHERE id = ?', [id]);
    res.json({ message: 'Donation deleted successfully' });
  } catch (err) {
    console.error('Error deleting donation:', err);
    res.status(500).json({ error: `Error deleting donation: ${err.message}` });
  } finally {
    if (connection) connection.end();
  }
});


// Edit a donation
donationRoutes.put('/edit/:id', async (req, res) => {
  const { id } = req.params;
  const { hotelName, foodName, foodQuantity } = req.body;

  let connection;
  try {
    connection = await myDBConnection();
    const [rows] = await connection.execute('SELECT * FROM donations WHERE id = ?', [id]);

    if (rows.length === 0) {
      return res.status(404).json({ error: 'Donation not found' });
    }

    await connection.execute(
      'UPDATE donations SET hotel_name = ?, food_name = ?, food_quantity = ? WHERE id = ?',
      [hotelName, foodName, foodQuantity, id]
    );
    res.json({ message: 'Donation updated successfully' });
  } catch (err) {
    console.error('Error updating donation:', err);
    res.status(500).json({ error: `Error updating donation: ${err.message}` });
  } finally {
    if (connection) connection.end();
  }
});

donationRoutes.put('/book-donation/:id', async (req, res) => {
  const { id } = req.params; // Get donation ID from URL parameter
  const { organizationName } = req.body; // Get organization name from request body

  let connection;
  try {
    connection = await myDBConnection(); // Establish DB connection

    // Check if the donation exists and is not already booked
    const [donation] = await connection.execute(
      'SELECT * FROM donations WHERE id = ? AND isBooked = 0', [id]
    );
    
    if (donation.length === 0) {
      return res.status(404).json({ error: 'Donation not found or already booked' });
    }

    // Insert the booking record, only storing the organization name
    await connection.execute(
      'INSERT INTO bookings (organization_name, donation_id, booking_status) VALUES (?, ?, ?)',
      [organizationName, id, 'pending']
    );

    // Mark the donation as booked
    await connection.execute('UPDATE donations SET isBooked = 1 WHERE id = ?', [id]);

    // Send a success response
    res.json({
      message: 'Donation booked successfully',
      donation: { id, isBooked: 1 },
      organization_name: organizationName
    });

  } catch (err) {
    console.error('Error booking donation:', err);  // Log the full error message
    res.status(500).json({
      error: 'Error booking donation',
      details: err.message,
      stack: err.stack
    });
  } finally {
    if (connection) await connection.end(); // Close DB connection
  }
});

// Use the donations routes
app.use('/donations', donationRoutes);

// Use the auth routes
app.use('/auth', authRoutes);


// Route to get average rating for all dishes at a given hotel
app.get('/api/rating/:hotel_id/average', async (req, res) => {
  const hotel_id = req.params.hotel_id;

  let connection;
  try {
    connection = await myDBConnection(); // Establish DB connection

    // Query to fetch average rating for all dishes at the given hotel
    const [result] = await connection.execute(
      `SELECT dish_id, AVG(rating) AS average_rating
       FROM ratings
       WHERE hotel_id = ?
       GROUP BY dish_id;`,
      [hotel_id]
    );

    res.status(200).json({ ratings: result });
  } catch (err) {
    console.error('Error fetching ratings:', err);
    res.status(500).json({ message: 'Error fetching ratings' });
  } finally {
    if (connection) connection.end(); // Close DB connection
  }
});




// Start the server
app.listen(port, () => {
  console.log(`Server is running on http://localhost:${port}`);
});
