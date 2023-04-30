const express = require("express");
const{
    Diyfetching

}= require("../../controllers/diygeneration/diyCtrl");

const diyRoutes = express.Router();
diyRoutes.get("/:objectname",  Diyfetching);

module.exports = diyRoutes;