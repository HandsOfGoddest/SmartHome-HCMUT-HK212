const dotenv= require('dotenv');

//Import mongoose
const mongoose = require('mongoose');

// Import data
const users = require('./rdata/User');

// Import Models
const userModel = require('./models/UserModel');
const connectDB = require('./config/db');

dotenv.config();

// Connect to DB
mongoose.connect(connectDB.DB, { useNewUrlParser: true }).then(
  () => {console.log('Database is connected') },
  err => { console.log('Can not connect to the database'+ err)}
);

// Insert Data to DB
const importData = async () => {
  try {
    await userModel.deleteMany(); // Clean Users in DB

    await userModel.insertMany(users); // Insert Users to DB
  
    console.log('Data imported');
    process.exit();
  } catch (error) {
    console.log(`Error: ${error.message}`);
    process.exit(1);
  }
};

// const destroyData = async () => {
//   try {
//     await templatesModel.deleteMany();
//     await memberModel.deleteMany();

//     console.log('Data destroyed');
//     process.exit();
//   } catch (error) {
//     console.log(`Error: ${error.message}`);
//     process.exit(1);
//   }
// };

if (process.argv[2] === '-d') {
  destroyData();
} else {
  importData();
}
