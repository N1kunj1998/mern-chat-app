import { adminSecretKey } from "../app.js";
import { CHAT_ADMIN_TOKEN, CHAT_APP_TOKEN } from "../constants/config.js";
import { User } from "../models/user.model.js";
import { ErrorHandler } from "../utils/utility.js";
import { tryCatch } from "./error.js";
import jwt from "jsonwebtoken";

const isAuthenticated = tryCatch(
    (req, res, next) => {
        const token = req.cookies[CHAT_APP_TOKEN];
    
        if(!token) return next(new ErrorHandler("Please login to access this route", 401));
    
        const decodedData = jwt.verify(token, process.env.JWT_SECRET);
    
        req.userId = decodedData._id;
    
        next();
    }
);

const adminOnly = (req, res, next) => {
    const token = req.cookies[CHAT_ADMIN_TOKEN];

    if(!token) return next(new ErrorHandler("Only Admin can access this route", 401));

    const secretKey = jwt.verify(token, process.env.JWT_SECRET);

    const isMatched = secretKey === adminSecretKey;

    if(!isMatched) return next(new ErrorHandler("Only Admin can access this route", 401));

    next();
}

const socketAuthenticator = async (err, socket, next) => {
    try {
        if(err) return next(new ErrorHandler(err, 401));

        const authToken = socket.request.cookies[CHAT_APP_TOKEN];

        if(!authToken) return next(new ErrorHandler("Please login to access this route", 401));

        const decodedData = jwt.verify(authToken, process.env.JWT_SECRET);

        const user =  await User.findById(decodedData._id);

        if(!user) return next(new ErrorHandler("Please login to access this route", 401));

        socket.user = user;
        return next();
    } catch (error) {
        console.log(error);
        return next(new ErrorHandler("Please login to access this route", 401));
    }
}

export { isAuthenticated, adminOnly, socketAuthenticator };