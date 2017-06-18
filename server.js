const express = require('express'),
    bodyParser = require('body-parser'),
    connection= require('./server/config/db'),
    expressSession= require('express-session'),
    path= require('path'),
    cors= require('cors'),
    apiRoutes = require('./server/routes/apiRoutes'),
    webRoutes= require('./server/routes/webRoutes');

const app = express();

//session
app.use(expressSession({
    secret: 'mytoken',
    saveUninitialized: true,
    resave: true
}));

app.use(bodyParser.json());
app.use(bodyParser.urlencoded({ extended: false }));

//CORS
app.use(cors())

//angular app
app.use(express.static(path.join(__dirname, './client')));
app.use(express.static(path.join(__dirname, './assets')));

app.use('/api', apiRoutes);
app.use('/', webRoutes);

const port = process.env.PORT || 1300;
app.listen(port, function () {
    console.log(`App listening on port ${port}`);
});