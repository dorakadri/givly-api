const express = require("express");
const {
  createDeliveryMenCtrl,
  fetchAllDeliveryMenCtrl,
  updateDeliveryMenCtrl,
  deleteDeliveryMenCtrl,
  fetchById,

} = require("../../controllers/deliveryMen/deliveryMenCtrl");


const deliveryMensRoutes = express.Router();

deliveryMensRoutes.post("/DeliveryMen", createDeliveryMenCtrl);

deliveryMensRoutes.get("/DeliveryMen", fetchAllDeliveryMenCtrl);
deliveryMensRoutes.get("/:id", fetchById);

deliveryMensRoutes.delete("/:id",  deleteDeliveryMenCtrl);

deliveryMensRoutes.put("/:id",  updateDeliveryMenCtrl);

module.exports = deliveryMensRoutes;