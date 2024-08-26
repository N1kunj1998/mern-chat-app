import express from "express";
import { isAuthenticated } from "../middleware/auth.js";
import {
  addMembers,
  deleteChat,
  getChatDetails,
  getMessages,
  getMyChats,
  getMyGroups,
  leaveGroup,
  newGroupChat,
  removeMember,
  renameGroup,
  sendAttachments,
} from "../controllers/chat.controller.js";
import { attachmentsMulter } from "../middleware/multer.js";
import {
  addMembersValidator,
  chatIdValidator,
  newGroupChatValidator,
  removeMembersValidator,
  renameValidator,
  sendAttachmentsValidator,
  validateHandler,
} from "../lib/validators.js";

const app = express.Router();

// After herer user must be logged in to access this routes

app.use(isAuthenticated); // since we are using it here as middleware in all the routes below it will be passed

app.post("/new", newGroupChatValidator(), validateHandler, newGroupChat);
app.get("/my", getMyChats);
app.get("/my/groups", getMyGroups);
app.put("/addMembers", addMembersValidator(), validateHandler, addMembers);
app.put(
  "/removeMember",
  removeMembersValidator(),
  validateHandler,
  removeMember
); // Since we are technically only modifying members array this is a put request not delete
app.delete("/leave/:id", chatIdValidator(), validateHandler, leaveGroup);

// Send Attachments
app.post(
  "/message",
  attachmentsMulter,
  sendAttachmentsValidator(),
  validateHandler,
  sendAttachments
);

// Get Messages
app.get("/message/:id", chatIdValidator(), validateHandler, getMessages);

// Dynamic routes like /:id should be kept at last else other request will match with this and create issue.
// Get Chat Details, rename, delete
app
  .route("/:id")
  .get(chatIdValidator(), validateHandler, getChatDetails)
  .put(renameValidator(), validateHandler, renameGroup)
  .delete(chatIdValidator(), validateHandler,deleteChat);

export default app;

