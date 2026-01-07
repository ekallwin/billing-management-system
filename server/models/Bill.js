const mongoose = require('mongoose');

const BillSchema = new mongoose.Schema({
    items: [{
        name: String,
        price: Number,
        quantity: Number,
        total: Number
    }],
    subtotal: Number,
    taxAmount: Number,
    totalAmount: Number,
    date: { type: Date, default: Date.now },
    status: { type: String, default: 'Paid' }
});

module.exports = mongoose.model('Bill', BillSchema);
