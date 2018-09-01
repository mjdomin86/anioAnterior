'use strict';

/**
 * Module dependencies
 */
var mongoose = require('mongoose'),
    bcrypt = require('bcryptjs');


/**
 * Provider Schema
 */
var providerSchema = new mongoose.Schema({
    providerType: String,                //MP, AWS other providers     
    providerUserId: String,             // user_id from provider
    accessToken: String,                // accessToken to invoke the Api after user validation
  });


  mongoose.model('Provider', providerSchema);
  
  'use strict';
  