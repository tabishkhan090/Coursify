const jwt = require("jsonwebtoken");
const  { JWT_ADMIN_PASSWORD } = require("../config");

function adminMiddleware(req,res,next){
    const token = req.headers.token;
    try {
        const response = jwt.verify(token, JWT_ADMIN_PASSWORD);
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
    adminMiddleware
};