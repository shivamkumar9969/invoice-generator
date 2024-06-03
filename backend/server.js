const express = require('express');
const cors = require('cors');
const mongoose = require('mongoose');
const bodyParser = require('body-parser');
const userRoutes = require('./routes/userRoutes.js'); // Import userRoutes
const app = express();
const PORT = process.env.PORT || 5000;
const path = require('path');
const invoiceRoutes = require('./routes/invoiceRoutes.js')

// Use CORS middleware
app.use(cors());

// MongoDB connection
mongoose.connect('mongodb://localhost:27017/invoice-generator', {
    useNewUrlParser: true,
    useUnifiedTopology: true,
});

const db = mongoose.connection;
db.on('error', console.error.bind(console, 'MongoDB connection error:'));

// Middleware for parsing JSON data
app.use(bodyParser.json());

// Use userRoutes for handling user authentication
app.use(userRoutes);

app.use(invoiceRoutes)

// Start server
app.listen(PORT, () => {
    console.log(`Server running on port ${PORT}`);
});


