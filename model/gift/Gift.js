const mongoose = require("mongoose");

//create schema
const GiftSchema = new mongoose.Schema(
    {
       name: String,
        
          type: String,
         
          giftPhoto: {
            type: String,
            default:
                
              "https://cdn.pixabay.com/photo/2015/10/05/22/37/blank-profile-picture-973460_960_720.png",
          },
          company:  String,
          
          giftType: {
            type: String,
            enum: ["medium", "basic", "luxurious"],
            required: true
          },
         


    
    })










const Gift = mongoose.model("Gift", GiftSchema);

module.exports = Gift;