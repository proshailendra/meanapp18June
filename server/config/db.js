var mongoose = require('mongoose');

const connection = mongoose.connect('mongodb://heroku_5r5zdx33:p9ufa3ig6p5b20ef8s0jl76ij5@ds131512.mlab.com:31512/heroku_5r5zdx33');
module.exports = connection;
