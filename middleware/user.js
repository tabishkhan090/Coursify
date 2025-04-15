const jwt = require("jsonwebtoken");
const  { JWT_USER_PASSWORD } = require("../config");

function userMiddleware(req,res,next){
    const token = req.headers.token;
    try {
        const response = jwt.verify(token, JWT_USER_PASSWORD);
        if (!response || !response.id) {
            res.status(403).json({
                msg: "invalid user"
            });
            return;
        }
        req.userid = response.id;
        next();
    } catch (err) {
        res.status(403).json({
            msg: "invalid user"
        });
    }
}

module.exports = {
    userMiddleware
};