'use strict';

var  request = require('request'),
      util = require('util');


class MarketBBVAProviderStrategy {

getToken(code,redirectURI,next) {
  var accessTokenUrl = process.env.BBVA_ACCESS_TOKEN_URI;
  var auth = 'Basic ' + new Buffer(process.env.BBVA_CLIENT_ID + ':' + process.env.BBVA_CLIENT_SECRET).toString('base64');
  var options = {
    url: util.format(accessTokenUrl,code,redirectURI),
    headers : {
        'Content-Type': 'application/json',
        'Authorization':auth
    },
  }
  console.log(JSON.stringify(options));
  // Step 1. Exchange authorization code for access token.
  request.post(options, function(err, response, accessToken) {
    console.log("response.statusCode: "+ response.statusCode);
    if (response.statusCode !== 200) {
      return next(new Error({ message: err.message }));
    }
    console.log(accessToken.access_token);
    //Otro requet GET a https://apis.bbva.com/accounts-sbx/v1/me/accounts
    //Headers
    //Content-Type: application/jsn
    //Authorization: jwt YOURTOKEN
    
    return next(null, accessToken);


  });
  
}

 getBalance(userId,token,next){
  // Get Balance from gateway
  console.log("Hay que definir esta estrategia de BBVA");
  var balance = {"user_id":9999,"total_amount":788,"available_balance":0,"unavailable_balance":0,"unavailable_balance_by_reason":[{"reason":"dispute","amount":0},{"reason":"fraud","amount":0},{"reason":"ml_debt","amount":0},{"reason":"time_period","amount":0},{"reason":"restriction","amount":0}],"currency_id":"ARS","available_balance_by_transaction_type":[{"amount":0,"transaction_type":"transfer"},{"amount":0,"transaction_type":"withdrawal"},{"amount":0,"transaction_type":"payment"},{"amount":0,"transaction_type":"label_purchase"}]};
  return next(null, balance);
 }


  useStrategy(strategy) {
    return strategy === 'BBVA';
  }

}

let marketBBVAProviderStrategy = new MarketBBVAProviderStrategy();
module.exports = marketBBVAProviderStrategy;