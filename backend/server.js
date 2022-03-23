const express = require('express');
const app = express();
const bodyParser = require('body-parser');
const PORT = 5000;
const cors = require('cors');
const mongoose = require('mongoose');
const config = require('./config/db');
// const MemberRoutes = require('./routes/member.route');
// const UploadImg = require('./routes/upload.route');

mongoose.Promise = global.Promise;

const connectDB = async () => {
  const conn = await mongoose.connect(config.DB, { useUnifiedTopology: true, useNewUrlParser: true, })
    .then(() => { console.log('Database is connected') },
      err => { console.log('Can not connect to the database' + err) }
    );
}
connectDB()

app.use(cors());
app.use(bodyParser.urlencoded({ extended: true }));
app.use(bodyParser.json());

app.listen(PORT, function () {
  console.log('Server is running on Port:', PORT);
});