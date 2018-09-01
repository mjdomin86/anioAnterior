'use strict';

/**
 * Module dependencies
 */
var mongoose = require('mongoose'),
    Schema = mongoose.Schema,
    bcrypt = require('bcryptjs'),
    faceSchema = require('../face/face.model'),  
    Face = mongoose.model('Face'),
    todoSchema = require('../todo/todo.model'),  
    Todo = mongoose.model('Todo');


/**
 * User Schema
 */
var userSchema = new mongoose.Schema({
    email: { 
        type: String, 
        lowercase: true 
    },
    password: { 
        type: String, 
        select: false 
    },
    displayName: String,
    picture: String,
    provider: String,
    provider_id: String,
    face: {
      type: Schema.ObjectId,
      ref: 'Face'
    },
    roles: {
      type: [{
        type: String,
        enum: ['user', 'admin']
      }],
      default: ['user']
    }
  });

  userSchema.pre('save', function(next) {
    var user = this;
    if(!user.picture){
      user.picture = '/assets/images/flat-avatar.png';
    }
    if (!user.isModified('password')) {
      return next();
    }
    bcrypt.genSalt(10, function(err, salt) {
      bcrypt.hash(user.password, salt, function(err, hash) {
        user.password = hash;
        next();
      });
    });
  });

  userSchema.pre('remove', function(next) {
    console.log(JSON.stringify(this));
    this.model('Todo').remove({ user: this._id });
    Todo.remove({user: this._id}).exec();
    if(this.face){
      Face.findOne({ _id: this.face }, function(err, face){
        if(err){
          return next(err);
        }
        face.remove(function(err){
          if(err){
            return next(err);
          }
        });  
      });
    }
    next();
  });

  userSchema.post('remove', function(doc) {
    console.log('%s has been removed', doc._id);
  });
  
  userSchema.methods.comparePassword = function(password, done) {
    bcrypt.compare(password, this.password, function(err, isMatch) {
      done(err, isMatch);
    });
  };

  mongoose.model('User', userSchema);
  
  'use strict';
  