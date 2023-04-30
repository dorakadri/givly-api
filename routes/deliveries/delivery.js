const express = require("express");
const {
    createDeliveryCtrl,
    fetchAllDeliveryCtrl,
    deleteDeliveryCtrl,
    getByIdCtrl,
    updateuserlocationCtrl
   

} = require("../../controllers/deliveries/deliveryCtrl");


const deliveryRoutes = express.Router();

deliveryRoutes.post("/", createDeliveryCtrl);

deliveryRoutes.get("/:userId", fetchAllDeliveryCtrl);
deliveryRoutes.put("/updatelocation/:userId",    updateuserlocationCtrl);
deliveryRoutes.get("/delevery/:id",getByIdCtrl);
deliveryRoutes.delete("/:id",  deleteDeliveryCtrl);





module.exports = deliveryRoutes;