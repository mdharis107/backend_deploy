const jwt = require('jsonwebtoken');
require("dotenv").config()

const authentication = (req, res, next) => {
    const token = req.headers?.authorization?.split(" ")[1];

    if (!token) {
        res.send("Please Login")
    }


    const decoded = jwt.verify(token, process.env.PRIVATE_KEY);
    const { user_id } = decoded
    // console.log(user_id,"this")
    if (decoded) {
        req.body.user_id = user_id
        next()
    }
    else{
        res.send("Please Login")
    }
}

module.exports = { authentication }