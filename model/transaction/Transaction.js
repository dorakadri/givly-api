const mongoose = require("mongoose");
const Delivery= require('../deliveries/Delivery');

//create schema
const TransactionSchema = new mongoose.Schema(
  {
    owner: {
      type: Boolean,
     
    },
    taken: {
      type: Boolean,
    },
    delivery: {
        type: mongoose.Schema.Types.ObjectId,
        ref: "Delivery",
        
      },

  })



const Transaction = mongoose.model("Transaction", TransactionSchema);

module.exports = Transaction;
