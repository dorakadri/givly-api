const express = require("express");
const {
    fetchAllTranCtrl,
    updateTranCtrl,
    createTranCtrl,
    findbydelivery,
    updateTaker,
} = require("../../controllers/transactions/transactionCtrl");


const transactionRoutes = express.Router();

transactionRoutes.post("/:id", createTranCtrl);

transactionRoutes.get("/", fetchAllTranCtrl);


transactionRoutes.put("/:id",  updateTranCtrl);

transactionRoutes.post("/update/owner", findbydelivery);

transactionRoutes.post("/taken/update", updateTaker);

module.exports = transactionRoutes;