const jwt = require('jsonwebtoken')
const { CatchAsyncErrors } = require('../utilities/CatchAsyncErrors');
const UserModel = require('../models/UserModel');

exports.protect = CatchAsyncErrors(async (req, res, next) => {
    let token;
    if (req.headers.authorization && req.headers.authorization.startsWith("Bearer")) {
        try {
            token = req.headers.authorization.split(" ")[1]
            const decodedToken = jwt.verify(token, process.env.SECRET_MESSAGE)
            let user = await UserModel.findById(decodedToken.id).select("-password")
            req.user = user;
            next()
        } catch (error) {
            res.json({ message: error })
        }
    } else {
        res.json({ message: "No token found" })
    }
})