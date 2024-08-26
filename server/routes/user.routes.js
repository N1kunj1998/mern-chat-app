import express from "express";
import { acceptFriendRequest, getAllNotifications, getMyFriends, getMyProfile, login, logout, newUser, searchUser, sendFriendRequest } from "../controllers/user.controller.js";
import { singleAvatar } from "../middleware/multer.js";
import { isAuthenticated } from "../middleware/auth.js";
import { acceptRequestValidator, loginValidator, registerValidator, sendRequestValidator, validateHandler } from "../lib/validators.js";

const app = express.Router();

app.post("/new", singleAvatar, registerValidator(), validateHandler, newUser);
app.post("/login", loginValidator(), validateHandler, login);

// After herer user must be logged in to access this routes

app.use(isAuthenticated); // since we are using it here as middleware in all the routes below it will be passed

app.get("/me", getMyProfile); 
app.get("/logout", logout);
app.get("/search", searchUser);
app.put("/send-request", sendRequestValidator(), validateHandler, sendFriendRequest);
app.put("/accept-request", acceptRequestValidator(), validateHandler, acceptFriendRequest);
app.get("/notifications", getAllNotifications);
app.get("/friends", getMyFriends);

export default app;