'use strict';

var mongoose = require('mongoose'),
    todoSchema = require('./todo.model'), 
    Todo = mongoose.model('Todo');

module.exports = {
  todos: todos,
  todo: todo,
  userTodos: userTodos, 
  deleteTodo: deleteTodo,
  addTodo: addTodo
};

function todo(req, res) {
  
  var id = req.swagger.params.id.value;
  
  Todo.findOne({_id: id}, function(err, o) {
  
    if(err) res.status(500).send({ message: err.message });
    res.send(o);

  });
}

function todos(req, res) {
  Todo.find({}, function(err, o) {
    if(err) return res.status(500).send({ message: err.message });
    res.send(o);
  });      

}

function userTodos(req, res) {
  var criteria = {
    user: req.user._id
  }

  Todo.find(criteria, function(err, o) {
    if(err) res.status(500).send({ message: err.message });
    res.send(o);
  });
}

function deleteTodo(req, res) {
  var id = req.swagger.params.id.value;
    Todo.findByIdAndRemove(id, function(err){
      if(err){
        //console.log('Error deleting todo');
        res.status(500).send({ message: err.message });
      }  
      //console.log('ToDo deleted');
      res.send({message: 'OK'});
    });

}

function addTodo(req, res) {
  var todo = new Todo({
    title: req.body.title,
    description  : req.body.description,
    user   : req.user
  });
  todo.save(function(err, obj) {
    if(err){
      //console.log('Error: ' + err);
      res.status(500).send({ message: err.message });
    } 
    res.send({message: 'OK'});
  });
}