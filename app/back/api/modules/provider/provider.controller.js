'use strict';

/*
 'use strict' is not required but helpful for turning syntactical errors into true errors in the program flow
 https://developer.mozilla.org/en-US/docs/Web/JavaScript/Reference/Strict_mode
*/

const providerStrategies = require('./strategy/providerStrategies');

/*
 Modules make it possible to import JavaScript files into your application.  Modules are imported
 using 'require' statements that give you a reference to the module.

  It is a good idea to list the modules that your application depends on in the package.json in the project root
 */
var mongoose = require('mongoose'),
    userSchema = require('../user/user.model'),    
    User = mongoose.model('User'),
    request = require('request');
    

/*
 Once you 'require' a module you can reference the things that it exports.  These are defined in module.exports.

 For a controller in a127 (which this is) you should export the functions referenced in your Swagger document by name.

 Either:
  - The HTTP Verb of the corresponding operation (get, put, post, delete, etc)
  - Or the operationId associated with the operation in your Swagger document

  In the starter/skeleton project the 'get' operation on the '/hello' path has an operationId named 'hello'.  Here,
  we specify that in the exports of this module that 'hello' maps to the function named 'hello'
 */

/*
 |--------------------------------------------------------------------------
 | Retrieve Provider
 |--------------------------------------------------------------------------
 */
exports.provider = function(req, res) {
  
  var id = req.swagger.params.id.value;
  
  Provider.findOne({_id: id}, function(err, o) {
  
    if(err) res.status(500).send({ message: err.message });
    res.send(o);

  });
};

/*
 |--------------------------------------------------------------------------
 | Retrieve All Providers
 |--------------------------------------------------------------------------
 */
exports.providers = function (req, res) {
  Provider.find({}, function(err, o) {
    if(err) return res.status(500).send({ message: err.message });
    res.send(o);
  });      

};

/*
 |--------------------------------------------------------------------------
 | Retrieve User Providers
 |--------------------------------------------------------------------------
 */
exports.userProviders = function (req, res) {
  var criteria = {
    user: req.user._id
  }

  Provider.find(criteria, function(err, o) {
    if(err) res.status(500).send({ message: err.message });
    res.send(o);
  });
};

/*
 |--------------------------------------------------------------------------
 | Delete Provider
 |--------------------------------------------------------------------------
 */
exports.deleteProvider = function (req, res) {
  var id = req.swagger.params.id.value;
    Provider.findByIdAndRemove(id, function(err){
      if(err){
        console.log('Error deleting Provider');
        res.status(500).send({ message: err.message });
      }  
      console.log('Provider deleted');
      res.send({message: 'OK'});
    });

};
/*
 |--------------------------------------------------------------------------
 | Add Provider gateway
 |--------------------------------------------------------------------------
 */
exports.addProvider = function (req, res) {

  
  let providerStrategy = selectProviderStrategy(req.body.provider);
  
  providerStrategy.getToken(req.body.code,
    req.body.redirectURI,  function(err, result){
      if(err){
        return res.status(500).send({message: err.message});
      }
      //console.log(JSON.stringify("getToken result: "+ result));
      //console.log("result.access_token: "+JSON.parse(result).access_token);
      var user=req.user;
      var arr = user.providers;
    
      let provider = {
        //Step 1. commond propierties
        providerType  : req.body.provider,
        accessToken : JSON.parse(result).access_token,
        providerUserId : JSON.parse(result).user_id
      };
    
      
      console.log(JSON.stringify("user: "+ user));
      var found = false;
      for(var i = 0; i< arr.length ; i++){
        
        
        if(arr[i].providerType.toString().trim() === provider.providerType.toString().trim() ){
           //Lo encontre hago update
           console.log("antes: "+arr[i]);
           arr[i].accessToken = JSON.parse(result).access_token;
           arr[i].providerUserId = JSON.parse(result).user_id;
           console.log("despues: "+arr[i]);
           console.log("Arr: "+ arr);     
           found =  true;
           break;
        }

      };

      if (!found){
        //No lo encontre, agrego
        user.providers.push(provider);
      };
      console.log(arr);
      console.log("provider:"+provider);
      User.findOneAndUpdate({_id:user._id},user, function(err) {
        if(err){
          return res.status(500).send({message: err.message});
        }
        return res.send({message: 'OK'});   
      });
    });

};
  
/*
 |--------------------------------------------------------------------------
 | Provider Strategies
 |--------------------------------------------------------------------------
 */
exports.selectProviderStrategy = function (strategyCode) {
  let strategies = Object.keys(providerStrategies);
  let strategy="";
  console.log("strategies- strategy:"+ strategy);
  console.log("strategies.length:"+strategies.length);
  for (let i = 0; i < strategies.length; i++) {
    let strategy = providerStrategies[strategies[i]];
    if (strategy.useStrategy(strategyCode)) {
      console.log("return strategy:"+strategy);  
      return strategy;
    }
  }
}