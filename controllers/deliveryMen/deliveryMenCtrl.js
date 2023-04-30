const expressAsyncHandler = require("express-async-handler");
const DeliveryMen = require("../../model/deliveryMen/DeliveryMen");
const validateMongodbId = require("../../utils/validateMongodbID");
const express = require("express");
const router = express.Router();

const fetchById = expressAsyncHandler(async (req, res) => {
  const { id } = req.params;
  validateMongodbId(id);

  try {
    const deliveryMen = await DeliveryMen.findById(id);
    console.log(deliveryMen);
    if (deliveryMen) {
      res.json(deliveryMen);
    } else {
      res.status(404).json({ message: "Gift not found" });
    }
  } catch (error) {
    res.json(error);
  }
});
//---Create--

const createDeliveryMenCtrl = expressAsyncHandler(async (req, res) => {
  const { firstName, phone, isAvailable } = req.body;
  console.log(req.body);

  try {
    const deliveryMen = await DeliveryMen.create({
      firstName,
      phone,
      isAvailable,
    });
    res.json(deliveryMen);
  } catch (error) {
    res.json(error);
  }
});

//--getall -------

const fetchAllDeliveryMenCtrl = expressAsyncHandler(async (req, res) => {
  try {
    const deliveryMen = await DeliveryMen.find({});

    res.json(deliveryMen);
  } catch (error) {
    res.json(error);
  }
});

//---- Update deliveryMen--

const updateDeliveryMenCtrl = expressAsyncHandler(async (req, res) => {
  console.log(req.user);
  const { id } = req.params;
  validateMongodbId(id);

  try {
    const deliveryMen = await DeliveryMen.findByIdAndUpdate(
      id,
      {
        ...req.body,
      },
      {
        new: true,
      }
    );
    res.json(deliveryMen);
  } catch (error) {
    res.json(error);
  }
});

//--delete---

const deleteDeliveryMenCtrl = expressAsyncHandler(async (req, res) => {
  const { id } = req.params;
  validateMongodbId(id);
  try {
    const deliveryMen = await DeliveryMen.findOneAndDelete(id);
    res.json(deliveryMen);
  } catch (error) {
    res.json(error);
  }
});

module.exports = {
  createDeliveryMenCtrl,
  fetchAllDeliveryMenCtrl,
  deleteDeliveryMenCtrl,
  updateDeliveryMenCtrl,
  fetchById,
};
