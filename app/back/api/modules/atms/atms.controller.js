'use strict' 

var  request = require('request');

/*
 |--------------------------------------------------------------------------
 | Retrieve a list of atms in Spain
 |--------------------------------------------------------------------------
 */
exports.atms = function(req, res){

    var lat = req.swagger.params.latitude.value;
    var lng = req.swagger.params.longitude.value;
    var radius = req.swagger.params.radius.value;

    var atmsUrl = process.env.BBVA_API_URL + process.env.BBVA_API_ATM_PATH;

    //the user has all the active providers. I need the bbva provider
    //to get the token. If the bbva provider is not enable, return an error
    var bbvaProviderType = 'marketBBVAProviderStrategy';
    var providers = req.user.providers;
    var bbvaProvider;
    var token; 
     
    for(var i = 0; i< arr.length ; i++){
        if (arr[i].providerType === bbvaProviderType){ //found it
            bbvaProvider = arr[i];
        }
    } 

    if(!bbvaProvider){
       return res.status(500).send({message: 'The BBVA Provider is disabled for the user'});
    }

    token = bbvaProvider.accessToken;

    if(!token){
        return res.status(500).send({message: 'The user has not BBVA Provider access token'});   
    }
     
    var options = {
      url: atmsUrl,
      headers : {
          'Content-Type': 'application/json',
          'Accept': 'application/json',
          'Authorization': 'jwt ' + token
      },
      
      body: JSON.stringify({
        longitude: lng,
        latitude: lat,
               
      })
    }

    if(radius){
        options.body.radius = radius;
    }

    console.log('OPTIONS: ' + JSON.stringify(options));
    
    // Step 1. Exchange authorization code for access token.
    request.get(options, function(err, response) {
      console.log("response.statusCode: "+ response.statusCode);
      if (response.statusCode !== 200) {
        return next(new Error({ message: err.message }));
      }

      console.log('Response: ' + response);
      var json = JSON.parse(response);

      res.json(json);

    });


}