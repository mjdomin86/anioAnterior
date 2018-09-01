'use strict';

/**
 * Module dependencies
 */
var mongoose = require('mongoose'),
  Schema = mongoose.Schema;

/**
 * Face Schema
 */
var feedbackSchema = new Schema({
  created: {
    type: Date,
    default: Date.now
  },
  comment:{
    type: String,
    default: ''
  },
  faceAttributes:{
    type: Object,
    default: ''
  }
});

mongoose.model('Feedback', feedbackSchema);

'use strict';
