/**
 * Script to create admin users in the database
 * Run: node scripts/createAdmin.js
 */

require('dotenv').config();
const mongoose = require('mongoose');
const User = require('../models/User');

// MongoDB connection
const connectDB = async () => {
  try {
    await mongoose.connect(process.env.MONGODB_URI || 'mongodb://localhost:27017/telemedai');
    console.log('✅ MongoDB connected successfully');
  } catch (error) {
    console.error('❌ MongoDB connection failed:', error.message);
    process.exit(1);
  }
};

// Admin users to create
const adminUsers = [
  {
    name: 'Admin One',
    email: 'admin1@gmail.com',
    password: 'admin123',
    phone: '+1234567890',
    dateOfBirth: new Date('1990-01-01'),
    gender: 'Male',
    role: 'admin',
    isActive: true,
    isEmailVerified: true,
    onboardingCompleted: true
  },
  {
    name: 'Admin Two',
    email: 'admin2@gmail.com',
    password: 'admin456',
    phone: '+1234567891',
    dateOfBirth: new Date('1985-05-15'),
    gender: 'Female',
    role: 'admin',
    isActive: true,
    isEmailVerified: true,
    onboardingCompleted: true
  },
  {
    name: 'Admin Three',
    email: 'admin3@gmail.com',
    password: 'admin789',
    phone: '+1234567892',
    dateOfBirth: new Date('1988-08-20'),
    gender: 'Male',
    role: 'admin',
    isActive: true,
    isEmailVerified: true,
    onboardingCompleted: true
  }
];

const createAdmins = async () => {
  try {
    console.log('\n🚀 Starting admin user creation...\n');

    for (const adminData of adminUsers) {
      // Check if admin already exists
      const existingAdmin = await User.findOne({ email: adminData.email });
      
      if (existingAdmin) {
        console.log(`⚠️  Admin ${adminData.email} already exists. Skipping...`);
        continue;
      }

      // Create new admin
      const admin = new User(adminData);
      await admin.save();
      
      console.log(`✅ Admin created: ${adminData.name} (${adminData.email})`);
    }

    console.log('\n✨ Admin creation completed!\n');
    console.log('📝 Admin Credentials:');
    console.log('====================');
    adminUsers.forEach((admin, index) => {
      console.log(`\n${index + 1}. Email: ${admin.email}`);
      console.log(`   Password: ${admin.password}`);
    });
    console.log('\n');

  } catch (error) {
    console.error('❌ Error creating admins:', error.message);
  } finally {
    // Close database connection
    await mongoose.connection.close();
    console.log('✅ Database connection closed');
    process.exit(0);
  }
};

// Run the script
(async () => {
  await connectDB();
  await createAdmins();
})();
