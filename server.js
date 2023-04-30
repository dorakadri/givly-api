require("dotenv").config();
const express = require("express");
const dotenv = require("dotenv");
dotenv.config();
const dbConnect = require("./config/db/dbConnect");
const userRoutes = require("./routes/users/usersRoute");
//chat 
const User = require("./model/user/User");
const Message = require("./model/Message/Message");
const rooms = ["general", "Call for Help", "Assistance", "Questions"];
//chat

const deliveryMensRoutes = require("./routes/deliveryMens/deliveryMensRoute");
const passport = require("passport");
const authRoute = require("./routes/auth");
const cookieSession = require("cookie-session");
const passportStrategy = require("./passport");
const giftsRoutes = require("./routes/gifts/giftsRoute");
const postRoutes=require("./routes/posts/postsRoute")
const diyRoutes=require("./routes/Objects/objectRoute")
const postForumRoute = require("./routes/postsForum/postForumRoute");
const commentRoutes = require("./routes/comments/commentRoute");
const AssoRoutes=require("./routes/Asso/AssoRoutes")
const { errorHandler, notFound } = require("./middlewares/error/errorHandler");
const cors = require("cors");
const deliveryRoutes = require("./routes/deliveries/delivery");

const app = express();
//DB





app.use(express.urlencoded({ extended: true }));
dbConnect();
app.use(
	cookieSession({
		name: "session",
		keys: ["cyberwolve"],
		maxAge: 24 * 60 * 60 * 100,
	})
);


app.use(passport.initialize());
app.use(passport.session());
app.use(
  cors({
    origin: "https://givly.onrender.com",
    methods: "GET,POST,PUT,DELETE",
    credentials: true,
  })
);


app.use("/auth", authRoute);
//Middleware
app.use(express.json());

//Users route
app.use("/api/users", userRoutes);
//PostForum route
app.use("/api/posts", postForumRoute);
//comment routes
app.use("/api/comments", commentRoutes);
//DeliveryMen route
app.use("/api/DeliveryMen", deliveryMensRoutes);
//Delivery route
app.use("/api/Delivery", deliveryRoutes);
//gift route
app.use("/api/gift", giftsRoutes);
app.use("/api/mainposts", postRoutes);
app.use("/api/diy", diyRoutes);//chat
app.use("/api/asso", AssoRoutes);
const server = require("http").createServer(app);
const io = require("socket.io")(server, {
  cors: {
    origin: "https://givly.onrender.com",
    methods: ["GET", "POST"],
  },
});

async function getLastMessagesFromRoom(room) {
  let roomMessages = await Message.aggregate([
    { $match: { to: room } },
    { $group: { _id: "$date", messagesByDate: { $push: "$$ROOT" } } },
  ]);
  return roomMessages;
}

function sortRoomMessagesByDate(messages) {
  return messages.sort(function (a, b) {
    let date1 = a._id.split("/");
    let date2 = b._id.split("/");

    date1 = date1[2] + date1[0] + date1[1];
    date2 = date2[2] + date2[0] + date2[1];

    return date1 < date2 ? -1 : 1;
  });
}

// socket connection

io.on("connection", (socket) => {
  socket.on("new-user", async (userid) => {
    const user = await User.findById(userid)
    if (!user) {
      socket.emit("error", { message: `User with id ${userid} not found` });
      return;
    }
    const userIds = user.matches.userId;
    const userIdsAsOwner = user.matchesAsOwner.userId;
    const allUserIds = [...userIds, ...userIdsAsOwner,userid];
    const uniqueUserIds = [...new Set(allUserIds)];
    const members = await User.find({ _id: { $in: uniqueUserIds } });
    console.log(userid);
    //const members = await User.find();
    socket.emit("new-user", members);
  });

  socket.on("match", async () => {
    console.log("Match event received on server!");
    io.emit("msg");
  });




  socket.on("join-room", async (newRoom, previousRoom) => {
    socket.join(newRoom);
    socket.leave(previousRoom);
    let roomMessages = await getLastMessagesFromRoom(newRoom);
    roomMessages = sortRoomMessagesByDate(roomMessages);
    socket.emit("room-messages", roomMessages);
  });

  socket.on("message-room", async (room, content, sender, time, date) => {
    const newMessage = await Message.create({
      content,
      from: sender,
      time,
      date,
      to: room,
    });
    let roomMessages = await getLastMessagesFromRoom(room);
    roomMessages = sortRoomMessagesByDate(roomMessages);
    // sending message to room
    io.to(room).emit("room-messages", roomMessages);
    socket.broadcast.emit("notifications", room);
  });
});

app.get("/rooms", (req, res) => {
  res.json(rooms);
});
//chat
//err handler
app.use(notFound);
app.use(errorHandler);



//server
const PORT = process.env.PORT || 5000;
server.listen(PORT, console.log(`Server is running ${PORT}`));
