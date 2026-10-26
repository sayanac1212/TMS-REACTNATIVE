/**
 * Password Reset Script
 * Usage: node resetPassword.js <username> <newpassword>
 * Example: node resetPassword.js binod test1234
 */

const mongoose = require('mongoose');
const User = require('./models/User');
require('dotenv').config();

const username = process.argv[2];
const newPassword = process.argv[3];

if (!username || !newPassword) {
    console.log('❌ Usage: node resetPassword.js <username> <newpassword>');
    console.log('   Example: node resetPassword.js binod test1234');
    process.exit(1);
}

mongoose.connect(process.env.MONGODB_URI)
    .then(async () => {
        const user = await User.findOne({ username });

        if (!user) {
            console.log(`❌ User "${username}" not found.`);
            process.exit(1);
        }

        user.password = newPassword;
        await user.save();

        console.log(`✅ Password for "${username}" has been reset to "${newPassword}"`);
        process.exit(0);
    })
    .catch(err => {
        console.error('❌ MongoDB connection error:', err.message);
        process.exit(1);
    });
