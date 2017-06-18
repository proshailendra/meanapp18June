var express = require('express'),
    httpStatusCode = require('http-status-codes');

var router = express.Router();

var mongoose = require('mongoose');

var user = require('../models/user');
var role = require('../models/role');

var jwt = require('jsonwebtoken');
// super secret for creating tokens
var superSecret = 'dotnettricks';

var user = require('../models/user');

router.post('/login', function (req, res) {
    user.findOne({ userName: req.body.userName, password: req.body.password })
        .select('_id fullName contactNo userName password roles')
        .populate('roles')
        .exec(function (err, user) {
            if (err) res.status(httpStatusCode.INTERNAL_SERVER_ERROR).send(err);

            if (user !== undefined && user !== null) {
                var roles = [];
                for (var i = 0; i < user.roles.length; i++) {
                    roles.push(user.roles[i].name);
                }
               
                // if user found then create a token
                var token = jwt.sign({
                    userName: user.userName,
                    password: user.password,
                    roles: roles
                }, superSecret, {
                        expiresIn: 1440 * 60 // expires in 24 hours
                    });
              //  console.log(token);    
                var authObj = {
                    userId: user._id,
                    userName: user.userName,
                    fullName: user.fullName,
                    contactNo: user.contactNo,
                    roles: roles,
                    token: token
                };
                // console.log(token);

                // return the information including token as JSON
                res.status(httpStatusCode.OK).send(authObj);
            } else {
                res.status(httpStatusCode.NOT_FOUND).send(authObj);
            }
        });
});

router.post('/signup', function (req, res) {
    var body = req.body;
    var obj = new user(body);

    role.findOne({ name: body.role }, function (err, res_role) {
        if (err) return res.send(err);

        obj.roles = [];
        var id = mongoose.Types.ObjectId(res_role._id);
        obj.roles.push(id);

        obj.save(function (err) {
            if (err) {
                // duplicate entry
                if (err.code === 11000)
                    return res.status(httpStatusCode.CONFLICT).send('This username is already exists.');
                return res.send(err);
            } else {
                var _id = mongoose.Types.ObjectId(obj._id);
                res_role.users.push(_id);
                res_role.save(function (err) {
                    if (err) res.status(httpStatusCode.INTERNAL_SERVER_ERROR);
                });
            }
            // return a message
            res.status(httpStatusCode.CREATED);
        });
    });
});

module.exports = router;