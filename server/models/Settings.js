const mongoose = require('mongoose');

const SettingsSchema = new mongoose.Schema({
    upiId: { type: String, default: '' },
    merchantName: { type: String, default: '' },
    transactionName: { type: String, default: '' },
    taxEnabled: { type: Boolean, default: false },
    taxName: { type: String, default: '' },
    taxPercent: { type: String, default: '' },
    thermalPrint: { type: Boolean, default: true },
    businessName: { type: String, default: '' },
    address: { type: String, default: '' },
    phone: { type: String, default: '' },
    email: { type: String, default: '' },
    gstNumber: { type: String, default: '' },
    fssai: { type: String, default: '' }
});

module.exports = mongoose.model('Settings', SettingsSchema);
