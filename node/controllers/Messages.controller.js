const ChatModel = require("../models/ChatModel");
const MessageModel = require("../models/MessageModel");
const UserModel = require("../models/UserModel");
const { CatchAsyncErrors } = require("../utilities/CatchAsyncErrors");
const ErrorHandle = require("../utilities/ErrorHandle");

exports.sendMessage = CatchAsyncErrors(async (req, res, next) => {
    const { content, chat_id } = req.body;
    if (!chat_id || !content) {
        return next(new ErrorHandle("chat_id and content are mandatory", 400))
    }

    var newMessage = {
        sender: req.user._id,
        content: content,
        chat: chat_id
    }

    try {
        let message = await MessageModel.create(newMessage);

        message = await message.populate("sender", "name pic email")
        message = await message.populate("chat")
        message = await UserModel.populate(message, {
            path: "chat.users",
            select: "name pic email"
        })

        await ChatModel.findByIdAndUpdate(chat_id, { latestMessage: message });
        message = await MessageModel.populate(message, {
            path: "chat.latestMessage"
        })
        res.json(message)
    } catch (error) {
        return next(new ErrorHandle(error, 500))
    }
})


exports.allMessagesForChat = CatchAsyncErrors(async (req, res, next) => {
    try {
        const messages = await MessageModel.find({ chat: req.params.chat_id }).populate("sender", "name pic email").populate("chat")
        // .sort({ _id: -1 })
        res.json(messages)
    } catch (error) {
        return next(new ErrorHandle(error, 500))
    }
})