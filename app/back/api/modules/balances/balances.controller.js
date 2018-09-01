'use strict'

var request = require('request');
var providerController = require('../provider/provider.controller');

/*
 |--------------------------------------------------------------------------
 | Retrieve all balances of the logged user
 |--------------------------------------------------------------------------
 */
exports.balances = function (req, resp) {
    //buscar los providers del user
    let user = req.user;
    var arr = user.providers;
    var providerType;
    var balances=[];
  
    // recorer los providers
    for(var i = 0; i< arr.length ; i++){
      //Obtengo la estrategia del provider
      providerType= arr[i].providerType
      let providerStrategy = providerController.selectProviderStrategy(providerType);
      //ejecutar request de cada provider para obtener el balance
      providerStrategy.getBalance(arr[i].providerUserId, arr[i].accessToken,  function(err, result){
          if(err){
            return res.status(500).send({message: err.message});
          }
          var balance = {
            name: providerStrategy.getDescription(),
            total: result.total, 
            accounts: result.accounts
          };

          balances.push(balance);
          
        });
    }

    return resp.send(balances);       
  
  };