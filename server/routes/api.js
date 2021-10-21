const express = require('express');
const router = express.Router();

// declare axios for making http requests
const axios = require('axios');
const API = `https://api.spoonacular.com/recipes/findByIngredients`;
const apiKey = process.env.RECIPE_KEY;

const nodemailer = require('nodemailer');
const GMAIL_USER = process.env.GMAIL_USER;
const GMAIL_PASS = process.env.GMAIL_PASS;
const BUSINESS_EMAIL = process.env.BUSINESS_EMAIL;

/* GET api listing. */
router.get('/', (req, res) => {
  res.send('api works');
});

router.get('/search', (req, res) => {
    axios.get(`${API}?ingredients=${req.query.query}&apiKey=${process.env.RECIPE_KEY}`)
      .then(data => {
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
    
       // console.log(data)
          res.status(200).json(data.data);
      })
      .catch(error => {
        console.log(error);
        res.status(500).send("Broken.");
      });
  })

  router.get('/savedRecipes',  (req, res) => {
    var api = "https://api.spoonacular.com/recipes/informationBulk?ids=" + req.query.recipeIds +  "&includeNutrition=true&";

    axios.get(`${api}apiKey=${process.env.RECIPE_KEY}`)
      .then(data => {
        
        

          res.status(200).json(data.data);
      })
      .catch(error => {
        console.log(error);
        res.status(500).send("Broken.");
      });
  })

  router.get('/nutritionWidget',  (req, res) => {
    var api = "https://api.spoonacular.com/recipes/" + req.query.recipeId + "/nutritionWidget?defaultCss=true&";

    axios.get(`${api}apiKey=${process.env.RECIPE_KEY}`)
      .then(data => {
    
       // console.log(data)
          res.status(200).json(data.data);
      })
      .catch(error => {
        console.log(error);
        res.status(500).send("Broken.");
      });
  })

  router.get('/priceWidget',  (req, res) => {
    var api = "https://api.spoonacular.com/recipes/" + req.query.recipeId + "/priceBreakdownWidget?defaultCss=true&";

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


  // POST route from contact form
router.get('/contact', (req, res) => {

  console.log(req);

  // Instantiate the SMTP server
  const smtpTrans = nodemailer.createTransport({
    host: 'smtp.gmail.com',
    port: 465,
    secure: true,
    auth: {
      user: GMAIL_USER,
      pass: GMAIL_PASS
    }
  });

  // Specify what the email will look like
  const mailOpts = {
    from: 'Your sender info here', // This is ignored by Gmail
    to: BUSINESS_EMAIL,
    subject: 'Macro Recipes Contact Form',
    text: `${req.query.name} (${req.query.email}) says: ${req.query.message}`
  }

  // Attempt to send the email
  smtpTrans.sendMail(mailOpts, (error, response) => {
    if (error) {
        console.log("ERROR: " + error);
        res.status(500).send("Broken.");
    }
    else {
        console.log(response);
        res.status(200).json(response);
    }
  })
});


  router.get('/searchByMacros', (req, res) => {

    //var api = "https://api.spoonacular.com/recipes/findByNutrients?random=true&";

    var api = "https://api.spoonacular.com/recipes/complexSearch?addRecipeNutrition=true&";

    var role = req.query.role;

    console.log(req.query.role);

    if (!(req.query.randomizeResults == "undefined")) {
      api += "sort=random" + "&"
    }

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

    if (!(req.query.minCholesterol == "undefined")) {
      api += "minCholesterol=" + req.query.minCholesterol + "&"
    }

    if (!(req.query.maxCholesterol == "undefined")) {
      api += "maxCholesterol=" + req.query.maxCholesterol + "&"
    }

    if (!(req.query.minSodium == "undefined")) {
      api += "minSodium=" + req.query.minSodium + "&"
    }

    if (!(req.query.maxSodium == "undefined")) {
      api += "maxSodium=" + req.query.maxSodium + "&"
    }

    if (!(req.query.minSugar == "undefined")) {
      api += "minSugar=" + req.query.minSugar + "&"
    }

    if (!(req.query.maxSugar == "undefined")) {
      api += "maxSugar=" + req.query.maxSugar + "&"
    }

    if (!(req.query.minFiber == "undefined")) {
      api += "minFiber=" + req.query.minFiber + "&"
    }

    if (!(req.query.maxFiber == "undefined")) {
      api += "maxFiber=" + req.query.maxFiber + "&"
    }

    if (!(req.query.queryString == "undefined")) {
      api += "query=" + req.query.queryString + "&"
    }

    if (role == "premium") {
      console.log("excluding and including")
      if (!(req.query.excludeIngredients == "undefined")) {
        api += "excludeIngredients=" + req.query.excludeIngredients + "&"
      }
  
      if (!(req.query.includeIngredients == "undefined")) {
        api += "includeIngredients=" + req.query.includeIngredients + "&"
      }
    }

    axios.get(`${api}apiKey=${apiKey}`)
      .then(data => {
    
        //console.log(data)
          res.status(200).json(data.data);
      })
      .catch(error => {
        console.log("error");
        res.status(500).send("Broken.");
      });
  });

module.exports = router;