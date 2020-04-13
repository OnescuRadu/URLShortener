const mongoose = require('mongoose');

mongoose.connect(
  '{connection string}', // Insert the database connection string
  { useNewUrlParser: true, useUnifiedTopology: true, useCreateIndex: true }
);

mongoose.connection
  .once('open', () => console.log('Connected to DB'))
  .on('error', error => console.log(`Database error: ${error}`));

module.exports = mongoose;
