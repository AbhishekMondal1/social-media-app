const mongoose = require('mongoose');

const dbconnection = () => {
  mongoose.connect(process.env.MONGOURI, {
    useNewUrlParser: true,
    useUnifiedTopology: true,
  });
  mongoose.connection.on('connected', () => {
    console.log('Mongoose connected to MongoDB 🚀');
  });
  mongoose.connection.on('error', (err) => {
    console.log('error in Mongoose connection!! ❌: ', err);
  });
  mongoose.connection.on('disconnected', () => {
    console.log('Mongoose disconnected from MongoDB!! 🔌');
  });
};

module.exports = { dbconnection };
