var mongoose = require('mongoose'),
    userSchema = require('./user.model'),    
    User = mongoose.model('User'),
    faceSchema = require('../face/face.model'),    
    Face = mongoose.model('Face'),
    jwt = require('jwt-simple');
    moment = require('moment'),
    request = require('request'),
    faceController = require('../face/face.controller');
  

/*
 |--------------------------------------------------------------------------
 | Login Required Middleware
 |--------------------------------------------------------------------------
 */
exports.ensureAuthenticated = function(req, res, next) {
    const error = new Error();
    if (!req.header('authorization')) {
      error.message = 'Please make sure your request has an Authorization header';
      error.status = error.statusCode = 401;
      throw error;
    }
    var token = req.header('Authorization').split(' ')[1];
    var payload = null;
    try {
      payload = jwt.decode(token, process.env.TOKEN_SECRET);
    }
    catch (err) {
      error.message = err.message;
      error.status = error.statusCode = 401;
      throw error;
    }
  
    if (payload.exp <= moment().unix()) {
      error.message = 'Token has expired';
      error.status = error.statusCode = 401;
      throw error;
    }
    User.findOne({'_id': payload.sub}, function(err, user) {
      if(err) {
        error.message = err;
        error.status = error.statusCode = 500;
        throw error;
      }
      if(!user) {
        error.message = 'No user found for the token';
        error.status = error.statusCode = 401;
        throw error;
      }
      //console.log('Session User: ' + JSON.stringify(user));
      req.user = user;
      return next();
    });
}

/*
 |--------------------------------------------------------------------------
 | Generate JSON Web Token
 |--------------------------------------------------------------------------
 */
function createJWT(user) {
    var payload = {
      sub: user._id,
      iat: moment().unix(),
      exp: moment().add(14, 'days').unix()
    };
    return jwt.encode(payload, process.env.TOKEN_SECRET);
}

/*
 |--------------------------------------------------------------------------
 | GET /api/profile
 |--------------------------------------------------------------------------
 */
exports.get = function (req, res) {
  User.findById(req.user, function(err, user) {
    res.send(user);
  });
};

/*
 |--------------------------------------------------------------------------
 | PUT /api/me
 |--------------------------------------------------------------------------
 */
exports.put = function(req, res) {
  User.findById(req.body, function(err, user) {
    if (!user) {
      return res.status(400).send({ message: 'User not found' });
    }
    user.displayName = req.body.displayName || user.displayName;
    user.email = req.body.email || user.email;
    if(req.body.password){
      user.password = req.body.password;
    }
    user.save(function(err) {
      if (err) {
        res.status(500).send({ message: err.message });
      }
      res.send({message: "OK"});
    });
  });
};

/*
 |--------------------------------------------------------------------------
 | Log in with Email
 |--------------------------------------------------------------------------
 */
exports.login = function(req, res) {
  User.findOne({ email: req.body.email }, '+password', function(err, user) {
    if (!user) {
      return res.status(401).send({ message: 'Invalid email and/or password' });
    }
    user.comparePassword(req.body.password, function(err, isMatch) {
      if (!isMatch) {
        return res.status(401).send({ message: 'Invalid email and/or password' });
      }
      res.send({ token: createJWT(user) });
    });
  });
};

/*
 |--------------------------------------------------------------------------
 | Log in with Face
 |--------------------------------------------------------------------------
 */
exports.facelogin = function(req, res) {
    req.personGroupId = 2;
    faceController.identifyAzureRequest(req, res, function(err, azurePersonId){
      if(err){
        return res.status(500).send({ message: err.message });
      }  
      Face.findOne({ azurePersonId: azurePersonId }).exec(function(err, face) {
        if (!face) {
          return res.status(401).send({ message: 'Invalid face. Not found any user.' });
        }
        User.findOne({ face: face }, '+password', function(err, user) {
          if (!user) {
            return res.status(401).send({ message: 'Invalid face. Not found any user.' });
          }
          user.comparePassword(req.body.password, function(err, isMatch) {
            if (!isMatch) {
              return res.status(401).send({ message: 'Invalid face and/or password' });
            }
            res.send({ token: createJWT(user) });
          });
        });
      });
    });
};

/*
 |--------------------------------------------------------------------------
 | Create Email and Password Account
 |--------------------------------------------------------------------------
 */
exports.signup = function(req, res) {
  User.findOne({ email: req.body.email }, function(err, existingUser) {
    if (existingUser) {
      return res.status(409).send({ message: 'Email is already taken' });
    }
    let face = null;
    if(req.body.faceId){
      face = {_id: req.body.faceId};
    }
    var user = new User({
      displayName: req.body.displayName,
      email: req.body.email,
      password: req.body.password,
      face: face
    });
    user.save(function(err, result) {
      if (err) {
        res.status(500).send({ message: err.message });
      }
      res.send({ token: createJWT(result) });
    });
  });
};

/*
 |--------------------------------------------------------------------------
 | Login with Google
 |--------------------------------------------------------------------------
 */
exports.google = function (req, res) {
    var accessTokenUrl = 'https://www.googleapis.com/oauth2/v4/token';
    var peopleApiUrl = 'https://www.googleapis.com/oauth2/v2/userinfo?fields=email%2Cfamily_name%2Cgender%2Cgiven_name%2Chd%2Cid%2Clink%2Clocale%2Cname%2Cpicture%2Cverified_email';
    var params = {
      code: req.body.code,
      client_id: req.body.clientId,
      client_secret: process.env.GOOGLE_SECRET,
      redirect_uri: req.body.redirectUri,
      grant_type: 'authorization_code'
    };
     var token_request='code='+req.body.code+
          '&client_id='+req.body.clientId+
          '&client_secret='+process.env.GOOGLE_SECRET+
          '&redirect_uri='+req.body.redirectUri+
          '&grant_type=authorization_code';
      var request_length = token_request.length;
    // Step 1. Exchange authorization code for access token.
    request.post(accessTokenUrl, { body: token_request, headers: {'Content-type':'application/x-www-form-urlencoded'} }, function(err, response, token) {
      var accessToken = JSON.parse(token).access_token;
      var headers = { Authorization: 'Bearer ' + accessToken };
  
      // Step 2. Retrieve profile information about the current user.
      request.get({ url: peopleApiUrl, headers: headers, json: true }, function(err, response, profile) {
        if (profile.error) {
          return res.status(500).send({message: profile.error.message});
        }
  
        User.findOne({ email: profile.email }, function(err, existingUser) {
            if (existingUser && existingUser.provider == "google") {
              var token = createJWT(existingUser);
              res.send({ token: token }); 
            }
            else if (existingUser && existingUser.provider != "google") {
              var user = {};
                user.provider_id = profile.id;
                user.provider = "google";
                user.email = profile.email;
                user.picture = profile.picture.replace('sz=50', 'sz=200');
                user.displayName = profile.name;
                User.findOneAndUpdate({email:existingUser.email},user, function(err) {
                  var token = createJWT(existingUser);
                  res.send({ token: token });
                });
            }
            else{
                var user = new User();
                user.provider_id = profile.id;
                user.provider = "google";
                user.email = profile.email;
                user.picture = profile.picture.replace('sz=50', 'sz=200');
                user.displayName = profile.name;
                user.save(function(err) {
                  var token = createJWT(user);
                  res.send({ token: token });
                });
            }
          });
      });
    });
};

/*
 |--------------------------------------------------------------------------
 | Login with Facebook
 |--------------------------------------------------------------------------
 */
exports.facebook = function (req, res) {
    var fields = ['id', 'email', 'first_name', 'last_name', 'link', 'name','picture.type(large)'];
    var accessTokenUrl = 'https://graph.facebook.com/v2.5/oauth/access_token';
    var graphApiUrl = 'https://graph.facebook.com/v2.5/me?fields=' + fields.join(',');
    var params = {
      code: req.body.code,
      client_id: req.body.clientId,
      client_secret: process.env.FACEBOOK_SECRET,
      redirect_uri: req.body.redirectUri
    };
  
    // Step 1. Exchange authorization code for access token.
    request.get({ url: accessTokenUrl, qs: params, json: true }, function(err, response, accessToken) {
      
         
      if (response.statusCode !== 200) {
        return res.status(500).send({ message: accessToken.error.message });
      }
  
      // Step 2. Retrieve profile information about the current user.
      request.get({ url: graphApiUrl, qs: accessToken, json: true }, function(err, response, profile) {
        
        
        if (response.statusCode !== 200) {
          return res.status(500).send({ message: profile.error.message });
        }
  
       
        User.findOne({ email: profile.email }, function(err, existingUser) {
                  
            if (existingUser && existingUser.provider == "facebook") {
                
                var token = createJWT(existingUser);
                res.send({ token: token }); 
                }
            else if (existingUser && existingUser.provider != "facebook") {
                
                var user = {};
                user.provider_id = profile.id;
                user.provider = "facebook";
                user.email = profile.email;
                user.picture = profile.picture.data.url;
                user.displayName = profile.name;
                User.findOneAndUpdate({email:existingUser.email},user, function(err) {
                var token = createJWT(existingUser);
                res.send({ token: token });
                });
            }
            else{
                var user = new User();
                user.provider_id = profile.id;
                user.provider = "facebook";
                user.email = profile.email;
                user.picture = profile.picture.data.url;
                user.displayName = profile.name;
                user.save(function(err) {
                    var token = createJWT(user);
                    res.send({ token: token });
                });
                }
            });
        });
    });
};

/*
 |--------------------------------------------------------------------------
 | GET /api/getAll
 |--------------------------------------------------------------------------
 */
exports.getAll = function (req, res) {
  User.find({}, function(err, users) {
    res.send(users);
  });
};

/*
 |--------------------------------------------------------------------------
 | GET /api/delete -- Delete user with cascade (user, todos, face and azure person)
 |--------------------------------------------------------------------------
 */
exports.delete = function(req, res) {
  User.findOne({ _id: req.swagger.params.id.value }, function(err, user){
    if(err){
      return res.status(500).send({ message: err.message });
    }
    user.remove(function(err){
      if(err){
        return res.status(500).send({ message: err.message });
      }
      return res.send({message: 'OK'});
    });  
    
  });
};

/*
 |--------------------------------------------------------------------------
 | GET /api/update -- Update user roles
 |--------------------------------------------------------------------------
 */
exports.putUserRoles = function(req, res) {
  User.findById(req.body, function(err, user) {
    if (!user) {
      return res.status(400).send({ message: 'User not found' });
    }
    user.roles = req.body.roles || user.roles;
   user.save(function(err) {
      if (err) {
        res.status(500).send({ message: err.message });
      }
      res.send({message: "OK"});
    });
  });
};