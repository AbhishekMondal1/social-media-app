const mongoose = require('mongoose');
const { MONGOURI } = require('../config/keys');

const dbconnection = () => {
  mongoose.connect(MONGOURI, {
    useNewUrlParser: true,
    useUnifiedTopology: true,
  });
  mongoose.connection.on('connected', () => {
    console.log('Mongoose CONNECTED!! 🚀');
  });
  mongoose.connection.on('error', (err) => {
    console.log('error in Mongoose connection!! ❌', err);
  });
};

module.exports = { dbconnection };
