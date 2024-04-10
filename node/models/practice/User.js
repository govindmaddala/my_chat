const { default: mongoose } = require("mongoose");
const bcrypt = require('bcrypt')
const jwt = require('jsonwebtoken')
const userModel = new mongoose.Schema({
    username: {
        type: String,
        trim: true
    },
    password: {
        type: String,
        trim: true
    },
    email: {
        type: String,
        trim: true
    },
}, { timestamps: true })

userModel.methods.createToken = async function () {
    return jwt.sign({
        id: this._id
    },
        process.env.SECRET_MESSAGE,
        {
            expiresIn: "1d"
        }
    )
}

userModel.pre('save', async function (next) {
    if (!this.isModified('password')) {
        next()
    }

    const salt = await bcrypt.genSalt(10);
    this.password = await bcrypt.hash(this.password, salt);
})



module.exports = mongoose.model("User", userModel);