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
const mongoDB_url = process.env.DATABASE;
// MongoDB connection
const connectionParams = {
    useNewUrlParser: true,


}
mongoose.connect(mongoDB_url, connectionParams)
    .then(() => {
        console.log('Connected to the database ')
    })
    .catch((err) => {
        console.error(`Error connecting to the database. n${err}`);
    })


// Middleware for parsing JSON data
app.use(bodyParser.json());

// Use userRoutes for handling user authentication
app.use(userRoutes);

app.use(invoiceRoutes)

// Start server
app.listen(PORT, () => {
    console.log(`Server running on port ${PORT}`);
});


