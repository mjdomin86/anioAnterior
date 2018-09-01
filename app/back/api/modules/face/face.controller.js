var mongoose = require('mongoose'),
    faceSchema = require('./face.model'),    
    Face = mongoose.model('Face'),
    request = require('request'),
    util = require('util');


exports.addAzurePersonAndMongoFace = function (req, res) {
    req.personGroupId = 2;
    existFaceInAzure(req, res, function(err){
        if(err){
            return res.status(500).send({ message: err.message });
        }else{
            personAzureRequest(req, res, function(err, personId){
                if(err){
                    return res.status(500).send({ message: err.message });
                }
                req.personId = personId;
                persistFaceAzureRequest(req, res, function(err, persistedFaceId){
                    if(err){
                        return res.status(500).send({ message: err.message });
                    }
                    console.log("persisted face id: " + persistedFaceId);
                    var face = new Face({ 
                        image: {
                            data : req.swagger.params.file.value.buffer,
                            contentType : req.swagger.params.file.value.mimetype
                        },
                        azurePersonId:req.personId,
                        azureFacePersonId: persistedFaceId
                    });
                    trainAzureRequest(req, res);
                    face.save(function(err, result) {
                        if (err) {
                            return res.status(500).send({ message: err.message });
                        }
                        return res.send({faceId:result._id});
                    });
                });
            });
        }
    });
}

exports.getAzureFaceId = function(req, res){
    detectAzureRequest(req, res, function(err, result){
        if(err){
            return res.status(500).send({ message: err.message });
        }
        return res.send({faceId:result.faceId});
    });
}

existFaceInAzure = function(req, res, next){
    detectAzureRequest(req, res, function(err, faceId){
        if(err){
            return res.status(500).send({ message: err.message });
        }
        req.body.faceId = faceId;
        exports.identifyAzureRequest(req, res, function(err, azurePersonId){
            if(azurePersonId){
              next(new Error('The face was already registered'));
            }else{
                next();
            }
        });  
    });
}

exports.verifyAzureRequest = function(req, res, next){
    if (!req.azzureId1 | !req.azzureId2) return next(new Error('Azure Face Id can not be null'));
    var endpoint = process.env.AZURE_VERIFY_URI + "?returnFaceId=true&returnFaceLandmarks=false";
    var options = {
        url: endpoint,
        headers : {
            'Content-Type': 'application/json',
            'Ocp-Apim-Subscription-Key': process.env.AZURE_SUBSCRIPTION_KEY
        },
        body: JSON.stringify({faceId1:req.azzureId1,faceId2:req.azzureId2})
    }
    console.log('Request to Azure with: ' + JSON.stringify(options));
    request.post(endpoint, options, function (error, response, body) {
        console.log('Response status code: ' + response.statusCode);
        console.log('Response error: ' + error);
        console.log('Response body: ' + body);
        if(!error && response.statusCode == 200){
            ('Azure response: ' + body);
            let b = JSON.parse(body);
            if(!b) return next(new Error('No faces are recognized'));
            ////console.log('Verify Azure response. Is identical?: ' + b.isIdentical);
            return next(null, b.isIdentical);
        }else{
            ////console.log('Verify Azure error: ' + error);
            return next(new Error('Verify Azure service error.'));
        }
    });
}

detectAzureRequest = function (req, res, next) {
    if (req.swagger.params.file.value == null) return next(new Error('File is null'));
    if (req.swagger.params.file.value.Length == 0) return next(new Error('File is empty'));
    var endpoint = process.env.AZURE_DETECT_URI + "?returnFaceId=true&returnFaceLandmarks=false";
    if(req.extraParams){
        endpoint = endpoint + '&' + req.extraParams;
    }
    var options = {
        headers : {
            'Content-Type': 'application/octet-stream',
            'Ocp-Apim-Subscription-Key': process.env.AZURE_SUBSCRIPTION_KEY
        },
        body : req.swagger.params.file.value.buffer
    }
    request.post(endpoint, options, function (error, response, body) {
        console.log('Response status code: ' + response.statusCode);
        console.log('Response error: ' + error);
        console.log('Response body: ' + body);
        if(!error && response.statusCode == 200){
            //console.log('Detect Azure service response: ' + body);
            let b = JSON.parse(body);
            if(!b || !b.length) return next(new Error('No face is recognized'));
            //console.log('Detect Azure service response face id: ' + b[0].faceId);
            return next(null, b[0]);
        }else{
            //console.log('Detect Azure service error: ' + error);
            return next(new Error('Detect Azure service error.'));
        }
    });
}

personAzureRequest = function (req, res, next) {
    if (!req.swagger.params.email) return next(new Error('Email is required'));
    var options = {
        url : util.format(process.env.AZURE_PERSON_URI, req.personGroupId),
        headers : {
            'Content-Type': 'application/json',
            'Ocp-Apim-Subscription-Key': process.env.AZURE_SUBSCRIPTION_KEY
        },
        body : JSON.stringify({
            name : req.swagger.params.email.value,
            userData : ''
        })
    }

    console.log('Request to Azure with: ' + JSON.stringify(options));
    request.post(options, function (error, response, body) {
        console.log('Response status code: ' + response.statusCode);
        console.log('Response error: ' + error);
        console.log('Response body: ' + body);
        if(!error && response.statusCode == 200){
            let b = JSON.parse(body);
            if(!b || !b.personId) return next(new Error('Person Azure service error. Person Id not found.'));
            console.log(b.personId);
            return next(null, b.personId);
        }else{
            console.log('Person Azure service error: ' + error);
            return next(new Error('Person Azure service error.'));
        }
    });
}

persistFaceAzureRequest = function (req, res, next) {
    let personGroupId = req.personGroupId;
    let personId = req.personId;
    if (req.swagger.params.file.value == null) return next(new Error('File is null'));
    if (req.swagger.params.file.value.Length == 0) return next(new Error('File is empty'));
    console.log(util.format(process.env.AZURE_PERSIST_FACE_URI, personGroupId, personId));
    var options = {
        url : util.format(process.env.AZURE_PERSIST_FACE_URI, personGroupId, personId),
        headers : {
            'Content-Type': 'application/octet-stream',
            'Ocp-Apim-Subscription-Key': process.env.AZURE_SUBSCRIPTION_KEY
        },
        body : req.swagger.params.file.value.buffer
    }
    request.post(options, function (error, response, body) {
        console.log('Response status code: ' + response.statusCode);
        console.log('Response error: ' + error);
        console.log('Response body: ' + body);
        if(!error && response.statusCode == 200){
            console.log('Persist Face Azure service response: ' + body);
            return next(null, JSON.parse(body).persistedFaceId);
        }else{
            console.log('Persist Face Azure service error: ' + error);
            return next(new Error('Persist Face Azure service error.'));
        }
    });
}

exports.identifyAzureRequest = function (req, res, next) {
    let faceId = req.body.faceId;
    let personGroupId = req.personGroupId;
    console.log(req.personGroupId);
    if (!faceId) return next(new Error('Azure Face Id can not be null'));
    var options = {
        url : process.env.AZURE_IDENTIFY_URI,
        headers : {
            'Content-Type': 'application/json',
            'Ocp-Apim-Subscription-Key': process.env.AZURE_SUBSCRIPTION_KEY
        },
        body : JSON.stringify({
            personGroupId:personGroupId,
            faceIds:[
                faceId
            ],
            maxNumOfCandidatesReturned:1,
            confidenceThreshold: 0.5
        })
    }
    console.log('Request to Azure with: ' + JSON.stringify(options));
    request.post(options, function (error, response, body) {
        console.log('Response status code: ' + response.statusCode);
        console.log('Response error: ' + error);
        console.log('Response body: ' + body);
        if(!error && response.statusCode == 200){
            console.log('Identify Azure service response: ' + body);
            let b = JSON.parse(body);
            if(!b || !b.length 
                || !b[0].candidates || !b[0].candidates.length 
                || !b[0].candidates[0].personId) return next(new Error('Face not recognited.'));
            console.log('Identify Azure service response person id: ' + b[0].candidates[0].personId);
            return next(null, b[0].candidates[0].personId);
        }else{
            console.log('Identify Azure service error: ' + error);
            return next(new Error('Identify Azure service error.'));
        }
    });
}

trainAzureRequest = function (req, res) {
    let personGroupId = req.personGroupId;
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
        console.log('Response error: ' + error);
        console.log('Response body: ' + body);
        if(!error && response.statusCode == 200){
            console.log('Train Azure service response: ' + body);
        }else{
            console.log('Train Azure service error: ' + error);
        }
    });
}

exports.faceAttributesAzureRequest = function(req, res, next){
    req.extraParams = 'returnFaceAttributes=age,gender,emotion';
    detectAzureRequest(req, res, function(err, result){
        next(err, result);
    });
}

