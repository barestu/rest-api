const models = require('../models');
const bcrypt = require('bcrypt');
const jwt = require('jsonwebtoken');
const saltRounds = 10;

module.exports = {
  signUp: function (req, res) {
    bcrypt.genSalt(saltRounds, function(err, salt) {
      bcrypt.hash(req.body.password, salt, function(err, hash) {
        // Store hash in your password DB.
        models.User.create({
          username: req.body.username,
          password: hash,
          role: req.body.role 
        })
        .then(userData => {
          res.status(201).send({
            messages: 'Create user success',
            data: userData
          });
        })
        .catch(err => {
          res.status(400).send({
            messages: 'Create user failed',
            detail: err.messages
          });
        })
      })
    })   
  },

  signIn: function (req, res) {
    let plainPassword = req.body.password;

    models.User.findOne({
      where: { 
        username: req.body.username
      }  
    })
    .then(userData => {
      console.log('LOG', userData);
      
      bcrypt.compare(plainPassword, userData.password, function(err, found) {
        if (found) {
          let token = jwt.sign({
            username: userData.username,
            role: userData.role
          }, 'shhhhh')

          res.status(200).send({
            messages: 'User found',
            data: token
          })
        }
      })
    })
    .catch(err => {
      res.status(400).send({
        messages: 'User not found',
        detail: err.messages
      })
    })
  },

  getAllUsers: function (req, res) {
    models.User.findAll()
    .then(userData => {
      res.status(200).send({
        messages: 'User(s) found',
        data: userData
      })
    })
    .catch(err => {
      res.status(400).send({
        messages: 'User not found',
        detail: err.messages
      })
    })
  },

  getUserById: function (req, res) {
    models.User.findById(req.params.id)
    .then(userData => {
      res.status(200).send({
        messages: 'User found',
        data: userData
      })
    })
    .catch(err => {
      res.status(400).send({
        messages: 'User not found',
        detail: err.messages
      })
    })
  },

  updateUser: function (req, res) {
    let newData = {
      id : req.params.id,
      username : req.body.username,
    }

    models.User.update(newData, {
      where: { id: newData.id }
    })
    .then(success => {
      res.status(201).json({
        messages: 'Update data user success',
        data: newData
      })
    })
    .catch(err => {
      res.status(400).json({
        messages: 'Update data user failed',
        detail: err.messages
      })
    })
  },

  deleteUser: function (req, res) {
    models.User.destroy({
      where: { id: req.params.id }
    })
    .then(success => {
      res.status(200).send({
        messages: 'Delete user success',
        data: success
      })
    })
    .catch(err => {
      res.status(400).send({
        messages: 'Delete user failed, data not found',
        detail: err.messages
      })
    })
  }
}