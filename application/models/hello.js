const mongoose = require('mongoose');

const HelloSchema = mongoose.Schema(
  {
    name: {
        type: String, 
        required: true, 
        max: 100
    },
    cpf: {
        type: String, 
        required: true, 
        max: 11
    },
    date_of_visit: {
        type: Date,
        default: Date.now
    }
  }
);

module.exports = mongoose.model('Hello', HelloSchema);