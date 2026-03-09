const express = require('express');
const cors = require('cors');
const bodyParser = require('body-parser');
const db = require('./db');  // Importing the database connection

// Initialize Express app
const app = express();
const port = 5000;

// Middleware
app.use(cors());
app.use(bodyParser.json());

// Routes

// Get all donations
app.get('/donations', async (req, res) => {
  try {
    const [rows] = await db.execute('SELECT * FROM donations');
    res.json(rows);
  } catch (err) {
    console.error('Error fetching donations:', err);
    res.status(500).json({ error: 'Error fetching donations' });
  }
});

// Add a new donation
app.post('/add-donation', async (req, res) => {
  const { hotelName, foodName, foodQuantity } = req.body;

  if (!hotelName || !foodName || !foodQuantity) {
    return res.status(400).json({ error: 'All fields are required' });
  }

  try {
    await db.execute(
      'INSERT INTO donations (hotel_name, food_name, food_quantity) VALUES (?, ?, ?)',
      [hotelName, foodName, foodQuantity]
    );
    res.status(201).json({ message: 'Donation added successfully' });
  } catch (err) {
    console.error('Error adding donation:', err);
    res.status(500).json({ error: 'Error adding donation' });
  }
});

// Delete a donation
app.delete('/delete-donation/:id', async (req, res) => {
  const { id } = req.params;

  try {
    const [rows] = await db.execute('SELECT * FROM donations WHERE id = ?', [id]);
    if (rows.length === 0) {
      return res.status(404).json({ error: 'Donation not found' });
    }

    await db.execute('DELETE FROM donations WHERE id = ?', [id]);
    res.json({ message: 'Donation deleted successfully' });
  } catch (err) {
    console.error('Error deleting donation:', err);
    res.status(500).json({ error: 'Error deleting donation' });
  }
});

// Edit a donation
app.put('/edit-donation/:id', async (req, res) => {
  const { id } = req.params;
  const { hotelName, foodName, foodQuantity } = req.body;

  if (!hotelName || !foodName || !foodQuantity) {
    return res.status(400).json({ error: 'All fields are required' });
  }

  try {
    const [rows] = await db.execute('SELECT * FROM donations WHERE id = ?', [id]);
    if (rows.length === 0) {
      return res.status(404).json({ error: 'Donation not found' });
    }

    await db.execute(
      'UPDATE donations SET hotel_name = ?, food_name = ?, food_quantity = ? WHERE id = ?',
      [hotelName, foodName, foodQuantity, id]
    );
    res.json({ message: 'Donation updated successfully' });
  } catch (err) {
    console.error('Error updating donation:', err);
    res.status(500).json({ error: 'Error updating donation' });
  }
});
app.put('/book-donation/:id', async (req, res) => {
  const { id } = req.params; // Get donation ID from URL parameter
  const { organizationName } = req.body; // Get organization name from request body

  let connection;
  try {
    connection = await myDBConnection(); // Establish DB connection

    // Check if the donation exists and is not already booked
    const [donation] = await connection.execute('SELECT * FROM donations WHERE id = ? AND isBooked = 0', [id]);
    if (donation.length === 0) {
      return res.status(404).json({ error: 'Donation not found or already booked' });
    }

    // Insert the booking record linking receiver to donation
    await connection.execute(
      'INSERT INTO bookings (organization_name, donation_id) VALUES (?, ?)',
      [organizationName, id]
    );

    // Mark the donation as booked
    await connection.execute('UPDATE donations SET isBooked = 1 WHERE id = ?', [id]);

    res.json({ message: 'Donation booked successfully', donation: { id, isBooked: 1 }, organization_name: organizationName });
  } catch (err) {
    console.error('Error booking donation:', err);
    res.status(500).json({ error: 'Error booking donation' });
  } finally {
    if (connection) await connection.end(); // Close DB connection
  }
});

// Start the server
app.listen(port, () => {
  console.log(`Server is running on http://localhost:${port}`);
});




// // Start the server
// app.listen(port, () => {
//   console.log(`Server is running on http://localhost:${port}`);
// });

// app.put('/book-donation/:id', async (req, res) => {
//   const { id } = req.params; // Get donation ID from URL parameter
//   const { organizationName } = req.body; // Get organization name from request body

//   let connection;
//   try {
//     connection = await myDBConnection(); // Establish DB connection

//     // Check if the donation exists and is not already booked
//     const [donation] = await connection.execute('SELECT * FROM donations WHERE id = ? AND isBooked = 0', [id]);
//     if (donation.length === 0) {
//       return res.status(404).json({ error: 'Donation not found or already booked' });
//     }

//     // Insert the booking record linking receiver to donation
//     await connection.execute(
//       'INSERT INTO bookings (organization_name, donation_id) VALUES (?, ?)',
//       [organizationName, id]
//     );

//     // Mark the donation as booked
//     await connection.execute('UPDATE donations SET isBooked = 1 WHERE id = ?', [id]);

//     res.json({ message: 'Donation booked successfully', donation: { id, isBooked: 1 }, organization_name: organizationName });
//   } catch (err) {
//     console.error('Error booking donation:', err);
//     res.status(500).json({ error: 'Error booking donation' });
//   } finally {
//     if (connection) await connection.end(); // Close DB connection
//   }
// });