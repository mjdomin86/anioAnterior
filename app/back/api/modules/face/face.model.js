'use strict';

/**
 * Module dependencies
 */
var mongoose = require('mongoose'),
  Schema = mongoose.Schema,
  request = require('request'),
  util = require('util');

/**
 * Face Schema
 */
var faceSchema = new Schema({
  created: {
    type: Date,
    default: Date.now
  },
  azurePersonId:{
    type: String,
    default: ''
  },
  azureFacePersonId:{
    type: String,
    default: ''
  },
  image: {
    data: Buffer, 
    contentType: String 
  }
});

faceSchema.pre('remove', function(next) {
  console.log('Remove azure face :%s', this._id);
  let personGroupId = 2;
  let azureFacePersonId = this.azureFacePersonId;
  let azurePersonId = this.azurePersonId;

  var deleteFace = function(){
    var options = {
      url : util.format(process.env.AZURE_PERSIST_FACE_URI + '/%s' , personGroupId, azurePersonId, azureFacePersonId),
      headers : {
          'Content-Type': 'application/json',
          'Ocp-Apim-Subscription-Key': process.env.AZURE_SUBSCRIPTION_KEY
      }
    }
    console.log('Request to Azure with: ' + JSON.stringify(options));
    request.delete(options, function (error, response, body) {
        console.log('Response status code: ' + response.statusCode);
        var options = {
          url : util.format(process.env.AZURE_PERSON_URI + '/%s' , personGroupId, azurePersonId),
          headers : {
              'Content-Type': 'application/json',
              'Ocp-Apim-Subscription-Key': process.env.AZURE_SUBSCRIPTION_KEY
          }
        }
        console.log('Request to Azure with: ' + JSON.stringify(options));
        request.delete(options, function (error, response, body) {
            console.log('Response status code: ' + response.statusCode);
            var options = {
              url : util.format(process.env.AZURE_TRAIN_URI, personGroupId),
              headers : {
                  'Content-Type': 'application/json',
                  'Ocp-Apim-Subscription-Key': process.env.AZURE_SUBSCRIPTION_KEY
              }
          }
          console.log('Request to Azure with: ' + JSON.stringify(options));
          request.post(options, function (error, response, body) {
              console.log('Response status code: ' + response.statusCode);
          });
        });
    });
  }
  deleteFace();
  next();

});
faceSchema.post('remove', function(doc) {
  console.log('%s has been removed', doc._id);
});


mongoose.model('Face', faceSchema);

'use strict';
