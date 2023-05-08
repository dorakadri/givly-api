const expressAsyncHandler = require("express-async-handler");
const Transaction = require("../../model/transaction/Transaction");
const validateMongodbId = require("../../utils/validateMongodbID");
const express = require("express");
const router = express.Router();
const Delivery= require("../../model/deliveries/Delivery");
const User = require("../../model/user/User");
const Post = require("../../model/post/Posts");
const giveGift = require("../gift/giftOwned");


//---Create--

const createTranCtrl = expressAsyncHandler(async (req, res) => {
    const {  id } = req.params;
   
  
    try {
      const transaction = await Transaction.create({
        owner:false, 
        taken:false,
        delivery :id,
      });
      res.json(transaction);
    } catch (error) {
      res.json(error);
    }
  });
  
  //--getall -------
  
  const fetchAllTranCtrl = expressAsyncHandler(async (req, res) => {
    try {
      const transaction = await Transaction.find({});
  
      res.json(transaction);
    } catch (error) {
      res.json(error);
    }
  });
  
  //---- Update-
  
    const updateTranCtrl = expressAsyncHandler(async (req, res) => {
   
    const { id } = req.params;
    validateMongodbId(id);
  
    try {
      const transaction = await Transaction.findByIdAndUpdate(
        id,
        {
          ...req.body,
        },
        {
          new: true,
        }
      );
      res.json(transaction);
    } catch (error) {
      res.json(error);
    }
  });
  
//update owner
  const findbydelivery= expressAsyncHandler(async(req,res)=>{

    try{
  
      const { Delivery} = req.body;

      const transactions = await Transaction.findOne({ delivery: Delivery });
   

if (transactions) {
  transactions.owner = true;
  await transactions.save();
}

res.json(transactions);
    }catch (error) {
          res.json(error);
        }
    
    });

    //update taker
    const updateTaker= expressAsyncHandler(async(req,res)=>{

      try{
       
      
        const taker = await User.findById(req.body.Taker)
        const owner = await User.findById(req.body.Owner)
         const transactions = await Transaction.findOne({ delivery: req.body.Delivery });

   const delivery=await Delivery.findById(req.body.Delivery)
  if(transactions.owner==true){
 
    transactions.taken=true
    await transactions.save()

  
      await Post.updateOne({_id:req.body.Post},{isTaken:true})
      
      if (!taker.Taken.includes(req.body.Post)) {
        
        taker.Taken.push(req.body.Post);
      }
      taker.Rankpoints = taker.Rankpoints+5; 
      owner.Rankpoints= owner.Rankpoints+10;
      taker.matches.productId.pull(req.body.Post);
      await taker.save();
      await owner.save();
      delivery.state = "Delivered"
      await delivery.save();
      giveGift(req.body.Taker);
      giveGift(req.body.Owner);

  }else if (transactions.owner==false) {
    transactions.taker = true
    transactions.save()
  }
  res.json(transactions)
  
      }catch (error) {
            res.json(error);
          }
      
      });

module.exports = {
    fetchAllTranCtrl,
    createTranCtrl,
    updateTranCtrl,
    findbydelivery,
    updateTaker,
    
  };