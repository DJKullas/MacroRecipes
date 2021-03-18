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

module.exports = router;