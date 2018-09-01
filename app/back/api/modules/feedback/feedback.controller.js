var mongoose = require('mongoose'),
    faceController = require('../face/face.controller'),
    faceSchema = require('./feedback.model'),    
    Feedback = mongoose.model('Feedback'),
    request = require('request'),
    util = require('util');


exports.feedback = function(req, res){
    console.log('entro');
    faceController.faceAttributesAzureRequest(req, res, function(err, result){
        if (err) {
            return res.status(500).send({ message: err.message });
        }
        console.log(JSON.stringify(result));
        
        var feedback = new Feedback({
            comment : req.swagger.params.comment ? req.swagger.params.comment.value : '',
            faceAttributes: result.faceAttributes
        });


        feedback.save(feedback, function(err){
            if (err) {
                return res.status(500).send({ message: err.message });
            }
            console.log(JSON.stringify(feedback));

            
            res.send({message:''  + (feedback.faceAttributes.emotion.happiness*10)});
        });
    });
}

