exports.CreateAndSendToken = async (user, statusCode, res) => {
    const token = await user.createToken();
    const options = {
        expires: new Date(Date.now() + process.env.TOKEN_EXPIRY_TIME * 24 * 60 * 60 * 100),
        httpOnly: true,
        secure: process.env.NODE_ENV === "PROD"
    }

    delete user.password;

    return res.status(statusCode).cookie('AUTH_TOKEN', token, options).json({
        message: token,
        username: user.name,
        email: user.email,
        pic: user.pic,
        _id: user._id
    })

}