const express = require('express');
const router = express.Router();

// declare axios for making http requests
const axios = require('axios');
const API = `https://api.spoonacular.com/recipes/findByIngredients`;



/* GET api listing. */
router.get('/', (req, res) => {
  res.send('api works');
});

router.get('/search', (req, res) => {
    axios.get(`${API}?ingredients=${req.query.query}&apiKey=`)
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
    var api = "https://api.spoonacular.com/recipes/" + req.query.recipeId + "/information?";

    axios.get(`${api}apiKey=68e80673452e49f4b1420a61f1590887`)
      .then(data => {
        console.log("GOOD");
    
        console.log(data)
          res.status(200).json(data.data);
      })
      .catch(error => {
        console.log(error);
        res.status(500).send("Broken.");
      });
  })

  router.get('/searchByMacros', (req, res) => {

    var api = "https://api.spoonacular.com/recipes/findByNutrients?random=true&";

    console.log(req);

    console.log("minProtein: " + req.query.minProtein);

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

    console.log("call: " + api);

    axios.get(`${api}apiKey=`)
      .then(data => {
        console.log("GOOD");
    
        console.log(data)
          res.status(200).json(data.data);
      })
      .catch(error => {
        console.log(error);
        res.status(500).send("Broken.");
      });
  });

module.exports = router;