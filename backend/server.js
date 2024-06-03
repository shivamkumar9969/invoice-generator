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
const uri = "mongodb+srv://shivamkumar9969:HUoT3DbIM7spNuYS@cluster0.drhzkfr.mongodb.net/myDatabase?retryWrites=true&w=majority&appName=Cluster0";

// Connect to MongoDB
mongoose.connect(uri, { useNewUrlParser: true, useUnifiedTopology: true })
    .then(() => console.log('Database connected successfully'))
    .catch(err => console.error('Error connecting to the database:', err));
// Middleware for parsing JSON data
app.use(bodyParser.json());

// Use userRoutes for handling user authentication
app.use(userRoutes);

app.use(invoiceRoutes)

// Start server
app.listen(PORT, () => {
    console.log(`Server running on port ${PORT}`);
});


