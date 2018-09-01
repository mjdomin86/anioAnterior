'use strict';

var  request = require('request'),
      util = require('util');

//var MP = require ("mercadopago");
//var mp = new MP (process.env.MP_CLIENT_ID, process.env.MP_CLIENT_SECRET);


class MercadoPagoProviderStrategy {

getToken(code,redirectURI,next) {
    var accessTokenUrl = process.env.MP_ACCESS_TOKEN_URI;
    var options = {
      url: accessTokenUrl,
      headers : {
          'Content-Type': 'application/x-www-form-urlencoded'
      },
      body: JSON.stringify({
        code: code,
        client_secret: process.env.MP_CLIENT_SECRET,
        grant_type: 'client_credentials',
        client_id: process.env.MP_CLIENT_ID
      })
    }
    console.log(JSON.stringify(options));
    // Step 1. Exchange authorization code for access token.
    request.post(options, function(err, response, accessToken) {
      console.log("response.statusCode: "+ response.statusCode);
      if (response.statusCode !== 200) {
        return next(new Error({ message: err.message }));
      }
      console.log(accessToken.access_token);
      return next(null, accessToken);


    });
    
  }

 getBalance(userId,token,next){
  // Get Balance from gateway
  var apiUriBalance = util.format(process.env.MP_API_URI_BALANCE,userId);
  var params = {
    access_token: token
  };
  console.log("apiUriBalance: "+apiUriBalance );
  console.log("token:"+token);
  // Step 1. Exchange authorization code for access token.
  request.get({ url: apiUriBalance, qs: params, json: true }, function(err, response, balance) {
    console.log("response.statusCode: "+response.statusCode);
    if (response.statusCode !== 200) {
      return next(new Error({ message: err.message }));
    }
    
    return next(null, balance);


  });

}

  useStrategy(strategy) {
    return strategy === 'MP';
  }

  getDescription (){
    return 'Mercado Pago';
  }
}

let mercadoPagoProviderStrategy = new MercadoPagoProviderStrategy();
module.exports = mercadoPagoProviderStrategy;