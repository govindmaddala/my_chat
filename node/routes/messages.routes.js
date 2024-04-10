const express = require('express');
const { protect } = require('../middleware/authMiddleware');
const { sendMessage, allMessagesForChat } = require('../controllers/Messages.controller');
const router = express.Router();

router.route("/sendMessage").post(protect, sendMessage)
router.route("/:chat_id").get(protect, allMessagesForChat)


module.exports = router;