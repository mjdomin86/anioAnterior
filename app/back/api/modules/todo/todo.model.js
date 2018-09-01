'use strict';

/**
 * Module dependencies
 */
var mongoose = require('mongoose'),
  Schema = mongoose.Schema;

/**
 * Todo Schema
 */
var TodoSchema = new Schema({
  created: {
    type: Date,
    default: Date.now
  },
  title:{
    type: String,
    default: ''
  },
  description: {
    type: String,
    default: ''
  },
  user: {
    type: Schema.ObjectId,
    ref: 'User'
  }
});

TodoSchema.pre('remove', function(next) {
  console.log('Remove face :%s', doc._id);
  next();
});

TodoSchema.post('remove', function(doc) {
  console.log('%s has been removed', doc._id);
});

mongoose.model('Todo', TodoSchema);

