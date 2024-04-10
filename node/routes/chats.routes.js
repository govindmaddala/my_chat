const express = require('express');
const { accessChat, fetchChats, createGroupChat, renameGroupName, removeFromGroup, addToGroup, deleteGroup, updateGroupDetails } = require('../controllers/Chats.controller.js');
const { protect } = require('../middleware/authMiddleware');
const route = express.Router()

route.route("/accessChat").post(protect, accessChat)
route.route("/fetchChats").get(protect, fetchChats)
route.route("/createGroupChat").post(protect, createGroupChat)
route.route("/renameGroupName").put(protect, renameGroupName)
route.route("/addToGroup").put(protect, addToGroup)
route.route("/removeFromGroup").put(protect, removeFromGroup)
route.route("/deleteGroup").put(protect, deleteGroup)
route.route("/updateGroupDetails").put(protect, updateGroupDetails)

module.exports = route;