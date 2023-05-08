const mongoose = require('mongoose');

const RecipeSchema = new mongoose.Schema({
  title: String,
  ingredients: [String],
  instructions: String,
  image: String,
  calories: Number,
});

const Recipe = mongoose.model('Recipe', RecipeSchema);

module.exports = Recipe;