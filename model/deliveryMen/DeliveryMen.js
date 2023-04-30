const mongoose = require("mongoose");

//create schema
const DeliveryMenSchema = new mongoose.Schema(
  {
    firstName: {
      required: [true, "First name is required"],
      type: String,
    },
    phone: {
      required: [true, "phone is required"],
      type: Number,
    },
    isAvailable: {
      required: [true, "available is required"],
      type: Boolean,
    },

  })



const DeliveryMen = mongoose.model("DeliveryMen", DeliveryMenSchema);

module.exports = DeliveryMen;
