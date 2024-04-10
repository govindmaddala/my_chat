const ChatModel = require("../models/ChatModel");
const UserModel = require("../models/UserModel");
const { CatchAsyncErrors } = require("../utilities/CatchAsyncErrors");
const { CreateAndSendToken } = require("../utilities/CreateAndSendToken");
const ErrorHandle = require("../utilities/ErrorHandle");

exports.accessChat = CatchAsyncErrors(async (req, res, next) => {
    let { userId } = req.body;

    if (!userId) {
        return next(new ErrorHandle("userId is mandatory", 400))
    }

    let chatFound = await ChatModel.find({
        isGroupChat: false,
        $and: [
            { users: { $elemMatch: { $eq: req.user._id } } },
            { users: { $elemMatch: { $eq: userId } } },
        ]
    }).populate("users", "-password").populate("latestMessage")


    chatFound = await UserModel.populate(chatFound, {
        path: "latestMessage.sender",
        select: "name pic email"
    })

    if (chatFound.length > 0) {
        return res.send({ fullChat: chatFound[0] })
    } else {
        var newChatData = {
            chatname: "sender",
            isGroupChat: false,
            users: [req.user._id, userId]
        }
        try {
            const newChat = await ChatModel.create(newChatData);
            const fullChat = await ChatModel.findOne({ _id: newChat._id }).populate("users", "-password")
            res.status(200).send({ fullChat })
        } catch (error) {
            return next(new ErrorHandle(error.message, 400))
        }
    }
})
exports.fetchChats = CatchAsyncErrors(async (req, res, next) => {

    await ChatModel.find({
        users: { $elemMatch: { $eq: req.user._id } }
    }).populate("users", "-password")
        .populate("latestMessage")
        .populate("groupAdmin", "-password")
        .sort({ updatedAt: -1 }).then(async (results) => {
            results = await UserModel.populate(results, {
                path: "latestMessage.sender",
                select: "name pic email"
            })
            res.json(results)
        }).catch((err) => {
            res.json(err);
        })
})
exports.createGroupChat = CatchAsyncErrors(async (req, res, next) => {
    if (!req.body.users || !req.body.group_name) {
        return next(new ErrorHandle("users and group_name are mandatory", 400))
    }

    let users = JSON.parse(req.body.users)

    users.push(req.user)

    if (users.length < 0) {
        return next(new ErrorHandle("More than 2 users are required to create a group", 400))
    }

    try {
        let groupChat = await ChatModel.create({
            isGroupChat: true,
            users: users,
            chatName: req.body.group_name,
            groupAdmin: req.user
        });

        const fullGroupChat = await ChatModel.findOne({ _id: groupChat._id })
            .populate("users", "-password")
            .populate("groupAdmin", "-password")
        return res.json(fullGroupChat);
    } catch (error) {
        return next(new ErrorHandle(error, 500))
    }



})
exports.renameGroupName = CatchAsyncErrors(async (req, res, next) => {
    const { chat_id, group_name } = req.body;
    try {
        const groupUpdated = await ChatModel.findByIdAndUpdate(chat_id,
            {
                chatName: group_name
            },
            {
                new: true
            }
        ).populate("users", "-password")
            .populate("groupAdmin", "-password")

        if (!groupUpdated) {
            return next(new ErrorHandle("Chat not found", 500))
        }

        return res.json(groupUpdated);
    } catch (error) {
        return next(new ErrorHandle(error, 500))
    }
})

exports.addToGroup = CatchAsyncErrors(async (req, res, next) => {
    const { chat_id, user_ids } = req.body;

    try {
        const added = await ChatModel.findByIdAndUpdate(chat_id,
            {
                $push: { users: { $in: JSON.parse(user_ids) } }
            },
            {
                new: true
            }
        ).populate("users", "-password")
            .populate("groupAdmin", "-password")

        if (!added) {
            return next(new ErrorHandle("Chat not found", 500))
        }

        return res.json(added);
    } catch (error) {
        return next(new ErrorHandle(error, 500))
    }

})


exports.removeFromGroup = CatchAsyncErrors(async (req, res, next) => {
    const { chat_id, user_ids } = req.body;

    try {
        let removed = await ChatModel.findByIdAndUpdate(chat_id,
            {
                $pull: { users: { $in: JSON.parse(user_ids) } }
            },
            {
                new: true
            }
        ).populate("users", "-password")
            .populate("groupAdmin", "-password")

        if (!removed) {
            return next(new ErrorHandle("Chat not found", 500))
        }

        if (removed && removed.isGroupChat && removed.users.length === 1) {
            removed = await ChatModel.findByIdAndDelete(chat_id)
        }

        return res.json(removed);
    } catch (error) {
        return next(new ErrorHandle(error, 500))
    }
})

exports.deleteGroup = CatchAsyncErrors(async (req, res, next) => {
    const { chat_id } = req.body;

    try {
        let removed = await ChatModel.findByIdAndDelete(chat_id)
        return res.json(removed);
    } catch (error) {
        return next(new ErrorHandle(error, 500))
    }
})

exports.updateGroupDetails = CatchAsyncErrors(async (req, res, next) => {
    const { chat_id, user_ids, group_name } = req.body;

    try {
        const added = await ChatModel.findByIdAndUpdate(chat_id,
            {
                users: JSON.parse(user_ids),
                chatName: group_name
            },
            {
                new: true
            }
        ).populate("users", "-password")
            .populate("groupAdmin", "-password")

        if (!added) {
            return next(new ErrorHandle("Chat not found", 500))
        }

        return res.json(added);
    } catch (error) {
        return next(new ErrorHandle(error, 500))
    }
})
