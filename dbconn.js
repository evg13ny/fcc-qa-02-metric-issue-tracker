const mongoose = require('mongoose');

const db = mongoose.connect(process.env.DB, { useNewUrlParser: true, useUnifiedTopology: true });
const connection = mongoose.connection;

connection.on('error', console.error.bind(console, 'Connection Error'));
connection.once('open', () => {
    console.log('Connected')
});

module.exports = db;