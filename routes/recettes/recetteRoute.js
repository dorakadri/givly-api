const express = require("express");

const{
    createRecette,
    getUserRecipes
 
}= require("../../controllers/recettes/recetteCtrl");


const recetteRoutes = express.Router();

recetteRoutes.post("/:id",createRecette);
recetteRoutes.get("/:id",getUserRecipes);


module.exports = recetteRoutes;