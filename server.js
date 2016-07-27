var express     = require('express');
var cors        = require('cors');
var bodyParser  = require('body-parser');
var mongodb     = require('mongodb');
var request     = require('request');
var app         = express();

app.use(cors());
app.use(bodyParser.urlencoded({extended: true}));

//init mongo
var MongoClient = mongodb.MongoClient;
var mongoUrl = 'mongodb://heroku_2nv9nrvz:e6a82tjhm3ilo9688qargmq1ma@ds027215.mlab.com:27215/heroku_2nv9nrvz';

mongodb.MongoClient.connect(process.env.MONGODB_URI || mongoUrl, function (err, database) {
        if (err) {
          console.log(err);
          process.exit(1);
        }
  db = database;
  console.log("Database connection ready");
});

app.get('/', function(request, response){
  response.json({"description": "My back end is up and running"})
})

//get recipe
app.post('/getrecipe', function(req, res){

  var baseURL = 'http://api.yummly.com/v1/api/';
  var YUMMLY_USER = process.env.YUMMLY_USER;
  var YUMMLY_KEY = process.env.YUMMLY_KEY;
  console.log(YUMMLY_USER, YUMMLY_KEY);
  var urlDirect = 'q=' + req.body.querySelector;
  var allergenInfo = req.body.allergens;
  var fullURL = baseURL + 'recipes?' + '_app_id=' + YUMMLY_USER + '&_app_key=' + YUMMLY_KEY + '&' + urlDirect + allergenInfo;
  console.log('full URL : ', fullURL);

  request ({
    url: fullURL,
    method: 'GET',
    callback: function(error, response, body) {
      res.send(body)
    }
  });
})// end search for recipe fxn

//add favorite recipe
app.post('/favorites', function(request, response){
    console.log("request.body", request.body);
      var favoriteRecipes = db.collection('favorites');

        console.log('Connection established to', mongoUrl);
        console.log('Adding new recipe...');

        /* Insert */
        var newRecipe = request.body;
        favoriteRecipes.insert([newRecipe], function (err, result) {
          if (err) {
            console.log(err);
            response.json("error");
          } else {
            console.log('Inserted: ', newRecipe);
            console.log('Result:', result);
            response.json(result);
          }

      }); // end inserting recipe into mongo db
}); // end post request to add new recipe

//see all favorite recipes
app.get('/favorites', function(request, response){
    var favoriteRecipes = db.collection('favorites');
      favoriteRecipes.find().toArray(function (err, result) {
        if (err) {
          console.log("ERROR!", err);
          response.json("error");
        } else if (result.length) {
          console.log('Found:', result);
          response.json(result);
        } else { //
          console.log('No document(s) found with defined "find" criteria');
          response.json("none found");
        }

      }); // end
    });


//find favorite recipe
app.get('/favorites/:name', function(request, response){
  console.log("request.params: ", request.params);
  var favoriteRecipes = db.collection('favorites');
  favoriteRecipes.find(request.params).toArray(function (err, result) {
            if (err) {
              console.log("ERROR!", err);
              response.json("error");
            } else if (result.length) {
              console.log('Found:', result);
              response.json(result);
            } else { //
              console.log('Cannot locate stored recipe');
              response.json("none found");
            }

          }); // end find
        }); // end else

//delete favorite recipe
app.delete('/favorites/:name', function(request, response) {
  console.log("request.body:", request.body);
  console.log("request.params:", request.params);
  var favoriteRecipes = db.collection('favorites');
  favoriteRecipes.remove(request.params, function(err, removedRecipes) {
      console.log("Number of recipes removed:", removedRecipes);
          if(err) {
            console.log("error!", err);
          } else { // after deletion, retrieve list of all
      favoriteRecipes.find().toArray(function (err, result) {
          if (err) {
            console.log("ERROR!", err);
            response.json("error");
          } else if (result.length) {
            console.log('Found:', result);
            response.json(result);
          } else { //
            console.log('Cannot locate stored recipe');
            response.json("none found");
          }
      }); // end delete
      }; // end else

  }); // end search
}); // end delete

// update favorite recipe title
app.put('/favorites/:name', function(request, response) {
    console.log("request.body", request.body);
    console.log("request.params:", request.params);

    var favoriteRecipes = db.collection('favorites');
    var oldTitle = {name: request.body.name};
    var newTitle = {name: request.body.newName}

    favoriteRecipes.update(old,updateTo);
      setTimeout(function() {
        favoriteRecipes.find(updateTo).toArray(function (err, result) {
          if (err) {
            console.log("ERROR!", err);
            response.json("error");
          } else if (result.length) {
            console.log('Found:', result);
            response.json(result);
          } else { //
             console.log('Cannot locate stored recipe');
            response.json("none found");
          }
        }); // end find
    }, 1000);
}) // end update


PORT = process.env.PORT || 80;
app.listen(PORT, function(){
  console.log('listening to events on a "port".')
});
