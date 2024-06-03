const mongoose = require('mongoose');
const InvoiceSchema = new mongoose.Schema({
    userId: { type: mongoose.Schema.Types.ObjectId, ref: 'User' }, // Ensure it references the User model
    products: [
        {
            name: String,
            qty: Number,
            rate: Number,
            total: Number,
        }
    ],
    totalWithGST: Number,
    date: { type: Date, default: Date.now }
});

module.exports = mongoose.model('Invoice', InvoiceSchema);
