require('dotenv').config()
const express = require('express')
const app = express()
const cors = require('cors')
const bodyParser = require("body-parser");
app.use(bodyParser.urlencoded({ extended: true }));
app.use(bodyParser.json());
app.use(cors());

var morgan = require('morgan');
const ErrorHandle = require('./utilities/ErrorHandle');
const UserModel = require('./models/UserModel');
const { CatchAsyncErrors } = require('./utilities/CatchAsyncErrors');
const LogsModel = require('./models/LogsModel');
const { ErrorHandler } = require('./middleware/ErrorHandler.js');
const { PathNotFound } = require('./middleware/PathNotFound.js');
const { dbConnect } = require('./database/connectDatabase.js');
app.use(morgan('dev'))
const path = require('path')



// app.use(CatchAsyncErrors(async (req, res, next) => {
//     if (!req.body.hasOwnProperty("email")) {
//         return next(new ErrorHandle("Email is needed", 401))
//     }
//     let { email } = req.body;
//     let activity = req.originalUrl.trim().split("/").at(-1)
//     const user = await UserModel.findOne({ email })
//     if (!user) {
//         return next(new ErrorHandle("User not found", 400))
//     }
//     let newActivity = {
//         activity,
//         user: user._id
//     }
//     await LogsModel.create(newActivity)
//     next()
// }))

//DEPLOYMENT
const __dirname1 = path.resolve();
if (process.env.ENVIRONMENT === "prod") {
    app.use(express.static(path.join(__dirname1, "ui/dist")));
    app.get("*", (req, res) => {
        res.sendFile(path.resolve(__dirname1, "ui", "dist", "index.html"))
    })
} else {
    app.get("/", (req, res) => {
        res.send({ message: "API is running successfully" })
    })
}
//DEPLOYMENT

app.use('/api/users', require('./routes/users.routes.js'))
app.use('/api/chats', require('./routes/chats.routes.js'))
app.use('/api/messages', require('./routes/messages.routes.js'))
app.use(PathNotFound)
app.use(ErrorHandler)
let port = process.env.PORT | 5000
const server = app.listen(port, async () => {
    await dbConnect()
    console.log(`App is running on ${port}`)
})

const io = require('socket.io')(server, {
    pingTimeout: 60000,
    cors: {
        origin: "*"
    },
})

io.on("connection", (socket) => {
    console.log("Socket connection: ON")
    socket.on("setup", (user_data) => {
        console.log("user_data._id ", user_data._id)
        socket.join(user_data._id);
        socket.emit("connected")
    })

    socket.on("join chat", (room) => {
        socket.join(room);
        console.log("user joined room ", room)
    })

    socket.on("typing", (room) => {
        console.log("start room", room)
        socket.in(room).emit("typing")
    })
    socket.on("stop typing", (room) => {
        console.log("stop room", room)
        socket.in(room).emit("stop typing")
    })

    socket.on("new message", (new_message_received) => {
        // console.log("new_message_received", new_message_received)
        var chat = new_message_received.chat;
        if (!chat.users) return console.log("chat.users not defined");

        chat.users.forEach((user) => {
            if (user._id === new_message_received.sender._id) return;
            socket.in(user._id).emit("message received", new_message_received)
        })
    })

    socket.off("setup", () => {
        console.log("Socket connection: OFF")
        socket.leave(user._id)
    })


})