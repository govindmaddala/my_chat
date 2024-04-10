const mongoose = require('mongoose')

const logsModel = new mongoose.Schema(
    {
        activity: {
            type: String,
            trim: true,
            required: true
        },
        user: {
            type: mongoose.Schema.Types.ObjectId,
            ref: "User"
        }
    },
    {
        timestamps: true
    }
)

module.exports = mongoose.model("logs", logsModel)