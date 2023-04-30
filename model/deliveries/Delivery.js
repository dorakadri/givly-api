const mongoose = require("mongoose");
const Post =require("../post/Posts") ;
const User = require('../user/User');
const DeliveryMen = require('../deliveryMen/DeliveryMen');

//create schema
const DeliverySchema = new mongoose.Schema(
  {
  
    locationOwner: {
      required: [true, "location is required"],
      type: {
        latitude: { type: Number },
        longitude: { type: Number },
      },
    },
    locationUser: {
      required: [true, "location is required"],
      type: {
        latitude: { type: Number },
        longitude: { type: Number },
      },
    }, 
    state: {
        type: String,
        enum: ["New", "Transit", "Delivered"],
        required: true,
      },
      date: {
        
        type: Date,
        default: Date.now
      },
      dateLivraison:{
        type: Date,
      },
      

    post: {
      type: mongoose.Schema.Types.ObjectId,
      ref: "Post",
      
    },
    
    user: {
      type: mongoose.Schema.Types.ObjectId,
      ref: "User",
      
    },
    deliveryMen: {
      type: mongoose.Schema.Types.ObjectId,
      ref: "DeliveryMen",
      
    },

  })



const Delivery = mongoose.model("Delivery", DeliverySchema);

module.exports = Delivery;
