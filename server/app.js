import express from "express";
import { connectDB } from "./utils/features.js";
import dotenv from "dotenv";
import { errorMiddleware } from "./middleware/error.js";
import cookieParser from "cookie-parser";
import { Server } from "socket.io";
import { createServer } from "http";
import { v4 as uuid } from "uuid";
import cors from "cors";
import { v2 as cloudinary } from "cloudinary";

import userRoutes from "./routes/user.routes.js";
import chatRoutes from "./routes/chat.routes.js";
import adminRoutes from "./routes/admin.routes.js";

import { createUser } from "./seeders/user.js";
import {
  createGroupChats,
  createMessagesInAChat,
  createSingleChats,
} from "./seeders/chat.js";
import { CHAT_JOINED, CHAT_LEAVED, NEW_MESSAGE, NEW_MESSAGE_ALERT, ONLINE_USERS, START_TYPING, STOP_TYPING } from "./constants/events.js";
import { getSockets } from "./lib/helper.js";
import { Message } from "./models/message.model.js";
import { corsOptions } from "./constants/config.js";
import { socketAuthenticator } from "./middleware/auth.js";

dotenv.config({
  path: "./.env",
});

const mongoUri = process.env.MONGO_URI;
const port = process.env.PORT || 3000;
const envMode = process.env.NODE_ENV.trim() || "PRODUCTION";
const adminSecretKey = process.env.ADMIN_SECRET_KEY || "nikunj-khakhkhar";

const userSocketIDs = new Map();
const onlineUsers = new Set();

connectDB(mongoUri);

cloudinary.config({
  cloud_name: process.env.CLOUDINARY_CLOUD_NAME,
  api_key: process.env.CLOUDINARY_API_KEY,
  api_secret: process.env.CLOUDINARY_API_SECRET,
});

// createUser(10);
// createSingleChats(10);
// createGroupChats(10);
// createMessagesInAChat('6687fe20127098de8fcdabe4', 50);

const app = express();
const server = createServer(app);
const io = new Server(server, {
  cors: corsOptions,
});

// saving instance of io so that we can use in other files of server
app.set("io", io);

// Using middlewares here
app.use(express.json());
app.use(cookieParser());
app.use(cors(corsOptions));
// app.use(express.urlencoded());

app.use("/api/v1/user", userRoutes);
app.use("/api/v1/chat", chatRoutes);
app.use("/api/v1/admin", adminRoutes);

app.get("/", (req, res) => {
  res.send("Hello World");
});

io.use((socket, next) => {
  cookieParser()(socket.request, socket.request.res, async (error) => {
    await socketAuthenticator(error, socket, next);
  });
});

io.on("connection", (socket) => {
  const user = socket.user;
  userSocketIDs.set(user._id.toString(), socket.id);

  // console.log(userSocketIDs);

  socket.on(NEW_MESSAGE, async ({ chatId, members, message }) => {
    const messageForRealTime = {
      content: message,
      _id: uuid(),
      sender: {
        _id: user._id,
        name: user.name,
      },
      chat: chatId,
      createdAt: new Date().toISOString(),
    };
    
    const messageForDB = {
      content: message,
      sender: user._id,
      chat: chatId,
    };

    const membersSocket = getSockets(members);
    io.to(membersSocket).emit(NEW_MESSAGE, {
      chatId,
      message: messageForRealTime,
    });

    io.to(membersSocket).emit(NEW_MESSAGE_ALERT, { chatId });

    try {
      await Message.create(messageForDB);
    } catch (error) {
      console.log(error);
    }
  });

  socket.on(START_TYPING, async({chatId, members}) => {
    console.log("start typing", chatId);

    const membersSockets = getSockets(members);
    socket.to(membersSockets).emit(START_TYPING, { chatId });
  });

  socket.on(STOP_TYPING, async({chatId, members}) => {
    console.log("stop typing", chatId);

    const membersSockets = getSockets(members);
    socket.to(membersSockets).emit(STOP_TYPING, {chatId});
  });

  socket.on(CHAT_JOINED, ({userId, members}) => {
    onlineUsers.add(userId.toString());
    
    const membersSockets = getSockets(members);
    io.to(membersSockets).emit(ONLINE_USERS, Array.from(onlineUsers));
  });

  socket.on(CHAT_LEAVED, ({userId, members}) => {
    onlineUsers.delete(userId.toString());

    const membersSockets = getSockets(members);
    io.to(membersSockets).emit(ONLINE_USERS, Array.from(onlineUsers));
  });

  socket.on("disconnect", () => {
    console.log("user disconnected");
    userSocketIDs.delete(user._id.toString());
    onlineUsers.delete(user._id.toString());
    socket.broadcast.emit(ONLINE_USERS, Array.from(onlineUsers));
  });
});

app.use(errorMiddleware);

server.listen(port, () => {
  console.log(`Sever is running on port: ${port} in ${envMode} Mode`);
});

export { envMode, adminSecretKey, userSocketIDs };