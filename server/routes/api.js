const express = require('express');
const router = express.Router();

// declare axios for making http requests
const axios = require('axios');
const API = `https://api.spoonacular.com/recipes/findByIngredients`;
const apiKey = process.env.RECIPE_KEY;



/* GET api listing. */
router.get('/', (req, res) => {
  res.send('api works');
});

router.get('/saveRecipe', (req, res) => {
  
});

router.get('/search', (req, res) => {
    axios.get(`${API}?ingredients=${req.query.query}&apiKey=${process.env.RECIPE_KEY}`)
      .then(data => {
        console.log("GOOD");
          res.status(200).json(data.data);
      })
      .catch(error => {
        console.log(error);
        res.status(500).send("Broken.");
      });
  });

  router.get('/recipe',  (req, res) => {
    var api = "https://api.spoonacular.com/recipes/" + req.query.recipeId + "/information?includeNutrition=true&";

    axios.get(`${api}apiKey=${process.env.RECIPE_KEY}`)
      .then(data => {
        console.log("GOOD");
    
       // console.log(data)
          res.status(200).json(data.data);
      })
      .catch(error => {
        console.log(error);
        res.status(500).send("Broken.");
      });
  })

  router.get('/savedRecipes',  (req, res) => {
    var api = "https://api.spoonacular.com/recipes/" + req.query.recipeId + "/information?includeNutrition=true&";

    axios.get(`${api}apiKey=${process.env.RECIPE_KEY}`)
      .then(data => {
        console.log("GOOD");
    
       // console.log(data)
          res.status(200).json(data.data);
      })
      .catch(error => {
        console.log(error);
        res.status(500).send("Broken.");
      });
  })

  router.get('/recipeInstructions',  (req, res) => {
    var api = "https://api.spoonacular.com/recipes/" + req.query.recipeId + "/analyzedInstructions?";

    axios.get(`${api}apiKey=${process.env.RECIPE_KEY}`)
      .then(data => {
        console.log("GOOD");
    
       // console.log(data)
          res.status(200).json(data.data);
      })
      .catch(error => {
        console.log(error);
        res.status(500).send("Broken.");
      });
  })

  router.get('/searchByMacros', (req, res) => {

    var api = "https://api.spoonacular.com/recipes/findByNutrients?random=true&";


    if (!(req.query.minCarbs == "undefined")) {
      api += "minCarbs=" + req.query.minCarbs + "&"
    }

    if (!(req.query.minFat == "undefined")) {
      api += "minFat=" + req.query.minFat + "&"
    }

    if (!(req.query.minProtein == "undefined")) {
      api += "minProtein=" + req.query.minProtein + "&"
    }

    if (!(req.query.maxCarbs == "undefined")) {
      console.log("in max carbs")
      api += "maxCarbs=" + req.query.maxCarbs + "&"
    }

    if (!(req.query.maxFat == "undefined")) {
      api += "maxFat=" + req.query.maxFat + "&"
    }

    if (!(req.query.maxProtein == "undefined")) {
      api += "maxProtein=" + req.query.maxProtein + "&"
    }

    if (!(req.query.minCalories == "undefined")) {
      api += "minCalories=" + req.query.minCalories + "&"
    }

    if (!(req.query.maxCalories == "undefined")) {
      api += "maxCalories=" + req.query.maxCalories + "&"
    }

    axios.get(`${api}apiKey=${apiKey}`)
      .then(data => {
        console.log("GOOD");
    
        //console.log(data)
          res.status(200).json(data.data);
      })
      .catch(error => {
        console.log("error");
        res.status(500).send("Broken.");
      });
  });

module.exports = router;