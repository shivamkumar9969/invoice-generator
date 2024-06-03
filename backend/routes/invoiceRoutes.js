const express = require('express');
const router = express.Router();
const Receipt = require('../models/Invoice');
const authenticateUser = require('../middleware/authenticateUser');

router.post('/api/receipts', authenticateUser, async (req, res) => {
    try {
        const { products, totalWithGST } = req.body;
        const userId = req.user.userId;

        const newReceipt = new Receipt({
            products,
            totalWithGST,
            userId
        });

        await newReceipt.save();
        res.status(201).json({ message: 'Receipt saved successfully' });
    } catch (error) {
        console.error('Error saving receipt:', error);
        res.status(500).json({ message: 'Server error' });
    }
});



router.get('/api/receipts', authenticateUser, async (req, res) => {
    try {
        const userId = req.user.userId;
        const receipts = await Receipt.find({ userId }).sort({ date: -1 });
        res.status(200).json(receipts);
    } catch (error) {
        console.error('Error fetching receipts:', error);
        res.status(500).json({ message: 'Server error' });
    }
});
router.delete('/api/receipts/:id', authenticateUser, async (req, res) => {
    try {
        const receiptId = req.params.id;
        const userId = req.user.userId;

        console.log('Receipt ID:', receiptId);
        console.log('User ID:', userId);


        const receipt = await Receipt.findOneAndDelete({ _id: receiptId, userId });

        if (!receipt) {
            return res.status(404).json({ message: 'Receipt not found or unauthorized' });
        }

        res.status(200).json({ message: 'Receipt deleted successfully' });
    } catch (error) {
        console.error('Error deleting receipt:', error);
        res.status(500).json({ message: 'Server error' });
    }
});

module.exports = router;
