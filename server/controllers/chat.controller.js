import { ALERT, NEW_ATTACHMENT, NEW_MESSAGE, NEW_MESSAGE_ALERT, REFETCH_CHATS } from "../constants/events.js";
import { getOtherMember } from "../lib/helper.js";
import { tryCatch } from "../middleware/error.js";
import { Chat } from "../models/chat.model.js";
import { Message } from "../models/message.model.js";
import { User } from "../models/user.model.js";
import { deleteFilesFromCloudinary, emitEvent, uploadFilesToCloudinary } from "../utils/features.js";
import { ErrorHandler } from "../utils/utility.js";

const newGroupChat = tryCatch(async (req, res, next) => {
  const { name, members } = req.body;

  if (members.length < 2)
    return next(
      new ErrorHandler("Group chat must have atleast 2 members", 400)
    );

  const allMembers = [...members, req.userId];

  await Chat.create({
    name,
    groupChat: true,
    creator: req.userId,
    members: allMembers,
  });

  emitEvent(req, ALERT, allMembers, `Welcome to ${name} group`);
  emitEvent(req, REFETCH_CHATS, members);

  return res.status(201).json({
    success: true,
    message: "Group created",
  });
});

const getMyChats = tryCatch(async (req, res, next) => {
  const chats = await Chat.find({ members: req.userId }).populate(
    "members",
    "name avatar"
  );

  const transformedChats = chats.map(({ _id, name, members, groupChat }) => {
    const otherMember = getOtherMember(members, req.userId);

    return {
      _id,
      groupChat,
      avatar: groupChat
        ? members.slice(0, 3).map(({ avatar }) => avatar.url)
        : [otherMember.avatar.url],
      name: groupChat ? name : otherMember.name,
      members: members.reduce((acc, curr) => {
        if (curr._id.toString() !== req.userId.toString()) {
          acc.push(curr._id);
        }
        return acc;
      }, []),
    };
  });

  return res.status(200).json({
    success: true,
    chats: transformedChats,
  });
});

const getMyGroups = tryCatch(async (req, res, next) => {
  const chats = await Chat.find({
    members: req.userId,
    groupChat: true,
    creator: req.userId,
  }).populate("members", "name avatar");

  console.log(chats);

  const groups = chats.map(({ members, _id, groupChat, name }) => ({
    _id,
    groupChat,
    name,
    avatar: members.slice(0, 3).map(({ avatar }) => avatar.url),
  }));

  return res.status(200).json({
    success: true,
    groups,
  });
});

const addMembers = tryCatch(async (req, res, next) => {
  const { chatId, members } = req.body;

  if (!members || members.length < 1)
    return next(new ErrorHandler("Please provide members", 400));

  const chat = await Chat.findById(chatId);

  if (!chat) return next(new ErrorHandler("Chat not found", 404));

  if (!chat.groupChat)
    return next(new ErrorHandler("This is not a group chat", 400));

  if (chat.creator.toString() !== req.userId.toString())
    return next(new ErrorHandler("You are not allowed to add members", 403));

  const allNewMembersPromise = members.map((i) => User.findById(i, "name"));

  const allNewMembers = await Promise.all(allNewMembersPromise);

  const redundantMember = [];

  const uniqueMembersId = allNewMembers
    .filter((i) => {
      if (chat.members.includes(i._id.toString())) {
        redundantMember.push(i.name);
      }
      return !chat.members.includes(i._id.toString());
    })
    .map((i) => i._id);

  if (redundantMember.length > 0) {
    return next(
      new ErrorHandler(
        `users: ${redundantMember.join(", ")} are already member of group`,
        400
      )
    );
  }

  chat.members.push(...uniqueMembersId);

  if (chat.members.length > 100)
    return next(new ErrorHandler("Group members limit reached", 400));

  await chat.save();

  const allUsersName = allNewMembers.map((i) => i.name).join(", ");

  emitEvent(
    req,
    ALERT,
    chat.members,
    `${allUsersName} has been added in the group`
  );

  emitEvent(req, REFETCH_CHATS, chat.members);

  return res.status(200).json({
    success: true,
    message: "members added successfully",
  });
});

const removeMember = tryCatch(async (req, res, next) => {
  const { userId, chatId } = req.body;

  if (!userId || !chatId)
    return next(new ErrorHandler("Please provide both userId and chatId", 400));

  const [chat, usersThatWillBeRemoved] = await Promise.all([
    Chat.findById(chatId),
    User.findById(userId, "name"),
  ]);

  if (!chat) return next(new ErrorHandler("Chat not found", 404));

  if (!chat.groupChat)
    return next(new ErrorHandler("This is not a group chat", 400));

  if (chat.creator.toString() !== req.userId.toString())
    return next(new ErrorHandler("You are not allowed to add members", 403));

  if (chat.members.length <= 3)
    return next(new ErrorHandler("Group mush have at least 3 members", 400));

  const allChatMembers = chat.members.map((i) => i.toString());

  chat.members = chat.members.filter(
    (member) => member.toString() !== userId.toString()
  );

  await chat.save();

  emitEvent(
    req,
    ALERT,
    chat.members,
    {
      message: `${usersThatWillBeRemoved.name} has been removed from the group`,
      chatId
    }
  );

  emitEvent(req, REFETCH_CHATS, allChatMembers);

  return res.status(200).json({
    success: true,
    message: "Member removed successfully",
  });
});

const leaveGroup = tryCatch(async (req, res, next) => {
  const chatId = req.params.id;

  const chat = await Chat.findById(chatId);

  if (!chat) return next(new ErrorHandler("Chat not found", 404));

  if (!chat.groupChat)
    return next(new ErrorHandler("This is not a group chat", 400));

  if (chat.members.length < 3)
    return next(new ErrorHandler("Group mush have at least 3 members", 400));

  const remainingMembers = chat.members.filter(
    (member) => member.toString() !== req.userId.toString()
  );

  // if length of members and remaining members are same it means that you are not present in this group
  if (remainingMembers.length === chat.members.length)
    return next(new ErrorHandler("You are not present in this group", 400));

  if (chat.creator.toString() === req.userId.toString()) {
    const randomIndex = Math.floor(Math.random() * remainingMembers.length);
    const newCreator = remainingMembers[randomIndex];

    chat.creator = newCreator;
  }

  chat.members = remainingMembers;

  const [user] = await Promise.all([
    User.findById(req.userId, "name"),
    chat.save(),
  ]);

  emitEvent(req, ALERT, chat.members, {
    message: `User ${user.name} has left the group`, 
    chatId
  });

  return res.status(200).json({
    success: true,
    message: "Group left successfully",
  });
});

const sendAttachments = tryCatch(async (req, res, next) => {

    const { chatId } = req.body;

    const files = req.files || [];

    console.log(files);
    
    if(files.length < 1) return next(new ErrorHandler("Please provide attachments", 400));
    if(files.length > 5) return next(new ErrorHandler("Files can't be more than 5", 400));

    const [chat, currentUser] = await Promise.all([Chat.findById(chatId), User.findById(req.userId, "name")]);

    if (!chat) return next(new ErrorHandler("Chat not found", 404));

    // Upload files here
    const attachments = await uploadFilesToCloudinary(files);
    
    const messageForDB = { content: "", attachments, sender: currentUser._id, chat: chatId };
    
    const messageForRealTime = { ...messageForDB, sender: { _id: currentUser._id, name: currentUser.name } };
    
    const message = await Message.create(messageForDB);

    emitEvent(req, NEW_MESSAGE, chat.members, {
        message: messageForRealTime,
        chatId,
    });

    emitEvent(req, NEW_MESSAGE_ALERT, chat.members, { chatId });

    return res.status(200).json({
        success: true,
        message,
    });
});

const getChatDetails = tryCatch(async(req, res, next) => {
  if(req.query.populate === "true") {
    console.log("populate");
    const chat = await Chat.findById(req.params.id).populate("members", "name avatar").lean();
    
    if (!chat) return next(new ErrorHandler("Chat not found", 404));

    chat.members = chat.members.map(({ _id, name, avatar}) => ({
      _id,
      name,
      avatar,
    }));

    return res.status(200).json({
      success: true,
      chat,
    });
  } else {
    console.log("not populate");
    const chat = await Chat.findById(req.params.id);

    if (!chat) return next(new ErrorHandler("Chat not found", 404));
    
    return res.status(200).json({
      success: true,
      chat,
    });
  }
});

const renameGroup = tryCatch(async(req, res, next) => {
  const chatId = req.params.id;
  const { name } = req.body;

  const chat = await Chat.findById(chatId);

  if(!chat) return next(new ErrorHandler("Chat not found", 404));

  if(!chat.groupChat) return next(new ErrorHandler("This is not a group chat", 400));

  if(chat.creator.toString() !== req.userId.toString())
    return next(new ErrorHandler("You are not allowed to rename the group", 403));
  
  chat.name = name;

  await chat.save();

  emitEvent(req, REFETCH_CHATS, chat.members);

  return res.status(200).json({
    success: true,
    message: "Group Renamed Successfully",
  });
});

const deleteChat = tryCatch(async(req, res, next) => {
  const chatId = req.params.id;

  const chat = await Chat.findById(chatId);

  if(!chat) return next(new ErrorHandler("Chat not found", 404));

  const members = chat.members;

  if(chat.groupChat && chat.creator.toString() !== req.userId.toString())
    return next(new ErrorHandler("You are not allowed to delete the group", 403));

  if(!chat.groupChat && !chat.members.includes(req.userId.toString()))
    return next(new ErrorHandler("You are not member of this chat", 403));

  // Here we have to delete all messages and attachments or files from cloudinary

  const messagesWithAttachments = await Message.find({
    chat: chatId,
    attachments: { $exists: true, $ne: []},
  });

  const public_ids = [];

  messagesWithAttachments.forEach(({attachments}) => 
    attachments.forEach(({public_id}) => public_ids.push(public_id))
  );

  await Promise.all([
    deleteFilesFromCloudinary(public_ids),
    Chat.deleteOne({_id: chatId}),
    Message.deleteMany({ chat: chatId})
  ]);

  emitEvent(req, REFETCH_CHATS, members);

  return res.status(200).json({
    success: true,
    message: "Chat deleted successfully"
  });
});

const getMessages = tryCatch(async(req, res, next) => {
  const chatId = req.params.id;
  const { page = 1 } = req.query;
  
  const resultPerPage = 20;
  const skip = (page - 1) * resultPerPage;
  
  const chat = await Chat.findById(chatId);

  if(!chat) return next(new ErrorHandler("Chat not found", 404));

  if(!chat.members.includes(req.userId.toString())) return next( new ErrorHandler("You are not allowed to access this chat", 403));
  
  const [messages, totalMessagesCount] = await Promise.all([
    Message.find({chat: chatId})
    .sort({createdAt: -1})
    .skip(skip)
    .limit(resultPerPage)
    .populate("sender", "name")
    .lean(),
    Message.countDocuments({chat: chatId}),
  ]);
  
  const totalPages = Math.ceil(totalMessagesCount / resultPerPage) || 0;

  return res.status(200).json({
    success: true,
    messages: messages.reverse(),
    totalPages,
  })
});

export {
  addMembers, deleteChat, getChatDetails, getMessages, getMyChats,
  getMyGroups, leaveGroup, newGroupChat, removeMember, renameGroup, sendAttachments
};

