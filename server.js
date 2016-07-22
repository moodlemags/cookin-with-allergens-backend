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
    // MongoClient.connect(mongoUrl, function (err, db) {
      var favoriteRecipes = db.collection('favorites');
      // if (err) {
      //   console.log('Unable to connect to the mongoDB server. ERROR:', err);
      // } else {
        // We are connected!
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
          // db.close(function() {
          //   console.log( "database closed");
            console.log(db.favorites.find());
          // }); //end closing mongo
      }); // end inserting recipe into mongo db
    // } // end else enforcing we're connected to mongo
  // }); // end establishing connection to mongo
}); // end post request to add new recipe



PORT = process.env.PORT || 80;
app.listen(PORT, function(){
  console.log('listening to events on a "port".')
});
