import { compare } from "bcrypt";
import { User } from "../models/user.model.js";
import { cookieOptions, emitEvent, sendToken, uploadFilesToCloudinary } from "../utils/features.js";
import { tryCatch } from "../middleware/error.js";
import { ErrorHandler } from "../utils/utility.js";
import { Chat } from "../models/chat.model.js";
import { Request } from "../models/request.model.js";
import { NEW_REQUEST, REFETCH_CHATS } from "../constants/events.js";
import { getOtherMember } from "../lib/helper.js";

// Create a new user and save it to the database and save token in cookie
const newUser = tryCatch(
  async (req, res) => {
    const { name, username, password, bio } = req.body;
  
    const file = req.file;
  
    if(!file) {
      return next(new ErrorHandler("Please upload avatar"));
    }

    const result = await uploadFilesToCloudinary([file]);

    const avatar = {
      public_id: result[0].public_id,
      url: result[0].url,
    };
  
    const user = await User.create({ name, username, password, avatar, bio });
  
    sendToken(res, user, 201, "User created successfully");
  }
);

// Login user and save token in cookie
const login = tryCatch(async (req, res, next) => {
  const { username, password } = req.body;

  const user = await User.findOne({ username }).select("+password");

  if (!user) return next(new ErrorHandler("Invalid Username or Password", 400));

  const isMatch = await compare(password, user.password);

  if (!isMatch) {
    return next(new ErrorHandler("Invalid Username or Password", 400));
  }

  sendToken(res, user, 200, `Welcome Back, ${user.username}`);
});

const getMyProfile = tryCatch(async (req, res, next) => {
  const user = await User.findById(req.userId);

  if (!user) return next(new ErrorHandler("User not found", 404));
  res.status(200).json({
    success: true,
    user,
  });
});

const logout = tryCatch(async (req, res) => {
  res
    .status(200)
    .cookie("chat-app-token", "", { ...cookieOptions, maxAge: 0 })
    .json({
      success: true,
      message: "Logged out successfully",
    });
});

const searchUser = tryCatch(async (req, res) => {
  const { name = "" } = req.query;

  // Finding All my chats
  const myChats = await Chat.find({
    groupChat: false,
    members: req.userId,
  });

  // extracting All users from my chat means friends or people i have chatted with
  const allUsersFromMyChats = myChats.flatMap((chat) => chat.members);

  // Find all users except me and my firends
  const allUsersExceptMeAndFriends = await User.find({
    _id: { $nin: allUsersFromMyChats },
    name: { $regex: name, $options: "i" },
  });

  // Modifying response
  const users = allUsersExceptMeAndFriends.map(({ _id, name, avatar }) => ({
    _id,
    name,
    avatar: avatar.url,
  }));

  res.status(200).json({
    success: true,
    users: allUsersExceptMeAndFriends,
  });
});

const sendFriendRequest = tryCatch(async (req, res, next) => {
  const { receiverId } = req.body;

  const request = await Request.findOne({
    $or: [
      { sender: req.userId, receiver: receiverId },
      { sender: receiverId, receiver: req.userId },
    ],
  });

  if (request) return next(new ErrorHandler("Request already sent", 400));

  await Request.create({
    sender: req.userId,
    receiver: receiverId,
  });

  emitEvent(req, NEW_REQUEST, [receiverId]);

  res.status(200).json({
    success: true,
    message: "Friend Request Sent",
  });
});

const acceptFriendRequest = tryCatch(async (req, res, next) => {
  const { requestId, isAccepted } = req.body;

  const request = await Request.findById(requestId)
    .populate("sender", "name")
    .populate("receiver", "name");

  if (!request) return next(new ErrorHandler("Request not found", 404));

  if (request.receiver._id.toString() !== req.userId.toString())
    return next(
      new ErrorHandler("You are not authorized to accept this request", 401)
    );

  if (!isAccepted) {
    await request.deleteOne();

    return res.status(200).json({
      success: true,
      message: "Friend Request Rejected",
    });
  }

  const members = [request.sender._id, request.receiver._id];

  await Promise.all([
    Chat.create({
      members,
      name: `${request.sender.name}-${request.receiver.name}`,
    }),
    request.deleteOne(),
  ]);

  emitEvent(req, REFETCH_CHATS, members);

  res.status(200).json({
    success: true,
    message: "Friend Request Accepted",
    senderId: request.sender._id,
  });
});

const getAllNotifications = tryCatch(async (req, res, next) => {
  const requests = await Request.find({ receiver: req.userId }).populate(
    "sender",
    "name avatar"
  );

  const allRequests = requests.map(({ _id, sender }) => ({
    _id,
    sender: {
      _id: sender._id,
      name: sender.name,
      avatar: sender.avatar.url,
    },
  }));

  return res.status(200).json({
    success: true,
    allRequests,
  });
});

const getMyFriends = tryCatch(async (req, res, next) => {
  const chatId = req.query.chatId;

  const chats = await Chat.find({
    members: req.userId,
    groupChat: false,
  }).populate("members", "name avatar");

  const friends = chats.map(({ members }) => {
    const otherUser = getOtherMember(members, req.userId);

    return {
      _id: otherUser._id,
      name: otherUser.name,
      avatar: otherUser.avatar.url,
    };
  });

  if (chatId) {

    const chat = await Chat.findById(chatId);

    const availalbleFriends = friends.filter((friend) => !chat.members.includes(friend._id));

    return res.status(200).json({
      success: true,
      friends: availalbleFriends,
    })
  } else {
    return res.status(200).json({
      success: true,
      friends,
    });
  }
});

export {
  login,
  newUser,
  getMyProfile,
  logout,
  searchUser,
  sendFriendRequest,
  acceptFriendRequest,
  getAllNotifications,
  getMyFriends,
};
