var express     = require('express');
var cors        = require('cors');
var bodyParser  = require('body-parser');
var mongodb     = require('mongodb');
var request     = require('request');
var app         = express();

app.use(cors());
app.use(bodyParser.urlencoded({extended: true}));

app.get('/', function(request, response){
  response.json({"description": "My back end is up and running"})
})


app.post('/get', function(req, res){

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

})// end post fxn

PORT = process.env.PORT || 80;
app.listen(PORT, function(){
  console.log('listening to events on a "port".')
});
