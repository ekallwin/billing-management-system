const express = require('express');
const admin = require('firebase-admin');
const cors = require('cors');
require('dotenv').config();

require('./firebase');

const db = admin.firestore();
const app = express();
const allowedOrigins = process.env.ALLOWED_ORIGINS ? process.env.ALLOWED_ORIGINS.split(',') : [];

app.use(cors({
    origin: [
        'http://localhost:5173',
        ...allowedOrigins
    ],
    credentials: true
}));
app.use(express.json());

const PORT = process.env.PORT || 5000;

const authenticate = async (req, res, next) => {
    const authHeader = req.headers.authorization;
    if (!authHeader || !authHeader.startsWith('Bearer ')) {
        return res.status(401).json({ error: 'Unauthorized: No token provided' });
    }

    const token = authHeader.split(' ')[1];
    try {
        const decodedToken = await admin.auth().verifyIdToken(token);
        req.user = decodedToken;
        next();
    } catch (err) {
        console.error('Error verifying token:', err);
        res.status(401).json({ error: 'Unauthorized: Invalid token' });
    }
};

app.get('/api/products', authenticate, async (req, res) => {
    try {
        const snapshot = await db.collection('merchants').doc(req.user.uid).collection('products').get();
        const products = snapshot.docs.map(doc => ({ _id: doc.id, ...doc.data() }));
        res.json(products);
    } catch (err) {
        res.status(500).json({ error: err.message });
    }
});

app.post('/api/products', authenticate, async (req, res) => {
    try {
        const docRef = await db.collection('merchants').doc(req.user.uid).collection('products').add(req.body);
        const doc = await docRef.get();
        res.status(201).json({ _id: doc.id, ...doc.data() });
    } catch (err) {
        res.status(400).json({ error: err.message });
    }
});

app.put('/api/products/:id', authenticate, async (req, res) => {
    try {
        const docRef = db.collection('merchants').doc(req.user.uid).collection('products').doc(req.params.id);
        await docRef.update(req.body);
        const doc = await docRef.get();
        res.json({ _id: doc.id, ...doc.data() });
    } catch (err) {
        res.status(400).json({ error: err.message });
    }
});

app.delete('/api/products/:id', authenticate, async (req, res) => {
    try {
        await db.collection('merchants').doc(req.user.uid).collection('products').doc(req.params.id).delete();
        res.json({ message: 'Product deleted' });
    } catch (err) {
        res.status(500).json({ error: err.message });
    }
});

app.post('/api/bills', authenticate, async (req, res) => {
    try {
        const billData = {
            ...req.body,
            date: admin.firestore.FieldValue.serverTimestamp() // Use server timestamp
        };
        const docRef = await db.collection('merchants').doc(req.user.uid).collection('bills').add(billData);
        const doc = await docRef.get();
        res.status(201).json({ _id: doc.id, ...doc.data() });
    } catch (err) {
        res.status(400).json({ error: err.message });
    }
});

app.get('/api/bills', authenticate, async (req, res) => {
    try {
        const { startDate, endDate } = req.query;
        let query = db.collection('merchants').doc(req.user.uid).collection('bills').orderBy('date', 'desc');

        if (startDate && endDate) {
            query = query.where('date', '>=', new Date(startDate)).where('date', '<=', new Date(endDate));
        }

        const snapshot = await query.get();
        const bills = snapshot.docs.map(doc => {
            const data = doc.data();
            if (data.date && data.date.toDate) {
                data.date = data.date.toDate();
            }
            return { _id: doc.id, ...data };
        });
        res.json(bills);
    } catch (err) {
        res.status(500).json({ error: err.message });
    }
});

app.get('/api/settings', authenticate, async (req, res) => {
    try {
        const doc = await db.collection('settings').doc(req.user.uid).get();
        if (!doc.exists) {
            const defaults = {
                upiId: '',
                merchantName: '',
                transactionName: '',
                taxEnabled: false,
                taxName: 'GST',
                taxPercent: '0',
                thermalPrint: true,
                businessName: req.user.name || '',
                address: '',
                phone: '',
                email: req.user.email || '',
                gstNumber: '',
                fssai: ''
            };
            await db.collection('settings').doc(req.user.uid).set(defaults);
            return res.json(defaults);
        }
        res.json(doc.data());
    } catch (err) {
        res.status(500).json({ error: err.message });
    }
});

app.put('/api/settings', authenticate, async (req, res) => {
    try {
        await db.collection('settings').doc(req.user.uid).set(req.body, { merge: true });
        const doc = await db.collection('settings').doc(req.user.uid).get();
        res.json(doc.data());
    } catch (err) {
        res.status(400).json({ error: err.message });
    }
});
app.post('/api/auth/reset-password', async (req, res) => {
    try {
        const { email, password } = req.body;

        if (!email || !password) {
            return res.status(400).json({ error: 'Email and password are required' });
        }

        const userRecord = await admin.auth().getUserByEmail(email);

        await admin.auth().updateUser(userRecord.uid, {
            password: password
        });

        res.json({ message: 'Password updated successfully' });
    } catch (err) {
        console.error('Error resetting password:', err);
        res.status(400).json({ error: err.message });
    }
});

async function deleteCollection(db, collectionPath, batchSize) {
    const collectionRef = db.collection(collectionPath);
    const query = collectionRef.orderBy('__name__').limit(batchSize);

    return new Promise((resolve, reject) => {
        deleteQueryBatch(db, query, resolve).catch(reject);
    });
}

async function deleteQueryBatch(db, query, resolve) {
    const snapshot = await query.get();

    const batchSize = snapshot.size;
    if (batchSize === 0) {
        resolve();
        return;
    }

    const batch = db.batch();
    snapshot.docs.forEach((doc) => {
        batch.delete(doc.ref);
    });
    await batch.commit();

    process.nextTick(() => {
        deleteQueryBatch(db, query, resolve);
    });
}

app.post('/api/auth/force-reset-password', authenticate, async (req, res) => {
    try {
        const { newPassword } = req.body;
        const uid = req.user.uid;

        if (!newPassword || newPassword.length < 6) {
            return res.status(400).json({ error: 'Password must be at least 6 characters.' });
        }

        await admin.auth().updateUser(uid, {
            password: newPassword
        });

        res.json({ message: 'Password updated successfully' });
    } catch (err) {
        console.error('Error resetting password:', err);
        res.status(500).json({ error: 'Failed to reset password: ' + err.message });
    }
});

app.delete('/api/auth/delete-account', authenticate, async (req, res) => {
    try {
        const uid = req.user.uid;

        const settingsDoc = await db.collection('settings').doc(uid).get();
        const settings = settingsDoc.data();

        if (settings && settings.phone) {
            const cleanPhone = settings.phone.replace(/\D/g, '');
            if (cleanPhone.length === 10) {
                await db.collection('phoneToEmail').doc(cleanPhone).delete();
            }
        }

        await deleteCollection(db, `merchants/${uid}/products`, 50);
        await deleteCollection(db, `merchants/${uid}/bills`, 50);
        await db.collection('merchants').doc(uid).delete();
        await db.collection('settings').doc(uid).delete();
        await admin.auth().deleteUser(uid);

        res.json({ message: 'Account deleted successfully' });
    } catch (err) {
        console.error('Error deleting account:', err);
        res.status(500).json({ error: 'Failed to delete account: ' + err.message });
    }
});

app.listen(PORT, () => console.log(`Server running on port ${PORT}`));
