const UserModel = require("../models/UserModel");
const { CatchAsyncErrors } = require("../utilities/CatchAsyncErrors");
const { CreateAndSendToken } = require("../utilities/CreateAndSendToken");
const ErrorHandle = require("../utilities/ErrorHandle");
const jwt = require('jsonwebtoken')

exports.register = CatchAsyncErrors(async (req, res, next) => {
    let { name, email, password, pic } = req.body
    if (!name || !email || !password) {
        return next(new ErrorHandle("name, email and password are mandatory", 400))
    }
    const user = await UserModel.findOne({ email })
    if (user) {
        return next(new ErrorHandle("User already exists", 400))
    }
    const newUser = await UserModel.create(req.body);
    req.user = newUser;
    CreateAndSendToken(newUser, 201, res)
    return
})

exports.login = CatchAsyncErrors(async (req, res, next) => {
    let { email, password } = req.body
    if (!email || !password) {
        return next(new ErrorHandle("email and password are mandatory", 400))
    }
    const user = await UserModel.findOne({ email })
    if (!user) {
        return next(new ErrorHandle("User not found", 400))
    }

    if (await user.comparePassword(password)) {
        req.user = user;
        CreateAndSendToken(user, 200, res)
        return
    } else {
        return next(new ErrorHandle("Email or password not matched", 400))
    }
})

exports.verifyWithToken = CatchAsyncErrors(async (req, res, next) => {
    let token;
    if (req.headers.authorization && req.headers.authorization.startsWith("Bearer")) {
        try {
            token = req.headers.authorization.split(" ")[1]
            const decodedToken = jwt.verify(token, process.env.SECRET_MESSAGE)
            let user = await UserModel.findById(decodedToken.id).select("-password")
            if (user) {
                res.send({ message: true })
            } else {
                res.send({ message: false })
            }
        } catch (error) {
            console.log("err", error)
            return next(new ErrorHandle(error, 400))
        }
    } else {
        return next(new ErrorHandle("No token found", 400))
    }
})

exports.logout = CatchAsyncErrors(async (req, res, next) => {
    let { email } = req.body
    if (!email) {
        return next(new ErrorHandle("email is mandatory", 400))
    }
    const user = await UserModel.findOne({ email })
    if (!user) {
        return next(new ErrorHandle("User not found", 400))
    }


    return res.status(200).cookie('AUTH_TOKEN', null, {
        expires: new Date(Date.now()),
        httpOnly: true,
    }).json({
        message: "Log out done"
    })
})

exports.allusers = CatchAsyncErrors(async (req, res, next) => {
    const keyword = req.query.search ? {
        $or: [
            { name: { $regex: req.query.search, $options: "i" } },
            { email: { $regex: req.query.search, $options: "i" } },
        ]
    } : {}

    const users = await UserModel.find(keyword).select("-password")
        .find({ _id: { $ne: req.user._id } })

    res.json({ users })
})