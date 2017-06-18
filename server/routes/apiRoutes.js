const express = require('express');
const router = express.Router();

var jwt = require('jsonwebtoken');
// super secret for creating tokens
var superSecret = 'dotnettricks';
let user;
const appRoutes = {
    publicRoutes: ["/product", "/auth/login", "/auth/signup", '/order/paymentstatus'],
    userRoutes: [],
    adminRoutes: ['/category', '/category/create']
}
// route middleware to verify a token
router.use(function (req, res, next) {
    var url = req.url;
    console.log(url);
    if (appRoutes.publicRoutes.indexOf(url) >= 0) {
        next();
    } else {
        // check header or url parameters or post parameters for token
        //console.log(req);
        var token = req.headers['authorization'] || req.body.token || req.query.token;
        // console.log("token : ",token);
        // decode token
        if (token) {
            // verifies secret and checks exp
            jwt.verify(token, superSecret, function (err, decoded) {
                if (err) {
                    return res.json({
                        success: false,
                        message: 'Failed to authenticate token.'
                    });
                } else {
                    // save to request for use in other routes
                    user = req.decoded = decoded;
                    console.log(user);
                    if (user.roles.indexOf('Admin') >= 0 && appRoutes.adminRoutes.indexOf(url) >= 0) {
                        next(); // go to the next routes and don't stop here
                    }
                    else {
                        return res.status(403).send({
                            success: false,
                            message: 'you are not authorized.'
                        });
                    }
                }
            });
        } else {
            // if there is no token return an HTTP response
            // of 403 (access forbidden) and an error message
            return res.status(403).send({
                success: false,
                message: 'No token provided.'
            });
        }
    }
});

router.use("/category", require('../apis/category.api'));
router.use("/product", require('../apis/product.api'));
router.use("/file", require('../apis/file.api'));
router.use("/role", require('../apis/role.api'));
router.use("/auth", require('../apis/auth.api'));
router.use("/store", require('../apis/store.api'));

module.exports = router;
