const express = require("express");
const User = require('../../model/user/User');
const expressAsyncHandler = require("express-async-handler");
const Recipe = require("../../model/recettes/Recettes");

const createRecette = expressAsyncHandler(async (req, res) => {
    const { id } = req.params;
    try {
      const post = await Recipe.create({
        title:req?.body?.title,
        ingredients: req?.body?.ingredients,
        instructions: req?.body?.instructions,
        image: req?.body?.image,
        calories: req?.body?.calories,
      });
   await User.findByIdAndUpdate(id, { $push: {  recette: post._id } });
      res.json(post);
    } catch (error) {
      res.json(error);
    }
  });

  const getUserRecipes = expressAsyncHandler(async (req, res) => {
    const { id } = req.params;
    try {
      const recipes = await User.findById(id).populate('recette');
      res.json(recipes.recette);
    } catch (error) {
      res.json(error);
    }
  });
  

  module.exports = {
    createRecette,
    getUserRecipes
 

  };