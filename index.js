const express = require('express');
const mongoose = require('mongoose');
const cors = require('cors');
const dotenv = require('dotenv');

dotenv.config();

const app = express();
const PORT = process.env.PORT || 5000;

// Middleware
app.use(cors());
app.use(express.json());

// Database Connection
mongoose.connect(process.env.MONGODB_URI)
    .then(() => console.log('MongoDB connected'))
    .catch(err => console.error('MongoDB connection error:', err));

// Basic route
app.get('/', (req, res) => {
    res.send('Ticket Management System API is running...');
});

// Import Routes
const authRoutes = require('./routes/auth');
const masterRoutes = require('./routes/master');
const userRoutes = require('./routes/users');
const complaintRoutes = require('./routes/complaints');

// Use Routes
app.use('/api/auth', authRoutes);
app.use('/api/master', masterRoutes);
app.use('/api/users', userRoutes);
app.use('/api/complaints', complaintRoutes);

// Setup Route (For initial user/role creation)
const Role = require('./models/Role');
const User = require('./models/User');

app.all('/api/setup', async (req, res) => {
    try {
        console.log('Running setup...');
        // Create default roles if they don't exist
        const roles = ['Superadmin', 'User', 'Networking Staff', 'Plumber', 'Electrician', 'Software Developer'];
        for (const roleName of roles) {
            await Role.findOneAndUpdate({ name: roleName }, { name: roleName }, { upsert: true });
        }

        // Create SuperAdmin if it doesn't exist
        const superAdminRole = await Role.findOne({ name: 'Superadmin' });
        if (!superAdminRole) {
            return res.status(500).json({ error: 'Failed to create roles' });
        }

        let existingSuperAdmin = await User.findOne({ username: 'admin' });

        if (!existingSuperAdmin) {
            existingSuperAdmin = new User({
                username: 'admin',
                password: 'adminpassword',
                email: 'admin@tms.com',
                phoneNumber: '1234567890',
                role: superAdminRole._id
            });
            await existingSuperAdmin.save();
            console.log('Superadmin created: admin / adminpassword');
            return res.status(201).json({
                success: true,
                message: 'Setup completed. Created Superadmin.',
                credentials: { username: 'admin', password: 'adminpassword' }
            });
        } else {
            // Force reset password to ensure it's hashed correctly
            existingSuperAdmin.password = 'adminpassword';
            await existingSuperAdmin.save();
            console.log('Superadmin password reset confirmed: admin / adminpassword');
            return res.json({
                success: true,
                message: 'Setup fixed. Admin password has been reset and hashed correctly.',
                credentials: { username: 'admin', password: 'adminpassword' }
            });
        }

    } catch (error) {
        console.error('Setup error:', error);
        res.status(500).json({ error: error.message });
    }
});


app.listen(PORT, () => {
    console.log(`Server is running on port ${PORT}`);
});
