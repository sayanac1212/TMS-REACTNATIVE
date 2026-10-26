/**
 * List all users in the database
 * Usage: node listUsers.js
 */

const mongoose = require('mongoose');
const User = require('./models/User');
const Role = require('./models/Role');
const Department = require('./models/Department');
const Programme = require('./models/Programme');
require('dotenv').config();

mongoose.connect(process.env.MONGODB_URI)
    .then(async () => {
        const users = await User.find().populate('role').populate('department').populate('programme');

        console.log('\n📋 ALL USERS IN DATABASE:\n');
        console.log('─'.repeat(60));

        users.forEach((u, i) => {
            console.log(`${i + 1}. Username  : ${u.username}`);
            console.log(`   Email     : ${u.email || 'Not set'}`);
            console.log(`   Phone     : ${u.phoneNumber || 'Not set'}`);
            console.log(`   Role      : ${u.role?.name || 'Unknown'}`);
            console.log(`   Department: ${u.department?.name || 'Not assigned'}`);
            console.log(`   Programme : ${u.programme?.name || 'Not assigned'}`);
            console.log('─'.repeat(60));
        });

        console.log(`\nTotal users: ${users.length}\n`);
        process.exit(0);
    })
    .catch(err => {
        console.error('❌ MongoDB connection error:', err.message);
        process.exit(1);
    });
